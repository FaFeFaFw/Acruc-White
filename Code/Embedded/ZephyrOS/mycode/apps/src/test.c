#include <zephyr/kernel.h>
#include <zephyr/sys/printk.h>
#include <zephyr/device.h>
#include <zephyr/drivers/pwm.h>

#include "led_driver.h"

static const struct pwm_dt_spec servo = PWM_DT_SPEC_GET(DT_ALIAS(pwm_servo));
static const uint32_t min_pulse = PWM_USEC(500);
static const uint32_t max_pulse = PWM_USEC(2500);

static const uint32_t period = PWM_MSEC(20); // 20 ms period

#define STEP PWM_USEC(1000)

enum direction {
	DOWN,
	UP,
};

int main(void)
{
	uint32_t pulse_width = PWM_USEC(1000);
	enum direction dir = UP;
	int ret;

	led_init();

	printk("Servomotor control\n");

	if (!pwm_is_ready_dt(&servo)) {
		printk("Error: PWM device %s is not ready\n", servo.dev->name);
		return 0;
	}

	while (1) {
		printk("Setting PWM: period = %u, pulse width = %u\n", period, pulse_width);
		ret = pwm_set_dt(&servo, period, pulse_width);
		if (ret < 0) {
			printk("Error %d: failed to set pulse width\n", ret);
			return 0;
		}

		if (dir == DOWN) {
			if (pulse_width <= min_pulse) {
				dir = UP;
				pulse_width = min_pulse;
			} else {
				pulse_width -= STEP;
			}
		} else {
			pulse_width += STEP;

			if (pulse_width >= max_pulse) {
				dir = DOWN;
				pulse_width = max_pulse;
			}
		}
		k_sleep(K_SECONDS(1));
	}
	return 0;
}
