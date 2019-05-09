import React, { Component } from 'react';
 
import { Platform, PushNotificationIOS, StyleSheet, View, Text, TouchableOpacity, AsyncStorage, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { SelectMultipleGroupButton } from 'react-native-selectmultiple-button'
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'
import DateTimePicker from 'react-native-modal-datetime-picker';

var PushNotification = require('react-native-push-notification');
var normalSize;
var largeSize;
var textSize;
var course;

//textSize 가져와서 textSize value 삽입
AsyncStorage.getItem('textSize', (err, result) => { 
  if(result == "normal" || result == null){
    textSize = [0]
  }else if(result == "large"){
    textSize = [1]
  }else if(result == "larger"){
    textSize = [2]
  }
})

// course 값 가져와서 course value 삽입
AsyncStorage.getItem('course', (err, result) => {
 
  if(result == "notselected" || result == null){
    course = [0]
  }else if(result == "basic"){
    course = [1]
  }else if(result == "advanced"){
    course = [2]
  }
})
export default class Main1 extends Component { 

constructor(props) { 
    super(props)  
    this.state = {
      time: "",
      isDateTimePickerVisible: false,
      fireDate: '',
			update: '',
			futureFireDate: '0'
    }
    this.setAlarm = this.setAlarm.bind(this);
   
  }

  // 알람세팅 - 시간의 경우 this.state.time에서 가져옴, 매일
  setAlarm = (hour, minutes) => {
    var date = new Date()
    var year = date.getFullYear();
    var month = date.getMonth()+1
    var day = date.getDate();
    console.log(month+'/'+day+'/'+year+' '+this.state.time)
    if(new Date(month+'/'+day+'/'+year+' '+hour+":"+minutes+":00") - new Date() < 0){
      day = date.getDate()+1;
      console.log("previous time setting!!")
    }
    month = Platform.OS == 'ios' ? month-1 : month
    console.log(year+"/"+month+"/"+day+"/"+hour+"/"+minutes)
    if(Platform.OS == 'ios'){
      PushNotificationIOS.scheduleLocalNotification({
        alertTitle:"거룩한독서 알람",
        alertBody: "거룩한 독서를 할 시간입니다. 하느님의 말씀을 들어보세요.", // (required)
  // fireDate: new Date(2019,3,5,14,24,0).toISOString(), // in 60 secs
       fireDate:new Date(year, month, day, hour, minutes, 0).toISOString(),
        repeatInterval: 'day'
      });
    }else{
      PushNotification.localNotificationSchedule({
        id: '123',
        message: "거룩한 독서를 할 시간입니다. 하느님의 말씀을 들어보세요.", // (required)
        date: new Date(month+'/'+day+'/'+year+' '+this.state.time), // in 60 secs
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        playSound: true, // (optional) default: true
        repeatType: 'day'
      });
    } 


  };
  
  // notification 세팅
	componentDidMount() {
		DeviceEventEmitter.addListener('OnNotificationDismissed', async function(e) {
			const obj = JSON.parse(e);
			console.log(`Notification ${obj.id} dismissed`);
		});
		
		DeviceEventEmitter.addListener('OnNotificationOpened', async function(e) {
			const obj = JSON.parse(e);
			console.log(obj);
		});
  }
  

componentWillMount(){
  if(Platform.OS == "ios"){
    PushNotificationIOS.requestPermissions()
  }else{
    PushNotification.requestPermissions()
  }
  
  //textSize 가져오기
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
  // alarm1 가져와서 시간 세팅
  AsyncStorage.getItem('alarm1', (err, result) => {
    console.log(result)
    if(result != null){
      this.setState({time:result})
    }    
  })

}

// 알람설정시 시계보이기 / 안보이기 / 시간설정 함수
  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);

   var year = date.getFullYear();
   var month = date.getMonth()+1
   var day = date.getDate();
   var hour = date.getHours()
   var minutes = date.getMinutes()
   if(month < 10){
       month = "0"+month;
   }
   if(day < 10){
       day = "0"+day;
   } 
   if(hour < 10){
    hour = "0"+hour
  }
  if(minutes < 10){
    minutes = "0"+minutes
  }
  console.log(day+"-"+month+"-"+year+" "+hour +":"+ minutes +":00")
  // time setting 및 알람 세팅하기, alarm1 에 값 저장하기
  this.setState({time:hour +":"+ minutes +":00",  fireDate:day+"-"+month+"-"+year+" "+hour +":"+ minutes +":00"})
  this.setAlarm(hour, minutes)
  try {
    AsyncStorage.setItem('alarm1', hour +":"+ minutes +":00");      
  } catch (error) {
    console.error('AsyncStorage error: ' + error.message);
  }
  this._hideDateTimePicker();
  };

