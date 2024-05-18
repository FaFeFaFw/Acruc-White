import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import Chart from 'chart.js/auto';
import useSensorData from '../hooks/useSensorData';

const AirQualityGraph = () => {
  const { sensorData, isLoading, error } = useSensorData();
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
  const [sensorTimestamp, setSensorTimestamp] = useState(0);

  useEffect(() => {
    const currentTime = Date.now();
    const dataTimestamp = sensorData.timestamp;
    const diff = currentTime - dataTimestamp;

    if (dataTimestamp) {
      setSensorTimestamp(new Date(dataTimestamp).toLocaleString()); // Convert to human-readable format
    }

    // setTimeDifference(dataTimestamp);

    if (!isLoading && !error && sensorData.CO2) {
      const currentTimestamp = new Date().toLocaleTimeString(); // Get current time in HH:MM:SS format
      const co2Value = sensorData.CO2;

      setCo2Data(prevState => {
        // Log the current state for debugging
        console.log('Updating chart data', {
          labels: [...prevState.labels, currentTimestamp].slice(-10),
          data: [...prevState.datasets[0].data, co2Value].slice(-10),
        });

        return {
          labels: [...prevState.labels, currentTimestamp].slice(-10), // Keep the latest 10 entries
          datasets: [
            {
              ...prevState.datasets[0],
              data: [...prevState.datasets[0].data, co2Value].slice(-10), // Keep the latest 10 entries
            },
          ],
        };
      });
    } else {
      console.log('Data is stale, not updating the plot');
    }
  }, [sensorData, isLoading, error]);

  if (isLoading) {
    return <div>Loading CO2 data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <Line data={co2Data} options={{ responsive: true, maintainAspectRatio: false }} />
      <Typography variant="body1" align="center" marginTop={2}>
        TSensor Timestamp: {sensorTimestamp}
      </Typography>
    </Box>
  );
};

export default AirQualityGraph;
