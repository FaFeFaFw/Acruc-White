import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainHeader from './MainHeader';
import AirQualityGraph from './AirQualityGraph';
import SensorReadings from './SensorReadings';
import OtherMetrics from './OtherMetrics';
import FlowerController from './FlowerController';
import Footer from './Footer';
import AQI from './AQI'; // Import the new AQI graph component

function DashboardLayout() {
  const [toggleCO2, setToggleCO2] = useState(true);
  const [toggleTemp, setToggleTemp] = useState(true);
  const [toggleTVOC, setToggleTVOC] = useState(true);

  useEffect(() => {
    console.log('DashboardLayout mounted or toggle states changed');
  }, [toggleCO2, toggleTemp, toggleTVOC]);

  const handleToggle = (sensorType) => {
    console.log(`Toggling ${sensorType}`);
    switch (sensorType) {
      case 'CO2':
        setToggleCO2(!toggleCO2);
        break;
      case 'Temp':
        setToggleTemp(!toggleTemp);
        break;
      case 'TVOC':
        setToggleTVOC(!toggleTVOC);
        break;
      default:
        console.error('Unknown sensor type');
    }
  };

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
              <AQI />
            </div>
          </div>
          {/* Bottom stats and controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Other metrics */}
            <OtherMetrics />
            {/* Sensor Control */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Sensors Control</h3>
              <div className="flex space-x-4 items-center">
                <input type="checkbox" name="toggleCO2" id="toggleCO2" checked={toggleCO2} onChange={() => handleToggle('CO2')} className="toggle-checkbox" />
                <label htmlFor="toggleCO2" className="text-sm text-gray-600">Enable CO2</label>
                <input type="checkbox" name="toggleTemp" id="toggleTemp" checked={toggleTemp} onChange={() => handleToggle('Temp')} className="toggle-checkbox" />
                <label htmlFor="toggleTemp" className="text-sm text-gray-600">Enable Temp.</label>
                <input type="checkbox" name="toggleTVOC" id="toggleTVOC" checked={toggleTVOC} onChange={() => handleToggle('TVOC')} className="toggle-checkbox" />
                <label htmlFor="toggleTVOC" className="text-sm text-gray-600">Enable TVOC</label>
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
