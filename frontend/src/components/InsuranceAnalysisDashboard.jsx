"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import dashboard components
import SummaryCard from "@/components/dashboard/summary-card";
import SpendingOverview from "@/components/dashboard/spending-overview";
import CategoryBreakdown from "@/components/dashboard/category-breakdown";
import FinancialAdvice from "@/components/dashboard/financial-advice";
import DetailedSummary from "@/components/dashboard/detailed-summary";
import RecommendationList from "@/components/recommendation-list";
import RecommendationCard from "@/components/dashboard/recommendation-card";

export default function InsuranceAnalysisDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState(null);
  const [activeTab, setActiveTab] = useState("spending");

  useEffect(() => {
    try {
      // Get the analysis data from sessionStorage
      const storedData = sessionStorage.getItem("insuranceAnalysisData");
      console.log("Stored data:", storedData);
      
      if (storedData) {
        // If data exists in sessionStorage, use it
        setData(JSON.parse(storedData));
        setLoading(false);
      } else {
        // If no data in sessionStorage, redirect back to upload page
        // or fetch data if this is a direct access case
        fetchDataOrRedirect();
      }
    } catch (err) {
      console.error("Failed to load stored data:", err);
      setError("Failed to load analysis data. Please try uploading your transactions again.");
      setLoading(false);
    }
  }, []);

  const fetchDataOrRedirect = async () => {
    try {
      // Attempt to fetch data (in case someone navigates directly to this page)
      const response = await fetch('http://localhost:8080/api/insurance/analyze', {
        method: 'POST',
      });
      
      if (!response.ok) {
        // If API call fails, redirect to upload page
        router.push("/upload"); // Adjust this path to your upload page path
        return;
      }
      
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load analysis data. Please try uploading your transactions again.");
      setLoading(false);
    }
  };

  // When a new insurance type is selected from the list
  const handleInsuranceSelect = (type) => {
    setSelectedInsuranceType(type);
  };

  // In case of error, provide option to go back to upload
  const handleReturnToUpload = () => {
    router.push("/upload");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md p-6 text-center">
          <CardContent>
            <Loader2 className="h-12 w-12 mx-auto animate-spin text-blue-500 mb-4" />
            <p className="text-lg font-medium">Loading your financial analysis...</p>
            <p className="text-sm text-gray-500 mt-2">We're preparing your dashboard with insurance recommendations.</p>
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
            <Button onClick={handleReturnToUpload} className="w-full">
              Return to Upload
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
    ? { type: selectedInsuranceType, ...data.recommendations[selectedInsuranceType] }
    : null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Financial Health & Insurance Analysis</h1>
        <Button 
          variant="outline" 
          onClick={handleReturnToUpload} 
          className="mt-4 md:mt-0"
        >
          New Analysis
        </Button>
      </div>
      
      {/* Top summary stats */}
      <SummaryCard data={data} />
      
      {/* Main content with tabs */}
      <Tabs defaultValue="spending" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
          <TabsTrigger value="advice">Financial Advice</TabsTrigger>
          <TabsTrigger value="summary">Summary Report</TabsTrigger>
        </TabsList>
        
        {/* Spending Analysis Tab */}
        <TabsContent value="spending" className="space-y-6">
          <SpendingOverview data={data} />
        </TabsContent>
        
        {/* Category Breakdown Tab */}
        <TabsContent value="categories" className="space-y-6">
          <CategoryBreakdown data={data} />
        </TabsContent>
        
        {/* Financial Advice Tab */}
        <TabsContent value="advice" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column */}
            <div className="lg:col-span-1 space-y-6">
              <RecommendationList 
                recommendations={data.recommendations} 
                onSelect={handleInsuranceSelect}
                selectedType={selectedInsuranceType}
              />
            </div>
{/*             
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
              <FinancialAdvice data={data} />
             </div> 
          </div>
        </TabsContent>
        
        {/* Summary Report Tab */}
        <TabsContent value="summary" className="space-y-6">
          <DetailedSummary data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}