import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import { StyleSheet, TextInput, View, Alert, Text, AsyncStorage, TouchableOpacity, ActivityIndicator, NetInfo, BackHandler } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'

export default class LoginUser extends Component { 
    
constructor(props) { 
  super(props) 
  this.state = {     
    internet: true,
    UserId: '',
    UserPassword: '',
    getData:false 
  }    
}
componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
}

handleBackPress = () => { 
//  return true;
}
componentWillMount(){
  BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
   // 인터넷 연결
   const setState = (isConnected) => this.setState({internet : isConnected})

    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
      setState(isConnected)
    });
    function handleFirstConnectivityChange(isConnected) {
      console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
      setState(isConnected)
    }
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      handleFirstConnectivityChange
    );

  this.setState({getData:false})
  this.getWeekends= this.getWeekends.bind(this);
  this.getLectios= this.getLectios.bind(this);
  this.getComments= this.getComments.bind(this);
  this.getAllWeekends= this.getAllWeekends.bind(this);
  this.getAllLectios= this.getAllLectios.bind(this);
  this.getAllComments= this.getAllComments.bind(this);
}

// login 클릭시 이벤트
UserLoginFunction(){   
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

      if(responseJson.success === 'SUCCESS')
      {               
        
          this.setState({getData:true})
          // asyncstorage에 login_id, login_name, login_christ_name 저장        
          try {
            AsyncStorage.setItem('today1', 'null');
            AsyncStorage.setItem('login_id', responseJson.id);
            AsyncStorage.setItem('login_name', responseJson.name);
            AsyncStorage.setItem('login_christ_name', responseJson.christ_name);                      
          } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
          }

          // 서버 DB의 값을 가져옴
          this.getAllComments(responseJson.id) // -> comments 모두 가져온 후에 lectio가져옴 -> lectios가져온 후에 weekends 가져옴

          //userDB에 값 확인 및 삽입
          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM users where uid = ?',
              [responseJson.id],
              (tx, results) => {                                   
                var len = results.rows.length;

              //  기기 DB에 값이 있는 경우 
                if (len > 0) { 
                } else {
                  db.transaction(function(tx) {
                    tx.executeSql(
                      'INSERT INTO users (uid, user_id, name, christ_name, age, gender, region, cathedral, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
                      [responseJson.id, responseJson.user_id, responseJson.name, responseJson.christ_name, responseJson.age, responseJson.gender, responseJson.region, responseJson.cathedral, responseJson.created_at],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {                            
                        console.log('LoginUser - DB user info inserted :', responseJson.id)
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

  componentWillReceiveProps(nextProps){  
    // props의 loginId값이 변경될때
    console.log("LoginUser - this.props.status.loginId: ", nextProps.status.loginId + "/ isLogged:"+nextProps.status.isLogged)  
  
    // setLogin 후에 실행 (처음로그인시 필요)
    if(nextProps.status.isLogged){         // && nextProps.status.loginId !== undefined
      console.log("Go Main1 after Login")
      this.setState({getData:false})
      this.props.navigation.navigate('Main1', {});        
    }   
  }
  
getAllComments(id_){    
  console.log("GetAllComments"+id_)
  fetch('https://sssagranatus.cafe24.com/servertest/commentData_ori.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      status: "selectall",
      id: id_
    })
  
  }).then((response) => response.json())
      .then((responseJson) => {
      if(responseJson.error == false)
        {
          const stack = responseJson.stack
          console.log("LoginUser - stacks in getAllComments : ", stack)
          //stack 값이 있으면 getComments  / 없으면 getAllLectios
          if(stack !== undefined){
              var date, id, onesentence, comment;
            for(var i=0; i<stack.length; i++){
              date = stack[i][1]
              id = stack[i][0]
              onesentence = stack[i][2]
              comment = stack[i][3]
              console.log("LoginUser - value of stacks in getAllComments : ",date+"/"+id+"/"+onesentence+"/"+comment)               
              this.getComments(i, stack.length, date, id, onesentence, comment)              
            }
          }else{
            this.getAllLectios(id_)
          }
        }else{
          console.log("LoginUser - getAllComments : ", 'failed')
        }
      }).catch((error) => {
        console.error(error);
      });   
} 

getAllLectios(id_){
  console.log("GetAllLectios"+id_)
  fetch('https://sssagranatus.cafe24.com/servertest/lectioData_ori.php', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      status: "selectall",
      id: id_
    })
  
  }).then((response) => response.json())
      .then((responseJson) => {
        // 성공적으로 값이 있을 경우에 
      if(responseJson.error == false)
        {
          const stack = responseJson.stack
          console.log("LoginUser - stacks in getAllLectios : ", stack)
            //stack 값이 있으면 getLectios  / 없으면 getAllWeekends
          if(stack !== undefined){            
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
              this.getLectios(i, stack.length, date, id, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2)      
            }  
          }else{
            this.getAllWeekends(id_)
          }                  
          
        }else{
          console.log("LoginUser - value of stacks in getAllLectios :", "failed")
         
        }
      }).catch((error) => {
        console.error(error);
      });   
} 

getAllWeekends(id_){    
  console.log("GetAllWeekends"+id_)
   const setLogin = (id) => this.props.setLogin(id)

   fetch('https://sssagranatus.cafe24.com/servertest/weekendData_ori.php', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({ 
       status: "selectall",
       id: id_
     })
   
   }).then((response) => response.json())
        .then((responseJson) => {
        if(responseJson.error == false)
          {
            const stack = responseJson.stack
            //stack 값이 있으면 getWeekends  / 없으면 setLogin
            if(stack !== undefined){
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
                this.getWeekends(i, stack.length, date, id, mysentence, mythought, question, answer)              
                }
            }else{
              console.log("before setLogin id : "+ id_)
              if(id_ !== undefined){
                setLogin(id_)
              }
              
            }
            
          }else{
            console.log("LoginUser - getAllWeekends : ", "failed")           
          }
        }).catch((error) => {
          console.error(error);
        });   
 } 

