/**
 ************************************************************
 * @file thingy52_ibeacon.c
 * @author Fan Yang
 * @date 22/03/2024
 * @brief Set iBeacon advertisement data for thingy52
 *************************************************************
 *
 *************************************************************
 */

#include "thingy52_ibeacon.h"

#ifndef IBEACON_RSSI
#define IBEACON_RSSI 0xc8
#endif

static struct k_mutex ibeacon_mutex;
static K_SEM_DEFINE(bt_ready_sem, 0, 1);

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
	0x11,        0xee, 0x15, 0x16, 0x01, 0x6b, // UUID
	0x4b,        0xec, 0xad, 0x96, 0xbc, 0xb9, 0x6d, 0x16, 0x6e, 0x97, 0x01, 0x07, // Major
	0x06,        0x00,                                                             // Minor
	IBEACON_RSSI // Calibrated RSSI @ 1m
};

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
	k_sem_give(&bt_ready_sem); // Signal that Bluetooth is ready
}

void update_ibeacon_major(uint8_t major1, uint8_t major2)
{
	/// Wait for ble ready
	k_sem_take(&bt_ready_sem, K_FOREVER);
	//  Lock mutex
	k_mutex_lock(&ibeacon_mutex, K_FOREVER);
	// Update Ibeacon Major
	ibeacon_data[20] = major1;
	ibeacon_data[21] = major2;
	printk("Temp : %d \n", ibeacon_data[20]);
	printk("Humidity : %d \n", ibeacon_data[21]);

	// bt_le_adv_stop();
	//  Update advertising data
	const struct bt_data update_ad[] = {
		BT_DATA_BYTES(BT_DATA_FLAGS, BT_LE_AD_NO_BREDR),
		BT_DATA(BT_DATA_MANUFACTURER_DATA, ibeacon_data, sizeof(ibeacon_data))};

	int err = bt_le_adv_update_data(update_ad, ARRAY_SIZE(update_ad), NULL, 0);
	if (err) {
		printk("Failed to update iBeacon advertising (err %d) \n", err);
	} else {
		printk("iBeacon advertising updated. \n");
	}

	k_mutex_unlock(&ibeacon_mutex);
	k_sem_give(&bt_ready_sem); // Signal that Bluetooth is ready
}

void update_ibeacon_minor1(uint8_t minor1)
{
	/// Wait for ble ready
	k_sem_take(&bt_ready_sem, K_FOREVER);
	//  Lock mutex
	k_mutex_lock(&ibeacon_mutex, K_FOREVER);
	// Update Ibeacon Major
	ibeacon_data[22] = minor1;
	printk("Air Pressure : %d \n", ibeacon_data[22]);

	// bt_le_adv_stop();
	//  Update advertising data
	const struct bt_data update_ad[] = {
		BT_DATA_BYTES(BT_DATA_FLAGS, BT_LE_AD_NO_BREDR),
		BT_DATA(BT_DATA_MANUFACTURER_DATA, ibeacon_data, sizeof(ibeacon_data))};

	int err = bt_le_adv_update_data(update_ad, ARRAY_SIZE(update_ad), NULL, 0);
	if (err) {
		printk("Failed to update iBeacon advertising (err %d) \n", err);
	} else {
		printk("iBeacon advertising updated. \n");
	}

	k_mutex_unlock(&ibeacon_mutex);
	k_sem_give(&bt_ready_sem); // Signal that Bluetooth is ready
}

void update_ibeacon_minor2(uint8_t minor2)
{
	/// Wait for ble ready
	k_sem_take(&bt_ready_sem, K_FOREVER);
	//  Lock mutex
	k_mutex_lock(&ibeacon_mutex, K_FOREVER);
	// Update Ibeacon Major
	ibeacon_data[23] = minor2;
	printk("TVOC : %d \n", ibeacon_data[23]);

	// bt_le_adv_stop();
	//  Update advertising data
	const struct bt_data update_ad[] = {
		BT_DATA_BYTES(BT_DATA_FLAGS, BT_LE_AD_NO_BREDR),
		BT_DATA(BT_DATA_MANUFACTURER_DATA, ibeacon_data, sizeof(ibeacon_data))};

	int err = bt_le_adv_update_data(update_ad, ARRAY_SIZE(update_ad), NULL, 0);
	if (err) {
		printk("Failed to update iBeacon advertising (err %d) \n", err);
	} else {
		printk("iBeacon advertising updated. \n");
	}

	k_mutex_unlock(&ibeacon_mutex);
	k_sem_give(&bt_ready_sem); // Signal that Bluetooth is ready
}