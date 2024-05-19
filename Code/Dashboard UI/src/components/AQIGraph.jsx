import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Box } from '@mui/material';

const AQIGraph = ({ sensorData, isLoading, error, aqiValue }) => {
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
            return value > 4 ? 'red' : value > 2 ? 'orange' : value > 1 ? 'yellow' : 'rgba(75, 192, 192, 0.2)';
          },
        },
      },
    ],
  });
  const [sensorTimestamp, setSensorTimestamp] = useState(0);

  useEffect(() => {
    if (sensorData.timestamp) {
      setSensorTimestamp(new Date(sensorData.timestamp).toLocaleString('en-US'));
    }
  }, [sensorData.timestamp]);

  useEffect(() => {
    if (!isLoading && !error && sensorData.CO2 && sensorData.TVOC) {
      const currentTimestamp = new Date().toLocaleTimeString('en-US'); // Get current time in HH:MM:SS format

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
  }, [sensorData]);

  useEffect(() => {
    setAqiData((prevState) => {
      if (prevState.datasets[0].data.length === 0) {
        return prevState;
      }

      const updatedData = prevState.datasets[0].data.map((value, index) => {
        if (index === prevState.datasets[0].data.length - 1) {
          return aqiValue;
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
  }, [aqiValue]);

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
              max: 7,
              ticks: {
                callback: function (value) {
                  return value; // Displaying values directly
                },
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default AQIGraph;
