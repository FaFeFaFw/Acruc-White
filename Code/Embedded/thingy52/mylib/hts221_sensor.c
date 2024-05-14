/**
 ************************************************************
 * @file hts221_sensor.h
 * @author Fan Yang
 * @date 22/03/2024
 * @brief Hts221 sensor, temp and humidity
 *************************************************************
 * 0f:f3:bc:e4:47:3d
 *************************************************************
 */

#include "hts221_sensor.h"
#include "thingy52_ibeacon.h"

uint8_t get_temp(const struct device *dev)
{
	struct sensor_value temp;
	if (sensor_channel_get(dev, SENSOR_CHAN_AMBIENT_TEMP, &temp) < 0) {
		printk("Cannot read HTS221 temperature channel\n");
		return 0;
	}
	// Convert to a simple scale
	return (uint8_t)sensor_value_to_double(&temp);
}

uint8_t get_humidity(const struct device *dev)
{
	struct sensor_value hum;
	if (sensor_channel_get(dev, SENSOR_CHAN_HUMIDITY, &hum) < 0) {
		printk("Cannot read HTS221 humidity channel\n");
		return 0;
	}
	// Convert
	return (uint8_t)sensor_value_to_double(&hum);
}

void hts221_thread(void)
{
	const struct device *dev = DEVICE_DT_GET_ONE(st_hts221);

	if (!device_is_ready(dev)) {
		printk("Sensor HTS221 is not ready\n");
		return;
	}

	while (1) {
		if (sensor_sample_fetch(dev) < 0) {
			printk("Sensor sample update error\n");
		} else {
			uint8_t temp_value = get_temp(dev);
			// uint8_t hum_value = get_humidity(dev);
			update_ibeacon_minor2(temp_value);
		}
		k_sleep(K_SECONDS(3));
	}
}