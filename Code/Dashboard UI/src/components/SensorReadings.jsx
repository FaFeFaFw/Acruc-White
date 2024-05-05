import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SensorReadings = () => {
  const [sensorData, setSensorData] = useState({
    CO2: 0,
    Temperature: 0,
    TVOC: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/sensor_data');
        console.log('Fetching sensor data from /sensor_data');
        setSensorData({
          CO2: calculateAQI_CO2(response.data.CO2),
          Temperature: calculateAQI_Temperature(response.data.Temperature),
          TVOC: calculateAQI_TVOC(response.data.TVOC),
        });
        setIsLoading(false);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch sensor data from /sensor_data:', error.response ? error.response.data : error.message);
        setError('Failed to fetch sensor data');
        setIsLoading(false);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000); // fetch data every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const calculateAQI_CO2 = (co2) => {
    if (co2 <= 800) return 50;
    if (co2 <= 1200) return 100;
    if (co2 <= 1600) return 150;
    if (co2 <= 2000) return 200;
    return 250;
  };

  const calculateAQI_Temperature = (temp) => {
    if (temp < 18 || temp > 26) return 150;
    return 50;
  };

  const calculateAQI_TVOC = (tvoc) => {
    if (tvoc <= 500) return 50;
    if (tvoc <= 1000) return 100;
    if (tvoc <= 1500) return 150;
    if (tvoc <= 2000) return 200;
    return 250;
  };

  const chartData = {
    labels: ['CO2', 'Temperature', 'TVOC'],
    datasets: [
      {
        label: 'Sensor AQI',
        data: [sensorData.CO2, sensorData.Temperature, sensorData.TVOC],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 300,
      },
    },
    legend: {
      display: true,
    },
  };

  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box>
        <Typography variant="h6">Loading sensor data...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6">Sensor Readings</Typography>
      <Bar data={chartData} options={chartOptions} />
    </Box>
  );
};

export default SensorReadings;