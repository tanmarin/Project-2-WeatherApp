//current day function

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
  let hour = present.getHours();
  let mins = present.getMinutes();

  if (hour < 10) {
    hour = `0${hour}`;
  }

  if (mins < 10) {
    mins = `0${mins}`;
  }

  return `${day}, ${dates} ${month}, ${hour}:${mins}`;
}

function sunriseHour(timestamp) {
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

function sunsetHour(timestamp) {
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

function callTemp(response) {
  console.log(response);

  document.querySelector("#dates-time").innerHTML = formateDate(
    response.data.dt * 1000
  );
  document.querySelector("#sunrise").innerHTML = sunriseHour(
    response.data.sys.sunrise
  );
  document.querySelector("#sunset").innerHTML = sunsetHour(
    response.data.sys.sunset
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

//5 day forecast
function dispalyForecast(response) {
  console.log(response);
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

  celsisTemp.classList.add("active");
  farentTemp.classList.remove("active");
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
  celsisTemp.classList.remove("active");
  farentTemp.classList.add("active");
}

let celsiusTemperature = null;
let hightemp = null;
let lowtemp = null;
let feelTemp = null;

let celsisTemp = document.querySelector("#temp-Celsius");
celsisTemp.addEventListener("click", worldReading);

let farentTemp = document.querySelector("#temp-Fahrenheit");
farentTemp.addEventListener("click", ameriReads);

//image changing function

function changeImage(response) {
  let temperature = Math.round(response.data.main.temp);

  if (temperature < 5) {
    document.querySelector("#animate").setAttribute("src", "media/snowing.svg");
  } else {
    if (temperature >= 28) {
      document
        .querySelector("#animate")
        .setAttribute("src", "media/sunnyday.svg");
    } else {
      if (temperature > 5 && temperature < 20) {
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
