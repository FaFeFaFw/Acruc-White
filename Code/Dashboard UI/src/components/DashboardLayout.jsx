import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AirQualityGraph from './AirQualityGraph';
import SensorReadings from './SensorReadings';

function DashboardLayout() {
  const [toggleCO2, setToggleCO2] = useState(true);
  const [toggleTemp, setToggleTemp] = useState(true);
  const [toggleTVOC, setToggleTVOC] = useState(true);

  useEffect(() => {
    // This is where you could add logic to persist toggle states or fetch initial toggle states from a backend
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
      <div className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="px-4 py-6 flex items-center">
          <img src="inverted_flower.png" alt="Logo representing Project using Flower Petal" className="w-12 h-12 mr-3" />
          <span className="text-lg font-bold">Project Dashboard</span>
        </div>
        <div className="flex flex-col py-4">
          <Link to="/" className="flex items-center px-4 py-2 mt-2 text-sm font-semibold hover:bg-blue-700">
            <i className="fas fa-home mr-3"></i>Home
          </Link>
          <Link to="/air_q" className="flex items-center px-4 py-2 mt-2 text-sm font-semibold hover:bg-blue-700">
            <i className="fas fa-wind mr-3"></i>Air Quality
          </Link>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4 bg-white shadow-md flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-700"><i className="fas fa-home mr-3"></i>Mechanical Flower Petal Project Homepage</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
              <AirQualityGraph />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <SensorReadings />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          </div>
        </div>
        <div className="px-6 py-4 bg-white shadow-inner">
          <div className="text-center text-sm text-gray-600">
            © Copyrights Arcux-White 2024. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;