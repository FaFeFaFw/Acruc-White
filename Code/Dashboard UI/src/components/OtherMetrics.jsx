import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSensorData from '../hooks/useSensorData';

function OtherMetrics({ sensorData, isLoading, error, aqiValue }) {
  // const { sensorData, isLoading: sensorLoading, error: sensorError } = useSensorData();
  const [timeDifference, setTimeDifference] = useState('');
  // const [aqi, setAqi] = useState(0);

  // const calculateAQI = (co2, tvoc) => {
  //   return (co2 / 2000) * (co2Percentage / 100) + (tvoc / 200) * (tvocPercentage / 100);
  // };

  useEffect(() => {
    if (sensorData.timestamp) {
      const currentTime = Date.now();
      const sensorTime = new Date(sensorData.timestamp).getTime();
      const diffInMs = currentTime - sensorTime;

      setTimeDifference(`${diffInMs} ms`);
    }
  }, [sensorData]);

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{sensorError}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Other metrics</h3>

      <div className="space-y-2">
        <MetricRow label="AQI" value={aqiValue} />
        <MetricRow label="CO2" value={sensorData.CO2} />
        <MetricRow label="TVOC" value={sensorData.TVOC} />
        <MetricRow label="Temperature" value={sensorData.Temperature} />
        <MetricRow label="Lag" value={timeDifference} />
      </div>
    </div>
  );
}

function MetricRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

export default OtherMetrics;
