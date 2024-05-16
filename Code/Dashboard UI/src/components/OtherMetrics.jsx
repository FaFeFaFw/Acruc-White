import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSensorData from '../hooks/useSensorData';

function OtherMetrics() {
  // const [metrics, setMetrics] = useState({
  //   CO2: 0,
  //   Temperature: 0,
  //   TVOC: 0,
  //   flowerPetal: 'Closed'
  // });
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  const { sensorData, isLoading: sensorLoading, error: sensorError } = useSensorData();

  // useEffect(() => {
  //   const fetchMetrics = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get('http://localhost:8000/sensor_data');
  //       console.log('Fetching sensor data from /sensor_data');
  //       setMetrics({
  //         CO2: response.data.CO2,
  //         Temperature: response.data.Temperature,
  //         TVOC: response.data.TVOC,
  //         flowerPetal: response.data.flowerPetal ? 'Open' : 'Closed'
  //       });
  //       setIsLoading(false);
  //       setError(null);
  //     } catch (error) {
  //       setError('Error: Failed to fetch metrics data');
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchMetrics();
  //   const intervalId = setInterval(fetchMetrics, 3000); // fetch data every 10 seconds
  //   return () => clearInterval(intervalId);
  // }, []);

  if (sensorLoading) {
    return <div>Loading metrics...</div>;
  }

  if (sensorError) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Other metrics</h3>

      {/* <h3 className="flex items-center mb-4 text-lg font-semibold">Other metrics</h3> */}
      <div className="space-y-2">
        <MetricRow label="CO2" value={sensorData.CO2} />
        <MetricRow label="Temperature" value={sensorData.Temperature} />
        <MetricRow label="TVOC" value={sensorData.TVOC} />
        {/* <MetricRow label="Flower Petal" value={metrics.flowerPetal} /> */}
      </div>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    // Add styles to the div element
    <div className="flex justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

export default OtherMetrics;
