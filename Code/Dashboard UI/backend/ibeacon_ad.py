from bleak import BleakScanner, BleakClient, BleakService
import requests
import asyncio
import time
import aiohttp

UUID = "14:ee:15:16:01:6b:4b:ec:ad:96:bc:b9:6d:16:6e:97"

async def broadcast_ibeacon():
    advertiser = BleakService()

    major = 1
    minor = 1
    tx_power = -59

    # Convert the UUID to bytes and construct the iBeacon payload
    uuid_bytes = bytes.fromhex(UUID.replace(":", ""))
    major_bytes = major.to_bytes(2, byteorder='big')
    minor_bytes = minor.to_bytes(2, byteorder='big')
    tx_power_byte = tx_power.to_bytes(1, byteorder='big', signed=True)

    ibeacon_data = (
        b'\x02\x15' +  # iBeacon type
        uuid_bytes +
        major_bytes +
        minor_bytes +
        tx_power_byte
    )

    await advertiser.start_advertising(
        manufacturer_data={0x004C: ibeacon_data},
        tx_power=tx_power,
        interval_ms=100,
    )

    print("Broadcasting iBeacon... Press Ctrl+C to stop.")

    try:
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        print("Stopping iBeacon broadcast.")
        await advertiser.stop_advertising()

if __name__ == "__main__":
    asyncio.run(broadcast_ibeacon())