import React, { Component } from 'react';
 
import { StyleSheet, View, Text, Image, TouchableOpacity, ActivityIndicator, AsyncStorage, Keyboard, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons'
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {NavigationEvents} from 'react-navigation'
import ImagePicker from 'react-native-image-picker'; 
import RNFetchBlob from 'rn-fetch-blob';

import Menu from '../etc/Menu';
import SideMenu from 'react-native-side-menu';

var commentDates = new Array()
var lectioDates = new Array()


export default class Main5 extends Component { 
 
constructor(props) { 
    super(props)   
    this.toggle = this.toggle.bind(this);

  
    this.state = {
        Today : "",
        selectedDate: "", //  - - - 
        selectedDate_format: "",// - -
        onesentence: "",      
        initialLoading: true,
        avatarSource:  {uri: 'https://sssagranatus.cafe24.com/servertest/uploads/'+this.props.status.loginId+'.jpeg'},
        todaycount: 0,
        weekcount: 0,
        monthcount: 0,
        name: "",
        christname: "",
        isOpen: false,
        selectedItem: 'About',
    }
    this.onselectDate= this.onselectDate.bind(this);
   
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  updateMenuState(isOpen) {
    this.setState({ isOpen });
  }

  onMenuItemSelected = item =>{
    this.setState({
      isOpen: false,
      selectedItem: item,
    });
    if(item == 'Setting'){
      this.props.navigation.navigate("Setting")
    }else if(item == 'Logout'){
      this.props.setLogout()
    }else if(item == 'Profile'){
      this.props.navigation.navigate("Profile")
    }
  }
  
  pickImage(){
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
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
        const source = { uri: response.uri };
    
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        console.log("source", response.uri)
        
        this.setState({
          avatarSource: source,
          data: response.data,
          Image_TAG: this.props.status.loginId
        });
        this.uploadImageToServer()
      }
    });
  }
  uploadImageToServer = () => {
 
    RNFetchBlob.fetch('POST', 'https://sssagranatus.cafe24.com/servertest/upload_image.php', {
      Authorization: "Bearer access-token",
      otherHeader: "foo",
      'Content-Type': 'multipart/form-data',
    }, [
        { name: 'image', filename: 'image.png', type: 'image/png', data: this.state.data },
        { name: 'image_tag', data: this.state.Image_TAG }
      ]).then((resp) => {
 
        var tempMSG = resp.data;
 
        tempMSG = tempMSG.replace(/^"|"$/g, '');
        console.log(tempMSG)
      //  Alert.alert(tempMSG);
 
      }).catch((err) => {
        console.log(err)
        // ...
      })
 
  }
 
  componentWillMount(){
    AsyncStorage.getItem('profile', (err, result) => {
      console.log("Main1 - get AsyncStorage today : ", result)
      this.setState({
      //  avatarSource:  { uri: result }
      })
      
    })
    commentDates = Array()
    lectioDates = Array()
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
   
  AsyncStorage.getItem('login_name', (err, result) => {
    console.log("FirstPage - login_name : ", result)
    this.setState({
      name: result
          });
  
  })
  AsyncStorage.getItem('login_christ_name', (err, result) => {
    console.log("FirstPage - login_chirst_name : ", result)
    this.setState({
      christname: result
          });
  
  })
    this.getAllPoints()   
}

refreshContents(){
  Keyboard.dismiss()
  AsyncStorage.getItem('refreshMain5', (err, result) => {
    console.log("Main5 - get AsyncStorage refresh : ", result)
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
    if(result == "refresh" || this.state.Today != today){
      try {
          AsyncStorage.setItem('refreshMain5', 'no');
      } catch (error) {
          console.error('AsyncStorage error: ' + error.message);
      }
      commentDates = Array()
      lectioDates = Array()
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
     // this.onselectDate(null, today)
      this.getAllPoints()  
    }else{
      
    }
  })
  
}

componentWillUnmount(){
}

