"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Import your existing components
import SummaryCard from "@/components/dashboard/summary-card";
import SpendingChart from "@/components/dashboard/spending-chart";
import CategoryBreakdown from "@/components/dashboard/category-breakdown";
import SavingsOpportunities from "@/components/dashboard/savings-opportunities";
import RecommendationList from "@/components/recommendation-list";
import RecommendationCard from "@/components/dashboard/recommendation-card";

export default function InsuranceAnalysisDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fixed: Using fetch instead of undefined post function
        const response = await fetch('http://localhost:8080/api/insurance/analyze', {
          method: 'POST',
          // You can add headers and body here if needed
          // headers: {
          //   'Content-Type': 'application/json',
          // },
          // body: JSON.stringify({ /* your data here */ }),
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // When a new insurance type is selected from the list
  const handleInsuranceSelect = (type) => {
    setSelectedInsuranceType(type);
  };

  // In case API fails, provide option to retry
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Fixed: Need to call the fetchData function
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-6 text-center">
          <CardContent>
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-500 mb-4" />
            <p className="text-lg font-medium">Loading your financial analysis...</p>
            <p className="text-sm text-gray-500 mt-2">We're analyzing your transactions and generating insurance recommendations.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-6 text-center">
          <CardContent className="space-y-4">
            <div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto flex items-center justify-center">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Failed to load data</h3>
            <p className="text-sm text-gray-500">{error}</p>
            <Button onClick={handleRetry} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  // Find the selected recommendation details if a type is selected
  const selectedRecommendation = selectedInsuranceType 
    ? { type: selectedInsuranceType, ...data.insurance_recommendations[selectedInsuranceType] }
    : null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Financial Health & Insurance Analysis</h1>
      
      {/* Top summary row */}
      <SummaryCard data={data} />
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-1 space-y-6">
          <RecommendationList 
            recommendations={data.insurance_recommendations} 
            onSelect={handleInsuranceSelect}
            selectedType={selectedInsuranceType}
          />
          <SavingsOpportunities financialAdvice={data.financial_advice} />
        </div>
        
        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {selectedRecommendation ? (
            <RecommendationCard 
              type={selectedRecommendation.type} 
              recommendation={selectedRecommendation} 
            />
          ) : (
            <Card className="p-6 text-center bg-gray-50 border-dashed">
              <CardContent>
                <p className="text-gray-500">Select an insurance recommendation from the list to view details.</p>
              </CardContent>
            </Card>
          )}
          <SpendingChart data={data} />
          <CategoryBreakdown categoryInsights={data.category_insights} />
        </div>
      </div>
    </div>
  );
}