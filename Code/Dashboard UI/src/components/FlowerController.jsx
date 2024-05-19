import React, { useState } from 'react';

function FlowerController({ aqiValue }) {
  const [bleAddress, setBleAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'nRF52840' }],
        optionalServices: ['battery_service'] // Use appropriate service UUID
      });
      const server = await device.gatt.connect();
      setIsConnected(true);
      console.log('Connected to BLE device:', device.name);

      // Send AQI value to the BLE device
      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');
      const aqiValueArray = new Uint8Array([Math.floor(aqiValue)]);
      await characteristic.writeValue(aqiValueArray);
      console.log('AQI value sent:', aqiValue);
    } catch (error) {
      console.error('Failed to connect:', error);
      setIsConnected(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">BLE Connection</h3>
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label htmlFor="bleAddress" className="text-sm text-gray-600">BLE Address:</label>
          <input
            type="text"
            id="bleAddress"
            name="bleAddress"
            value={bleAddress}
            onChange={(e) => setBleAddress(e.target.value)}
            className="flex-1"
          />
        </div>
        <button
          onClick={handleConnect}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isConnected}
        >
          {isConnected ? 'Connected' : 'Connect'}
        </button>
      </div>
    </div>
  );
}

export default FlowerController;
