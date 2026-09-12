import { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import "./map_weather.css";
function Map_weather() {
  const [location, setLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const saveLocation = async (location) => {
    const token = localStorage.getItem("av_token");

    const response = await fetch("http://localhost:5000/api/farms/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        latitude: location.lat,
        longitude: location.lng,
      }),
    });

    const data = await response.json();

    console.log(data);
  };
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const newLocation = {
          lat: latitude,
          lng: longitude,
        };

        setLocation(newLocation);

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        saveLocation(newLocation);
      },

      (error) => {
        alert("Location error: " + error.message);
      },
    );
  };
  if (!isLoaded) {
    return <h2>Loading map...</h2>;
  }
  return (
    <main>
      <div className="heading">
        <span>
          <h1>Hello Zayed</h1>
        </span>
        <button className="addButton" onClick={getLocation}>
          <span className="addButtonColor">Add</span>{" "}
          <span className="addButtonColor">Location</span>
          <span className="addButtonColor">+</span>
        </button>
      </div>
      /*====================================================Heading=======================================*/
      <div className="grid">
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "400px",
          }}
          center={location || { lat: 23.8103, lng: 90.4125 }}
          zoom={15}
        >
          {location && <Marker position={location} />}
        </GoogleMap>
        <div className="weatherConditions" style={{ background: "white" }}>
          <div className="weatherConditionHeader">
            <h1>Weather Condition</h1>
            <span class="material-symbols-sharp">filter_drama</span>
          </div>
          <div className="weatherConditionChild">
            <div className="weatherCondition">
              <div className="icons">
                <span class="material-symbols-sharp">device_thermostat</span>
              </div>
              <div className="weatherConditionsVertical">
                <span>Temprature</span>
                <h3>23</h3>
              </div>
            </div>
            <div className="weatherCondition">
              <div className="icons">
                <span class="material-symbols-sharp">device_thermostat</span>
              </div>
              <div className="weatherConditionsVertical">
                <span>Temprature</span>
                <h3>23</h3>
              </div>
            </div>
            <div className="weatherCondition">
              <div className="icons">
                <span class="material-symbols-sharp">device_thermostat</span>
              </div>
              <div className="weatherConditionsVertical">
                <span>Temprature</span>
                <h3>23</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="weatherConditions" style={{ background: "white" }}>
          <div className="weatherConditionHeader">
            <h1>Weather Condition</h1>
            <span class="material-symbols-sharp">filter_drama</span>
          </div>
          <div className="weatherConditionChild">
            <div className="weatherCondition">
              <div className="icons">
                <span class="material-symbols-sharp">device_thermostat</span>
              </div>
              <div className="weatherConditionsVertical">
                <span>Temprature</span>
                <h3>23</h3>
              </div>
            </div>
            <div className="weatherCondition">
              <div className="icons">
                <span class="material-symbols-sharp">device_thermostat</span>
              </div>
              <div className="weatherConditionsVertical">
                <span>Temprature</span>
                <h3>23</h3>
              </div>
            </div>
            <div className="weatherCondition">
              <div className="icons">
                <span class="material-symbols-sharp">device_thermostat</span>
              </div>
              <div className="weatherConditionsVertical">
                <span>Temprature</span>
                <h3>23</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Map_weather;
