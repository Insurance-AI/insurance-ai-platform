"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialAdvice } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Sparkles } from "lucide-react";

interface SavingsOpportunitiesProps {
  financialAdvice: FinancialAdvice;
}

export default function SavingsOpportunities({ financialAdvice }: SavingsOpportunitiesProps) {
  const { savings_opportunities, avg_monthly_spending, budget_recommendation } = financialAdvice;
  
  // Calculate potential savings amount and percentage
  const potentialSavings = avg_monthly_spending - budget_recommendation;
  const savingsPercent = (potentialSavings / avg_monthly_spending) * 100;
  
  // Convert to array for rendering
  const savingsCategories = Object.entries(savings_opportunities).map(([name, data]) => ({
    name,
    ...data,
  }));
  
  // Sort by total amount
  const sortedSavings = savingsCategories.sort((a, b) => b.total_amount - a.total_amount);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Savings Opportunities</CardTitle>
            <CardDescription>
              Areas where you could reduce spending and save more
            </CardDescription>
          </div>
          <Sparkles className="h-5 w-5 text-yellow-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Monthly Budget Target</span>
            <span className="text-sm text-gray-500">
              {formatCurrency(budget_recommendation)} / {formatCurrency(avg_monthly_spending)}
            </span>
          </div>
          <Progress value={100 - savingsPercent} className="h-2" />
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Target: {formatCurrency(budget_recommendation)}</span>
            <span>Current: {formatCurrency(avg_monthly_spending)}</span>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg flex items-start space-x-3">
          <Lightbulb className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-700">
            <p className="font-medium">Potential Monthly Savings</p>
            <p className="mt-1">
              You could save approximately <span className="font-bold">{formatCurrency(potentialSavings)}</span> per month 
              by reducing expenses in the categories below.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">Top Savings Categories</h4>
          {sortedSavings.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <span className="text-sm">{formatCurrency(category.total_amount)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{category.transaction_count} transactions</span>
                <span>Avg: {formatCurrency(category.total_amount / category.transaction_count)}</span>
              </div>
              <Progress 
                value={100 - ((index + 1) * 20)} 
                className={`h-1 ${index === 0 ? 'bg-red-100' : index === 1 ? 'bg-orange-100' : 'bg-yellow-100'}`} 
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}