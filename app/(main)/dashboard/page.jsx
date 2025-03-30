"use client";

import { getCurrentBudget } from "@/actions/budget";
import { getDashboardData, GetUserAccounts } from "@/actions/dashboard";
import AccountCard from "@/components/AccountCard";
import BudgetProcess from "@/components/BudgetProcess";
import CreateAccountDrawer from "@/components/CreateAccountDrawer";
import DashBoardOverview from "@/components/DashBoardOverview";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2Icon, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const DashBoardPage = () => {

  const [accounts, setAccounts] = useState([]);
  const [budgetData, setBudgetData] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [loading,setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAccounts = await GetUserAccounts();
      setAccounts(fetchedAccounts?.data || []);

      const fetchedTransactions = await getDashboardData();
      setTransactions(fetchedTransactions || []);

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const defaultAccount = accounts.find((account) => account.isDefault);
      if (defaultAccount) {
        const fetchedBudget = await getCurrentBudget(defaultAccount.id);
        setBudgetData(fetchedBudget);
      }
    };

    fetchData();
  },[accounts]);




  if(loading)  return (
    <div className="flex flex-col items-center justify-center h-[420px] w-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 mx-auto mt-[10%] rounded-3xl md:w-1/2">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-300 dark:border-gray-700 rounded-full animate-ping"></div>
        <Loader2Icon className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
      <p className="mt-4 text-lg font-semibold">Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="space-y-8" >

      <BudgetProcess initialBudget = {budgetData?.budget} currentExpenses={budgetData?.currentExpenses || 0}/>

      <DashBoardOverview
        accounts={accounts}
        transactions={transactions || []}
      />


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer setAccounts={setAccounts}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>

        {accounts?.length > 0 && accounts.map((account)  => (
          <AccountCard key={account.id} account={account} setAccounts={setAccounts} />
        ))}
      </div>
    </div>
  );
};

export default DashBoardPage;
