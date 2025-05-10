"use client";

import { useState } from "react";
import { Metadata } from "next";
import { useTransactionAnalysis } from "@/hooks/useTransactionAnalysis";
import SummaryCard from "@/components/dashboard/summary-card";
import RecommendationCard from "@/components/dashboard/recommendation-card";
import SpendingChart from "@/components/dashboard/spending-chart";
import CategoryBreakdown from "@/components/dashboard/category-breakdown";
import SavingsOpportunities from "@/components/dashboard/savings-opportunities";
import RecommendationList from "@/components/recommendation-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, PieChart, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

// export const metadata: Metadata = {
//   title: "Insurance Recommendations Dashboard",
//   description: "Personalized insurance recommendations based on your transaction data",
// };

export default function DashboardPage() {
  const { analysisData, loading, error, getPrimaryRecommendation } = useTransactionAnalysis();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<string | null>(null);

  // If loading, show loading state
  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-lg">Loading your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error || !analysisData) {
    return (
      <div className="container mx-auto py-12">
        <div className="max-w-lg mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-medium text-red-800 mb-2">
            {error || "Unable to load transaction analysis"}
          </h2>
          <p className="text-red-600 mb-4">
            We couldn't analyze your transactions. Please try again or contact support.
          </p>
          <Link href="/recommendations">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get primary recommendation
  const primaryRec = getPrimaryRecommendation();
  
  // Set initial selected insurance type if not set
  if (!selectedInsuranceType && primaryRec) {
    setSelectedInsuranceType(primaryRec.type);
  }

  // Get the selected recommendation data
  const selectedRecommendation = selectedInsuranceType
    ? { 
        type: selectedInsuranceType, 
        data: analysisData.insurance_recommendations[selectedInsuranceType]
      }
    : null;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Insurance Recommendations</h1>
          <p className="text-gray-600 mt-1">
            Based on analysis of {analysisData.transaction_count} transactions
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/recommendations">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Upload New Data
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview" className="flex items-center">
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Recommendations</span>
            <span className="sm:hidden">Rec</span>
          </TabsTrigger>
          <TabsTrigger value="spending" className="flex items-center">
            <PieChart className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Spending Patterns</span>
            <span className="sm:hidden">Spending</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Categories</span>
            <span className="sm:hidden">Cat</span>
          </TabsTrigger>
          <TabsTrigger value="savings" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Savings</span>
            <span className="sm:hidden">Save</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="col-span-3">
              <SummaryCard data={analysisData} />
            </div>
            <div className="md:col-span-1">
              <RecommendationList 
                recommendations={analysisData.insurance_recommendations}
                onSelect={setSelectedInsuranceType}
                selectedType={selectedInsuranceType}
              />
            </div>
            <div className="md:col-span-2">
              {selectedRecommendation && (
                <RecommendationCard 
                  type={selectedRecommendation.type} 
                  recommendation={selectedRecommendation.data} 
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="spending" className="mt-0 space-y-6">
          <SpendingChart data={analysisData} />
        </TabsContent>

        <TabsContent value="categories" className="mt-0 space-y-6">
          <CategoryBreakdown categoryInsights={analysisData.category_insights} />
        </TabsContent>

        <TabsContent value="savings" className="mt-0 space-y-6">
          <SavingsOpportunities financialAdvice={analysisData.financial_advice} />
        </TabsContent>
      </Tabs>
    </div>
  );
}