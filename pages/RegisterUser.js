
import React, { Component } from 'react'; 
import { AppRegistry, StyleSheet, TextInput, View, Alert, Button, Text } from 'react-native';
import {PropTypes} from 'prop-types';

export default class RegisterUser extends Component {
static navigationOptions =  ({ navigation }) => {
    return {
    headerLeft: (
        <Button
        onPress={() =>{
            navigation.navigate('FirstPage', {});} }
        title="Info"
        color="#000"
        />
    ),
    }
};
constructor(props) { 
    super(props) 
    this.state = { 
      UserName: '',
      UserEmail: '',
      UserPassword: '' 
    } 
  }
 
  UserRegistrationFunction = () =>{
 
 const { UserName }  = this.state ;
 const { UserEmail }  = this.state ;
 const { UserPassword }  = this.state ; 
 
fetch('https://sssagranatus.cafe24.com/servertest/user_registration.php', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    name: UserName, 
    email: UserEmail, 
    password: UserPassword 
  })
 
}).then((response) => response.json())
      .then((responseJson) => { 
        if(this.props.setLogin){
          this.props.setLogin()
        }
// Showing response message coming from server after inserting records.
        Alert.alert(responseJson); 
        this.props.navigation.navigate('FirstPage', {});
      }).catch((error) => {
        console.error(error);
      });
 
  }
  GoLoginFunction = () =>{
  this.props.navigation.navigate('LoginUser', {});
  }
 
  render() {
    return ( 
        <View style={styles.MainContainer}>      
        <Button title="Click Here To Login" onPress={this.GoLoginFunction} color="#2196F3" />    
                <Text style= {{ fontSize: 20, color: "#000", textAlign: 'center', marginBottom: 15 }}>User Registration Form</Text>        
                <TextInput                
                // Adding hint in Text Input using Place holder.
                placeholder="Enter User Name"        
                onChangeText={UserName => this.setState({UserName})}        
                // Making the Under line Transparent.
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                <TextInput                
                // Adding hint in Text Input using Place holder.
                placeholder="Enter User Email"        
                onChangeText={UserEmail => this.setState({UserEmail})}        
                // Making the Under line Transparent.
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />        
                <TextInput                
                // Adding hint in Text Input using Place holder.
                placeholder="Enter User Password"        
                onChangeText={UserPassword => this.setState({UserPassword})}        
                // Making the Under line Transparent.
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}        
                secureTextEntry={true}
                /> 
                <Button title="Click Here To Register" onPress={this.UserRegistrationFunction} color="#2196F3" />  
                
        </View>
            
    );
  }
}
 
RegisterUser.propTypes = { 
  setLogin:PropTypes.func,
  isLogged: PropTypes.bool
};

const styles = StyleSheet.create({
 
MainContainer :{
 
justifyContent: 'center',
flex:1,
margin: 10
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
 
// Set border Radius.
 //borderRadius: 10 ,
}
 
});
 
