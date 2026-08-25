cmake_minimum_required(VERSION 3.16)

project(telefy_tdlib)

add_library(telefy_tdlib SHARED
    telefy_tdlib.cpp
)

target_include_directories(telefy_tdlib PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/../../tdlib
)