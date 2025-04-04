import { serve } from "inngest/next";

import {
  checkBudgetAlerts,
  generateMonthlyReports,
  processRecurringTransactions,
  triggerRecurringTransactions,
} from "@/lib/inngest/function";
import { inngest } from "@/lib/inngest/client";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkBudgetAlerts,
    processRecurringTransactions,
    triggerRecurringTransactions,
    generateMonthlyReports

  ],
});