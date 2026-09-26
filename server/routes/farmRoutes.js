import express from "express";
import jwt from "jsonwebtoken";
import Farm from "../models/Farm.js";
import dotenv from "dotenv";
import { getTokenFromRequest } from "../middleware/auth.js";
import LdrReading from "../models/LdrReading.js";
import LightControl from "../models/LightControl.js";
import Device from "../models/Device.js";

dotenv.config();
const router = express.Router();


// ======================================================
// GET ALL FARMS
// ======================================================

router.get("/", async (req, res) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        message: "No user Login"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_KEY
    );

    const farms = await Farm.find({
      owner: decoded.userId
    })
      .sort({ createdAt: -1 })
      .select(
        "placeName latitude longitude weather createdAt"
      );

    return res.status(200).json(farms);

  } catch (error) {

    console.error("Farm list error:", error);

    return res.status(500).json({
      message: "Failed to load farm locations",
      error: error.message
    });
  }
});


// ======================================================
// SAVE FARM LOCATION
// ======================================================

router.post("/location", async (req, res) => {
  try {

    const {
      latitude,
      longitude,
      weather
    } = req.body;

    if (
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude)) ||
      Number(latitude) < -90 ||
      Number(latitude) > 90 ||
      Number(longitude) < -180 ||
      Number(longitude) > 180
    ) {
      return res.status(400).json({
        message:
          "Valid latitude and longitude are required"
      });
    }

    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        message: "No user Login"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_KEY
    );

    // Get place name from latitude and longitude
    let placeName = "Unknown location";

    try {

      const geocodingResponse = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${Number(latitude)},${Number(longitude)}&language=en&key=${process.env.GOOGLE_GEOCODING_API_KEY}`
      );

      const geocodingData =
        await geocodingResponse.json();

      placeName =
        geocodingData.results?.[0]
          ?.formatted_address ||
        placeName;

    } catch (geocodingError) {

      console.error(
        "Reverse geocoding failed:",
        geocodingError.message
      );
    }

    // Fallback reverse geocoding
    if (placeName === "Unknown location") {

      try {

        const fallbackResponse =
          await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${Number(latitude)}&lon=${Number(longitude)}&zoom=18&addressdetails=1&accept-language=en`,
            {
              headers: {
                "User-Agent":
                  "AgriVision/1.0 farm-location-service",
                "Accept-Language": "en"
              }
            }
          );

        const fallbackData =
          await fallbackResponse.json();

        placeName =
          fallbackData.display_name ||
          placeName;

      } catch (fallbackError) {

        console.error(
          "Fallback reverse geocoding failed:",
          fallbackError.message
        );
      }
    }

    // Save farm
    const farm = new Farm({
      owner: decoded.userId,
      latitude: Number(latitude),
      longitude: Number(longitude),
      placeName,
      weather: weather || null
    });

    await farm.save();

    res.status(200).json({

      message: "Location saved successfully",

      location: {
        latitude: Number(latitude),
        longitude: Number(longitude),
        placeName
      },

      farm
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to save location",
      error: error.message
    });
  }
});


// ======================================================
// WEATHER
// ======================================================

router.post("/weather", async (req, res) => {
  try {

    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        message: "No user Login"
      });
    }

    jwt.verify(
      token,
      process.env.JWT_KEY
    );

    const {
      latitude,
      longitude
    } = req.body;

    if (
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude))
    ) {
      return res.status(400).json({
        message:
          "Valid latitude and longitude are required"
      });
    }

    const weatherResponse =
      await fetch(
        `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.GOOGLE_WEATHER_API_KEY}&location.latitude=${Number(latitude)}&location.longitude=${Number(longitude)}`
      );

    if (!weatherResponse.ok) {

      const errorData =
        await weatherResponse.text();

      console.error(
        "Google Weather API error:",
        errorData
      );

      return res.status(
        weatherResponse.status
      ).json({
        message:
          "Google Weather API request failed"
      });
    }

    const weatherData =
      await weatherResponse.json();

    res.status(200).json(weatherData);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to get weather",
      error: error.message
    });
  }
});


// ======================================================
// LDR DATA FROM ESP32
// ======================================================

