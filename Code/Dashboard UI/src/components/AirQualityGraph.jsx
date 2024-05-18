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
        segment: {
          borderColor: (ctx) => {
            const value = ctx.p0.parsed.y;
            return value > 2500 ? 'red' : value > 1000 ? 'yellow' : 'rgba(75, 192, 192, 0.2)';
          },
        },
      },
    ],
  });
  const [sensorTimestamp, setSensorTimestamp] = useState(0);

  useEffect(() => {
    const currentTime = Date.now();
    const dataTimestamp = sensorData.timestamp;

    if (dataTimestamp) {
      setSensorTimestamp(new Date(dataTimestamp).toLocaleString('en-US')); // Convert to human-readable format
    }

    if (!isLoading && !error && sensorData.CO2) {
      const currentTimestamp = new Date().toLocaleTimeString('en-US'); // Get current time in HH:MM:SS format
      const co2Value = sensorData.CO2;

      setCo2Data((prevState) => {
        // Log the current state for debugging
        console.log('Updating chart data', {
          labels: [...prevState.labels, currentTimestamp].slice(-50),
          data: [...prevState.datasets[0].data, co2Value].slice(-50),
        });

        const newDataset = {
          ...prevState.datasets[0],
          data: [...prevState.datasets[0].data, co2Value].slice(-50),
        };

        return {
          labels: [...prevState.labels, currentTimestamp].slice(-50), // Keep the latest 50 entries
          datasets: [newDataset],
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
      <Line
        data={co2Data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 400,
              max: 4000,
              ticks: {
                callback: function (value) {
                  return value; // Displaying values directly
                },
              },
            },
          },
        }}
      />
      {/* <Typography variant="body1" align="center" marginTop={2}>
        Sensor Timestamp: {sensorTimestamp}
      </Typography> */}
    </Box>
  );
};

export default AirQualityGraph;
