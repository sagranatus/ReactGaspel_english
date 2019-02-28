import React, { Component } from 'react';
 
import { StyleSheet, View, Text, TouchableOpacity, AsyncStorage, ActivityIndicator} from 'react-native';

import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'
import Slideshow from 'react-native-image-slider-show';
import * as globalStyles from '../etc/global';
import ReactNativeAN from 'react-native-alarm-notification';
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

var normalSize;
var largeSize;
export default class Main1 extends Component { 

constructor(props) { 
    super(props)  
    this.state = {
        textSize: "",
        today : "",
        todayDate: "",
        sentence: "",
        comment:"",
        js2:"",
        js2_weekend:"",
        mysentence:"",
        weekend: false,
        position: 1,
        interval: null,
        dataSource: [
        {
          title: 'Title 1',
          caption: 'Caption 1',
          url: 'http://placeimg.com/640/380/beer',
        }, {
          title: 'Title 2',
          caption: 'Caption 2',
          url: 'http://placeimg.com/640/380/cat',
        }, {
          title: 'Title 3',
          caption: 'Caption 3',
          url: 'http://placeimg.com/640/380/any',
        },
      ], 
      position2: 1,
      interval2: null,
      dataSource2: [
        {
          title: 'Title 1',
          caption: 'Caption 1',
          url: 'http://placeimg.com/640/130/beer',
        }, {
          title: 'Title 2',
          caption: 'Caption 2',
          url: 'http://placeimg.com/640/130/cat',
        }, {
          title: 'Title 3',
          caption: 'Caption 3',
          url: 'http://placeimg.com/640/130/any',
        },
      ],
      initialLoading: true
    }
   
  }
  componentWillMount(){
       
  //  ReactNativeAN.removeAllFiredNotifications()
  //  ReactNativeAN.removeFiredNotification("12345")
   // ReactNativeAN.cancelAllNotifications()
   // ReactNativeAN.sendNotification(alarmNotifData);
   
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
    
    console.log(this.props.navigation)
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1
    var day = date.getDate();
    if(month < 10){
        month = "0"+month;
    }
    if(day < 10){
        day = "0"+day;
    } 
    var today = year+"-"+month+"-"+day;
    console.log(today)

    // 오늘날짜를 설정 
    try {
      AsyncStorage.setItem('today1', today);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }

    this.setState({today: today})
    this.props.getGaspel(today) 
  
  }

