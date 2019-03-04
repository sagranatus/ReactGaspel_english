import React, { Component } from 'react';
 
import { StyleSheet, View, Text, TouchableOpacity, AsyncStorage, ActivityIndicator,  TextInput, Button,  DeviceEventEmitter } from 'react-native';
import { SelectMultipleGroupButton } from 'react-native-selectmultiple-button'
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'
import Slideshow from 'react-native-image-slider-show';
import * as globalStyles from '../etc/global';
import ReactNativeAN from 'react-native-alarm-notification';
import DateTimePicker from 'react-native-modal-datetime-picker';

var PushNotification = require('react-native-push-notification');

const fireDate = ReactNativeAN.parseDate(new Date(Date.now() + 10000)); 
const alarmNotifData = {
  id: "12345",                                  // Required
  title: "거룩한 독서를 할 시간입니다.",               // Required
  message: "주님의 말씀을 듣는 시간입니다. 놓치지 마세요.",           // Required
  channel: "my_channel_id",                     // Required. Same id as specified in MainApplication's onCreate method
  ticker: "My Notification Ticker",
  auto_cancel: true,                            // default: true
  vibrate: true,
  vibration: 100,                               // default: 100, no vibration if vibrate: false
  small_icon: "ic_launcher",                    // Required
  large_icon: "ic_launcher",
  play_sound: true,
  sound_name: null,                             // Plays custom notification ringtone if sound_name: null
  color: "red",
  schedule_once: true,                          // Works with ReactNativeAN.scheduleAlarm so alarm fires once
  tag: 'some_tag',
  fire_date: fireDate,                          // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm.

  // You can add any additional data that is important for the notification
  // It will be added to the PendingIntent along with the rest of the bundle.
  // e.g.
  data: { foo: "bar" },
};



var textSize;
AsyncStorage.getItem('textSize', (err, result) => {
 
  if(result == "normal" || result == null){
    textSize = [0]
  }else if(result == "large"){
    textSize = [1]
  }else if(result == "larger"){
    textSize = [2]
  }
})
export default class Main1 extends Component { 

constructor(props) { 
    super(props)  
    this.state = {
      time: "",
      isDateTimePickerVisible: false,
      time2: "",
      isDateTimePickerVisible2: false,
      fireDate: '',
			update: '',
			futureFireDate: '0'
    }
    this.setAlarm = this.setAlarm.bind(this);
		this.stopAlarm = this.stopAlarm.bind(this);
   
  }
  
  setAlarm = () => {
    var date = new Date()
    var year = date.getFullYear();
    var month = date.getMonth()+1
    var day = date.getDate();
    console.log(month+'/'+day+'/'+year+' '+this.state.time)
    if(new Date(month+'/'+day+'/'+year+' '+this.state.time) - new Date() < 0){
      day = date.getDate()+1;
    }
    PushNotification.localNotificationSchedule({
      id: '123',
      //... You can use all the options from localNotifications
      message: "거룩한 독서를 할 시간입니다. 하느님의 말씀을 들어보세요.", // (required)
      date: new Date(month+'/'+day+'/'+year+' '+this.state.time), // in 60 secs
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      playSound: true, // (optional) default: true
      repeatType: 'day'
    });

	//	const { fireDate } = this.state;
	//	const details  = { ...alarmNotifData, fire_date: fireDate };
	//	console.log(`alarm set: ${fireDate}`);
	//	this.setState({ update: `alarm set: ${fireDate}` });
	//	ReactNativeAN.scheduleAlarm(details);
  };
  
  
  setAlarm2 = () => {
    var date = new Date()
    if(date.getDay() !== 0){ // 일요일인 경우에는 그대로 값을 가져옴 
      var lastday = date.getDate() - (date.getDay() - 1) + 6;
      console.log(lastday)
      date = new Date(date.setDate(lastday));
  }    
    var year = date.getFullYear();
    var month = date.getMonth()+1
    var day = date.getDate();
    console.log(month+'/'+day+'/'+year+' '+this.state.time2)
    if(new Date(month+'/'+day+'/'+year+' '+this.state.time2) - new Date() < 0){
      day = date.getDate()+7;
    }
    PushNotification.localNotificationSchedule({
      id: '456',
      //... You can use all the options from localNotifications
      message: "주일의 독서를 할 시간입니다. 하느님의 말씀을 들어보세요.", // (required)
      date: new Date(month+'/'+day+'/'+year+' '+this.state.time2), // in 60 secs
      vibrate: true, // (optional) default: true
      vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
      playSound: true, // (optional) default: true
      soundName:'alarm.mp3',
      repeatType: 'week'
    });

		const { fireDate } = this.state;
		const details  = { ...alarmNotifData, fire_date: fireDate };
		console.log(`alarm set: ${fireDate}`);
		this.setState({ update: `alarm set: ${fireDate}` });
	//	ReactNativeAN.scheduleAlarm(details);
	};
	stopAlarm = () => {
		this.setState({ update: '' });
		ReactNativeAN.stopAlarm();
	};

  
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
    AsyncStorage.getItem('alarm1', (err, result) => {
      this.setState({time:result})
    })

