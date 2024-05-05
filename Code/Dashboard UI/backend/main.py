from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
# Logging module for logging messages
import logging

# Start importing MQTT client
# from mqtt_client import start_mqtt_client

# Instantiate the FastAPI app
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


class Metrics(BaseModel):
    dataLoss: float
    avgCO2: int
    avgTemp: int
    avgTVOC: int
    flowerPetal: bool

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

mock_metrics_data = {
    "dataLoss": 5.2,
    "avgCO2": 2000,
    "avgTemp": 26.0,
    "avgTVOC": 200,
    "flowerPetal": False
}

def startup_events():
    # start_mqtt_client()  # Start MQTT client on API startup
    pass

def shutdown_events():
    pass

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start up tasks for the API
    startup_events()
    yield
    # Clean up the ML models and release the resources
    shutdown_events()

# Define the API endpoints

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
    
@app.get("/metrics_data", response_model=Metrics)
async def get_metrics():
    # Sample data which might be dynamically calculated or fetched from a database
    try:
        logger.info("Fetching metrics data")
        return mock_metrics_data
    except Exception as e:
        logger.error(f"Error fetching metrics data: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Error fetching sensor data")


# Control the flower via a POST request
class FlowerCommand(BaseModel):
    petal_open: Optional[bool] = None

@app.post("/flower")
async def control_flower(command: FlowerCommand):
    logger.info("Sending Flower command to the system...")
    response = {"status": "success", "data": command}
    logger.info(f"Received flower command: {command}")
    print(f"Received flower command: {command}")
    # Handle the command, e.g., send via MQTT
    # For now, just return the command
    return response