import React, { Component } from 'react';
 
import { Platform, StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, AsyncStorage, Keyboard, Alert } from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {NavigationEvents} from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/EvilIcons'
import Icon3 from 'react-native-vector-icons/FontAwesome'
import Icon5 from 'react-native-vector-icons/AntDesign'
import ImagePicker from 'react-native-image-picker'; 
import RNFetchBlob from 'rn-fetch-blob';
import {toShortFormat, dateFormat1} from '../etc/dateFormat';
import Menu from '../etc/Menu';
import SideMenu from 'react-native-side-menu';

var commentDates = new Array()
var lectioDates = new Array()
var normalSize;
var largeSize;

export default class Main5 extends Component { 
 
constructor(props) { 
    super(props)   
    this.state = {
        Today : "",
        selectedDate: "", //  - - - 
        selectedDate_format: "",// - -
        onesentence: "",      
        initialLoading: true,
        avatarSource:  {uri: ""},
        todaycount: 0,
        weekcount: 0,
        monthcount: 0,
        name: "",
        christname: "",
        isOpen: false,
        selectedItem: 'About',
        iconShow:true,
        selectShow:false,
        selectQuestion: false
    }
    
    this.onselectDate= this.onselectDate.bind(this);
    this.getImagefromServer = this.getImagefromServer.bind(this);
  }

  getImagefromServer(){   

    let dirs = RNFetchBlob.fs.dirs;
    console.log(dirs)
      AsyncStorage.getItem('profilenumber', (err, result) => {
       // alert(result)
      if(result == null){
        result = 0;
      }
     // alert("third"+result)
      RNFetchBlob.fs.exists(dirs.SDCardApplicationDir + '/profileimg'+result+'.jpeg')
      .then((exist) => {
        //  alert(exist)
          this.setState( {avatarSource: 
            {
              uri: "file:///storage/emulated/0/Android/data/com.yellowpg.gaspel_en/"+'/profileimg'+result+'.jpeg'
            }
          }) 
      })
      .catch(() => {  })
    })
   
  

    

    }

 
  // 프로필 이미지 선택
  pickImage(){
    const options = {
      title: '프로필 이미지를 선택하세요',
      customButtons: [{ name: 'fb', title: 'Choose Photo' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // 이미지 선택 성공시 source에 값 저장
        const source = { uri: response.uri };
    
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log("source", response.uri)
        
        this.setState({
          avatarSource: source,
          data: response.data
        });

        //삽입     
        if(Platform.OS !=="ios"){
        let dirs = RNFetchBlob.fs.dirs;
        console.log(dirs.SDCardApplicationDir)
      
     //   RNFetchBlob.fs.unlink(dirs.SDCardApplicationDir + '/profileimg.jpeg').then(() => {

        AsyncStorage.getItem('profilenumber', (err, result) => {
          if(result == null){
            result = 0;
            try {
              var number = Number(result);
            //  alert("second"+number)
              number = number+1;   
              AsyncStorage.setItem('profilenumber', String(number));                  
              RNFetchBlob.fs.cp(response.path, dirs.SDCardApplicationDir + '/profileimg'+String(number)+'.jpeg').then(() => {   
              //  alert("success")       
              }).catch((e)=>{ alert("FAILED:= "+e.message) });         
              } catch (error) {
                console.error('AsyncStorage error: ' + error.message);
              }    
          }else{
            try {
              var number = Number(result);
             // alert("second"+number)
              number = number+1;   
              AsyncStorage.setItem('profilenumber', String(number));                  
              RNFetchBlob.fs.cp(response.path, dirs.SDCardApplicationDir + '/profileimg'+String(number)+'.jpeg').then(() => {   
              //  alert("success")       
              }).catch((e)=>{ alert("FAILED:= "+e.message) });         
              } catch (error) {
                console.error('AsyncStorage error: ' + error.message);
              }          
          }                
       
        })

          
     //   });
        
        }           
       
      }
    });
  }


 
componentWillMount(){
  if(Platform.OS !=="ios"){
    this.getImagefromServer();
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
  })
  
  // commentDates, lectioDates 배열 생성
  commentDates = Array()
  lectioDates = Array()
  console.log("Main5 - componentWillMount")

