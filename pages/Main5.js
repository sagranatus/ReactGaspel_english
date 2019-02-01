import React, { Component } from 'react';
 
import { StyleSheet, View, Button, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity} from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {NavigationEvents} from 'react-navigation'

export default class Main5 extends Component { 
 
constructor(props) { 
    super(props)   
    
    this.state = {
        hi : "",
        Today : "",
        selectedDate: "",
        selectedDay: false, 
        selectedDate_format: "",// 요일
        onesentence: "",
        Comment: "",
        bg1:"",
        bg2:"",
        bg3:"",
        sum1:"",
        sum1:"",
        js1:"",
        js2:"",
        mysentence: "",
        mythought: "",
        buttonStatus: "sentence",
        showButton1: false,
        showButton2: false
    }
    this.onselectDate= this.onselectDate.bind(this);
  }
  
 
  componentWillMount(){
    console.log("Main5 - componentWillMount")
    LocaleConfig.locales['kr'] = {
      monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
      monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
      dayNames: ['일','월','화','수','목','금','토'],
      dayNamesShort: ['일','월','화','수','목','금','토']
    };
    
    LocaleConfig.defaultLocale = 'kr';
    // 오늘 날짜로 캘린더 가져오기
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
    this.setState({Today: today, selectedDate: today})
    // 오늘 값을 가져온다
    this.onselectDate(null, today)
    this.getAllPoints()   
}

getAllPoints(){
  console.log("Main5 - getallpoints")
   // 날짜에 맞는 Comment값 모두 가져오기
     //comment있는지 확인    
     db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM comment where uid = ?',
        [this.props.status.loginId],
        (tx, results) => {
          var len = results.rows.length;
        //  값이 있는 경우에 
          if (len > 0) {     
              console.log("Main5 - get Comments data")    
              var year_site = results.rows.item(0).date.indexOf("년");
              var month_site = results.rows.item(0).date.indexOf("월");
              var day_site = results.rows.item(0).date.indexOf("일");
              var year, month, day, date
             
              var commentDates = new Array()
              for(var i=0; i<results.rows.length; i++){
                year = results.rows.item(i).date.substring(0, year_site);
                month = results.rows.item(i).date.substring(year_site+2, month_site);
                day = results.rows.item(i).date.substring(month_site+2, day_site);
                
                date = year+"-"+month+"-"+day
                commentDates.push(date);
              }
              console.log('Main5 - get Comments data : ', commentDates)
              this.commentFunc(commentDates)             
                         
          } else {                  
            console.log('Main5 - get Comments data : ', "no value")            
          }
        }
      );
    });  

     //lectio있는지 확인    
   db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM lectio where uid = ?',
      [this.props.status.loginId],
      (tx, results) => {
        var len = results.rows.length;
      //  값이 있는 경우에 
        if (len > 0) {                  
            console.log('Main5 - get Lectios data')             
            var year_site = results.rows.item(0).date.indexOf("년");
            var month_site = results.rows.item(0).date.indexOf("월");
            var day_site = results.rows.item(0).date.indexOf("일");
            var year, month, day, date
           
            var lectioDates = new Array()
            for(var i=0; i<results.rows.length; i++){
              year = results.rows.item(i).date.substring(0, year_site);
              month = results.rows.item(i).date.substring(year_site+2, month_site);
              day = results.rows.item(i).date.substring(month_site+2, day_site);
             
              date = year+"-"+month+"-"+day
              lectioDates.push(date);
            } 
            console.log('Main5 - get Lectios data : ',lectioDates) 
            this.lectioFunc(lectioDates)            
         
            
        } else {
          console.log('Main5 - get Lectios data : ', "no value")   
          this.lectioFunc("")                        
        }
      }
    );
  });  
}
componentWillReceiveProps(nextProps){
  // 새로운 값 저장 후 뒤로에서 값 전달 및 새로고침
  const { params } = nextProps.navigation.state;
    if(params != null){
      console.log("Main5 - mavigation params existed : ",params.otherParam)
      this.onselectDate(null, params.otherParam)
      this.getAllPoints()
    }  
}

