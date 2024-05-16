import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Box } from '@mui/material';
import Chart from 'chart.js/auto';
import useSensorData from '../hooks/useSensorData';

const AirQualityGraph = () => {
  const { sensorData, isLoading, error } = useSensorData(100); // Fetch data every 0.1 second
  const [co2Data, setCo2Data] = useState({
    labels: [],
    datasets: [
      {
        label: 'CO2',
        data: [],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  });

  useEffect(() => {
    if (!isLoading && !error && sensorData.CO2) {
      const currentTimestamp = new Date().toLocaleTimeString(); // Get current time in HH:MM:SS format
      const co2Value = sensorData.CO2;

      setCo2Data(prevState => {
        // Log the current state for debugging
        console.log('Updating chart data', {
          labels: [...prevState.labels, currentTimestamp].slice(-50),
          data: [...prevState.datasets[0].data, co2Value].slice(-50),
        });

        return {
          labels: [...prevState.labels, currentTimestamp].slice(-50), // Keep the latest 50 entries
          datasets: [
            {
              ...prevState.datasets[0],
              data: [...prevState.datasets[0].data, co2Value].slice(-50), // Keep the latest 50 entries
            },
          ],
        };
      });
    }
  }, [sensorData, isLoading, error]);

  if (isLoading) {
    return <div>Loading CO2 data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <Box sx={{ height: 400 }}>
      <Line data={co2Data} />
    </Box>
  );
};

export default AirQualityGraph;
