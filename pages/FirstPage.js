import React, { Component } from 'react';
 
import { StyleSheet, TextInput, View, Alert, Button, Text} from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import MainPage from './MainPage';

export default class FirstPage extends Component { 

  static navigationOptions =
   {
      title: 'First Page',
   };
 
constructor(props) { 
    super(props) 
    alert(this.props.status.isLogged)
    console.log(this.props.status)
    // DB 테이블 생성
    db.transaction(function(txn) {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
          [],
          function(tx, res) {
            console.log('item:', res.rows.length);
            if (res.rows.length == 0) {
              txn.executeSql('DROP TABLE IF EXISTS users', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS users(uid INTEGER NOT NULL, user_id TEXT NOT NULL, email TEXT NOT NULL UNIQUE, name TEXT NOT NULL, christ_name TEXT NOT NULL, age TEXT NOT NULL, region TEXT NOT NULL, cathedral TEXT NULL, created_at TEXT NULL)',
                []
              );
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS comment(reg_id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER NOT NULL, date TEXT NOT NULL, onesentence TEXT NOT NULL, comment TEXT NOT NULL)',
                []
              );
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS lectio(reg_id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER NOT NULL, date TEXT NOT NULL, onesentence TEXT NOT NULL, bg1 TEXT NOT NULL, bg2 TEXT NOT NULL, bg3 TEXT NOT NULL, sum1 TEXT NOT NULL, sum2 TEXT NOT NULL, js1 TEXT NOT NULL, js2 TEXT NOT NULL)',
                []
              );
            }
          }
        );
      });

    this.state = { 
       isLoggedIn: this.props.status.isLogged | false, // this.props.isLogged는 store에 저장된 state이다.
      // isLoggedIn:true,
       loginId: "",
        loginName: ""
    } 
    console.log(this.props.status.isLogged);
  }
shouldComponentUpdate(nextProps) {
  if(this.props.status.isLogged !== nextProps.status.isLogged){
    return false;
  }
  return true;

}
componentWillReceiveProps(nextProps){  
    console.log("message",nextProps.status.loginId)    
    if(this.props.status.loginId !== nextProps.status.loginId){
      // 로그인이나 회원가입한 뒤에 DB에서 loginName 찾기    
        db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM users where uid = ?',
              [nextProps.status.loginId],
              (tx, results) => {
                var len = results.rows.length;
              //  값이 있는 경우에 
                if (len > 0) {
                  console.log("Message", results.rows.item(0).uid+results.rows.item(0).name)
                  this.setState({
                    loginId: results.rows.item(0).uid,
                    loginName: results.rows.item(0).name,
                    isLoggedIn: true
                  });
                  alert(this.state.loginName+this.state.loginId);
             
                } else {
                  alert('No user found');            
                }
              }
            );
          });
    }

}
  render() {
    console.log('Message', this.props.status.isLogged+"."+this.props.status.loginId+"."+this.state.isLoggedIn+"."+this.state.loginId+"."+this.state.loginName)
    if (!this.state.isLoggedIn)
        return (      
            <View style={styles.MainContainer}> 
                    <Text style= {styles.TextComponentStyle}>First Page before login</Text>                      
                    <Button title="Click Here To Register" onPress={() =>  this.props.navigation.navigate('RegisterUser', {}) } color="#2196F3" />
                    <Button title="Click Here To Login" onPress={() =>  this.props.navigation.navigate('LoginUser', {}) } color="#2196F3" />              
            
            </View>
        )
    else   
        return (     
            <MainPage />
        )             
  }
}
FirstPage.propTypes = { 
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