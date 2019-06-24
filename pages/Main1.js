import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, View, Text, TouchableOpacity, AsyncStorage, ActivityIndicator,  ScrollView, NetInfo, Modal, WebView, Linking, Image} from 'react-native';
import {Navigation} from 'react-navigation';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/EvilIcons'
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon5 from 'react-native-vector-icons/AntDesign'
import RNFetchBlob from "rn-fetch-blob";
import firebase from 'react-native-firebase';

import {toShortFormat, dateFormat1} from '../etc/dateFormat';
var smallSize;
var normalSize;
var largeSize;
// english version!!

export default class Main1 extends Component { 

constructor(props) { 
  super(props)  

   // DB 테이블 생성
   db.transaction(function(txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
      [],
      function(tx, res) {
        console.log('FirstPage - item:', res.rows.length);
        if (res.rows.length == 0) {
         // txn.executeSql('DROP TABLE IF EXISTS comment', []);
        //  txn.executeSql('DROP TABLE IF EXISTS lectio', []);
         // txn.executeSql('DROP TABLE IF EXISTS weekend', []);
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS comment(reg_id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, onesentence TEXT NOT NULL, comment TEXT NOT NULL, place TEXT NOT NULL)',
            []
          );
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS lectio(reg_id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, onesentence TEXT NOT NULL, bg1 TEXT NOT NULL, bg2 TEXT NOT NULL, bg3 TEXT NOT NULL, sum1 TEXT NOT NULL, sum2 TEXT NOT NULL, js1 TEXT NOT NULL, js2 TEXT NOT NULL, place TEXT NOT NULL)',
            []
          );
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS weekend(reg_id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, mysentence TEXT NOT NULL, place TEXT NOT NULL)',
            []
          );
        }
      }
    );
  });

 
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
    initialLoading: true,
    selectShow: false,
    selectQuestion:false
  
  }
 
}



componentWillMount(){
  
  // fontSize 가져오기
  AsyncStorage.getItem('textSize', (err, result) => {
    if(result == "normal" || result == null){
      smallSize = {fontSize:15}
      normalSize = {fontSize:16}
      largeSize = {fontSize:17}
    }else if(result == "large"){
      smallSize = {fontSize:16}
      normalSize = {fontSize:17}
      largeSize = {fontSize:19}
    }else if(result == "larger"){
      smallSize = {fontSize:17}
      normalSize = {fontSize:19}
      largeSize = {fontSize:21}
    }
  })
  
  // 오늘날짜, 일요일 날짜 구하고 값 설정후 gaspel 가져오기   
  var today = dateFormat1("today")
  var todayShow = toShortFormat(new Date())
  var weekend = dateFormat1("weekend") // 주일날짜 세팅


  // 오늘날짜와 주일 날짜를 today1, weekend1에 저장 
  try {
    AsyncStorage.setItem('today1', today); //xxxx-xx-xx format
    AsyncStorage.setItem('weekend1', weekend);
  } catch (error) {
    console.error('AsyncStorage error: ' + error.message);
  }
  
  this.setState({today: today, todayDate_show:todayShow}) // today, todayDate_show에 값 설정
  this.props.getGaspel(today) //오늘 gaspel 가져오기 

  // 일요일인 경우 weekend true로 준다.
  var date = new Date();
  if(date.getDay() == 0){
    this.setState({weekend:true})
  }else{
    this.props.getGaspel(weekend) 
  }  

}


