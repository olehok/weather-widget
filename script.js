// За допомогою запиту отримати дані з API https://openweathermap.org/current, вивести виджет погоди.
// Також потрібно додати кнопку оновлення данних.


function getWeatherData() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=ab9ec7c44c465e610941e0dc2c2b6119&units=metric&lang=ua`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            document.querySelector("#temp").textContent = `${Math.round(data.main.temp)}°C`;
            document.querySelector("#feels_like").textContent = `${Math.round(data.main.feels_like)}°C`;
            document.querySelector("#conditions").textContent = data.weather[0].description;
            document.querySelector("#humidity").textContent = `${data.main.humidity}%`;
            document.querySelector("#pressure").textContent = `${data.main.pressure} hPa`;
            document.querySelector("#wind").textContent = `${data.wind.speed} м/с`;
            document.querySelector("#location").textContent = `${data.name}, ${data.sys.country}`;
            updateBackgroundByTemp(Math.round(data.main.temp));
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

// let city = !city ? "одеса,UA" : city;
let city = "одеса,UA";

document.querySelector("#inputCity").addEventListener("change", (e) => {
    city = e.target.value;
    getWeatherData();
    e.target.value = '';
});

document.querySelector("#refresh").addEventListener("click", () => {
    getWeatherData();
    updateTime();
});

setInterval(() => {
    getWeatherData();
}, 60000);

setInterval(() => {
    updateTime();
}, 1000);

getWeatherData();
updateTime();