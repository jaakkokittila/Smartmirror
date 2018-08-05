

function onLoad() {
    //Start the weather and clock functions and then set them to update on their own intervals
    
    Clock();
    apiCall();
    setHeadlines();
    setInterval(Clock, 1000);
    setInterval(apiCall, 3600000);
    setInterval(setHeadlines, 3500);
    
}

function Clock(){   
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (seconds < 10){
        seconds = "0" + seconds;
    }
    if (minutes < 10){
        minutes = "0" + minutes;
    }
    if (hours < 10){
        hours = "0" + hours;
    }
    var month = date.getMonth() + 1;
    if (month < 10){
        month = "0" + month;
    }
    var weekday = date.getDate();
    if (weekday < 10){
        weekday = "0" + weekday;
    }
    document.getElementById("clock").innerHTML = "<p id='time'> " + hours + "." + minutes + "." + seconds + "</p> </br> <p id='date'>" + weekday + "." + month + "</p>";
}
/*APIs used:
- Openweathermap for weather data
- NewsAPI for news headlines
- Reddit's own API for Reddit posts
- MySportsFeeds for NHL scores
*/


function apiCall(){
    fetch('http://api.openweathermap.org/data/2.5/weather?q=turku&units=metric&APPID=a5a5a3e5b7bf9694e556ea5faae55562')
  .then(response => response.json())
  .then(json => setWeather(json));
    
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=turku,fi&appid=a5a5a3e5b7bf9694e556ea5faae55562')
    .then(response => response.json())
    .then(json => setForecast(json));
    
    
}

function setWeather(weather) {
  
    var description = weather.weather[0].description;
    var capitalize = description.charAt(0).toUpperCase() + description.substr(1);
    document.getElementById("weather").innerHTML = weather.main.temp + "&#176; " + capitalize;
   
}

function setForecast(forecast){
    var innerForecast = "";
    for (var i = 1; i < 4; i++){

        var temperature = forecast.list[i].main.temp - 273;
        var celsius = temperature.toString().substring(0,2);

        innerForecast += i*3 + "h " + celsius + "&#176 " + forecast.list[i].weather[0].description + "</br>";
    }
    document.getElementById("forecast").innerHTML = "<p id='forecast'>" + innerForecast +  "</p>";
}
    

function setHeadlines(){
    var date = new Date();
    var seconds = date.getSeconds();
    
    if(seconds < 20){
        
        fetch('https://newsapi.org/v2/top-headlines?country=gb&apiKey=f7a95063f5e04a6ea2f5ff363cfdb798')
        .then(response => response.json())
        .then(json => document.getElementById("headline").innerHTML = json.articles[seconds].title);
    }else if(seconds > 20 && seconds < 40){
        fetch('https://www.reddit.com/r/soccer.json')
        .then(response => response.json())
        .then(json => document.getElementById("headline").innerHTML = json.data.children[seconds - 20].data.title);
        
    }else{
        fetch('https://www.reddit.com/r/hockey.json')
        .then(response => response.json())
        .then(json => document.getElementById("headline").innerHTML = json.data.children[seconds - 40].data.title);
    }
   
    
    
    
    
}