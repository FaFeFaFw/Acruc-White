import json
from paho.mqtt import client as mqtt_client

# MQTT broker configuration
MQTT_HOST = 'csse4011-iot.zones.eait.uq.edu.au'
MQTT_LOCAL = 'localhost'
broker_address = MQTT_LOCAL
port = 1883 # Default MQTT port

# MQTT topic to subscribe to
projectID = "prjAcruxWhite"  # Project ID for the MQTT broker
sensorTopic = "prjAcruxWhite/sensors"  # Sensor data topic
# aqiTopic = "prjAcruxWhite/aqi"  # AQI data topic

topic = sensorTopic  # Subscribe to sensor data topic

# MQTT callback function
def on_message(client, userdata, message):
    message_payload = str(message.payload.decode("utf-8"))
    sensor_data = json.loads(message_payload)
    print("Received sensor data:", sensor_data)
    # Here, you can update the database or keep it in memory depending on your application requirement.

client = mqtt_client.Client("FastAPI_MQTT_Client")
client.connect(broker_address, port=port)

client.subscribe(topic)
client.on_message = on_message

def start_mqtt_client():
    client.loop_start()  # Start the network loop in a non-blocking way
