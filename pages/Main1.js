import React, { Component } from 'react';
 
import { StyleSheet, View, Text, TouchableOpacity, Image, ImageBackground, Button} from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'
export default class Main1 extends Component { 

constructor(props) { 
    super(props)  
    this.state = {
        today : "",
        todayDate: "",
        sentence: "",
        todayData: "",
        weekData: "",
        monthData: "",
        todaycount: 0,
        weekend_count: 0,
        month_count: 0
    }
   
  }
  
  componentWillMount(){
    console.log( this.props.navigation)
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
    var todayDate = year+"."+month+"."+day+".";
    console.log(today)
    this.setState({today: today, todayDate: todayDate})
    this.props.getGaspel(today)
   
  
  }
  logOut(){
    this.props.setLogout()
  }

  componentWillReceiveProps(nextProps){
      console.log(nextProps.gaspels.sentence) 
         // 우선적으로 asyncstorage에 로그인 상태 저장
         this.setState({sentence: nextProps.gaspels.sentence})
      
  }

   countData(){
    // 오늘 count 하기
    console.log(this.props.status.loginId)
    console.log(this.state.today)
    const loginId = this.props.status.loginId
    const today = this.state.today
    var today_count = 0
    var date = today.substring(0, 4)+"년 "+today.substring(5, 7)+"월 "+today.substring(8, 10)+"일 "+this.getTodayLabel( new Date(today))
    console.log(date)
   
    db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM comment where date=? and uid = ?',
          [date, loginId],
          (tx, results) => {
            var len = results.rows.length;
          //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Main1 - get Comment data')          
                today_count++       
            } else {
              console.log('Main1 - get Comment data : ', "no value")   
            }
          }
        );

        tx.executeSql(
            'SELECT * FROM lectio where date=? and uid = ?',
            [date, loginId],
            (tx, results) => {
              var len = results.rows.length;
            //  값이 있는 경우에 
              if (len > 0) {                  
                  console.log('Main1 - get Lectio data')    
                  today_count++             
              } else {
                console.log('Main1 - get Lectio data : ', "no value")   
              }

              this.setState({today_count: today_count})
            }
          );
      });  

      //
      this.getWeekendData()
      this.getMonthData()
     
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

  getWeekendData(){
  
    var date_mon = new Date();
    var day = date_mon.getDay(),
        diff = date_mon.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    var monday = new Date(date_mon.setDate(diff));

    var year = monday.getFullYear();
    var month = monday.getMonth()+1
    var day = monday.getDate();
    if(month < 10){
        month = "0"+month;
    }
    if(day < 10){
        day = "0"+day;
    } 
    var date_changed = year+"년 "+month+"월 "+day+"일 "+ this.getTodayLabel( new Date(monday))
    console.log(date_changed)

    this.setState({weekend_count: 0})
    var weekend_count = 0
    
    for(var k=0; k<7; k++){
        
        new Promise((resolve, reject) => {
       
        var diff = monday.getDate() + k
        var date = new Date(new Date().setDate(diff))
        console.log(date)
        var changed = this.changeDateFormat(date)
        console.log(changed)
        const loginId = this.props.status.loginId
     
        db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM comment where uid = ? and date =?',
              [loginId, changed],
              (tx, results) => {
                var len = results.rows.length;
              //  값이 있는 경우에 
                if (len > 0) {                  
                    console.log('Main1 - get Comment data'+changed)  
                    weekend_count++       
                    console.log(weekend_count)        
                } else {
                  console.log('Main1 - get Comment data : ', "no value"+changed)   
                }
              }
            );
    
            tx.executeSql(
                'SELECT * FROM lectio where uid = ? and date =?',
                [loginId, changed],
                (tx, results) => {
                  var len = results.rows.length;
                //  값이 있는 경우에 
                  if (len > 0) {                  
                      console.log('Main1 - get Lectio data'+changed)           
                      weekend_count++      
                      console.log(weekend_count)
                  } else {
                    console.log('Main1 - get Lectio data : ', "no value"+changed)   
                  }       
                  
                  this.setState({weekend_count: weekend_count})
                  
                }
              );
          });  
        }, null, null);
    }
     
     
  }


  getMonthData(){
    
    var date_first = new Date();
    var firstday = new Date(date_first.getFullYear(), date_first.getMonth(), 1);
    console.log(firstday)
    var year = firstday.getFullYear();
    var month = firstday.getMonth()+1
    var day = firstday.getDate();
    if(month < 10){
        month = "0"+month;
    }
    if(day < 10){
        day = "0"+day;
    } 
    var date_changed = year+"년 "+month+"월 "+day+"일 "+ this.getTodayLabel( new Date(firstday))
    console.log(date_changed)

    this.setState({month_count: 0})
    var month_count = 0
    
    for(var k=0; k<32; k++){
        
        new Promise((resolve, reject) => {
       
        var diff = firstday.getDate() + k
        var date = new Date(new Date().setDate(diff))
        console.log(date)
        var changed = this.changeDateFormat(date)
        console.log(changed)
        const loginId = this.props.status.loginId
     
        db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM comment where uid = ? and date =?',
              [loginId, changed],
              (tx, results) => {
                var len = results.rows.length;
              //  값이 있는 경우에 
                if (len > 0) {                  
                    console.log('Main1 - get Comment data'+changed)  
                    month_count++       
                    console.log(month_count)        
                } else {
                  console.log('Main1 - get Comment data : ', "no value"+changed)   
                }
              }
            );
    
            tx.executeSql(
                'SELECT * FROM lectio where uid = ? and date =?',
                [loginId, changed],
                (tx, results) => {
                  var len = results.rows.length;
                //  값이 있는 경우에 
                  if (len > 0) {                  
                      console.log('Main1 - get Lectio data'+changed)           
                      month_count++      
                      console.log(month_count)
                  } else {
                    console.log('Main1 - get Lectio data : ', "no value"+changed)   
                  }       
                  
                  this.setState({month_count: month_count})
                  
                }
              );
          });  
        }, null, null);
    }
     
     
  }

  getTodayLabel(date) {        
    var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');        
    var todayLabel = week[date.getDay()];        
    return todayLabel;
}
  render() {
    
        return (      
            <View>
               <NavigationEvents
                onWillFocus={payload => {
                    this.countData();
                }}
                />                        
                 <Button title="logout" onPress={() =>  this.props.setLogout()} />              
                    <ImageBackground source={require('../resources/first_img1.png')} style={{width: '100%', height: 160}}>
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{color:'#fff', textAlign: 'center', fontSize: 16}}>{this.state.sentence}</Text>
                    </View>
                   </ImageBackground>
                    <Text style= {[styles.TextComponentStyle, {textAlign:'right'}]}>{this.state.todayDate}</Text>    
                    <View style={styles.MainContainer}>
                    <Image source={{uri: 'https://sssagranatus.cafe24.com/resource/firstimg.png'}} style={{width: '100%', height: 130}} />   

                    <View style={{flex:1, flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop: 40}}>
                    <ImageBackground source={require('../resources/first_1_1.png')} style={{width: 120, height: 120}}>
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color:'#fff', textAlign: 'center', fontSize: 26, marginBottom:10}}>{this.state.today_count}</Text> 
                    </View>
                   </ImageBackground>
                 
                   <ImageBackground source={require('../resources/first_1_2.png')} style={{width: 120, height: 120}}>
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color:'#fff', textAlign: 'center', fontSize: 26, marginBottom:10}}>{this.state.weekend_count}</Text> 
                    </View>
                   </ImageBackground>
                
                   <ImageBackground source={require('../resources/first_1_3.png')} style={{width: 120, height: 120}}>
                    <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color:'#fff', textAlign: 'center', fontSize: 26, marginBottom:10}}>{this.state.month_count}</Text> 
                    </View>
                   </ImageBackground>  
                   </View>
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
     
     TextComponentStyle: {
       fontSize: 20,
      color: "#000",
      textAlign: 'center', 
      marginBottom: 15
     }
    });