router.post("/ldr", async (req, res) => {
  try {

    const {
      deviceId,
      ldrValue,
      lightStatus
    } = req.body;

    if (
      !deviceId ||
      ldrValue === undefined ||
      !lightStatus
    ) {
      return res.status(400).json({
        success: false,
        message:
          "deviceId, ldrValue and lightStatus are required"
      });
    }

    // Find device
    const device = await Device.findOne({
      deviceId
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message:
          "Device is not registered"
      });
    }

    // Update current device state
    device.currentLdrValue =
      ldrValue;

    device.currentLightStatus =
      lightStatus;

    device.status = "ONLINE";

    device.lastSeen = new Date();

    await device.save();

    // Save historical reading
    await LdrReading.create({
      deviceId,
      ldrValue,
      lightStatus
    });

    res.status(200).json({

      success: true,

      message:
        "LDR data received",

      data: {
        deviceId,
        ldrValue,
        lightStatus
      }

    });

  } catch (error) {

    console.error(
      "LDR error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to process LDR data"
    });
  }
});


// ======================================================
// CHANGE LIGHT CONTROL
// ======================================================

router.post("/light-control", async (req, res) => {
  try {

    const {
      farmId,
      deviceId,
      mode
    } = req.body;


    // ---------------------------------------------
    // Validate input
    // ---------------------------------------------

    if (
      !farmId ||
      !deviceId ||
      !mode
    ) {
      return res.status(400).json({
        success: false,
        message:
          "farmId, deviceId and mode are required"
      });
    }


    // ---------------------------------------------
    // Validate mode
    // ---------------------------------------------

    if (
      !["ON", "OFF", "AUTO"].includes(mode)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Mode must be ON, OFF or AUTO"
      });
    }


    // ---------------------------------------------
    // Check farm exists
    // ---------------------------------------------

    const farm = await Farm.findById(
      farmId
    );

    if (!farm) {
      return res.status(404).json({
        success: false,
        message:
          "Farm not found"
      });
    }


    // ---------------------------------------------
    // IMPORTANT
    //
    // Find device using BOTH:
    //
    // deviceId
    // AND
    // farmId
    //
    // This prevents Location 2 from controlling
    // Location 1's device.
    // ---------------------------------------------

    const device = await Device.findOne({
      deviceId,
      farmId
    });


    if (!device) {

      return res.status(403).json({
        success: false,
        message:
          "This device does not belong to this location"
      });
    }


    // ---------------------------------------------
    // Update light control
    // ---------------------------------------------

    const control =
      await LightControl.findOneAndUpdate(

        { deviceId },

        {
          deviceId,
          mode,
          updatedAt: new Date()
        },

        {
          returnDocument: "after",
          upsert: true
        }
      );


    res.status(200).json({

      success: true,

      message:
        `Light mode changed to ${mode}`,

      data: control

    });


  } catch (error) {

    console.error(
      "Light control error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to change light mode"
    });
  }
});


// ======================================================
// GET LIGHT CONTROL
// Used by ESP32
// ======================================================

router.get(
  "/light-control/:deviceId",
  async (req, res) => {

    try {

      const {
        deviceId
      } = req.params;


      let control =
        await LightControl.findOne({
          deviceId
        });


      // If no control exists,
      // create AUTO as default
      if (!control) {

        control =
          await LightControl.create({
            deviceId,
            mode: "AUTO"
          });
      }


      res.status(200).json({

        success: true,

        deviceId:
          control.deviceId,

        mode:
          control.mode

      });


    } catch (error) {

      console.error(
        "Light control read error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to get light control"
      });
    }
  }
);


// ======================================================
// AUTOMATIC ESP32 REGISTRATION
// ESP32 ONLY SENDS ITS MAC ADDRESS
// ======================================================

