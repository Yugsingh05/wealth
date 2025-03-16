
import { db } from "../prisma";
import { inngest } from "./client";

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


