# Code repository for the Dashboard

# Dashboard UI

This code repository contains the UI code for controlling a mechanical flower petal based on sensor readings and Air Quality Index (AQI).

## UI Preview

![UI Preview](https://imgur.com/JxgNDJ5)

Here is a preview of the UI in action:

![UI Preview](https://imgur.com/JxgNDJ5.gif)

## Functionality

The UI code provides the following functionality:

1. **Sensor Reading**: The code reads data from multiple sensors to determine the current state of the flower petal (healthy or bad). The sensor (Thingy:52) measures various environmental factors such as CO2, temperature, or TVOC.

2. **AQI Monitoring**: The code also retrieves the Air Quality Index (AQI) from the collected sensor data. The AQI provides information about the air quality in a specific location (i.e. room). The code uses this information to determine whether the flower petal should be open or closed.

3. **Petal Control**: Based on the sensor reading and AQI, the code controls the mechanical flower petal to open or close accordingly. 

## Usage

To use the code, follow these steps:

1. Clone the repository to your local machine.

2. Install any necessary dependencies for FastAPI() and React JS by running the appropriate commands.

3. Connect to a MQTT Broker which sends the sensor data and ensure it is properly calibrated.

4. Configure the code to retrieve the AQI from the desired data source.

5. Run the code and monitor the dashboard UI to observe the flower petal's behavior based on the sensor reading and AQI.

## Contributing

If you would like to contribute to this project, please contact us (Fan Yang or Shamsuddoha Shameem) and follow the guideline:

- Fork the repository and create a new branch for your contribution.

- Make your changes and ensure they adhere to the project's coding standards.

- Submit a pull request with a clear description of your changes and their purpose.

## License

This code is free to use for personal usage. It was completed as part of the CSSE4011 final project (Team - Acrux White).

## Contact

For any questions or inquiries, please contact the project maintainer at [private@mail.com](mailto:email@example.com).
