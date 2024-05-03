// Mock API data for the "flower" app development

console.log("Mock API for sensor data and air quality index is loaded.");

// Function to simulate fetching sensor data
export const fetchSensorData = async () => {
  try {
    console.log("Fetching mock sensor data...");
    // Simulating a delay to mimic network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Returning mock data
    return {
      CO2: 400,
      Temperature: 22,
      TVOC: 150
    };
  } catch (error) {
    console.error("Error fetching mock sensor data: ", error.message);
    throw error;
  }
};

// Function to simulate fetching air quality index data
export const fetchAirQualityIndex = async () => {
  try {
    console.log("Fetching mock air quality index data...");
    // Simulating a delay to mimic network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Returning mock data
    return {
      AQI: 50,
      historicalData: [
        { timestamp: '2023-01-01T00:00:00Z', AQI: 45 },
        { timestamp: '2023-01-02T00:00:00Z', AQI: 50 },
        { timestamp: '2023-01-03T00:00:00Z', AQI: 55 }
      ]
    };
  } catch (error) {
    console.error("Error fetching mock air quality index data: ", error.message);
    throw error;
  }
};