import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function CategoryBreakdown({ data }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };
  
  // Process category spending data for chart
  const categoryData = data?.categorySpending ? 
    Object.entries(data.categorySpending)
      .map(([category, amount]) => ({
        name: category,
        value: amount
      }))
      .sort((a, b) => b.value - a.value) : [];
  
  // Calculate total for percentage
  const totalSpending = categoryData.reduce((sum, item) => sum + item.value, 0);

  // Colors for pie chart
  const COLORS = ['#4f46e5', '#22c55e', '#f97316', '#ec4899', '#f43f5e', '#8b5cf6', '#06b6d4', '#14b8a6'];
  
  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalSpending) * 100).toFixed(1);
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">{formatCurrency(data.value)}</p>
          <p className="text-gray-600">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  // Get category insights data
  const categoryInsights = data?.categoryInsights || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Category Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1 font-medium text-gray-500">Category</div>
              <div className="col-span-1 font-medium text-gray-500">Details</div>
              <div className="col-span-1 font-medium text-gray-500">Recommendation</div>
            </div>
            
            <div className="divide-y">
              {categoryInsights.map((category, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-4">
                  <div className="col-span-1">
                    <p className="font-medium">{category.category}</p>
                    <p className="text-sm text-gray-500 mt-1">{category.transaction_count} transactions</p>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex flex-col space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Total:</span>
                        <span className="ml-2 font-medium">{formatCurrency(category.total_spent)}</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Average:</span>
                        <span className="ml-2 font-medium">{formatCurrency(category.average_transaction)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      {category.recommended_insurance}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Insurance Counts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
            {Object.entries(data?.insuranceCounts || {}).map(([type, count], index) => (
              <Card key={index} className="p-4 text-center">
                <p className="font-medium text-xl">{count}</p>
                <p className="text-sm text-gray-500">{type}</p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}