getAllPoints(){
 
  console.log("Main5 - getallpoints", this.props.status.loginId)
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
 /* const { params } = nextProps.navigation.state;
    if(params.otherParam != null){
      console.log("Main5 - navigation params existed : ",params.otherParam)
   //   this.onselectDate(null, params.otherParam) */
      this.getAllPoints()
     
   // }  
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
  this.setState({ Marked : result, initialLoading: false});

  this.countDays()
}
 countDays(){
  var todaycount = 0
  var weekcount = 0
  var monthcount = 0
 // return new Promise((resolve, reject) => {
 
  console.log("countDays",commentDates)
  console.log("countDays",lectioDates)

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth()+1
  var day = date.getDate();
  if(month < 10){
      month = "0"+month;
  } 
  var today = year+"-"+month+"-"+day
  console.log("countDays", commentDates.includes(today));
  console.log("countDays", lectioDates.includes(today));
  if(commentDates.includes(today) || lectioDates.includes(today)){
    todaycount = 1
  }else{
    todaycount = 0
  }
  var date_mon = new Date();
  var day = date_mon.getDay(),
      diff = date_mon.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  var monday = new Date(date_mon.setDate(diff));
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
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth()+1
  if(month < 10){
    month = "0"+month;
} 
  var month = year+"-"+month

  for(let i=0; i<31; i++){
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
  this.setState({todaycount: todaycount, weekcount: weekcount, monthcount: monthcount})
 }
 
 onselectDate(day, today){
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
      selectedDate: date_format
    })
    date = day.year+"년 "+day.month+"월 "+day.day+"일 "+this.getTodayLabel( new Date(date_format))       
  }

  this.props.navigation.navigate('Sub5', {otherParam: date, otherParam2: date_format})

  this.setState({
    selectedDate_format: date
  }) 
    }
    
  getTodayLabel(date) {        
    var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');        
    var todayLabel = week[date.getDay()];        
    return todayLabel;
}

  render() {    
    const menu = <Menu onItemSelected={this.onMenuItemSelected} />;
    console.log("Main5 - render")  
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
      <SideMenu
      menuPosition={"right"}
      menu={menu}
      isOpen={this.state.isOpen}
      onChange={isOpen => this.updateMenuState(isOpen)}
       >
          <View style={{flex:1, backgroundColor:'#fff'}}>
        
             <View style={{width:'100%', backgroundColor: '#F9F9F9', padding: 2, borderBottomWidth: 1, borderBottomColor: '#d8d8d8', marginBottom:10}}>  
                <Icon style={{textAlign:'right'}} name={"navicon"} size={40} color={"#d8d8d8"} onPress={this.toggle}/>   
            </View>   
            <NavigationEvents
            onWillFocus={payload => {
                [this.refreshContents(), console.log("payload", payload)]
            }}
            />
            <View>
          
          <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop: 10}}>
          <View style={{flexDirection: "column", flexWrap: 'wrap', width: 120, height: 150}}>
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
              <Image source={this.state.avatarSource} style={{flex: 1,width: 130,height: 130,resizeMode: 'contain'}}/>
          </TouchableOpacity> 
          <Text style={{textAlign: 'center', fontSize: 14, marginTop:10, color:'#000', fontWeight:'400', marginLeft:10}}>{this.state.name} {this.state.christname}</Text>     
          </View>
          <View style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 70, marginTop:10}}>
          <Text style={{color:'#000', textAlign: 'center', fontSize: 23, marginBottom:0}}>{this.state.todaycount}</Text>      
          <Text style={{textAlign: 'center', fontSize: 13, marginBottom:10}}>오늘</Text>     
          </View>
        
          <View style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 70, marginTop:10}}>
          <Text style={{color:'#000', textAlign: 'center', fontSize: 23, marginBottom:0}}>{this.state.weekcount}</Text>  
          <Text style={{textAlign: 'center', fontSize: 13, marginBottom:10}}>이번주</Text>          
          </View>
      
          <View style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 70, marginTop:10}}>
          <Text style={{color:'#000', textAlign: 'center', fontSize: 23, marginBottom:0}}>{this.state.monthcount}</Text>   
          <Text style={{textAlign: 'center', fontSize: 13, marginBottom:10}}>이번달</Text>       
          </View>  
          </View>
         </View>
          <View>
            <Calendar
            markingType={'custom'}
              firstDay={1}
              hideExtraDays={true}
              current={this.state.Today}
              pastScrollRange={24}
              futureScrollRange={24}
              horizontal
              pagingEnabled
            // onDayPress={this.onModalClose}
            onDayPress={day=>this.onselectDate(day, null)}
              style={{borderTopWidth: 1, borderTopColor: '#d8d8d8'}}
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
          </View>        
         
           

          
        </View>
        </SideMenu>
      )
   
    
    
       
  }
}
Main5.propTypes = { 
  setLogout: PropTypes.func,
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
    borderWidth: 0.5,
    borderColor: '#d8d8d8'
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
       padding: 5},
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginTop: 0,
        paddingTop: 20,
        marginBottom: 0,
        marginHorizontal: 0,
        paddingHorizontal: 10
      }
    });