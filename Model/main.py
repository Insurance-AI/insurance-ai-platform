from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import uvicorn
from io import StringIO
import logging

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
        print(recommendations)
        return {"recommendations": recommendations}
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