  // 달력 이름 한국어로 변경
  LocaleConfig.locales['kr'] = {
    monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
    dayNames: ['일','월','화','수','목','금','토'],
    dayNamesShort: ['일','월','화','수','목','금','토']
  };
  
 // LocaleConfig.defaultLocale = 'en';

  // 오늘 날짜 설정, today5 저장, Today, selectedDate setting
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth()+1
  var month_previous = date.getMonth()
  if(month < 10){
      month = "0"+month;
  }
  if(month_previous < 10){
    month_previous = "0"+month_previous;
  } 
  var today = dateFormat1("today")
  this.setState({Today: today, selectedDate: today})

  try {
    AsyncStorage.setItem('today5', today);
   // AsyncStorage.removeItem('profilenumber')
  } catch (error) {
    console.error('AsyncStorage error: ' + error.message);
  }
  // login_name, christ_name 가져와서 name, christname setting
  AsyncStorage.getItem('name', (err, result) => {
    console.log("Main5 - name : ", result)
    this.setState({
      name: result
          });

  })
  AsyncStorage.getItem('catholic_name', (err, result) => {
    console.log("Main5 - login_catholic_name : ", result)
    this.setState({
      christname: result
          });

  })
  // 년월에 대해 getAllPoints로 이번달 달력 DB값 가져오기 
  var year_month = year+"-"+month;
  this.getAllPoints(year_month)   

  var year_month_previous = year+"-"+month_previous;
  this.getAllPoints(year_month_previous)   
  
}

refreshContents(){
  Keyboard.dismiss()
  const { params } = this.props.navigation.state;
    
  // textSize 가져오기
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

  AsyncStorage.getItem('refreshNames', (err, result) => {
    if(result == 'true'){

    
    AsyncStorage.getItem('name', (err, result) => {
      console.log("Main5 - login_name : ", result)
      this.setState({
        name: result
      //  iconShow:false
            });
    
    })
    AsyncStorage.getItem('catholic_name', (err, result) => {
      console.log("Main5 - login_catholic_name : ", result)
      this.setState({
        christname: result
            });
    
    })
    try {
      AsyncStorage.setItem('refreshNames','false');
    } catch (error) {
      console.error('AsyncStorage error: ' + error.message);
    }   
  }
  });

  AsyncStorage.getItem('refreshMain5', (err, result) => {
  
    console.log("Main5 - get AsyncStorage refresh : ", result)  

      AsyncStorage.getItem('today5', (err, result2) => {
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
        console.log(today + "/" + this.state.Today)
        console.log(result2)
        if(result2 == null){
          // today5 값이 없는 경우, 즉 로그아웃후에 돌아오는 경우에는 이름, 프로필 사진도 변경해야함
          AsyncStorage.getItem('name', (err, result) => {
            console.log("Main5 - login_name : ", result)
            this.setState({
              name: result,
              avatarSource:  {uri: ''},
            //  iconShow:false
                  });
          
          })
          AsyncStorage.getItem('catholic_name', (err, result) => {
            console.log("Main5 - login_catholic_name : ", result)
            this.setState({
              christname: result
                  });
          
          })
        }

        if(result == "refresh" || result2 !== today){
        // refreshMain5 의 경우나 today5날짜가 변경된 경우
          try {
              AsyncStorage.setItem('refreshMain5', 'no');
              AsyncStorage.setItem('today5', today);
          } catch (error) {
              console.error('AsyncStorage error: ' + error.message);
          }

          // 다시 달력 동그라미 DB값 가져옴
          commentDates = Array()
          lectioDates = Array()
       
          LocaleConfig.locales['kr'] = {
            monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
            monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
            dayNames: ['일','월','화','수','목','금','토'],
            dayNamesShort: ['일','월','화','수','목','금','토']
          };
          
          LocaleConfig.defaultLocale = 'kr';   
    
    
          // 오늘 날짜 
          var date = new Date();
          var year = date.getFullYear();
          var month = date.getMonth()+1
          var month_previous = date.getMonth()
          var day = date.getDate();
          if(month < 10){
              month = "0"+month;
          }
          if(month_previous < 10){
            month_previous = "0"+month_previous;
          } 
          if(day < 10){
              day = "0"+day;
          }
         
          var year_month = year+"년 "+month;
      
          const { params } = this.props.navigation.state;
          if(params != null){
            // Main3_2, Main4_2에서 온 경우
            console.log("Main5 - navigation params existed : ",params.otherParam)
            if(params.otherParam != year+"-"+month){
              // 다른 년월인 경우
              console.log("다른 달 ")
    
              this.setState({
                selectedDate: "",
                selectedDate_format: "",// 요일
                onesentence: "",      
                initialLoading: true
              })
              today = params.otherParam+"-01"
              this.setState({selectedDate: today})
              year_month = params.otherParam.substring(0,4)+"-"+params.otherParam.substring(5,6)
              this.setState({selectedDate: today})
              this.getAllPoints(year_month)  
            }else{
              // 같은 년월인 경우
              console.log("같은 달 ")
    
              this.setState({
                Today : "",
                selectedDate: "",
                selectedDate_format: "",// 요일
                onesentence: "",      
                initialLoading: true,
                todaycount: 0,
                weekcount: 0,
                monthcount: 0
              })
              var today = year+"-"+month+"-"+day;
              this.setState({Today: today, selectedDate: today})

             var year_month = year+"-"+month;
              this.getAllPoints(year_month)  
            }
            }else{
            // 일반적인 경우 이번년월로 값을 가져옴
              this.setState({
                Today : "",
                selectedDate: "",
                selectedDate_format: "",// 요일
                onesentence: "",      
                initialLoading: true,
                todaycount: 0,
                weekcount: 0,
                monthcount: 0
              })
              var today = year+"-"+month+"-"+day;
              this.setState({Today: today, selectedDate: today})
            
              var year_month = year+"-"+month;
              this.getAllPoints(year_month)                    
                           
            }       
            
          // 날짜가 달라지면 전달것도 가져오기
          var year_month_previous = year+"-"+month_previous;
          this.getAllPoints(year_month_previous)   
        
        }else{

        }
      })     

  })
  
}