getComments(i, stacks, date, id, onesentence, comment){
  console.log("GetComments"+id)
  const getAllLectios = this.getAllLectios
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM comment where date = ? and uid = ?',
      [date, id],
      (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {                  
            console.log('LoginUser - Comments DB', date+"already existed")   
            if(i == stacks-1){
               getAllLectios(id)
             }  
        } else {
          console.log('LoginUser - Comments DB', date+"inserting!") 
          db.transaction(function(tx) {
            tx.executeSql(
              'INSERT INTO comment (uid, date, onesentence, comment) VALUES (?,?,?,?)',
              [id, date, onesentence, comment],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log('LoginUser - Comments DB', date+" insert done")    
                  if(i == stacks -1){
                  getAllLectios(id)
                   }                 
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

getLectios(i, stacks, date, id, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2){ 
  console.log("GetLectios"+id)
  const getAllWeekends = this.getAllWeekends
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM lectio where date = ? and uid = ?',
      [date, id],
      (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {                  
          console.log('LoginUser - Lectios DB', date+"already existed")           
          if(i == stacks -1){                    
            getAllWeekends(id)
           }  
        } else {
          console.log('LoginUser - Lectios DB', date+"inserting!") 
          db.transaction(function(tx) {
            tx.executeSql(
              'INSERT INTO lectio (uid, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2) VALUES (?,?,?,?,?,?,?,?,?,?)',
              [id, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2],
              (tx, results) => {                  
                if (results.rowsAffected > 0) {
                  console.log('LoginUser - Lectios DB', date+" insert done")     
                  if(i == stacks -1){                    
                    getAllWeekends(id)
                   }  
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

getWeekends(i, stacks, date, id, mysentence, mythought, question, answer){
  console.log("GetWeekends"+id)
  const setLogin = this.props.setLogin
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM weekend where date = ? and uid = ?',
      [date, id],
      (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {                  
            console.log('LoginUser - Weekend DB', date+"already existed")           
            if(i == stacks-1) {   
              console.log("before setLogin id : " + id)    
              if(id !== undefined){
                setLogin(id)
              }
             }    
        } else {
          console.log('LoginUser - Weekend DB', date+"inserting!") 
          db.transaction(function(tx) {
            tx.executeSql(
              'INSERT INTO weekend (uid, date, mysentence, mythought, question, answer) VALUES (?,?,?,?,?,?)',
              [id, date, mysentence, mythought, question, answer],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  console.log('LoginUser - Weekend DB', date+" insert done")     
                  if(i == stacks-1){      
                    console.log("before setLogin id : " + id) 
                    if(id !== undefined){
                      setLogin(id)
                    }
                  }               
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

setChange(){
  console.log("userid", this.state.UserId)
  this.setState({ 
    UserId: '',
    UserPassword: '',
    getData:false 
  })
 }

render() {
  return !this.state.internet ? 
  (    
    <View style={[styles.MainContainer_internet, {backgroundColor:'#F8F8F8'}]}>             
    <Text style= {[styles.TextComponentStyle, {color:'#000'}]}>인터넷을 연결해주세요</Text>
    </View>
  ) :     
    (
    this.state.getData ? 
    <View style={styles.loadingContainer}>
    <ActivityIndicator
      animating
      size="large"
      color="#C8C8C8"
      {...this.props}
    />
    
  </View>
  :
    <View style={styles.MainContainer}>      
      <NavigationEvents
      onWillFocus={payload => {
          this.setChange();
      }}
      />
      <View style={{width:'100%'}}>          
        <TouchableOpacity
          activeOpacity = {0.9}
          style={{backgroundColor: '#01579b', padding: 10}}
          onPress={() =>{
              this.props.navigation.navigate('Home') } }
          >
          <Text style={{color:"#FFF", textAlign:'left'}}>
            {"<"} 뒤로
          </Text>
        </TouchableOpacity>   
      </View> 
      <View style={{width:'100%', marginTop:130, padding:10}}>
        <Text style={{marginBottom:5}}>* 이메일로 가입하신 분은 @ 앞 부분이 아이디가 됩니다.{"\n"}(예- yellowpage@naver.com -> yellowpage)</Text>
        <TextInput        
          placeholder="아이디"      
          value={this.state.UserId}
          onChangeText={UserId => this.setState({UserId})}  
          underlineColorAndroid='transparent'      
          style={styles.TextInputStyleClass}
        />     

        <TextInput                
          placeholder="비밀번호"  
          value={this.state.UserPassword} 
          onChangeText={UserPassword => this.setState({UserPassword})}      
          underlineColorAndroid='transparent'      
          style={styles.TextInputStyleClass}      
          secureTextEntry={true}
        />
        <TouchableOpacity 
            activeOpacity = {0.9}
            style={styles.Button}
            onPress={()=>this.UserLoginFunction()} 
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
  MainContainer_internet :{     
    backgroundColor:"#01579b",
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    margin: 0,
    color:"#fff"
    },   
    MainContainer :{    
      backgroundColor:'#fff',      
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
      borderColor: '#2196F3', 
      borderRadius: 5 ,     
    },
    Button:{
      backgroundColor: '#01579b', 
      padding: 10, 
      marginBottom:5, 
      width:'100%'
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