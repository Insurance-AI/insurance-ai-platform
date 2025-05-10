import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, TrendingDown, PiggyBank, ShieldAlert } from "lucide-react";

export default function FinancialAdvice({ data }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const financialAdvice = data?.financialAdvice || {};
  const avgMonthlySpending = financialAdvice.avg_monthly_spending || 0;
  const budgetRecommendation = financialAdvice.budget_recommendation || 0;
  const savingsOpportunities = financialAdvice.savings_opportunities || {};
  const dailyAvgs = data?.dailyAverages || {};

  // Calculate saving percentage
  const savingPercentage = avgMonthlySpending > 0 
    ? ((avgMonthlySpending - budgetRecommendation) / avgMonthlySpending * 100).toFixed(0)
    : 0;
  
  // Find highest and lowest spending days
  let highestDay = { day: '', amount: 0 };
  let lowestDay = { day: '', amount: Infinity };
  
  Object.entries(dailyAvgs).forEach(([day, amount]) => {
    if (amount > highestDay.amount) {
      highestDay = { day, amount };
    }
    if (amount < lowestDay.amount) {
      lowestDay = { day, amount };
    }
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Budget Recommendation</CardTitle>
              <CardDescription>Based on your spending patterns</CardDescription>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <PiggyBank className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Monthly Average</p>
                <p className="text-2xl font-bold">{formatCurrency(avgMonthlySpending)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">Recommended Budget</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(budgetRecommendation)}</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-500">Potential savings</span>
                <span className="text-sm font-medium">{savingPercentage}%</span>
              </div>
              <Progress value={savingPercentage} className="h-2" />
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-gray-600">
                Reducing your monthly spending by {savingPercentage}% could save you approximately 
                {' '}{formatCurrency(avgMonthlySpending - budgetRecommendation)} per month.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Savings Opportunities</CardTitle>
              <CardDescription>Areas where you could reduce spending</CardDescription>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <TrendingDown className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(savingsOpportunities).length > 0 ? (
              Object.entries(savingsOpportunities).map(([category, info], index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{category}</h4>
                      <p className="text-sm text-gray-500">{info.transaction_count} transaction{info.transaction_count !== 1 ? 's' : ''}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {formatCurrency(info.total_amount)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No specific savings opportunities identified</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Spending Patterns</CardTitle>
              <CardDescription>Daily spending insights</CardDescription>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Lightbulb className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Highest Spending Day</p>
                <p className="text-xl font-bold">{highestDay.day}</p>
                <p className="text-lg">{formatCurrency(highestDay.amount)}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Lowest Spending Day</p>
                <p className="text-xl font-bold">{lowestDay.day}</p>
                <p className="text-lg">{formatCurrency(lowestDay.amount)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">
                Consider planning major purchases on {lowestDay.day}s when you tend to spend less,
                and be more mindful of your spending habits on {highestDay.day}s.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    );
}
// Note: The above code is a React component that provides financial advice based on transaction data.
// It includes budget recommendations, savings opportunities, and insights into spending patterns.
