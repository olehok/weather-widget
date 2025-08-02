// За допомогою запиту отримати дані з API https://openweathermap.org/current, вивести виджет погоди.
// Також потрібно додати кнопку оновлення данних.

function getWeatherData() {
    const currentCity = getCityFromLocalStorage();

    fetch(`https://wttr.in/${encodeURIComponent(currentCity)}?format=j1`)
        .then(response => response.json())
        .then(data => {
            const weather = data.current_condition[0];
            const conditionTranslator = {
                "Sunny": "Сонячно",
                "Clear": "Ясно",
                "Partly cloudy": "Мінлива хмарність",
                "Cloudy": "Хмарно",
                "Overcast": "Похмуро",
                "Mist": "Туман",
                "Patchy rain possible": "Можливий невеликий дощ",
                "Light rain": "Легкий дощ",
                "Moderate rain": "Помірний дощ",
                "Heavy rain": "Сильний дощ",
                "Thunderstorm": "Гроза",
                "Snow": "Сніг",
                "Fog": "Туман",
                "Freezing fog": "Морозний туман"
            };

            const windSpeedMps = parseFloat(weather.windspeedKmph) / 3.6;
            const currentCountry = data.nearest_area[0].country[0].value;
            const initCondition = weather.weatherDesc[0].value;
            const translatedCondition = conditionTranslator[initCondition] || initCondition;

            const weatherData = document.querySelector(".weather-data");

            if (currentCountry !== "Russia") {
                weatherData.style.opacity = "1";
                city.textContent = currentCity;
                country.textContent = currentCountry;
                temp.textContent = `${weather.temp_C}°C`;
                feels.textContent = `${weather.FeelsLikeC}°C`;
                cond.textContent = translatedCondition;
                hum.textContent = `${weather.humidity}%`;
                press.textContent = `${weather.pressure} hPa`;
                wind.textContent = `${windSpeedMps.toFixed(2)} м/с`;
                updateBackgroundByTemp(parseFloat(weather.temp_C));
            } else {
                weatherData.style.opacity = "0";
                city.textContent = "Слава Україні!";
                country.textContent = "трибунал – росії";
                errorPopup("Місто має бути населено людьми.");
                updateBackgroundByTemp(Math.floor(Math.random() * 40));
            }
        });
}


function updateTime() {
    const now = new Date();
    const options = {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'};
    document.querySelector("#date").textContent = now.toLocaleDateString('uk-UA', options);
    document.querySelector("#time").textContent = now.toLocaleTimeString('uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function updateBackgroundByTemp(temp) {
    const limitedTemp = Math.min(Math.max(temp, -5), 32);
    const hue = 240 - ((limitedTemp + 5) / 37) * 240;
    document.body.style.backgroundColor = `hsl(${hue}, 100%, 70%)`;
}

function saveCityToLocalStorage(city) {
    localStorage.setItem('currentCity', city);
}

function getCityFromLocalStorage() {
    return localStorage.getItem('currentCity') || "Одеса";
}

function validateInput(value) {
    const isValidLength = value.length >= 2 && value.length <= 17;
    const isOnlyLetters = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ'-]+$/.test(value);

    if (!isOnlyLetters) {
        errorPopup("Назва міста може містити лише літери.");
        return false;
    } else if (!isValidLength) {
        errorPopup("Назва міста має бути від 2 до 17 літер.");
        return false;
    }

    return true;
}

function errorPopup(message) {
    const popup = document.querySelector(".error-popup");
    popup.textContent = message;
}

let city = document.querySelector("#location");
let country = document.querySelector("#location-country");
let temp = document.querySelector("#temp");
let feels = document.querySelector("#feels_like");
let cond = document.querySelector("#conditions");
let hum = document.querySelector("#humidity");
let press = document.querySelector("#pressure");
let wind = document.querySelector("#wind");

document.querySelector("#inputCity").addEventListener("change", (e) => {
    errorPopup("");
    if (validateInput(e.target.value.trim())) {
        const newCity = e.target.value;
        saveCityToLocalStorage(newCity);
        getWeatherData();
        e.target.value = '';
    }
});

document.querySelector("#refresh").addEventListener("click", () => {
    getWeatherData();
    updateTime();
});

setInterval(() => {
    getWeatherData();
}, 600000);

setInterval(() => {
    updateTime();
}, 1000);

getWeatherData();
updateTime();