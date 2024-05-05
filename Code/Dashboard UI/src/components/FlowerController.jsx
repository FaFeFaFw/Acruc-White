import React, { useEffect, useState } from 'react';

function FlowerController() {
  const [toggleAuto, setToggleAuto] = useState(true);

  useEffect(() => {
    console.log('System state changed');
  }, [toggleAuto]);

  const handleToggle = (systemType) => {
    console.log(`Toggling ${systemType}`);
    switch (systemType) {
      case 'Flower':
        setToggleAuto(!toggleAuto);
        break;
      default:
        console.error('Unknown system type');
    }
  };

  const handleButtonClick = (buttonType) => {
    console.log(`${buttonType} button was pressed`);
  };

  console.log('FlowerController component rendered');
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-1">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Flower Control</h2>
      <div className="flex items-center mb-4">
          <input type="checkbox" className="mr-2 toggle-checkbox" name="toggleAuto" id="toggleAuto" checked={toggleAuto} onChange={() => handleToggle('Flower')} />
          <span className="text-sm text-gray-700">Automatic</span>
      </div>
      <div className="flex">
          <button 
            className={`bg-blue-600 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 ${toggleAuto ? 'opacity-50' : ''}`} 
            onClick={() => handleButtonClick('Petal Open')} 
            disabled={toggleAuto}
          >
            Petal Open
          </button>
          <button 
            className={`bg-gray-400 text-white px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ${toggleAuto ? 'opacity-50' : ''}`} 
            onClick={() => handleButtonClick('Petal Close')} 
            disabled={toggleAuto}
          >
            Petal Close
          </button>
      </div>
    </div>
  );
}

export default FlowerController;