commentFunc = (commentDates) => {
  console.log("Main5 - commentFunc")
  var obj = commentDates.reduce((c, v) => Object.assign(c, {[v]: {customStyles: {
        container: {
          backgroundColor: '#87CEEB',
        },text: {
        color: '#fff'
      }}, marked: true, dotColor: 'red', activeOpacity: 0}}), {});
  this.setState({ CommentMarked : obj});
 }

 lectioFunc = (lectioDates) => {
  console.log("Main5 - lectioFunc")
  var result
  if(lectioDates != ""){
    var obj = lectioDates.reduce((c, v) => Object.assign(c, {[v]: {customStyles: {
      container: {
        backgroundColor: '#01579b',
      },
      text: {
        color: '#fff'
      },}, marked: true, dotColor: 'blue', activeOpacity: 0}}), {});
    if(this.state.CommentMarked != undefined){
      result = Object.assign(this.state.CommentMarked, obj);
    }else{
      result = obj
    }   
  }else{
    result = this.state.CommentMarked
    console.log("Main5 - results of points : ", result)
  } 
  this.setState({ Marked : result});
 }

 
 onselectDate(day, today){
   if(day != null){
     console.log("nono")
     this.setState({Today: day})
   }
  this.setState({buttonStatus: "sentence"})
  console.log("Main5 - onselectDate")
  var date
  if(today != null){  
    console.log("Main5 - onselectDate date : ", today)
    date = today.substring(0, 4)+"년 "+today.substring(5, 7)+"월 "+today.substring(8, 10)+"일 "+this.getTodayLabel( new Date(today))
    
  }else{
    console.log("Main5 - onselectDate date : ", day)
     if(day.month < 10){
      day.month = "0"+day.month;
    }
    if(day.day < 10){
      day.day = "0"+day.day;
    } 
  
    
    var date_format = day.year+"-"+day.month+"-"+day.day;
    this.setState({
      selectedDate: date_format,
      selectedDay: this.getTodayLabel( new Date(date_format)) == "일요일" ? true : false
    })
    date = day.year+"년 "+day.month+"월 "+day.day+"일 "+this.getTodayLabel( new Date(date_format))       
  }

  this.setState({
    selectedDate_format: date
  })
 
  console.log("Main5 - onselectDate date changed : ", date)
    //comment있는지 확인    
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM comment where date = ? and uid = ?',
          [date,this.props.status.loginId],
          (tx, results) => {
            var len = results.rows.length;
          //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Main5 - comment data : ', results.rows.item(0).comment)   
                this.setState({
                  Comment: results.rows.item(0).comment,
                  onesentence: results.rows.item(0).onesentence,
                  showButton1: true,
                  showButton2: true
                })
            } else {  
              this.setState({
                Comment: "",
                onesentence: "",
                showButton1: false,
                showButton2: false
              })                                
            }
          }
        );

        tx.executeSql(
          'SELECT * FROM lectio where date = ? and uid = ?',
          [date,this.props.status.loginId],
          (tx, results) => {
            var len = results.rows.length;
          //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Main5 - lectio data : ', results.rows.item(0).bg1)   
            this.setState({
                bg1:results.rows.item(0).bg1,
                bg2:results.rows.item(0).bg2,
                bg3:results.rows.item(0).bg3,
                sum1:results.rows.item(0).sum1,
                sum2:results.rows.item(0).sum2,
                js1:results.rows.item(0).js1,
                js2:results.rows.item(0).js2,
                onesentence: results.rows.item(0).onesentence,
                showButton1: true,
                showButton2: true
              })
            } else {          
              this.setState({
                bg1:"",
                bg2:"",
                bg3:"",
                sum1:"",
                sum2:"",
                js1:"",
                js2:"",
                showButton3: false
              })        
              if(this.state.Comment == ""){
                this.setState({
                  onesentence: "",
                  showButton1: false
                })     
              }                
            }
          }
        );

        if(date.includes("일요일")){
          tx.executeSql(
            'SELECT * FROM weekend where date = ? and uid = ?',
            [date,this.props.status.loginId],
            (tx, results) => {
              var len = results.rows.length;
            //  값이 있는 경우에 
              if (len > 0) {                  
                  console.log('Main5 - weekend data : ', results.rows.item(0).mysentence)   
              this.setState({
                  mysentence:results.rows.item(0).mysentence,
                  mythought:results.rows.item(0).mythought
                })
              } else {          
                          
              }
            }
          );
        }else{
          this.setState({
            mysentence:"",
            mythought:""
          })  
        }
      
      });    
    

    }
  
  sayHi(){
    alert("hi")
    this.setState({hi: "hi"});
  }
  
  getTodayLabel(date) {        
    var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');        
    var todayLabel = week[date.getDay()];        
    return todayLabel;
}

  render() {    
    console.log("Main5 - render")   
        return (      
          
          <View>
              <NavigationEvents
                onWillFocus={payload => {
                    console.log("will focus", payload);
                }}
                />
          <Calendar
           markingType={'custom'}
            firstDay={1}
            current={this.state.Today}
            pastScrollRange={24}
            futureScrollRange={24}
            horizontal
            pagingEnabled
          // onDayPress={this.onModalClose}
          onDayPress={day=>this.onselectDate(day, null)}
            style={{borderBottomWidth: 1, borderBottomColor: 'black'}}
          /*  markedDates={{
            // '2019-01-16': {selected: true, marked: true, selectedColor: 'blue'},
            //  '2019-01-17': {marked: true},
              '2019-01-18': {marked: true, dotColor: 'red', activeOpacity: 0},
            // '2019-01-19': {disabled: true, disableTouchEvent: true}
            }}*/
            markedDates={this.state.Marked}             
            onPressArrowLeft={substractMonth => substractMonth()}
            onPressArrowRight={addMonth => addMonth()}
          />

           <Text style={{ color: "#01579b", textAlign: 'center', fontSize:15, marginTop:20 }}>{this.state.selectedDate_format}</Text>


           <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', height: 50}}>
            <TouchableHighlight 
            style={this.state.showButton1 == true ? {} : {display:'none'}}
            onPress={()=>this.setState({buttonStatus: "sentence"})}
            underlayColor = {"#fff"}>
              <Image source={this.state.buttonStatus=="sentence" ? require('../resources/slide1.png') : require('../resources/slide1_off.png')} style={{width: 30, height: 30, margin:10}} />
            </TouchableHighlight>
            <TouchableHighlight 
            style={this.state.showButton2 == true && !this.state.selectedDay ? {} : {display:'none'}}
            onPress={()=>this.setState({buttonStatus: "comment"})}
            underlayColor = {"#fff"}>
              <Image source={this.state.buttonStatus=="comment" ? require('../resources/slide2.png') : require('../resources/slide2_off.png')} style={{width: 30, height: 30, margin:10}} />
            </TouchableHighlight>
            <TouchableHighlight 
            style={this.state.showButton2 == true ? {} : {display:'none'}}
            onPress={()=>this.setState({buttonStatus: "lectio"})}
            underlayColor = {"#fff"}>
              <Image source={this.state.buttonStatus=="lectio" ? require('../resources/slide3.png') : require('../resources/slide3_off.png')} style={{width: 30, height: 30, margin:10}} />
            </TouchableHighlight>
            </View>
          
          <View style={this.state.buttonStatus == "sentence" && this.state.onesentence !== "" ? {} : {display:'none'}}>   
            <Text style={styles.smallText}>그날의 복음 말씀</Text>     
            <Text style={{color: "#01579b", textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginTop:20}}>{this.state.onesentence}</Text>              
          </View>

          <View style={this.state.buttonStatus == "comment" ? {} : {display:'none'}}>   
            
            <View style={!this.state.selectedDay && this.state.Comment!="" ? {} : {display:'none'}}>
            <Text style={styles.smallText}>말씀새기기</Text>   
            <Text style={{ fontSize: 14, color: "#000", marginTop: 10, marginBottom: 10, textAlign: 'center'}}>{this.state.Comment}</Text>
            <TouchableOpacity 
              activeOpacity = {0.9}
              style={{backgroundColor: '#01579b', padding: 10}}
              onPress={() =>  this.props.navigation.navigate('Main2_2', {otherParam: this.state.selectedDate}) } 
              >
              <Text style={{color:"#fff", textAlign:'center'}}>
              말씀새기기 편집
              </Text>
            </TouchableOpacity>
            </View>

            <View style={!this.state.selectedDay && this.state.Comment=="" ? {} : {display:'none'}}>
              <TouchableOpacity 
                activeOpacity = {0.9}
                style={{backgroundColor: '#01579b', padding: 10}}
                onPress={() =>  this.props.navigation.navigate('Main2_2', {otherParam: this.state.selectedDate}) } 
                >
                <Text style={{color:"#fff", textAlign:'center'}}>
                말씀새기기 하러가기
                </Text>
              </TouchableOpacity>
              
              </View>    
           
          </View>
            
          <ScrollView style={this.state.buttonStatus == "lectio" ? {marginBottom:180} : {display:'none'}}>   
          <Text style={this.state.mysentence == ""  && this.state.js2!="" ? styles.smallText : {display:'none'}}>거룩한 독서</Text> 
          <Text style={this.state.mysentence !== "" && this.state.js2!="" ? styles.smallText : {display:'none'}}>주일의 독서</Text>  
          <View style={this.state.js2 !== "" ? {} : {display:'none'}}>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>이 복음의 등장인물은</Text> {this.state.bg1}</Text>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>장소는</Text> {this.state.bg2}</Text>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>시간은</Text> {this.state.bg3}</Text>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>이 복음의 내용을 간추리면</Text> {this.state.sum1}</Text>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>특별히 눈에 띄는 부분은</Text> {this.state.sum2}</Text>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>이 복음에서 보여지는 예수님은</Text> {this.state.js1}</Text>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>결과적으로 이 복음을 통해 예수님께서 내게 해주시는 말씀은</Text> "{this.state.js2}"</Text>
          </View>
          <Text style={this.state.mysentence !== "" ? styles.lectioText : {display:'none'}}><Text style={{color:"#495057"}}>주일 복음에서 묵상한 구절은</Text> {this.state.mysentence}</Text>

            <View style={!this.state.selectedDay && this.state.bg1!="" ? {} : {display:'none'}}>
            <TouchableOpacity 
                activeOpacity = {0.9}
                style={{backgroundColor: '#01579b', padding: 10, marginTop: 20}}
                onPress={() =>  this.props.navigation.navigate('Main3_2', {otherParam: this.state.selectedDate}) } 
                >
                <Text style={{color:"#fff", textAlign:'center'}}>
                거룩한 독서 편집
                </Text>
            </TouchableOpacity>          
           </View>
            <View style={this.state.selectedDay && this.state.bg1!="" ? {} : {display:'none'}}>
            <TouchableOpacity 
                activeOpacity = {0.9}
                style={{backgroundColor: '#01579b', padding: 10, marginTop: 20}}
                onPress={() => this.props.navigation.navigate('Main4_2', {otherParam: this.state.selectedDate}) } 
                >
                <Text style={{color:"#fff", textAlign:'center'}}>
                주일의 독서 편집
                </Text>
            </TouchableOpacity> 
            </View>
            <View style={!this.state.selectedDay && this.state.bg1=="" ? {} : {display:'none'}}>
              <TouchableOpacity 
                  activeOpacity = {0.9}
                  style={{backgroundColor: '#01579b', padding: 10}}
                  onPress={() => this.props.navigation.navigate('Main3_2', {otherParam: this.state.selectedDate}) } 
                  >
                  <Text style={{color:"#fff", textAlign:'center'}}>
                  거룩한 독서 하러가기
                  </Text>
              </TouchableOpacity> 
              </View>
              <View style={this.state.selectedDay && this.state.bg1=="" ? {} : {display:'none'}}>
              <TouchableOpacity 
                  activeOpacity = {0.9}
                  style={{backgroundColor: '#01579b', padding: 10}}
                  onPress={() => this.props.navigation.navigate('Main4_2', {otherParam: this.state.selectedDate}) } 
                  >
                  <Text style={{color:"#fff", textAlign:'center'}}>
                  주일의 독서 하러가기
                  </Text>
              </TouchableOpacity> 
              </View>
              <View style={{height:220}} />
          
          </ScrollView>  
            
            <View style={this.state.showButton1 == false ? {} : {display:'none'}}>
              <View style={!this.state.selectedDay && this.state.Comment=="" ? {} : {display:'none'}}>
              <TouchableOpacity 
                  activeOpacity = {0.9}
                  style={{backgroundColor: '#01579b', padding: 10}}
                  onPress={() => this.props.navigation.navigate('Main2_2', {otherParam: this.state.selectedDate}) } 
                  >
                  <Text style={{color:"#fff", textAlign:'center'}}>
                  말씀새기기 하러가기
                  </Text>
              </TouchableOpacity> 
              </View>      
              <View style={!this.state.selectedDay && this.state.bg1=="" ? {} : {display:'none'}}>
              <TouchableOpacity 
                  activeOpacity = {0.9}
                  style={{backgroundColor: '#01579b', padding: 10}}
                  onPress={() => this.props.navigation.navigate('Main3_2', {otherParam: this.state.selectedDate}) } 
                  >
                  <Text style={{color:"#fff", textAlign:'center'}}>
                  거룩한 독서 하러가기
                  </Text>
              </TouchableOpacity> 
              </View>
              <View style={this.state.selectedDay && this.state.bg1=="" ? {} : {display:'none'}}>
              <TouchableOpacity 
                  activeOpacity = {0.9}
                  style={{backgroundColor: '#01579b', padding: 10}}
                  onPress={() => this.props.navigation.navigate('Main4_2', {otherParam: this.state.selectedDate}) } 
                  >
                  <Text style={{color:"#fff", textAlign:'center'}}>
                  주일의 독서 하러가기
                  </Text>
              </TouchableOpacity> 
              </View>
            </View> 
            <ScrollView style={{marginBottom:240}}>
            
           
            </ScrollView>
        </View>
      )
   
    
    
       
  }
}
Main5.propTypes = { 
    status: PropTypes.shape({
        isLogged: PropTypes.bool,
        loginId: PropTypes.string
    })
  };
  
const styles = StyleSheet.create({
 
    MainContainer :{     
    justifyContent: 'center',
    flex:1,
    margin: 10,
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
     },
      
     smallText: {
      color: "#01579b",
      textAlign: 'center', 
      fontSize: 11,
      margin:  5
     },
     lectioText:{
       color: "#000", 
       fontSize: 14,
       padding: 5}
    });