// 알람 삭제하기
stopAlarm1(){  
  if(Platform.OS == "ios"){
    PushNotificationIOS.cancelAllLocalNotifications();
  }else{
    PushNotification.cancelLocalNotifications({id: '123'})
  }
  this.setState({ time: '' });
  try{
  AsyncStorage.setItem('alarm1', "")
  } catch (error) {
    console.error('AsyncStorage error: ' + error.message);
  }
}

setChanges(){
  //textSize 가져오기
  AsyncStorage.getItem('textSize', (err, result) => {
    if(result == "normal" || result == null){
      textSize = [0]
      normalSize = {fontSize:15}
      largeSize = {fontSize:17}      
      this.setState({reload:true})
    }else if(result == "large"){
      textSize = [1]
      normalSize = {fontSize:17}
      largeSize = {fontSize:19}
      this.setState({reload:true})
    }else if(result == "larger"){
      textSize = [2]
      normalSize = {fontSize:19}
      largeSize = {fontSize:21}
      this.setState({reload:true})
    }
  })
  // alarm1 가져와서 시간 세팅
  AsyncStorage.getItem('alarm1', (err, result) => {
    console.log(result)
    if(result != null){
      this.setState({time:result})
    }    
  })

  
// course 값 가져와서 course value 삽입
AsyncStorage.getItem('course', (err, result) => {
 
  if(result == "notselected" || result == null){
    course = [0]
    this.setState({reload:true})
  }else if(result == "basic"){
    course = [1]
    this.setState({reload:true})
  }else if(result == "advanced"){
    course = [2]
    this.setState({reload:true})
  }
})
}
 