getAllPoints(year_month){
  
  // 날짜에 맞는 DB값 모두 가져오기
    //년월이 들어있는 comment DB 있는지 확인    
    db.transaction(tx => {
     tx.executeSql(
      'SELECT * FROM comment where date LIKE ?',
      [ year_month+"%"],
      (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {     
            console.log("Main5 - get Comments data")    
            var year_site = results.rows.item(0).date.indexOf("년");
            var month_site = results.rows.item(0).date.indexOf("월");
            var day_site = results.rows.item(0).date.indexOf("일");
            var year, month, day, date
                  
            for(var i=0; i<results.rows.length; i++){
              date = results.rows.item(i).date
              if(commentDates.indexOf(date) < 0 ){
              commentDates.push(date);
              } 
              // 모든 값을 commentDates 배열에 저장
            
            }
            console.log('Main5 - get Comments data : ', commentDates)
            this.commentFunc(commentDates)             
                        
        } else {                  
          console.log('Main5 - get Comments data : ', "no value")    
          this.commentFunc(commentDates)              
        }
      }
    );
  });  

    //년월이 포함된 lectio DB있는지 확인    
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM lectio where date LIKE ?',
      [year_month+"%"],
      (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {                  
            console.log('Main5 - get Lectios data')             
            for(var i=0; i<results.rows.length; i++){
              date = results.rows.item(i).date
              if(lectioDates.indexOf(date) < 0 ){
                lectioDates.push(date);
                } 
                // 모든 값을 lectioDates 배열에 저장
            } 
            
            console.log('Main5 - get Lectios data : ',lectioDates) 
            this.lectioFunc(lectioDates)            
          
            
        } else {
          console.log('Main5 - get Lectios data : ', "no value")   
          this.lectioFunc(lectioDates)                          
        }
      }
    );
  });  
}


