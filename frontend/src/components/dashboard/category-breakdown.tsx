"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryInsights } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, Percent, DollarSign, ShoppingBag } from "lucide-react";

interface CategoryBreakdownProps {
  categoryInsights: CategoryInsights;
}

export default function CategoryBreakdown({ categoryInsights }: CategoryBreakdownProps) {
  // Convert the object to array for sorting
  const categories = Object.entries(categoryInsights).map(([name, data]) => ({
    name,
    ...data,
  }));
  
  // Sort by total spent
  const sortedCategories = categories.sort((a, b) => b.total_spent - a.total_spent);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>
          Spending details across top categories with insurance recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead className="hidden md:table-cell">Avg. Transaction</TableHead>
              <TableHead className="hidden sm:table-cell">Count</TableHead>
              <TableHead className="text-right">Recommended Insurance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.map((category, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-yellow-500' : 'bg-gray-400'}`} />
                    {category.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    {formatCurrency(category.total_spent)}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <Percent className="h-4 w-4 text-gray-400 mr-1" />
                    {formatCurrency(category.average_transaction)}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 text-gray-400 mr-1" />
                    {category.transaction_count}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    {category.recommended_insurance}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}