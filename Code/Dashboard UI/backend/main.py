from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS middleware setup
origins = [
    "http://localhost:3000",  # Assuming the React frontend runs on localhost:3000
    "http://localhost:5173",  # Added to allow requests from this origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SensorData(BaseModel):
    CO2: int
    Temperature: float
    TVOC: int

class AQIData(BaseModel):
    AQI: int
    historicalData: list

# Mock data for demonstration
mock_sensor_data = {
    "CO2": 2000,
    "Temperature": 22.0,
    "TVOC": 150
}

mock_aqi_data = {
    "AQI": 50,
    "historicalData": [
        {"timestamp": "2023-01-01T00:00:00Z", "AQI": 45},
        {"timestamp": "2023-01-02T00:00:00Z", "AQI": 50},
        {"timestamp": "2023-01-03T00:00:00Z", "AQI": 55},
    ]
}

@app.get("/sensor_data", response_model=SensorData)
async def get_sensor_data():
    try:
        logger.info("Fetching sensor data")
        return mock_sensor_data
    except Exception as e:
        logger.error(f"Error fetching sensor data: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error fetching sensor data")

@app.get("/aqi_data", response_model=AQIData)
async def get_aqi_data():
    try:
        logger.info("Fetching AQI data")
        return mock_aqi_data
    except Exception as e:
        logger.error(f"Error fetching AQI data: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error fetching AQI data")