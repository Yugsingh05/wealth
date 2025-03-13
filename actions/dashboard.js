"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serialLizeTransaction = (obj) => {
    const serialized = {...obj};

    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }

    if(obj.amount){
        serialized.amount = obj.amount.toNumber();
    }

    return serialized;
}


export async function CreateAccount(data) {

    try {

        const { userId } = await auth();

        if (!userId) throw new Error('Unauthorized');

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if (!user) throw new Error('User not found');

        const balanceFloat = parseFloat(data.balance);

        if (isNaN(balanceFloat)) throw new Error('Invalid balance amount');

        const existingAccounts = await db.account.findMany({
            where: {
                userId: user.id
            }
        });

        const shouldBeDefault = existingAccounts.lenght === 0 ? true : data.isDefault;

        if (shouldBeDefault) {
            await db.account.updateMany({
                where: {
                    userId: user.id, isDefault: true
                },
                data: {
                    isDefault: false
                }
            })
        }

        const account = await db.account.create({
            data: {
                ...data,
                userId: user.id,
                balance: balanceFloat,
                isDefault: shouldBeDefault
            }
        });

        const serialLizedAccount =  serialLizeTransaction(account);

        revalidatePath(`/dashboard`);

        return  {success : true, data : serialLizedAccount};
    } catch (error) {

        throw new Error(error.message);
    }

}


export async function GetUserAccounts(){
    const { userId } = await auth();

        if (!userId) throw new Error('Unauthorized');

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if (!user) throw new Error('User not found');

        try {
            const accounts = await db.account.findMany({
                where : {userId : user.id},
                orderBy : {createAt : 'desc'},
                include : {
                    _count :{
                        select : {
                            transactions : true,
                        }
                    }
                }
            })

            const serializedAccounts = accounts.map((account) => serialLizeTransaction(account))
            return {success : true, data : serializedAccounts};
        } catch (error) {

            console.log(error);
            
        }
}