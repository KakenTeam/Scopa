#include <ESP8266WiFi.h>
#include <SocketIOClient.h>
#include <ArduinoJson.h>

SocketIOClient ioClient;
const char* ssid = "Cafe Sang Chieu";
const char* password = "trasua123";

char host[] = "192.168.1.14";
int port = 3001;

//từ khóa extern: dùng để #include các biến toàn cục ở một số thư viện khác. Trong thư viện SocketIOClient có hai biến toàn cục
// mà chúng ta cần quan tâm đó là
// RID: Tên hàm (tên sự kiện
// Rfull: Danh sách biến (được đóng gói lại là chuối JSON)
extern String RID;
extern String Rfull;


//Một số biến dùng cho việc tạo một task
unsigned long previousMillis = 0;
long interval = 2000;

void setup()
{
    Serial.begin(115200);
    delay(10);
    Serial.print("Connect to "); Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) { //Thoát ra khỏi vòng
        delay(500);
        Serial.print('.');
    }
    Serial.println();
    Serial.println("Connected");
    Serial.println(F("Di chi IP cua ESP8266 (Socket Client ESP8266): "));
    Serial.println(WiFi.localIP());

    if (!ioClient.connect(host, port)) {
        Serial.println(F("Ket noi den socket server that bai!"));
        return;
    }

    //Khi đã kết nối thành công
    if (ioClient.connected()) {
        //Thì gửi sự kiện ("connection") đến Socket server ahihi.
        ioClient.send("connection", "message", "Connected !!!!");
    }
    Serial.println("Set up pin mode 12");
    pinMode(12, OUTPUT);
}

void drop_water(long type_water) {
  Serial.println(type_water);
  if (type_water == 1) {
    digitalWrite(12, HIGH);       // sets the digital pin 13 on
    delay(5000);
    Serial.println("Nhan order gui nuoc");
    digitalWrite(12, LOW);
  }
  if (type_water == 2) {
    digitalWrite(12, HIGH);       // sets the digital pin 13 on
    delay(5000);
    Serial.println("Nhan order gui nuoc");
    digitalWrite(12, LOW);
  }
}

void loop()
{
    //Khi bắt được bất kỳ sự kiện nào thì chúng ta có hai tham số:
    //  +RID: Tên sự kiện
    //  +RFull: Danh sách tham số được nén thành chuỗi JSON!
    if (ioClient.monitor()) {
          if (RID == "drop_water") {
            // parse json to get type water
            StaticJsonBuffer<200> jsonBuffer;
            JsonObject& root = jsonBuffer.parseObject(Rfull);
            long type_water = root["type_water"];
            const char* order_id = root["order_id"];
            
            drop_water(type_water);
            ioClient.send("done", "message", order_id);
            // reset value 
            RID = "";
            Rfull = "";
          }
    }

    //Kết nối lại!
    if (!ioClient.connected()) {
      ioClient.reconnect(host, port);
    }
}
