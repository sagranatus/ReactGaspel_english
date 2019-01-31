
import React, { Component } from 'react'; 
import { StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity } from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });


export default class RegisterUser extends Component {
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
      UserName: '',
      UserCatholicName: '',
      UserAge: '',
      UserRegion: '',
      UserCathedral: '',
      UserId: '',
      UserPassword: '',
      UserPassword_confirm: ''
    } 
  }

// 등록하기 클릭시 이벤트
UserRegistrationFunction = () =>{
 
 const { UserEmail }  = this.state ;
 const { UserName }  = this.state ;
 const { UserCatholicName }  = this.state ;
 const { UserAge }  = this.state ;
 const { UserRegion }  = this.state ;
 const { UserCathedral }  = this.state ;
 const { UserPassword }  = this.state ; 
 const { UserPassword_confirm }  = this.state ;  

 const st = UserEmail.indexOf("@")
 const UserId = UserEmail.substring(0, st)


 if(UserPassword !== UserPassword_confirm){
   alert("비밀번호가 다릅니다")
 }else{
     // 서버에 데이터 전송
fetch('https://sssagranatus.cafe24.com/servertest/user_registration.php', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    name: UserName,     
    email: UserEmail,
    christ_name: UserCatholicName,
    age: UserAge,
    region: UserRegion,
    cathedral: UserCathedral,
    id: UserId, 
    password: UserPassword 
  })
 
}).then((response) => response.json())
      .then((responseJson) => {
       if(responseJson.success === 'SUCCESS')
       {             
         
        console.log('RegisterUser - registration success : ', responseJson.id);
        const setLogin = this.props.setLogin
        const navigation = this.props.navigation
       // 데이터베이스에 삽입!
        db.transaction(function(tx) {
          tx.executeSql(
            'INSERT INTO users (uid, user_id, email, name, christ_name, age, region, cathedral, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
            [responseJson.id, UserId, UserEmail, UserName, UserCatholicName, UserAge, UserRegion, UserCathedral, "now"],
            (tx, results) => {
             // console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {                
                console.log('RegisterUser - DB inserted : ', responseJson.id);
                if(setLogin){
                  setLogin(responseJson.id)
                  }
                  navigation.navigate('FirstPage', {});        
             
              } else {
                console.log('RegisterUser - DB inserting failed : ', responseJson.id);
              }
            }
          );
        });

       
      } else{ 
        console.log('RegisterUser - registration failed : ', responseJson.success);
      }
       
      }).catch((error) => {
        console.error(error);
      });
 }
 
 
 
  }
  GoLoginFunction = () =>{
   this.props.navigation.navigate('LoginUser', {});
  }
 
  render() {
    return ( 
        <View style={styles.MainContainer}>            
                <TextInput                
                placeholder="이메일"        
                onChangeText={UserEmail => this.setState({UserEmail})}     
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:350, marginTop:40}]}
                />       
                
                 <TextInput                
                placeholder="이름"        
                onChangeText={UserName => this.setState({UserName})}  
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:110}]}
                />
                 <TextInput                
                placeholder="세례명"        
                onChangeText={UserCatholicName => this.setState({UserCatholicName})}        
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:110}]}
                />
                 <TextInput                
                placeholder="나이"        
                onChangeText={UserAge => this.setState({UserAge})}    
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:110}]}
                />
                
                
                 <TextInput                
                placeholder="교구"        
                onChangeText={UserRegion => this.setState({UserRegion})}       
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:170}]}
                />
                 <TextInput                
                placeholder="본당"        
                onChangeText={UserCathedral => this.setState({UserCathedral})}
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:170}]}
                />
                <TextInput                
                placeholder="비밀번호"        
                onChangeText={UserPassword => this.setState({UserPassword})}     
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:170}]}       
                secureTextEntry={true}
                /> 
                <TextInput                
                placeholder="비밀번호 확인"        
                onChangeText={UserPassword_confirm => this.setState({UserPassword_confirm})}     
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:170}]}       
                secureTextEntry={true}
                /> 
                <View style={{width:300, marginTop:10, marginBottom: 20}}>                
                <TouchableOpacity 
                  activeOpacity = {0.9}
                  style={{backgroundColor: '#01579b', padding: 10}}
                  onPress={this.UserRegistrationFunction} 
                  >
                  <Text style={{color:"#fff", textAlign:'center'}}>
                  등록하기
                  </Text>
                </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  activeOpacity = {0.9} 
                  style={{backgroundColor: '#fff', padding: 10}}
                  onPress={this.GoLoginFunction}
                  >  
                <Text style={{color:"#000", textAlign:'center'}}>
                  이미 계정이 있으신가요? 로그인하기
                  </Text>
              </TouchableOpacity>
        </View>
            
    );
  }
}
 
RegisterUser.propTypes = { 
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
flexDirection: 'row',
flexWrap: 'wrap',
margin: 10
},
 
TextInputStyleClass: {
textAlign: 'center',
marginBottom: 7,
margin:5,
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
 
