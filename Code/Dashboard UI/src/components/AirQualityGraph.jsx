import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Box } from '@mui/material';
import axios from 'axios';
import Chart from 'chart.js/auto';

const AirQualityGraph = () => {
  const [aqiData, setAqiData] = useState({
    labels: [],
    datasets: [
      {
        label: 'AQI',
        data: [],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Attempting to fetch AQI data from /aqi_data...');
        const response = await axios.get('http://localhost:8000/aqi_data');
        const fetchedData = response.data;
        const updatedLabels = fetchedData.historicalData.map(data => data.timestamp.split('T')[0]);
        const updatedData = fetchedData.historicalData.map(data => data.AQI);
        setAqiData(prevState => ({
          ...prevState,
          labels: updatedLabels,
          datasets: [
            {
              ...prevState.datasets[0],
              data: updatedData,
            },
          ],
        }));
        console.log('AQI data fetched successfully from /aqi_data.');
      } catch (error) {
        console.error('Failed to fetch AQI data from /aqi_data:', error);
        console.error(error.response ? error.response.data : error.message);
      }
    };

    const intervalId = setInterval(() => {
      fetchData();
    }, 5000); // Fetch new data every 5 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
      console.log('Cleaned up interval for AQI data fetching.');
    };
  }, []);

  return (
    <Box sx={{ height: 400 }}>
      <Line data={aqiData} />
    </Box>
  );
};

export default AirQualityGraph;