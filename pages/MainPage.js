import React, { Component } from 'react';
 
import { StyleSheet, TextInput, View, Alert, Button, Text} from 'react-native';
 
// Importing Stack Navigator library to add multiple activities.
import { StackNavigator } from 'react-navigation';
 
// Creating Login Activity.
export default class MainPage extends Component { 
  // Setting up Login Activity title.
  static navigationOptions =
   {
      title: 'First Page',
   };
 
constructor(props) { 
    super(props) 
    this.state = { 
        isLoggedIn: false
    } 
  }

  render() {
    return (      
        <View style={styles.MainContainer}> 
                <Text style= {styles.TextComponentStyle}>Logged Page</Text>                      
                <Button title="Click Here To Login" color="#2196F3" />           
            
        
        </View>
    )             
  
}
}
 
const styles = StyleSheet.create({
 
    MainContainer :{     
    justifyContent: 'center',
    flex:1,
    margin: 10,
    },
     
    TextInputStyleClass: {     
    textAlign: 'center',
    marginBottom: 7,
    height: 40,
    borderWidth: 1,
    // Set border Hex Color Code Here.
     borderColor: '#2196F3',
     
     // Set border Radius.
     borderRadius: 5 ,
     
    },
     
     TextComponentStyle: {
       fontSize: 20,
      color: "#000",
      textAlign: 'center', 
      marginBottom: 15
     }
    });