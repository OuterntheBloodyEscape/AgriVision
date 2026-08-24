import './Dashboard.css'
function Dashboard() {
  return (
    <main className='main_DeshBoard'>
      <h1 className='head_dashBoard'>DashBoard</h1>
      <div class="horizontal">
        <div class="insights">
          <div class="top"><h2 className='ch2'>Farm Weather Condition</h2></div>
          <div class="weather">
            <span class="material-icons-sharp">device_thermostat</span>
            <h3 className='ch3'>Temprature</h3>

            <div class="numbers"><h3 className='ch3'>20°C</h3></div>
          </div>
          <div class="weather">
            <span class="material-icons-sharp">ac_unit</span>
            <h3 className='ch3'>Humidity</h3>

            <div class="numbers"><h3 className='ch3'>63%</h3></div>
          </div>
          <div class="weather">
            <span class="material-icons-sharp">air</span>
            <h3 className='ch3'>Wind Speed</h3>
            <div class="numbers"><h3 className='ch3'>10km/h</h3></div>
          </div>
          <div class="weather">
            <span class="material-icons-sharp">clear_day</span>
            <h3 className='ch3'>Sunlight Hours</h3>
            <div class="numbers"><h3 className='ch3'>8.4</h3></div>
          </div>
          <div class="weather">
            <span class="material-icons-sharp">thunderstorm</span>
            <h3 className='ch3'>Rain Probability</h3>
            <div class="numbers"><h3 className='ch3'>10%</h3></div>
          </div>
        </div>


        <div class="insights">
          <div><h2 className='ch2'>Crop Health Overview</h2></div>

          <div class="weather">
            <h3 className='ch3'>Healty Fields</h3>
            <div class="numbers"><h3 className='ch3'>42</h3></div>
          </div>
          <div class="weather">
            <h3 className='ch3'>Moderate</h3>
            <div class="numbers"><h3 className='ch3'>26</h3></div>
          </div>
          <div class="weather">
            <h3 className='ch3'>Needs Attention</h3>
            <div class="numbers"><h3 className='ch3'>5</h3></div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default Dashboard;