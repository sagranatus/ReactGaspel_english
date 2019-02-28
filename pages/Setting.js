import React, { Component } from 'react';
 
import { StyleSheet, View, Text, TouchableOpacity, AsyncStorage, ActivityIndicator} from 'react-native';
import { SelectMultipleGroupButton } from 'react-native-selectmultiple-button'
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'
import Slideshow from 'react-native-image-slider-show';
import * as globalStyles from '../etc/global';
import ReactNativeAN from 'react-native-alarm-notification';
import DateTimePicker from 'react-native-modal-datetime-picker';
const fireDate = ReactNativeAN.parseDate(new Date(Date.now() + 10000)); 
const alarmNotifData = {
  id: "12345",                                  // Required
  title: "My Notification Title",               // Required
  message: "My Notification Message",           // Required
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
      isDateTimePickerVisible: false
    }
   
  }
  componentWillMount(){
   
  }
 
  componentWillReceiveProps(nextProps){
     
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  _handleDatePicked = (date) => {
    console.log('A date has been picked: ', date);
   // alert(date.getHours() +"시 "+ date.getMinutes() +"분")
    this.setState({time:date.getHours() +"시 "+ date.getMinutes() +"분"})
    this._hideDateTimePicker();
  };

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
                    <TouchableOpacity
                    activeOpacity = {0.9}
                    style={{backgroundColor: '#01579b', padding: 10}}
                    onPress={() =>  this.props.navigation.navigate('Main5')} 
                    >
                    <Text style={{color:"#FFF", textAlign:'left'}}>
                        {"<"} BACK
                    </Text>
                </TouchableOpacity>  
                <Text style={{margin:20}}>글씨크기</Text>
               
        <SelectMultipleGroupButton
          multiple={false}
          group={[
            { value: '보통' },
            { value: '크게' },
            { value: '매우크게' }]}
          defaultSelectedIndexes={textSize}
          buttonViewStyle={{ flex: 1, margin: 0, borderRadius: 0 }}
          highLightStyle={{
            borderColor: 'green', textColor: 'green', backgroundColor: '#fff',
            borderTintColor: 'green', textTintColor: 'white', backgroundTintColor: 'green'
          }}
          onSelectedValuesChange={(selectedValues) => this.setChange(selectedValues)}
        />

        <TouchableOpacity onPress={this._showDateTimePicker}>
          <Text style={{margin:20}}>주중 렉시오 디비나 알람 세팅 클릭</Text>
        </TouchableOpacity>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this._handleDatePicked}
          onCancel={this._hideDateTimePicker}
          mode={'time'}
          is24Hour={false}
          datePickerModeAndroid	={'spinner'}
        />
         <Text style={{margin:20}}>알람시간 : {this.state.time}</Text>
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
    button: {
      margin: 3,
      width: 15,
      height: 15,
      opacity: 0.9,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonSelected: {
      opacity: 1,
      color: 'red',
    },
    customSlide: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    customImage: {
      flex:1,
      width: '100%',
      height: 80,
      resizeMode: 'contain'
      
    },
    TextResultStyleClass: { 
      textAlign: 'center',
      color: "#000",
      margin:5,
      marginBottom: 7,
       fontSize:14 
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
        },
        smallText: {
          color: "#01579b",
          textAlign: 'center', 
          fontSize: 11,
          margin:  5,
          marginTop: 0,
          marginBottom: -5
         },
    });