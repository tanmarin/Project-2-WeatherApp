//current day function
function formateTime(timestamp) {
  let present = new Date(timestamp);
   let hour = present.getHours();
  let mins = present.getMinutes();

  if (hour < 10) {
    hour = `0${hour}`;
  }

  if (mins < 10) {
    mins = `0${mins}`;
  }

  return `${hour}:${mins}`;
}

function formateDate(timestamp) {
  let present = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "January",
    "Feburary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "Novemeber",
    "December",
  ];
  let day = days[present.getDay()];
  let month = months[present.getMonth()];
  let dates = present.getDate();

  return `${day}, ${dates} ${month}, ${formateTime(timestamp)}`;
}

function sunriseHour(timestamp) {

 return `${formateTime(timestamp)}`;
}

function sunsetHour(timestamp) {
 
  return `${formateTime(timestamp)}`;
}

//Current Weather

function callTemp(response) {
  console.log(response);

  document.querySelector("#dates-time").innerHTML = formateDate(
    response.data.dt * 1000
  );
  document.querySelector("#sunrise").innerHTML = sunriseHour(
    response.data.sys.sunrise* 1000
  );
  document.querySelector("#sunset").innerHTML = sunsetHour(
    response.data.sys.sunset* 1000
  );

  document
    .querySelector("#weather-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  document
    .querySelector("#weather-icon")
    .setAttribute("alt", response.data.weather[0].description);
  document.querySelector("h1").innerHTML = `${response.data.name}`;
  document.querySelector(
    "h3"
  ).innerHTML = `${response.data.weather[0].description}`;
  hightemp = response.data.main.temp_max;

  lowtemp = response.data.main.temp_min;

  document.querySelector("#high-temp").innerHTML = Math.round(hightemp);

  document.querySelector("#low-temp").innerHTML = Math.round(lowtemp);

  celsiusTemperature = response.data.main.temp;

  document.querySelector("#current-temp").innerHTML = Math.round(
    celsiusTemperature
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.main.humidity
  );

  feelTemp = response.data.main.feels_like;
  document.querySelector("#feeling-temp").innerHTML = Math.round(feelTemp);
  document.querySelector("#clouds").innerHTML = Math.round(
    response.data.clouds.all
  );
}

//search location

function search(city) {
  let apiKey = "65b9beaa8544369015325811bb427882";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndPoint}?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(callTemp);
  axios.get(apiUrl).then(changeImage);

  let apiFiveEndPoint = "https://api.openweathermap.org/data/2.5/forecast";
  apiUrl = `${apiFiveEndPoint}?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(dispalyForecast);

}

function submitCityLocation(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#submitted-city").value;
  search(cityInput);
  
}

let formCall = document.querySelector("#city-form");

formCall.addEventListener("submit", submitCityLocation);

//geolocation function

function geoLocal(location) {
  navigator.geolocation.getCurrentPosition(cityView);
}

function cityView(location) {
  let latitude = location.coords.latitude;
  let longitude = location.coords.longitude;
  let apiKey = "65b9beaa8544369015325811bb427882";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrlNew = `${apiEndPoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrlNew).then(callTemp);

  let apiFiveEndPoint = "https://api.openweathermap.org/data/2.5/forecast";
  let apiUrl = `${apiFiveEndPoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(dispalyForecast);
}

let gpsButton = document.querySelector("#button-geo");
gpsButton.addEventListener("click", geoLocal);

//5 day forecast loop
function dispalyForecast(response) {
  console.log(response);
  let forecastHour =null;
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML=null;   
  for (let index = 0; index < 6; index++) {
    forecastHour = response.data.list[index];
   forcastTemp =forecastHour.main.temp;
    forecastElement.innerHTML += `
            <div class="col-2 forecast-five">
            <h6>${formateTime(forecastHour.dt*1000)}</h6>
            <img class="forecast-icon" 
            src="http://openweathermap.org/img/wn/${
          forecastHour.weather[0].icon
        }@2x.png"
             />
            <p class="tempforecast" id="forecast-temp">
            <span class="forecast-temperature">
            ${Math.round(forcastTemp)}
            </span>°</p>
          </div>`;    
  }  
}


//Fahrenheit & Celsius
function worldReading(event) {
  event.preventDefault();
  let degreereading = Math.round(feelTemp);
  document.querySelector("#current-temp").innerHTML = Math.round(
    celsiusTemperature
  );
  document.querySelector("#high-temp").innerHTML = Math.round(hightemp);
  document.querySelector("#feeling-temp").innerHTML = `${degreereading}°C`;
  document.querySelector("#low-temp").innerHTML = Math.round(lowtemp);
  
  let forecastItems = document.querySelectorAll(".forecast-temperature");
  forecastItems.forEach(function(item) {
  let currentTemp = item.innerHTML;
  item.innerHTML =`${Math.round(((currentTemp - 32) * 5) / 9)}`;
  });

  celsisTemp.classList.add("active");
  farentTemp.classList.remove("active");

//Handle events to avoid temperature duplications
  celsisTemp.removeEventListener("click", worldReading);
  farentTemp.addEventListener("click", ameriReads);
}

function ameriReads(event) {
  event.preventDefault();
  let farenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  let maxTemp = (hightemp * 9) / 5 + 32;
  let minTemp = (lowtemp * 9) / 5 + 32;
  let feelLikeTemp = (feelTemp * 9) / 5 + 32;
  
  let reading = Math.round(feelLikeTemp);
  document.querySelector("#current-temp").innerHTML = Math.round(farenheitTemp);
  document.querySelector("#high-temp").innerHTML = Math.round(maxTemp);
  document.querySelector("#feeling-temp").innerHTML = `${reading} °F`;
  document.querySelector("#low-temp").innerHTML = Math.round(minTemp);


  let forecastItems = document.querySelectorAll(".forecast-temperature");
  forecastItems.forEach(function(item) {
  let currentTemp = item.innerHTML;
  item.innerHTML = `${Math.round((currentTemp * 9) / 5 + 32)}`;
  });

  celsisTemp.classList.remove("active");
  farentTemp.classList.add("active");

  celsisTemp.addEventListener("click", worldReading);
  farentTemp.removeEventListener("click", ameriReads);
}

let celsiusTemperature = null;
let hightemp = null;
let lowtemp = null;
let feelTemp = null;
let forcastTemp = null

let celsisTemp = document.querySelector("#temp-Celsius");
celsisTemp.addEventListener("click", worldReading);

let farentTemp = document.querySelector("#temp-Fahrenheit");
farentTemp.addEventListener("click", ameriReads);

//image changing function

function changeImage(response) {
  
  celsiusTemperature =Math.round(response.data.main.temp); 

  if (celsiusTemperature < 5) {
    document.querySelector("#animate").setAttribute("src", "media/snowing.svg");
  } else {
    if (celsiusTemperature >= 28) {
      document
        .querySelector("#animate")
        .setAttribute("src", "media/sunnyday.svg");
    } else {
      if (celsiusTemperature > 5 && celsiusTemperature < 20) {
        document
          .querySelector("#animate")
          .setAttribute("src", "media/reading.svg");
      } else {
        document
          .querySelector("#animate")
          .setAttribute("src", "media/sunset.svg");
      }
    }
  }
}

search("Tokyo");
