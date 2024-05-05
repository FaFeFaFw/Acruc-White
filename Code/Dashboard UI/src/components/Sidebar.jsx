import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/inverted_flower.png';

function Sidebar() {
  console.log('Rendering Sidebar');

  return (
    <div className="w-64 bg-blue-800 text-white flex flex-col">
      <div className="px-4 py-6 flex items-center">
          <img src={logo} alt="Logo representing Project using Flower Petal" className="w-12 h-12 mr-3"/>
          <span className="text-lg font-bold">Project Dashboard</span>
      </div>
      <div className="flex flex-col py-4">
          <a href="#" className="flex items-center px-4 py-2 mt-2 text-sm font-semibold hover:bg-blue-700">
              <i className="fas fa-home mr-3"></i>Home
          </a>
          <a href="aqi.html" className="flex items-center px-4 py-2 mt-2 text-sm font-semibold hover:bg-blue-700">
              <i className="fas fa-wind mr-3"></i>Air Quality
          </a>
      </div>
    </div>
  );
}


export default Sidebar;