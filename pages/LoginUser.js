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
          
            //userDB에 값 확인 및 삽입
            const navigation = this.props.navigation
            const setLogin = this.props.setLogin;
            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM users where uid = ?',
                [responseJson.id],
                (tx, results) => {
                  this.getAllComments(responseJson.id)
                  this.getAllLectios(responseJson.id)
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
getAllComments(id){    
 // console.log("hahaha", id)    
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
       //   console.log("haha", "1!!!")
          // 성공적으로 값이 있을 경우에 
        if(responseJson.error == false)
          {
         //   console.log("haha", "true!!!")
         //   console.log("haha", responseJson.stack)
            const stack = responseJson.stack
            // 값이 가져와 졌다. 날짜에 값이 있는지 확인하고 없는 경우에는 insert 한다.
               //comment있는지 확인    
           //    console.log("haha2", stack[0][1]+stack[0][0]+stack.length);
               var date, id, onesentence, comment;
              for(var i=0; i<stack.length; i++){
               // console.log("haha3", i+stack[i][1]+stack[i][0])
               date = stack[i][1]
               id = stack[i][0]
               onesentence = stack[i][2]
               comment = stack[i][3]
           //    console.log("haha3",date+id+onesentence+comment)               
               this.getComments(date, id, onesentence, comment)              
              }
            
          }else{
            console.log("haha", "fail!!!")
          }
        }).catch((error) => {
          console.error(error);
        });   
} 

getAllLectios(id){    
  console.log("hahaha", id)    
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
          console.log("haha", "1!!!")
          // 성공적으로 값이 있을 경우에 
        if(responseJson.error == false)
          {
            console.log("haha", "true!!!")
            console.log("haha", responseJson.stack)
            const stack = responseJson.stack
            // 값이 가져와 졌다. 날짜에 값이 있는지 확인하고 없는 경우에는 insert 한다.
               //comment있는지 확인    
               console.log("haha2", stack[0][1]+stack[0][0]+stack.length);
               var date, id, onesentence, comment;
              for(var i=0; i<stack.length; i++){
               // console.log("haha3", i+stack[i][1]+stack[i][0])
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
             //  comment = stack[i][3]
            //   console.log("haha3",date+id+onesentence+comment)               
               this.getLectios(date, id, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2)              
              }
            
          }else{
            console.log("haha", "fail!!!")
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
     // console.log('haha', results.rows.item(0).comment) 
        if (len > 0) {                  
            console.log('haha', "first comment existed")   
        
        } else {
          console.log('haha', "first comment not existed")  
          db.transaction(function(tx) {
            tx.executeSql(
              'INSERT INTO comment (uid, date, onesentence, comment) VALUES (?,?,?,?)',
              [id, date, onesentence, comment],
              (tx, results) => {
                console.log('haha', 'done');
                if (results.rowsAffected > 0) {
                  console.log('haha', "insert done")                   
                } else {
                  alert('insert failed');
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
     // console.log('haha', results.rows.item(0).comment) 
        if (len > 0) {                  
            console.log('haha', "first lectio existed")   
        
        } else {
          console.log('haha', "first lectio not existed")  
          db.transaction(function(tx) {
            tx.executeSql(
              'INSERT INTO lectio (uid, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2) VALUES (?,?,?,?,?,?,?,?,?,?)',
              [id, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2],
              (tx, results) => {
                console.log('haha', 'done');
                if (results.rowsAffected > 0) {
                  console.log('haha', "lectio insert done")                   
                } else {
                  alert('insert failed');
                }
              }
            );
          });                            
        }
      }
    );
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