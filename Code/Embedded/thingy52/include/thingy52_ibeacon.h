/**
 ************************************************************
 * @file thingy52_ibeacon.h
 * @author Fan Yang
 * @date 22/03/2024
 * @brief Set iBeacon advertisement data for thingy52
 *************************************************************
 *
 *************************************************************
 */

#ifndef THINGY_IBEACON_H
#define THINGY_IBEACON_H

#include <zephyr/types.h>
#include <stddef.h>
#include <zephyr/sys/printk.h>
#include <zephyr/sys/util.h>

#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/bluetooth/hci.h>
#include <zephyr/bluetooth/addr.h>

#define IBEACON_THREAD_STACK_SIZE 1024
#define IBEACON_THREAD_PRIORITY   10

void ibeacon_init(void);
void update_ibeacon_major(uint8_t major1, uint8_t major2);
void update_ibeacon_minor1(uint8_t minor1);
void update_ibeacon_minor2(uint8_t minor1);
void update_ibeacon_thread(void);

#endif