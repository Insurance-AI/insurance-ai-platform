import requests
import json
import logging
import os
from typing import Dict, Any, Optional

# Configure logging
logger = logging.getLogger(__name__)

# Get API key from environment variable or use the default one
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyDDUk6hzrBSPlH60nJ8GKJfY5yrhBaNz90")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"

def get_insurance_label(category: str, withdrawal: str, deposit: str, ref_no: str, remark: str) -> str:
    """
    Call the Gemini API to determine the most suitable insurance type based on transaction details.
    
    Args:
        category: Transaction category
        withdrawal: Withdrawal amount
        deposit: Deposit amount
        ref_no: Reference number
        remark: Transaction remark or description
        
    Returns:
        Insurance label (Life, Health, Accident, Motor, Credit, Liability, Travel, Home, or Other)
    """
    # Enhanced prompt for the Gemini API
    prompt = f"""
    You are an expert financial assistant. Based on the following transaction, determine the most suitable type of insurance the person might need based on their spending behavior and context. Analyze the remark and category fields like a human would, considering what kind of activity the person is doing.

Choose ONLY from the following insurance types:
- Life
- Health
- Accident
- Motor
- Credit
- Liability
- Travel
- Home

If none of the above applies, respond with "Other".

### Considerations:
- Medical, hospital, pharmacy, diagnostic lab = Health
- Food delivery, dining out, party, snacks, restaurants,smoke ,medical = Life (general wellbeing)
- Bus, train, toll, fuel, ride services (e.g., Uber) , Uber = Travel
- Driving-related, vehicle repairs, fuel station = Motor
- School fees, tuition, courses, educational services = Liability
- Loans, EMI payments, credit cards, finance-related , bond , fund , deposite ,stock,Dividend , related to any finance event = Credit
- Insurance-related payments (home, property, car) = Use exact match: Home, Motor, etc.
- Gym, fitness, sports injuries, risky activities = Accident
- Real estate, property purchases, house repairs = Home

### Transaction:
- Category: {category}
- Remark: {remark}
- Withdrawal amount: {withdrawal}
- Deposit amount: {deposit}
- Reference No: {ref_no}

Respond with only one of the 8 categories or "Other". Do not explain your reasoning.
"""
    
    # Prepare the payload for the API request
    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }
    
    # Set headers for the API request
    headers = {
        "Content-Type": "application/json"
    }
    
    # Make API request
    try:
        response = requests.post(GEMINI_API_URL, headers=headers, data=json.dumps(payload))
        
        if response.status_code == 200:
            result = response.json()
            # Extract the text from the response
            if "candidates" in result and len(result["candidates"]) > 0:
                if "content" in result["candidates"][0] and "parts" in result["candidates"][0]["content"]:
                    return result["candidates"][0]["content"]["parts"][0]["text"].strip()
            return "Other"  # Default if we can't parse the response
        else:
            print(f"API Error: {response.status_code} - {response.text}")
            return "API Error"
    except Exception as e:
        print(f"Exception during API call: {e}")
        return "Error"