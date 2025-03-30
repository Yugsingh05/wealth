"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeDecimal = (obj) => {
    const serialized = { ...obj };
    if (obj.balance) {
        serialized.balance = obj.balance.toNumber();
    }
    if (obj.amount) {
        serialized.amount = obj.amount.toNumber();
    }
    return serialized;
};

export async function UpdateDefaultAccount(accountId) {
    try {

        const { userId } = await auth();

        if (!userId) throw new Error('Unauthorized');

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        await db.account.updateMany({
            where: {
                userId: user.id,
                isDefault: true,
            },
            data: { isDefault: false }
        })


        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id
            },
            data: {
                isDefault: true
            }
        })

        revalidatePath('/dashboard')
        return { success: true, data: serializeDecimal(account) };

    } catch (error) {

        return { success: false, error: error.message };

    }
}


export async function GetAccountWithTransactions(accountId) {

    const { userId } = await auth();

    if (!userId) throw new Error('Unauthorized');

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const account = await db.account.findUnique({
        where: {
            id: accountId,
            userId: user.id
        },
        include: {
            transactions: {
                orderBy: { date: "desc" },
            },
            _count: {
                select: { transactions: true }
            },
           
        }
    });

    if (!account) return null;

    console.log("account", account.isDefault);

    return {
        ...serializeDecimal(account),
        transactions: account.transactions.map((transaction) => serializeDecimal(transaction)),
        isDefault: account.isDefault
    }

}

export async function bulkDeleteTransactions(transactionIds) {
    try {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
  
      const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
  
      if (!user) throw new Error("User not found");
  
      // Get transactions to calculate balance changes
      const transactions = await db.transaction.findMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });
  
      // Group transactions by account to update balances
      const accountBalanceChanges = transactions.reduce((acc, transaction) => {
        // Convert the transaction amount to a number using parseFloat or Number
        const amount = Number(transaction.amount);
        // Determine the change (expense adds positive change; income subtracts)
        const change = transaction.type === "EXPENSE" ? amount : -amount;
      
        // Ensure we're summing as numbers
        acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
        return acc;
      }, {});
      
      // Delete transactions and update account balances in a transaction
      await db.$transaction(async (tx) => {
        // Delete transactions
        await tx.transaction.deleteMany({
          where: {
            id: { in: transactionIds },
            userId: user.id,
          },
        });
  
        // Update account balances
        for (const [accountId, balanceChange] of Object.entries(
          accountBalanceChanges
        )) {
          await tx.account.update({
            where: { id: accountId },
            data: {
              balance: {
                increment: balanceChange,
              },
            },
          });
        }
      });
  
      revalidatePath("/dashboard");
      revalidatePath("/account/[id]");
  
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  export async function DeleteAccount(accountId) {
    try {

      const account = await db.account.findUnique({
        where: { id: accountId },
      });
  
      if (!account) throw new Error("Account not found");
  
      await db.account.delete({
        where: { id: accountId },
      });
  
      revalidatePath("/dashboard");
  
      return { success: true };
      
    } catch (error) {
      
    }
  }