componentWillReceiveProps(nextProps){
      if(nextProps.gaspels.contents != null){
      console.log(nextProps.gaspels.contents) 
      console.log(nextProps.gaspels.person) 

      // 오늘날짜인 경우
      if(nextProps.gaspels.created_at == this.state.today){
      
        var contents = nextProps.gaspels.contents
        var firstdot = contents.indexOf(".");
      //  var firstsentence = contents.substring(0, firstdot)+"...";
        var firstsentence = contents.split(" ").splice(0,18).join(" ")+"...";
        var sentence_from = "Holy Gospel of Jesus Christ \naccording to Saint "+nextProps.gaspels.person;
        this.setState({contents: contents, sentence: firstsentence, todayDate: nextProps.gaspels.thisdate, place: nextProps.gaspels.person+" "+nextProps.gaspels.cv, sentence_from: sentence_from})
       
           
        var date = new Date();
        // 일요일인 경우는 today == 주일날짜이므로 여기서 sentence_weekend, place_weekend를 설정해줘야 한다.
        if(date.getDay() == 0){
          this.setState({sentence_weekend: firstsentence, place_weekend: nextProps.gaspels.person+" "+nextProps.gaspels.cv, sentence_from: sentence_from})
        }

        var date = new Date();
        var changed = toShortFormat(date)
        this.setState({deliver_date: changed})
       
       
        var year = date.getFullYear();
        var month = date.getMonth()+1
        var day = date.getDate();
        if(month < 10){
            month = "0"+month;
        }
        if(day < 10){
            day = "0"+day;
        } 
        // 오늘 DB값을 가져옴
        this.getData(year+"-"+month+"-"+day)  
      }else{
        // 주일의 내용 가져오기
        var contents = nextProps.gaspels.contents
        var firstsentence = contents.split(" ").splice(0,18).join(" ")+"...";
        this.setState({sentence_weekend: firstsentence, place_weekend: nextProps.gaspels.person+" "+nextProps.gaspels.cv})     
      } 
    }    
}

   setChange(){    
    console.log("Main1 setChange()")
     //textSize 바뀌는 경우
    AsyncStorage.getItem('textSize', (err, result) => {
      if(result == "normal" || result == null){
        smallSize = {fontSize:15}
        normalSize = {fontSize:16}
        largeSize = {fontSize:17}
      }else if(result == "large"){
        smallSize = {fontSize:16}
        normalSize = {fontSize:17}
        largeSize = {fontSize:19}
      }else if(result == "larger"){
        smallSize = {fontSize:17}
        normalSize = {fontSize:19}
        largeSize = {fontSize:21}
      }
    })

    // today, weekend날짜 얻어서 today1, weekend1과 비교
  
    var today = dateFormat1("today");

    // 일요일 경우는 weekend true, 아닌경우 false setting  
    var weekend = dateFormat1("weekend");

    // today1이 변경되거나 refreshMain1인 경우에는 getData()를 다시 불러온다.
    AsyncStorage.getItem('today1', (err, result) => {
      console.log("Main1 - get AsyncStorage today : ", result)
      if(result == today){
        console.log("today is same")
        AsyncStorage.getItem('refreshMain1', (err, result) => {
          console.log("Main1 - get AsyncStorage refresh : ", result)       
          if(result == "refresh"){            
              // refreshMain1 refresh 하는 경우
           this.setState({initialLoading:true})
            try {
              this.getData(today)
              AsyncStorage.setItem('refreshMain1', 'no');
            } catch (error) {
                console.error('AsyncStorage error: ' + error.message);
            }
          }else{
          }
        });     
        
      }else{       
        // today1 달라진 경우     
        console.log("today is different")
        try {
            AsyncStorage.setItem('today1', today);
            this.setState({today: today})
            this.props.getGaspel(today)
        } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
        }
      }
    })

    //  weekend날짜가 같은 경우는 두고, 다른 경우만 주일 값을 가져옴
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
    var date_weekend = dateFormat1("weekend");
   
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM comment where date = ?',
        [today],
        (tx, results) => {
          var len = results.rows.length;
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
        'SELECT * FROM lectio where date = ?',
        [today],
        (tx, results) => {
            var len = results.rows.length;
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
          'SELECT * FROM weekend where date = ?',
          [date_weekend],
          (tx, results) => {
              var len = results.rows.length;
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
 

render() { 
  const Banner = firebase.admob.Banner;
  const AdRequest = firebase.admob.AdRequest;
  const request = new AdRequest();

  const unitId =
    Platform.OS === 'ios'
      ? 'ca-app-pub-7987914246691031/4248107679'
      : 'ca-app-pub-3940256099942544/6300978111';
    //ca-app-pub-7847407199304521/4831009991 실제값
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
        <Text style={{color:"#fff", position: 'absolute', left:'3%', top:85}}>You can read Today's Gospel.</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'4%', top:100, fontWeight:'bold', fontSize:16}}>   |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'53%', top:70}}>You can share {"\n"}when you do Lectio Divina.</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'53%', top:100, fontWeight:'bold', fontSize:16}}>   |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'15%', top:170}}>You can read First line of Gospel.{"\n"}If you do Lectio Divina,{"\n"}you can see what God told you.</Text>
     
        <Text style={{color:"#fff", position: 'absolute', left:'15%', top:305}}>You can read First line of Gospel(Lord's Day).{"\n"}If you do Lectio Divina(Lord's Day),{"\n"}you can see a verse to comtemplate for a week.</Text>
    

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
          style={{position: 'absolute', right:'4%', top:8}}
          onPress={() => this.setState({selectQuestion:false}) } 
          >    
            <Icon5 name={'closecircle'} size={22} color={"#fff"} />        
        </TouchableOpacity>           
      </View>     
    <View style={this.state.selectShow ? {flex:1,position: 'absolute', right:'2%', top:'8%', width:'96%', height:500, backgroundColor:"#fff", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>              
    <ScrollView 
    style={{flex:1, marginLeft:5, marginRight:5, paddingBottom:200, marginBottom:20}}
     onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })}>   
       <Text style={[styles.TextStyle,{marginTop:3, padding:10, color:'#000', textAlign:'center', fontSize:14}]}>{this.state.todayDate}</Text>    
       <Text style={[styles.TextStyle,{marginTop:15, color:'#01579b', textAlign:'center'}, largeSize]}>{this.state.sentence_from}</Text>    
       <Text style={[styles.TextStyle,{marginTop:3, paddingBottom:0, color:'#01579b', textAlign:'center', fontSize:14}]}>{this.state.place}</Text>
       <Text style={[styles.TextStyle,{marginTop:0, padding:5, color:'#000', textAlign:'left', lineHeight:22},  smallSize]}>{this.state.contents}</Text>   
       <View style={{flex:1, justifyContent: 'center', alignItems: 'center', marginTop:10, marginBottom:10}}>
       <TouchableOpacity 
          activeOpacity = {0.9}  
          style={this.state.js2 == "" && this.state.comment == "" ? {width:150, borderWidth:1, borderColor:'#4e99e0', borderRadius:2, padding:5} : {display:'none'}}        
          onPress = {() => this.state.weekend ? this.props.navigation.navigate('Main4') : this.props.navigation.navigate('Main3')}
          >    
           <Text style={[{fontSize:14, textAlign:'center', color:'#4e99e0', textAlign:'center'}]}>Go Lectio Divina</Text>    
        </TouchableOpacity>        
      </View>
     </ScrollView>
     <TouchableOpacity 
       activeOpacity = {0.9}
       style={{position: 'absolute', right:5, top:5}}
       onPress={() => this.setState({selectShow:false}) } 
       >    
         <Icon2 name={'close'} size={30} color={"#000"} />        
     </TouchableOpacity>           
   </View>     

   <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', backgroundColor:'#fff'}}>  
      <View style={{flexDirection: "column", flexWrap: 'wrap', width: '88%', height: 30, marginTop:10, paddingLeft:'1%'}}>
        <Text style={[ styles.TextStyle, {fontSize:17, textAlign:'left', fontFamily:'NanumMyeongjoBold'}]}>Today's Gospel</Text>
      </View>
      
      <View style={{flexDirection: "column", flexWrap: 'wrap', width: '8%', height: 30, marginLeft:'0%', float:'right'}}>
        <TouchableOpacity 
        activeOpacity = {0.9}
        onPress={() => [this.setState({selectQuestion:true, selectShow: false}),  this.fScroll.scrollTo({y: 0})]} // insertComment
        >      
        <Icon5 name={'questioncircleo'} size={22} color={"#000"} style={{paddingTop:9}} />
        </TouchableOpacity>
      </View>
    </View>
    <ScrollView 
    style={{backgroundColor:'#fff'}} 
    ref={(e) => { this.fScroll = e }}>    

      <NavigationEvents
      onWillFocus={payload => {console.log(payload),
        this.setChange();
      }} />        
      <View style={{backgroundColor: "#F9F9F9", flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center',  paddingBottom:5,  borderBottomColor:"#d8d8d8", borderBottomWidth:0.5, borderTopColor:"#d8d8d8", borderTopWidth:0.5}}>  
      
        <View style={{flexDirection: "column", flexWrap: 'wrap', width: '100%', height: 30, marginTop:5}}>
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#686868'}]}>{this.state.todayDate}</Text>   
        </View>   
        <View style={{flexDirection: "column", flexWrap: 'wrap', width: '100%', height: 20, marginTop:5}}>
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#686868'}]}>{this.state.todayDate_show}</Text>   
        </View>   
      </View>
      
      <View style={{backgroundColor: "#fff", flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop:5, alignItems: 'center',  padding:10, paddingBottom:15, borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
          <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5,flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center',   alignItems: 'center',  width: '48%', marginRight:'3%', height:40}}>
          <TouchableOpacity 
            activeOpacity = {0.9}
            onPress={() => this.setState({selectShow:true})} // insertComment
            >  
            <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}> <Icon4 name={'book-open-page-variant'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Read Today's Gospel</Text>   
          </TouchableOpacity>
          </View>   
          <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '48%', height: 40}}>
          <TouchableOpacity 
            activeOpacity = {0.9}
            onPress={() => this.state.js2 !== "" || this.state.comment !== "" ? this.props.navigation.navigate('SendImage', {otherParam: "Main1", otherParam2: this.state.today}) :
            Alert.alert(
              'Go for doing Lectio Divina?',
              'you didn\'t do lectio divina yet. would you share what you meditate after doing it?',
              [                                 
                {
                text: 'cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
                },
                {text: 'Go Lectio Divina', onPress: () => 
                  this.state.weekend ? this.props.navigation.navigate('Main4') : this.props.navigation.navigate('Main3')
                },
              ],
              {cancelable: true},
              )        
          } // insertComment
            >  
            <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon name={'send-o'} size={18} color={"#4e99e0"} style={{paddingTop:9}} />  Share Today's Gospel</Text>   
            </TouchableOpacity>
          </View>   
        </View>
      <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center',  paddingBottom:10,  borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
        <View style={this.state.comment == "" && this.state.js2 == "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginLeft:'2%'}}>
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>God said to me today:</Text>   
        </View> 
        <View style={this.state.comment == "" && this.state.js2 == "" ? {flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginLeft:'2%'} : {display:'none'} }>
         <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>Today's Gospel</Text>   
        </View>  
        <View style={{flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginRight:'2%'}}>
          <Text style={[ styles.TextStyle, {fontSize:15, textAlign:'right', color:'#686868'}]}></Text>   
        </View>  
        <Icon style={{paddingTop:5}} name={'quote-left'} size={13} color={"#000"} />
        <View style={this.state.js2 == "" && this.state.comment == "" ? {width:'100%',justifyContent: 'center', alignItems: 'center'}: {display:'none'}}>
          <Text style={[normalSize, styles.TextStyle,{padding:0}]}>{this.state.sentence}</Text>   
          <Text style={[styles.TextStyle, {fontSize:14, width:'100%', marginTop:0}]}>{this.state.place}</Text>
          <View
          style={{
            width:90,
            textAlign:'center',
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            marginBottom:5
          }}
        />
        </View> 
        <View style={this.state.js2 == "" && this.state.comment !== "" ? {width:'100%', paddingBottom:5}: {display:'none'}}>
          <Text style={[normalSize, styles.TextStyle,{marginTop:10, padding:5, color:'#01579b', marginBottom:5}]}>{this.state.comment}</Text>   
        </View>  
        <View style={this.state.js2 !== "" ? {width:'100%', paddingBottom:5}: {display:'none'}}>
          <Text style={[normalSize, styles.TextStyle,{marginTop:5, padding:5, color:'#01579b'}]}>{this.state.js2}</Text>   
        </View> 
       
      </View>

      <View style={!this.state.weekend ? {flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center',  paddingBottom:10, borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}: {display:'none'}}>  
        <View style={this.state.mysentence == "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '58%', height: 20, marginTop:5, marginLeft:'2%'}}>
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>A Verse to Meditate for a week</Text>   
        </View>    
        <View style={this.state.mysentence !== "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '58%', height: 20, marginTop:5, marginLeft:'2%'}}>
         <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>Gospel of Lord's day</Text>   
        </View>  
        <View style={{flexDirection: "column", flexWrap: 'wrap', width: '38%', height: 20, marginTop:5, marginRight:'2%'}}>
          <Text style={[ styles.TextStyle, {fontSize:15, textAlign:'right', color:'#686868'}]}></Text>   
        </View>    

        <Icon style={{paddingTop:5}} name={'quote-right'} size={13} color={"#000"} />
        <Text style={this.state.mysentence == "" ? {display:'none'} : [normalSize, styles.TextStyle,{marginTop:5, padding:5, color:'#01579b'}]}>{this.state.mysentence}</Text>   
        <Text style={this.state.mysentence == "" ? [normalSize, styles.TextStyle,{padding:0}] : {display:'none'}}>{this.state.sentence_weekend}</Text>
        <Text style={this.state.mysentence == "" ? [styles.TextStyle, {fontSize:14, width:'100%', marginTop:0}]: {display:'none'}}>{this.state.place_weekend}</Text>   
        <View
          style={this.state.mysentence == "" ? 
          {
            width:90,
            textAlign:'center',
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            marginBottom:5
          } : {display:'none'}
        }
        />   
      </View>

      <View style={this.state.weekend & this.state.mysentence !== "" ? {flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center',  paddingBottom:10, borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}: {display:'none'}}>  
        <View style={this.state.mysentence == "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginLeft:'2%'}}>
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>한주간 묵상할 구절</Text>   
        </View>         
        <View style={{flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginRight:'2%'}}>
         <Text style={[ styles.TextStyle, {fontSize:15, textAlign:'right', color:'#686868'}]}></Text>   
        </View>    
        <Icon style={{paddingTop:5}} name={'quote-right'} size={13} color={"#000"} />
        <Text style={[normalSize, styles.TextStyle,{marginTop:10, paddingLeft:20, paddingRight:20, padding:5, color:'#01579b'}]}>{this.state.mysentence}</Text>        
      </View>
        
      <Banner
          unitId={unitId}
          size={'SMART_BANNER'}
          request={request.build()}
          onAdLoaded={() => {
            console.log('Advert loaded');
          }}
          onAdFailedToLoad={(error) => {
            console.log(error)
          }}
        />
    </ScrollView>  
    </View>
      )
      
  }
}
Main1.propTypes = { 
    getGaspel: PropTypes.func,
    gaspels: PropTypes.object // gaspelaction 결과값
  };
  
const styles = StyleSheet.create({
  MainContainer :{     
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    margin: 0,
    color:"#fff"
    },    
    TextStyle:{
      color:'#000', 
      textAlign: 'center', 
      width:'100%',
      marginBottom:3
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
    Button:{
      backgroundColor: '#01579b', 
      padding: 10, 
      marginBottom:5, 
      width:'100%'
    },
    modalContent: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: 0,
      backgroundColor: '#fff'
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