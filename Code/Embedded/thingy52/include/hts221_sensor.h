/**
 ************************************************************
 * @file hts221_sensor.h
 * @author Fan Yang
 * @date 22/03/2024
 * @brief Hts221 sensor, temp and humidity
 *************************************************************
 *
 *************************************************************
 */

#ifndef HTS221_SENSOR_H
#define HTS221_SENSOR_H

#include <zephyr/kernel.h>
#include <zephyr/device.h>
#include <zephyr/drivers/sensor.h>
#include <stdio.h>
#include <zephyr/sys/util.h>
#include <zephyr/sys/printk.h>

#define HTS221_THREAD_STACK_SIZE 1024
#define HTS221_THREAD_PRIORITY   10

// void hts221_sensor_init(void);
uint8_t get_temp(const struct device *dev);
uint8_t get_humidity(const struct device *dev);
void hts221_thread(void);

#endif