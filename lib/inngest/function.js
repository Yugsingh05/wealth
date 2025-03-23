
import { sendEmail } from "@/actions/send-emails";
import { db } from "../prisma";
import { inngest } from "./client";
import EmailTemplate from "@/emails/template";


function isNewMonth(lastAlertDate, currentDate) {
    if (!lastAlertDate) return true;
    return (
        lastAlertDate.getMonth() !== currentDate.getMonth() ||
        lastAlertDate.getFullYear() !== currentDate.getFullYear()
    );
}

export const checkBudgetAlerts = inngest.createFunction(
    { name: "Check Budget Alerts" },
    { cron: "0 */6 * * *" }, // Every 6 hours
    async ({ step }) => {
        const budgets = await step.run("fetch-budgets", async () => {
            return await db.budget.findMany({
                include: {
                    user: {
                        include: {
                            accounts: {
                                where: {
                                    isDefault: true,
                                },
                            },
                        },
                    },
                },
            });
        });

        for (const budget of budgets) {
            const defaultAccount = budget?.user?.accounts?.[0] || null;
            if (!defaultAccount) continue; // Skip if no default account

            await step.run(`check-budget-${budget.id}`, async () => {
                const startDate = new Date();
                startDate.setDate(1); // Start of current month

                const startOfMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
                const endOfMonth = new Date(
                    startDate.getFullYear(),
                    startDate.getMonth() + 1,
                    0
                );

                // Calculate total expenses for the default account only
                const expenses = await db.transaction.aggregate({
                    where: {
                        userId: budget.userId,
                        accountId: defaultAccount.id, // Only consider default account
                        type: "EXPENSE",
                        date: {
                            gte: startOfMonth,
                            lte: endOfMonth
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                });

                const totalExpenses = expenses._sum.amount?.toNumber() || 0;
                const budgetAmount = budget.amount;
                const percentageUsed = budgetAmount > 0
                    ? (totalExpenses / budgetAmount) * 100
                    : 0;

                console.log(`Budget ID: ${budget.id}, Total Expenses: ${totalExpenses}, Percentage Used: ${percentageUsed}%`);

                // Check if we should send an alert
                if (
                    percentageUsed >= 80 && // Default threshold of 80%
                    (!budget.lastAlertSent ||
                        isNewMonth(new Date(budget.lastAlertSent), new Date()))
                ) {

                    console.log("email", budget.user.email);

                    const res = await sendEmail({
                        to: "singhyug131@gmail.com",
                        subject: `Budget Alert for ${defaultAccount.name}`,
                        react: EmailTemplate({
                            userName: budget.user.name,
                            type: "budget-alert",
                            data: {
                                percentageUsed,
                                budgetAmount: parseInt(budgetAmount).toFixed(1),
                                totalExpenses: parseInt(totalExpenses).toFixed(1),
                            },
                        }),
                    })

                    console.log("res", res);
                    // Update last alert sent
                    await db.budget.update({
                        where: { id: budget.id },
                        data: { lastAlertSent: new Date() },
                    });
                }
            });
        }
    }
);

export const triggerRecurringTransactions = inngest.createFunction(
    {
      id: "trigger-recurring-transactions", // Unique ID,
      name: "Trigger Recurring Transactions",
    },
    { cron: "0 0 * * *" }, // Daily at midnight
    async ({ step }) => {
      const recurringTransactions = await step.run(
        "fetch-recurring-transactions",
        async () => {
          return await db.transaction.findMany({
            where: {
              isRecurring: true,
              status: "COMPLETED",
              OR: [
                { lastProcessed: null },
                {
                    nextTransactionDate: {
                    lte: new Date(),
                  },
                },
              ],
            },
          });
        }
      );
  
      // Send event for each recurring transaction in batches
      if (recurringTransactions.length > 0) {
        const events = recurringTransactions.map((transaction) => ({
          name: "transaction.recurring.process",
          data: {
            transactionId: transaction.id,
            userId: transaction.userId,
          },
        }));
  
        // Send events directly using inngest.send()
        await inngest.send(events);
      }
  
      return { triggered: recurringTransactions.length };
    }
  );
  


export const processRecurringTransactions =inngest.createFunction(
    {
      id: "process-recurring-transaction",
      name: "Process Recurring Transaction",
      throttle: {
        limit: 10, // Process 10 transactions
        period: "1m", // per minute
        key: "event.data.userId", // Throttle per user
      },
    },
    { event: "transaction.recurring.process" },
    async ({ event, step }) => {
      // Validate event data
      if (!event?.data?.transactionId || !event?.data?.userId) {
        console.error("Invalid event data:", event);
        return { error: "Missing required event data" };
      }
  
      await step.run("process-transaction", async () => {
        const transaction = await db.transaction.findUnique({
          where: {
            id: event.data.transactionId,
            userId: event.data.userId,
          },
          include: {
            account: true,
          },
        });
  
        if (!transaction || !isTransactionDue(transaction)) return;
  
        // Create new transaction and update account balance in a transaction
        await db.$transaction(async (tx) => {
          // Create new transaction
          await tx.transaction.create({
            data: {
              type: transaction.type,
              amount: transaction.amount,
              description: `${transaction.description} (Recurring)`,
              date: new Date(),
              category: transaction.category,
              userId: transaction.userId,
              accountId: transaction.accountId,
              isRecurring: false,
            },
          });
  
          // Update account balance
          const balanceChange =
            transaction.type === "EXPENSE"
              ? -transaction.amount.toNumber()
              : transaction.amount.toNumber();

              console.log("error find" ,  await calculateNextRecurringDate(
                new Date(),
                transaction.recurringInterval
              ),)
  
          await tx.account.update({
            where: { id: transaction.accountId },
            data: { balance: { increment: balanceChange } },
          });
  
          // Update last processed date and next recurring date
          await tx.transaction.update({
            where: { id: transaction.id },
            data: {
              lastProcessed: new Date(),
              nextTransactionDate:await calculateNextRecurringDate(
                new Date(),
                transaction.recurringInterval
              ),
            },
          });
        });
      });
    }
  );

 
function isTransactionDue(transaction) {
    // If no lastProcessed date, transaction is due
    if (!transaction.lastProcessed) return true;

    const today = new Date();
    const nextDue = new Date(transaction.nextTransactionDate);

    // Compare with nextDue date
    return nextDue <= today;
}

async function calculateNextRecurringDate(startDate, interval) {
    const date = new Date(startDate);
  
    switch (interval) {
      case "DAILY":
        date.setDate(date.getDate() + 1);
        break;
      case "WEEKLY":
        date.setDate(date.getDate() + 7);
        break;
      case "MONTHLY":
        date.setMonth(date.getMonth() + 1);
        break;
      case "YEARLY":
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
  
    return date;
  }
