import React, { Component } from 'react' 
import { StyleSheet, View, Text, TouchableOpacity, AsyncStorage, Image, NetInfo} from 'react-native'
import {PropTypes} from 'prop-types'
import { openDatabase } from 'react-native-sqlite-storage'
var db = openDatabase({ name: 'UserDatabase.db' })
var ReactNativeAutoUpdater = require('react-native-auto-updater');

ReactNativeAutoUpdater.jsCodeVersion() 
export default class FirstPage extends Component { 

 
constructor(props) { 
    super(props) 

    // DB 테이블 생성
    db.transaction(function(txn) {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
          [],
          function(tx, res) {
            console.log('FirstPage - item:', res.rows.length);
            if (res.rows.length == 0) {
              txn.executeSql('DROP TABLE IF EXISTS users', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS users(uid INTEGER NOT NULL, user_id TEXT NOT NULL, name TEXT NOT NULL, christ_name TEXT NOT NULL, age TEXT NOT NULL, gender TEXT NULL, region TEXT NOT NULL, cathedral TEXT NULL, created_at TEXT NULL)',
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
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS weekend(reg_id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER NOT NULL, date TEXT NOT NULL, mysentence TEXT NOT NULL, mythought TEXT NOT NULL, question TEXT NULL, answer TEXT NULL)',
                []
              );
            }
          }
        );
      });

    this.state = { 
       internet: true
    } 
  }
  
    
  componentWillMount(){
    // 인터넷 연결
   const setState = (isConnected) => this.setState({internet : isConnected})

    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
      setState(isConnected)
    });
    function handleFirstConnectivityChange(isConnected) {
      console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
      setState(isConnected)
     /* NetInfo.isConnected.removeEventListener(
        'connectionChange',
        handleFirstConnectivityChange
      ); */
    }
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      handleFirstConnectivityChange
    );
/*
  // 로그인 상태값 가져오기
  AsyncStorage.getItem('login_id', (err, result) => {
    console.log("FirstPage - login_id : ", result)
    if(result != null){
        
    }else{
        //값이 없는 경우 회원가입 화면
      console.log("FirstPage - asyncstrage name not exists")  
      this.setState({loginstatus: false})   
    }    
  }) */
  }


  render() {   
        return (    
          !this.state.internet ? 
          (    
            <View style={[styles.MainContainer, {backgroundColor:'#F8F8F8'}]}>             
            <Text style= {[styles.TextComponentStyle, {color:'#000'}]}>인터넷을 연결해주세요</Text>
            </View>
          ) :
      /*    this.state.loginstatus ?
            <View style={styles.MainContainer}> 
            <NavigationEvents
                onWillFocus={payload => {
                  //  this.setChange();
                }}
                />
            <Image source={require('../resources/main_bible.png')} style={{width: 100, height: 100, justifyContent: 'center'}}/>
            <Text style= {styles.TextComponentStyle}>오늘의 복음</Text>
            </View>
           : */
            <View style={styles.MainContainer}> 
            <Image source={require('../resources/main_bible.png')} style={{width: 100, height: 100, justifyContent: 'center'}}/>
            <Text style= {styles.TextComponentStyle}>오늘의 복음</Text>                
                <View style={{margin:10, marginTop: 40, width:'100%', padding:10}}>  
                <TouchableOpacity
                activeOpacity = {0.9}
                style={{backgroundColor: '#fff', padding: 10}}
                onPress={() =>  this.props.navigation.navigate('RegisterUser', {}) } 
                >
                <Text style={{color:"#01579b", textAlign:'center'}}>
                회원가입하고 시작하기
                </Text>
                </TouchableOpacity> 
                <TouchableOpacity 
                activeOpacity = {0.9}
                style={{backgroundColor: 'transparent', padding: 10}}
                onPress={() =>  this.props.navigation.navigate('LoginUser', {}) } 
                >
                <Text style={{color:"#fff", textAlign:'center'}}>
                이미 계정이 있으신가요? 로그인
                </Text>
            </TouchableOpacity>                
            </View>
            </View>
              
           )              
                  
  }
}
/*  
FirstPage.propTypes = { 
    setLogout: PropTypes.func,
    status: PropTypes.shape({
        isLogged: PropTypes.bool,
        loginId: PropTypes.string
    })
  }; */
  
const styles = StyleSheet.create({ 
    MainContainer :{     
    backgroundColor:"#01579b",
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    margin: 0,
    color:"#fff"
    },          
     TextComponentStyle: {
       fontSize: 16,
      color: "#fff",
      textAlign: 'center',
      marginTop: 3, 
      marginBottom: 15
     },
     loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginTop: 0,
      paddingTop: 20,
      marginBottom: 0,
      marginHorizontal: 0,
      paddingHorizontal: 10
    }
    });