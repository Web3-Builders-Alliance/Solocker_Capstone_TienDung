
#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>
#include <WebSocketsClient.h>


const char* OPENSTR = "69JuCNz7yxCffYWWXBgSwbdC9NYRdEDgQgg4faLi9aqAHDtZwxBCuSCdtHYpB82C2b";
const char* CLOSESTR = "69JuCNz7yxCfcfMtKdbusNcYSohXfNoxrfBrgJMRpsJRvBLRAB7XJySvcxdMr9uGWK";


#define LOCK_PIN 2

WiFiMulti WiFiMulti;
WebSocketsClient webSocket;
DynamicJsonDocument doc(1024);

void hexdump(const void* mem, uint32_t len, uint8_t cols = 16) {
  const uint8_t* src = (const uint8_t*)mem;
  Serial.printf("\n[HEXDUMP] Address: 0x%08X len: 0x%X (%d)", (ptrdiff_t)src, len, len);
  for (uint32_t i = 0; i < len; i++) {
    if (i % cols == 0) {
      Serial.printf("\n[0x%08X] 0x%08X: ", (ptrdiff_t)src, i);
    }
    Serial.printf("%02X ", *src);
    src++;
  }
  Serial.printf("\n");
}

void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[WSc] Disconnected!\n");
      break;
    case WStype_CONNECTED:
      {
        Serial.printf("[WSc] Connected to url: %s\n", payload);

        const char* subscriptionRequest = R"({
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "accountSubscribe",
                    "params": [
                        "E8ErhWi252vBcqbmMb3ZR6UBYKmYyk5PDXAGps874QT8",
                        {
                            "encoding": "base58",
                            "commitment": "confirmed"
                        }
                    ]
                })";

        webSocket.sendTXT(subscriptionRequest);
      }
      break;
    case WStype_TEXT:
      {
        // Create a local instance of DynamicJsonDocument
        DynamicJsonDocument doc(1024);  // Adjust the size based on your JSON payload

        // Serial.printf("[WSc] get text: %s\n", payload);
        DeserializationError error = deserializeJson(doc, payload);
        if (error) {
          Serial.print(F("deserializeJson() failed: "));
          Serial.println(error.c_str());
          return;
        }

        // Extract the data value
        String dataValue = doc["params"]["result"]["value"]["data"][0].as<String>();
        Serial.print("[WSc] get data: ");
        Serial.println(dataValue);

        if (dataValue == OPENSTR ) {
           Serial.print("[WSc] open lock: ");
          openLock();
        }
      }
      break;
    case WStype_BIN:
      Serial.printf("[WSc] get binary length: %u\n", length);
      hexdump(payload, length);
      break;
    case WStype_ERROR:
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
      break;
  }
}

void setup() {
  // Serial.begin(921600);
  pinMode(LOCK_PIN, OUTPUT);
  Serial.begin(115200);

  //Serial.setDebugOutput(true);
  Serial.setDebugOutput(true);

  Serial.println();
  Serial.println();
  Serial.println();

  for (uint8_t t = 4; t > 0; t--) {
    Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
    Serial.flush();
    delay(1000);
  }

  WiFiMulti.addAP("VIETTEL", "00000001");

  //WiFi.disconnect();
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  webSocket.beginSSL("radial-compatible-panorama.solana-devnet.quiknode.pro", 443, "/82da712d6b72152691aba84b5571f6bec5f2f233");
  webSocket.onEvent(webSocketEvent);
}

void openLock() {
  digitalWrite(LOCK_PIN, HIGH); 
  delay(5000);                  
  digitalWrite(LOCK_PIN, LOW); 
}


void loop() {
  webSocket.loop();
}
