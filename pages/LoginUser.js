import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import { StyleSheet, TextInput, View, Alert, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });

export default class LoginUser extends Component { 
   
constructor(props) { 
    super(props) 
    this.state = { 
      UserId: '',
      UserPassword: '' 
    } 
  }

// login 클릭시 이벤트
UserLoginFunction = () => { 
 const { UserId }  = this.state 
 const { UserPassword }  = this.state

// server로 값을 전달함

fetch('https://sssagranatus.cafe24.com/servertest/user_login.php', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    user_id: UserId, 
    password: UserPassword 
  })
 
}).then((response) => response.json())
      .then((responseJson) => {
 
        // 성공적으로 값이 있을 경우에 
       if(responseJson.success === 'SUCCESS')
        {               
          // 우선적으로 asyncstorage에 로그인 상태 저장
          try {
            AsyncStorage.setItem('login_id', responseJson.id);
            AsyncStorage.setItem('login_name', responseJson.name);
            AsyncStorage.setItem('login_christ_name', responseJson.christ_name);
          } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
          }
            // 서버 DB의 값을 가져옴
            this.getAllComments(responseJson.id)
            this.getAllLectios(responseJson.id)
            this.getAllWeekends(responseJson.id)

            //userDB에 값 확인 및 삽입
            const navigation = this.props.navigation
            const setLogin = this.props.setLogin
            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM users where uid = ?',
                [responseJson.id],
                (tx, results) => {                                   
                  var len = results.rows.length;
                //  기기 DB에 값이 있는 경우 
                  if (len > 0) { 
                    if(setLogin){ 
                      setLogin(responseJson.id)                     
                    }
                    navigation.navigate('FirstPage', {}); 

                //  기기 DB에 값이 없는 경우 DB에 삽입후에 firstpage로 이동
                  } else {
                    db.transaction(function(tx) {
                      tx.executeSql(
                        'INSERT INTO users (uid, user_id, name, christ_name, age, gender, region, cathedral, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
                        [responseJson.id, responseJson.user_id, responseJson.name, responseJson.christ_name, responseJson.age, responseJson.gender, responseJson.region, responseJson.cathedral, responseJson.created_at],
                        (tx, results) => {
                        //  console.log('Results', results.rowsAffected)
                          if (results.rowsAffected > 0) {                            
                          console.log('LoginUser - DB user info inserted :', responseJson.id)
                            if(setLogin){ // action setLogin
                              setLogin(responseJson.id) 
                            }
                            navigation.navigate('FirstPage', {});                         
                          } else {
                            console.log('LoginUser - DB user info inserting failed :', responseJson.id)
                          }
                        }
                      );
                    });                             
                  }
                }
              );
            });                     
        }
        // 로그인 정보가 없는 경우에 FAIL
        else{ 
          Alert.alert(responseJson.success); // FAIL
        }
 
      }).catch((error) => {
        console.error(error);
      });
 
     
 
  }
getAllComments(id){    
    try {
      AsyncStorage.setItem('getAll', 'start');
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    } 
  fetch('https://sssagranatus.cafe24.com/servertest/commentData.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      status: "selectall",
      id: id
    })
  
  }).then((response) => response.json())
        .then((responseJson) => {
          // 성공적으로 값이 있을 경우에 
        if(responseJson.error == false)
          {
            const stack = responseJson.stack
            console.log("LoginUser - stacks in getAllComments : ", stack)
            
               var date, id, onesentence, comment;
              for(var i=0; i<stack.length; i++){
               date = stack[i][1]
               id = stack[i][0]
               onesentence = stack[i][2]
               comment = stack[i][3]
               console.log("LoginUser - value of stacks in getAllComments : ",date+"/"+id+"/"+onesentence+"/"+comment)               
               this.getComments(date, id, onesentence, comment)              
              }
            
          }else{
            console.log("LoginUser - getAllComments : ", 'failed')
          }
        }).catch((error) => {
          console.error(error);
        });   
} 

getAllLectios(id){      
  fetch('https://sssagranatus.cafe24.com/servertest/lectioData.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      status: "selectall",
      id: id
    })
  
  }).then((response) => response.json())
        .then((responseJson) => {
          // 성공적으로 값이 있을 경우에 
        if(responseJson.error == false)
          {
            const stack = responseJson.stack
            console.log("LoginUser - stacks in getAllLectios : ", stack)

               var date, id, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2;
              for(var i=0; i<stack.length; i++){
               date = stack[i][1]
               id = stack[i][0]
               onesentence = stack[i][2]
               bg1 = stack[i][3]
               bg2 = stack[i][4]
               bg3 = stack[i][5]
               sum1 = stack[i][6]
               sum2 = stack[i][7]
               js1 = stack[i][8]
               js2 = stack[i][9]     
               console.log("LoginUser - value of stacks in getAllLectios : ",date+"/"+id+"/"+onesentence+"/"+bg1+"/"+bg2+"/"+bg3+"/"+sum1+"/"+sum2+"/"+js1+"/"+js2)      
               this.getLectios(date, id, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2)              
              }
            
          }else{
            console.log("LoginUser - value of stacks in getAllLectios :", "failed")
          }
        }).catch((error) => {
          console.error(error);
        });   
} 

