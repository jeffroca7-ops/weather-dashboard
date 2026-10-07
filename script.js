const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const weatherResults = document.querySelector("#weatherResults");

searchBtn.addEventListener("click", async function () {
    const city = cityInput.value.trim();

    weatherResults.style.display = "block";

    if (city === "") {
        weatherResults.textContent = "Please enter a city.";
        return;
    }

    searchBtn.disabled = true;
        
    weatherResults.textContent = "Loading..."

    try { 

    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const response = await fetch(geocodingUrl);

    if (!response.ok) {
        throw new Error ("Geocoding request failed.");
    }

    const data = await response.json();

    if (!data.results) {
        weatherResults.textContent = "City not found.";
        return;
    }


    const cityName = data.results[0].name;
    const latitude = data.results[0].latitude;
    const longitude = data.results[0].longitude;

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
        throw new Error ("Weather Response failed.");
    }

    const weatherData = await weatherResponse.json();

    const temperature = weatherData.current.temperature_2m;

    const humidity = weatherData.current.relative_humidity_2m;

    const windSpeed = weatherData.current.wind_speed_10m;

    const weatherCode = weatherData.current.weather_code;

    let weatherDescription;

    if (weatherCode === 0) {
        weatherDescription = "Clear Sky";

    }
    else if (weatherCode === 1) {
        weatherDescription = "Mainly Clear";
    }
    else if (weatherCode === 2) {
        weatherDescription = "Partly Cloudy";
    }
    else if (weatherCode === 3) {
        weatherDescription = "Overcast";
    }
    else if (weatherCode === 51 || weatherCode === 53 || weatherCode === 55) {
        weatherDescription = "Drizzle";
    }
    else if (weatherCode === 61) {
        weatherDescription = "Slight Rain";
    }
    else if (weatherCode === 63) {
        weatherDescription = "Moderate Rain";
    }
    else if (weatherCode === 65) {
        weatherDescription = "Heavy Rain";
    }
    else if (weatherCode === 45 || weatherCode === 48) {
        weatherDescription = "Foggy";
    }
    else if (weatherCode === 71) {
        weatherDescription = "Slight Snow";
    }
    else if (weatherCode === 73) {
        weatherDescription = "Moderate Snow";
    }
    else if (weatherCode === 75) {
        weatherDescription = "Heavy Snow";
    }
    else if (weatherCode === 77) {
        weatherDescription = "Snow Grains";
    }
    else if (weatherCode === 80 || weatherCode === 81 || weatherCode === 82) {
        weatherDescription = "Rain Showers";
    }
    else if (weatherCode === 85 || weatherCode === 86) {
        weatherDescription = "Snow Showers";
    }
    else if (weatherCode === 95) {
        weatherDescription = "Thunderstorm";
    }
    else if (weatherCode === 96) {
        weatherDescription = "Thunderstorm with Slight Hail";
    }
    else if (weatherCode === 99) {
        weatherDescription = "Thunderstorm with Heavy Hail";
    }
    else {
        weatherDescription = "Unknown Weather";
    }


    weatherResults.textContent = `${cityName} \nWeather: ${weatherDescription} \nTemperature: ${temperature}°C\nHumidity: ${humidity}% \nWind: ${windSpeed} km/h`;


    } catch (error) {
        console.error(error);
        weatherResults.textContent = "Something went wrong. Please try again.";

    } finally {
        searchBtn.disabled = false;
    }
});

cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter"); {
        searchBtn.click();
    }
});