    AsyncStorage.getItem('alarm2', (err, result) => {
      this.setState({time2:result})
    })
  }
 
  componentWillReceiveProps(nextProps){
     
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
   // alert(date.getHours() +"시 "+ date.getMinutes() +"분")

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
  this.setState({time:hour +":"+ minutes +":00",  fireDate:day+"-"+month+"-"+year+" "+hour +":"+ minutes +":00"})
    this.setAlarm()
    try {
      AsyncStorage.setItem('alarm1', hour +":"+ minutes +":00");      
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
    this._hideDateTimePicker();
  };


  _showDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: true });

  _hideDateTimePicker2 = () => this.setState({ isDateTimePickerVisible2: false });

  _handleDatePicked2 = (date) => {
    console.log('A date has been picked: ', date);
   // alert(date.getHours() +"시 "+ date.getMinutes() +"분")

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
  this.setState({time2:hour +":"+ minutes +":00"})
    this.setAlarm2()    
    try {
      AsyncStorage.setItem('alarm2', hour +":"+ minutes +":00");      
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
    this._hideDateTimePicker2();
  };

  stopAlarm1(){
    PushNotification.cancelLocalNotifications({id: '123'})
    this.setState({ time: '' });
    try{
    AsyncStorage.setItem('alarm1', "")
   } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }
  stopAlarm2(){
    PushNotification.cancelLocalNotifications({id: '456'})
    this.setState({ time2: '' });
    try{
    AsyncStorage.setItem('alarm2', "")
   } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }
  setChange(selectedValues){    
    try {
      if(selectedValues == "보통"){
        AsyncStorage.setItem('textSize', 'normal');
      }else if(selectedValues == "크게"){
        AsyncStorage.setItem('textSize', 'large');
      }else if(selectedValues == "매우크게"){
        AsyncStorage.setItem('textSize', 'larger');
      }
      
    
    //  AsyncStorage.getItem('textSize', (err, result) => {
       // alert("change"+result) 
     // })
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }
  }

  render() {
    
    const { update, fireDate, futureFireDate } = this.state;
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
                    this.setChange();   
                }}
                /> 
        
                    <TouchableOpacity
                    activeOpacity = {0.9}
                    style={{backgroundColor: '#01579b', padding: 10}}
                    onPress={() =>  this.props.navigation.navigate('Main5')} 
                    >
                    <Text style={{color:"#FFF", textAlign:'left'}}>
                        {"<"} BACK
                    </Text>
                </TouchableOpacity>  
                <Text style={{margin:20, fontSize:16, textAlign:'center'}}>글씨크기 선택</Text>
               
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

        <TouchableOpacity 
         style={[styles.Button, {marginTop:40}]}
        onPress={this._showDateTimePicker}>
          <Text style={{color:"#fff", textAlign:'center', fontSize:15}}>거룩한독서(평일) 알람 세팅 클릭</Text>         
        </TouchableOpacity>
        <Text style={{margin:2, fontSize:14}}>* 오전에 거룩한 독서를 하면 하루동안 하느님의 말씀을 가지고 평온히 지낼 수 있습니다.</Text>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode={'time'}
          is24Hour={false}
          datePickerModeAndroid	={'spinner'}
        />
         <Text style={{marginTop:20}}>알람시간 : {this.state.time}</Text>
         <TouchableOpacity 
        style={{marginTop:20}}
        onPress={()=>this.stopAlarm1()}>
          <Text style={{fontSize:15}}>거룩한독서 알람 해제</Text>         
        </TouchableOpacity>

         <TouchableOpacity 
        style={[styles.Button, {marginTop:20}]}
        onPress={this._showDateTimePicker2}>
          <Text style={{color:"#fff", textAlign:'center', fontSize:15}}>주일의독서 알람 세팅 클릭</Text>         
        </TouchableOpacity>
        <Text style={{margin:2, fontSize:14}}>* 일요일 밤에 주일의독서를 하면 한주간 말씀을 묵상할 수 있습니다.</Text>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible2}
          onConfirm={this._handleDatePicked2}
          onCancel={this._hideDateTimePicker2}
          mode={'time'}
          is24Hour={false}
          datePickerModeAndroid	={'spinner'}
        />
         <Text style={{marginTop:20}}>알람시간 : {this.state.time2}</Text>
         <TouchableOpacity   
        style={{marginTop:20}}
        onPress={()=>this.stopAlarm2()}>
          <Text style={{fontSize:15}}>주일의독서 알람 해제</Text>         
        </TouchableOpacity>
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
      backgroundColor: '#01579b', 
      padding: 10, 
      marginBottom:5, 
      width:'100%'},
    smallText: {
      color: "#01579b",
      textAlign: 'center', 
      fontSize: 11,
      margin:  5,
      marginTop: 0,
      marginBottom: -5
      },
    });