#include <WiFi.h>
#include <HTTPClient.h>

// ======================================================
// WiFi
// ======================================================

const char* ssid = "Zzz-2.4";
const char* password = "11111111";

// ======================================================
// Backend
// ======================================================

const char* serverUrl =
  "http://192.168.0.151:5000/api/farms/soil";

const char* controlUrlBase =
  "http://192.168.0.151:5000/api/farms/light-control/";

// ======================================================
// Hardware
// ======================================================

const int SOIL_PIN = 34;
const int PUMP_PIN = 27;

// RGB LED pins
const int RED_PIN = 25;
const int GREEN_PIN = 26;
const int BLUE_PIN = 33;

// ======================================================
// Soil Thresholds
// ======================================================

const int WET_THRESHOLD = 2200;
const int DRY_THRESHOLD = 3200;

// ======================================================
// Device
// ======================================================

String deviceId;
String currentMode = "AUTO";

// ======================================================
// Pump State
// ======================================================

bool pumpOn = false;
bool lastPumpOn = false;
bool firstReading = true;


// ======================================================
// RGB LED
// ======================================================

void rgbOff()
{
  digitalWrite(RED_PIN, LOW);
  digitalWrite(GREEN_PIN, LOW);
  digitalWrite(BLUE_PIN, LOW);
}


void rgbBlue()
{
  digitalWrite(RED_PIN, LOW);
  digitalWrite(GREEN_PIN, LOW);
  digitalWrite(BLUE_PIN, HIGH);
}


void rgbGreen()
{
  digitalWrite(RED_PIN, LOW);
  digitalWrite(GREEN_PIN, HIGH);
  digitalWrite(BLUE_PIN, LOW);
}


void rgbRed()
{
  digitalWrite(RED_PIN, HIGH);
  digitalWrite(GREEN_PIN, LOW);
  digitalWrite(BLUE_PIN, LOW);
}


// ======================================================
// UPDATE RGB BASED ON SOIL VALUE
// ======================================================

void updateRGB(int soilValue)
{
  if (soilValue < WET_THRESHOLD)
  {
    // Soil < 2200
    rgbBlue();

    Serial.println("RGB: BLUE");
  }
  else if (soilValue <= DRY_THRESHOLD)
  {
    // 2200 <= Soil <= 3200
    rgbGreen();

    Serial.println("RGB: GREEN");
  }
  else
  {
    // Soil > 3200
    rgbRed();

    Serial.println("RGB: RED");
  }
}


// ======================================================
// GET CONTROL MODE FROM BACKEND
// ======================================================

void getControlMode()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    return;
  }

  HTTPClient http;

  String controlUrl =
    String(controlUrlBase) + deviceId;

  http.begin(controlUrl);

  int httpCode = http.GET();

  Serial.print("Control HTTP Code: ");
  Serial.println(httpCode);

  if (httpCode > 0)
  {
    String response = http.getString();

    Serial.print("Control response: ");
    Serial.println(response);

    if (response.indexOf("\"mode\":\"ON\"") >= 0)
    {
      currentMode = "ON";
    }
    else if (response.indexOf("\"mode\":\"OFF\"") >= 0)
    {
      currentMode = "OFF";
    }
    else if (response.indexOf("\"mode\":\"AUTO\"") >= 0)
    {
      currentMode = "AUTO";
    }

    Serial.print("Current mode: ");
    Serial.println(currentMode);
  }

  http.end();
}


// ======================================================
// SEND SOIL DATA
// ======================================================

void sendSoilData(
  int soilValue,
  int moisture,
  bool pumpState
)
{
  if (WiFi.status() != WL_CONNECTED)
  {
    return;
  }

  HTTPClient http;

  http.begin(serverUrl);

  http.addHeader(
    "Content-Type",
    "application/json"
  );

  String pumpStatus =
    pumpState ? "ON" : "OFF";

  String jsonData =
    "{\"deviceId\":\"" +
    deviceId +
    "\",\"soilValue\":" +
    String(soilValue) +
    ",\"moisture\":" +
    String(moisture) +
    ",\"pumpStatus\":\"" +
    pumpStatus +
    "\"}";

  Serial.println("Sending soil data:");
  Serial.println(jsonData);

  int httpCode =
    http.POST(jsonData);

  Serial.print("Soil HTTP Code: ");
  Serial.println(httpCode);

  if (httpCode > 0)
  {
    String response =
      http.getString();

    Serial.println("Backend response:");
    Serial.println(response);
  }

  http.end();
}


