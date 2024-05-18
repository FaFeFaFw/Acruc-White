import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import Chart from 'chart.js/auto';
import useSensorData from '../hooks/useSensorData';

const AQIGraph = ({ co2Percentage, tvocPercentage }) => {
  const { sensorData, isLoading, error } = useSensorData();
  const [aqiData, setAqiData] = useState({
    labels: [],
    datasets: [
      {
        label: 'AQI',
        data: [],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
        segment: {
          borderColor: (ctx) => {
            const value = ctx.p0.parsed.y;
            return value > 2 ? 'red' : value > 1 ? 'yellow' : 'rgba(75, 192, 192, 0.2)';
          },
        },
      },
    ],
  });
  const [sensorTimestamp, setSensorTimestamp] = useState(0);

  const calculateAQI = (co2, tvoc) => {
    return (co2 / 2000) * (co2Percentage / 100) + (tvoc / 200) * (tvocPercentage / 100);
  };

  useEffect(() => {
    const currentTime = Date.now();
    const dataTimestamp = sensorData.timestamp;

    if (dataTimestamp) {
      setSensorTimestamp(new Date(dataTimestamp).toLocaleString('en-US')); // Convert to human-readable format
    }

    if (!isLoading && !error && sensorData.CO2 && sensorData.TVOC) {
      const currentTimestamp = new Date().toLocaleTimeString('en-US'); // Get current time in HH:MM:SS format
      const aqiValue = calculateAQI(sensorData.CO2, sensorData.TVOC);

      setAqiData((prevState) => {
        const newLabels = [...prevState.labels, currentTimestamp].slice(-50);
        const newData = [...prevState.datasets[0].data, aqiValue].slice(-50);

        return {
          labels: newLabels,
          datasets: [
            {
              ...prevState.datasets[0],
              data: newData,
            },
          ],
        };
      });
    } else {
      console.log('Data is stale, not updating the plot');
    }
  }, [sensorData, isLoading, error]);

  useEffect(() => {
    setAqiData((prevState) => {
      if (prevState.datasets[0].data.length === 0) {
        return prevState;
      }
      const lastAQI = prevState.datasets[0].data[prevState.datasets[0].data.length - 1];
      const lastLabel = prevState.labels[prevState.labels.length - 1];
      const newAQI = calculateAQI(sensorData.CO2, sensorData.TVOC);

      const updatedData = prevState.datasets[0].data.map((value, index) => {
        if (index === prevState.datasets[0].data.length - 1) {
          return newAQI;
        }
        return value;
      });

      return {
        labels: prevState.labels,
        datasets: [
          {
            ...prevState.datasets[0],
            data: updatedData,
          },
        ],
      };
    });
  }, [co2Percentage, tvocPercentage]);

  if (isLoading) {
    return <div>Loading AQI data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <Line
        data={aqiData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              min: 0,
              max: 4,
              ticks: {
                callback: function (value) {
                  return value; // Displaying values directly
                },
              },
            },
          },
        }}
      />
      <Typography variant="body1" align="center" marginTop={2}>
        Sensor Timestamp: {sensorTimestamp}
      </Typography>
    </Box>
  );
};

export default AQIGraph;
