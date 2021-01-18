var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city-name");
var cityContainerEl = document.querySelector("#city-container");
var repoSearchTerm = document.querySelector("#repo-search-term");
var cityButtonsEl = document.querySelector("#city-buttons");
var fiveDayForecastEl = document.querySelector("#fiveDayForecast-container"); 
var forcastEl = document.querySelector("#forecast-container")

var formSubmitHandler = function(event){
    event.preventDefault();

    var cityName = cityInputEl.value.trim();
    
    if(cityName){
        getCityWeather(cityName);
        getCityFiveDayForecast(cityName);
    }else{
        alert("this doesnt display anything");
    }
    
}

var displayCurrentTemp = function(data){
    
    var city = data.name;
    var icon = data.weather[0].icon;
    var temp = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    var lat = data.coord.lat;
    var lon = data.coord.lon;

    cityContainerEl.textContent = "";

    var cityNameDisplay = document.createElement("h2");
    cityNameDisplay.className = "subtitle"
    cityNameDisplay.textContent = city;

    cityContainerEl.appendChild(cityNameDisplay);

    var weatherIcon = document.createElement("img");
    weatherIcon.src = "http://openweathermap.org/img/wn/" + icon + ".png";
    cityContainerEl.appendChild(weatherIcon);

    var cityTemp = document.createElement("p");
    cityTemp.textContent = "Temperature: " + temp + "°C";

    cityContainerEl.appendChild(cityTemp);

    var cityHumidity = document.createElement("p");
    cityHumidity.textContent = "Humidity: " + humidity+"%";

    cityContainerEl.appendChild(cityHumidity);

    var wind = document.createElement("p");
    wind.textContent = "Wind Speed: " + windSpeed +" m/s";

    cityContainerEl.appendChild(wind);

    getUVIndex(lat,lon);

};

var getUVIndex = function(lat, lon){
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,daily,alerts&appid=dedb54b6c9cac01af8b630f668d9c744";

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayUVIndex(data);
            });
        }else{
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("unable to connect");
    })

};

var displayUVIndex = function(data){
    
    var UVdisplay = document.createElement("p");
    UVdisplay.textContent = "UV rating: " + data.current.uvi;

    cityContainerEl.appendChild(UVdisplay);
};

var buttonClickHandler = function(event){
    var city = event.target.getAttribute("data-city");
    if (city) {
      getCityWeather(city);
      getCityFiveDayForecast(city);
    }
    
    
  };

var getCityWeather = function(city){
    
    //format the weather API key
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=dedb54b6c9cac01af8b630f668d9c744";

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayCurrentTemp(data);
            });
        }else{
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("unable to connect");
    })
};


var displayFiveDayForecast = function(cityData){
    console.log(cityData);
    fiveDayForecastEl.textContent = "";
    forcastEl.textContent = "";
    var fiveForcastTitle = document.createElement("h2");
    fiveForcastTitle.textContent = "5 Day Forecast:"
    fiveForcastTitle.style.marginBottom = "40px"
    forcastEl.appendChild(fiveForcastTitle);
    for(var i = 3; i < 39; i = i+8){
        var forecastBox = document.createElement("div");
        forecastBox.id = "forecastBox"+ i;


        var date = document.createElement("h3")
        var temp = document.createElement("p")
        var hum = document.createElement("p")
        var icon = document.createElement("img")
        

        date.textContent = cityData.list[i].dt_txt.slice(0, 11);
        // console.log(cityData.list[i].weather.icon);
        icon.src = "http://openweathermap.org/img/wn/" + cityData.list[i].weather[0].icon + ".png";
        temp.textContent = "Temp: " + cityData.list[i].main.temp + "°C";
        hum.textContent = "Humidity: " + cityData.list[i].main.humidity + "%";


        
        forecastBox.appendChild(date);
        forecastBox.appendChild(icon);
        forecastBox.appendChild(temp);
        forecastBox.appendChild(hum);
        
        fiveDayForecastEl.appendChild(forecastBox);
    }

    forcastEl.appendChild(fiveDayForecastEl);

};

var getCityFiveDayForecast = function(city){
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=dedb54b6c9cac01af8b630f668d9c744";

    fetch(apiUrl).then(function(response){
        if(response.ok){
            response.json().then(function(data){
                displayFiveDayForecast(data)
            })
        }else{
            alert("unable to display 5 day forecast");
        }
    })

};

userFormEl.addEventListener("submit", formSubmitHandler);


cityButtonsEl.addEventListener("click", buttonClickHandler);