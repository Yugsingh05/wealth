"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/categories";
import { Badge } from "./ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { bulkDeleteTransactions } from "@/actions/accounts";
import UseFetch from "@/hooks/use-fetcch";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { DeleteDialog } from "./DeleteDialog";

const RECURRING_OPTIONS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {

  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm,setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [open,setOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const router = useRouter();

  const filterdAndSortedTransactions = useMemo(() => {

    let result = [...transactions];

    if(searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>transaction.description?.toLowerCase().includes(searchLower))
    }

    if(typeFilter){
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    if(recurringFilter){
      result = result.filter((transaction) => {
        if(recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      })
    }

    result.sort((a,b) => {
      let commparison = 0;

      if(sortConfig.field === "date"){
        commparison = new Date(a.date) - new Date(b.date);
      }

      else if(sortConfig.field === "amount"){
        commparison = a.amount - b.amount;
      }
      else if (sortConfig.field === "category") {
        commparison = a.category.localeCompare(b.category); 
      }

      else {
        commparison =0
      }

      return sortConfig.direction === "asc" ? commparison : -commparison;
    });

    return result;

  },[
    transactions,searchTerm,typeFilter,recurringFilter,sortConfig
  ]);

  const handleSelect = (id) => {
    selectedIds.includes(id)
      ? setSelectedIds((current) => current.filter((i) => i !== id))
      : setSelectedIds((currentIds) => [...currentIds, id]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filterdAndSortedTransactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(
        filterdAndSortedTransactions.map((transaction) => transaction.id)
      );
    }
  };

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
    error: deleteError
  } = UseFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;

    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      console.log("deleted", deleted);
     
      if(deleted.success ) {
        setSelectedIds([]);
        toast.success("Transactions deleted successfully",{
          position:"top-right"
        })
      }
      else {
        toast.error("Error deleting transactions",{
          position:"top-left"
        });

      }
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  }

  const handleDelete = (transaction) => {
    setTransactionToDelete(transaction);
    setOpen(true);

  }

  useEffect(() => {
    console.log(selectedIds)
  }, [selectedIds])


  return (
    <>
    <div className="space-y-4">
      {deleteLoading && (
        <BarLoader className="mt-4" width={"100%"} color="#9333ea" />
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
          <Input
          placeholder="Search Transactions..."
          value={searchTerm}
          onChange = {(e) => setSearchTerm(e.target.value)}
          className={"pl-8"}/>
        </div>

        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter} >
            <SelectTrigger className={"cursor-pointer"}>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem> 
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => {
              setRecurringFilter(value);
            }}
          >
            <SelectTrigger className="w-40 cursor-pointer">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">

              <Button variant={"destructive"} className={"cursor-pointer"} size={"sm"} 
              onClick={handleBulkDelete}>
                <Trash className="h-4 w-4 mr-2"/>
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button 
            onClick={handleClearFilters} 
            variant={"outline"} className={"cursor-pointer"} size={"icon"}>
              <X className="h-4 w-4 " />
            </Button>
          )}
        </div>
      </div>



      <div className="rounded-md border max-h-[650px] overflow-y-scroll " >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  className={"cursor-pointer"}
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds.length === filterdAndSortedTransactions.length
                  }
                />
              </TableHead>
              <TableHead
                className={"cursor-pointer"}
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className={"cursor-pointer"}
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>

              <TableHead
                className={"cursor-pointer"}
                onClick={() => handleSort("amount")}
              >
                <div className="flex  items-center justify-end">
                  Amount{" "}
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className={"w-[50px]"} />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filterdAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className={"text-center text-muted-foreground"}
                >
                  No tranactions Found
                </TableCell>
              </TableRow>
            ) : (
              
              filterdAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      className={"cursor-pointer"}
                      checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={() => handleSelect(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "MM/dd/yyyy")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium`}
                    style={{
                      color: transaction.type === "INCOME" ? "green" : "red",
                    }}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"} ₹{" "}
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant={"outline"}
                              className={
                                "gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                              }
                            >
                              <RefreshCw className="h-3 w-3" />
                              {RECURRING_OPTIONS[transaction.recurringInterval]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-sm">
                              <div className="font-medium">Next Date:</div>
                              <div>
                                {format(
                                  new Date(transaction.nextTransactionDate),
                                  "MM/dd/yyyy"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant={"outline"} className={"gap-1"}>
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                          <MoreHorizontal className="h-4 w-4  " />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                        className={"cursor-pointer"}
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer"
                            // onClick={() => deleteFn([transaction.id])}
                            onClick={() => handleDelete(transaction)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <DeleteDialog open={open} setOpen={setOpen} transaction={transactionToDelete} deleteFn={deleteFn}/>
    </div>

    

    </>
  );
};

export default TransactionTable;
