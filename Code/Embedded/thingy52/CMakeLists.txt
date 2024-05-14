# SPDX-License-Identifier: Apache-2.0

cmake_minimum_required(VERSION 3.20.0)
find_package(Zephyr REQUIRED HINTS $ENV{ZEPHYR_BASE})
project(thingy52)

add_subdirectory(mylib)
# add_subdirectory(apps)

zephyr_include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)

target_sources(app PRIVATE src/main.c)
# target_link_libraries(mylib)

if(IBEACON_RSSI)
  zephyr_compile_definitions(IBEACON_RSSI=${IBEACON_RSSI})
endif()
