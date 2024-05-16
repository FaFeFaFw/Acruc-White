import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Box } from '@mui/material';
import Chart from 'chart.js/auto';
import useSensorData from '../hooks/useSensorData';

const SensorReading = () => {
  const { sensorData, isLoading, error } = useSensorData(); // Fetch data every 0.1 second
  const [tvocData, setTvocData] = useState({
    labels: [],
    datasets: [
      {
        label: 'TVOC',
        data: [],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
      },
    ],
  });

  const chartRef = useRef(null);

  useEffect(() => {
    if (!isLoading && !error && sensorData.TVOC) {
      const currentTimestamp = new Date().toLocaleTimeString(); // Get current time in HH:MM:SS format
      const tvocValue = sensorData.TVOC;

      setTvocData(prevState => {
        const newLabels = [...prevState.labels, currentTimestamp].slice(-50); // Keep the latest 50 entries
        const newData = [...prevState.datasets[0].data, tvocValue].slice(-50); // Keep the latest 50 entries

        if (chartRef.current) {
          chartRef.current.data.labels = newLabels;
          chartRef.current.data.datasets[0].data = newData;

          // Adjust y-axis limits based on TVOC value
          const minY = Math.min(...newData, 0);
          const maxY = Math.max(...newData, 30);
          chartRef.current.options.scales.y.min = minY;
          chartRef.current.options.scales.y.max = maxY;

          chartRef.current.update();
        }

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
    }
  }, [sensorData, isLoading, error]);

  const options = {
    scales: {
      y: {
        title: {
          display: true,
          text: 'TVOC (ppb)',
        },
        min: 0,
        max: 30,
      },
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
    },
  };

  if (isLoading) {
    return <div>Loading TVOC data...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <Box sx={{ height: 400 }}>
      <Line ref={chartRef} data={tvocData} options={options} />
    </Box>
  );
};

export default SensorReading;
