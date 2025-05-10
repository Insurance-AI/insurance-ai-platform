"use client";

import { useState, useEffect } from "react";
import { TransactionAnalysis } from "@/lib/types";

// Sample data based on the provided API response
const mockTransactionData: TransactionAnalysis = {
  transaction_count: 500,
  total_spending: 268543.74,
  spending_patterns: {
    top_categories: {
      Salary: 114505.23,
      Investment: 68483.47,
      Education: 12844.49,
      "Insurance-Life": 12373.25,
      "Insurance-Health": 12117.6
    },
    top_insurance_labels: {
      Other: 163,
      Credit: 65,
      Life: 49,
      Health: 43,
      Home: 43,
      "API Error": 41,
      Travel: 38,
      Motor: 37,
      Liability: 15,
      Accident: 6
    },
    weekly_trend: {
      "2025-W08": 2111.15,
      "2025-W09": 112.11,
      "2025-W10": 2093.03,
      "2025-W11": 584.37,
      "2025-W12": 5921.17,
      "2025-W13": 1294.76,
      "2025-W14": 7168.51,
      "2025-W15": 4384.6,
      "2025-W16": 8499.28,
      "2025-W17": 7936.84
    },
    monthly_trend: {
      "Apr 2024": 23775.99,
      "Apr 2025": 28748.35,
      "Aug 2024": 24408.29,
      "Dec 2024": 15794.89,
      "Feb 2024": 4954.2,
      "Feb 2025": 14391.81,
      "Jan 2024": 19921.7,
      "Jan 2025": 18211.54,
      "Jul 2024": 11712.29,
      "Jun 2024": 17969.23,
      "Mar 2024": 17455.39,
      "Mar 2025": 9246.32,
      "May 2024": 12145.86,
      "Nov 2024": 14647.65,
      "Oct 2024": 16524.93,
      "Sep 2024": 18635.3
    },
    daily_averages: {
      Monday: 848.1,
      Tuesday: 516.44,
      Wednesday: 744.8,
      Thursday: 728.73,
      Friday: 845.61,
      Saturday: 685.77,
      Sunday: 1006.99
    }
  },
  category_insights: {
    Salary: {
      total_spent: 114505.23,
      average_transaction: 4978.49,
      transaction_count: 133,
      recommended_insurance: "Other"
    },
    Investment: {
      total_spent: 68483.47,
      average_transaction: 2536.42,
      transaction_count: 50,
      recommended_insurance: "Credit"
    },
    Education: {
      total_spent: 12844.49,
      average_transaction: 642.22,
      transaction_count: 20,
      recommended_insurance: "Liability"
    },
    "Insurance-Life": {
      total_spent: 12373.25,
      average_transaction: 494.93,
      transaction_count: 25,
      recommended_insurance: "Life"
    },
    "Insurance-Health": {
      total_spent: 12117.6,
      average_transaction: 550.8,
      transaction_count: 22,
      recommended_insurance: "Health"
    }
  },
  insurance_recommendations: {
    Credit: {
      priority: "Medium",
      percentage: 21.50,
      amount: 57741.86,
      reason: "Your financial transactions indicate credit protection insurance could be valuable."
    }
  },
  financial_advice: {
    total_spending: 268543.74,
    avg_monthly_spending: 16783.98,
    budget_recommendation: 15105.59,
    savings_opportunities: {
      Transportation: {
        transaction_count: 29,
        total_amount: 1895.7
      },
      Entertainment: {
        transaction_count: 17,
        total_amount: 1535.73
      },
      Dining: {
        transaction_count: 13,
        total_amount: 1246.44
      }
    },
    insurance_recommendations: {
      Credit: {
        priority: "Medium",
        percentage: 21.50
      }
    }
  },
  summary: "FINANCIAL TRANSACTION ANALYSIS SUMMARY\n=====================================\nAnalyzed 500 transactions with total spending of 268543.74\n\nTOP SPENDING CATEGORIES\n----------------------\n1. Salary: 114505.23 (42.6%)\n2. Investment: 68483.47 (25.5%)\n3. Education: 12844.49 (4.8%)\n4. Insurance-Life: 12373.25 (4.6%)\n5. Insurance-Health: 12117.60 (4.5%)\n\n[...]" // truncated for brevity
};

export function useTransactionAnalysis() {
  const [analysisData, setAnalysisData] = useState<TransactionAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, this would be an API call to your backend
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock data for now
        setAnalysisData(mockTransactionData);
        setError(null);
      } catch (err) {
        console.error("Error fetching transaction analysis:", err);
        setError("Failed to load transaction analysis data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, []);

  // Get primary insurance recommendation (highest priority)
  const getPrimaryRecommendation = () => {
    if (!analysisData?.insurance_recommendations) return null;
    
    const recommendations = Object.entries(analysisData.insurance_recommendations);
    if (recommendations.length === 0) return null;
    
    // Sort by priority (High > Medium > Low)
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    const sortedRecs = recommendations.sort((a, b) => {
      const priorityA = priorityOrder[a[1].priority as keyof typeof priorityOrder] || 0;
      const priorityB = priorityOrder[b[1].priority as keyof typeof priorityOrder] || 0;
      return priorityB - priorityA;
    });
    
    return {
      type: sortedRecs[0][0],
      ...sortedRecs[0][1]
    };
  };

  return {
    analysisData,
    loading,
    error,
    getPrimaryRecommendation
  };
}