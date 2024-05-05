import React from 'react';

function MainHeader() {
  console.log('MainHeader component rendered');
  return (
    <div className="px-6 py-4 bg-white shadow-md flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-700"><i className="fas fa-home mr-3"></i>Mechanical Flower Petal Project Homepage</h1>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 focus:outline-none" onClick={() => {
          console.log('Refresh button clicked');
          // Add functionality to refresh the dashboard data
        }}>
            <i className="fas fa-sync-alt"></i>
          </button>
      </div>
    </div>
  );
}

export default MainHeader;