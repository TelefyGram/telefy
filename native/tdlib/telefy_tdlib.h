#pragma once

#ifdef _WIN32
#define TELEFY_API __declspec(dllexport)
#else
#define TELEFY_API
#endif

extern "C" {

TELEFY_API void* telefy_create();

TELEFY_API void telefy_send(
    void* client,
    const char* request
);

TELEFY_API const char* telefy_receive(
    void* client,
    double timeout
);

TELEFY_API void telefy_destroy(
    void* client
);

}