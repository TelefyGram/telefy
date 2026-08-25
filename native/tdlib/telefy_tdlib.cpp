#include "telefy_tdlib.h"

#include <td/telegram/td_json_client.h>

void* telefy_create() {
    return td_json_client_create();
}

void telefy_send(
    void* client,
    const char* request
) {
    td_json_client_send(client, request);
}

const char* telefy_receive(
    void* client,
    double timeout
) {
    return td_json_client_receive(client, timeout);
}

void telefy_destroy(
    void* client
) {
    td_json_client_destroy(client);
}