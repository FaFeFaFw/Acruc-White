import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OtherMetrics() {
  const [metrics, setMetrics] = useState({
    dataLoss: '0 %',
    avgCO2: 0,
    avgTemp: 0,
    avgTVOC: 0,
    flowerPetal: 'Closed'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/metrics_data');
        setMetrics({
          dataLoss: `${response.data.dataLoss} %`,
          avgCO2: response.data.avgCO2,
          avgTemp: response.data.avgTemp,
          avgTVOC: response.data.avgTVOC,
          flowerPetal: response.data.flowerPetal ? 'Open' : 'Closed'
        });
        setIsLoading(false);
        setError(null);
      } catch (error) {
        setError('Error: Failed to fetch metrics data');
        setIsLoading(false);
      }
    };

    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 10000); // fetch data every 10 seconds
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Other metrics</h3>

      {/* <h3 className="flex items-center mb-4 text-lg font-semibold">Other metrics</h3> */}
      <div className="space-y-2">
        <MetricRow label="Data loss" value={metrics.dataLoss} />
        <MetricRow label="Avg. CO2" value={metrics.avgCO2} />
        <MetricRow label="Avg. Temp" value={metrics.avgTemp} />
        <MetricRow label="Avg. TVOC" value={metrics.avgTVOC} />
        <MetricRow label="Flower Petal" value={metrics.flowerPetal} />
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
