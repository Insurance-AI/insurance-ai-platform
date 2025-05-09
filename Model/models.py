from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any

class InsuranceRecommendation(BaseModel):
    """Model for insurance recommendation details"""
    priority: str
    percentage: float
    amount: float
    reason: str

class CategoryInsight(BaseModel):
    """Model for category spending insights"""
    total_spent: float
    average_transaction: float
    transaction_count: int
    recommended_insurance: str

class FinancialAdvice(BaseModel):
    """Model for personalized financial advice"""
    total_spending: float
    avg_monthly_spending: Optional[float] = None
    budget_recommendation: Optional[float] = None
    savings_opportunities: Optional[Dict[str, Dict[str, Any]]] = None
    insurance_recommendations: Optional[Dict[str, Dict[str, Any]]] = None

class SpendingPatterns(BaseModel):
    """Model for spending pattern analysis"""
    top_categories: Dict[str, float]
    top_insurance_labels: Dict[str, int]
    weekly_trend: Optional[Dict[str, float]] = None
    monthly_trend: Optional[Dict[str, float]] = None
    daily_averages: Optional[Dict[str, float]] = None

class AnalysisResponse(BaseModel):
    """Response model for transaction analysis results"""
    transaction_count: int = Field(..., description="Total number of transactions analyzed")
    total_spending: float = Field(..., description="Total spending amount")
    spending_patterns: SpendingPatterns = Field(..., description="Analysis of spending patterns")
    category_insights: Dict[str, CategoryInsight] = Field(..., description="Insights for top spending categories")
    insurance_recommendations: Dict[str, InsuranceRecommendation] = Field(..., description="Insurance recommendations")
    financial_advice: FinancialAdvice = Field(..., description="Personalized financial advice")
    summary: str = Field(..., description="Text summary of the analysis")

class InsuranceRequest(BaseModel):
    Age: int
    Gender: str
    Smoking_Status: str
    Annual_Income: float
    Existing_Loans_Debts: int
    Existing_Insurance_Policies: int
    Desired_Sum_Assured: float
    Policy_Term_Years: int
    Premium_Payment_Option: str
    Death_Benefit_Option: str
    Payout_Type: str
    Medical_History: str
    Lifestyle_Habits: str
    Interest_in_Optional_Riders: bool
    Interest_in_Tax_Saving: bool