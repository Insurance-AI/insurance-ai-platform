from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import uvicorn
from io import StringIO
import logging
from fastapi.logger import logger
import pandas as pd
import numpy as np
import unicodedata
import re

from financial_analyzer import process_transactions
from insurance_predictor import recommend
from models import AnalysisResponse
from models import InsuranceRequest

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Financial Transaction & Insurance Analyzer API",
    description="Analyze transactions and recommend insurance plans",
    version="1.0.0"
)

# Load and normalize insurance data
insurance_details = pd.read_csv("insurance_details.csv")

def normalize_plan_name(name):
    name = str(name)
    name = unicodedata.normalize('NFKD', name)
    name = re.sub(r"[‘’´`]", "'", name)
    name = re.sub(r"\s+", " ", name).strip()
    return name.lower()

# Normalize insurance names for matching
insurance_details['normalized_name'] = insurance_details['Insurance Name'].apply(normalize_plan_name)

@app.get("/")
async def root():
    return {
        "message": "Combined Financial & Insurance Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "/analyze": "Upload transaction CSV",
            "/predict": "Submit user data to get insurance plan recommendations"
        }
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_transactions(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file: {file.filename}")
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are supported")
        contents = await file.read()
        csv_data = contents.decode('utf-8')
        analysis_results = process_transactions(csv_data)
        return analysis_results
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/predict")
async def predict_plan(data: InsuranceRequest):
    try:
        logger.info("Received insurance prediction request")

        recommendations = recommend(data.dict())
        valid_plans = []
        user_data = data.dict()
        user_age = user_data['Age']
        user_income = user_data['Annual_Income']
        user_premium = user_data['Desired_Sum_Assured']

        for rec in recommendations:
            normalized_name = normalize_plan_name(rec['plan'])
            match = insurance_details[insurance_details['normalized_name'] == normalized_name]

            if match.empty:
                logger.warning(f"No match found for plan: {rec['plan']}")
                continue

            plan = match.iloc[0]
            min_age = int(plan['Entry Age Min'])
            max_age = int(plan['Entry Age Max'])

            if min_age <= user_age <= max_age:
                valid_plans.append({
                    "plan": str(rec['plan']),
                    "confidence": float(rec['confidence']),
                    "type": str(plan['Insurance Type']),
                    "features": str(plan['Features']),
                    "CSR": str(plan['CSR']),
                    "sum_assured_range": f"{int(plan['Sum Assured Min'])} - {int(plan['Sum Assured Max'])}",
                    "premium_range": f"{int(plan['Premium Min'])} - {int(plan['Premium Max'])}",
                    "medical_required": str(plan['Requires Medical Exam']),
                    "return_of_premium": str(plan['Return of Premium']),
                    "policy_term_range": str(plan['Policy Term Range']),
                    "life_cover_till_age": str(plan['Life Cover Till Age']),
                    "payout_type": str(plan['Payout Type']),
                    "riders_available": str(plan['Riders Available']),
                    "income_criteria": str(plan['Income Criteria']),
                    "payment_option": str(plan['Premium Payment Option']),
                    "death_benefit_option": str(plan['Death Benefit Option'])
                })

        return {"recommendations": valid_plans}

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