setChange(selectedValues){    
  // 새로 보이기할때 및 값 세팅할때 
  // 값 세팅할때
  try {
    if(selectedValues == "보통"){
      AsyncStorage.setItem('textSize', 'normal');
    }else if(selectedValues == "크게"){
      AsyncStorage.setItem('textSize', 'large');
    }else if(selectedValues == "매우크게"){
      AsyncStorage.setItem('textSize', 'larger');
    }else if(selectedValues == "말씀새기기"){
      AsyncStorage.setItem('course', 'basic');
    }else if(selectedValues == "거룩한독서"){
      AsyncStorage.setItem('course', 'advanced');
    }else if(selectedValues == "미선택"){
      AsyncStorage.setItem('course', 'notselected');
    }
    var result  = selectedValues;
    if(result == "보통" || result == null){
      normalSize = {fontSize:15}
      largeSize = {fontSize:17}
    }else if(result == "크게"){
      normalSize = {fontSize:17}
      largeSize = {fontSize:19}
    }else if(result == "매우크게"){
      normalSize = {fontSize:19}
      largeSize = {fontSize:21}
    }
    
    this.setState({reload:true})
  } catch (error) {
    console.error('AsyncStorage error: ' + error.message);
  }
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
  <View style={{flex:1}}>    
    <NavigationEvents
      onWillFocus={payload => {
          this.setChanges();   
      }}
      /> 
      <TouchableOpacity
      activeOpacity = {0.9}
      style={{backgroundColor: '#01579b', padding: 10}}
      onPress={() =>  this.props.navigation.navigate('Main5')} 
      >
        <Text style={{color:"#FFF", textAlign:'left'}}>
            {"<"} 뒤로
        </Text>
      </TouchableOpacity>  
      <Text style={[{marginTop:20, marginBottom:10, textAlign:'center'},normalSize]}>글씨크기 선택</Text>      
      <SelectMultipleGroupButton
        multiple={false}
        group={[
          { value: '보통' },
          { value: '크게' },
          { value: '매우크게' }]}
        defaultSelectedIndexes={textSize}
        buttonViewStyle={{ flex: 1, margin: 0, borderRadius: 0 }}
        highLightStyle={{
          borderColor: '#01579b', textColor: '#01579b', backgroundColor: '#fff',
          borderTintColor: '#01579b', textTintColor: 'white', backgroundTintColor: '#01579b'
        }}
        onSelectedValuesChange={(selectedValues) => this.setChange(selectedValues)}
      />

      <Text style={[{marginTop:30, marginBottom:10, textAlign:'center'},normalSize]}>말씀새기기 / 거룩한독서 선택</Text>    
      <SelectMultipleGroupButton
        multiple={false}
        group={[
          { value: '미선택' },
          { value: '말씀새기기' },
          { value: '거룩한독서' }]}
        defaultSelectedIndexes={course}
        buttonViewStyle={{ flex: 1, margin: 0, borderRadius: 0 }}
        highLightStyle={{
          borderColor: '#01579b', textColor: '#01579b', backgroundColor: '#fff',
          borderTintColor: '#01579b', textTintColor: 'white', backgroundTintColor: '#01579b'
        }}
        onSelectedValuesChange={(selectedValues) => this.setChange(selectedValues)}
      />
      <Text style={{margin:5, fontSize:14}}>* 말씀새기기 / 거룩한독서를 선택하시면 거룩한 독서를 할때 선택창이 뜨지 않습니다.</Text>
     
      <Text style={[{marginTop:30, marginBottom:10, textAlign:'center'},normalSize]}>거룩한독서 알람 세팅</Text>
      <View style={{width:'100%',  justifyContent: 'center',  alignItems: 'center', marginBottom:10}}>
        <TouchableOpacity 
        style={[styles.Button, {marginTop:0}]}
        onPress={this._showDateTimePicker}>
          <Text style={{color:"#fff", textAlign:'center', fontWeight:'bold'}}>알람 설정 하기</Text>         
        </TouchableOpacity>
      </View>

      <Text style={{margin:5, fontSize:14}}>* 오전에 거룩한 독서를 하면 하루동안 하느님의 말씀을 가지고 평온히 지낼 수 있습니다.</Text>
      <DateTimePicker
        isVisible={this.state.isDateTimePickerVisible}
        onConfirm={this._handleDatePicked}
        onCancel={this._hideDateTimePicker}
        mode={'time'}
        is24Hour={false}
        datePickerModeAndroid	={'spinner'}
      />
      <Text style={{marginTop:10, textAlign:'center', fontSize:17, color:'#01579b'}}>{this.state.time}</Text>
      <View style={this.state.time !=="" ? {marginTop:10} : {display:'none'}}> 
        <TouchableOpacity 
        onPress={()=>this.stopAlarm1()}>
         <Text style={{fontSize:14, textAlign:'center'}}>거룩한독서 알람 해제</Text>         
        </TouchableOpacity>
      </View>    
    </View>
      )
      
  }
}
  
const styles = StyleSheet.create({
    MainContainer :{     
    justifyContent: 'center'
    },
    TextStyle:{color:'#000', textAlign: 'center', width:'100%',marginBottom:3},
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
     
    container: {
    flex: 1,
    backgroundColor:"#fff"
    },
    slider: { height: 120 },
    contentText: { color: '#fff' },
    buttons: {
      zIndex: 1,
      height: 15,
      marginTop: -25,
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    Button:{
      textAlign:'center',
      backgroundColor: '#01579b', 
      padding: 10, 
      marginTop:10,
      width:200,
      borderRadius: 10,
      height:40},
    smallText: {
      color: "#01579b",
      textAlign: 'center', 
      fontSize: 11,
      margin:  5,
      marginTop: 0,
      marginBottom: -5
      },
    });