import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import { StyleSheet, TextInput, View, Alert, Button, Text} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });

export default class LoginUser extends Component { 
    static navigationOptions =  ({ navigation }) => {
        return {
        headerLeft: (
            <Button
            onPress={() =>{
                navigation.navigate('FirstPage', {});} }
            title="back"
            color="transparent"
            titleColor="#fff"
            />
        ),
        }
    };
constructor(props) { 
    super(props) 
    this.state = { 
      UserEmail: '',
      UserPassword: '' 
    } 
  }

// login 클릭시 이벤트
UserLoginFunction = () =>{ 
 const { UserEmail }  = this.state ;
 const { UserPassword }  = this.state ;
// server로 값을 전달함
fetch('https://sssagranatus.cafe24.com/servertest/user_login.php', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    email: UserEmail, 
    password: UserPassword 
  })
 
}).then((response) => response.json())
      .then((responseJson) => {
 
        // 성공적으로 값이 있을 경우에 
       if(responseJson.success === 'SUCCESS')
        {              
          
            const navigation = this.props.navigation
            const setLogin = this.props.setLogin;
            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM users where uid = ?',
                [responseJson.id],
                (tx, results) => {
                  var len = results.rows.length;
                //  기기 DB에 값이 있는 경우 
                  if (len > 0) {                  
                    alert("exist");
                    if(setLogin){ // action setLogin -> 이때 nextprops가 전달된다!!
                      setLogin(responseJson.id) // uid 값
                    }
                    navigation.navigate('FirstPage', {}); 
                //  기기 DB에 값이 없는 경우 DB에 삽입후에 firstpage로 이동
                  } else {
                    db.transaction(function(tx) {
                      tx.executeSql(
                        'INSERT INTO users (uid, user_id, email, name, christ_name, age, region, cathedral, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
                        [responseJson.id, responseJson.user_id, responseJson.email, responseJson.name, responseJson.christ_name, responseJson.age, responseJson.region, responseJson.cathedral, responseJson.created_at],
                        (tx, results) => {
                          console.log('Results', results.rowsAffected);
                          console.log('Result', responseJson.id); // response로 uid값이 나와야 함
                          if (results.rowsAffected > 0) {
                            console.log('Message', "added success")
                            if(setLogin){ // action setLogin
                              setLogin(responseJson.id) // uid 값
                            }
                            navigation.navigate('FirstPage', {});                         
                          } else {
                            alert('Registration Failed');
                          }
                        }
                      );
                    });                             
                  }
                }
              );
            });            
           // alert(responseJson.id+"/"+responseJson.name+"/"+responseJson.user_id+"/"+responseJson.email+"/"+responseJson.christ_name+"/"+responseJson.region+"/"+responseJson.cathedral+"/"+responseJson.created_at)
           // Alert.alert(responseJson.id)            
        }
        else{ 
          Alert.alert(responseJson.success); // FAIL
        }
 
      }).catch((error) => {
        console.error(error);
      });
 
 
  }
 
  render() {
    return (      
      <View style={styles.MainContainer}> 
              <Text style= {styles.TextComponentStyle}>User Login Form</Text>        
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
      
              <Button title="Click Here To Login" onPress={this.UserLoginFunction} color="#2196F3" />           
        
      
      </View>
            
    );
  }
}
LoginUser.propTypes = { 
    setLogin:PropTypes.func,
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