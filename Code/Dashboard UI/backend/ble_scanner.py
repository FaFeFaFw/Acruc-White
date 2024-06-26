from bleak import BleakScanner
import requests
import asyncio
import time
import aiohttp

UUID = "11:ee:15:16:01:6b:4b:ec:ad:96:bc:b9:6d:16:6e:97"
queue = asyncio.Queue()

async def detection_callback(device, advertisement_data):
    manufacturer_data = advertisement_data.manufacturer_data
    #print("enter callback")
    for key, value in manufacturer_data.items():
        # if key == 0x4C:
        #     print(f"value: {value.hex()}")
        #     print(f"UUID: {value[2:17]}")
        #     print(f"compare: {bytes.fromhex(UUID.replace(":", ""))}")
        if key == 0x4C and value[2:18] == bytes.fromhex(UUID.replace(":", "")):
            major = (value[18] << 8) + value[19]
            minor1 = value[20]
            minor2 = value[21]
            co2_value = major
            tvoc_value = minor1
            temp_value = minor2

            print(f"Major (CO2): {co2_value}")
            print(f"Minor1 (TVOC): {tvoc_value}")
            print(f"Minor2 (Temperature): {temp_value}")

            timestamp = time.time() * 1000
            # timestamp = time.time()
            print(f"timestamp: {timestamp}")
            
            # Send the data to the FastAPI server
            data = {
                "CO2": co2_value,
                "Temperature": temp_value, 
                "TVOC": tvoc_value,
                "timestamp": timestamp
            }

            # Add data to queue
            await queue.put(data)

            # try:
            #     response = requests.post("http://localhost:8000/update_sensor_data", json=data)
            #     if response.status_code == 200:
            #         print("Data sent successfully")
            #     else:
            #         print("Failed to send data")
            # except Exception as e:
            #     print(f"Error sending data: {e}")

async def send_data_to_server(session):
    while True:
        data = await queue.get()
        try:
            async with session.post("http://localhost:8000/update_sensor_data", json=data) as response:
                if response.status == 200:
                    print("Data sent successfully")
                else:
                    print("Failed to send data")
        except Exception as e:
            print(f"Error sending data: {e}")
        finally:
            queue.task_done()


# async def main():
    # """Scan for devices."""
    # # scanner = BleakScanner()
    # # scanner.register_detection_callback(detection_callback)
    # scanner = BleakScanner(detection_callback=detection_callback)
    # await scanner.start()

    # # send_task = asyncio.create_task(send_data_to_server())

    # # while True:
    # #     await scanner.start()
    # #     await asyncio.sleep(1)
    # #     await scanner.stop()
    # #     await asyncio.sleep(0.1)

    # try:
    #     while True:
    #         await asyncio.sleep(1) 
    # except KeyboardInterrupt:
    #     print("Stopping scanner...")
    #     await scanner.stop()
    #     print("Scanner stopped.")    

async def main():
    """Scan for devices."""
    async with aiohttp.ClientSession() as session:
        scanner = BleakScanner(detection_callback=detection_callback)
        await scanner.start()
        print("Scanner started. Press Ctrl+C to stop.")

        send_task = asyncio.create_task(send_data_to_server(session))

        try:
            while True:
                await asyncio.sleep(1)  # Keeps the event loop running
        except KeyboardInterrupt:
            print("Stopping scanner...")
            await scanner.stop()
            print("Scanner stopped.")
        finally:
            send_task.cancel()
            await send_task  # Ensure the task is properly cancelled

asyncio.run(main())
