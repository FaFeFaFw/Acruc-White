import React from 'react';
import './App.css';
import AirQualityGraph from './components/AirQualityGraph';
import SensorReadings from './components/SensorReadings';
import DashboardLayout from './components/DashboardLayout';
import MainHeader from './components/MainHeader';
import Sidebar from './components/Sidebar';

function App() {
  console.log('App component rendered');
  return (
    <>
      {/* <MainHeader /> */}
      {/* <Sidebar /> */}
      {/* <DashboardLayout> */}
        <h1>flower</h1>
        <AirQualityGraph />
        <SensorReadings />
      {/* </DashboardLayout> */}
    </>
  );
}

export default App;