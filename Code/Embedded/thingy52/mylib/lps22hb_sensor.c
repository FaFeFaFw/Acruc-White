/**
 ************************************************************
 * @file lps22hb_sensor.c
 * @author Fan Yang
 * @date 23/03/2024
 * @brief LPS22hb sensor, temp and humidity
 *************************************************************
 *
 *************************************************************
 */

#include "lps22hb_sensor.h"
#include "thingy52_ibeacon.h"

void process_pressure(const struct device *dev)
{
	struct sensor_value pressure;

	if (sensor_sample_fetch(dev) < 0) {
		printk("LPS22hb Sensor sample update error\n");
		return;
	}

	if (sensor_channel_get(dev, SENSOR_CHAN_PRESS, &pressure) < 0) {
		printk("Cannot read LPS22HB pressure channel\n");
		return;
	}

	// Convert pressure to an integer
	uint8_t pressure_value = (uint8_t)sensor_value_to_double(&pressure);

	// Update the iBeacon minor
	update_ibeacon_minor1(pressure_value);
}

void lps22hb_thread(void)
{
	const struct device *dev = DEVICE_DT_GET_ONE(st_lps22hb_press);

	if (!device_is_ready(dev)) {
		printk("Device %s is not ready \n", dev->name);
		return;
	}

	while (1) {
		process_pressure(dev);
		k_sleep(K_SECONDS(3));
	}
}