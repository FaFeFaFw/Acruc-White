import json
from paho.mqtt import client as mqtt_client

# MQTT broker configuration
MQTT_HOST = 'csse4011-iot.zones.eait.uq.edu.au'
MQTT_LOCAL = 'localhost'
broker_address = MQTT_LOCAL
port = 1883  # Default MQTT port

# MQTT topic to publish to
projectID = "prjAcruxWhite"
flowerTopic = f"{projectID}/flower"  # Flower control topic

def connect_mqtt() -> mqtt_client:
    """Create MQTT client instance and connect to the MQTT broker."""
    client = mqtt_client.Client("Flower_Control_Publisher")
    client.connect(broker_address, port=port)
    return client

def publish_flower_status(client, is_open: bool):
    """Publish the status of the flower petal as a JSON message."""
    message = json.dumps({"flower-petal-open": is_open})
    result = client.publish(flowerTopic, message)
    status = result[0]
    if status == 0:
        print(f"Successfully sent message `{message}` to topic `{flowerTopic}`")
    else:
        print(f"Failed to send message to topic `{flowerTopic}`")

def main():
    client = connect_mqtt()
    # Example usage:
    # Publish flower status as open
    publish_flower_status(client, True)
    # Simulate waiting and then close the flower
    import time
    time.sleep(5)  # Wait for 5 seconds
    publish_flower_status(client, False)

if __name__ == '__main__':
    main()
