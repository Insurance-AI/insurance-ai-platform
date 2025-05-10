// TypeScript interfaces for our application

export interface TransactionAnalysis {
  transaction_count: number;
  total_spending: number;
  spending_patterns: SpendingPatterns;
  category_insights: CategoryInsights;
  insurance_recommendations: InsuranceRecommendations;
  financial_advice: FinancialAdvice;
  summary: string;
}

export interface SpendingPatterns {
  top_categories: Record<string, number>;
  top_insurance_labels: Record<string, number>;
  weekly_trend: Record<string, number>;
  monthly_trend: Record<string, number>;
  daily_averages: Record<string, number>;
}

export interface CategoryInsight {
  total_spent: number;
  average_transaction: number;
  transaction_count: number;
  recommended_insurance: string;
}

export interface CategoryInsights {
  [category: string]: CategoryInsight;
}

export interface InsuranceRecommendation {
  priority: string;
  percentage: number;
  amount?: number;
  reason?: string;
}

export interface InsuranceRecommendations {
  [insuranceType: string]: InsuranceRecommendation;
}

export interface SavingsOpportunity {
  transaction_count: number;
  total_amount: number;
}

export interface FinancialAdvice {
  total_spending: number;
  avg_monthly_spending: number;
  budget_recommendation: number;
  savings_opportunities: Record<string, SavingsOpportunity>;
  insurance_recommendations: InsuranceRecommendations;
}

export type PriorityLevel = "High" | "Medium" | "Low";

export interface ChartData {
  name: string;
  value: number;
}