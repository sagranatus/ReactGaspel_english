import React, { Component } from 'react';
 
import { PermissionsAndroid, ScrollView, TouchableHighlight, Alert, Keyboard, TextInput, Platform, PushNotificationIOS, StyleSheet, View, Text, TouchableOpacity, AsyncStorage, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { SelectMultipleGroupButton } from 'react-native-selectmultiple-button'
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'
import DateTimePicker from 'react-native-modal-datetime-picker';
import RNFetchBlob from 'rn-fetch-blob';
import XLSX from 'xlsx';
var PushNotification = require('react-native-push-notification');
// react-native-fs
import { writeFile, readFile, DocumentDirectoryPath } from 'react-native-fs';
const DDP = DocumentDirectoryPath + "/";
const input = res => res;
const output = str => str;


var normalSize;
var largeSize;
var textSize;
var course;
var commentContents = [['date', 'from', 'comment']]
var lectioContents = [['date', 'from', 'background1','background2','background3', 'sum1', 'sum2', 'js1', 'js2']]
var weekendContents = [['date', 'mysentence']]
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

async createPDF() {
 /* let options = {
    html: commentContents+"<br />"+lectioContents+"<br />"+weekendContents,
    fileName: 'test',
    directory: 'Download',
  };

  let file = await RNHTMLtoPDF.convert(options)
  // console.log(file.filePath);
  alert(file.filePath);
  console.log(file.filePath); */


  /* convert AOA back to worksheet */
  //const allarray = commentContents.concat(lectioContents, weekendContents)
  const ws = XLSX.utils.aoa_to_sheet(commentContents);
  const ws2 = XLSX.utils.aoa_to_sheet(lectioContents);
  const ws3 = XLSX.utils.aoa_to_sheet(weekendContents);
  const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/Today_Gaspel_data.xlsx`;

  /* build new workbook */
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Comment Data");
  XLSX.utils.book_append_sheet(wb, ws2, "Lectio Divina Data");
  XLSX.utils.book_append_sheet(wb, ws3, "Weekend Data");
  /* write file */
  const wbout = XLSX.write(wb, {type:'binary', bookType:"xlsx"});
  writeFile(pathToWrite, output(wbout), 'ascii').then(() => {
    //  console.log(`wrote file ${pathToWrite}`);
    Alert.alert("Download Completed.")
      // wrote file /storage/emulated/0/Download/data.csv
    })
    .catch(error => console.error(error));
  }


constructor(props) { 
    super(props)  
    this.state = {
      time: "",
      isDateTimePickerVisible: false,
      fireDate: '',
			update: '',
      futureFireDate: '0',
      isPermitted: false,
      getData : "false"
    }
    this.setAlarm = this.setAlarm.bind(this);
    this.getDB = this.getDB.bind(this);
   
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
        alertTitle:"Lectio Divina Alarm",
        alertBody: "It's time to do Lectio Divina. Listen to what God tell you.", // (required)
  // fireDate: new Date(2019,3,5,14,24,0).toISOString(), // in 60 secs
       fireDate:new Date(year, month, day, hour, minutes, 0).toISOString(),
        repeatInterval: 'day'
      });
    }else{
      PushNotification.localNotificationSchedule({
        id: '123',
        message: "It's time to do Lectio Divina. Listen to what God tell you.", // (required)
        date: new Date(month+'/'+day+'/'+year+' '+this.state.time), // in 60 secs
        vibrate: true, // (optional) default: true
        vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
        playSound: true, // (optional) default: true
        repeatType: 'day'
      }); 
    } 


  };
  
  getDB(){
   // alert("haha")
   this.setState({initialLoading: true})
    db.transaction(tx => {
      tx.executeSql(
       'SELECT * FROM comment ORDER BY reg_id ASC',
       [],
       (tx, results) => {
         var len = results.rows.length;
         if (len > 0) {  
            // commentContents = "<h1 style='text-align: center;'><strong>Comment Table</strong></h1><table style='text-align: center;'><tr><th style='width:20%'>Date</th><th style='width:40%'>OneSentence</th><th style='width:40%'>Comment</th></tr>";
             var date, onesentence, comment;             
             var valueToPush = new Array();
             for(var i=0; i<results.rows.length; i++){
              valueToPush = new Array();
             
               date = results.rows.item(i).date
               onesentence = results.rows.item(i).onesentence
               comment = results.rows.item(i).comment    
              // alert(onesentence)
               valueToPush[0] = date;
               valueToPush[1] = onesentence   
               valueToPush[2] = comment   
               commentContents.push(valueToPush);
              // commentContents = commentContents + "<tr><td style='width:20%'>"+ date + "</td><td style='width:40%'>" + onesentence + "</td><td style='width:40%'>" + comment + "</td></tr>";
               // 모든 값을 commentDates 배열에 저장             
                if(i == results.rows.length-1){
                //  commentContents = commentContents + "</table>";
               //   alert(commentContents[0])
              
                }               
              }            
                         
         } else {                  
           console.log('Main5 - get Comments data : ', "no value")   
         }
       }
     ),
     tx.executeSql(
      'SELECT * FROM lectio ORDER BY reg_id ASC',
      [],
      (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {                  
         // lectioContents = "<h1 style='text-align: center;'><strong>Lectio Divina Table</strong></h1><table style='text-align: center;'><tr><th style='width:10%'>Date</th><th style='width:15%'>OneSentence</th><th style='width:15%'>Backgrounds</th><th style='width:15%'>Summary</th><th>Summary2</th><th style='width:15%'>Jesus Feature</th><th style='width:15%'>Jesus2</th></tr>";
          var date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2, mysentence;
          var valueToPush = new Array();
          for(var i=0; i<results.rows.length; i++){
            valueToPush = new Array();
            
            date = results.rows.item(i).date
            onesentence = results.rows.item(i).onesentence
            bg1 = results.rows.item(i).bg1
            bg2 = results.rows.item(i).bg2
            bg3 = results.rows.item(i).bg3
            sum1 = results.rows.item(i).sum1
            sum2 = results.rows.item(i).sum2
            js1 = results.rows.item(i).js1
            js2 = results.rows.item(i).js2  
            valueToPush[0] = date;
            valueToPush[1] = onesentence   
            valueToPush[2] = bg1
            valueToPush[3] = bg2
            valueToPush[4] = bg3
            valueToPush[5] = sum1
            valueToPush[6] = sum2
            valueToPush[7] = js1
            valueToPush[8] = js2
            lectioContents.push(valueToPush);
           // lectioContents = lectioContents + "<tr><td style='width:10%'>"+ date + "</td><td style='width:15%'>" + onesentence + "</td><td style='width:15%'>" + bg1 +"/"+bg2+"/"+bg3+  "</td><td style='width:15%'>" + sum1+ "</td><td style='width:15%'>"+ sum2+  "</td><td style='width:15%'>"+js1+ "</td><td style='width:15%'>"+js2+"</td></tr>";
            // 모든 값을 commentDates 배열에 저장             
             if(i == results.rows.length-1){
             // lectioContents = lectioContents + "</table>";
             //  alert(lectioContents)
             }               
           }             
            
        } else {
          console.log('get Lectios data : ', "no value")   
        }
      }
    ),
    tx.executeSql(
      'SELECT * FROM weekend ORDER BY reg_id ASC',
      [],
      (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {                  
        //  weekendContents = "<h1 style='text-align: center;'><strong>Weekend MySentence Table</strong></h1><table style='text-align: center;'><tr><th style='width:30%'>Date</th><th style='width:70%'>My sentence</th></tr>";
          var date, mysentence;
          var valueToPush = new Array();
          for(var i=0; i<results.rows.length; i++){
            valueToPush = new Array();
            date = results.rows.item(i).date
            mysentence = results.rows.item(i).mysentence
            valueToPush[0] = date;
            valueToPush[1] = mysentence  
            weekendContents.push(valueToPush);
          //  weekendContents = weekendContents + "<tr><td style='width:30%'>"+ date +"</td><td style='width:70%'>" + mysentence+"</td></tr>";
            // 모든 값을 commentDates 배열에 저장             
             if(i == results.rows.length-1){
            //  weekendContents = weekendContents + "</table>";
            //   alert(weekendContents)
               this.createPDF()
               this.setState({initialLoading: false, getData: 'true'})
             }               
           }             
            
        } else {
          console.log('get Lectios data : ', "no value")   
          this.createPDF()
          this.setState({initialLoading: false, getData: 'true'})
        }
      }
    );
   });  
  }
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
    
async function requestExternalWritePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'CameraExample App External Storage Write Permission',
        message:
          'CameraExample App needs access to Storage data in your SD Card ',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //If WRITE_EXTERNAL_STORAGE Permission is granted
      //changing the state to show Create PDF option
      that.setState({ isPermitted: true });
    } else {
     // alert('WRITE_EXTERNAL_STORAGE permission denied');
    }
  } catch (err) {
  //  alert('Write permission err', err);
   // console.warn(err);
  }
}
//Calling the External Write permission function

  requestExternalWritePermission();
  AsyncStorage.getItem('name', (err, result) => {
    this.setState({UserName : result})
  })
  AsyncStorage.getItem('catholic_name', (err, result) => {
    this.setState({UserCatholicName : result})
  })

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
UpdateUserFunction(){
  Keyboard.dismiss()
  try {
    AsyncStorage.setItem('name', this.state.UserName);
    AsyncStorage.setItem('catholic_name', this.state.UserCatholicName);
    AsyncStorage.setItem('refreshNames', 'true');
    Alert.alert("수정하였습니다.") 
  } catch (error) {
    console.error('AsyncStorage error: ' + error.message);
  }   
}
setChanges(){
  this.setState({getData : "false"})
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
    if(selectedValues == "normal"){
      AsyncStorage.setItem('textSize', 'normal');
    }else if(selectedValues == "large"){
      AsyncStorage.setItem('textSize', 'large');
    }else if(selectedValues == "very large"){
      AsyncStorage.setItem('textSize', 'larger');
    }else if(selectedValues == "Simple Meditation"){
      AsyncStorage.setItem('course', 'basic');
    }else if(selectedValues == "Lectio Divina"){
      AsyncStorage.setItem('course', 'advanced');
    }else if(selectedValues == "unselected"){
      AsyncStorage.setItem('course', 'notselected');
    }
    var result  = selectedValues;
    if(result == "normal" || result == null){
      normalSize = {fontSize:15}
      largeSize = {fontSize:17}
    }else if(result == "large"){
      normalSize = {fontSize:17}
      largeSize = {fontSize:19}
    }else if(result == "very large"){
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
  <ScrollView style={{flex:1}}>    
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
            {"<"} back
        </Text>
      </TouchableOpacity>  
      <Text style={[{marginTop:10, marginBottom:10, textAlign:'center'},normalSize]}>Set your Name and Christian name</Text>      
      <View style={{  justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap', margin: 0 }}>
      <TextInput                
      placeholder="Name"       
      value={this.state.UserName} 
      onChangeText={UserName => this.setState({UserName})}  
      underlineColorAndroid='transparent'        
      style={[styles.TextInputStyleClass, {width:'49%'},normalSize]}
      />
        <TextInput                
      placeholder="Christian name"        
      value={this.state.UserCatholicName}
      onChangeText={UserCatholicName => this.setState({UserCatholicName})}        
      underlineColorAndroid='transparent'        
      style={[styles.TextInputStyleClass, {width:'49%'}, normalSize]}
      />
      </View>
       <View style={{width:'100%',  justifyContent: 'center',  alignItems: 'center', marginBottom:10}}>
        <TouchableOpacity 
        activeOpacity = {0.9}
        style={styles.Button}
        onPress={()=> this.UpdateUserFunction()} 
        >
        <Text style={{color:"#fff", textAlign:'center'}}>
        Save
        </Text>
        </TouchableOpacity>      
      </View>
      <Text style={[{marginTop:10, paddingTop:10, marginBottom:10, textAlign:'center', borderTopWidth: 0.5, borderTopColor: '#d8d8d8'},normalSize]}>Select Text Size</Text>      
      <SelectMultipleGroupButton
        multiple={false}
        group={[
          { value: 'normal' },
          { value: 'large' },
          { value: 'very large' }]}
        defaultSelectedIndexes={textSize}
        buttonViewStyle={{ flex: 1, margin: 0, borderRadius: 0 }}
        highLightStyle={{
          borderColor: '#01579b', textColor: '#01579b', backgroundColor: '#fff',
          borderTintColor: '#01579b', textTintColor: 'white', backgroundTintColor: '#01579b'
        }}
        onSelectedValuesChange={(selectedValues) => this.setChange(selectedValues)}
      />

      <Text style={[{marginTop:20, paddingTop:10, marginBottom:10, textAlign:'center', borderTopWidth: 0.5, borderTopColor: '#d8d8d8'},normalSize]}>Select Simple Meditation / Lectio Divina</Text>    
      <SelectMultipleGroupButton
        multiple={false}
        group={[
          { value: 'unselected' },
          { value: 'Simple Meditation' },
          { value: 'Lectio Divina' }]}
        defaultSelectedIndexes={course}
        buttonViewStyle={{ flex: 1, margin: 0, borderRadius: 0 }}
        highLightStyle={{
          borderColor: '#01579b', textColor: '#01579b', backgroundColor: '#fff',
          borderTintColor: '#01579b', textTintColor: 'white', backgroundTintColor: '#01579b'
        }}
        onSelectedValuesChange={(selectedValues) => this.setChange(selectedValues)}
      />
      <Text style={{margin:5, fontSize:14}}>* when you select one, selection window does not open.</Text>
     
      <Text style={[{marginTop:10, paddingTop:10, marginBottom:10, textAlign:'center', borderTopWidth: 0.5, borderTopColor: '#d8d8d8'},normalSize]}>Alarm Setting</Text>
      <View style={{width:'100%',  justifyContent: 'center',  alignItems: 'center', marginBottom:10}}>
        <TouchableOpacity 
        style={[styles.Button, {marginTop:0}]}
        onPress={this._showDateTimePicker}>
          <Text style={{color:"#fff", textAlign:'center', fontWeight:'bold'}}>Set Alarm</Text>         
        </TouchableOpacity>
      </View>

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
         <Text style={{fontSize:14, textAlign:'center'}}>Clear Alarm</Text>         
        </TouchableOpacity>
      </View>    

      <Text style={[{marginTop:10, paddingTop:10, marginBottom:10, textAlign:'center', borderTopWidth: 0.5, borderTopColor: '#d8d8d8'},normalSize]}>Download Database as excel</Text>
      <View style={{width:'100%',  justifyContent: 'center',  alignItems: 'center', marginBottom:10}}>
      <TouchableOpacity 
        activeOpacity = {0.9}
        style={styles.Button}
        onPress={()=> this.getDB()} 
        >
        <Text style={{color:"#fff", textAlign:'center'}}>
        Download Database
        </Text>
        </TouchableOpacity>                  
      <Text style={this.state.getData=="true" ? {textAlign:'center'} : {display:'none'}}>Excel file have been downloaded on Download Folder.</Text>
      </View>
    </ScrollView>
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
   
    });