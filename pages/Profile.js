import React, { Component } from 'react';
 
import {PixelRatio, StyleSheet, View, Text, TouchableOpacity, AsyncStorage, TextInput, Picker,  Keyboard, Alert} from 'react-native';
import {NavigationEvents} from 'react-navigation'
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
var normalSize;
var normalSize_input;
var largeSize;
export default class Profile extends Component { 

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
  }   
}
componentWillMount(){
  // textSize 가져오기
  AsyncStorage.getItem('textSize', (err, result) => {
    if(result == "normal" || result == null){
      normalSize = {fontSize:15}
      normalSize_input = 15
      largeSize = {fontSize:17}
  }else if(result == "large"){
      normalSize = {fontSize:17}
      normalSize_input = 17
      largeSize = {fontSize:19}
  }else if(result == "larger"){
      normalSize = {fontSize:19}
      normalSize_input = 19
      largeSize = {fontSize:21}
  }
  })

  // users DB 가져와서 값 세팅
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM users where uid = ?',
      [this.props.status.loginId],
      (tx, results) => {                                   
        var len = results.rows.length;
      //  기기 DB에 값이 있는 경우 
        if (len > 0) { 
          this.setState({
            UserId: results.rows.item(0).user_id,
            UserName: results.rows.item(0).name,
            UserCatholicName: results.rows.item(0).christ_name,
            UserAge: results.rows.item(0).age,
            UserGender: results.rows.item(0).gender,
            UserRegion: results.rows.item(0).region,
            UserCathedral: results.rows.item(0).cathedral,
        })
        } else {     
          console.log("Profile", "fail")                       
        }
      }
    );
  });    
  try {
    AsyncStorage.setItem('profile', this.props.status.loginId);
  } catch (error) {
    console.error('AsyncStorage error: ' + error.message);
  }      
}

componentWillReceiveProps(nextProps){
  // 로그인상태일때 값 수정후 이벤트
  if(nextProps.results.id != null && nextProps.status.isLogged){
    console.log(nextProps.results.id)
    Alert.alert("수정하였습니다.") 
  }
}

// 프로필 업데이트시 이벤트
UpdateUserFunction(){
  Keyboard.dismiss()
  var name = this.state.UserName
  var user_id = this.state.UserId
  var christ_name = this.state.UserCatholicName
  var age = this.state.UserAge
  var gender = this.state.UserGender
  var region = this.state.UserRegion
  var cathedral = this.state.UserCathedral
  // user 프로필 업데이트
  this.props.updateUser(this.props.status.loginId, name, user_id, christ_name, age, gender, region, cathedral)  
  
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE users set name=?, christ_name=?, age=?, gender=?, region=?, cathedral=? where uid=?',
      [name, christ_name, age, gender, region, cathedral, this.props.status.loginId],
      (tx, results) => {                                   
        var len = results.rows.length;
      //  기기 DB에 값이 있는 경우 
      if (results.rowsAffected > 0) {
          console.log("Profile", "update Success")
        } else {     
          console.log("Profile", "update Fail")                       
        }
      }
    );
  });          
}

setChange(){
  // textSize 가져오기
  AsyncStorage.getItem('textSize', (err, result) => {
    if(result == "normal" || result == null){
      normalSize = {fontSize:15}
      normalSize_input = 15
      largeSize = {fontSize:17}
  }else if(result == "large"){
      normalSize = {fontSize:17}
      normalSize_input = 17
      largeSize = {fontSize:19}
  }else if(result == "larger"){
      normalSize = {fontSize:19}
      normalSize_input = 19
      largeSize = {fontSize:21}
  }
    this.setState({reload:true})
  })  
  AsyncStorage.getItem('profile', (err, result) => {
   
      // users DB 가져와서 값 세팅
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM users where uid = ?',
          [this.props.status.loginId],
          (tx, results) => {                                   
            var len = results.rows.length;
          //  기기 DB에 값이 있는 경우 
            if (len > 0) { 
              this.setState({
                UserId: results.rows.item(0).user_id,
                UserName: results.rows.item(0).name,
                UserCatholicName: results.rows.item(0).christ_name,
                UserAge: results.rows.item(0).age,
                UserGender: results.rows.item(0).gender,
                UserRegion: results.rows.item(0).region,
                UserCathedral: results.rows.item(0).cathedral,
            })
            } else {     
              console.log("Profile", "fail")                       
            }
          }
        );
      });         
       
  }); 
}


