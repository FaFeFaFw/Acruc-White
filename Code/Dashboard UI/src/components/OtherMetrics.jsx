import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSensorData from '../hooks/useSensorData';

function OtherMetrics() {
  const { sensorData, isLoading: sensorLoading, error: sensorError } = useSensorData();
  const [timeDifference, setTimeDifference] = useState('');

  useEffect(() => {
    if (sensorData.timestamp) {
      const currentTime = Date.now();
      const sensorTime = new Date(sensorData.timestamp).getTime();
      const diffInMs = currentTime - sensorTime;

      // // Convert the difference to a readable format (e.g., seconds, minutes)
      // const diffInSeconds = Math.floor(diffInMs / 1000);
      // const diffInMinutes = Math.floor(diffInSeconds / 60);
      // const displayDiff = diffInMinutes > 0 ? `${diffInMinutes} min ago` : `${diffInSeconds} sec ago`;

      setTimeDifference(`${diffInMs} ms`);
    }
  }, [sensorData.timestamp]);

  if (sensorLoading) {
    return <div>Loading metrics...</div>;
  }

  if (sensorError) {
    return <div style={{ color: 'red' }}>{sensorError}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Other metrics</h3>

      <div className="space-y-2">
        <MetricRow label="CO2" value={sensorData.CO2} />
        <MetricRow label="Temperature" value={sensorData.Temperature} />
        <MetricRow label="TVOC" value={sensorData.TVOC} />
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
