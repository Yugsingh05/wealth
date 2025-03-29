import * as yup from 'yup';

export const transactionSchema = yup.object().shape({
  type: yup.string().oneOf(["INCOME", "EXPENSE"]).required("Type is required"),
  amount: yup.string().required("Amount is required"),
  description: yup.string().optional(),
  date: yup.date().required("Date is required"),
  accountId: yup.string().min(1, "Account is required").required("Account is required"),
  category: yup.string().min(1, "Category is required").required("Category is required"),
  isRecurring: yup.boolean().default(false),
  recurringInterval: yup
    .string()
    .oneOf(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .nullable(),
}).test(
  "recurringInterval-required",
  "Recurring interval is required for recurring transactions",
  (values) => {
    if (values.isRecurring && !values.recurringInterval) {
      return false;
    }
    return true;
  }
);
