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

            const initCondition = weather.weatherDesc[0].value;
            const translatedCondition = conditionTranslator[initCondition] || initCondition;
            document.querySelector("#temp").textContent = `${weather.temp_C}°C`;
            document.querySelector("#feels_like").textContent = `${weather.FeelsLikeC}°C`;
            document.querySelector("#conditions").textContent = translatedCondition;
            document.querySelector("#humidity").textContent = `${weather.humidity}%`;
            document.querySelector("#pressure").textContent = `${weather.pressure} hPa`;
            document.querySelector("#wind").textContent = `${windSpeedMps.toFixed(2)} м/с`;
            document.querySelector("#location").textContent = `${currentCity}`;
            document.querySelector("#location-country").textContent = `${data.nearest_area[0].country[0].value}`;
            updateBackgroundByTemp(parseFloat(weather.temp_C));
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

document.querySelector("#inputCity").addEventListener("change", (e) => {
    const newCity = e.target.value;
    saveCityToLocalStorage(newCity);
    getWeatherData();
    e.target.value = '';
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