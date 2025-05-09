import pandas as pd
import numpy as np
import json
import logging
import time
from datetime import datetime
from io import StringIO
import requests
from typing import Dict, List, Tuple, Optional, Any

from insurance_labeler import get_insurance_label
from models import AnalysisResponse, SpendingPatterns, CategoryInsight, InsuranceRecommendation, FinancialAdvice

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def parse_dates(df: pd.DataFrame) -> Tuple[pd.DataFrame, Optional[str]]:
    """Try to parse date columns from the dataframe."""
    date_columns = [col for col in df.columns if any(date_word in col.lower() for date_word in ['date', 'time', 'day'])]
    
    if not date_columns:
        logger.warning("No date column detected")
        return df, None
    
    date_col = date_columns[0]  # Use the first detected date column
    logger.info(f"Using '{date_col}' as the date column")
    
    # Try different date formats
    date_formats = ['%Y-%m-%d', '%d-%m-%Y', '%m-%d-%Y', '%d/%m/%Y', '%m/%d/%Y', '%Y/%m/%d', 
                   '%d-%b-%Y', '%d-%B-%Y', '%b-%d-%Y', '%B-%d-%Y']
    
    for fmt in date_formats:
        try:
            df[date_col] = pd.to_datetime(df[date_col], format=fmt)
            logger.info(f"Successfully parsed dates using format: {fmt}")
            return df, date_col
        except:
            continue
    
    # If all formats fail, try pandas' automatic parsing
    try:
        df[date_col] = pd.to_datetime(df[date_col])
        logger.info(f"Successfully parsed dates using automatic detection")
        return df, date_col
    except:
        logger.warning("Failed to parse dates. Analysis will proceed without temporal analysis.")
        return df, None

