"use client";

import { DeleteAccount, GetAccountWithTransactions } from "@/actions/accounts";
import AccountChart from "@/components/AccountChart";
import AccountDeleteDialog from "@/components/AccountDeleteDialog";
import TransactionTable from "@/components/TransactionTable";
import { LoaderCircle } from "lucide-react";
import { notFound, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";

const Account =  ({ params }) => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteAcccountLoading, setDeleteAcccountLoading] = useState(false);
  const { id } = React.use(params);
  // const searchParams = useSearchParams();
  // const isDefault = searchParams.get("default") === "true";

  console.log("isDefault", accountData?.isDefault);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await GetAccountWithTransactions(id);
        if (!data) {
          notFound();
        }
        console.log("data", data);
        setAccountData(data);
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeleteAccount = async () => {
    setDeleteAcccountLoading(true);
    try {
      console.log("deleting account id", id);
     const res =  await DeleteAccount(id);
      // Navigate to accounts list or home page after deletion
      console.log("res", res);
      if(res.success){
        setDeleteAcccountLoading(false);
        toast.success("Account deleted successfully",{
          position:"top-right"
        });
        window.location.href = "/dashboard";
      }
    
    } catch (error) {
      setDeleteAcccountLoading(false);
      toast.error(error.message,{
        position:"top-right"
      });
      console.error("Error deleting account:", error);
    }
  };

  if (loading) {
    return <BarLoader className="mt-4" width={"100%"} color="#9333ea" />;
  }

  if (!accountData) {
    return <div>Account not found</div>;
  }

  const { transactions, ...account } = accountData;

  // if(true){
  //   return 
  // }

  return (
    <div className="space-y-8 px-5">

      {deleteAcccountLoading ? <LoaderCircle className=" h-10 my-auto mx-auto animate-spin" width={"100%"} color="#9333ea" /> : 

      <>
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {account.name}
          </h1>
          <p className="text-muted-foreground">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="flex gap-4 items-center">
            <div className="text-xl sm:text-2xl font-bold">
              ₹{parseFloat(account.balance).toFixed(2)}
            </div>
            <AccountDeleteDialog handleDeleteAccount={handleDeleteAccount} isDefault={accountData?.isDefault} />
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
      </>

  }
    </div>
  );
};

export default Account;