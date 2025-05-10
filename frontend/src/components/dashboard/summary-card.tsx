"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionAnalysis } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, CreditCard, Calendar, TrendingUp } from "lucide-react";

interface SummaryCardProps {
  data: TransactionAnalysis;
}

export default function SummaryCard({ data }: SummaryCardProps) {
  const statItems = [
    {
      title: "Transactions",
      value: data.transaction_count.toLocaleString(),
      description: "Total analyzed",
      icon: <CreditCard className="h-4 w-4 text-blue-500" />,
    },
    {
      title: "Total Spending",
      value: formatCurrency(data.total_spending),
      description: "All transactions",
      icon: <DollarSign className="h-4 w-4 text-green-500" />,
    },
    {
      title: "Monthly Average",
      value: formatCurrency(data.financial_advice.avg_monthly_spending),
      description: "Average per month",
      icon: <Calendar className="h-4 w-4 text-purple-500" />,
    },
    {
      title: "Recommended Budget",
      value: formatCurrency(data.financial_advice.budget_recommendation),
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