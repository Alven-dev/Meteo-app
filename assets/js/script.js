let url = "https://api.open-meteo.com/v1/forecast?latitude=53.0138&longitude=18.5981&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,wind_speed_10m,apparent_temperature,precipitation,precipitation_probability,rain,showers,snowfall,wind_direction_10m,weather_code&timezone=Europe%2FBerlin&forecast_days=14"

fetch(url)
.then(function(response) {
    return response.json();
    
})
.then(function(data) {
    console.log(data);

        let now = new Date();
        let currentHour = now.getHours();
        let weatherCode = data.hourly.weather_code[currentHour];
        let temperature = data.hourly.temperature_2m[currentHour];
        let windDirection = data.hourly.wind_direction_10m[currentHour];
        let windSpeed = data.hourly.wind_speed_10m[currentHour];
        let tempsPrecipItems = document.querySelectorAll(".temps-precip-item");
        let nextHour = now.getMinutes() >= 30 ? currentHour + 1 : currentHour;
        let dates = data.daily.time.slice(1);;
        let maxTemps = data.daily.temperature_2m_max.slice(1);
        let minTemps = data.daily.temperature_2m_min.slice(1);
        let weatherCodes = data.daily.weather_code.slice(1);

        const weatherPositions = {
            "Cloudy": "0",
            "Sunny": "11.5rem",
            "Raining": "23rem",
            "Partly Cloudy": "35rem",
            "Storm": "46.5rem",
            "Snowing": "58rem",
        };

        let dayItems = document.querySelectorAll(".day-item");

        dayItems.forEach((item, index) => {
            if (index < 7) {
                let dateElement = item.querySelector("h4");
                let maxTempElement = item.querySelector("h3");
                let minTempElement = item.querySelector("span");
                let imgElement = item.querySelector("img");

                let formattedDate = new Date(dates[index]).toLocaleDateString("en-EN", {weekday: 'long', day: '2-digit', month: '2-digit'});

                let weatherType = interpretWeatherCode(weatherCodes[index]);
                let position = weatherPositions[weatherType] || "0";


                if (dateElement) dateElement.textContent = formattedDate;
                if (maxTempElement) maxTempElement.textContent = `${maxTemps[index]}°C`;
                if (minTempElement) minTempElement.textContent = `${minTemps[index]}°C`;

                if (imgElement) {
                    imgElement.style.position = "relative";
                    imgElement.style.right = position;
                }
            }
        });

        for (let i = 0; i < 5; i++) {
            let hourIndex = nextHour + i;
            let temperature = data.hourly.temperature_2m[hourIndex] ?? "N/A";
            let precipitation = data.hourly.precipitation[hourIndex] ?? "N/A";
            let listItems = tempsPrecipItems[i].querySelectorAll("li");
            let timeSpan = tempsPrecipItems[i].querySelector("span");

            if (listItems.length >= 2) {
                listItems[0].innerHTML = `<img src="../images/thermometer.png" alt="termometer"> ${temperature}°C`;
                listItems[1].innerHTML = `<img src="../images/umbrella.png" alt="umbrella"> ${precipitation} mm`;
            }

            if (timeSpan) {
                timeSpan.textContent = `${hourIndex % 24}:00`;
            }
        }

        let windSpeedElement = document.querySelector(".wind div p");
        if (windSpeedElement) {
            windSpeedElement.textContent = `Wind Speed: ${windSpeed} km/h`;
        }

        let weatherText = interpretWeatherCode(weatherCode);


        document.querySelector(".weather h3").textContent = weatherText;
        document.querySelector(".weather h2").textContent = `${temperature}°C`;

        setInterval(updateCompass, 100);
        updateCompass(windDirection);
    })
    .catch(error => console.error("Error fetching weather data:", error));

function interpretWeatherCode(code) {
    if ([95, 96, 99].includes(code)) return "Storm";
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "Raining";
    if ([45, 48].includes(code)) return "Partly Cloudy";
    if ([2, 3].includes(code)) return "Cloudy";
    if ([56, 57, 66, 67].includes(code)) return "Windy";
    if ([0, 1].includes(code)) return "Sunny";
    if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snowing";
    return "Unknown";
}

function updateCompass(windDirection) {
    const arrow = document.querySelector(".wind img");
    if (!arrow) return;

    arrow.style.transform = `rotate(${windDirection}deg)`;
}

function updateDateTime() {
    const now = new Date();

    const formattedDate = now.toLocaleDateString("pl-PL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const formattedTime = now.toLocaleTimeString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const dateTimeDiv = document.querySelector(".date-time");
    dateTimeDiv.innerHTML = `<h2>${formattedDate}</h2><h3>${formattedTime}</h3>`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

function updateDayNight() {
    const now = new Date();
    const hours = now.getHours();
    
    const isNight = hours >= 18 || hours < 6;

    const dayNightImg = document.querySelector(".day-night-wrap img");

    if (dayNightImg) {
        dayNightImg.style.right = isNight ? "12rem" : "0";
    }
}

updateDayNight();
setInterval(updateDayNight, 6000);

function updateWeather() {
    const weatherInfo = document.getElementById("weather-stat").textContent.trim();
    const weatherImg = document.querySelector(".weather-wrap img");
    let bgUrl = "/assets/images/default.jpg";
    let weatherDiv = document.querySelector(".grid-container");

    if (!weatherImg || !weatherDiv) return;

    if (weatherInfo === "Sunny") {
        weatherImg.style.bottom = "107rem"
        bgUrl = "../images/sun.jpg"
    } else if (weatherInfo === "Raining") {
        weatherImg.style.bottom = "24rem"
        bgUrl = "../images/rain.jpg"
    } else if (weatherInfo === "Partly Cloudy") {
        weatherImg.style.bottom = "47rem"
        bgUrl = "../images/suncloud.jpg"
    } else if (weatherInfo === "Cloudy") {
        weatherImg.style.bottom = "65.5rem"
        bgUrl = "../images/cloud.jpg"
    } else if (weatherInfo === "Windy") {
        weatherImg.style.bottom = "85rem"
        bgUrl = "../images/windy.jpg"
    } else if (weatherInfo === "Snowy") {
        weatherImg.style.bottom = "130.5rem"
        bgUrl = "../images/snow.jpg"
    } else {
        weatherImg.style.bottom = "0"
        bgUrl = "../images/thunder.jpg"
    }

    weatherDiv.style.backgroundImage = `url('${bgUrl}')`;
    weatherDiv.style.backgroundSize = "cover";
    weatherDiv.style.backgroundPosition = "center";
}

updateWeather();
setInterval(updateWeather, 10)