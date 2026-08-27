#include "telefy_tdlib.h"

#include <td/telegram/td_json_client.h>

#include <mutex>

namespace {
std::mutex client_mutex;
}

void* telefy_create() {
    std::lock_guard<std::mutex> lock(client_mutex);
    return td_json_client_create();
}

void telefy_send(
    void* client,
    const char* request
) {
    std::lock_guard<std::mutex> lock(client_mutex);
    td_json_client_send(client, request);
}

const char* telefy_receive(
    void* client,
    double timeout
) {
    std::lock_guard<std::mutex> lock(client_mutex);
    return td_json_client_receive(client, timeout);
}

void telefy_destroy(
    void* client
) {
    std::lock_guard<std::mutex> lock(client_mutex);
    td_json_client_destroy(client);
}