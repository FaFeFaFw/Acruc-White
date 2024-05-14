/*
 * Copyright (c) 2018 Henrik Brix Andersen <henrik@brixandersen.dk>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

#include <zephyr/types.h>
#include <stddef.h>
#include <zephyr/sys/printk.h>
#include <zephyr/sys/util.h>
#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/bluetooth/hci.h>

#include "thingy52_ibeacon.h"
#include "hts221_sensor.h"
#include "lps22hb_sensor.h"
#include "ccs811_sensor.h"

int main(void)
{

	ibeacon_init();
	return 0;
}

K_THREAD_DEFINE(hts221_thread_id, HTS221_THREAD_STACK_SIZE, hts221_thread, NULL, NULL, NULL,
		HTS221_THREAD_PRIORITY, 0, 0);

// K_THREAD_DEFINE(lps22hb_thread_id, LPS22HB_THREAD_STACK_SIZE, lps22hb_thread, NULL, NULL, NULL,
// 		LPS22HB_THREAD_PRIORITY, 0, 0);

K_THREAD_DEFINE(ccs811_thread_id, CCS811_THREAD_STACK_SIZE, ccs811_thread, NULL, NULL, NULL,
		CCS811_THREAD_PRIORITY, 0, 0);
