cmake_minimum_required(VERSION 3.16)

project(telefy LANGUAGES CXX)

option(TELEFY_BUILD_SHARED "Build telefy as a shared library" ON)
set(DTDJSON_ROOT "" CACHE PATH "TDLib installation directory")

if(NOT DTDJSON_ROOT)
    message(FATAL_ERROR "DTDJSON_ROOT must point to an installed TDLib")
endif()

find_path(TDJSON_INCLUDE_DIR
    NAMES td/telegram/td_json_client.h
    PATHS "${DTDJSON_ROOT}" "${DTDJSON_ROOT}/include"
    PATH_SUFFIXES include
    NO_DEFAULT_PATH
)

if(NOT TDJSON_INCLUDE_DIR)
    find_path(TDJSON_INCLUDE_DIR
        NAMES td/telegram/td_json_client.h
        PATH_SUFFIXES include
    )
endif()

if(NOT TDJSON_INCLUDE_DIR)
    message(FATAL_ERROR "Could not find TDJSON_INCLUDE_DIR under DTDJSON_ROOT='${DTDJSON_ROOT}'. Expected td/telegram/td_json_client.h in include/ or install root.")
endif()

find_library(TDJSON_LIBRARY
    NAMES tdjson tdjson_static
    PATHS "${DTDJSON_ROOT}" "${DTDJSON_ROOT}/lib" "${DTDJSON_ROOT}/bin"
    PATH_SUFFIXES lib bin
    NO_DEFAULT_PATH
)

if(NOT TDJSON_LIBRARY)
    find_library(TDJSON_LIBRARY
        NAMES tdjson tdjson_static
        PATH_SUFFIXES lib bin
    )
endif()

if(NOT TDJSON_LIBRARY)
    message(FATAL_ERROR "Could not find TDJSON library under DTDJSON_ROOT='${DTDJSON_ROOT}'. Expected tdjson or tdjson_static in lib/ or bin/.")
endif()

if(TELEFY_BUILD_SHARED)
    set(TELEFY_LIBRARY_TYPE SHARED)
else()
    set(TELEFY_LIBRARY_TYPE STATIC)
endif()

add_library(telefy ${TELEFY_LIBRARY_TYPE}
    telefy_tdlib.cpp
)

target_include_directories(telefy PRIVATE
    "${TDJSON_INCLUDE_DIR}"
)

target_link_libraries(telefy PRIVATE
    "${TDJSON_LIBRARY}"
)

set_target_properties(telefy PROPERTIES
    OUTPUT_NAME telefy
    POSITION_INDEPENDENT_CODE ON
)

if(APPLE AND TELEFY_BUILD_SHARED)
    set_target_properties(telefy PROPERTIES
        INSTALL_NAME_DIR "@rpath"
        BUILD_RPATH "@loader_path"
        INSTALL_RPATH "@loader_path"
    )
elseif(UNIX AND NOT APPLE AND TELEFY_BUILD_SHARED)
    set_target_properties(telefy PROPERTIES
        BUILD_RPATH "\$ORIGIN"
        INSTALL_RPATH "\$ORIGIN"
    )
endif()

install(TARGETS telefy
    RUNTIME DESTINATION bin
    LIBRARY DESTINATION lib
    ARCHIVE DESTINATION lib
)