commentFunc = (commentDates) => {
  console.log("Main5 - commentFunc")
  var obj = commentDates.reduce((c, v) => Object.assign(c, {[v]: {customStyles: {
        container: {
          backgroundColor: '#87CEEB',
        },text: {
        color: '#fff'
      }}, marked: true, dotColor: 'red', activeOpacity: 0}}), {});
  // commentDates 배열 값을 동그라미로 변경한뒤에 CommentMarked로 setting
  this.setState({ CommentMarked : obj});
 }

 lectioFunc = (lectioDates) => {
  console.log("Main5 - lectioFunc")
  var result
  if(lectioDates != ""){
     // lectioDates 배열이 있는 경우 값을 동그라미로 변경한뒤에 CommentMarked와 합쳐서 값을 Marked로 setting
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
    // lectioDates 배열이 없는 경우 CommentMarked만 가져와 Marked로 setting
    result = this.state.CommentMarked
    console.log("Main5 - results of points : ", result)
  } 
  this.setState({ Marked : result, initialLoading: false});

  // 가져온 값에 대해서 오늘, 이번주, 이번달 날짜 세기 
  var today = dateFormat1("today")
  if(this.state.selectedDate == today){
    // selectedDate 오늘인 경우만 날짜 세기
    this.countDays()
  }
  
}
 countDays(){
  var todaycount = 0
  var weekcount = 0
  var monthcount = 0
 // return new Promise((resolve, reject) => {
 
  console.log("countDays",commentDates)
  console.log("countDays",lectioDates)

  var today = dateFormat1("today")
  console.log("countDays", commentDates.includes(today));
  console.log("countDays", lectioDates.includes(today));
  if(commentDates.includes(today) || lectioDates.includes(today)){
    // comment, lectio 둘다 있는 날짜는 1로 카운트하기
    todaycount = 1
  }else{
    todaycount = 0
  }
  var date_mon = new Date();
  var day = date_mon.getDay(),
      diff = date_mon.getDate() - day// + (day == 0 ? -7:0); // adjust when day is sunday
  
  // 이번주 월요일 찾아서 일주일 계산
  var monday = new Date(date_mon.setDate(diff));
 // alert(monday)
    for(var k=0; k<7; k++){      
      var date = new Date(monday)
      date.setDate(monday.getDate() + k)
      var year = date.getFullYear();
      var month = date.getMonth()+1
      var day = date.getDate();
      if(month < 10){
          month = "0"+month;
      } 
      if(day < 10){
        day = "0"+day
    }
      var date = year+"-"+month+"-"+day
      console.log(date)
      console.log("countDays", commentDates.includes(date));
      console.log("countDays", lectioDates.includes(date));
      if(commentDates.includes(date) || lectioDates.includes(date)){
        weekcount = weekcount+1
      }else{
      }
    } 
  // 이번달 1일부터 31일까지 이번달 카운팅 
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth()+1
  if(month < 10){
    month = "0"+month;
  } 
  var month = year+"-"+month

  for(let i=0; i<32; i++){
    var day;
    if(i.toString().length == 1){
      day = "0"+i;
    }else{
      day = i;
    }
    var date = month+"-"+day
    console.log(date)
    console.log("countDays", commentDates.includes(date));
    console.log("countDays", lectioDates.includes(date));
    if(commentDates.includes(date) || lectioDates.includes(date)){
      monthcount = monthcount +1
    }else{
    }
  }

//  resolve(weekcount);
//}, null, null);
  console.log("result", todaycount+"/"+weekcount+"/"+monthcount)
  // todaycount, weekcount, monthcount 체크하기
  this.setState({todaycount: todaycount, weekcount: weekcount, monthcount: monthcount})
 }
 
