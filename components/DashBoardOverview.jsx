"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';


// const COLORS = [
//     "#FF5733", // Vibrant Orange
//     "#36A2EB", // Bright Blue
//     "#4CAF50", // Fresh Green
//     "#FFC107", // Warm Yellow
//     "#9C27B0", // Rich Purple
//     "#FF9800", // Soft Orange
//     "#03A9F4", // Sky Blue
//   ];

  import { Pie } from 'react-chartjs-2';
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
  
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  export function PieChartComponent({ pieChartData }) {
    const data = {
      labels: pieChartData.map((item) => item.name),
      datasets: [
        {
          data: pieChartData.map((item) => item.value),
          backgroundColor: [
            '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000', '#00c49f'
          ],
          hoverOffset: 4,
        },
      ],
    };
  
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              return `${tooltipItem.label}: ₹${tooltipItem.raw}`;
            },
          },
        },
      },
    };
  
    return (
      <div className="w-full h-[400px] bg-white rounded-2xl shadow-lg p-4">
        <Pie data={data} options={options}  className='mx-auto'/>
      </div>
    );
  }

const DashBoardOverview = ({accounts,transactions}) => {

    console.log("accounts",accounts);
    const [selectedAccountId, setSelectedAccountId] = useState(
        accounts.find((a) => a.isDefault)?.id || accounts.data[0]?.id
      );
    

    const accountTransactions = transactions.filter(
        (t) => t.accountId === selectedAccountId
    )

    const recentTransactions = accountTransactions.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,5);

    const currentDate = new Date();
    const currentMonthExpenses = accountTransactions.filter((t) => {
        const transactionDate = new Date(t.date);
        return (
          t.type === "EXPENSE" &&
          transactionDate.getMonth() === currentDate.getMonth() &&
          transactionDate.getFullYear() === currentDate.getFullYear()
        );
      });

      const expensesByCategory = currentMonthExpenses.reduce((acc, transaction) => {
        const category = transaction.category;
        if(!acc[category]){
            acc[category] = 0;
        }
      
        acc[category] += transaction.amount;
        return acc;
      }, {}); // Add an empty object as the initial value

      const pieChartData = Object.entries(expensesByCategory).map(([category,amount]) => ({
        name : category,
        value : amount
      }));


  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Transactions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-normal">
            Recent Transactions
          </CardTitle>
          <Select
            value={selectedAccountId}
            onValueChange={setSelectedAccountId}
          >
            <SelectTrigger className="w-[140px] cursor-pointer">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id} className={"cursor-pointer"}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No recent transactions
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.date), "PP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center",
                        transaction.type === "EXPENSE"
                          ? "text-red-500"
                          : "text-green-500"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      )}
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal">
            Monthly Expense Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No expenses this month
            </p>
          ) : (
            <div className="h-[300px] overflow-auto " style={{
                scrollbarWidth:"none"
            }}>
             <PieChartComponent pieChartData={pieChartData} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashBoardOverview;