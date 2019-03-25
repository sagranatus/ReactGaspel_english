import React, { Component } from 'react';

import { StyleSheet, View, Text, TouchableOpacity, AsyncStorage, ActivityIndicator, TextInput, Button, ScrollView, NetInfo,  Modal, WebView, Linking, Image} from 'react-native';

import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'
import Slideshow from 'react-native-image-slider-show';
import * as globalStyles from '../etc/global';
import ReactNativeAN from 'react-native-alarm-notification';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/EvilIcons'
import Icon3 from 'react-native-vector-icons/Ionicons'
var normalSize;
var largeSize;
var date = new Date();
const alarmNotifData = {
  id: date,                                  // Required
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
  tag: 'some_tag'  ,                  // Date for firing alarm, Required for ReactNativeAN.scheduleAlarm.

  // You can add any additional data that is important for the notification
  // It will be added to the PendingIntent along with the rest of the bundle.
  // e.g.
  data: { foo: "bar" },
};

export const Fonts = {
  mn : "mn"
}
var urls = Array()
export default class Main1 extends Component { 

constructor(props) { 
    super(props)  
    this.state = {
        textSize: "",
        today : "",
        todayDate: "",
        todayDate_show: "",
        sentence: "",
        sentence_weekend: "",
        comment:"",
        js2:"",
        mysentence:"",
        weekend: false,
        position: 1,
        interval: null,
        dataSource: [
        {
          url: 'http://sssagranatus.cafe24.com/resource/slide1.png',
        }, {
          url: 'http://sssagranatus.cafe24.com/resource/slide2.png'
        }, {
          url: 'http://sssagranatus.cafe24.com/resource/slide3.png'
        },
      ], 
      position2: 1,
      interval2: null,
      dataSource2: [
        {
          url: 'http://sssagranatus.cafe24.com/resource/ad1.png'
        }, {
          url: 'http://sssagranatus.cafe24.com/resource/ad2.png'
        }
        
      ],
      initialLoading: true,
      url0: "",
      url1: "",
      url2: "",
      modalVisible: false
    
    }
 
     this.onModalClose = this.onModalClose.bind(this);
    this.onModalOpen = this.onModalOpen.bind(this);
  }
  urlSetting(urls){
    this.setState({reload:true})
  }

  componentWillMount(){
    // slide url 가져오기
    fetch('https://sssagranatus.cafe24.com/servertest/slide.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
      })
    
    }).then((response) => response.json())
      .then((responseJson) => {
        // 성공적으로 값이 있을 경우에 
      if(responseJson.error == false)
        {
          const stack = responseJson.stack
          console.log("Main1 - stacks in slide url : ", stack)
          
              var id, url;
            for(var i=0; i<stack.length; i++){
              id = stack[i][0]
              url = stack[i][1]
              console.log("Main1 - stacks in slide url : ",id+"/"+url)  
              urls.push(url)
            }
            
            console.log(urls[0])
            this.urlSetting(urls)
          
        }else{
          console.log("Main1 - stacks in slide url : ", 'failed')
        }
      }).catch((error) => {
        console.error(error);
      });   

    
   
    AsyncStorage.getItem('textSize', (err, result) => {
      if(result == "normal" || result == null){
        normalSize = {fontSize:16}
        largeSize = {fontSize:17}
      }else if(result == "large"){
        normalSize = {fontSize:17}
        largeSize = {fontSize:19}
      }else if(result == "larger"){
        normalSize = {fontSize:19}
        largeSize = {fontSize:21}
      }
    })
    
    // 오늘날짜 구하기
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
    var today = year+"-"+month+"-"+day; // 오늘날짜 세팅
    console.log(today)
    var todayShow =  year+"년"+month+"월"+day+"일";
  
    // 일요일날짜 구하기
    if(date.getDay() !== 0){ // 일요일인 경우에는 그대로 값을 가져옴 
      var lastday = date.getDate() - (date.getDay() - 1) - 1;
      date = new Date(date.setDate(lastday));
    }else{
      var lastday = date.getDate()
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
    var weekend = year+"-"+month+"-"+day;


    // 오늘날짜와 일요일 날짜를 설정 
    try {
      AsyncStorage.setItem('today1', today);
      AsyncStorage.setItem('weekend1', weekend);
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }

    this.setState({today: today, todayDate_show:todayShow})
    this.props.getGaspel(today)  
 
    // 일요일인 경우는 값을 가져오지 않는다. 그리고 weekend true로 준다.
    var date = new Date();
    if(date.getDay() !== 0){
      this.props.getGaspel(weekend) 
    }else{
      this.setState({weekend:true})
    }
   

  }

  componentDidMount(){
    // slideshow interval setting
    this.setState({
      interval: setInterval(() => {
        this.setState({
          position: this.state.position === this.state.dataSource.length ? 0 : this.state.position + 1
        });
      }, 5000),
      interval2: setInterval(() => {
        this.setState({
          position2: this.state.position2 === this.state.dataSource2.length ? 0 : this.state.position2 + 1
        });
      }, 2000)
    });
  }

  componentWillUnmount(){
    clearInterval(this.state.interval2);
    clearInterval(this.state.interval);
  }
  logOut(){
    this.props.setLogout()
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.gaspels.comment != this.props.gaspels.comment){
      // comment값이 달라질때는 아무것도 하지 않는다.
    }else{
      if(nextProps.status.isLogged == this.props.status.isLogged){
        console.log(nextProps.gaspels.sentence) 
        console.log(nextProps.gaspels.thisdate) 

        // 오늘날짜인 경우에는 값 가져오기
        if(nextProps.gaspels.created_at == this.state.today){
          var contents = nextProps.gaspels.contents
          var start = contents.indexOf("✠");
          var end = contents.indexOf("◎ 그리스도님 찬미합니다");
          contents = contents.substring(start, end);
          // 몇장 몇절인지 찾기
          var pos = contents.match(/\d{1,2},\d{1,2}-\d{1,2}/);
          if(pos == null){
              pos = contents.match(/\d{1,2},\d{1,2}.*-\d{1,2}/);
          }
          if(pos == null){
              pos = contents.match(/\d{1,2},\d{1,2}-\n\d{1,2}/);
          }
                    
          // 복음사가 가져옴
          var idx_today = contents.indexOf("전한 거룩한 복음입니다.");
          var today_person;
          if(idx_today == -1){
              idx_today = contents.indexOf("전한 거룩한 복음의 시작입니다.");
              today_person = contents.substring(2,idx_today-2); // 복음사 사람 이름
          }else{
              today_person = contents.substring(2,idx_today-2);
          }
  
          var place = today_person+" "+pos
          console.log("place", place)
       
          this.setState({sentence: nextProps.gaspels.sentence, todayDate: nextProps.gaspels.thisdate, place: place})
          
          var date = new Date();
          var changed = this.changeDateFormat(date)
          // 저장된 값을 가져온다.
          this.getData(changed)  
        }else{
          // 주일 내용을 가져온다.
            var contents = nextProps.gaspels.contents
            var start = contents.indexOf("✠");
            var end = contents.indexOf("◎ 그리스도님 찬미합니다");
            contents = contents.substring(start, end);
            // 몇장 몇절인지 찾기
            var pos = contents.match(/\d{1,2},\d{1,2}-\d{1,2}/);
            if(pos == null){
                pos = contents.match(/\d{1,2},\d{1,2}.*-\d{1,2}/);
            }
            if(pos == null){
                pos = contents.match(/\d{1,2},\d{1,2}-\n\d{1,2}/);
            }
                      
            // 복음사가 가져옴
            var idx_today = contents.indexOf("전한 거룩한 복음입니다.");
            var today_person;
            if(idx_today == -1){
                idx_today = contents.indexOf("전한 거룩한 복음의 시작입니다.");
                today_person = contents.substring(2,idx_today-2); // 복음사 사람 이름
            }else{
                today_person = contents.substring(2,idx_today-2);
            }
    
            var place = today_person+" "+pos
            console.log("place_weekend", place)
            this.setState({sentence_weekend: nextProps.gaspels.sentence, place_weekend: place})
        }
      
      }
    }
  }

   setChange(){  
     //textSize 바뀌는 경우
    AsyncStorage.getItem('textSize', (err, result) => {

      if(result == "normal" || result == null){
        normalSize = {fontSize:16}
        largeSize = {fontSize:17}
      }else if(result == "large"){
        normalSize = {fontSize:17}
        largeSize = {fontSize:19}
      }else if(result == "larger"){
        normalSize = {fontSize:19}
        largeSize = {fontSize:21}
      }
    })
    // today, weekend날짜 정함
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

    if(date.getDay() !== 0){ // 일요일인 경우에는 그대로 값을 가져옴 
      this.setState({weekend:false})
      var lastday = date.getDate() - (date.getDay() - 1) - 1;
      date = new Date(date.setDate(lastday));
    }else{      
      this.setState({weekend:true})
      var lastday = date.getDate()
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
    var weekend = year+"-"+month+"-"+day;

    var date = new Date();
    var changed = this.changeDateFormat(date)
    // 맨 처음 값 가져온 경우는 무조건 getData() 불러옴
    AsyncStorage.getItem('getAll', (err, result) => {
      
      if(result == "start"){        
       this.setState({initialLoading:true})
        try {
          AsyncStorage.setItem('getAll', 'done');
        } catch (error) {
          console.error('AsyncStorage error: ' + error.message);
        } 
        this.getData(changed) 
      }  

    })

    // today1이 변경되거나 refreshMain1인 경우에는 getData()를 다시 불러온다.
    AsyncStorage.getItem('today1', (err, result) => {
      console.log("Main1 - get AsyncStorage today : ", result)
      if(result == today){
        console.log("today is same")
        AsyncStorage.getItem('refreshMain1', (err, result) => {
          console.log("Main1 - get AsyncStorage refresh : ", result)       
          if(result == "refresh"){            
           this.setState({initialLoading:true})
            try {
              var date = new Date();
              var changed = this.changeDateFormat(date)
              this.getData(changed) 
              AsyncStorage.setItem('refreshMain1', 'no');
            } catch (error) {
                console.error('AsyncStorage error: ' + error.message);
            }
          }else{

          }
        });     
        
      }else{       
        // 다시 가져오기      
        this.setState( {dataSource: [
          {
            url: 'http://sssagranatus.cafe24.com/resource/slide1.png',
          }, {
            url: 'http://sssagranatus.cafe24.com/resource/slide2.png',
          }, {
            url: 'http://sssagranatus.cafe24.com/resource/slide3.png',
        }]}) 
        this.setState({initialLoading:true})
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
    // 마찬가지로 weekend날짜가 같은 경우는 두고, 다른 경우만 주일 값을 가져온다.
    AsyncStorage.getItem('weekend1', (err, result) => {
      console.log("Main1 - get AsyncStorage weekend : ", result)
      if(result == weekend){
        console.log("weekend is same")        
      }else{
        console.log("weekend is different")
        try {
            AsyncStorage.setItem('weekend1', weekend);         
            this.props.getGaspel(weekend)
        } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
        }
      }
    })
  }

  getData(today){
    // 오늘 데이터, 일요일 데이터 가져오기
    console.log("Main1 - getData")
    const loginId = this.props.status.loginId 
    var date = new Date()
    console.log(date)
    if(date.getDay() !== 0){ // 일요일인 경우에는 그대로 값을 가져옴 
        var lastday = date.getDate() - (date.getDay() - 1) - 1;
        date = new Date(date.setDate(lastday));
    }else{
      var lastday = date.getDate()
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
   
    db.transaction(tx => {
      tx.executeSql(
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
        ), 
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
setAlarm = () => {
  AsyncStorage.getItem('alarmTime', (err, result) => {
    console.log("alarmTime", result)
    if(result !== null){
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth()+1
      var day = date.getDate()+1;
      if(month < 10){
          month = "0"+month;
      }
      if(day < 10){
          day = "0"+day;
      } 
      const details  = { ...alarmNotifData, fire_date: day+"-"+month+"-"+year+" "+result };     
      ReactNativeAN.scheduleAlarm(details);
    }
  })

};


onModalClose() {
  this.setState({
    modalVisible: false,
    modalUrl: undefined
  });
}

onModalOpen(url) {
  console.log("openmodal open", url)
  if(url != undefined){
    this.setState({
      modalVisible: true,
      modalUrl: url
    });
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
      <ScrollView >
        <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center'}}>  
          <View style={{flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 30, marginTop:10, marginLeft:'1%'}}>
            <Image source={require('../resources/ic_launcher.png')} style={{width: 20, height: 20}} />     
            <Text style={[ styles.TextStyle, {fontSize:17, textAlign:'left', fontFamily:'NanumMyeongjoBold', paddingLeft:3}]}>오늘의복음</Text>
          </View>
          <View style={{flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 30, marginTop:7, marginLeft:'0%'}}>
            <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() => this.props.navigation.navigate('Guide')} // insertComment
                    >        
                    <View>
                      <Text style={[{color:"#000", textAlign:'right', marginRight:10}, {fontSize:14}]}>
                      <Icon3 style={{textAlign:'right'}} name={'ios-information-circle-outline'} size={25} color={"#01579b"} />  
                      </Text>
                    </View>
                
              </TouchableOpacity>
            </View>
          </View>
      <NavigationEvents
          onWillFocus={payload => {
              this.setChange();
          }}
          />
            <View>      
            <Slideshow 
              dataSource={this.state.dataSource}
              position={this.state.position}
              arrowSize={0}
              onPress={(end)=>[console.log(urls[end.index]), this.onModalOpen(urls[end.index])]}
              onPositionChanged={position => this.setState({ position })} />                    
            </View>            
          
            <View style={{flexDirection: "row", height:150, flexWrap: 'wrap', justifyContent: 'center',  paddingBottom:10,  borderBottomColor:"#E8E8E8", borderBottomWidth:6}}>  

              <View style={{flexDirection: "column", flexWrap: 'wrap', width: '30%', height: 20, marginTop:5, marginLeft:'2%'}}>
              <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>{this.state.todayDate_show}</Text>   
              </View>       
              <View style={{flexDirection: "column", flexWrap: 'wrap', width: '66%', height: 20, marginTop:5, marginRight:'2%'}}>
              <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'right', color:'#686868'}]}>{this.state.todayDate}</Text>   
              </View>                         

                <Icon style={{paddingTop:5}} name={'quote-left'} size={13} color={"#000"} />
                <View style={this.state.js2 == "" && this.state.comment == "" ? {width:'100%',justifyContent: 'center', alignItems: 'center'}: {display:'none'}}>
                  <Text style={[normalSize, styles.TextStyle,{padding:5}]}>{this.state.sentence}</Text>   
                  <Text style={[styles.TextStyle, {fontSize:14, borderBottomColor:'#000', borderBottomWidth:1, width:100, marginTop:0}]}>{this.state.place}</Text>
                </View> 
                <View style={this.state.js2 == "" && this.state.comment !== "" ? {width:'100%', paddingBottom:5}: {display:'none'}}>
                  <Text style={[normalSize, styles.TextStyle,{marginTop:10, padding:5, color:'#01579b'}]}>{this.state.comment}</Text>   
                </View>  
                <View style={this.state.js2 !== "" ? {width:'100%', paddingBottom:5}: {display:'none'}}>
                  <Text style={[normalSize, styles.TextStyle,{marginTop:10, padding:5, color:'#01579b'}]}>{this.state.js2}</Text>   
                </View>     

              <TouchableOpacity 
              activeOpacity = {0.9}
              style={this.state.comment == "" && this.state.js2 == "" ? {position: 'absolute', right:10, top:100} : {display:'none'}}
              onPress = {() => this.state.weekend ? this.props.navigation.navigate('Main4') : this.props.navigation.navigate('Main3')}
              >    
                <Icon2 name={'arrow-right'} size={35} color={"#01579b"} />        
            </TouchableOpacity>      
            <TouchableOpacity 
              activeOpacity = {0.9}
              style={this.state.comment !== "" && this.state.js2 =="" ? {position: 'absolute', right:10, top:100} : {display:'none'}}
              onPress = {() => this.props.navigation.navigate('Main3')}
              >    
                <Icon2 name={'arrow-right'} size={35} color={"#01579b"} />  
            </TouchableOpacity>    
            </View>

            <View style={!this.state.weekend ? {flexDirection: "row", height:150, flexWrap: 'wrap', justifyContent: 'center',  paddingBottom:10, borderBottomColor:"#E8E8E8", borderBottomWidth:6}: {display:'none'}}>  
            
                <View style={this.state.mysentence == "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginLeft:'2%'}}>
                <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>한주간 묵상할 구절</Text>   
                </View>    
                <View style={this.state.mysentence !== "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginLeft:'2%'}}>
                <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>주일의 독서</Text>   
                </View>  
                <View style={{flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginRight:'2%'}}>
                <Text style={[ styles.TextStyle, {fontSize:15, textAlign:'right', color:'#686868'}]}></Text>   
                </View>    
              
                  <Icon style={{paddingTop:5}} name={'quote-right'} size={13} color={"#000"} />
                  <Text style={this.state.mysentence == "" ? {display:'none'} : [normalSize, styles.TextStyle,{marginTop:10, padding:5, color:'#01579b'}]}>{this.state.mysentence}</Text>   
                  <Text style={this.state.mysentence == "" ? [normalSize, styles.TextStyle,{padding:5}] : {display:'none'}}>{this.state.sentence_weekend}</Text>
                  <Text style={this.state.mysentence == "" ? [styles.TextStyle, {fontSize:14, borderBottomColor:'#000', borderBottomWidth:1, width:100, marginTop:0}]: {display:'none'}}>{this.state.place_weekend}</Text>   
               

                <TouchableOpacity 
                activeOpacity = {0.9}
                style={this.state.mysentence == "" ? {position: 'absolute', right:10, top:100} : {display:'none'}}
                onPress = {() => this.props.navigation.navigate('Main4')}
                >    
                  <Icon2 name={'arrow-right'} size={35} color={"#01579b"} />        
              </TouchableOpacity>      

            </View>


            <View style={this.state.weekend & this.state.mysentence !== "" ? {flexDirection: "row", height:150, flexWrap: 'wrap', justifyContent: 'center',  paddingBottom:10, borderBottomColor:"#E8E8E8", borderBottomWidth:6}: {display:'none'}}>  
            
            <View style={this.state.mysentence == "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginLeft:'2%'}}>
            <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>한주간 묵상할 구절</Text>   
            </View>   
            
            <View style={{flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginRight:'2%'}}>
            <Text style={[ styles.TextStyle, {fontSize:15, textAlign:'right', color:'#686868'}]}></Text>   
            </View>    
    
            <Icon style={{paddingTop:5}} name={'quote-right'} size={13} color={"#000"} />
            <Text style={[normalSize, styles.TextStyle,{marginTop:10, paddingLeft:20, paddingRight:20, padding:5, color:'#01579b'}]}>{this.state.mysentence}</Text>    
        
           
        </View>
          
            <View>      
            <Slideshow 
              height={70}
            //  indicatorSize={0}
              arrowSize={0}
              dataSource={this.state.dataSource2}
              position={this.state.position2}
              onPress={(end)=>[console.log(urls[end.index+3]), this.onModalOpen(urls[end.index+3])]}
              onPositionChanged={position2 => this.setState({ position2 })} />
              
            </View>
            <View style={{flex:1}}>
            <Modal
              animationType="slide"
              visible={this.state.modalVisible}
              onRequestClose={this.onModalClose}
            >
              <View style={styles.modalContent}>
              <View style={styles.modalButtons}>
              <TouchableOpacity
                  onPress={this.onModalClose}
                  style={styles.closeButton}
                >
                  <Text>뒤로</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={()=>Linking.openURL(this.state.modalUrl)}
                  style={styles.closeButton}
                >
                  <Text>웹으로보기</Text>
                </TouchableOpacity>
              </View>
                <WebView
                  scalesPageToFit
                  source={{ uri: this.state.modalUrl }}
                />
              </View>
            </Modal>
        </View>
      </ScrollView>
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
      justifyContent: 'center',
      flex:1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      margin: 0
    },
    TextStyle:{color:'#000', textAlign: 'center', width:'100%',marginBottom:3},        
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
        Button:{
          backgroundColor: '#01579b', 
          padding: 10, 
          marginBottom:5, 
          width:'100%'},
        modalContent: {
          flex: 1,
          justifyContent: 'center',
          paddingTop: 0,
          backgroundColor: globalStyles.BG_COLOR
        },
        closeButton: {
          paddingVertical: 5,
          paddingHorizontal: 10,
          flexDirection: 'row'
        },
        modalButtons:{
          paddingVertical:5,
          paddingHorizontal:10,
          flexDirection:'row',
          justifyContent:'space-between'
        }
    });