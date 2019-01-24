import React, { Component } from 'react';
 
import { StyleSheet, TextInput, View, Alert, Button, Text} from 'react-native';
import {PropTypes} from 'prop-types';

export default class Main2 extends Component { 

constructor(props) { 
    super(props)  
  }

  render() {
    
        return (      
            <View style={styles.MainContainer}> 
                    <Text style= {styles.TextComponentStyle}>Main 2</Text>                      
            
            </View>
        )
       
  }
}
Main2.propTypes = { 
    status: PropTypes.arrayOf(PropTypes.shape({
        isLogged: PropTypes.bool,
        loginId: PropTypes.string
    }))
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