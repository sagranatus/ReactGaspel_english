
import React, { Component } from 'react'; 
import { StyleSheet, TextInput, View, Alert, Text, TouchableOpacity, Picker } from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });


export default class RegisterUser extends Component {

constructor(props) { 
    super(props) 
    this.state = {       
      UserId: '',
      UserName: '',
      UserCatholicName: '',
      UserAge: '',
      UserGender: '',
      UserRegion: '',
      UserCathedral: '',
      UserId: '',
      UserPassword: '',
      UserPassword_confirm: ''
    } 
  }

// 등록하기 클릭시 이벤트
UserRegistrationFunction = () =>{
 
 const { UserId }  = this.state ;
 const { UserName }  = this.state ;
 const { UserCatholicName }  = this.state ;
 const { UserAge }  = this.state ;
 const { UserGender }  = this.state ;
 const { UserRegion }  = this.state ;
 const { UserCathedral }  = this.state ;
 const { UserPassword }  = this.state ; 
 const { UserPassword_confirm }  = this.state ;  

 //const st = UserEmail.indexOf("@")
 //const UserId = UserEmail.substring(0, st)

 if(UserId == "" || UserName == "" || UserCatholicName == "" || UserRegion == "" || UserCathedral == ""){
  Alert.alert("내용을 모두 입력해주세요")
 }else if(UserPassword !== UserPassword_confirm){
   Alert.alert("비밀번호가 다릅니다")
   console.log(UserId)
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
    user_id: UserId,
    christ_name: UserCatholicName,
    age: UserAge,
    gender: UserGender,
    region: UserRegion,
    cathedral: UserCathedral,
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
            'INSERT INTO users (uid, user_id, name, christ_name, age, gender, region, cathedral, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
            [responseJson.id, UserId, UserName, UserCatholicName, UserAge, UserGender, UserRegion, UserCathedral, "now"],
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
        Alert.alert(responseJson.success)
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
         <View style={{width:'100%'}}>          
          <TouchableOpacity
            activeOpacity = {0.9}
            style={{backgroundColor: '#01579b', padding: 10}}
            onPress={() =>{
                this.props.navigation.navigate('FirstPage', {});} } 
            >
            <Text style={{color:"#FFF", textAlign:'left'}}>
              {"<"} 뒤로
            </Text>
          </TouchableOpacity>   
          </View>
                <TextInput                
                placeholder="아이디"        
                onChangeText={UserId => this.setState({UserId})}     
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:'97%', marginTop:70}]}
                />       
                
                 <TextInput                
                placeholder="이름"        
                onChangeText={UserName => this.setState({UserName})}  
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:'24%', paddingRight:'1%'}]}
                />
                 <TextInput                
                placeholder="세례명"        
                onChangeText={UserCatholicName => this.setState({UserCatholicName})}        
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:'24%', paddingLeft:'0.5%', paddingRight:'0.5%'}]}
                />
                 <TextInput                
                placeholder="생년월일"        
                onChangeText={UserAge => this.setState({UserAge})}    
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:'24%', paddingLeft:'0.5%', paddingRight:'0.5%'}]}
                />
                 <Picker
                  selectedValue={this.state.UserGender}
                  style={{width:'24%', paddingLeft:'1%'}}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({UserGender: itemValue})
                  }>
                  <Picker.Item label="성별" value="" />
                  <Picker.Item label="남자" value="남자" />
                  <Picker.Item label="여자" value="여자" />
                </Picker>
                
                <Picker
                  selectedValue={this.state.UserRegion}
                  style={{width:'48%', padding:'1%'}}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({UserRegion: itemValue})
                  }>
                  <Picker.Item label="교구" value="" />
                  <Picker.Item label="서울대교구" value="서울대교구" />
                  <Picker.Item label="대전교구" value="대전교구" />
                  <Picker.Item label="수원교구" value="수원교구" />
                  <Picker.Item label="인천교구" value="인천교구" />
                  <Picker.Item label="춘천교구" value="춘천교구" />
                  <Picker.Item label="원주교구" value="원주교구" />
                  <Picker.Item label="의정부교구" value="의정부교구" />
                  <Picker.Item label="대구교구" value="대구교구" />
                  <Picker.Item label="부산교구" value="부산교구" />
                  <Picker.Item label="청주교구" value="청주교구" />
                  <Picker.Item label="마산교구" value="마산교구" />
                  <Picker.Item label="안동교구" value="안동교구" />
                  <Picker.Item label="광주대교구" value="광주대교구" />
                  <Picker.Item label="전주교구" value="전주교구" />
                  <Picker.Item label="제주교구" value="제주교구" />
                  <Picker.Item label="군종교구" value="군종교구" />
                </Picker>
                 <TextInput                
                placeholder="본당"        
                onChangeText={UserCathedral => this.setState({UserCathedral})}
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:'48%'}]}
                />
                <TextInput                
                placeholder="비밀번호"        
                onChangeText={UserPassword => this.setState({UserPassword})}     
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:'48%'}]}       
                secureTextEntry={true}
                /> 
                <TextInput                
                placeholder="비밀번호 확인"        
                onChangeText={UserPassword_confirm => this.setState({UserPassword_confirm})}     
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:'48%'}]}       
                secureTextEntry={true}
                /> 
                <View style={{width:'100%', marginTop:10, marginBottom: 20, padding:10}}>                
                <TouchableOpacity 
                  activeOpacity = {0.9}
                  style={styles.Button}
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
margin: 0
},
 
TextInputStyleClass: {
textAlign: 'center',
marginBottom: 7,
margin:1,
height: 40,
borderWidth: 1,
// Set border Hex Color Code Here.
 borderColor: '#2196F3',
 
 // Set border Radius.
 borderRadius: 5 ,
 
// Set border Radius.
 //borderRadius: 10 ,
},
Button:{
  backgroundColor: '#01579b', 
  padding: 10, 
  marginBottom:5, 
  width:'100%'} 
 
});
 