getAllWeekends(id){    
  // console.log("hahaha", id)    
   fetch('https://sssagranatus.cafe24.com/servertest/weekendData.php', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ 
       status: "selectall",
       id: id
     })
   
   }).then((response) => response.json())
         .then((responseJson) => {
         if(responseJson.error == false)
           {
              const stack = responseJson.stack
              console.log("LoginUser - stacks in getAllWeekends : ", stack)
              var date, id, mysentence, mythought, question, answer;
               for(var i=0; i<stack.length; i++){
                console.log("LoginUser - stacks in getAllWeekends : ", i+stack[i][1]+stack[i][0])
                date = stack[i][1]
                id = stack[i][0]
                mysentence = stack[i][2]
                mythought = stack[i][3]
                question = stack[i][4]
                answer = stack[i][5]
                console.log("LoginUser - value of stacks in getAllWeekends : ",date+"/"+id+"/"+mysentence+"/"+mythought+"/"+answer)    
                           
                this.getWeekends(date, id, mysentence, mythought, question, answer)              
               }
             
           }else{
              console.log("LoginUser - getAllWeekends : ", "failed") 
           }
         }).catch((error) => {
           console.error(error);
         });   
 } 

getComments(date, id, onesentence, comment){
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM comment where date = ? and uid = ?',
      [date, id],
      (tx, results) => {
        var len = results.rows.length;
      //  값이 있는 경우에 
        if (len > 0) {                  
            console.log('LoginUser - Comments DB', date+"already existed")   
        
        } else {
          console.log('LoginUser - Comments DB', date+"inserting!") 
          db.transaction(function(tx) {
            tx.executeSql(
              'INSERT INTO comment (uid, date, onesentence, comment) VALUES (?,?,?,?)',
              [id, date, onesentence, comment],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log('LoginUser - Comments DB', date+" insert done")                   
                } else {
                  console.log('LoginUser - Comments DB', "insert failed")   
                }
              }
            );
          });                            
        }
      }
    );
  }); 
}

getLectios(date, id, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2){
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM lectio where date = ? and uid = ?',
      [date, id],
      (tx, results) => {
        var len = results.rows.length;
      //  값이 있는 경우에 
        if (len > 0) {                  
          console.log('LoginUser - Lectios DB', date+"already existed")   
        
        } else {
          console.log('LoginUser - Lectios DB', date+"inserting!") 
          db.transaction(function(tx) {
            tx.executeSql(
              'INSERT INTO lectio (uid, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2) VALUES (?,?,?,?,?,?,?,?,?,?)',
              [id, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2],
              (tx, results) => {                  
                if (results.rowsAffected > 0) {
                  console.log('LoginUser - Lectios DB', date+" insert done")               
                } else {
                  console.log('LoginUser - Lectios DB', date+" insert failed")  
                }
              }
            );
          });                            
        }
      }
    );
  }); 
}

getWeekends(date, id, mysentence, mythought, question, answer){
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM weekend where date = ? and uid = ?',
      [date, id],
      (tx, results) => {
        var len = results.rows.length;
      //  값이 있는 경우에 
        if (len > 0) {                  
            console.log('LoginUser - Weekend DB', date+"already existed")   
        
        } else {
          console.log('LoginUser - Weekend DB', date+"inserting!") 
          db.transaction(function(tx) {
            tx.executeSql(
              'INSERT INTO weekend (uid, date, mysentence, mythought, question, answer) VALUES (?,?,?,?,?,?)',
              [id, date, mysentence, mythought, question, answer],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log('LoginUser - Weekend DB', date+" insert done")                   
                } else {
                  console.log('LoginUser - Weekend DB', "insert failed")   
                }
              }
            );
          });                            
        }
      }
    );
  }); 
}
GoRegisterFunction = () =>{
  this.props.navigation.navigate('RegisterUser', {});
 }

  render() {
    return (      
      <View style={styles.MainContainer}>      
       <View style={{width:'100%'}}>          
          <TouchableOpacity
            activeOpacity = {0.9}
            style={{backgroundColor: '#01579b', padding: 10}}
            onPress={() =>{
                this.props.navigation.navigate('FirstPage', {});} } 
            >
            <Text style={{color:"#FFF", textAlign:'left'}}>
              {"<"} BACK
            </Text>
          </TouchableOpacity>   
        </View> 
              <View style={{width:'100%', marginTop:170, padding:10}}>
              <TextInput        
                placeholder="아이디"      
                onChangeText={UserId => this.setState({UserId})}  
                underlineColorAndroid='transparent'      
                style={styles.TextInputStyleClass}
              />      
              <TextInput                
                placeholder="비밀번호"      
                onChangeText={UserPassword => this.setState({UserPassword})}      
                underlineColorAndroid='transparent'      
                style={styles.TextInputStyleClass}      
                secureTextEntry={true}
              />
             <TouchableOpacity 
                  activeOpacity = {0.9}
                  style={styles.Button}
                  onPress={this.UserLoginFunction} 
                  >
                  <Text style={{color:"#fff", textAlign:'center'}}>
                  로그인
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                  activeOpacity = {0.9} 
                  style={{backgroundColor: '#fff', padding: 10, marginTop:20}}
                  onPress={this.GoRegisterFunction}
                  >  
                <Text style={{color:"#000", textAlign:'center'}}>
                  계정이 없으신가요? 가입하기
                  </Text>
              </TouchableOpacity>
              </View>
      
      </View>
            
    );
  }
}
LoginUser.propTypes = { 
    setLogin: PropTypes.func,
    status: PropTypes.shape({
      isLogged: PropTypes.bool,
      loginId: PropTypes.string
  })
  };
   
const styles = StyleSheet.create({
 
    MainContainer :{          
      justifyContent: 'center',
      flex:1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      margin: 0
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
    } ,
    Button:{
      backgroundColor: '#01579b', 
      padding: 10, 
      marginBottom:5, 
      width:'100%'}    
    });