import { GetAccountWithTransactions } from "@/actions/accounts";
import AccountChart from "@/components/AccountChart";
import TransactionTable from "@/components/TransactionTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";

const Account = async ({ params }) => {
  const { id } = await params;
  // const [open, setOpen] = useState(false);
  // const [transactionToDelete, setTransactionToDelete] = useState(null);
  // const [deletefn, setDeleteFn] = useState(null);

  const accountData = await GetAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-8 px-5">
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
            {/* <Button  className={"bg-red-600 hover:bg-red-500 hover:cursor-pointer"}>
            <Trash className="text-white h-8 w-8"/>
            </Button> */}

<Dialog>
  <DialogTrigger asChild>
    <Button className="bg-red-600 hover:bg-red-500 hover:cursor-pointer p-2 rounded">
      <Trash className="text-white h-5 w-5" />
    </Button>
  </DialogTrigger>

  <DialogContent className="flex flex-col items-center gap-4">
    <DialogTitle>Are you sure?</DialogTitle>
    <p className="text-sm text-muted-foreground">
      You want to delete this account?
    </p>

    {/* Buttons for cancel and confirm actions */}
    <div className="flex justify-between mt-4 w-full px-4">
      {/* Cancel Button (Closes the Dialog) */}
      <DialogTrigger asChild>
        <Button variant="outline" className="px-4 py-2 hover:cursor-pointer" >
          Cancel
        </Button>
      </DialogTrigger>

      {/* Confirm Button (Trigger the delete action) */}
      <Button className="bg-red-600 hover:bg-red-500 px-4 py-2 text-white hover:cursor-pointer">
        Confirm
      </Button>
    </div>
  </DialogContent>
</Dialog>

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

     

    </div>
  );
};

export default Account;
