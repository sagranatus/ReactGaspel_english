import React, { Component } from 'react';
 
import { StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity, AsyncStorage} from 'react-native';
import {PropTypes} from 'prop-types';

export default class Main1 extends Component { 

constructor(props) { 
    super(props)  
  }

  logOut(){
    this.props.setLogout()
  }

  render() {
    
        return (      
            <View style={styles.MainContainer}> 
                    <Text style= {styles.TextComponentStyle}>Main3</Text>           
                    <TouchableOpacity
                    onPress={() => this.logOut()} // logout
                    >
                    <Text style={{color:"#000", textAlign:'center'}}>
                        logout
                    </Text>
                </TouchableOpacity>
            </View>
        )
       
  }
}
Main1.propTypes = { 
    setLogout: PropTypes.func,
    status: PropTypes.shape({
        isLogged: PropTypes.bool,
        loginId: PropTypes.string
    })
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