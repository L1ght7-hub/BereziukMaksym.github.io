const API_KEY = 'dc51dc23f416d88b9802a0dbde4f5feb';

document.getElementById('getWeatherBtn').addEventListener('click', function() {
  const city = document.getElementById('addressInput').value;
  if (!city) return alert("Proszę wpisać miasto");

  const currentBox = document.getElementById('currentWeatherBox');
  const forecastGrid = document.getElementById('forecastGrid');

  currentBox.innerHTML = '';
  forecastGrid.innerHTML = '';


  const xhr = new XMLHttpRequest();
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

  xhr.open('GET', currentUrl, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      console.log("Current Weather Response:", data);

      currentBox.innerHTML = `
                <div class="current-card">
                    <h2>Pogoda bieżąca: ${data.name}</h2>
                    <div style="font-size: 2em;"><b>${Math.round(data.main.temp)}°C</b></div>
                    <p>Odczuwalna: ${data.main.feels_like}°C | ${data.weather[0].description}</p>
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
                </div>
                <h3 style="margin-top: 20px;">Prognoza szczegółowa (co 3 godziny):</h3>`;
    }
  };
  xhr.send();


  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=pl`;

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      console.log("Forecast 5 Days Response:", data);

      data.list.forEach(item => {
        const card = document.createElement('div');
        card.className = 'forecast-hour-card';


        const dateObj = new Date(item.dt * 1000);
        const formattedDate = dateObj.toLocaleDateString('pl-PL') + ' ' + dateObj.toLocaleTimeString('pl-PL');

        card.innerHTML = `
                    <div class="date-header">${formattedDate}</div>
                    <div class="card-content">
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">
                        <div class="info">
                            <div class="temp"><b>${item.main.temp} °C</b></div>
                            <div class="details">Odczuwalna: ${item.main.feels_like} °C</div>
                            <div class="details">${item.weather[0].description}</div>
                        </div>
                    </div>
                `;
        forecastGrid.appendChild(card);
      });
    })
    .catch(err => console.error("Błąd:", err));
});
