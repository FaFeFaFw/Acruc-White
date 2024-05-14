/**
 ************************************************************
 * @file ccs811_sensor.h
 * @author Fan Yang
 * @date 23/03/2024
 * @brief Ccs811 sensor
 *************************************************************
 */

#ifndef CCS811_SENSOR_H
#define CCS811_SENSOR_H

#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/sensor.h>
#include <zephyr/sys/printk.h>
#include <zephyr/drivers/sensor/ccs811.h>
#include <stdio.h>

#define CCS811_THREAD_STACK_SIZE 1024
#define CCS811_THREAD_PRIORITY   10

void ccs811_thread(void);

#endif