  componentDidMount(){
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position: this.state.position === this.state.dataSource.length ? 0 : this.state.position + 1
        });
      }, 3000),
      interval2: setInterval(() => {
        this.setState({
          position2: this.state.position2 === this.state.dataSource2.length ? 0 : this.state.position2 + 1
        });
      }, 2000)
    });
  }

  componentWillUnmount(){
    this.setState({
      today : "",
      todayDate: "",
      sentence: "",
      todayData: "",
      weekData: "",
      monthData: "",
      today_count: 0,
      weekend_count: 0,
      month_count: 0
    })
    clearInterval(this.state.interval);
  }
  logOut(){
    this.props.setLogout()
  }

  componentWillReceiveProps(nextProps){
      console.log(nextProps.gaspels.sentence) 
      console.log(nextProps.gaspels.thisdate) 
      try {
        AsyncStorage.setItem('sentence', nextProps.gaspels.sentence);
        AsyncStorage.setItem('thisdate', nextProps.gaspels.thisdate);
      } catch (error) {
        console.error('AsyncStorage error: ' + error.message);
      }
         // 우선적으로 asyncstorage에 로그인 상태 저장
         this.setState({sentence: nextProps.gaspels.sentence, todayDate: nextProps.gaspels.thisdate})
       
      var date = new Date();
      var changed = this.changeDateFormat(date)
      this.getData(changed)  
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
    })

    this.setState({initialLoading:true})
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1
    var day = date.getDate();
    if(month < 10){
        month = "0"+month;
    }
    if(day < 10){
        day = "0"+day;
    } 
    var today = year+"-"+month+"-"+day;
    AsyncStorage.getItem('today1', (err, result) => {
      console.log("Main1 - get AsyncStorage today : ", result)
      if(result == today){
        console.log("today is same")
        AsyncStorage.getItem('refreshMain1', (err, result) => {
          console.log("Main1 - get AsyncStorage refresh : ", result)
       
          if(result == "refresh"){
            try {
              var changed = this.changeDateFormat(date)
              this.getData(changed) 
              AsyncStorage.setItem('refreshMain1', 'no');
            } catch (error) {
                console.error('AsyncStorage error: ' + error.message);
            }
          }else{
            this.setState({initialLoading:false})

          }
        });     
        
      }else{
        console.log("today is different")
        try {
            AsyncStorage.setItem('today1', today);
           // var changed = this.changeDateFormat(date)
          //  this.getData(changed)
            this.setState({today: today})
            this.props.getGaspel(today)
        } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
        }
      }
    })
   
  }

  getData(today){
    const loginId = this.props.status.loginId 
    var date = new Date()
    console.log(date)
    if(date.getDay() !== 0){ // 일요일인 경우에는 그대로 값을 가져옴 
        var lastday = date.getDate() - (date.getDay() - 1) + 6;
        date = new Date(date.setDate(lastday));
    }    
    var year = date.getFullYear();
    var month = date.getMonth()+1
    var day = date.getDate();
    if(month < 10){
        month = "0"+month;
    }
    if(day < 10){
        day = "0"+day;
    } 
    var date_weekend = year+"-"+month+"-"+day;
   
    var weekenddate = year+"년 "+month+"월 "+day+"일 "+this.getTodayLabel(new Date(date_weekend)) 
    console.log("date", weekenddate+"/"+today)
    if(weekenddate == today){
      this.setState({weekend: true})
    }
    db.transaction(tx => {
    /*  tx.executeSql(
        'SELECT * FROM comment where date = ? and uid = ?',
        [today, loginId],
        (tx, results) => {
          var len = results.rows.length;
        //  값이 있는 경우에 
          if (len > 0) {                  
              console.log('Main1 - check Comment data : ', results.rows.item(0).comment)   
              this.setState({
                  comment: results.rows.item(0).comment
              })
          } else {     
              this.setState({
                  comment: ""
              })                             
          }
        }
      ),
      tx.executeSql(
        'SELECT * FROM lectio where date = ? and uid = ?',
        [today,loginId],
        (tx, results) => {
            var len = results.rows.length;
        //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Main1 - check Lectio data : ', results.rows.item(0).bg1) 
                this.setState({
                    js2 : results.rows.item(0).js2
                })
            } else {               
                this.setState({
                    js2 : ""
                })                   
            }
        }
        ), */
        tx.executeSql(
          'SELECT * FROM weekend where date = ? and uid = ?',
          [weekenddate,loginId],
          (tx, results) => {
              var len = results.rows.length;
          //  값이 있는 경우에 
              if (len > 0) {                  
                  console.log('Main1 - check Weekend data : ', results.rows.item(0).mysentence) 
                  this.setState({
                      mysentence : results.rows.item(0).mysentence,
                      initialLoading:false
                  })
              } else {               
                  this.setState({
                      mysentence : "",
                      initialLoading:false
                  })                   
              }
          }
          )
      /*    tx.executeSql(
            'SELECT * FROM lectio where date = ? and uid = ?',
            [weekenddate,loginId],
            (tx, results) => {
                var len = results.rows.length;
            //  값이 있는 경우에 
                if (len > 0) {                  
                    console.log('Main1 - check Weekend Lectio data : ', results.rows.item(0).js2) 
                    this.setState({
                        js2_weekend : results.rows.item(0).js2,
                        initialLoading:false
                    })
                } else {               
                    this.setState({
                        mysentence : "",
                        initialLoading:false
                    })                   
                }
            }
            ); */
    });    
     
  }

  changeDateFormat(date){
    var year = date.getFullYear();
    var month = date.getMonth()+1
    var day = date.getDate();
    if(month < 10){
        month = "0"+month;
    }
    if(day < 10){
        day = "0"+day;
    } 
    var date_changed = year+"년 "+month+"월 "+day+"일 "+ this.getTodayLabel( new Date(date))
    console.log(date_changed)
    return date_changed
  
  }
 

  getTodayLabel(date) {        
    var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');        
    var todayLabel = week[date.getDay()];        
    return todayLabel;
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
                    this.setChange();   
                }}
                /> 
                   <View>      
                   <Slideshow 
                    dataSource={this.state.dataSource}
                    position={this.state.position}
                    onPositionChanged={position => this.setState({ position })} />                    
                  </View>
                  
                
                  <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop: '6%', marginBottom:'2%'}}>                  
                      <Text style={[{fontSize:14}, styles.TextStyle]}>{this.state.todayDate}</Text>                         
                      <Text style={[normalSize, styles.TextStyle]}>{this.state.sentence}</Text>   
                  </View>

                  <View style={this.state.weekend ? {marginTop:30, marginBottom:30} : {}}>
                  <TouchableOpacity 
                    activeOpacity = {0.9}
                    style={this.state.mysentence == "" ?{backgroundColor: '#01579b', padding: 10, marginBottom:5, width:'100%'} : {display:'none'}}
                    onPress={this.state.mysentence == "" ? () => this.props.navigation.navigate('Main4')  : null} // insertComment
                    >        
                    <View style={this.state.mysentence != "" ? {display:'none'} : {}}>
                      <Text style={{color:"#fff", textAlign:'center'}}>
                          주일의독서하러가기
                      </Text>
                    </View>
                
                  </TouchableOpacity>
                  </View>

                  <View style={this.state.mysentence == "" ? {display:'none'} : {}}>
                  <Text style={styles.smallText}>한주간 묵상할 구절</Text>
                  <Text style={[styles.TextResultStyleClass]}>{this.state.mysentence}</Text>                    
                  </View>
                  <TouchableOpacity 
                    activeOpacity = {0.9}
                    style={{backgroundColor: '#01579b', padding: 10, marginBottom:5, width:'100%', position: 'absolute', bottom:150}}
                    onPress={() => this.props.navigation.navigate('Guide')} // insertComment
                    >        
                    <View>
                      <Text style={[{color:"#fff", textAlign:'center',}, {fontSize:14}]}>
                          오늘의 복음 가이드 보러가기
                      </Text>
                    </View>
                
                  </TouchableOpacity>

                  <View style={{marginTop:0,position: 'absolute', bottom:0,}}>      
                   <Slideshow 
                    height={150}
                    dataSource={this.state.dataSource2}
                    position={this.state.position2}
                    onPositionChanged={position2 => this.setState({ position2 })} />
                    
                  </View>
             
            </View>
        )
       
  }
}
Main1.propTypes = { 
    setLogout: PropTypes.func,
    status: PropTypes.shape({
        isLogged: PropTypes.bool,
        loginId: PropTypes.string
    }),
    getGaspel: PropTypes.func,
    gaspels: PropTypes.object // gaspelaction 결과값
  };
  
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