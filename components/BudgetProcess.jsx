"use client";

import { updateBudget } from "@/actions/budget";
import {  useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Check, Pencil, X } from "lucide-react";
import { Progress } from "./ui/progress";

const BudgetProcess = ({ initialBudget, currentExpenses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const percentUsed = initialBudget
    ? (currentExpenses / initialBudget.amount) * 100
    : 0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid budget amount", {
        position: "top-right",
      });
      return;
    }

    try {
      const res = await updateBudget(amount);
      toast.success("Budget updated successfully");
      console.log("res", res);
    } catch (error) {
      toast.error(error.message || "Failed to update budget");
    } finally {
      setIsEditing(false);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  // useEffect(() => {
  //   console.log("updatedBudget",updatedBudget);
  //   if(updateBudget?.success){
  //       setIsEditing(false);
  //       toast.success("Budget updated successfully");
  //   }
  // },[updateBudget]);

  // useEffect(() => {
  //   if (error) {
  //     toast.error(error.message || "Failed to update budget");
  //   }
  // }, [error]);

  return (
    <Card>
      <CardHeader
        className={"flex flex-row items-center justify-between space-y-0 pb-2 "}
      >
        <div className="flex-1">
          <CardTitle className={"text-sm font-medium"}>
            Monthly Budget (Default Account)
          </CardTitle>

          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type={"number"}
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className={"w-32"}
                  placeholder={"Enter Amount"}
                  autoFocus
                  disabled={isLoading}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={"cursor-pointer"}
                  onClick={handleUpdateBudget}
                  disabled={isLoading}
                >
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancel}
                  className={"hover:cursor-pointer"}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {initialBudget
                    ? `₹${currentExpenses.toFixed(
                        2
                      )} of ₹${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </CardDescription>

                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onClick={() => setIsEditing(true)}
                  className={"h-6 w-6 cursor-pointer"}
                >
                  <Pencil className="h-3 w-3 " />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {initialBudget && (
          <div className="space-y-2">
            <Progress
              value={percentUsed <= 100 ? percentUsed : 100}
              extraStyles={`${
                percentUsed >= 90
                  ? "bg-red-500"
                  : percentUsed >= 75
                    ? "bg-yellow-500"
                    : percentUsed >= 50
                      ? "bg-green-500"
                      : "bg-pink-800"
              }`}
            />

            <p className="text-xs text-muted-foreground text-right">
              {percentUsed.toFixed(2)}% used
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetProcess;
