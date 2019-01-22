import React, { Component } from 'react';
 
import { StyleSheet, TextInput, View, Alert, Button, Text} from 'react-native';
import {PropTypes} from 'prop-types';
// Importing Stack Navigator library to add multiple activities.
import { StackNavigator } from 'react-navigation';
 
// Creating Login Activity.
export default class FirstPage extends Component { 
  // Setting up Login Activity title.
  static navigationOptions =
   {
      title: 'First Page',
   };
 
constructor(props) { 
    super(props) 
    this.state = { 
        isLoggedIn: this.props.isLogged | false
    } 
    console.log(this.props.isLogged);
  }

componentWillMount(){
    console.log(this.props.isLogged);
}

  render() {
    if (!this.props.isLogged)
        return (      
            <View style={styles.MainContainer}> 
                    <Text style= {styles.TextComponentStyle}>First Page before login</Text>                      
                    <Button title="Click Here To Register" onPress={() =>  this.props.navigation.navigate('RegisterUser', {}) } color="#2196F3" />
                    <Button title="Click Here To Login" onPress={() =>  this.props.navigation.navigate('LoginUser', {}) } color="#2196F3" />              
            
            </View>
        )
    else
        return (      
            <View style={styles.MainContainer}> 
                    <Text style= {styles.TextComponentStyle}>Logged Page</Text>                      
                    <Button title="Logout" onPress={() => this.props.setLogout()} color="#2196F3" />           
               
            
            </View>
        )             
  }
}
FirstPage.propTypes = { 
    setLogin:PropTypes.func,
    isLogged: PropTypes.bool
  };
  
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