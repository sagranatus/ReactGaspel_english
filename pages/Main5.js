import React, { Component } from 'react';
 
import { StyleSheet, TextInput, View, Alert, Button, Text} from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {Calendar} from 'react-native-calendars';

export default class Main5 extends Component { 

constructor(props) { 
    super(props)  
   
    this.state = {
        Today : "",
        selectedDate: "",
        onesentence: "",
        Comment: "",
        bg1:"",
        bg2:"",
        bg3:"",
        sum1:"",
        sum1:"",
        js1:"",
        js2:""
    }
    this.onselectDate= this.onselectDate.bind(this);
  }

  componentWillMount(){
    console.log("saea", this.state.Comment)
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
                console.log('Message', results.rows.item(0).date+results.rows.item(1).date+results.rows.item(2).date)   
                var year_site = results.rows.item(0).date.indexOf("년");
                var month_site = results.rows.item(0).date.indexOf("월");
                var day_site = results.rows.item(0).date.indexOf("일");
                var year, month, day, date
               
                var commentDates = new Array()
                for(var i=0; i<results.rows.length; i++){
                  year = results.rows.item(i).date.substring(0, year_site);
                  month = results.rows.item(i).date.substring(year_site+2, month_site);
                  day = results.rows.item(i).date.substring(month_site+2, day_site);
  
                  console.log("date", year+"-"+month+"-"+day)
                  date = year+"-"+month+"-"+day
                  commentDates.push(date);
                }
                console.log(commentDates)
                this.commentFunc(commentDates)
               
                
            } else {                                  
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
              console.log('Message', "lectio~")   
              var year_site = results.rows.item(0).date.indexOf("년");
              var month_site = results.rows.item(0).date.indexOf("월");
              var day_site = results.rows.item(0).date.indexOf("일");
              var year, month, day, date
             
              var lectioDates = new Array()
              for(var i=0; i<results.rows.length; i++){
                year = results.rows.item(i).date.substring(0, year_site);
                month = results.rows.item(i).date.substring(year_site+2, month_site);
                day = results.rows.item(i).date.substring(month_site+2, day_site);

                console.log("date", year+"-"+month+"-"+day)
                date = year+"-"+month+"-"+day
                lectioDates.push(date);
              }
              console.log(lectioDates)
              this.lectioFunc(lectioDates)
           
              
          } else {                                  
          }
        }
      );
    });  
}

