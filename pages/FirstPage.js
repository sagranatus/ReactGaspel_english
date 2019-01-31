import React, { Component } from 'react' 
import { StyleSheet, View, Button, Text, TouchableOpacity, AsyncStorage, Image} from 'react-native'
import {PropTypes} from 'prop-types'
import { openDatabase } from 'react-native-sqlite-storage'
var db = openDatabase({ name: 'UserDatabase.db' })
import MainPage from './MainPage'

export default class FirstPage extends Component { 

 
constructor(props) { 
    super(props) 
    console.log("FirstPage - this.props.status : ", this.props.status)

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
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS weekend(reg_id INTEGER PRIMARY KEY AUTOINCREMENT, uid INTEGER NOT NULL, date TEXT NOT NULL, mysentence TEXT NOT NULL, mythought TEXT NOT NULL)',
                []
              );
            }
          }
        );
      });

    this.state = { 
       isLoggedIn: this.props.status.isLogged | false, 
      // isLoggedIn:true,
       loginId: null,
        loginName: null
    } 
    console.log("FirstPage - this.props.status.isLogged", this.props.status.isLogged);
  }

  componentWillMount(){
  // 로그인 상태값 가져오기
  AsyncStorage.getItem('login_id', (err, result) => {
    console.log("FirstPage - login_id : ", result)
    if(result != null){
      this.setState({
        loginId: result,
        isLoggedIn: true
      });
      this.props.setLogin(result) // 다시 새로고침할때 async값이 있는 경우 login을 해서 props 값을 저장해줘야 한다.
    }    
  })

    AsyncStorage.getItem('login_name', (err, result) => {
      console.log("FirstPage - login_name : ", result)
      this.setState({
        loginName: result
            });
    
  })
 

  }

 
shouldComponentUpdate(nextProps) {
  if(this.props.status.isLogged !== nextProps.status.isLogged){
    return false;
  }
  return true;

}
componentWillReceiveProps(nextProps){  
    // props의 loginId값이 변경될때 적용
    console.log("FirstPage - this.props.status.loginId: ", nextProps.status.loginId)  
   
    // setLogin 후에 
    if(this.props.status.loginId !== nextProps.status.loginId){
      console.log("FirstPage - componentWillReceiveProps")
      // 로그인이나 회원가입한 뒤에 DB에서 loginName 찾기    
        db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM users where uid = ?',
              [nextProps.status.loginId],
              (tx, results) => {
                var len = results.rows.length;
              //  값이 있는 경우에 
                if (len > 0) {
                  console.log("FirstPage - Message", results.rows.item(0).uid+"is get")
                  this.setState({
                    loginId: results.rows.item(0).uid,
                    loginName: results.rows.item(0).name,
                    isLoggedIn: true
                  });
                               
                } else {
                  // 로그아웃시에 
                  this.setState({
                    loginId: null,
                    loginName: null,
                    isLoggedIn: false
                  });      
                }
              }
            );
          });
    }

}
  render() {
    console.log('FirstPage - Message in render:', this.props.status.isLogged+"."+this.props.status.loginId+"."+this.state.isLoggedIn+"."+this.state.loginId+"."+this.state.loginName)
    if (!this.state.isLoggedIn)
        return (               
            <View style={styles.MainContainer}> 
             <Image source={require('../resources/main_bible.png')} style={{width: 100, height: 100, justifyContent: 'center'}}/>
              <Text style= {styles.TextComponentStyle}>오늘의 복음</Text>                
                <View style={{margin:10, marginTop: 40}}>  
                  <TouchableOpacity
                  activeOpacity = {0.9}
                  style={{backgroundColor: '#fff', paddingHorizontal: 110, paddingVertical: 10}}
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
    else   
        return (     
            <MainPage />
        )             
  }
}
FirstPage.propTypes = { 
  setLogout: PropTypes.func,
    status: PropTypes.shape({
        isLogged: PropTypes.bool,
        loginId: PropTypes.string
    })
  };
  
const styles = StyleSheet.create({
 
    MainContainer :{     
    backgroundColor:"#01579b",
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    margin: 0,
    color:"#fff"
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
       fontSize: 16,
      color: "#fff",
      textAlign: 'center',
      marginTop: 3, 
      marginBottom: 15
     }
    });