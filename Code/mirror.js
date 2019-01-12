import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Reminder />
          <DateAndTime />
          <Weather />
          <RedditAPI />
      </div>
    );
  }
}

class Weather extends Component{
  constructor(props){
    super(props);
    this.state = {
      weather: "",
      forecast: ""
    };
  }

  //Asetetaan sää ja ennuste päivittymään tunnin välein
  componentDidMount(){
    this.setWeather();
    this.timerID = setInterval(
      () => this.setWeather(),
      3600000
    );
  }


  setWeather(){
    //Haetaan tämänhetkinen sää
    fetch('http://api.openweathermap.org/data/2.5/weather?q=turku&units=metric&APPID=a5a5a3e5b7bf9694e556ea5faae55562')
    .then (response => response.json())
    .then(response =>{
      var description = response.weather[0].description;
      var capitalize = description.charAt(0).toUpperCase() + description.substr(1);
      this.setState({weather:  response.main.temp + "C "  + capitalize});
    });
    //Haetaan ennuste
   fetch('https://api.openweathermap.org/data/2.5/forecast?q=turku,fi&appid=a5a5a3e5b7bf9694e556ea5faae55562')
   .then(response => response.json())
   .then (response =>{
    var innerForecast = [];
    for (var i = 1; i < 4; i++){

        var temperature = response.list[i].main.temp - 273;
        var celsius = 3*i + "h " + temperature.toString().substring(0,2) +"C " + response.list[i].weather[0].description ;
        innerForecast.push(<li>{celsius}</li>);

        
    }
    this.setState({forecast: <ul>{innerForecast}</ul>});
    
  });
  }
  render(){
    return(
      <div id="weatherdiv"><ul>
        <li><div id="weather">{this.state.weather}</div></li>
        <li><div id="forecast">{this.state.forecast}</div></li>
      </ul></div>
    );
  }
}

class DateAndTime extends Component{
  constructor(props){
    super(props);
    this.state = {
      time: new Date(),
      date: new Date()
    };
  }
 
  //Asetetaan kellon aika ja päivämräärä
  updateTime(){
    this.setState({time: new Date(), date: new Date()});
  }

  //Asetetaan kellonaika ja päivämäärä päivittymään sekunnin välein
  componentDidMount(){
    this.timerID = setInterval(
      () => this.updateTime(),
      1000
    );
  }

  render(){
    return(
        <ul>
          <li id="time">{this.state.time.toLocaleTimeString()}</li>
          <li id="date">{this.state.date.toLocaleDateString()}</li>
        </ul>
    );
  }
}

class RedditAPI extends Component{
  constructor(props){
    super(props);
    this.state = {
      headline: ""
    };
  }

  setHeadline(){
    //Noudetaan json-serveriltä lista subredditeistä ja sitten arvotaan subreddit ja siitä otsikko
    fetch("http://192.168.1.100:3001/data")
    .then (response => response.json())
    .then(response =>{
      var random = Math.floor(Math.random()*response[0].subreddits.length);
      var randomHeadline = Math.floor(Math.random() * 15 + 2);
      var url = 'https://www.reddit.com/r/'+response[0].subreddits[random]+'.json';
     
  
      fetch(url)
      .then(responsee => responsee.json())
      .then (responsee =>{
        this.setState({headline: responsee.data.children[randomHeadline].data.title});
      });
    })
   


  }
  //Asetetaan otsikko päivittymään 3,8 sekunnin välein
  componentDidMount(){
    this.timerID = setInterval(
      () => this.setHeadline(),
      3800
    );
  }
  

  render(){
    return(
      <div id="news"><div id="headline">{this.state.headline}</div></div>
    );
  }
}

class Reminder extends Component{
  constructor(props){
    super(props);
    this.state = {
      text: ""
    }
  }
  //Haetaan muistutusviesti sekunnin välein
  componentDidMount(){
    this.timerID = setInterval(
      () =>
        fetch("http://192.168.1.100:3001/data")
          .then (response => response.json())
          .then(response =>{
          var reminder = response[0].message;
      
          this.setState({text: reminder});
        }
      ), 1000
    );
  }
  render(){
    return(
      <div id="reminder">{this.state.text}</div>
    );
  }
   
}


export default App;
