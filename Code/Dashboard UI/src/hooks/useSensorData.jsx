// src/hooks/useSensorData.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const useSensorData = () => {
    const [sensorData, setSensorData] = useState({
        CO2: 0,
        Temperature: 0,
        TVOC: 0,
        timestamp: Date.now()
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                //const response = await axios.get('http://localhost:8000/sensor_data');
                const response = await axios.get(`http://localhost:8000/sensor_data?timestamp=${new Date().getTime()}`);
                setSensorData({
                    CO2: response.data.CO2,
                    Temperature: response.data.Temperature,
                    TVOC: response.data.TVOC,
                    timestamp: response.data.timestamp
                });
                setIsLoading(false);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch sensor data:', error.response ? error.response.data : error.message);
                setError('Failed to fetch sensor data');
                setIsLoading(false);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 3000); // fetch data every 3 seconds

        return () => clearInterval(intervalId);
    }, []);

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         if (Date.now() - sensorData.timestamp > STALE_THRESHOLD) {
    //             setError('Sensor data is stale');
    //         }
    //     }, 1000);

    //     return () => clearInterval(intervalId);
    // }, [sensorData.timestamp]);

    return { sensorData, isLoading, error };
};

export default useSensorData;