render() {
  return (this.state.initialLoading)
  ? (    

      <View style={styles.loadingContainer}>
      <ActivityIndicator
        animating
        size="large"
        color="#C8C8C8"
        {...this.props}
      />
    </View>
    )

  : (   
    <View style={styles.MainContainer}>
    <NavigationEvents
      onWillFocus={payload => {
        this.setChange()
      }}
      />
      <View style={{width:'100%'}}>          
        <TouchableOpacity
        activeOpacity = {0.9}
        style={{backgroundColor: '#01579b', padding: 10}}
        onPress={() =>  this.props.navigation.navigate('Main5')} 
        >
        <Text style={{color:"#FFF", textAlign:'left'}}>
            {"<"} 뒤로
        </Text>
      </TouchableOpacity>  
      </View>
      
        
      <TextInput                
              placeholder="아이디"        
              value={this.state.UserId}
              editable={false}
              underlineColorAndroid='transparent'        
              style={[styles.TextInputStyleClass, {width:'97%', marginTop:70, fontSize: normalSize_input / PixelRatio.getFontScale()}]}
              />       
              
                <TextInput                
              placeholder="이름"       
              value={this.state.UserName} 
              onChangeText={UserName => this.setState({UserName})}  
              underlineColorAndroid='transparent'        
              style={[styles.TextInputStyleClass, {width:'24%', fontSize: normalSize_input / PixelRatio.getFontScale()}]}
              />
                <TextInput                
              placeholder="세례명"        
              value={this.state.UserCatholicName}
              onChangeText={UserCatholicName => this.setState({UserCatholicName})}        
              underlineColorAndroid='transparent'        
              style={[styles.TextInputStyleClass, {width:'24%', fontSize: normalSize_input / PixelRatio.getFontScale()}]}
              />
                <TextInput                
              placeholder="생년월일"    
              value={this.state.UserAge}    
              onChangeText={UserAge => this.setState({UserAge})}    
              underlineColorAndroid='transparent'        
              style={[styles.TextInputStyleClass, {width:'24%', fontSize: normalSize_input / PixelRatio.getFontScale()}]}
              />
                <Picker
                selectedValue={this.state.UserGender}
                style={{width:'24%', padding:'1%', marginBottom:7, height:50}}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({UserGender: itemValue}) }
                itemStyle={{height:50}}>
                <Picker.Item label="성별" value="" />
                <Picker.Item label="남자" value="남자" />
                <Picker.Item label="여자" value="여자" />
              </Picker>
              
              <Picker
                selectedValue={this.state.UserRegion}
                style={{width:'48%', height:50}}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({UserRegion: itemValue})}
                itemStyle={{height:50}}>
                <Picker.Item label="교구 선택" value="" />
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
              value={this.state.UserCathedral}       
              onChangeText={UserCathedral => this.setState({UserCathedral})}
              underlineColorAndroid='transparent'        
              style={[styles.TextInputStyleClass, {width:'48%', fontSize: normalSize_input / PixelRatio.getFontScale()}]}
              />
  
    <View style={{width:'100%', justifyContent: 'center',  alignItems: 'center', marginTop:10, marginBottom: 20, padding:10}}>                
    <TouchableOpacity 
      activeOpacity = {0.9}
      style={styles.Button}
      onPress={()=> this.UpdateUserFunction()} 
      >
      <Text style={{color:"#fff", textAlign:'center'}}>
      프로필 업데이트
      </Text>
    </TouchableOpacity>
    </View>
  </View>
    )      
  }
}

Profile.propTypes = { 
  updateUser: PropTypes.func,
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
    height: 50,
    borderWidth: 1,
    // Set border Hex Color Code Here.
      borderColor: '#2196F3',
      
      // Set border Radius.
      borderRadius: 5 ,
      
    // Set border Radius.
      //borderRadius: 10 ,
    },
    Button:{
      textAlign:'center',
      backgroundColor: '#01579b', 
      padding: 10, 
      marginTop:10,
      width:200,
      borderRadius: 10,
      height:40}
    });