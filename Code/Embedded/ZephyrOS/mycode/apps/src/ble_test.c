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

void ibeacon_init(void);

#ifndef IBEACON_RSSI
#define IBEACON_RSSI 0xc8
#endif

/*
 * Set iBeacon advertisement data. These values are for
 * demonstration only and must be changed for production environments!
 *
 * UUID:  18ee1516-016b-4bec-ad96-bcb96d166e97
 * Major: 0
 * Minor: 0
 * RSSI:  -56 dBm
 */

static uint8_t ibeacon_data[] = {
	0x4c,        0x00,                         // Company identifier (Apple)
	0x02,        0x15,                         // iBeacon type
	0x13,        0xee, 0x15, 0x16, 0x01, 0x6b, // UUID
	0x4b,        0xec, 0xad, 0x96, 0xbc, 0xb9, 0x6d, 0x16, 0x6e, 0x97, 0x01, 0x07, // Major
	0x06,        0x00,                                                             // Minor
	IBEACON_RSSI // Calibrated RSSI @ 1m
};

int main(void)
{
	ibeacon_init();

	return 0;
}

void ibeacon_init(void)
{
	const struct bt_data ad[] = {
		BT_DATA_BYTES(BT_DATA_FLAGS, BT_LE_AD_NO_BREDR),
		BT_DATA(BT_DATA_MANUFACTURER_DATA, ibeacon_data, sizeof(ibeacon_data))};

	int err;

	// printk("Setting static random address...\n");
	// err = BT_ADDR_SET_STATIC(&static_random_addr);

	printk("iBeacon: Initializing Bluetooth...\n");
	err = bt_enable(NULL);
	if (err) {
		printk("iBeacon: Bluetooth init failed (err %d)\n", err);
		return;
	}

	printk("iBeacon: Bluetooth initialized\n");
	err = bt_le_adv_start(BT_LE_ADV_NCONN, ad, ARRAY_SIZE(ad), NULL, 0);
	if (err) {
		printk("iBeacon: Advertising failed to start (err %d)\n", err);
		return;
	}

	printk("iBeacon: Advertising started\n");
}
