#include <stdlib.h>
#include <stdio.h>
#include <stddef.h>
#include <zephyr/kernel.h>
#include <zephyr/shell/shell.h>
#include <zephyr/logging/log.h>
#include <zephyr/device.h>
#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/bluetooth/conn.h>
#include <zephyr/bluetooth/hci.h>
#include <zephyr/bluetooth/addr.h>
#include <zephyr/bluetooth/gatt.h>

#include <zephyr/sys/printk.h>
#include <zephyr/drivers/pwm.h>

#include "led_driver.h"

// Define the service and characteristic UUIDs
#define AQI_SERVICE_UUID BT_UUID_128_ENCODE(0x11345678, 0x1234, 0x5678, 0x1234, 0x56789abcdef0)

#define AQI_SERVICE BT_UUID_DECLARE_128(AQI_SERVICE_UUID)

#define AQI_CHARACTERISTIC_UUID                                                                    \
	BT_UUID_128_ENCODE(0xabcdef12, 0x3456, 0x7890, 0xabcd, 0xef1234567890)

#define AQI_CHRC BT_UUID_DECLARE_128(AQI_CHARACTERISTIC_UUID)

// Variable to hold the AQI value
static uint16_t aqi_value = 0;

// Read callback function for the AQI characteristic
static ssize_t read_aqi(struct bt_conn *conn, const struct bt_gatt_attr *attr, void *buf,
			uint16_t len, uint16_t offset)
{
	const uint8_t *value = attr->user_data;
	return bt_gatt_attr_read(conn, attr, buf, len, offset, value, sizeof(aqi_value));
}

// Write callback function for the AQI characteristic
static ssize_t write_aqi(struct bt_conn *conn, const struct bt_gatt_attr *attr, const void *buf,
			 uint16_t len, uint16_t offset, uint8_t flags)
{
	uint8_t *value = attr->user_data;
	if (offset + len > sizeof(aqi_value)) {
		return BT_GATT_ERR(BT_ATT_ERR_INVALID_OFFSET);
	}
	memcpy(value + offset, buf, len);
	printk("Received AQI value: %u\n", *value);
	return len;
}

// Define the GATT service and characteristics
BT_GATT_SERVICE_DEFINE(aqi_srv, BT_GATT_PRIMARY_SERVICE(AQI_SERVICE),
		       BT_GATT_CHARACTERISTIC(AQI_CHRC, BT_GATT_CHRC_READ | BT_GATT_CHRC_WRITE,
					      BT_GATT_PERM_READ | BT_GATT_PERM_WRITE, read_aqi,
					      write_aqi, &aqi_value));

// Advertising data structure
static const struct bt_data ad[] = {
	BT_DATA_BYTES(BT_DATA_FLAGS, (BT_LE_AD_GENERAL | BT_LE_AD_NO_BREDR)),
	BT_DATA_BYTES(BT_DATA_UUID128_ALL, AQI_SERVICE_UUID)};

void main(void)
{
	int err;
	led_init();

	printk("Starting Bluetooth Peripheral\n");

	err = bt_enable(NULL);
	if (err) {
		printk("Bluetooth init failed (err %d)\n", err);
		return;
	}

	printk("Bluetooth initialized\n");

	err = bt_le_adv_start(BT_LE_ADV_CONN, ad, ARRAY_SIZE(ad), NULL, 0);
	if (err) {
		printk("Advertising failed to start (err %d)\n", err);
		return;
	}

	while (true) {
		printk("AQI : %d \n", aqi_value);
		if (aqi_value < 100) {
			set_led0(1);
			set_led2(0);
			set_led3(0);
			set_led4(0);
		} else {
			set_led0(0);
			set_led2(0);
			set_led3(0);
			set_led4(1);
		}
		k_msleep(2000);
	}
	printk("Advertising successfully started\n");
}