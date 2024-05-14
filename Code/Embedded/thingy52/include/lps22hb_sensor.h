/**
 ************************************************************
 * @file lps22hb_sensor.h
 * @author Fan Yang
 * @date 23/03/2024
 * @brief LPS22hb sensor, temp and humidity
 *************************************************************
 *
 *************************************************************
 */

#ifndef LPS22HB_SENSOR_H
#define LPS22HB_SENSOR_H

#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/sensor.h>
#include <stdio.h>
#include <zephyr/sys/util.h>
#include <zephyr/sys/printk.h>

#define LPS22HB_THREAD_STACK_SIZE 1024
#define LPS22HB_THREAD_PRIORITY   10

void process_sample(const struct device *dev);
void lps22hb_thread(void);
void lps22hb_sensor_init(void);

#endif