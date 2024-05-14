# CMakeLists.txt in the mylib folder

# Define source files
set(SOURCES
    ccs811_sensor.c
    lps22hb_sensor.c
    hts221_sensor.c
    thingy52_ibeacon.c
)

# Add source files to the Zephyr build
zephyr_sources(${SOURCES})

# Create a library target
# add_library(mylib ${SOURCES})

# Add include directories
# target_include_directories(mylib PUBLIC ${CMAKE_CURRENT_SOURCE_DIR})
