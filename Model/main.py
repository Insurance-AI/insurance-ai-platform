from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
from io import StringIO
import logging

from financial_analyzer import process_transactions
from models import AnalysisResponse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Financial Transaction Analyzer API",
    description="API for analyzing financial transactions and providing insurance recommendations",
    version="1.0.0"
)

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Financial Transaction Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "/analyze": "POST endpoint to upload and analyze transactions CSV"
        }
    }

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_transactions(file: UploadFile = File(...)):
    """
    Analyze financial transactions from a CSV file
    
    - **file**: CSV file containing transaction data
    
    Returns analysis results including spending patterns and insurance recommendations
    """
    try:
        logger.info(f"Received file: {file.filename}")
        
        # Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
        # Read file content
        contents = await file.read()
        csv_data = contents.decode('utf-8')
        
        # Process the CSV data
        analysis_results = process_transactions(csv_data)
        
        logger.info("Analysis completed successfully")
        return analysis_results
        
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)