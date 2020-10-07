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
  let day = days[present.getUTCDay()];
  let month = months[present.getUTCMonth()];
  let dates = present.getUTCDate();
  let hour = present.getUTCHours();
  let mins = present.getUTCMinutes();

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

  let hour = present.getUTCHours();
  let mins = present.getUTCMinutes();

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

  let hour = present.getUTCHours();
  let mins = present.getUTCMinutes();

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
    (response.data.dt + response.data.timezone) * 1000
  );
  document.querySelector("#sunrise").innerHTML = sunriseHour(
    (response.data.sys.sunrise + response.data.timezone) * 1000
  );
  document.querySelector("#sunset").innerHTML = sunsetHour(
    (response.data.sys.sunset + response.data.timezone) * 1000
  );
  document.querySelector("h1").innerHTML = `${response.data.name}`;
  document.querySelector(
    "h3"
  ).innerHTML = `${response.data.weather[0].description}`;
  document.querySelector("#high-temp").innerHTML = Math.round(
    response.data.main.temp_max
  );
  document.querySelector("#low-temp").innerHTML = Math.round(
    response.data.main.temp_min
  );
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.main.humidity
  );
  document.querySelector("#feeling-temp").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#clouds").innerHTML = Math.round(
    response.data.clouds.all
  );
}

function search(city) {
  let apiKey = "65b9beaa8544369015325811bb427882";
  let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndPoint}?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(callTemp);
}

function submitCityLocation(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#submitted-city").value;
  search(cityInput);
}

let formCall = document.querySelector("#city-form");

formCall.addEventListener("submit", submitCityLocation);

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
}

let gpsButton = document.querySelector("#button-geo");
gpsButton.addEventListener("click", geoLocal);

search("Tokyo");
