import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
  } from "@react-email/components";
  
  // Dummy data for preview
  const PREVIEW_DATA = {
    monthlyReport: {
      userName: "John Doe",
      type: "monthly-report",
      data: {
        month: "December",
        stats: {
          totalIncome: 5000,
          totalExpenses: 3500,
          byCategory: {
            housing: 1500,
            groceries: 600,
            transportation: 400,
            entertainment: 300,
            utilities: 700,
          },
        },
        insights: [
          "Your housing expenses are 43% of your total spending - consider reviewing your housing costs.",
          "Great job keeping entertainment expenses under control this month!",
          "Setting up automatic savings could help you save 20% more of your income.",
        ],
      },
    },
    budgetAlert: {
      userName: "John Doe",
      type: "budget-alert",
      data: {
        percentageUsed: 85,
        budgetAmount: 4000,
        totalExpenses: 3400,
      },
    },
  };
  
  export default function EmailTemplate({
    userName =  "Yug singh",
    type = "budget-alert",
    data = {
      percentageUsed: 86,
      budgetAmount: 10000,
      totalExpenses: 8600,
    },
  }) {
    // if (type === "monthly-report") {
    //   return (
    //     <Html>
    //       <Head />
    //       <Preview>Your Monthly Financial Report</Preview>
    //       <Body style={styles.body}>
    //         <Container style={styles.container}>
    //           <Heading style={styles.title}>Monthly Financial Report</Heading>
  
    //           <Text style={styles.text}>Hello {userName},</Text>
    //           <Text style={styles.text}>
    //             Here&rsquo;s your financial summary for {data?.month}:
    //           </Text>
  
    //           {/* Main Stats */}
    //           <Section style={styles.statsContainer}>
    //             <div style={styles.stat}>
    //               <Text style={styles.text}>Total Income</Text>
    //               <Text style={styles.heading}>${data?.stats.totalIncome}</Text>
    //             </div>
    //             <div style={styles.stat}>
    //               <Text style={styles.text}>Total Expenses</Text>
    //               <Text style={styles.heading}>${data?.stats.totalExpenses}</Text>
    //             </div>
    //             <div style={styles.stat}>
    //               <Text style={styles.text}>Net</Text>
    //               <Text style={styles.heading}>
    //                 ${data?.stats.totalIncome - data?.stats.totalExpenses}
    //               </Text>
    //             </div>
    //           </Section>
  
    //           {/* Category Breakdown */}
    //           {data?.stats?.byCategory && (
    //             <Section style={styles.section}>
    //               <Heading style={styles.heading}>Expenses by Category</Heading>
    //               {Object.entries(data?.stats.byCategory).map(
    //                 ([category, amount]) => (
    //                   <div key={category} style={styles.row}>
    //                     <Text style={styles.text}>{category}</Text>
    //                     <Text style={styles.text}>${amount}</Text>
    //                   </div>
    //                 )
    //               )}
    //             </Section>
    //           )}
  
    //           {/* AI Insights */}
    //           {data?.insights && (
    //             <Section style={styles.section}>
    //               <Heading style={styles.heading}>Welth Insights</Heading>
    //               {data.insights.map((insight, index) => (
    //                 <Text key={index} style={styles.text}>
    //                   • {insight}
    //                 </Text>
    //               ))}
    //             </Section>
    //           )}
  
    //           <Text style={styles.footer}>
    //             Thank you for using Welth. Keep tracking your finances for better
    //             financial health!
    //           </Text>
    //         </Container>
    //       </Body>
    //     </Html>
    //   );
    // }
  
    if (type === "budget-alert") {
      return (
        <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>🚨 Budget Alert 🚨</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.alertText}>
              You've used <strong style={styles.percentage}>{data?.percentageUsed.toFixed(1)}%</strong> of your
              monthly budget.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.statColumn}>
                <div style={styles.statBox}>
                  <Text style={styles.statLabel}>💰 Budget Amount</Text>
                  <Text style={styles.statValue}>${data?.budgetAmount}</Text>
                </div>
                <div style={styles.statBox}>
                  <Text style={styles.statLabel}>📊 Spent So Far</Text>
                  <Text style={styles.statValue}>${data?.totalExpenses}</Text>
                </div>
                <div style={styles.statBox}>
                  <Text style={styles.statLabel}>🟢 Remaining</Text>
                  <Text style={styles.statValue}>
                    ${data?.budgetAmount - data?.totalExpenses}
                  </Text>
                </div>
              </div>
            </Section>
            <Text style={styles.footer}>Stay on track and keep your expenses under control! 🚀</Text>
          </Container>
        </Body>
      </Html>
      );
    }
  }
  
  const styles = {
    body: {
      backgroundColor: "#f0f2f5",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: "#1f2937",
      padding: "20px",
    },
    container: {
      backgroundColor: "#ffffff",
      maxWidth: "480px",
      margin: "0 auto",
      padding: "32px",
      borderRadius: "16px",
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e5e7eb",
    },
    title: {
      color: "#2563eb",
      fontSize: "30px",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "24px",
    },
    text: {
      color: "#4b5563",
      fontSize: "16px",
      lineHeight: "1.6",
    },
    alertText: {
      backgroundColor: "#fff5f5",
      color: "#dc2626",
      padding: "12px 16px",
      borderRadius: "8px",
      textAlign: "center",
      margin: "20px 0",
      fontWeight: "600",
    },
    percentage: {
      color: "#b91c1c",
      fontWeight: "bold",
    },
    statsContainer: {
      backgroundColor: "#f9fafb",
      borderRadius: "12px",
      padding: "24px",
      marginTop: "24px",
    },
    statColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    statBox: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "12px",
      textAlign: "center",
      boxShadow: "0 3px 8px rgba(0, 0, 0, 0.05)",
      border: "1px solid #e5e7eb",
    },
    statLabel: {
      color: "#6b7280",
      fontSize: "14px",
      marginBottom: "4px",
    },
    statValue: {
      color: "#1f2937",
      fontSize: "20px",
      fontWeight: "700",
    },
    footer: {
      color: "#6b7280",
      fontSize: "14px",
      textAlign: "center",
      marginTop: "24px",
      paddingTop: "16px",
      borderTop: "1px solid #e5e7eb",
    },
  };
  