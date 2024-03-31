// script.js

document.getElementById("searchButton").addEventListener("click", function () {
  var countryName = document.getElementById("searchInput").value;
  fetch(`https://restcountries.com/v3/name/${countryName}`)
    .then((response) => response.json())
    .then((data) => {
      displayCountryData(data);
    })
    .catch((error) => console.log("Error fetching country data:", error));
});

function displayCountryData(data) {
  var countryDataContainer = document.getElementById("countryData");
  countryDataContainer.innerHTML = "";

  data.forEach((country) => {
    var countryCard = document.createElement("div");
    countryCard.classList.add("country-card");
    countryCard.innerHTML = `
          <h2>${country.name.common}</h2>
          Official Name:<span>${country.name.official}</span><br>
          Capital: <span>${country.capital}</span><br>
          Population: <span>${country.population}</span><br>
          Region: <span>${country.region}</span><br>
           Subregion: <span>${country.subregion}</span><br>
           
           <img src="${country.flags[0]}" alt=${country.name.common}>
          <button class="details-button" data-country="${country.name.common}">More Details</button>
        `;
    countryDataContainer.appendChild(countryCard);
  });

  document.querySelectorAll(".details-button").forEach((button) => {
    button.addEventListener("click", function () {
      var countryName = this.getAttribute("data-country");
      fetchWeatherData(countryName);
    });
  });
}

function fetchWeatherData(countryName) {
  var api_key = "0a9e0a2880937d7fd6ec32239e7be7d1";
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${countryName}&appid=${api_key}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (
        data.main &&
        data.main.temp &&
        data.weather &&
        data.weather[0].description
      ) {
        const temperature = data.main.temp;
        const condition = data.weather[0].description;
        const weatherType = data.weather[0].main;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        const weatherInfo = {
          name: countryName,
          temperature: temperature,
          condition: condition,
          weatherType: weatherType,
          humidity: humidity,
          windSpeed: windSpeed,
        };
        // displayWeatherInfo(weatherInfo);
        displayAdditionalDetails(weatherInfo);
      } else {
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Weather data not present!",
        });
        hideAdditionalDetails();
      }
    })
    .catch((error) => {
      console.log("Error fetching weather data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      hideAdditionalDetails();
    });
}

function displayWeatherInfo(weatherInfo) {
  var weatherInfoElement = document.getElementById("weatherInfo");
  weatherInfoElement.innerHTML = `<p>Temperature: ${weatherInfo.temperature}°C</p>
        <p>Weather: ${weatherInfo.condition}</p>

        `;
}

function displayAdditionalDetails(countryInfo) {
  var additionalDetailsContainer = document.getElementById(
    "additionalDetailsContainer"
  );

  additionalDetailsContainer.innerHTML = `
        <h2> More Details</h2>
        <img src="Images/${countryInfo.weatherType}.png" style="width:40px">
        <p ><span>${countryInfo.condition}</span><br>Weather Condition</p>
        <div class="adContainer">
           <div class="inner-adContainer">
           <img src="Images/humidity.png" style="width:30px ">
            <p><span>${countryInfo.humidity}%</span><br>Humidity</p>
           </div>
           <div class="inner-adContainer">
            <img src = "Images/wind-speed.png" style="width:30px">
            <p><span>${countryInfo.windSpeed} km/s</span><br>Wind Speed</p>
           </div>
           <div class="inner-adContainer">
            <img src = "Images/temperature.png"style="width:30px">
            <p><span>${countryInfo.temperature}°C</span><br>Temperature</p>
            </div>
        
        </div>
        
        <button id="closeButton">Close</button>
      `;
  additionalDetailsContainer.classList.add("show-additional-details");

  document.getElementById("closeButton").addEventListener("click", function () {
    hideAdditionalDetails();
  });
}

function hideAdditionalDetails() {
  var additionalDetailsContainer = document.getElementById(
    "additionalDetailsContainer"
  );
  additionalDetailsContainer.innerHTML = ""; // Clear the content
  additionalDetailsContainer.classList.remove("show-additional-details");
}