// ======================================================
// SETUP
// ======================================================

void setup()
{
  Serial.begin(115200);

  // ====================================================
  // Pump
  // ====================================================

  pinMode(PUMP_PIN, OUTPUT);

  digitalWrite(
    PUMP_PIN,
    LOW
  );


  // ====================================================
  // RGB LED
  // ====================================================

  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);

  rgbOff();


  // ====================================================
  // ADC
  // ====================================================

  analogSetAttenuation(
    ADC_11db
  );


  Serial.println();
  Serial.println("Starting ESP32...");


  // ====================================================
  // WiFi
  // ====================================================

  WiFi.begin(
    ssid,
    password
  );

  Serial.println(
    "Connecting to WiFi..."
  );

  while (
    WiFi.status() != WL_CONNECTED
  )
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println();

  Serial.println(
    "WiFi connected!"
  );


  // ====================================================
  // ESP32 IP
  // ====================================================

  Serial.print(
    "ESP32 IP: "
  );

  Serial.println(
    WiFi.localIP()
  );


  // ====================================================
  // ESP32 MAC Address
  // ====================================================

  deviceId =
    WiFi.macAddress();

  Serial.print(
    "Device ID: "
  );

  Serial.println(
    deviceId
  );
}


// ======================================================
// LOOP
// ======================================================

void loop()
{
  // ====================================================
  // READ SOIL SENSOR
  // ====================================================

  int soilValue =
    analogRead(SOIL_PIN);

  Serial.println();
  Serial.println("--------------------------------");

  Serial.print(
    "Soil sensor value: "
  );

  Serial.println(
    soilValue
  );


  // ====================================================
  // RGB LED
  // ====================================================

  updateRGB(
    soilValue
  );


  // ====================================================
  // MOISTURE PERCENTAGE
  // ====================================================

  int moisture =
    map(
      soilValue,
      4095,
      1500,
      0,
      100
    );

  moisture =
    constrain(
      moisture,
      0,
      100
    );

  Serial.print(
    "Moisture: "
  );

  Serial.print(
    moisture
  );

  Serial.println("%");


  // ====================================================
  // GET CONTROL MODE
  // ====================================================

  getControlMode();


  // ====================================================
  // PUMP CONTROL
  // ====================================================

  if (currentMode == "ON")
  {
    // Manual ON
    pumpOn = true;

    Serial.println(
      "Mode: ON -> Pump ON"
    );
  }

  else if (currentMode == "OFF")
  {
    // Manual OFF
    pumpOn = false;

    Serial.println(
      "Mode: OFF -> Pump OFF"
    );
  }

  else if (currentMode == "AUTO")
  {
    // ==================================================
    // AUTO MODE WITH HYSTERESIS
    // ==================================================

    if (pumpOn == false)
    {
      // Pump is currently OFF.
      // Start only when soil is above 3200.

      if (soilValue > DRY_THRESHOLD)
      {
        pumpOn = true;

        Serial.println(
          "AUTO -> Soil > 3200 -> Pump ON"
        );
      }
      else
      {
        pumpOn = false;

        Serial.println(
          "AUTO -> Pump remains OFF"
        );
      }
    }

    else
    {
      // Pump is currently ON.
      // Keep it ON until soil goes below 2200.

      if (soilValue < WET_THRESHOLD)
      {
        pumpOn = false;

        Serial.println(
          "AUTO -> Soil < 2200 -> Pump OFF"
        );
      }
      else
      {
        pumpOn = true;

        Serial.println(
          "AUTO -> Soil >= 2200 -> Pump remains ON"
        );
      }
    }
  }


  // ====================================================
  // CONTROL PHYSICAL PUMP
  // ====================================================

  if (pumpOn)
  {
    digitalWrite(
      PUMP_PIN,
      HIGH
    );

    Serial.println(
      "Physical Pump: ON"
    );
  }
  else
  {
    digitalWrite(
      PUMP_PIN,
      LOW
    );

    Serial.println(
      "Physical Pump: OFF"
    );
  }


  // ====================================================
  // SEND DATA WHEN PUMP STATE CHANGES
  // ====================================================

  if (
    firstReading ||
    pumpOn != lastPumpOn
  )
  {
    sendSoilData(
      soilValue,
      moisture,
      pumpOn
    );

    lastPumpOn =
      pumpOn;

    firstReading =
      false;
  }


  // ====================================================
  // WAIT
  // ====================================================

  delay(2000);
}