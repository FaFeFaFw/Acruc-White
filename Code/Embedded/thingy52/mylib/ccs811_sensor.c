/**
 ************************************************************
 * @file ccs811_sensor.c
 * @author Fan Yang
 * @date 23/03/2024
 * @brief Ccs811 sensor
 *************************************************************
 */

#include "ccs811_sensor.h"
#include "thingy52_ibeacon.h"

static uint8_t process_tvoc(const struct device *dev)
{
	struct sensor_value tvoc;

	if (sensor_channel_get(dev, SENSOR_CHAN_VOC, &tvoc) < 0) {
		printk("Cannot read CCS811 TVOC channel\n");
		return 0;
	}

	uint8_t tvoc_value = (uint8_t)tvoc.val1;
	// Update the iBeacon minor value
	return tvoc_value;
}

static uint16_t process_co2(const struct device *dev)
{
	struct sensor_value co2;

	if (sensor_channel_get(dev, SENSOR_CHAN_CO2, &co2) < 0) {
		printk("Cannot read CCS811 CO2 channel\n");
		return 0;
	}

	uint16_t co2_value = (uint16_t)co2.val1;
	// Update the iBeacon minor value
	return co2_value;
}

void ccs811_thread(void)
{
	const struct device *dev = DEVICE_DT_GET_ONE(ams_ccs811);

	if (!device_is_ready(dev)) {
		printk("Device %s is not ready\n", dev->name);
		return;
	}

	while (1) {
		if (sensor_sample_fetch(dev) < 0) {
			printk("Sensor sample update error\n");
		} else {
			uint8_t tvoc_value = process_tvoc(dev);
			uint16_t co2_value = process_co2(dev);
			update_ibeacon_major((uint8_t)(co2_value >> 8),
					     (uint8_t)(co2_value & 0xFF));
			update_ibeacon_minor1(tvoc_value);
		}
		k_sleep(K_SECONDS(3));
	}
}
