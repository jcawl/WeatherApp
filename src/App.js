import React, { useState } from 'react';
import Geocode from "react-geocode";



const api = {
  //insert openweathermap API key HERE 
  key: "API KEY",
  base: "https://api.openweathermap.org/data/2.5/"
}

//insert google geolocation API key here
Geocode.setApiKey("API KEY");

Geocode.setLanguage("en");

function App() {
  const [query, setQuery] = useState('');
  const [daily, setDaily]= useState({});
  const [city, setCity] = useState('');
  const [sunrise, setSun]= useState('');
  const [dataBox, setData]= useState('');
  const [dataDesc, setDesc]= useState('');
  const today = new Date()
  const tomorrow = new Date(today)
  const twoDays = new Date(today)
  const threeDays = new Date(today)
  const fourDays = new Date(today)
  const fiveDays = new Date(today)
  const sixDays = new Date(today)
  const sevenDays = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  twoDays.setDate(twoDays.getDate() + 2)
  threeDays.setDate(threeDays.getDate() + 3)
  fourDays.setDate(fourDays.getDate() + 4)
  fiveDays.setDate(fiveDays.getDate() + 5)
  sixDays.setDate(sixDays.getDate() + 6)
  sevenDays.setDate(sevenDays.getDate() + 7)

  const search = evt => {
    if (evt.key === "Enter") {
      getLat(query);
      dataTwoClicked(2);
      dataOneClicked(2);
    }
  }


  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${month} ${date} ${year}`
  }

  const forecastBuilder = (d) => {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[d.getDay()];
    let date = d.getDate();
    return `${day} ${date}`
  }

  function getBackground(temp) {
    if (temp >= 80) { 
      return 'app-warm'; 
    } else if (temp <= 40) { 
      return 'app-cold'; 
    } 
    return 'app-cool';
  }

  function getIcon(desc) {
    if (desc === "Clear") { 
      return 'day-clear'; 
    } if (desc === "Rain" || desc === "Drizzle") { 
      return 'day-rain'; 
    } if (desc === "Thunderstorm") { 
      return 'day-thunder'; 
    } if (desc === "Snow") { 
      return 'day-snow'; 
    } if (desc === "Atmosphere") { 
      return 'day-mist'; 
    } if (desc === "Clouds") { 
      return 'day-cloudy'; 
    } 
    return 'day-mist';
  }
  
  function getLat(city) {
    // Get latidude & longitude from address.
      Geocode.fromAddress(city).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          Geocode.fromLatLng(lat, lng).then(
            response => {
              const address = response.results[0].formatted_address;
              var adressSplit = address.split(',');
              var realCity = adressSplit[1] + "," + adressSplit[2];
              setCity(realCity);
            },
            error => {
              console.error(error);
            }
          );
          fetch(`${api.base}onecall?lat=${lat}&lon=${lng}&exclude=minutely&units=imperial&APPID=${api.key}`)
          .then(res => res.json())
          .then(result => {
            setDaily(result);
          });
          setQuery('');
        },
        error => {
          console.error(error);
        }
      );
  }
 
  function dataOneClicked(x) {
    if (sunrise.indexOf('AM') > -1){
      var d = new Date(daily.current.sunset * 1000);
      // Hours part from the timestamp
      var h = d.getHours();
      // Minutes part from the timestamp
      var m = "0" + d.getMinutes();
      var formattedTime = (h-12) + ':' + m.substr(-2) + 'PM';
      setSun(formattedTime);
    } else if(x === 2){
      setSun("")
    }else{
      d = new Date(daily.current.sunrise * 1000);
      // Hours part from the timestamp
      h = d.getHours();
      // Minutes part from the timestamp
      m = "0" + d.getMinutes();
      formattedTime = h + ':' + m.substr(-2) + 'AM';
      setSun(formattedTime);
    }
  }

  function dataTwoClicked(x) {
    if (dataDesc.indexOf('Wind') > -1){
      var formatData = Math.round(daily.current.feels_like) + '°F';
      setDesc("Feels Like");
      setData(formatData);
    } else if (dataDesc.indexOf('Feels') > -1){
      formatData = Math.round(daily.current.uvi);
      setDesc("Max UVI");
      setData(formatData);
    } else if(x === 2){
      setData("")
    } else {
      formatData = Math.round(daily.current.wind_speed) + "MPH";
      setDesc("Wind")
      setData(formatData);
    }
  }

  function getHour(x){
      var da = new Date(daily.hourly[x].dt * 1000);
      // Hours part from the timestamp
      var ho = da.getHours();
      var time = '';
      if (ho >= 13){
        time = (ho-12) + ':00PM';
      } else if (ho === 12){
        time = "Midday";
      } else if (ho === 0){
        time = "Midnight";
      }else{
        time = (ho) + ':00AM';
      }
      return time;
  }

  

  return (
    <div className={(typeof daily.main != "undefined") ? getBackground(daily.main.temp) : "app-cool"}>
    <main>
      <div className="search-box">
        <input type="text" className="search-bar" placeholder="City, State"
        onChange={e => setQuery(e.target.value)}
        value={query}
        onKeyPress={search}
        />
        <div className="search-circle"></div>
      </div>
      {(typeof daily.current != "undefined") ? (
      <div>
        <div className="location-box">
          <div className="location">{city}</div>
          <div className="date">{dateBuilder(today)}</div>
          <div className="data1" onClick={() => dataOneClicked(1)}>
            <div className="sunrise-sunset">{sunrise}</div>
            <div className={(sunrise.indexOf('AM') > -1) ? "rise" : ((sunrise.indexOf('PM') > -1) ? "set" : "highlight")}></div>
          </div>
          <div className="data2" onClick={() => dataTwoClicked(1)}>
            <div>{dataDesc}</div>
            <div className="data2data">{dataBox}</div>
          </div>
          <div className="hours">
            <div className="hour">{getHour(1)}
              <div className="hourly-temp">{Math.round(daily.hourly[1].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[1].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(2)}
              <div className="hourly-temp">{Math.round(daily.hourly[2].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[2].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(3)}
              <div className="hourly-temp">{Math.round(daily.hourly[3].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[3].weather[0].description}</div>  
            </div>
            <div className="hour">{getHour(4)}
              <div className="hourly-temp">{Math.round(daily.hourly[4].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[4].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(5)}
              <div className="hourly-temp">{Math.round(daily.hourly[5].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[5].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(6)}
              <div className="hourly-temp">{Math.round(daily.hourly[6].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[6].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(7)}
              <div className="hourly-temp">{Math.round(daily.hourly[7].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[7].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(8)}
              <div className="hourly-temp">{Math.round(daily.hourly[8].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[8].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(9)}
              <div className="hourly-temp">{Math.round(daily.hourly[9].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[9].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(10)}
              <div className="hourly-temp">{Math.round(daily.hourly[10].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[10].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(11)}
              <div className="hourly-temp">{Math.round(daily.hourly[11].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[11].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(12)}
              <div className="hourly-temp">{Math.round(daily.hourly[12].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[12].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(13)}
              <div className="hourly-temp">{Math.round(daily.hourly[13].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[13].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(14)}
             <div className="hourly-temp">{Math.round(daily.hourly[14].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[14].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(15)}
              <div className="hourly-temp">{Math.round(daily.hourly[15].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[15].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(16)}
             <div className="hourly-temp">{Math.round(daily.hourly[16].temp)}°F</div>
             <div className="hourly-weather">{daily.hourly[16].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(17)}
              <div className="hourly-temp">{Math.round(daily.hourly[17].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[17].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(18)}
              <div className="hourly-temp">{Math.round(daily.hourly[18].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[18].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(19)}
              <div className="hourly-temp">{Math.round(daily.hourly[19].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[19].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(20)}
              <div className="hourly-temp">{Math.round(daily.hourly[20].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[20].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(21)}
              <div className="hourly-temp">{Math.round(daily.hourly[21].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[21].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(22)}
              <div className="hourly-temp">{Math.round(daily.hourly[22].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[22].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(23)}
              <div className="hourly-temp">{Math.round(daily.hourly[23].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[23].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(24)}
              <div className="hourly-temp">{Math.round(daily.hourly[24].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[24].weather[0].description}</div>
            </div>
            <div className="hour">{getHour(25)}
              <div className="hourly-temp">{Math.round(daily.hourly[25].temp)}°F</div>
              <div className="hourly-weather">{daily.hourly[25].weather[0].description}</div>
            </div>
          </div>
          <div className="temp"> {Math.round(daily.current.temp)}°F</div>
      <div className="weather">{daily.current.weather[0].main}  -  {daily.current.weather[0].description}</div>
        </div>
        <div className="weather-box">
            <div className="seven-day">
                <div className="one-day">
                  <div className="day">{forecastBuilder(tomorrow)}</div>
                  <div className={getIcon(daily.daily[1].weather[0].main)}></div>
                  <div className="day-low-high">HI:{Math.round(daily.daily[1].temp.max)}  /  LO:{Math.round(daily.daily[1].temp.min)}</div>
                </div>
                <div className="one-day">
                  <div className="day">{forecastBuilder(twoDays)}</div>
                  <div className={getIcon(daily.daily[3].weather[0].main)}></div>
                  <div className="day-low-high">HI:{Math.round(daily.daily[2].temp.max)}  /  LO:{Math.round(daily.daily[2].temp.min)}</div>
                </div>
                <div className="one-day">
                  <div className="day">{forecastBuilder(threeDays)}</div>
                  <div className={getIcon(daily.daily[3].weather[0].main)}></div>
                  <div className="day-low-high">HI:{Math.round(daily.daily[3].temp.max)}  /  LO:{Math.round(daily.daily[3].temp.min)}</div>
                </div>
                <div className="one-day">
                  <div className="day">{forecastBuilder(fourDays)}</div>
                  <div className={getIcon(daily.daily[4].weather[0].main)}></div>
                  <div className="day-low-high">HI:{Math.round(daily.daily[4].temp.max)}  /  LO:{Math.round(daily.daily[4].temp.min)}</div>
                </div>
                <div className="one-day">
                  <div className="day">{forecastBuilder(fiveDays)}</div>
                  <div className={getIcon(daily.daily[5].weather[0].main)}></div>
                  <div className="day-low-high">HI:{Math.round(daily.daily[5].temp.max)}  /  LO:{Math.round(daily.daily[5].temp.min)}</div>
                </div>
                <div className="one-day">
                  <div className="day">{forecastBuilder(sixDays)}</div>
                  <div className={getIcon(daily.daily[6].weather[0].main)}></div>
                  <div className="day-low-high">HI:{Math.round(daily.daily[6].temp.max)}  /  LO:{Math.round(daily.daily[6].temp.min)}</div>
                </div>
                <div className="one-day">
                  <div className="day">{forecastBuilder(sevenDays)}</div>
                  <div className={getIcon(daily.daily[7].weather[0].main)}></div>
                  <div className="day-low-high">HI:{Math.round(daily.daily[7].temp.max)}  /  LO:{Math.round(daily.daily[7].temp.min)}</div>
                </div>
              </div>
          </div>
        </div>
      ) : ('')}
    </main>
    </div>
  );
}

export default App;