router.post(
  "/devices/register",
  async (req, res) => {

    try {

      const {
        deviceId
      } = req.body;


      if (!deviceId) {

        return res.status(400).json({
          success: false,
          message:
            "deviceId is required"
        });
      }


      // ---------------------------------------------
      // Check if device already exists
      // ---------------------------------------------

      let device =
        await Device.findOne({
          deviceId
        });


      // ---------------------------------------------
      // Existing device
      // ---------------------------------------------

      if (device) {

        device.lastSeen =
          new Date();


        if (device.farmId) {

          device.status =
            "ONLINE";

        } else {

          device.status =
            "UNASSIGNED";
        }


        await device.save();


        return res.status(200).json({

          success: true,

          existing: true,

          message:
            "Device already registered",

          data: device

        });
      }


      // ---------------------------------------------
      // New device
      // ---------------------------------------------

      device =
        await Device.create({

          deviceId,

          farmId: null,

          deviceName:
            "ESP32 Device",

          type: "ESP32",

          status:
            "UNASSIGNED",

          lastSeen:
            new Date()
        });


      // ---------------------------------------------
      // Create default light control
      // ---------------------------------------------

      await LightControl.findOneAndUpdate(

        { deviceId },

        {
          deviceId,
          mode: "AUTO",
          updatedAt: new Date()
        },

        {
          upsert: true,
          new: true
        }
      );


      res.status(201).json({

        success: true,

        existing: false,

        message:
          "New ESP32 registered successfully",

        data: device

      });


    } catch (error) {

      console.error(
        "Device registration error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to register device"
      });
    }
  }
);


// ======================================================
// ASSIGN DEVICE TO FARM
// ======================================================

router.put(
  "/devices/:deviceId/assign",
  async (req, res) => {

    try {

      const {
        deviceId
      } = req.params;

      const {
        farmId
      } = req.body;


      if (!farmId) {

        return res.status(400).json({
          success: false,
          message:
            "farmId is required"
        });
      }


      // ---------------------------------------------
      // Check farm
      // ---------------------------------------------

      const farm =
        await Farm.findById(
          farmId
        );

      if (!farm) {

        return res.status(404).json({
          success: false,
          message:
            "Farm not found"
        });
      }


      // ---------------------------------------------
      // Find device
      // ---------------------------------------------

      const device =
        await Device.findOne({
          deviceId
        });


      if (!device) {

        return res.status(404).json({
          success: false,
          message:
            "Device not found"
        });
      }


      // ---------------------------------------------
      // Assign device to farm
      // ---------------------------------------------

      device.farmId =
        farmId;

      device.status =
        "ONLINE";

      device.lastSeen =
        new Date();


      await device.save();


      res.status(200).json({

        success: true,

        message:
          "Device assigned successfully",

        data: device

      });


    } catch (error) {

      console.error(
        "Device assignment error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to assign device"
      });
    }
  }
);


// ======================================================
// GET DEVICES OF A FARM
// ======================================================

router.get(
  "/devices/farm/:farmId",
  async (req, res) => {

    try {

      const {
        farmId
      } = req.params;


      // ---------------------------------------------
      // Check farm exists
      // ---------------------------------------------

      const farm =
        await Farm.findById(
          farmId
        );

      if (!farm) {

        return res.status(404).json({
          success: false,
          message:
            "Farm not found"
        });
      }


      // ---------------------------------------------
      // Get ONLY devices belonging to this farm
      // ---------------------------------------------

      const devices =
        await Device.find({
          farmId
        });


      res.status(200).json({

        success: true,

        data: devices

      });


    } catch (error) {

      console.error(
        "Get devices error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to get devices"
      });
    }
  }
);


// ======================================================
// GET UNASSIGNED DEVICES
// ======================================================

router.get(
  "/devices/unassigned",
  async (req, res) => {

    try {

      const devices =
        await Device.find({
          farmId: null
        });


      res.status(200).json({

        success: true,

        data: devices

      });


    } catch (error) {

      console.error(
        "Get unassigned devices error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to get unassigned devices"
      });
    }
  }
);


// ======================================================
// GET SINGLE DEVICE
// ======================================================

router.get(
  "/devices/:deviceId",
  async (req, res) => {

    try {

      const {
        deviceId
      } = req.params;


      const device =
        await Device.findOne({
          deviceId
        }).populate("farmId");


      if (!device) {

        return res.status(404).json({
          success: false,
          message:
            "Device not found"
        });
      }


      res.status(200).json({

        success: true,

        data: device

      });


    } catch (error) {

      console.error(
        "Device lookup error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to get device"
      });
    }
  }
);


export default router;