commentFunc = (commentDates) => {
  var obj = commentDates.reduce((c, v) => Object.assign(c, {[v]: {marked: true, dotColor: 'red', activeOpacity: 0}}), {});
  this.setState({ CommentMarked : obj});
 }

 lectioFunc = (lectioDates) => {
  var obj = lectioDates.reduce((c, v) => Object.assign(c, {[v]: {marked: true, dotColor: 'blue', activeOpacity: 0}}), {});
  console.log(this.state.CommentMarked)
  var result = Object.assign(this.state.CommentMarked, obj);
  this.setState({ Marked : result});
  console.log(result)
 }

 
 onselectDate(day){
  //this.setState({
    //Comment: "aqwd"+day.day
  //});
  // alert('selected day'+day.year+day.month+day.day); 
   if(day.month < 10){
    day.month = "0"+day.month;
  }
  if(day.day < 10){
    day.day = "0"+day.day;
  } 
  var date_format = day.year+"-"+day.month+"-"+day.day;
  this.setState({
    selectedDate: date_format
  })
  var date = day.year+"년 "+day.month+"월 "+day.day+"일 "+this.getTodayLabel( new Date(date_format))
  console.log('date_data', date)

    //comment있는지 확인    
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM comment where date = ? and uid = ?',
        [date,this.props.status.loginId],
        (tx, results) => {
          var len = results.rows.length;
        //  값이 있는 경우에 
          if (len > 0) {                  
              console.log('Message_data', results.rows.item(0).comment)   
              this.setState({
                Comment: results.rows.item(0).comment,
                onesentence: results.rows.item(0).onesentence
              })
          } else {  
            this.setState({
              Comment: "",
              onesentence: ""
            })                                
          }
        }
      );
   
    });    
      
      //lectio있는지 확인    
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM lectio where date = ? and uid = ?',
          [date,this.props.status.loginId],
          (tx, results) => {
            var len = results.rows.length;
          //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Message_data', results.rows.item(0).bg1)   
            this.setState({
                bg1:results.rows.item(0).bg1,
                bg2:results.rows.item(0).bg2,
                bg3:results.rows.item(0).bg3,
                sum1:results.rows.item(0).sum1,
                sum2:results.rows.item(0).sum2,
                js1:results.rows.item(0).js1,
                js2:results.rows.item(0).js2,
                onesentence: results.rows.item(0).onesentence
              })
            } else {          
              this.setState({
                bg1:"",
                bg2:"",
                bg3:"",
                sum1:"",
                sum2:"",
                js1:"",
                js2:""
              })        
              if(this.state.Comment == ""){
                this.setState({
                  onesentence: ""
                })     
              }                
            }
          }
        );
      });    

     
    }
  
  
  
  getTodayLabel(date) {        
    var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');        
    var todayLabel = week[date.getDay()];        
    return todayLabel;
}

  render() {    
    console.log("render")
    if(this.state.onesentence==""){
        return (      
          <View>
          <Calendar
            current={this.state.today}
            pastScrollRange={24}
            futureScrollRange={24}
            horizontal
            pagingEnabled
          // onDayPress={this.onModalClose}
          onDayPress={day=>this.onselectDate(day)}
            style={{borderBottomWidth: 1, borderBottomColor: 'black'}}
          /*  markedDates={{
            // '2019-01-16': {selected: true, marked: true, selectedColor: 'blue'},
            //  '2019-01-17': {marked: true},
              '2019-01-18': {marked: true, dotColor: 'red', activeOpacity: 0},
            // '2019-01-19': {disabled: true, disableTouchEvent: true}
            }}*/
            markedDates={this.state.Marked} 
            
            onPressArrowLeft={substractMonth => substractMonth()}
            // Handler which gets executed when press arrow icon left. It receive a callback can go next month
            onPressArrowRight={addMonth => addMonth()}
          />
        <Button title="말씀새기기 하러가기" onPress={() => alert(this.state.selectedDate) } color="#2196F3" />
        <Button title="거룩한 독서 하러가기" onPress={() => alert(this.state.selectedDate) } color="#2196F3" />
        </View>
      )
   
    }
        return (      
            <View>
            <Calendar
              current={this.state.today}
              pastScrollRange={24}
              futureScrollRange={24}
              horizontal
              pagingEnabled
             // onDayPress={this.onModalClose}
             onDayPress={day=>this.onselectDate(day)}
              style={{borderBottomWidth: 1, borderBottomColor: 'black'}}
            /*  markedDates={{
               // '2019-01-16': {selected: true, marked: true, selectedColor: 'blue'},
              //  '2019-01-17': {marked: true},
                '2019-01-18': {marked: true, dotColor: 'red', activeOpacity: 0},
               // '2019-01-19': {disabled: true, disableTouchEvent: true}
              }}*/
              markedDates={this.state.Marked} 
              
              onPressArrowLeft={substractMonth => substractMonth()}
              // Handler which gets executed when press arrow icon left. It receive a callback can go next month
              onPressArrowRight={addMonth => addMonth()}
            />

            
            <Text>{this.state.onesentence}</Text>
            <Text>{this.state.Comment}</Text>
            <Text>{this.state.bg1}</Text>
            <Text>{this.state.bg2}</Text>
            <Text>{this.state.bg3}</Text>
            <Text>{this.state.sum1}</Text>
            <Text>{this.state.sum2}</Text>
            <Text>{this.state.js1}</Text>
            <Text>{this.state.js2}</Text>
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
     }
    });