def preprocess_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and prepare the dataframe for analysis."""
    # Check for missing values
    missing_values = df.isnull().sum()
    if missing_values.sum() > 0:
        logger.info(f"Missing values detected: {missing_values[missing_values > 0]}")
    
    # Handle amount columns - convert to numeric
    amount_columns = [col for col in df.columns if any(amount_word in col.lower() 
                                                for amount_word in ['amount', 'withdrawal', 'deposit', 'debit', 'credit'])]
    
    for col in amount_columns:
        if df[col].dtype == object:
            # Remove currency symbols and commas
            df[col] = df[col].astype(str).str.replace(r'[^\d.-]', '', regex=True)
            # Convert to float
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Calculate net transaction amount if both withdrawal and deposit exist
    if 'Withdrawal' in df.columns and 'Deposit' in df.columns:
        df['TransactionAmount'] = df['Deposit'].fillna(0) - df['Withdrawal'].fillna(0)
    elif 'Debit' in df.columns and 'Credit' in df.columns:
        df['TransactionAmount'] = df['Credit'].fillna(0) - df['Debit'].fillna(0)
    
    # Fill missing values
    df = df.fillna({
        'Category': 'Uncategorized',
        'Remark': '',
        'RefNo': ''
    })
    
    return df

def analyze_spending_by_period(df: pd.DataFrame, date_col: Optional[str]) -> Tuple[Optional[pd.Series], Optional[pd.Series], Optional[pd.Series]]:
    """Analyze spending patterns by day, week, month, and year."""
    if date_col is None:
        return None, None, None
    
    # Make sure the date column is datetime
    df[date_col] = pd.to_datetime(df[date_col])
    
    # Create time period features
    df['Day'] = df[date_col].dt.day_name()
    df['Week'] = df[date_col].dt.isocalendar().week
    df['Month'] = df[date_col].dt.month_name()
    df['Year'] = df[date_col].dt.year
    df['WeekOfYear'] = df[date_col].dt.strftime('%Y-W%U')
    df['MonthYear'] = df[date_col].dt.strftime('%b %Y')
    
    # Prepare aggregations
    if 'Withdrawal' in df.columns:
        spending_col = 'Withdrawal'
    elif 'Debit' in df.columns:
        spending_col = 'Debit'
    else:
        # Try to identify spending column
        for col in df.columns:
            if df[col].dtype in [np.float64, np.int64] and df[col].sum() > 0:
                spending_col = col
                break
        else:
            logger.warning("No spending column identified")
            return None, None, None
    
    # Calculate aggregations
    weekly_spending = df.groupby('WeekOfYear')[spending_col].sum().fillna(0)
    monthly_spending = df.groupby('MonthYear')[spending_col].sum().fillna(0)
    yearly_spending = df.groupby('Year')[spending_col].sum().fillna(0)
    
    return weekly_spending, monthly_spending, yearly_spending

def analyze_spending_by_category(df: pd.DataFrame, date_col: Optional[str] = None) -> Tuple[Optional[pd.Series], Optional[pd.DataFrame]]:
    """Analyze spending patterns by category."""
    if 'Withdrawal' in df.columns:
        spending_col = 'Withdrawal'
    elif 'Debit' in df.columns:
        spending_col = 'Debit'
    else:
        # Try to identify spending column
        for col in df.columns:
            if df[col].dtype in [np.float64, np.int64] and df[col].sum() > 0:
                spending_col = col
                break
        else:
            logger.warning("No spending column identified")
            return None, None
    
    # Get categorical spending
    category_spending = df.groupby('Category')[spending_col].sum().sort_values(ascending=False).fillna(0)
    
    # If date column is available, get category spending over time
    if date_col:
        # Monthly category spending
        df['MonthYear'] = pd.to_datetime(df[date_col]).dt.strftime('%b %Y')
        category_over_time = df.pivot_table(
            index='MonthYear', 
            columns='Category', 
            values=spending_col, 
            aggfunc='sum'
        ).fillna(0)
    else:
        category_over_time = None
    
    return category_spending, category_over_time

def get_recommendation_reason(insurance_type: str, df: pd.DataFrame) -> str:
    """Generate a reason for recommending a specific insurance type."""
    reasons = {
        "Health": "Your significant healthcare spending indicates a need for comprehensive health insurance.",
        "Life": "Your lifestyle expenses suggest life insurance would provide important financial security.",
        "Travel": "Your frequent travel expenses indicate travel insurance could benefit you.",
        "Motor": "Your vehicle-related expenses suggest motor insurance is important for you.",
        "Credit": "Your financial transactions indicate credit protection insurance could be valuable.",
        "Liability": "Your liability-related expenses suggest liability insurance coverage would be beneficial.",
        "Accident": "Your activities suggest accident insurance coverage would provide important protection.",
        "Home": "Your home-related expenses indicate home insurance would be a valuable protection."
    }
    
    # Add specific examples from the data
    if insurance_type in ["Health", "Life", "Travel", "Motor"]:
        # Get top spending categories for this insurance type
        if 'Withdrawal' in df.columns:
            spending_col = 'Withdrawal'
        elif 'Debit' in df.columns:
            spending_col = 'Debit'
        else:
            return reasons[insurance_type]
        
        type_df = df[df['InsuranceLabel'] == insurance_type]
        if not type_df.empty:
            top_categories = type_df.groupby('Category')[spending_col].sum().nlargest(3).index.tolist()
            if top_categories:
                categories_str = ", ".join(top_categories)
                reasons[insurance_type] += f" Top spending categories: {categories_str}."
    
    return reasons[insurance_type]

def generate_insurance_recommendations(df: pd.DataFrame, insurance_labels: pd.Series, spending_by_category: Optional[pd.Series] = None) -> Tuple[pd.Series, Optional[pd.Series], Dict[str, Dict[str, Any]]]:
    """Generate personalized insurance recommendations based on spending patterns."""
    # Count insurance labels
    insurance_counts = df['InsuranceLabel'].value_counts()
    
    # Calculate total spending by insurance type
    if 'Withdrawal' in df.columns:
        spending_col = 'Withdrawal'
    elif 'Debit' in df.columns:
        spending_col = 'Debit'
    else:
        spending_col = None
        logger.warning("No spending column identified for insurance recommendations")
    
    insurance_spending = None
    if spending_col:
        insurance_spending = df.groupby('InsuranceLabel')[spending_col].sum().sort_values(ascending=False)
    
    # Generate recommendations
    recommendations = {}
    threshold = 0.15  # Threshold for significant spending (15% of total)
    
    if insurance_spending is not None:
        total_spending = insurance_spending.sum()
        
        for ins_type, amount in insurance_spending.items():
            if ins_type != 'Other' and ins_type != 'Error' and ins_type != 'API Error':
                percentage = amount / total_spending
                if percentage > threshold:
                    priority = "High" if percentage > 0.25 else "Medium"
                    recommendations[ins_type] = {
                        "priority": priority,
                        "percentage": percentage * 100,
                        "amount": amount,
                        "reason": get_recommendation_reason(ins_type, df)
                    }
    
    return insurance_counts, insurance_spending, recommendations

def get_category_insights(df: pd.DataFrame) -> Dict[str, CategoryInsight]:
    """Get detailed insights for top spending categories."""
    if 'Category' not in df.columns:
        logger.warning("Category column not found in dataframe")
        return {}
    
    if 'Withdrawal' in df.columns:
        spending_col = 'Withdrawal'
    elif 'Debit' in df.columns:
        spending_col = 'Debit'
    else:
        logger.warning("No spending column identified")
        return {}
    
    # Get top categories
    top_categories = df.groupby('Category')[spending_col].sum().nlargest(5)
    category_insights = {}

    for category in top_categories.index:
        category_df = df[df['Category'] == category]

        # Calculate statistics
        total_spent = category_df[spending_col].sum()
        avg_transaction = category_df[spending_col].mean()
        transaction_count = len(category_df)

        # Get most common insurance label for this category
        if 'InsuranceLabel' in df.columns and not category_df['InsuranceLabel'].empty:
            top_insurance = category_df['InsuranceLabel'].value_counts().idxmax()
        else:
            top_insurance = "N/A"
            
        category_insights[category] = CategoryInsight(
            total_spent=total_spent,
            average_transaction=avg_transaction,
            transaction_count=transaction_count,
            recommended_insurance=top_insurance
        )
    
    return category_insights

def get_financial_advice(df: pd.DataFrame, recommendations: Dict[str, Dict[str, Any]]) -> FinancialAdvice:
    """Generate personalized financial advice based on spending patterns."""
    # Basic spending metrics
    if 'Withdrawal' in df.columns:
        spending_col = 'Withdrawal'
    elif 'Debit' in df.columns:
        spending_col = 'Debit'
    else:
        logger.warning("No spending column identified")
        return FinancialAdvice(total_spending=0)
    
    # Calculate metrics
    total_spending = df[spending_col].sum()
    avg_monthly_spending = None
    budget_recommendation = None
    
    # If we have date information
    if 'MonthYear' in df.columns:
        months_count = df['MonthYear'].nunique()
        if months_count > 0:
            avg_monthly_spending = total_spending / months_count
            budget_recommendation = avg_monthly_spending * 0.9  # 10% reduction recommendation
    
    # Get high frequency small transactions (potential savings opportunity)
    savings_opportunities = {}
    small_transactions = df[df[spending_col] < df[spending_col].quantile(0.25)]
    high_freq_categories = small_transactions.groupby('Category').size().sort_values(ascending=False).head(3)
    
    if not high_freq_categories.empty:
        for category, count in high_freq_categories.items():
            category_total = small_transactions[small_transactions['Category'] == category][spending_col].sum()
            savings_opportunities[category] = {
                "transaction_count": int(count),
                "total_amount": float(category_total)
            }
    
    # Create advice object
    advice = FinancialAdvice(
        total_spending=total_spending,
        avg_monthly_spending=avg_monthly_spending,
        budget_recommendation=budget_recommendation,
        savings_opportunities=savings_opportunities if savings_opportunities else None,
        insurance_recommendations={k: {"priority": v["priority"], "percentage": v["percentage"]} for k, v in recommendations.items()} if recommendations else None
    )
    
    return advice

def generate_text_summary(transaction_count: int, 
                        total_spending: float, 
                        top_categories: Dict[str, float],
                        category_insights: Dict[str, CategoryInsight],
                        insurance_recommendations: Dict[str, InsuranceRecommendation],
                        financial_advice: FinancialAdvice) -> str:
    """Generate a comprehensive text summary of the analysis."""
    summary = []
    
    # Overall summary
    summary.append(f"FINANCIAL TRANSACTION ANALYSIS SUMMARY")
    summary.append(f"=====================================")
    summary.append(f"Analyzed {transaction_count} transactions with total spending of {total_spending:.2f}")
    
    # Top spending categories
    summary.append(f"\nTOP SPENDING CATEGORIES")
    summary.append(f"----------------------")
    for i, (category, amount) in enumerate(top_categories.items(), 1):
        if i > 5:  # Limit to top 5
            break
        summary.append(f"{i}. {category}: {amount:.2f} ({(amount/total_spending)*100:.1f}%)")
    
    # Category insights
    summary.append(f"\nCATEGORY INSIGHTS")
    summary.append(f"----------------")
    for category, insight in category_insights.items():
        summary.append(f"{category}:")
        summary.append(f"  - Total Spent: {insight.total_spent:.2f}")
        summary.append(f"  - Average Transaction: {insight.average_transaction:.2f}")
        summary.append(f"  - Number of Transactions: {insight.transaction_count}")
        summary.append(f"  - Recommended Insurance: {insight.recommended_insurance}")
    
    # Insurance recommendations
    if insurance_recommendations:
        summary.append(f"\nINSURANCE RECOMMENDATIONS")
        summary.append(f"------------------------")
        for ins_type, details in sorted(insurance_recommendations.items(), 
                                      key=lambda x: (0 if x[1].priority == 'High' else 1, -x[1].percentage)):
            summary.append(f"{ins_type} Insurance - {details.priority} Priority")
            summary.append(f"  - Spending Percentage: {details.percentage:.2f}%")
            summary.append(f"  - Total Amount: {details.amount:.2f}")
            summary.append(f"  - Recommendation: {details.reason}")
    
    # Financial advice
    summary.append(f"\nPERSONALIZED FINANCIAL ADVICE")
    summary.append(f"----------------------------")
    summary.append(f"Overall Spending Analysis:")
    summary.append(f"  - Total Analyzed Spending: {financial_advice.total_spending:.2f}")
    
    if financial_advice.avg_monthly_spending:
        summary.append(f"  - Average Monthly Spending: {financial_advice.avg_monthly_spending:.2f}")
    
    if financial_advice.budget_recommendation:
        summary.append(f"  - Budget Recommendation: Consider setting a monthly budget of {financial_advice.budget_recommendation:.2f} to reduce expenses by 10%.")
    
    if financial_advice.savings_opportunities:
        summary.append(f"\nSavings Opportunities:")
        summary.append(f"You have frequent small transactions in these categories:")
        for category, details in financial_advice.savings_opportunities.items():
            summary.append(f"  - {category}: {details['transaction_count']} transactions totaling {details['total_amount']:.2f}")
        summary.append(f"Recommendation: Consider consolidating these small purchases to reduce impulse spending.")
    
    if financial_advice.insurance_recommendations:
        summary.append(f"\nInsurance Coverage Recommendations:")
        summary.append(f"Based on your spending patterns, we recommend prioritizing these insurance types:")
        for ins_type, details in financial_advice.insurance_recommendations.items():
            summary.append(f"  - {ins_type} Insurance ({details['priority']} Priority): {details['percentage']:.2f}% of your spending")
        summary.append(f"Recommendation: Review your current insurance coverage to ensure you're adequately protected.")
    
    return "\n".join(summary)

def process_transactions(csv_data: str) -> AnalysisResponse:
    """Process CSV data and generate analysis results."""
    logger.info("Starting transaction analysis")
    
    # Read the CSV data
    df = pd.read_csv(StringIO(csv_data))
    logger.info(f"Loaded CSV with {df.shape[0]} transactions and {df.shape[1]} columns")
    
    # Parse dates and preprocess data
    df, date_col = parse_dates(df)
    df = preprocess_dataframe(df)
    
    # Determine spending column
    if 'Withdrawal' in df.columns:
        spending_col = 'Withdrawal'
    elif 'Debit' in df.columns:
        spending_col = 'Debit'
    else:
        # Try to identify spending column
        for col in df.columns:
            if df[col].dtype in [np.float64, np.int64] and df[col].sum() > 0:
                spending_col = col
                break
        else:
            spending_col = None
            logger.warning("No spending column identified")
    
    # Get total spending
    total_spending = df[spending_col].sum() if spending_col else 0
    
    # Initialize the insurance label column
    df['InsuranceLabel'] = 'Unknown'
    
    # Process each row for insurance labels
    total_rows = len(df)
    logger.info(f"Processing {total_rows} transactions for insurance labeling")
    
    for i, row in df.iterrows():
        # Extract relevant fields
        category = str(row.get('Category', '')) if pd.notna(row.get('Category', '')) else ''
        withdrawal = str(row.get('Withdrawal', 0)) if pd.notna(row.get('Withdrawal', 0)) else '0'
        deposit = str(row.get('Deposit', 0)) if pd.notna(row.get('Deposit', 0)) else '0'
        ref_no = str(row.get('RefNo', '')) if pd.notna(row.get('RefNo', '')) else ''
        remark = str(row.get('Remark','')) if pd.notna(row.get('Remark','')) else ''
        
        # Get insurance label
        label = get_insurance_label(category, withdrawal, deposit, ref_no, remark)
        df.at[i, 'InsuranceLabel'] = label
        
        # Log progress occasionally
        if (i + 1) % 50 == 0 or (i + 1) == total_rows:
            logger.info(f"Processed {i + 1}/{total_rows} transactions")
        
        # Add a small delay to avoid API rate limits
        time.sleep(0.1)
    
    logger.info("Finished labeling transactions")
    
    # Analyze spending patterns
    logger.info("Analyzing spending patterns")
    weekly_spending, monthly_spending, yearly_spending = analyze_spending_by_period(df, date_col)
    category_spending, category_over_time = analyze_spending_by_category(df, date_col)
    
    # Generate insurance recommendations
    logger.info("Generating insurance recommendations")
    insurance_counts, insurance_spending, recommendation_data = generate_insurance_recommendations(
        df, df['InsuranceLabel'], category_spending
    )
    
    # Get category insights
    category_insights_data = get_category_insights(df)
    
    # Get financial advice
    financial_advice_data = get_financial_advice(df, recommendation_data)
    
    # Format data for response
    # Top categories
    top_categories = {}
    if category_spending is not None:
        top_categories = category_spending.nlargest(5).to_dict()
    
    # Top insurance labels
    top_insurance_labels = {}
    if insurance_counts is not None:
        top_insurance_labels = insurance_counts.to_dict()
    
    # Weekly trend
    weekly_trend = {}
    if weekly_spending is not None:
        weekly_trend = weekly_spending.tail(10).to_dict()  # Last 10 weeks
    
    # Monthly trend
    monthly_trend = {}
    if monthly_spending is not None:
        monthly_trend = monthly_spending.to_dict()
    
    # Daily averages
    daily_averages = {}
    if 'Day' in df.columns and spending_col:
        days_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        daily_avg = df.groupby('Day')[spending_col].mean().reindex(days_order)
        daily_averages = daily_avg.to_dict()
    
    # Insurance recommendations
    insurance_recommendations = {}
    for ins_type, details in recommendation_data.items():
        insurance_recommendations[ins_type] = InsuranceRecommendation(
            priority=details["priority"],
            percentage=details["percentage"],
            amount=details["amount"],
            reason=details["reason"]
        )
    
    # Create spending patterns object
    spending_patterns = SpendingPatterns(
        top_categories=top_categories,
        top_insurance_labels=top_insurance_labels,
        weekly_trend=weekly_trend,
        monthly_trend=monthly_trend,
        daily_averages=daily_averages
    )
    
    # Generate text summary
    summary = generate_text_summary(
        len(df), 
        total_spending, 
        top_categories,
        category_insights_data,
        insurance_recommendations,
        financial_advice_data
    )
    
    # Create response object
    response = AnalysisResponse(
        transaction_count=len(df),
        total_spending=total_spending,
        spending_patterns=spending_patterns,
        category_insights=category_insights_data,
        insurance_recommendations=insurance_recommendations,
        financial_advice=financial_advice_data,
        summary=summary
    )
    
    logger.info("Analysis completed successfully")
    return response