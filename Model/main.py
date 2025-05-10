from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import uvicorn
from io import StringIO
import logging
from fastapi.logger import logger
import pandas as pd
import numpy as np

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

insurance_details = pd.read_csv("insurance_details.csv")


# Root
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


# Transaction Analysis Endpoint
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

        # print("Raw recommendations:", recommendations)

        valid_plans = []
        user_data = data.dict()
        user_age = user_data['Age']
        user_income = user_data['Annual_Income']
        user_premium = user_data['Desired_Sum_Assured']

        for rec in recommendations:
            plan_name = rec['plan']
            match = insurance_details[insurance_details['Plan Name'] == plan_name]

            if match.empty:
                continue 

            plan = match.iloc[0]
            min_age = int(plan['Min Age'])
            max_age = int(plan['Max Age'])

            if (
                min_age <= user_age <= max_age
            ):
                valid_plans.append({
                    "plan": plan_name,
                    "confidence": rec['confidence'],
                    "type": plan['Plan Type'],
                    "description": plan['Description'],
                    "coverage": plan['Coverage'],
                    "exclusions": plan['Exclusions'],
                    "payment_frequency": plan['Payment Frequency']
                })

        return {"recommendations": valid_plans}

    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
