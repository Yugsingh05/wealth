"use client"

import UseFetch from '@/hooks/use-fetcch';
import React, { useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { Switch } from './ui/switch';
import { ArrowDownRight, ArrowUpRight, Loader2 } from 'lucide-react';
import { UpdateDefaultAccount } from '@/actions/accounts';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';


const AccountCard = ({account}) => {

    const {name,type,balance , id , isDefault} = account;

    const {  loading: updateDefaultLoading,
        fn: updateDefaultFn,
        data: updatedAccount,
        error} = UseFetch(UpdateDefaultAccount)

        const handleDefaultChange = async (e) => {
            e.preventDefault();

            if(isDefault){
                toast.warning("You need to atleast 1 default account");
                return;
            }

            await updateDefaultFn(id);
        }

        useEffect(() => {
            if (updatedAccount?.success) {
              toast.success("Default account updated successfully",{
                position:"top-right"
              });
            }
          }, [updatedAccount]);
        
          useEffect(() => {
            if (error) {
              toast.error(error.message || "Failed to update default account" , {
                position:"top-right"
              });
            }
          }, [error]);
  return (
    <>
    <Card className={"hover:shadow-md transition-shadow cursor-pointer group relative"}>
        <Link href={`/account/${id}${isDefault ? "?default=true" : ""}`}>
        <CardHeader className={"flex flex-row items-center justify-between space-y-0 pb-2"}>
            <CardTitle className={"text-sm font-medium capitalize"}>
                {name}
            </CardTitle>
          
            <Switch
            className={"cursor-pointer"}
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled = {updateDefaultLoading}
            />
        
        </CardHeader>

        <CardContent>
            <div className='text-2xl font-bold'>
            ₹{parseFloat(balance).toFixed(2)}
            </div>
            <p className='text-xs text-muted-foreground'>
                {type.charAt(0) + type.slice(1).toLowerCase()} Account
            </p>

        </CardContent>

        <CardFooter className={"flex justify-between text-sm text-muted-foreground"}>

            <div className='flex items-center'>
                <ArrowUpRight className='mr-1 h-4 w-4 text-green-500'/>
                Income

            </div>

            <div className='flex items-center'>
                <ArrowDownRight className='mr-1 h-4 w-4 text-red-500'/>
                Expense

            </div>
        </CardFooter>
        </Link>
    </Card>

    <Dialog open={updateDefaultLoading}>
    <DialogContent className="flex flex-col items-center gap-4">
        <DialogTitle>
            <VisuallyHidden>Updating Account</VisuallyHidden>
        </DialogTitle>

        <Loader2 className='animate-spin h-8 w-8 text-blue-500' />
        <p className='text-sm text-muted-foreground'>Updating default account...</p>
    </DialogContent>
</Dialog>



    </>

    
  )
}

export default AccountCard