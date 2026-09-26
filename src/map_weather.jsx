import { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "./map_weather.css";

function Map_weather() {
  const [location, setLocation] = useState(null);
  const [canConfirmLocation, setCanConfirmLocation] = useState(false);
  const [farms, setFarms] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [locationStatus, setLocationStatus] = useState(
    "No farm location saved yet",
  );

  const [weather, setWeather] = useState(null);
  const [equipmentFarm, setEquipmentFarm] = useState(null);
  const [equipmentDevices, setEquipmentDevices] = useState([]);
  const [selectedTool, setSelectedTool] = useState("AUTO");
  const [weatherStatus, setWeatherStatus] = useState(
    "Weather information will appear here",
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);

  // REVERSE GEOCODING

  const reverseGeocode = async (coordinates) => {
    const geocoder = new window.google.maps.Geocoder();

    const result = await geocoder.geocode({
      location: coordinates,
      language: "en",
    });

    return result.results[0]?.formatted_address || "Selected farm location";
  };

  // LOAD FARMS

  const loadFarms = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/farms", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Farm locations could not be loaded");
      }

      setFarms(await response.json());
    } catch (error) {
      console.error("Farm list error:", error);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  // SAVE FARM LOCATION

  const saveLocation = async (location, weatherData) => {
    setLocationStatus("Saving your farm location...");

    setIsSaving(true);

    try {
      const response = await fetch("http://localhost:5000/api/farms/location", {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
          weather: weatherData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Location could not be saved");
      }

      setLocationStatus("Farm location saved just now");
      setCanConfirmLocation(false);

      await loadFarms();
    } catch (error) {
      setLocationStatus("Could not save location. Please try again.");

      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // GET WEATHER

  const getWeather = async (location) => {
    setWeatherStatus("Getting current weather...");

    try {
      const response = await fetch("http://localhost:5000/api/farms/weather", {
        method: "POST",

        credentials: "include",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
        }),
      });

      const data = await response.json();

      console.log("WEATHER RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.message || "Weather request failed");
      }

      setWeather(data);

      setWeatherStatus("Weather updated just now");

      return data;
    } catch (error) {
      console.error("Weather error:", error);

      setWeatherStatus("Could not load weather information.");

      throw error;
    }
  };

  // GET USER LOCATION

  const getLocation = () => {
    setLocationStatus("Finding your current location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;

        const longitude = position.coords.longitude;

        const newLocation = {
          lat: latitude,
          lng: longitude,
        };

        console.log("Latitude:", latitude);

        console.log("Longitude:", longitude);

        setLocation(newLocation);
        setCanConfirmLocation(true);

        setLocationStatus("Location found. Confirm it to save your farm.");
      },

      (error) => {
        setLocationStatus("Location access was unavailable");

        console.error("Location error:", error.message);
      },
    );
  };

  // MARKER DRAG

  const handleMarkerDragEnd = async (event) => {
    const coordinates = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setLocation({
      ...coordinates,
      placeName: "Finding place name...",
    });
    setCanConfirmLocation(true);

    setLocationStatus("Updating selected coordinates...");

    try {
      const placeName = await reverseGeocode(coordinates);

      setLocation({
        ...coordinates,
        placeName,
      });

      setLocationStatus("Location updated. Confirm it to save your farm.");
    } catch (error) {
      setLocation({
        ...coordinates,
        placeName: "Selected farm location",
      });

      setLocationStatus(
        "Coordinates updated. Confirm this location to save it.",
      );

      console.error(error);
    }
  };

  // MAP CLICK

  const handleMapClick = async (event) => {
    if (!event.latLng) return;

    const coordinates = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setLocation({
      ...coordinates,
      placeName: "Finding place name...",
    });
    setCanConfirmLocation(true);

    setLocationStatus("Getting information for the selected place...");

    try {
      const placeName = await reverseGeocode(coordinates);

      setLocation({
        ...coordinates,
        placeName,
      });

      setLocationStatus("Place selected. Confirm it to save your farm.");
    } catch (error) {
      setLocation({
        ...coordinates,
        placeName: "Selected farm location",
      });

      setLocationStatus(
        "Coordinates selected. Confirm this location to save it.",
      );

      console.error("Map click geocoding error:", error);
    }
  };

  // CONFIRM LOCATION

  const confirmLocation = async () => {
    if (!location || isSaving) return;

    let weatherData = null;

    try {
      weatherData = await getWeather(location);
    } catch {
      setLocationStatus("Saving location without weather data...");
    }

    await saveLocation(location, weatherData);
  };

  // SELECT SAVED FARM

  const selectSavedFarm = async (farm) => {
    const selectedLocation = {
      lat: Number(farm.latitude),
      lng: Number(farm.longitude),
      placeName: farm.placeName || "Saved farm location",
    };

    setLocation(selectedLocation);
    setCanConfirmLocation(false);

    mapRef.current?.panTo(selectedLocation);

    setLocationStatus(`Showing ${selectedLocation.placeName}`);

    try {
      await getWeather(selectedLocation);
    } catch {
      setWeatherStatus("Current weather is unavailable for this farm.");
    }
  };

  // GET DEVICES FOR A FARM

  const loadFarmDevices = async (farmId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/farms/devices/farm/${farmId}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load farm devices");
      }

      setEquipmentDevices(data.data || []);

      return data.data || [];
    } catch (error) {
      console.error("Farm devices error:", error);

      setEquipmentDevices([]);

      return [];
    }
  };

  // OPEN EQUIPMENT POPUP

  const openEquipmentPopup = async (farm = null) => {
    setSelectedTool(null);

    setEquipmentFarm(farm);

    setEquipmentDevices([]);

    if (!farm?._id) {
      return;
    }

    const devices = await loadFarmDevices(farm._id);

    if (devices.length > 0) {
      const device = devices[0];
      const fallbackMode = ["ON", "OFF"].includes(device.currentLightStatus)
        ? device.currentLightStatus
        : "AUTO";

      try {
        const response = await fetch(
          `http://localhost:5000/api/farms/light-control/${encodeURIComponent(
            device.deviceId,
          )}`,
          { credentials: "include" },
        );
        const data = await response.json();

        if (response.ok && ["ON", "OFF", "AUTO"].includes(data.mode)) {
          setSelectedTool(data.mode);
          return;
        }
      } catch (error) {
        console.error("Light mode load error:", error);
      }

      setSelectedTool(fallbackMode);
    }
  };

  // CHANGE LIGHT MODE

  const setLightMode = async (mode, farmId, deviceId) => {
    try {
      console.log("Changing light:", {
        farmId,
        deviceId,
        mode,
      });

      const response = await fetch(
        "http://localhost:5000/api/farms/light-control",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            farmId,
            deviceId,
            mode,
          }),
        },
      );

      const data = await response.json();

      console.log("Backend response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to change light mode");
      }

      // Update selected button
      setSelectedTool(mode);
    } catch (error) {
      console.error("Light control error:", error);
    }
  };

  // ADD DEVICE TO A SPECIFIC FARM

  const registerDevice = async (farm) => {
    if (!farm?._id) {
      console.error("No farm selected for device registration");

      return;
    }

    try {
      /*
       * This is the MAC address of your ESP32.
       *
       * Later, if you have multiple ESP32 devices,
       * this value can come from a device discovery
       * system instead.
       */
      const deviceId = "F0:24:F9:0E:18:AC";

      // STEP 1
      // Register / find ESP32

      console.log("Registering ESP32:", deviceId);

      const registerResponse = await fetch(
        "http://localhost:5000/api/farms/devices/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            deviceId,
          }),
        },
      );

      const registerData = await registerResponse.json();

      console.log("Registration response:", registerData);

      if (!registerResponse.ok) {
        throw new Error(registerData.message || "Device registration failed");
      }

      const device = registerData.data;

      // STEP 2
      // Check whether device already belongs
      // to another farm

      if (device.farmId && String(device.farmId) !== String(farm._id)) {
        const assignedFarm = farms.find(
          (savedFarm) => String(savedFarm._id) === String(device.farmId),
        );

        alert(
          `This ESP32 is already assigned to another farm/location:\n${
            assignedFarm?.placeName || "Location unavailable"
          }`,
        );

        return;
      }

      // STEP 3
      // Assign device to this farm

      const assignResponse = await fetch(
        `http://localhost:5000/api/farms/devices/${encodeURIComponent(
          deviceId,
        )}/assign`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            farmId: farm._id,
          }),
        },
      );

      const assignData = await assignResponse.json();

      console.log("Assignment response:", assignData);

      if (!assignResponse.ok) {
        throw new Error(assignData.message || "Device assignment failed");
      }

      alert(`ESP32 successfully added to:\n${farm.placeName}`);

      // Refresh devices for this farm
      await loadFarmDevices(farm._id);
    } catch (error) {
      console.error("Add device error:", error);

      alert(error.message || "Failed to add device");
    }
  };

  // GOOGLE MAP LOADING

  if (!isLoaded) {
    return (
      <main className="mapPage mapPageLoading">
        <span className="loadingDot" />
        Loading your field map...
      </main>
    );
  }

  // UI

  return (
    <main className="mapPage">
      <header className="mapHeader">
        <div>
          <p className="eyebrow">
            <span className="material-symbols-sharp">explore</span>
            Field operations
          </p>

          <h1>Know your ground.</h1>

          <p className="mapIntro">
            Pin your farm and keep a quick eye on the conditions around it.
          </p>
        </div>

        <button className="addButton" onClick={getLocation} type="button">
          <span className="material-symbols-sharp">my_location</span>

          <span>Use my location</span>
        </button>
      </header>

      {/* -------------------------------------------- */}
      {/* MAP + WEATHER */}
      {/* -------------------------------------------- */}

      <div className="mapDashboard">
        {/* ------------------------------------------ */}
        {/* MAP CARD */}
        {/* ------------------------------------------ */}

        <section className="mapCard">
          <div className="mapCardTopline">
            <div>
              <p className="sectionKicker">Farm map</p>

              <h2>{location?.placeName || "Choose a farm location"}</h2>
            </div>

            <span className="mapStatus">
              <span />
              Live view
            </span>
          </div>

          <div className="mapFrame">
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "100%",
              }}
              center={
                location || {
                  lat: 23.8103,
                  lng: 90.4125,
                }
              }
              zoom={location ? 15 : 11}
              options={{
                fullscreenControl: true,
                streetViewControl: false,
                mapTypeControl: true,

                mapTypeControlOptions: {
                  style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,

                  position: window.google.maps.ControlPosition.TOP_RIGHT,

                  mapTypeIds: ["roadmap", "satellite", "terrain"],
                },
              }}
              onLoad={(map) => {
                mapRef.current = map;
              }}
              onClick={handleMapClick}
            >
              {location && (
                <Marker
                  position={location}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                />
              )}
            </GoogleMap>
          </div>

          <div className="mapCardFooter">
            <span className="material-symbols-sharp">info</span>

            <span>{locationStatus}</span>
          </div>

          {location && (
            <div className="locationConfirm">
              <div>
                <strong>{location.placeName}</strong>

                <span>
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </span>
              </div>

              {canConfirmLocation && (
                <button
                  type="button"
                  onClick={confirmLocation}
                  disabled={isSaving}
                >
                  <span className="material-symbols-sharp">check</span>

                  {isSaving ? "Saving..." : "Confirm farm location"}
                </button>
              )}
            </div>
          )}
        </section>

        {/* ------------------------------------------ */}
        {/* WEATHER PANEL */}
        {/* ------------------------------------------ */}

        <aside className="weatherPanel">
          <div className="weatherPanelHeader">
            <div>
              <p className="sectionKicker">At a glance</p>

              <h2>Today’s conditions</h2>
            </div>

            <span className="weatherIcon material-symbols-sharp">
              {weather ? "partly_cloudy_day" : "cloud"}
            </span>
          </div>

          {weather ? (
            <>
              <div className="weatherSummary">
                <strong>{Math.round(weather.temperature.degrees)}°</strong>

                <div>
                  <span>{weather.weatherCondition.description.text}</span>

                  <small>
                    Feels like{" "}
                    {Math.round(weather.feelsLikeTemperature.degrees)}°
                  </small>
                </div>
              </div>

              <div className="weatherMetrics">
                {/* Humidity */}

                <div className="weatherMetric">
                  <span className="metricIcon humidity material-symbols-sharp">
                    humidity_percentage
                  </span>

                  <div>
                    <small>Humidity</small>

                    <strong>{weather.relativeHumidity}%</strong>
                  </div>
                </div>

                {/* Wind */}

                <div className="weatherMetric">
                  <span className="metricIcon wind material-symbols-sharp">
                    air
                  </span>

                  <div>
                    <small>Wind</small>

                    <strong>{weather.wind.speed.value} km/h</strong>
                  </div>
                </div>

                {/* Rain */}

                <div className="weatherMetric">
                  <span className="metricIcon rain material-symbols-sharp">
                    rainy
                  </span>

                  <div>
                    <small>Rain chance</small>

                    <strong>
                      {weather.precipitation.probability.percent}%
                    </strong>
                  </div>
                </div>
              </div>

              {/* FIELD NOTE */}

              <div className="fieldNote">
                <span className="material-symbols-sharp">grass</span>

                <p>
                  <strong>
                    {weather.precipitation.probability.percent < 30
                      ? "Good field window"
                      : "Keep an eye on the weather"}
                  </strong>

                  <br />

                  {weather.precipitation.probability.percent < 30
                    ? "Light precipitation chances are favorable for today’s work."
                    : "There is a higher chance of precipitation, so plan field work accordingly."}
                </p>
              </div>
            </>
          ) : (
            <div className="weatherEmpty">
              <span className="material-symbols-sharp">cloud</span>

              <p>{weatherStatus}</p>
            </div>
          )}
        </aside>
      </div>

      {/* ================================================== */}
      {/* FARM LIST */}
      {/* ================================================== */}

      <section className="farmList" aria-labelledby="farmListTitle">
        <div className="farmListHeader">
          <div>
            <p className="sectionKicker">Saved locations</p>

            <h2 id="farmListTitle">All my farms</h2>
          </div>

          <span className="farmCount">{farms.length} saved</span>
        </div>

        {farms.length > 0 ? (
          <div className="farmRows">
            {farms.map((farm, index) => (
              <div
                className="farmRow"
                key={farm._id || `${farm.latitude}-${farm.longitude}-${index}`}
              >
                {/* FARM LOCATION */}

                <button
                  className="farmRowLocation"
                  type="button"
                  onClick={() => selectSavedFarm(farm)}
                >
                  <span className="farmRowIcon material-symbols-sharp">
                    location_on
                  </span>

                  <span className="farmRowDetails">
                    <strong>{farm.placeName || "Unknown location"}</strong>

                    <span>
                      {Number(farm.latitude).toFixed(6)},{" "}
                      {Number(farm.longitude).toFixed(6)}
                    </span>
                  </span>
                </button>

                {/* FARM ACTIONS */}

                <div className="farmRowActions">
                  {/* -------------------------------- */}
                  {/* ADD DEVICE */}
                  {/* -------------------------------- */}

                  <button
                    className="equipmentButton equipmentButtonRow"
                    type="button"
                    onClick={() => registerDevice(farm)}
                  >
                    <span className="material-symbols-sharp">add</span>
                    Add device
                  </button>

                  {/* -------------------------------- */}
                  {/* EQUIPMENTS */}
                  {/* -------------------------------- */}

                  <button
                    className="equipmentButton equipmentButtonRow"
                    type="button"
                    onClick={() => openEquipmentPopup(farm)}
                  >
                    <span className="material-symbols-sharp">build</span>
                    Equipments
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="farmListEmpty">
            <span className="material-symbols-sharp">location_searching</span>

            <p>Your confirmed farm locations will appear here.</p>
          </div>
        )}
      </section>

      {/* ================================================== */}
      {/* EQUIPMENT POPUP */}
      {/* ================================================== */}

      {equipmentFarm && (
        <div
          className="equipmentOverlay"
          role="presentation"
          onClick={() => setEquipmentFarm(null)}
        >
          <section
            className="equipmentPopup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="equipmentPopupTitle"
            onClick={(event) => event.stopPropagation()}
          >
            {/* ------------------------------------------ */}
            {/* POPUP HEADER */}
            {/* ------------------------------------------ */}

            <div className="equipmentPopupHeader">
              <div>
                <p className="sectionKicker">
                  {equipmentFarm.placeName || "Farm"}
                </p>

                <h2 id="equipmentPopupTitle">Pump</h2>
              </div>

              <button
                className="equipmentCloseButton"
                type="button"
                aria-label="Close equipment tools"
                onClick={() => setEquipmentFarm(null)}
              >
                <span className="material-symbols-sharp">close</span>
              </button>
            </div>

            {/* ------------------------------------------ */}
            {/* NO DEVICE */}
            {/* ------------------------------------------ */}

            {equipmentDevices.length === 0 ? (
              <div className="equipmentToolSlot">
                <p>No ESP32 device is assigned to this location yet.</p>

                <p>
                  Use the <strong>Add device</strong> button for this farm
                  first.
                </p>
              </div>
            ) : (
              /* ---------------------------------------- */
              /* DEVICE CONTROLS */
              /* ---------------------------------------- */

              <div className="equipmentToolSlot">
                {equipmentDevices.map((device) => (
                  <div
                    key={device.deviceId}
                    style={{
                      width: "100%",
                    }}
                  >
                    <p>
                      <strong>{device.deviceName || "ESP32 Device"}</strong>
                    </p>

                    <p>Device ID: {device.deviceId}</p>

                    {/* ON */}

                    <button
                      type="button"
                      className={`toolButton ${
                        selectedTool === "ON" ? "isSelected" : ""
                      }`}
                      aria-pressed={selectedTool === "ON"}
                      onClick={() =>
                        setLightMode("ON", equipmentFarm._id, device.deviceId)
                      }
                    >
                      <span className="material-symbols-sharp">water_pump</span>
                      pump on
                    </button>

                    {/* OFF */}

                    <button
                      type="button"
                      className={`toolButton ${
                        selectedTool === "OFF" ? "isSelected" : ""
                      }`}
                      aria-pressed={selectedTool === "OFF"}
                      onClick={() =>
                        setLightMode("OFF", equipmentFarm._id, device.deviceId)
                      }
                    >
                      <span className="material-symbols-sharp">water_pump</span>
                      pump off
                    </button>

                    {/* AUTO */}

                    <button
                      type="button"
                      className={`toolButton ${
                        selectedTool === "AUTO" ? "isSelected" : ""
                      }`}
                      aria-pressed={selectedTool === "AUTO"}
                      onClick={() =>
                        setLightMode("AUTO", equipmentFarm._id, device.deviceId)
                      }
                    >
                      <span className="material-symbols-sharp">autorenew</span>
                      auto
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default Map_weather;
