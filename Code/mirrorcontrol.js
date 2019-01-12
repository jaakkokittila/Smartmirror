import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, AsyncStorage } from 'react-native';


export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <APICall />
        <Addition />
      </View>
    );
  }
}

class APICall extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      subreddits : []
    };

    call = call.bind(this);
  }

  

  componentDidMount(){
    call();
  }
 
  

  render(){
    return(
      <View style={styles.flexbox}>{this.state.subreddits.map((cell, i)=><TextBox key={i} text={cell}/>)}</View>
    );
  }
}

class Addition extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      text: null,
      list: [],
      reminder: "",
      oldReminder: ""
    };
  }
  componentDidMount(){
    //Haetaan tämänhetkinen subreddit-lista ja muistutus json-serveriltä
      fetch("http://192.168.1.100:3001/data/")
      .then(response => response.json())
      .then(response =>{
        var currentlist = response[0].subreddits;
        var message = response[0].message;
        this.setState({list: currentlist, oldReminder: message});
      })
  
}
  onClick(){

    //Tarkistetaan onko muistutuskentässä tekstiä, jos on muutetaan se json-serverillä
     var newlist = this.state.list;
     if (this.state.reminder != ""){
      var setReminder = this.state.reminder;
     }else{
       var setReminder = this.state.oldReminder;
     }
    //Tarkistetaan onko subreddit listassa tekstiä, jos on lisätään listan jatkoksi
     if(this.state.text != null){
        newlist.push(this.state.text);
     }
     
     
      var url = 'http://192.168.1.100:3001/data/1';
      
			var data = {"id":1, subreddits: newlist, message: setReminder};
     //Tiedon muuttaminen json-serverillä
				fetch(url, {
  				method: 'PUT',
				body: JSON.stringify(data), 
  		headers:{
    		'Content-Type': 'application/json'
      }})
      call();
      
    };
  render(){
    return(
      <View><TextInput style={styles.textfield} onChangeText={(text) => this.setState({text})}
      value={this.state.text}/><Button onPress={this.onClick.bind(this)} title="Add"></Button>
      <TextInput style={styles.textfield} onChangeText={(reminder) => this.setState({reminder})}
      value={this.state.reminder}/><Button onPress={this.onClick.bind(this)} title="Set reminder"></Button></View>
    );
  }
}
//Haetaan json-serverin subredditit
function call(){
  fetch("http://192.168.1.100:3001/data/")
  .then(response => response.json())
  .then(response =>{
    var list = response[0].subreddits;
    this.setState({subreddits: list});
  })
}
class TextBox extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      text: this.props.text.toString(),
    }
  }
 //Poistetaan subreddittien listasta haluttu solu ja päivitetään uusi lista serverille
  deleteCell(){
    fetch("http://192.168.1.100:3001/data/")
    .then(response => response.json())
    .then(response =>{
      var array = response[0].subreddits;
      var reminder = response[0].message;
      var index = array.indexOf(this.state.text);
    array.splice(index, 1);
    this.setState({subreddits: array});
    var url = 'http://192.168.1.100:3001/data/1';
    var data = {"id":1, subreddits: array, message: reminder};
    fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data), 
       headers:{
      'Content-Type': 'application/json'
    }});
    call(); 
 
  
  })
  
  }
    
  render(){
    return(
      <View style={styles.horizontalflex}><TouchableOpacity style={styles.button} onPress={this.deleteCell.bind(this)}>
      <Text style={styles.buttontext}>x</Text></TouchableOpacity><Text style={styles.buttontext}>{this.state.text}</Text>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  flexbox: {
    flexDirection: 'column',
    margin: 10
  },
  text: {
    fontSize: 40,
    color: 'white'
  },
  button: {
    marginRight: 5
  },
  horizontalflex: {
    flexDirection: 'row'
  },
  buttontext: {
    color: 'white',
    fontSize: 40,
    
  },
  textfield: {
    color: 'white',
    borderColor: 'white',
    borderWidth: 2,
    width: 250
  },
});