// 팝업내용 뜬 경우에 왼쪽, 오른쪽 이동시 이벤트
changeDate(direction){
  // selectedDate 값으로 날짜 가져와서 -1, 혹은 +1
  var date = new Date(this.state.selectedDate)
  if(direction == "left"){
  date.setDate(date.getDate() - 1);
  }else{
  date.setDate(date.getDate() + 1);
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
  var date_format = year+"-"+month+"-"+day;
  
  
  this.setState({
    selectedDate: date_format,
    selectedDate_format: toShortFormat(date),
    comment:"",
    mysentence: "",
    js2: "",
    sentence:""
  })
  date = date_format
  // 선택날짜에 해당되는 DB 가져옴
  if(new Date(date_format).getDay() == 0){
    // 일요일인 경우 mysentence, lectio 값 가져옴
    db.transaction(tx => {   
      tx.executeSql(
        'SELECT * FROM lectio where date = ?',
        [date],
        (tx, results) => {
            var len = results.rows.length;
        //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Main1 - check Lectio data : ', results.rows.item(0).bg1) 
                this.setState({
                    sentence: results.rows.item(0).onesentence,
                    js2 : results.rows.item(0).js2
                })
            } else {               
                this.setState({
                    sentence: "",
                    js2 : ""
                })                   
            }
        }
        ), 
        tx.executeSql(
          'SELECT * FROM weekend where date = ?',
          [date],
          (tx, results) => {
              var len = results.rows.length;
          //  값이 있는 경우에 
              if (len > 0) {                  
                  console.log('Main1 - check Weekend data : ', results.rows.item(0).mysentence) 
                  this.setState({
                      mysentence : results.rows.item(0).mysentence,
                      initialLoading:false,
                      selectShow: true
                  })
              } else {               
                  this.setState({
                      mysentence : "",
                      initialLoading:false,
                      selectShow: true
                  })                   
              }
          }
          )
    });    

  }else{
    // 평일인 경우는 comment, lectio 가져옴
    console.log("not weekend", date)
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM comment where date = ?',
        [date],
        (tx, results) => {
          var len = results.rows.length;
        //  값이 있는 경우에 
          if (len > 0) {                  
              console.log('Main1 - check Comment data : ', results.rows.item(0).comment)   
              this.setState({
                  comment: results.rows.item(0).comment,
                  sentence:  results.rows.item(0).onesentence
              })
          } else {     
              this.setState({
                  comment: ""
              })                             
          }
        }
      ),
      tx.executeSql(
        'SELECT * FROM lectio where date = ?',
        [date],
        (tx, results) => {
            var len = results.rows.length;
        //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Main1 - check Lectio data : ', results.rows.item(0).bg1) 
                this.setState({
                    sentence :  results.rows.item(0).onesentence,
                    js2 : results.rows.item(0).js2,
                    selectShow: true
                })
            } else {               
                this.setState({
                    js2 : "",
                    selectShow: true
                })                   
            }
        }
        )
    });    
  } 
 }

// 날짜 선택시 이벤트
onselectDate(day, today){   
  console.log("Main5 - onselectDate")
  var date
  if(today != null){  
    // today값이 존재하는 경우에 이 날짜 값 가져오기
    console.log("Main5 - onselectDate date : ", today)
    date = toShortFormat( new Date(today))
    
  }else{
    //day 값으로 날짜 설정
    console.log("Main5 - onselectDate date : ", day)
     if(day.month < 10){
      day.month = "0"+day.month;
    }
    if(day.day < 10){
      day.day = "0"+day.day;
    }   
    var date_format = day.year+"-"+day.month+"-"+day.day;
   // alert(date_format in this.state.Marked)
    var exist = date_format in this.state.Marked
    if (!exist){
      // 만약 this.state.Marked에 있는 key값에 날짜가 없는 경우 보내기
      date = toShortFormat( new Date(date_format))       
      if(new Date(date_format).getDay() == 0){
        Alert.alert(
          
          'Do you want to read on ' + date+'?',
          '',
          [                                 
            {
            text: 'cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
            },
            {text: 'confirm', onPress: () => 
              this.props.navigation.navigate('Main4_2', {otherParam: date_format}) 
            },
          ],
          {cancelable: true},
          )        
      }else{
        Alert.alert(
          'Do you want to read on ' + date+'?',
          '',
          [                                 
            {
            text: 'cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
            },
            {text: 'confirm', onPress: () => 
              this.props.navigation.navigate('Main3_2', {otherParam: date_format}) 
            },
          ],
          {cancelable: true},
          )            
      }
    }else{
    
    // this.state.Marked key값에 날짜가 있는 경우 각 날짜 DB값 가져오고 팝업 보이기
    this.setState({
      selectedDate: date_format,
      comment:"",
      mysentence: "",
      js2: "",
      sentence:""
    })    
    date = toShortFormat( new Date(date_format))    
  console.log(date)
    if(new Date(date_format).getDay() == 0){
      //일요일인 경우 lectio, weekend 가져옴
      db.transaction(tx => {   
        tx.executeSql(
          'SELECT * FROM lectio where date = ?',
          [date_format],
          (tx, results) => {
              var len = results.rows.length;
          //  값이 있는 경우에 
              if (len > 0) {                  
                  console.log('Main1 - check Lectio data : ', results.rows.item(0).bg1) 
                  this.setState({
                      sentence: results.rows.item(0).onesentence,
                      js2 : results.rows.item(0).js2
                  })
              } else {               
                  this.setState({
                      sentence: "",
                      js2 : ""
                  })                   
              }
          }
          ), 
          tx.executeSql(
            'SELECT * FROM weekend where date = ?',
            [date_format],
            (tx, results) => {
                var len = results.rows.length;
            //  값이 있는 경우에 
                if (len > 0) {                  
                    console.log('Main1 - check Weekend data : ', results.rows.item(0).mysentence) 
                    this.setState({
                        mysentence : results.rows.item(0).mysentence,
                        initialLoading:false,
                        selectShow: true
                    })
                } else {               
                    this.setState({
                        mysentence : "",
                        initialLoading:false,
                        selectShow: true
                    })                   
                }
            }
            )
      });    
    }else{
      // 평일인 경우 comment, lectio 가져옴
      console.log("not weekend", date)
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM comment where date = ?',
          [date_format],
          (tx, results) => {
            var len = results.rows.length;
          //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Main1 - check Comment data : ', results.rows.item(0).comment)   
                this.setState({
                    comment: results.rows.item(0).comment,
                    sentence:  results.rows.item(0).onesentence
                })
            } else {     
                this.setState({
                    comment: ""
                })                             
            }
          }
        ),
        tx.executeSql(
          'SELECT * FROM lectio where date = ?',
          [date_format],
          (tx, results) => {
              var len = results.rows.length;
          //  값이 있는 경우에 
              if (len > 0) {                  
                  console.log('Main1 - check Lectio data : ', results.rows.item(0).bg1) 
                  this.setState({
                      sentence :  results.rows.item(0).onesentence,
                      js2 : results.rows.item(0).js2,
                      selectShow: true
                  })
              } else {               
                  this.setState({
                      js2 : "",
                      selectShow: true
                  })                   
              }
          }
        )
      });    
     } 
    }
  }
  // 선택된 날짜 포맷에 date 저장해서 팝업에 해당날짜로 보이게
  this.setState({
    selectedDate_format: date
  }) 
}

