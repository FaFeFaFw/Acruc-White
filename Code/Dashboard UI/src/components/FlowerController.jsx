import React, { useState, useEffect } from 'react';

function FlowerController({ aqiValue }) {
  const [isConnected, setIsConnected] = useState(false);
  const [characteristic, setCharacteristic] = useState(null);
  const [message, setMessage] = useState('');
  const [serviceUUID, setServiceUUID] = useState('11345678-1234-5678-1234-56789abcdef0');
  const [device, setDevice] = useState(null);

  const handleConnect = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [serviceUUID] }],
      });
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService(serviceUUID);
      const characteristicUUID = 'abcdef12-3456-7890-abcd-ef1234567890';
      const characteristic = await service.getCharacteristic(characteristicUUID);

      setDevice(device);
      setCharacteristic(characteristic);
      setIsConnected(true);
      setMessage('Connected to BLE device: ' + device.name);
      console.log('Connected to BLE device:', device.name);

      device.addEventListener('gattserverdisconnected', handleDisconnect);
    } catch (error) {
      console.error('Failed to connect:', error);
      setIsConnected(false);
      setMessage('Unable to connect');
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setMessage('Disconnected from BLE device');
    console.log('Disconnected from BLE device');
  };

  const reconnect = async () => {
    if (device) {
      try {
        const server = await device.gatt.connect();
        const service = await server.getPrimaryService(serviceUUID);
        const characteristicUUID = 'abcdef12-3456-7890-abcd-ef1234567890';
        const characteristic = await service.getCharacteristic(characteristicUUID);

        setCharacteristic(characteristic);
        setIsConnected(true);
        setMessage('Reconnected to BLE device: ' + device.name);
        console.log('Reconnected to BLE device:', device.name);
      } catch (error) {
        console.error('Failed to reconnect:', error);
        setIsConnected(false);
        setMessage('Unable to reconnect');
      }
    }
  };

  const sendAqiValue = async () => {
    if (characteristic) {
      try {
        const intAqiValue = Math.round(aqiValue * 100); // Multiply by 100 and round to nearest integer
        const aqiValueArray = new Uint16Array([intAqiValue]);
        await characteristic.writeValue(aqiValueArray);
        console.log('AQI value sent:', aqiValue);
      } catch (error) {
        console.error('Failed to send AQI value:', error);
        if (device && !device.gatt.connected) {
          setMessage('GATT Server is disconnected. Attempting to reconnect...');
          console.log('GATT Server is disconnected. Attempting to reconnect...');
          await reconnect();
        }
      }
    }
  };

  useEffect(() => {
    if (isConnected) {
      // const interval = setInterval(sendAqiValue, 3000); // Send AQI value every 3 seconds
      // return () => clearInterval(interval);
      sendAqiValue();
    }
  }, [isConnected, aqiValue]);

  const handleDisconnectButton = async () => {
    if (device) {
      try {
        await device.gatt.disconnect();
        setIsConnected(false);
        setMessage('Disconnected from BLE device');
        console.log('Disconnected from BLE device');
      } catch (error) {
        console.error('Failed to disconnect:', error);
        setMessage('Failed to disconnect');
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">BLE Device Connection</h3>
      <div className="mt-4">
        <label htmlFor="serviceUUID" className="block text-sm text-gray-600">Service UUID:</label>
        <input
          type="text"
          id="serviceUUID"
          name="serviceUUID"
          value={serviceUUID}
          onChange={(e) => setServiceUUID(e.target.value)}
          className="mt-2 p-2 border rounded w-full"
          disabled={isConnected}
        />
        <button
          onClick={handleConnect}
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          disabled={isConnected}
        >
          {isConnected ? 'Connected' : 'Connect'}
        </button>
        <button
          onClick={handleDisconnectButton}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4 ml-4"
          disabled={!isConnected}
        >
          Disconnect
        </button>
        {message && (
          <div className="mt-4 text-sm text-gray-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default FlowerController;
