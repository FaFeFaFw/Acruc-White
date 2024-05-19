#include <zephyr/kernel.h>
#include <zephyr/sys/printk.h>
#include <zephyr/device.h>
#include <zephyr/drivers/pwm.h>
#include <zephyr/bluetooth/bluetooth.h>
#include <zephyr/bluetooth/conn.h>
#include <zephyr/bluetooth/hci.h>
#include <zephyr/bluetooth/addr.h>
#include <zephyr/bluetooth/gatt.h>
#include <zephyr/sys/printk.h>
#include <zephyr/drivers/pwm.h>
#include <string.h>

// Define the service and characteristic UUIDs
#define AQI_SERVICE_UUID BT_UUID_128_ENCODE(0x11345678, 0x1234, 0x5678, 0x1234, 0x56789abcdef0)
#define AQI_SERVICE      BT_UUID_DECLARE_128(AQI_SERVICE_UUID)
#define AQI_CHARACTERISTIC_UUID                                                                    \
	BT_UUID_128_ENCODE(0xabcdef12, 0x3456, 0x7890, 0xabcd, 0xef1234567890)
#define AQI_CHRC BT_UUID_DECLARE_128(AQI_CHARACTERISTIC_UUID)

K_SEM_DEFINE(pwm_sem, 1, 1);

// Variable to hold the AQI value
static uint16_t aqi_value = 0;

// Servo motor control variables
static const struct pwm_dt_spec servo = PWM_DT_SPEC_GET(DT_ALIAS(pwm_servo));
static const uint32_t min_pulse = PWM_USEC(600);
static const uint32_t max_pulse = PWM_USEC(1500);
static const uint32_t period = PWM_MSEC(20); // 20 ms period

// Function to map AQI value to pulse width
static uint32_t map_aqi_to_pulse(uint16_t aqi)
{
	if (aqi < 100) {
		return min_pulse;
	} else if (aqi > 300) {
		return max_pulse;
	} else {
		return min_pulse + ((aqi - 100) * (max_pulse - min_pulse) / (300 - 100));
	}
}

// Read callback function for the AQI characteristic
static ssize_t read_aqi(struct bt_conn *conn, const struct bt_gatt_attr *attr, void *buf,
			uint16_t len, uint16_t offset)
{
	const uint16_t *value = attr->user_data;
	return bt_gatt_attr_read(conn, attr, buf, len, offset, value, sizeof(aqi_value));
}

// Write callback function for the AQI characteristic
static ssize_t write_aqi(struct bt_conn *conn, const struct bt_gatt_attr *attr, const void *buf,
			 uint16_t len, uint16_t offset, uint8_t flags)
{
	uint16_t *value = attr->user_data;
	if (offset + len > sizeof(aqi_value)) {
		return BT_GATT_ERR(BT_ATT_ERR_INVALID_OFFSET);
	}
	memcpy(value, buf, len);
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

void pwm_control_thread(void)
{
	uint32_t pulse_width = min_pulse;
	int err;

	while (1) {
		k_sem_take(&pwm_sem, K_FOREVER);
		pulse_width = map_aqi_to_pulse(aqi_value);
		printk("Setting PWM: period = %u, pulse width = %u\n", period, pulse_width);
		err = pwm_set_dt(&servo, period, pulse_width);
		if (err < 0) {
			printk("Error %d: failed to set pulse width\n", err);
		}
		k_sem_give(&pwm_sem);
		k_msleep(4000);
	}
}

int main(void)
{
	int err;

	printk("Starting Bluetooth Peripheral\n");

	err = bt_enable(NULL);
	if (err) {
		printk("Bluetooth init failed (err %d)\n", err);
		return 0;
	}

	printk("Bluetooth initialized\n");

	err = bt_le_adv_start(BT_LE_ADV_CONN, ad, ARRAY_SIZE(ad), NULL, 0);
	if (err) {
		printk("Advertising failed to start (err %d)\n", err);
		return 0;
	}

	if (!pwm_is_ready_dt(&servo)) {
		printk("Error: PWM device %s is not ready\n", servo.dev->name);
		return 0;
	}

	printk("Advertising successfully started\n");

	// // Create a high-priority thread for PWM control
	// k_thread_priority_set(pwm_thread_id, K_PRIO_COOP(7));
	// k_thread_start(pwm_thread_id);

	while (1) {
		k_sem_take(&pwm_sem, K_FOREVER);
		printk("Main loop: AQI value = %u\n", aqi_value);
		k_sem_give(&pwm_sem);
		k_msleep(2000);
	}

	return 0;
}

K_THREAD_DEFINE(pwm_thread_id, 1024, pwm_control_thread, NULL, NULL, NULL, 7, 0, 0);
