#include "telefy_tdlib.h"

#include <td/telegram/td_json_client.h>

#include <mutex>

namespace {
std::mutex client_mutex;
void* active_client = nullptr;
}

void* telefy_create() {
    std::lock_guard<std::mutex> lock(client_mutex);
    if (active_client != nullptr) {
        td_json_client_destroy(active_client);
    }
    active_client = td_json_client_create();
    return active_client;
}

void telefy_send(
    void* client,
    const char* request
) {
    std::lock_guard<std::mutex> lock(client_mutex);
    if (client != active_client) return;
    td_json_client_send(client, request);
}

const char* telefy_receive(
    void* client,
    double timeout
) {
    std::lock_guard<std::mutex> lock(client_mutex);
    if (client != active_client) return nullptr;
    return td_json_client_receive(client, timeout);
}

void telefy_destroy(
    void* client
) {
    std::lock_guard<std::mutex> lock(client_mutex);
    if (client != active_client) return;
    td_json_client_destroy(client);
    active_client = nullptr;
}