import { useState } from "react";
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";
import { useEffect} from "react";
import "./Dashboard.css";
function Dashboard() {
  const [search, setSearch] = useState("");
  const PieChart_data = [
    { name: "Healthy Fields", value: 43, fill: "#16a34a" },
    { name: "Moderate Risk", value: 26, fill: "#fbbf24" },
    { name: "Needs Attention", value: 5, fill: "#ef4444" },
  ];

   const [farms, setFarms] = useState([]);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/farms/USER_ID"
        );

        const data = await response.json();

        setFarms(data);
      } catch (error) {
        console.error("Error fetching farms:", error);
      }
    };

    fetchFarms();
  }, []);

  return (
    <main className="main_DeshBoard">
      <header className="header">
        <input
          className="search_box"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="notification_button">
          <span className="material-symbols-sharp">notifications_active</span>
          <span className="notification_count">
            <h6>3</h6>
          </span>
        </button>
      </header>

      <div className="welcome">
        <h1>
          <strong>Hey User, Welcome!</strong>
        </h1>
        <div className="welcome_buttons">
          <button className="date_filter">
            <span className="material-symbols-sharp calendar_icon">
              calendar_month
            </span>
            <span className="filter_text">Monthly</span>
            <span className="material-symbols-sharp arrow_icon">
              keyboard_arrow_down
            </span>
          </button>
          <button className="Add_buttons">
            <span className="material-symbols-sharp calendar_icon">add</span>
            <span className="filter_text">
              <div className="ch3">Add Field</div>
            </span>
          </button>
        </div>
      </div>
      <div className="welcome_grid">
        <div className="welcome_grid_contents">
          <div className="grid_icons_writings">
            <span className="material-symbols-sharp grid_icons">lens_blur</span>
            <div className="grid_contents_writing">
              <span style={{ color: "green" }}>Total active fields</span>
              <span>24</span>
            </div>
          </div>
        </div>
        <div className="welcome_grid_contents">
          <div className="grid_icons_writings">
            <span className="material-symbols-sharp grid_icons">monitor</span>
            <div className="grid_contents_writing">
              <span style={{ color: "green" }}>Crops Monitored</span>
              <span>24</span>
            </div>
          </div>
        </div>
        <div className="welcome_grid_contents">
          <div className="grid_icons_writings">
            <span className="material-symbols-sharp grid_icons">
              temp_preferences_eco
            </span>
            <div className="grid_contents_writing">
              <span style={{ color: "green" }}>Soil Moisture Average</span>
              <span>24%</span>
            </div>
          </div>
        </div>
        <div className="welcome_grid_contents">
          <div className="grid_icons_writings">
            <span className="material-symbols-sharp grid_icons">
              water_pump
            </span>
            <div className="grid_contents_writing">
              <span style={{ color: "green" }}>Irrigation Cycles</span>
              <span>24</span>
            </div>
          </div>
        </div>
        <div className="welcome_grid_contents">
          <div className="grid_icons_writings">
            <span className="material-symbols-sharp grid_icons">
              water_drops
            </span>
            <div className="grid_contents_writing">
              <span style={{ color: "green" }}>Water Usage </span>
              <span>24 Liters</span>
            </div>
          </div>
        </div>
        <div className="welcome_grid_contents">
          <div className="grid_icons_writings">
            <span className="material-symbols-sharp grid_icons">
              heart_check
            </span>
            <div className="grid_contents_writing">
              <span style={{ color: "green" }}>Crop Health Score</span>
              <span>24%</span>
            </div>
          </div>
        </div>
        <div className="welcome_grid_contents">
          <div className="grid_icons_writings">
            <span className="material-symbols-sharp grid_icons">tsunami</span>
            <div className="grid_contents_writing">
              <span style={{ color: "green" }}>Weather Risk Level</span>
              <span>24</span>
            </div>
          </div>
        </div>
        <div className="welcome_grid_contents">
          <div className="grid_icons_writings">
            <span className="material-symbols-sharp grid_icons">
              agriculture
            </span>
            <div className="grid_contents_writing">
              <span style={{ color: "green" }}>Estimated Yield</span>
              <span>24 Tons</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard_parent">
        <h1>DashBoard</h1>
        <div className="dashboard_grid">
          <div className="insights">
            <div className="top">
              <h1 style={{ color: "green" }}>Farm Weather Condition</h1>
            </div>
            <div className="weather">
              <span className="material-symbols-sharp">device_thermostat</span>
              <h2>Temprature</h2>

              <div className="numbers">
                <h2>20°C</h2>
              </div>
            </div>
            <div className="weather">
              <span className="material-symbols-sharp">cool_to_dry</span>
              <h2>Humidity</h2>

              <div className="numbers">
                <h2>63%</h2>
              </div>
            </div>
            <div className="weather">
              <span className="material-symbols-sharp">air</span>
              <h2>Wind Speed</h2>
              <div className="numbers">
                <h2>10km/h</h2>
              </div>
            </div>
            <div className="weather">
              <span className="material-symbols-sharp">sunny</span>
              <h2>Sunlight Hours</h2>
              <div className="numbers">
                <h2>8.4</h2>
              </div>
            </div>
            <div className="weather">
              <span className="material-symbols-sharp">thunderstorm</span>
              <h2>Rain Probability</h2>
              <div className="numbers">
                <h2>10%</h2>
              </div>
            </div>
          </div>

          <div className="insights">
            <div>
              <h1 style={{ color: "green" }}>Crop Health Overview</h1>
            </div>
            <div className="pie_chart">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={PieChart_data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  ></Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="health_legend">
                {PieChart_data.map((item) => (
                  <div className="legend_item" key={item.name}>
                    <div className="legend_left">
                      <span
                        className="legend_dot"
                        style={{ backgroundColor: item.fill }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="insights">
            <div className="top">
              <h1 style={{ color: "green" }}>Seasonal Yield Forecast</h1>
            </div>
            <div className="weather">
              <h2>Wheat</h2>
              <div className="numbers">
                <h2>20 Tons</h2>
              </div>
            </div>
            <div className="weather">
              <h2>Rice</h2>
              <div className="numbers">
                <h2>63 Tons</h2>
              </div>
            </div>
            <div className="weather">
              <h2>Corn</h2>
              <div className="numbers">
                <h2>10 Tons</h2>
              </div>
            </div>
            <div className="weather">
              <h2>Vegetables</h2>
              <div className="numbers">
                <h2>8.4 Tons</h2>
              </div>
            </div>
            <div className="weather">
              <h2 style={{ color: "green" }}>Total expected yields</h2>
              <div className="numbers">
                <h2>500 Tons</h2>
              </div>
            </div>
          </div>

          <div className="insights">
            <div className="top">
              <h1 style={{ color: "green" }}>Irrigation Schedule</h1>
            </div>
            <div className="all_insights">
              <div className="weather">
                <span className="grid_icons_dashboard">
                  <span className="material-symbols-sharp">
                    <span style={{ color: "green" }}>salinity</span>
                  </span>
                </span>
                <h2>Next irrigation</h2>
                <div className="numbers">
                  <h2>04:30PM</h2>
                </div>
              </div>
              <div className="weather">
                <span className="grid_icons_dashboard">
                  <span className="material-symbols-sharp">
                    <span style={{ color: "green" }}>water</span>
                  </span>
                </span>
                <h2>Water Flow</h2>
                <div className="numbers">
                  <h2>Active</h2>
                </div>
              </div>
              <div className="weather">
                <span className="grid_icons_dashboard">
                  <span className="material-symbols-sharp">
                    <span style={{ color: "green" }}>view_comfy_alt</span>
                  </span>
                </span>
                <h2>Mode</h2>
                <div className="numbers">
                  <h2>Automatic</h2>
                </div>
              </div>
              <div className="weather">
                <h2 style={{ color: "green" }}>Total Cycles Completed</h2>
                <div className="numbers">
                  <h2>18</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="insights_extended">
            <div className="field_status_header">
              <div>
                <h1>Field Status</h1>
              </div>
              <button className="see_all">
                <span>
                  <h3>see all</h3>
                </span>
              </button>
            </div>
            <div className="field_status">
              <div className="field_table">
                <div className="field_row field_header">
                  <div style={{ textAlign: "center", color: "green" }}>
                    Field
                  </div>
                  <div style={{ color: "green" }}>Crops</div>
                  <div style={{ color: "green" }}>Soil Moisture</div>
                  <div style={{ color: "green" }}>Temp</div>
                  <div style={{ color: "green" }}>Health</div>
                </div>

                <div className="field_row">
                  <div className="field_row_image">
                    <img
                      src="data:image/jpeg;base64,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"
                      alt="field image"
                    />
                    Field A1
                  </div>
                  <div>Tomatoes</div>
                  <div>70%</div>
                  <div>24°C</div>
                  <div>Excellent</div>
                </div>

                {/* more rows */}

                <div className="field_row">
                  <div className="field_row_image">
                    <img
                      src="data:image/jpeg;base64,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"
                      alt="field image"
                    />
                    Field A1
                  </div>
                  <div>Tomatoes</div>
                  <div>70%</div>
                  <div>24°C</div>
                  <div>Excellent</div>
                </div>

                {/* more rows */}

                <div className="field_row">
                  <div className="field_row_image">
                    <img
                      src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA3wMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAADBAIFBgABB//EAEAQAAIBAgUCAwYEAwcCBwEAAAECAwQRAAUSITETQSJRYQYUMnGBkUKhsfAVI8EzQ1KS0eHxRJMkNHKCg6KyU//EABoBAAMBAQEBAAAAAAAAAAAAAAABAgMEBQb/xAAoEQACAgEDAwQCAwEAAAAAAAAAAQIRIQMSMRNBUQQUIjJCkVJhoXH/2gAMAwEAAhEDEQA/AMBl1FS5jXRxzyFZHTworfy2ZR8FjuAduPXFnlNTP7NJMaqlcR1FulHK11BXlDtckX2Prf1xX0eZvLA8ZpKNo+S3QN0K2Kn57dvXzxGbMhMUpszM9gjCMs2sRMbcdwvlYXGwxi54ruFMYzCuqWqKeWBYYYB4oSrF9rcWINhv8ueMVNdC1RMGSndCwDR6bDncbcDAhVToDTxOzrawbcm3Jw7EIp8vCPPEkigk9SwYah2He4348sY5jkpKzlesiiYx9ZIWukt4xp19vEOdyD9fPAJMuamtDKkoDeE321eEXYXAsu+3J5wzl+ZUVJSKEqpBNHIxMZfwkbW0jgNzbyxdU9VBJItdVVMwZjcO8d2Zh2vxcjv6gYU5uC4GlbFJaPq+zMLPPArtIdKvcvpUknjm1/LvjPoFf+QkSiU3HUHJ+/n9MXtdAkOXVEtIhhjE2qMhvCnhsRb15sLcYFQZbHPQNW1kBp4ol1GV30kuT4b9yvGHBqrQngjl7UcDMK2kUSupVQ6MSZPPnY87eptgdRmyrLGtPAZahRYwjhRYX3txtgYq8zkgMkSMYZrwiWVV0aRuLXFyQODzhnLKNaLLZDLTxOZAssM5fSzst7r9jxhtJfYBesyitnnD18xjeQAxwxXa9xYC9/THgyeShYyS5rHTTRdmYSaLjv5HfFk+ZHLsulgpIYppaqXRApju/Ow/9PpxviumyKaBbZhDIa6Ua3aU6VANr7nv4h9cNSbzwgwAy+kzLPZWAzCTSbjXMdIZVHbf0G2FqrJqugPQq6BnmkF0dHvpB4JA7HtfG3nyvJKSgjR5VaWGAs69ESWYgWU7bgE8g7eWKLPcyljmjFNNI1W6oialu2kXAPcen0w1qO6SCiup/aGWnojSTUMMk6EMtS91lUjg+trD7YPRe1JpkKTUUcut7yyK9ncb9yD5/LYYbybJRTzQCqhNRNLMvUUxklBa5U6tt+52O+NRmns/T09JDE2X0kVXPN0KZKddIe4J8Z8gASfl3vjWLUuCHgysvtZDTLI2S0T00s9tZkk1KoHZRb89jvjPVlVU5nWtPUfzJ5m4VbepsPnvjRZjklFltf7kumaaMaQXBAd/M9rd7Ydj9n5KKOeSeWCkQ0YkkmUErz4QLefz++I6lcDSFcgqafIWpZY6cVVRPp6jyLpKEn4UJ+m/zxb5jmuWnPq52gDlYvCJQNIkta53IYDbj1xSz0lTIXq0V2QkOnNyvBNrcbgXwWjnrs0hSjy1KSDRNr6pTxB7WvsDbjtxzfEKTmqY6p2X8bCmyyeqp2g0tTEz0wkINgD/ADALXXYnvt5c3rMhzp6KWseCldpKujjkWOS6guLqSBbc2/5wlUU/Sklps3nmaspyoEbSApIuokg27XJNzzguWrL/ABJ3hJqZDFYIrWKrqtzbyJ4wS1dqpDUbZeZdluYiamjmhkWnnls0iz6wykGwJAuG5HltzimrMtelRITO8lYWZXhUatKDcHUNrg9zxvg9bnsmXUcNDlBEHWAaQrJqJPBuDwdx9sZ1pbvLrleKZ2u2m7lQeRsD6YSdxWBU7CnL5Ja80JKRTxqZp5gxIC2B3P1Av5nD9bktL7vUyUUSdGGDU7M/Vdmt57AG57X2G43xVZXI65kyhQqumlkcaha45F+cbjKq7L6isp6Ncsp1Z4+ik8IuFYrYuqnzHb5YpOnQydClO/Ty3NqEU7loxA4uzSPfUSWPYi/3tjVy5pR0s7U3VAMK3bSCQgvYXPF8LZ7R0rVNPWMrSVkN2hiJuJLLYjfgW5Pbfvj5zJWSLJFK1TBSJM8hPRLalsTYMQCe+3pjThDQCGChQx1EryAsgkWLpHw3uLahySbc4Wjy33lR7s6NLGA2qFHDuLbkg9wRa3fscM0rUdQkNPX1fRWGZ9ZUspYeHxA9+/ke/OLWeGkir6eoy6rZI5piDvcqFFr7b23vbjvhIl2JUENYDHFLSwhZnKx1MiKCnIBJW+/P25w3Nl+TUlRE2tqsI461aZbvrva1uSNgP9sXUmR1VHSwGim99eOUyFZCApFjtv6njGaqUM9Y6GdqWSR7laYXiNjYAfWwvzbESW3C7gslmPZ6SrolrJqajVWu7WY7qASDa1rn977YygkhoapFpbVUYJtCt2Km/KjyIAxtaaKhgpvdqyetrpFYGSETymNVO9mHBANr+eFczywZYHmmoiC2opIpFgvNrcj5fLBqRUY2lgUZW8lFWJmWYUTNJQRinA6jdV1Q7eQAsOTx548/gjpSSz1hlZAAEjgDOnNtwTyPW3HGNNRTzzRSR06R6SLuwNwtjsT5d98aDLsvknppKFozEsaE6mjK9Med/wAZJ1Eff0xz6E5ye1KjWaSVnzNqQM9NI1bPBSf3cjykhGHzFtz5bcYHVJWSsIUqTWq85AmiTxOfS5BO3pjU+0lAI5I4ulNBHJqWSNGJd1X8Vhsdx22HbCtDG5qIJJotIjpveBH0l0vchS4UWtyAD2vjZtrnJF2Sb2cqMqpo6zL2gkqhbqR1J8UIbgA257HClVHnWYZgBV5hRq7AQtJF/MKKQCAQQLLfYn58jG0q6+iqZKamhiVtEKeNzqsgsbsQGPYjfkjGbfRRZ77tFTipbTZ0hGppDe4O5strgbkcYepLb9RRt8lRX1lXSNBDX5ZE8yIYo3i/s5+NR+ViuPafLc0OZpV5jFIanwhdFtMakED12v24xeCkGaxRz5hoNTIwNOIgVjjZWuYSu1gbm7d7nyxCOqnpo2kpopJ6tipivfqxgG9j6ANbf9cTN2qj3KX9j0/tBPlgjKJJFEgbq3TX1H2sdyNh89rjDPso8+a1ZzbMp0LlSKWBX/swfibT5tYfIXxnpovf0LV0uou+tIhEyQwnvuVFzsBv37HBVyqOIRSTdajp5NUolUkhFB+Ijz7X2/XC09RadR5FOO7Jpc+yCjzGoJWZaaqI3JW5vcG4/rikro6SlgmpawTVFYZulGYVVkYAEFtN9/qLgjAPaWsqqt0p6WomCUaAJrGhj+Hk7seCfriuyyleqlVpGaKRb2k8QufJbAm/64rUknLgUYtI8q56qemmgpoXESRxxyQtuASLBgl/iJ/phSWWaCWJI4npzGukNq0lyB4Tfy428u/fFt7O0v8A4ic1FPPNJrYiKNLtrKjkkeRP540OUZNl9ppaiKriamjWRlCX1Ej8N7m+235Yl3VIr/pioqGpngFVUC0TyrGXUE2uQLMB88HHXaSWXLa2FaenZYI6liwNwb6lAW9rkC9vvhuuzSiM9TBF71FTPpaWJyAzgci444Prxxh/JYGfK0p4aNfeXb3iNQ9ndbm6ji9vM32G2HHjICg9mVzfqSUtRWVdT4UDyAKNW+ve/wAI2scKe0mUPk7xUzpTLCiEh6b4jfknz34xsa+eLIWhrKCIirqYSHp0S8btfnbhja++x9MYXMJaqqzCSbM4iEBN0RtIj58xi5YQiqi6qZhG6IwVvCLi3hHr9BjT5DUUkObJJEhOnQq9ZdQZjbUT3sLm3fjjFRBl7dRJ545niSJpCoNivFjvwLm/0wdq/wBxeRaSpYvKiKZip8ViDcjsRa2IvKGfUcwo/wCIyQVRljEPRPS1A3ubb38th5HHzr21pKKhnEVJqmYktJKX2BP4QBxa354WzfPqqsYmOWRIlNljY6hxYn62v5YpzLIwJZidRvc4tysEjYUfsxE9VozCE6VUrZUsjAjsR5b84u8uy6nytCIF1uxB1OBc+XGGwsvbfBNLqCWFjbHVGCiYbmySyym14rjtbkYpvaGgFLTvWUsSamYSNC0QIJ+Etc8bHv5YvoACobVc+WHLCaNopUVkYaWU8EeWFNWqKijJwR1+Y9OaOiSAAIrl1AWRQLWFr3F99/TyxpamlgroRHUagoP4dj5cjjnElgjgjWGnQJEuwQDb6eWKHN899ylmh2KhTdgSGXa21jf1viW4wjbE028EPaSuhy6GJMseJZ1Op9KlmNuCTwRzsfTC0XttIlLNJCNMs0jKGdC7htPhA2N7b8/piqpKZ6jLDWSU41QEytOWJEyX4uDYH8+MGrsrWoy9a7KI6maSZgZUhuACQNwv+l+2Of5W2sGq4plg8cFXIaevnR5aicNJMrsNLafwgC/FwF25Bxbez1GXrJamdpqiKn/kRvM17bnUN+17AjsRjNZDSmodGqX6MEbFJZ5H0jWORvbxA9u23O9tnl+bZZT0tJBFKzQ1I6aIQp0G51X223N/9sLRbWZjdVgzftBBR5bVu9DUWaBlBpk1Bwdtz2KhSNzfv3xS0RqenJV1c0nvNU21QhBaMKbounbm3540+d5WKzPGjinjlSqe6pFD8BHxamXZ9xuDv6YPW+yp60DLNAhjQxsVjK6rjc7HvhfKTaSDERDKmgropaesM0lToLe8xrchPxDSvLADYm5HrwR1rHKaeCOly6QvKeoZ2dluw33sNTG29+fFY8G2oynK46amjjujvGxPU07gnsO/5nE66k94j0TozKDfY2v2xcNNxhV5JbyYsVGbzRrL0lq3cMrIU1JZiNrkdj27XGLSnyqprWM9NOYIgSYyysBquNQCG1luLjbtbF5EogjWKGPpxrsFUcYJHKb7k39cNaC/Ji3+EYuopZKJnijjqJKmWpLo88IJ4N3sO2xFxvv2ubmlaLKzTvRTTSPKS+keER+G+/8AhBvcd7D7v+0cTUeY0uY6mvI4SRxpBtsVUbE8jkeox7l+USzyvUKssfWmL1EUpsjgEAqQACtm4F+BbENLdRaurJ0Mg9mPZ5aqpMjzVTktEH1i9+dQHNrDnFDWV9bn8sk9TP0RTwF/dUuvAuDufOwv64tva7+IPWRiopXjyxBvIra0J4BCgbNv8sV1LllFLI9dIZYdQvFVAgBd7ElSxI3tiZyadIIxvkoqadoSVzOESAuJDGx0sLXuRpPNuMaCmzIR1dUtHSdOhaMOUlN5WBNvCTewJtwPPDSIubZ+8E9TFPrTT1le6C912NhuF3t5/lZPkRopG92g9+RIgjSOxDREA7oeLC423JPniY2+CmkihOd1dUKOloYhTQ0xUl0j/li3Lbj4r3ttfnfFNmjVSZka6SoSVtV4hYjbVbg/p63xpBldTBQvPmFRUSZaUA2kQSG5v8Pc6jt+eMrmVOweIzxMsYDBdZ/tFuPEByPr6+WHJu6BLwW4rqdlkkWdqZGS7CezrJc7xlVA2uL722xW5tTxVFRI9DA8kK36fTjIuT2Pp3t6nAaWHph5CU6ABC6lBc/ltsDvjRLUZuFFDUQgRoF09NVvbTbUSNybb8+fliHJopRsyEkEkbjQQpkS7Ro24F+Lc8jj0x0FGZE1M0dxtpd9JH0tfGrzfJayGm64jhjqkUCoQWMoH4W08C4txuO+Kx6SeF4HaRrlLkgW0ki+53/TD3NBtNxHIYyCNrdiMPioEsdioJ+WFDZxvzjkDAjQxBx3bkY00SaIXJRtJ8uMSiMo8zj3Q7m7eL1wUQ+EaSQ3ke+DcJwfJJSw+NTjAZzTUSTaZiHiqGdo5KUhjbsNAv3vva+PoUc2n4gcUtRkVLCstTQoy1pl6wYP4ifK54GImtw1gxFFlE0iiGmll0tcSLBqbSNiQ9hzwQPLFjT0MkMUs1HEJKSMXVWjG58QZlB3JFuT5j63Cezlf0mplYPTzyMWDudUYNidRVhqNx5Ylm9PHSpSUkrWzDRY1PT0oFAAsLeIqLfXf6Y7WmXhgsk9yzGI01RLKUqlcTIo4luttIUdvl3wm1NmNBKkFVUx0iKypCHBS5AIOn18Xy+2Leko1oajrr71T1JiYLoF1QeCwW4AFx58BcVeZlq+r69TmUNVLrdA8LgdKO58Wj6j5m2FNWhpFl7OUVFFnc0DvPNUUqLJDMX7d7aeRYr88PjPHn9omplEktHLZI30+HUOSNuPX7YoHyCCGSiDVU7JJSa7LGrFVNtRLA8XN72sMar2XWlhWWmQsZIxbU8usMu4BXvbkfTBGTWENxst0i6fNjfyO+JMl9xgulRxjraRti3qDUBJ0UncYjoCD+VECxPcXw50wN739MSRbG/GI6g9hXzU4cATxhgCDuO+Jh/U4tB0il2IJ8sJPChP8tvvhrVJemD8LKVkUMp/C298YarmWfPBL/Cw6ORDJASiErfbbvvvjfLEy77HCNRk1FUTyTVFMJJJE0MzEm67G35YmclIFFozuRZNIlbAaiGWMBVkU9O4Q31bn4bk+XY7416gL8NwD+748hpkhgSGFAkaCyoo2AwTQw+IYIyUFQ9jZX53FVTZbKKVmaa3wjll/wAIt/vjHjIKwVimphdgI9KmYjxEjhTxf9jjH0LTbjCOe001VlM8MEKzTEXiVgDZvPfvziJuMslKLRgPdEy+qiiYlWV2PQmCjSAwJLE8jmx7+eNBkFIvuk2aZdEaiqWQqsFhKFffQ3FyBtwfW9tsUMOX5g1UK+FAZQSUhmbqO5vvYWufK588dFm+ZwVNmkmuIgjpC2jSo2sdvz+eMlKslUzR5rlIosnrq/NkhWqnto6Re6ue27fpjK0NFUVbinhJNOAWuxJS/Ow59L8YvaqKszWKjXMalqZo4gohkkZS5udLm4t3A4ufPDuRw09VNJSV5KQFQI+hqRBp/wATebfF9vTEy+RajR5GzjfDUb3+IXxyQE/hODCnYfhOOlyIUT1Ct9hY4OpJ5scCWIjtgyIcTvY9tnaFblbH0x4YbnBlXBVjvg6rQdNMWWEjcHAZsuhqKmKomVneNWVRfwi/O30xZiLEhHg698h0UAmjSoheKYFo3FmXzxWL7O5cHJ6TaSAGj1bEdhvvbjv2xd9PHvTwnqph0xKgoabL6cU9MhWNSSAd9zzhlBChLJGqseSBucE6eOMeM3q0UoHgZP8AFiQt54j0vTHCIjvjJ6pewIqgnfEhGO2BhWGCKSO2M3rF7CSxJ3UXxIQxeWOBx7bfC64bDhToTcbfLEXQAHa5wZb22x60dxg64tgkupWvYXwddD+Jz9BjulY4JGqjkYT1h7ATIh+DHdM2IHlhvSCO2JWW3w4I62QcUfNc+yvOosyg6soqtf8AZErtqAHA7WG/0OGq6ehny+E+5g1YvG1PBNbSFHxsoHHz7Y+gdNSwOkXHB8sIVeUipruuWjMbx9OSJkJ1eRvfkfL64paiZO1GeyrJDVqjVTPHTPpdaUBRrUW+MgWte9hjVJEAxaMadW50i1/XHUtFHSRlY7m+7E9za39MGAI4xlPWrBSR8xrJM001tN7z1N+qrJqsFvyCPKxBxW5d7RJlNPTNUZm0rfihkN7ki+/JHBxn80rs0zirEVBR1FFQ1PTSaPRfTY83O9hfgEd8Dp8srKOt6seV1FSEYx2ZLK67jUCT6Ai4749Rxh3f+nH1GfVMnzykzGCGWReiJlLqzbKQDbvv2OD/AMayb+KjKxmEBrS/TEQufF5X4vj5JW5NnVe7MlFVRJwiyMukeg8tydxb88eR+yubobrCI5VW4czgXb7/AExF6S5mv2N6r7I+jZv7a5dl1Y1JFTVNVMrFToXSp9QTyPlgVP7e0EuZCiGX1atazM9hZvK3P74xgab2a9oFm6kiREhTYyVYOnnYC58z98WoyjNJM1gzOQUUcsDppQSeGym4NrHfEynor8l+xLUkz6RFn1PNIopIGmiuA8gYAg97L8Rt8sOy5pQx6QJGdnIAREJbf07YykE8JinFbHG+q7Rt8ZQ+l7afkNsWL5zSrDSxxtKrxjS7AKuw4HJv38rXxxvXh5OhSRqEVXQPH4lO4IxLpjyxjZ87qJliWKpWNUBvGjsoY35JAN9u3GLt/aqj90/lxlqvRssmyavUje30xPXg3yPci3CAjjHGLGMpvaPP0qRLVvlUkFt4UaRbfXTiwyr2onM0ozeOmEZF4zSMzMD5HUBgepHyPejR9LHdHFafanKxIFAqCpG76OPpiZ9p8qH45f8AtYyc4vuV1EP9LHvRwgPabKT/AHst/Lp46P2nyxiwkZ0sdvATiN0fI+oWAhxMR4ST2iyp/hnc/wDxNgq55lh/6g/9tsLdD+QuoNBMTCXwsM4yw/8AUj6q3+mCLmuWniqX7HDUtN/kv2JzDdLHhhx4uZUNv/Mx4KtZRn/qYvvivg/yX7J3sGsVsTCYIKmkP9/H/mxLq0/aVP8AMMKo/wAkJzbB6LYkFwQSwEf2qf5segxH+8X/ADDFbfDFuB6R5YkIg3FsEXpn+8T/ADDBEKcXVvkcaRinyyHNnwiOpma381bb3uxx6ZXJuCD5gMN/ritjnlkP/kde2+thgsVVVqen7rSxKvcuTf7DGb0Wc1lgs7H4rqBvq17nEkmJA8YsTfnCzzVm1o6dlYb6XawxOOYiIiZoVPyA3v6n93xm9MpMbNtW7b2/PEwFYbk39DfCQSPqf28Wlm2Kqpt98EtEpI98dQL6bRAj57DEOA0xtI497yPt2wRYEFrFjq43whJPTxizO9hYFrd/qMeqsFgHiqrMwsGkvp/23xGx8jssVpNtpCAOB4RgiRp//ZNxv4rH8sVwjp0CO9LtyCQfpxg0VXCpQR0pR2AsBHwPK49MZyi6wUmh/QtgWnW4Fv7QkfXEGaAsP/EwknjbVviDS1KprjiXWf8AF328sSU1Go9SnUqN1HT3+n54jb5KsII1N/5z28wpx1lQksJJB2tpFseskxdEX3hO5Cpta+IdF1XU0tXp32K2tt98TX9jCIEv4Qzf+4G32xPwDxWI9bnAxDdf5aOx4PUe1zgYoqQKFEcbOdtL3YA4VR7sYy0sY8LSRgnjWTjwSxNcxzwmw/AhOJ9FFJMjQeE+HbgYJeGMXdoiOxVLd9sZ47Fo8S5W+o/RLXx6dV7kSfWwxxq4lXUihhscQFdE50pEb9yRtial4KsKFZnsFf8A7mJ9NgbG49CScLGqdomMcSqRtxY4IJKghWkCICN7ncH+uE4yGhlBp7G+DJIR+I/fCMcqE2NSrH/D/vg0ZiDEtIz97X4xnKHkpMdWa3JcjBlqB5thGN4/wXJv+I4MG8IJKj0xjKCN4yHkl1YOkhtzbFcjoTsTg6yIBfVb5jGDi1wWmmfKGo60zFFqGGskrZ1Fx23+mJRUc2p42lZgSUHUPf8AYOK0Z9Kt9DEHTddVvhttgMmdPMCioE2HjHxAfsjH23R1XijwrReQZPMTGxfpLvcFtYYX9eO+OGSRyF5JY4pAJBoZGsfiA38vX0v6YzBr6yaISF3ZV5AOx35/fliUGZSVRZmlEOhQq72B4B2+ROL9vrLO4Vo1kdNTUsZadiRcqq6779rD6/lhtKzL4LQiVVQjsNW/qf3xjNLXQwMql3ljTSTtc3ud/ub4BDWUs5cRxEnQX8Td+Ln0G2Od+mlLmylI2P8AFqFNQEZeJbMVI3B27/T8sBbOqViqrSB0K6yRJYsf8Pz2vjKQgO0r69I0hlF7EeY+5xKlpaOSCXpPIsyoSbve5v8A8YPaacebK3svZ/bLTHpWnV10gqGuDfEV9q62WNRBQh7qdJUcAbfpjPQyx1UzSSRPG6uSCOH3NsMtNMrKKUtfURoG21v1xftdGOFEW+Rc02eZjUVIWSNVpylyQg2O35kf1w0tdWTsSlQNrnTqO47bdjtbGbEs4qFKx7WZlFib6RwfmL4bho5Yq0+8uXte7DhbC5/Un7Ymfp4LKSQ1Jlv/ABWuLOsUm6W32UkXFze/pgI9oKmBbsSyX1Egm48wP32wnlcSmqZamJ3S90I22sefO+LSnoKamgqIYYbIyhhqcX7+H9+mMZx0o4asq2xan9oSeoY4WkkUapDptf5j998OR5jO2kvTsFZRZSQNJsd9/tiSxUkM7h4I9NRpJAF9zcDcfPHVUtK0BUMwl/ECbA2O1j8+2MpdNv4xKV+Qolncusjw6FtpGm+9+dvT9cOI9MD1J5GLgnSy9t77+tsU6VNOjQsVOojStxs24ta/pb74ZaogCSOIbNcBtyNt9/vpxlPTd8FKRcpUU5QTBBoXe53tgb1zBJHWn2Uk6StvnimXMdMzM0JGo3kCk7WNhtglVmKmNVVAFHhY77nm35AfXGft3dD3lw1Q0qv4hHtYXby/5xB5KXSWkMgZeLm4v+zivWthMLGR4weR3JFgb/LYfc4Sqa2nu8chJUAWUHSTub4I+nbdFbzQRTUvUMUeldVxYjf0xNJwuyo2yAjUOBiijrIfG6JoJsWc3uQTyPz2+WOjrWMrPHNri5A7Hz+mE/TNjUzQLOxCsDa+523vwcckjFTdj8zilbMR1mEqAJtqcHdgB5YGucJIxSMPJf4Tbbzxm/TS7ItTNIkzbWaw74MJ7E6iAO18Zs1MultbiLvYYimaRwppdtTE3DX7Yh+lb4NoTPmkQXQ0aJfw2DHv5/v/AFwdadEQXbpst9r878Y8ihjVlWRvEfCW8t9zg8qQVAdSXbpKAXHbcbjzBBP2x9fJ5weOIwBxUv0xoAOy8A2H7++DVEDtJpSMAhlYH0JuP9Prg6o8w6rBbIyhwvJOgW/ph2nlmjiRajQ0Fymphwb7bfM4mWpTtBRWZbPNHUtF0mUSnxKe1zt9Nxg+a0U8TCqidlZovFFa1gb9vr+WG6lhTmSVgHlAiUm3wgDUcQpqxOos0vjLAjTq53GIc3e6KHgLltIZYJpZJAZFa40mwtYlgf8A649yaCOImaZt9IGlhvcjj/UemG6KroyrxSg6gzM4Ddjs3/5xX0zv042MgZxdnUi+k2Pb6/ljK5StPA8ItiadAXiRuiBKxZhbfb9MLRQQ+76pWbWjciwN7jYYjK8jqkSodA0k2Fr7b3Hlz+uI0jinE7WZW8LBVF7i5/0xmouuQsanLBkk07dM9VVF7AiwHpsRiFLOFo452C6CrW0+KwLFTf5/1wpUVyzROSxMusFgeCAu4/IfbApaqV0jKREwqpu3a1yd/ph9JuNMLLZs1eWr6d7GMi9iF19x+/XCU2ZF7XYiKcdSIjba3Hp2/LFfUwa6p2p7iMeNWY22AuD684DLDPJGLISI11b8EW2A+YxpHQgg3M0EmbGGORYyJYUGkgD4lJNzf0J2+eE2lqTKhjRpRICT3uduPmMIVsMtOyGOYEMgDMeCT+H1Gxw1BWSSKbEAICQy7Gy2A/TB0opXEdjfvbTyQJVsA8DGwC/g0nn14xOnmURs0khM4A1pfZhfb8r/AFA88V9PK1RWyTV8mkRDTIF2LBjbb6bj5DHlRW08b3lXW66VkvsDa++3f/U4T0uwbi4NYgeIxh2BDK4Avra3Y/K2FP4hJHKY43CxM48J2K+W/wBRhODMAqKtIAGALJ56rah97WxXyVTnpSudQ1EPvzud/wB+QwQ9P5Q9xpP4jSIixMgn1OLW2tsAF9LkceuBjMYSEijKqXlLM7/EoO+5/fOM5U1oULFEBsdVx5/8HEJjOKhQw2JAuex5/T+uKXpUG8uJKmV1ZTOSyLz/AIbW0k+m+IzV0nW6VOsoZhYqe1zx+WEhNHBMXjIVmFm+RPf5WwGTNWAtEoUK+pPMc9/kcXHRvhBuLnqlVilnYh1FmUnn5emItnJAIj0qb/h4sBawxnGqZJGN2JwSEI+5ZupcAIADf64r2y5kUpNly+ZyuRd2sOd8NJO7gNICPUj7dsVlPH1GW4BsbG172G/6YsYahIGvFDGCALjGUtKK+qOiEqKLnpHuIzhymPu1UFTdZorsG7eG+33x2Ox0y4OEPC7RnwsfFIGP5jHtSTEzsnIa4v23Y47HY519gC5ox93q2HxOniPncsDipijUz0yEXDVSqb+TaAf0x2Oxpo8AGlOiZdO2pwp+RA/f1xF5njrnCWAUlR8tWOx2KQB3q5hPIFcqY2IDDnYED8sFy6RpL9RiwSQgA9/Dj3HYzkkkCGMwpIIoZUWMXd5GL/i/s7/qThNKqbqxQF/5cqxhh80JP648x2HHMcj7nuZyMJxED4YS8a/IhecEpKiWWjmp5H1RRIyqD5eE/wBbY9x2BL4IfchIFNGsTorKA/I35GE6mZ+qLG2v+UxHdRvjsdh6Yme2ApopBsxQ3PnbjAczJjqWCbC/6jHY7GkPuDEBI0Lhk2YWIP0GCXMjpGxOln3x2OxsIfrY1p2XRvoOxP1OF6id9Pa7i7Huce47GUM1Y3yIuxIvffEF88e47HR2EEjYt3tbfbD9JEszgOTyMdjsRI0iHF4ni0k3fYn0wdJpOhIAxAV7AA47HYxZqj//2Q=="
                      alt="field image"
                    />
                    Field A1
                  </div>
                  <div>Tomatoes</div>
                  <div>70%</div>
                  <div>24°C</div>
                  <div>Excellent</div>
                </div>

                {/* more rows */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
