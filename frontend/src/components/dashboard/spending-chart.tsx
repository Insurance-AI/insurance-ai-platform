"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionAnalysis } from "@/lib/types";
import { formatCurrency, generateChartColors, objectToChartData, formatDate } from "@/lib/utils";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SpendingChartProps {
  data: TransactionAnalysis;
}

export default function SpendingChart({ data }: SpendingChartProps) {
  const [chartType, setChartType] = useState<"category" | "weekly" | "monthly" | "daily">("category");
  
  // Prepare data for the pie chart
  const categoryData = objectToChartData(data.spending_patterns.top_categories);
  const categoryColors = generateChartColors(categoryData.length);
  
  // Prepare data for timeline charts
  const weeklyData = Object.entries(data.spending_patterns.weekly_trend).map(([week, amount]) => ({
    name: formatDate(week),
    value: amount,
  }));
  
  const monthlyData = Object.entries(data.spending_patterns.monthly_trend)
    .sort((a, b) => {
      // Sort by year then month
      const [monthA, yearA] = a[0].split(" ");
      const [monthB, yearB] = b[0].split(" ");
      return yearA === yearB 
        ? new Date(`${monthA} 1, 2000`).getTime() - new Date(`${monthB} 1, 2000`).getTime()
        : parseInt(yearA) - parseInt(yearB);
    })
    .map(([month, amount]) => ({
      name: month,
      value: amount,
    }));
  
  const dailyData = objectToChartData(data.spending_patterns.daily_averages);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow text-sm">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-gray-700">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Patterns</CardTitle>
        <CardDescription>
          Analyze your spending across different categories and time periods
        </CardDescription>
        <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="category">By Category</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="daily">Daily Avg</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <TabsContent value="category" className="mt-0 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-0 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="monthly" className="mt-0 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="daily" className="mt-0 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </div>
      </CardContent>
    </Card>
  );
}