"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, CreditCard, Calendar, TrendingUp } from "lucide-react";

interface SummaryCardProps {
  data: {
    summary: string;
  };
}

export default function SummaryCard({ data }: SummaryCardProps) {
  // Parse relevant information from the summary string
  const summaryText = data.summary;
  
  // Extract total spending - make it case insensitive and look for numbers with or without decimals
  const totalSpendingMatch = summaryText.match(/total spending of (\d+(?:\.\d+)?)/i);
  const totalSpending = totalSpendingMatch ? parseFloat(totalSpendingMatch[1]) : 0;
  
  // Extract transaction count
  const transactionCountMatch = summaryText.match(/Analyzed (\d+) transactions/i);
  const transactionCount = transactionCountMatch ? parseInt(transactionCountMatch[1]) : 0;
  
  // Extract monthly average spending
  const monthlyAvgMatch = summaryText.match(/Average Monthly Spending: (\d+(?:\.\d+)?)/i);
  const monthlyAvgSpending = monthlyAvgMatch ? parseFloat(monthlyAvgMatch[1]) : 0;
  
  // Extract budget recommendation
  const budgetMatch = summaryText.match(/monthly budget of (\d+(?:\.\d+)?)/i);
  const budgetRecommendation = budgetMatch ? parseFloat(budgetMatch[1]) : 0;
  
  // Log the extracted values for debugging
  console.log({
    totalSpending,
    transactionCount,
    monthlyAvgSpending,
    budgetRecommendation,
    summaryText: summaryText.substring(0, 100) // Log first 100 chars of summary
  });

  // Define a safe currency formatter to avoid the maximumFractionDigits error
  const safeFormatCurrency = (value: number) => {
    try {
      return formatCurrency(value);
    } catch (error) {
      // Fallback to a simple formatter if the built-in formatter fails
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      }).format(value);
    }
  };

  const statItems = [
    {
      title: "Transactions",
      value: transactionCount.toLocaleString(),
      description: "Total analyzed",
      icon: <CreditCard className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Total Spending",
      value: safeFormatCurrency(totalSpending),
      description: "All transactions",
      icon: <DollarSign className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Monthly Average",
      value: safeFormatCurrency(monthlyAvgSpending),
      description: "Average per month",
      icon: <Calendar className="h-4 w-4 text-purple-500" />,
    },
    {
      title: "Recommended Budget",
      value: safeFormatCurrency(budgetRecommendation),
      description: "Monthly target",
      icon: <TrendingUp className="h-4 w-4 text-orange-500" />,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
        <CardDescription>
          Overview of your transaction analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col space-y-1.5 rounded-lg border p-3"
            >
              <div className="flex items-center space-x-2">
                {item.icon}
                <span className="text-sm font-medium">{item.title}</span>
              </div>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}