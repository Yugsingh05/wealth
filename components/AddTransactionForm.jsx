"use client";

import { transactionSchema } from "@/app/lib/schema";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import CreateAccountDrawer from "./CreateAccountDrawer";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CreateTransaction, updateTransaction } from "@/actions/transaction";
import { Calendar } from "./ui/calendar";
import { Switch } from "./ui/switch";
import { toast } from "sonner";

const AddTransactionForm = ({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}) => {
  const [transactionLoading, setTransactionLoading] = useState(false);
  console.log("accounts", accounts);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("edit");

  const formik = useFormik({
    initialValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: initialData.amount.toString(),
            description: initialData.description,
            accountId: initialData.accountId,
            category: initialData.category,
            date: new Date(initialData.date),
            isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
            }),
          }
        : {
            type: "EXPENSE",
            amount: "",
            description: "",
            accountId: accounts.data.find((ac) => ac.isDefault)?.id,
            date: new Date(),
            isRecurring: false,
          },
    validationSchema: transactionSchema,
    onSubmit: async (data) => {
      console.log("data", data);
      setTransactionLoading(true);
      const formData = {
        ...data,
        amount: parseFloat(data.amount),
      };

      if (editMode) {
        try {
          const res = await updateTransaction(editId, formData);
          console.log("res", res);
          if (res.success) {
            toast.success(
              editMode
                ? "Transaction updated successfully"
                : "Transaction created successfully"
            );

            router.push(`/account/${res.data.accountId}`);
          }
        } catch (error) {
          console.error("error", error);
        } finally {
          setTransactionLoading(false);
        }
      } else {
        try {
          const res = await CreateTransaction(formData);
          console.log("res", res);
          if (res.success) {
            toast.success(
              editMode
                ? "Transaction updated successfully"
                : "Transaction created successfully"
            );
            formik.handleReset();
            router.push(`/account/${res.data.accountId}`);
          }
        } catch (error) {
          console.error("error", error);
        } finally {
          setTransactionLoading(false);
        }
      }
    },
  });

  // useEffect(() => {
  //   if (transactionResult?.success && !transactionLoading) {
  //     toast.success(
  //       editMode
  //         ? "Transaction updated successfully"
  //         : "Transaction created successfully"
  //     );
  //     reset();
  //     router.push(`/account/${transactionResult.data.accountId}`);
  //   }
  // }, [transactionResult, transactionLoading, editMode]);

  const filteredCategories = categories.filter(
    (category) => category.type === formik.values.type
  );
  return (
    <form className="space-y-6">
      {/* {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />} */}

      {/* Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          onValueChange={(value) => formik.setFieldValue("type", value)}
          defaultValue={formik.values.type}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
        {formik.errors.type && (
          <p className="text-sm text-red-500">{formik.errors.type}</p>
        )}
      </div>

      {/* Amount and Account */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...formik.getFieldProps("amount")}
          />
          {formik.errors.amount && (
            <p className="text-sm text-red-500">{formik.errors.amount}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Account</label>
          <Select
            onValueChange={(value) => formik.setFieldValue("accountId", value)}
            defaultValue={formik.values.accountId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.data.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  type="button"
                  variant="ghost"
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {formik.errors.accountId && (
            <p className="text-sm text-red-500">{formik.errors.accountId}</p>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          onValueChange={(value) => formik.setFieldValue("category", value)}
          defaultValue={formik.values.category}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formik.errors.category && (
          <p className="text-sm text-red-500">{formik.errors.category}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !formik.values.date && "text-muted-foreground"
              )}
            >
              {formik.values.date ? (
                format(formik.values.date, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formik.values.date}
              onSelect={(date) => formik.setFieldValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {formik.errors.date && (
          <p className="text-sm text-red-500">{formik.errors.date}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input
          placeholder="Enter description"
          id="description"
          name="description"
          {...formik.getFieldProps("description")}
        />
        {formik.errors.description && (
          <p className="text-sm text-red-500">{formik.errors.description}</p>
        )}
      </div>

      {/* Recurring Toggle */}
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label className="text-base font-medium">Recurring Transaction</label>
          <div className="text-sm text-muted-foreground">
            Set up a recurring schedule for this transaction
          </div>
        </div>
        <Switch
          id="isRecurring"
          name="isRecurring"
          checked={formik.values.isRecurring}
          onCheckedChange={(checked) =>
            formik.setFieldValue("isRecurring", checked)
          }
        />
      </div>

      {formik.values.isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Recurring Interval</label>
          <Select
            onValueChange={(value) =>
              formik.setFieldValue("recurringInterval", value)
            }
            defaultValue={formik.values.recurringInterval}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {formik.errors.recurringInterval && (
            <p className="text-sm text-red-500">
              {formik.errors.recurringInterval}
            </p>
          )}
        </div>
      )}

      <div className="flex gap-4 flex-col">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            formik.handleSubmit();
          }}
          className="w-full"
          disabled={transactionLoading}
        >
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
