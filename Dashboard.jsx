import './Dashboard.css'
function Dashboard() {
  return (
    <main>
        <h1>DashBoard</h1>
        <div class="horizontal">
          <div class="insights">
            <div class="top"><h2>Farm Weather Condition</h2></div>
            <div class="weather">
              <span class="material-icons-sharp">device_thermostat</span>
              <h3>Temprature</h3>

              <div class="numbers"><h3>20°C</h3></div>
            </div>
            <div class="weather">
              <span class="material-icons-sharp">ac_unit</span>
              <h3>Humidity</h3>

              <div class="numbers"><h3>63%</h3></div>
            </div>
            <div class="weather">
              <span class="material-icons-sharp">air</span>
              <h3>Wind Speed</h3>
              <div class="numbers"><h3>10km/h</h3></div>
            </div>
            <div class="weather">
              <span class="material-icons-sharp">clear_day</span>
              <h3>Sunlight Hours</h3>
              <div class="numbers"><h3>8.4</h3></div>
            </div>
            <div class="weather">
              <span class="material-icons-sharp">thunderstorm</span>
              <h3>Rain Probability</h3>
              <div class="numbers"><h3>10%</h3></div>
            </div>
          </div>

          
          <div class="insights">
            <div><h2>Crop Health Overview</h2></div>

            <div class="weather">
              <h3>Healty Fields</h3>
              <div class="numbers"><h3>42</h3></div>
            </div>
            <div class="weather">
              <h3>Moderate</h3>
              <div class="numbers"><h3>26</h3></div>
            </div>
            <div class="weather">
              <h3>Needs Attention</h3>
              <div class="numbers"><h3>5</h3></div>
            </div>
          </div>
        
        </div>
      </main>
  );
}

export default Dashboard;