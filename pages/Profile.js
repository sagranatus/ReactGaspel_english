import React, { Component } from 'react';
 
import { StyleSheet, View, Text, TouchableOpacity, AsyncStorage, TextInput, Picker,  Keyboard} from 'react-native';
import {NavigationEvents} from 'react-navigation'
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import ReactNativeAN from 'react-native-alarm-notification';
const fireDate = ReactNativeAN.parseDate(new Date(Date.now() + 10000)); 
var normalSize;
var largeSize;
export default class Profile extends Component { 

constructor(props) { 
    super(props)  
    this.state = {
      UserEmail: '',
      UserName: '',
      UserCatholicName: '',
      UserAge: '',
      UserRegion: '',
      UserCathedral: '',
    }
   
  }
  componentWillMount(){
    AsyncStorage.getItem('textSize', (err, result) => {
      if(result == "normal" || result == null){
        normalSize = {fontSize:15}
        largeSize = {fontSize:17}
      }else if(result == "large"){
        normalSize = {fontSize:17}
        largeSize = {fontSize:19}
      }else if(result == "larger"){
        normalSize = {fontSize:19}
        largeSize = {fontSize:21}
      }
    })
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users where uid = ?',
        [this.props.status.loginId],
        (tx, results) => {                                   
          var len = results.rows.length;
        //  기기 DB에 값이 있는 경우 
          if (len > 0) { 
            this.setState({
              UserEmail: results.rows.item(0).email,
              UserName: results.rows.item(0).name,
              UserCatholicName: results.rows.item(0).christ_name,
              UserAge: results.rows.item(0).age,
              UserRegion: results.rows.item(0).region,
              UserCathedral: results.rows.item(0).cathedral,
          })
        //  기기 DB에 값이 없는 경우 DB에 삽입후에 firstpage로 이동
          } else {     
            console.log("Profile", "fail")                       
          }
        }
      );
    });          
  }
 
  componentWillReceiveProps(nextProps){
    if(nextProps.results.id != null){
      console.log(nextProps.results.id)
      alert("수정하였습니다.") 
    }
  }

  UpdateUserFunction(){
    Keyboard.dismiss()
    var name = this.state.UserName
    var email = this.state.UserEmail
    var christ_name = this.state.UserCatholicName
    var age = this.state.UserAge
    var region = this.state.UserRegion
    var cathedral = this.state.UserCathedral
    console.log()
    this.props.updateUser(this.props.status.loginId, name, email, christ_name, age, region, cathedral)
   
    
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE users set name=?, christ_name=?, age=?, region=?, cathedral=? where uid=?',
        [name, christ_name, age, region, cathedral, this.props.status.loginId],
        (tx, results) => {                                   
          var len = results.rows.length;
        //  기기 DB에 값이 있는 경우 
        if (results.rowsAffected > 0) {
            console.log("Profile", "update Success")
        //  기기 DB에 값이 없는 경우 DB에 삽입후에 firstpage로 이동
          } else {     
            console.log("Profile", "update Fail")                       
          }
        }
      );
    });          
  }

  setChange(){
    AsyncStorage.getItem('textSize', (err, result) => {
      if(result == "normal" || result == null){
        normalSize = {fontSize:15}
        largeSize = {fontSize:17}
      }else if(result == "large"){
        normalSize = {fontSize:17}
        largeSize = {fontSize:19}
      }else if(result == "larger"){
        normalSize = {fontSize:19}
        largeSize = {fontSize:21}
      }
      
      this.setState({reload:true})
    })
   
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
              {"<"} BACK
          </Text>
        </TouchableOpacity>  
        </View>
        
         
        <TextInput                
                placeholder="이메일"        
                value={this.state.UserEmail}
                editable={false}
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:'97%', marginTop:70}, normalSize]}
                />       
                
                 <TextInput                
                placeholder="이름"       
                value={this.state.UserName} 
                onChangeText={UserName => this.setState({UserName})}  
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:'32%'}, normalSize]}
                />
                 <TextInput                
                placeholder="세례명"        
                value={this.state.UserCatholicName}
                onChangeText={UserCatholicName => this.setState({UserCatholicName})}        
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:'32%'}, normalSize]}
                />
                 <TextInput                
                placeholder="나이"    
                value={this.state.UserAge}    
                onChangeText={UserAge => this.setState({UserAge})}    
                underlineColorAndroid='transparent'        
                style={[styles.TextInputStyleClass, {width:'32%'}, normalSize]}
                />
                
                <Picker
                  selectedValue={this.state.UserRegion}
                  style={{width:'48%'}}
                  onValueChange={(itemValue, itemIndex) =>
                    this.setState({UserRegion: itemValue})
                  }>
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
                style={[styles.TextInputStyleClass, {width:'48%'}, normalSize]}
                />
    
     <View style={{width:'100%', marginTop:10, marginBottom: 20, padding:10}}>                
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
      marginTop:10,
      marginBottom:5, 
      width:'100%'}
    });