// month이동시에 년월에 해당하는 DB 동그라미값가져오기 getAllPoints
changeMonth(year, month){
  if(month < 10){
      month = "0"+month;
  }
  var today = year+"-"+month+"-01";
  var year_month = year+"-"+month; 
  this.setState({selectedDate: today})
  this.getAllPoints(year_month)   
}

render() {    
  console.log("Main5 - render : Marked ", this.state.Marked)
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
      <View style={{flex:1, backgroundColor:"#fff"}}>
      <View style={this.state.selectQuestion ? {flex:1,position: 'absolute', right:'0%', top:'0%', width:'100%', height:'100%', backgroundColor:"rgba(0,0,0, 0.7)", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>              
        <Text style={{color:"#fff", position: 'absolute', left:'80%', top:25, fontWeight:'bold', fontSize:16}}>    |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'9%', top:45}}>You can set profile, text size, alarm and so on.{"\n"}you can download file of your records.</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'63%', top:105, fontWeight:'bold', fontSize:16}}>    |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'6%', top:125}}>It shows records of today, this week and this month.</Text>

        <Text style={{color:"#fff", position: 'absolute', left:'14%', top:140, fontWeight:'bold', fontSize:16}}>    |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'14%', top:160}}>Register your profile image.</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'14%', top:265}}>If you click, You can do previous Lectio Divina.</Text>
        
        <Text style={{color:"#fff", position: 'absolute', left:'46%', top:280, fontWeight:'bold', fontSize:16}}>   |</Text>

        <Text style={{color:"#fff", position: 'absolute', left:'60%', top:320, fontWeight:'bold', fontSize:16}}>    |</Text>
        <Text style={{ position: 'absolute', left:'59.4%', top:288, fontWeight:'bold', fontSize:16}}><Icon3 name={"circle-thin"} size={40} color={"#01579b"} /></Text>
        <Text style={{color:"#fff", position: 'absolute', left:'17%', top:340}}>it is marked in a circle on the date{"\n"}when you did Lectio Divina.</Text>
    

        <Text style={{color:"#fff", position: 'absolute', left:'5%', bottom:17}}>Main Page</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'8%', bottom:2, fontWeight:'bold', fontSize:16}}>   |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'29%', bottom:17}}>Lectio Divina</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'34%', bottom:2, fontWeight:'bold', fontSize:16}}>   |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'54%', bottom:27}}>Lectio Divina{"\n"}(Lord's Day)</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'59%', bottom:2, fontWeight:'bold', fontSize:16}}>   |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'79%', bottom:17}}>My Page</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'84%', bottom:2, fontWeight:'bold', fontSize:16}}>   |</Text>
        <TouchableOpacity 
          activeOpacity = {0.9}
          style={{position: 'absolute', right:"4%", top:8}}
          onPress={() => this.setState({selectQuestion:false}) } 
          >    
            <Icon5 name={'closecircle'} size={22} color={"#fff"} />        
        </TouchableOpacity>   
      </View>     
      <View style={this.state.selectShow ? {position: 'absolute', right:'2%', bottom:'10%', width:'96%', height:250, backgroundColor:"#fff", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>              
        <View style={{marginLeft:20, marginRight:20}}>   
          <Text style={[styles.TextStyle,{marginTop:3, padding:10, color:'#000', textAlign:'center', fontSize:13}]}>{this.state.selectedDate_format}</Text>    
          <Text style={this.state.mysentence!="" ? {display:'none'} : [styles.TextStyle,{fontSize:15,marginTop:5, padding:10, color:'#01579b', textAlign:'center'}]}>{this.state.sentence}</Text>    
          <Text style={this.state.mysentence!="" ? [styles.TextStyle,{fontSize:15,marginTop:5, padding:10, color:'#01579b', textAlign:'center'}]: {display:'none'}}>{this.state.mysentence}</Text>        
          <Text style={this.state.js2 != "" ? [normalSize, styles.TextStyle,{marginTop:5, padding:10, color:'#000', textAlign:'center'}]:{display:'none'}}>{this.state.js2}</Text>           
          <Text style={this.state.comment != "" && this.state.js2 == "" ? [normalSize, styles.TextStyle,{marginTop:15, padding:10, color:'#000', textAlign:'center'}]: {display:'none'}}>{this.state.comment}</Text>                             
        </View>
        <TouchableOpacity 
        style={{position: 'absolute', right:-5, top:125}}
        underlayColor = {"#fff"}
        onPress={() => this.changeDate("right")}>
            <Icon2 name={"chevron-right"} size={40} color={"#A8A8A8"} /> 
        </TouchableOpacity  >     
        <TouchableOpacity 
        style={{position: 'absolute', left:-5, top:125}}
        underlayColor = {"#fff"}
        onPress={() => this.changeDate("left")}>
            <Icon2 name={"chevron-left"} size={40} color={"#A8A8A8"} /> 
        </TouchableOpacity  > 
        <TouchableOpacity 
          activeOpacity = {0.9}
          style={{position: 'absolute', right:2, top:2}}
          onPress={() => this.setState({selectShow:false}) } 
          >    
            <Icon2 name={'close'} size={30} color={"#000"} />        
        </TouchableOpacity>   
        <TouchableOpacity 
          activeOpacity = {0.9}  
          style={{position: 'absolute', left:'40%', bottom:16, width:'20%', borderWidth:1, borderColor:'#4e99e0', borderRadius:2, padding:5}} 
          onPress={() => new Date(this.state.selectedDate).getDay() == 0 ? this.props.navigation.navigate('Main4_2', {otherParam: this.state.selectedDate}) : this.props.navigation.navigate('Main3_2', {otherParam: this.state.selectedDate})  } 
          >    
           <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#4e99e0'}]}>More</Text>    
        </TouchableOpacity>        
      </View>     
      <View style={{flex:1, backgroundColor:'#fff'}}>    
          <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', backgroundColor:'#fff', borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
            <View style={{flexDirection: "column", flexWrap: 'wrap', width: '79%', height: 30, marginTop:10, paddingLeft:'1%'}}>
                <Text style={[ styles.TextStyle, {fontSize:17, textAlign:'left', fontFamily:'NanumMyeongjoBold', color:"#000"}]}>My Page</Text>
            </View>
            
            <View style={{flexDirection: "column", flexWrap: 'wrap', width: '17%', height: 30, marginLeft:'0%', float:'right'}}>              
                <TouchableOpacity 
                activeOpacity = {0.9}                
                style={{marginRight:13}}
                onPress={() => this.props.navigation.navigate('Setting')} // insertComment
                >      
                <Icon5 style={{textAlign:'right'}} name={"setting"} size={24} color={"#000"} style={{paddingTop:9}} />
                </TouchableOpacity>
                <TouchableOpacity 
                activeOpacity = {0.9}
                onPress={() => this.setState({selectQuestion:true})} // insertComment
                >      
                <Icon5 name={'questioncircleo'} size={22} color={"#000"} style={{paddingTop:9}} />
                </TouchableOpacity>
            </View>
          </View>  
        <NavigationEvents
        onWillFocus={payload => {
            [this.refreshContents(), console.log("payload", payload)]
        }}
        />                
        <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop: 10}}>
          <View style={{flexDirection: "column", flexWrap: 'wrap', width: 120, height: 100}}>
            <TouchableOpacity 
              activeOpacity = {0.9}
              style={{
                borderWidth:1,
                borderColor:'rgba(0,0,0,0.2)',
                alignItems:'center',
                justifyContent:'center',
                width:100,
                height:100,
                backgroundColor:'#000',
                borderRadius:100,
                overflow: 'hidden',
                marginLeft:10
              }}
              onPress={() => this.pickImage() } 
              >
              <Image source={this.state.avatarSource} onError={(e) => { this.setState({iconShow:true, avatarSource: require('../resources/add_image.png')}) }}  style={{flex: 1,width: 130,height: 130,resizeMode: 'cover'}}/>
            </TouchableOpacity> 
            <TouchableOpacity 
            activeOpacity = {0.9}
            style={this.state.iconShow ? {position: 'absolute', right:6, top:70} : {display:'none'}}
            onPress={() => this.pickImage() } 
            >    
              <Icon name={'plus-circle'} size={25} color={"#01579b"} borderWidth={1} borderColor={'#fff'} />        
            </TouchableOpacity>  
                 </View>
          <View style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 70, marginTop:10}}>
            <Text style={{color:'#000', textAlign: 'center', fontSize: 23, marginBottom:0}}>{this.state.todaycount}</Text>      
            <Text style={{textAlign: 'center', fontSize: 13, marginBottom:10}}>Today</Text>     
          </View>        
          <View style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 70, marginTop:10}}>
            <Text style={{color:'#000', textAlign: 'center', fontSize: 23, marginBottom:0}}>{this.state.weekcount}</Text>  
            <Text style={{textAlign: 'center', fontSize: 13, marginBottom:10}}>This Week</Text>          
          </View>    
          <View style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 70, marginTop:10}}>
            <Text style={{color:'#000', textAlign: 'center', fontSize: 23, marginBottom:0}}>{this.state.monthcount}</Text>   
            <Text style={{textAlign: 'center', fontSize: 13, marginBottom:10}}>This Month</Text>       
          </View>  
          <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop: -30}}>
          <View style={{flexDirection: "column", flexWrap: 'wrap', width: 120, height: 40}}>
          </View> 
          <View style={{flexDirection: "column", flexWrap: 'wrap', width: 210, height: 40}}>
          <Text style={[{textAlign: 'center', marginTop:0, color:'#000', fontWeight:'400', marginLeft:10}, normalSize]}>
          {this.state.name} {this.state.christname}
          </Text> 
          </View> 
          </View>  
        </View>        
       

        <View>
          <Calendar
            markingType={'custom'}
          //  firstDay={1}
            hideExtraDays={true}
            current={this.state.selectedDate}
            pastScrollRange={24}
            futureScrollRange={24}
            horizontal
            pagingEnabled
            onDayPress={day=>this.onselectDate(day, null)}
            style={{borderTopWidth: 0.5, borderTopColor: '#d8d8d8'}}
            markedDates={this.state.Marked}             
            // onPressArrowLeft={substractMonth => this.substractMonth()}
          //   onPressArrowRight={addMonth => this.addMonth()}
            onMonthChange={(changed) => {console.log('month changed', changed.year + "년 "+ changed.month), this.changeMonth(changed.year, changed.month)
          }}
          />
        </View>        
      </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
    Button:{
      textAlign:'center',
      backgroundColor: '#01579b', 
      padding: 10, 
      marginTop:10,
      width:200,
      borderRadius: 10,
      height:40}
  });