import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainHeader from './MainHeader';
import AirQualityGraph from './AirQualityGraph';
import SensorReadings from './SensorReadings';
import OtherMetrics from './OtherMetrics';
import FlowerController from './FlowerController';
import Footer from './Footer';
import AQIGraph from './AQIGraph'; // Import the new AQI graph component

function DashboardLayout() {
  const [co2Percentage, setCO2Percentage] = useState(50);
  const [tvocPercentage, setTVOCPercentage] = useState(50);

  useEffect(() => {
    setTVOCPercentage(100 - co2Percentage);
  }, [co2Percentage]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <MainHeader />
        {/* Dashboard Views */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Top graphs/charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <AirQualityGraph />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <SensorReadings />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <AQIGraph co2Percentage={co2Percentage} tvocPercentage={tvocPercentage} />
            </div>
          </div>
          {/* Bottom stats and controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Other metrics */}
            <OtherMetrics co2Percentage={co2Percentage} tvocPercentage={tvocPercentage} />
            {/* Sensor Control */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Sensors Control</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label htmlFor="co2Percentage" className="text-sm text-gray-600">CO2 Percentage:</label>
                  <input
                    type="range"
                    id="co2Percentage"
                    name="co2Percentage"
                    min="0"
                    max="100"
                    value={co2Percentage}
                    onChange={(e) => setCO2Percentage(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-sm font-bold">{co2Percentage}%</span>
                </div>
                <div className="flex items-center space-x-4">
                  <label htmlFor="tvocPercentage" className="text-sm text-gray-600">TVOC Percentage:</label>
                  <span className="text-sm font-bold">{tvocPercentage}%</span>
                </div>
              </div>
            </div>
            {/* Flower Control */}
            <FlowerController />
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default DashboardLayout;
