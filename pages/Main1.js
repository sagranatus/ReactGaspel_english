import React, { Component } from 'react';
import { Alert, Platform, StyleSheet, View, Text, TouchableOpacity, AsyncStorage, ActivityIndicator,  ScrollView, NetInfo, Modal, WebView, Linking, Image} from 'react-native';
import {Navigation} from 'react-navigation';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'
import Slideshow from 'react-native-image-slider-show';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/EvilIcons'
import Icon4 from 'react-native-vector-icons/Feather'
import Icon5 from 'react-native-vector-icons/AntDesign'
import RNFetchBlob from "rn-fetch-blob";
import {toShortFormat, dateFormat1} from '../etc/dateFormat';
var smallSize;
var normalSize;
var largeSize;
// english version!!
var urls = Array()


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
            'CREATE TABLE IF NOT EXISTS comment(reg_id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, onesentence TEXT NOT NULL, comment TEXT NOT NULL)',
            []
          );
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS lectio(reg_id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, onesentence TEXT NOT NULL, bg1 TEXT NOT NULL, bg2 TEXT NOT NULL, bg3 TEXT NOT NULL, sum1 TEXT NOT NULL, sum2 TEXT NOT NULL, js1 TEXT NOT NULL, js2 TEXT NOT NULL)',
            []
          );
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS weekend(reg_id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT NOT NULL, mysentence TEXT NOT NULL)',
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
      position: 1,
      interval: null,
      dataSource: [
      {
        url: Platform.OS == "ios" ? "http://sssagranatus.cafe24.com/resource/slide1.png" : ""
      }, {
        url: Platform.OS == "ios" ? "http://sssagranatus.cafe24.com/resource/slide2.png" : ""
      }, {
        url: Platform.OS == "ios" ? "http://sssagranatus.cafe24.com/resource/slide3.png" : ""
      },
    ], 
    position2: 1,
    interval2: null,
    dataSource2: [
      {
        url: Platform.OS == "ios" ? "http://sssagranatus.cafe24.com/resource/ad1.png" : ""
      }, {
        url: Platform.OS == "ios" ? "http://sssagranatus.cafe24.com/resource/ad2.png" : ""
      }
      
    ],
    initialLoading: true,
    url0: "",
    url1: "",
    url2: "",
    modalVisible: false,
    selectShow: false,
    selectQuestion:false
  
  }
 
  // slideshow 
  this.onModalClose = this.onModalClose.bind(this);
  this.onModalOpen = this.onModalOpen.bind(this);
  this.getSlideImagefromServer = this.getSlideImagefromServer.bind(this);
}
// slideshow 
getSlideImagefromServer(){
   //test 

   let dirs = RNFetchBlob.fs.dirs;
   console.log(dirs)
   RNFetchBlob.config({
     // add this option that makes response data to be stored as a file,
     // this is much more performant.
     path: dirs.SDCardApplicationDir + "/slide1.png",
     fileCache: false
   })
     .fetch(
       "GET",
       "http://sssagranatus.cafe24.com/resource/slide1.png",
       {
         //some headers ..
       }
     )
     .progress((received, total) => {
     
     })
     .then(res => {
    //  alert("done")
     });
 
     RNFetchBlob.config({
       // add this option that makes response data to be stored as a file,
       // this is much more performant.
       path: dirs.SDCardApplicationDir + "/slide2.png",
       fileCache: false
     })
       .fetch(
         "GET",
         "http://sssagranatus.cafe24.com/resource/slide2.png",
         {
           //some headers ..
         }
       )
       .progress((received, total) => {
       
       })
       .then(res => {
       // alert("done")
       });
 
       RNFetchBlob.config({
         // add this option that makes response data to be stored as a file,
         // this is much more performant.
         path: dirs.SDCardApplicationDir + "/slide3.png",
         fileCache: false
       })
         .fetch(
           "GET",
           "http://sssagranatus.cafe24.com/resource/slide3.png",
           {
             //some headers ..
           }
         )
         .progress((received, total) => {
         
         })
         .then(res => {
        //  alert("done")
         }); 
 
         RNFetchBlob.config({
          // add this option that makes response data to be stored as a file,
          // this is much more performant.
          path: dirs.SDCardApplicationDir + "/ad1.png",
          fileCache: false
        })
          .fetch(
            "GET",
            "http://sssagranatus.cafe24.com/resource/ad1.png",
            {
              //some headers ..
            }
          )
          .progress((received, total) => {
          
          })
          .then(res => {
         //  alert("done")
          }); 

          
         RNFetchBlob.config({
          // add this option that makes response data to be stored as a file,
          // this is much more performant.
          path: dirs.SDCardApplicationDir + "/ad2.png",
          fileCache: false
        })
          .fetch(
            "GET",
            "http://sssagranatus.cafe24.com/resource/ad2.png",
            {
              //some headers ..
            }
          )
          .progress((received, total) => {
          
          })
          .then(res => {
         //  alert("done")
          });
  
     this.setState( {dataSource: [
       {
         url: "file:///storage/emulated/0/Android/data/com.yellowpg.gaspel_en/slide1.png"
       }, {
         url: "file:///storage/emulated/0/Android/data/com.yellowpg.gaspel_en/slide2.png"
       }, {
         url: "file:///storage/emulated/0/Android/data/com.yellowpg.gaspel_en/slide3.png"
       }]}) 

       this.setState( {dataSource2: [
        {
          url: "file:///storage/emulated/0/Android/data/com.yellowpg.gaspel_en/ad1.png"
        }, {
          url: "file:///storage/emulated/0/Android/data/com.yellowpg.gaspel_en/ad2.png"
        },]}) 
 
}


componentWillMount(){
  // slideshow 
  if(Platform.OS !== "ios"){
    this.getSlideImagefromServer(); 
  }
  
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
        
      }else{
        console.log("Main1 - stacks in slide url : ", 'failed')
      }
    }).catch((error) => {
      console.error(error);
    });   
  
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

componentDidMount(){
  // slideshow interval 세팅
  this.setState({
    interval: setInterval(() => {
      this.setState({
        position: this.state.position === (Platform.OS == "ios" ? this.state.dataSource.length-1 : this.state.dataSource.length) ? 0 : this.state.position + 1
      });
    }, 5000),
    interval2: setInterval(() => {
      this.setState({
        position2: this.state.position2 === (Platform.OS == "ios" ? this.state.dataSource2.length-1 : this.state.dataSource2.length) ? 0 : this.state.position2 + 1
      });
    }, 2000)
  });
}

componentWillUnmount(){
  // slideshow interval 삭제
  clearInterval(this.state.interval2);
  clearInterval(this.state.interval);
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
        if(Platform.OS !== "ios"){
          this.getSlideImagefromServer(); 
        }else{
          this.setState({dataSource: [
            {
              url: "http://sssagranatus.cafe24.com/resource/slide1.png"
            }, {
              url: "http://sssagranatus.cafe24.com/resource/slide2.png"
            }, {
              url:  "http://sssagranatus.cafe24.com/resource/slide3.png"
            },
          ]});
          this.setState({dataSource2: [
            {
              url:  "http://sssagranatus.cafe24.com/resource/ad1.png"
            }, {
              url: "http://sssagranatus.cafe24.com/resource/ad2.png"
            }            
          ],
        });
        
      }
      
         // slide url 다시 가져오기
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
            
          }else{
            console.log("Main1 - stacks in slide url : ", 'failed')
          }
        }).catch((error) => {
          console.error(error);
        });   

        this.setState({initialLoading:true})
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
    <View style={{flex:1, backgroundColor:"#fff"}}>
      <View style={this.state.selectQuestion ? {flex:1,position: 'absolute', right:'0%', top:'0%', width:'100%', height:'100%', backgroundColor:"rgba(0,0,0, 0.7)", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>              
        <Text style={{color:"#fff", position: 'absolute', left:'24%', top:110}}>클릭하면 해당 내용을 읽을 수 있어요.</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'5%', top:210}}>오늘의 복음을 읽을 수 있어요.</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'5%', top:225, fontWeight:'bold', fontSize:16}}>   |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'55%', top:195}}>거룩한 독서를 하면 {"\n"}내용을 공유할 수 있어요.</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'55%', top:225, fontWeight:'bold', fontSize:16}}>   |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'32%', top:295}}>오늘의 복음 주제성구를 읽을 수 있어요.{"\n"}거룩한 독서를 하면 {"\n"}하느님께서 내게 주신 말씀을 볼 수 있어요.</Text>
     
        <Text style={{color:"#fff", position: 'absolute', left:'32%', top:430}}>주일의 복음 주제성구를 읽을 수 있어요.{"\n"}주일의 독서를 하면 {"\n"}한주간 묵상할 구절을 볼 수 있어요.</Text>
    

        <Text style={{color:"#fff", position: 'absolute', left:'5%', bottom:17}}>메인화면</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'8%', bottom:2, fontWeight:'bold', fontSize:16}}>   |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'29%', bottom:17}}>거룩한독서</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'34%', bottom:2, fontWeight:'bold', fontSize:16}}>   |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'54%', bottom:17}}>주일의독서</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'59%', bottom:2, fontWeight:'bold', fontSize:16}}>   |</Text>
        <Text style={{color:"#fff", position: 'absolute', left:'79%', bottom:17}}>나의페이지</Text>
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
       <Text style={[styles.TextStyle,{marginTop:5, padding:10, color:'#01579b', textAlign:'center'}, largeSize]}>{this.state.sentence_from}</Text>    
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
      <View style={{display:'none'}}>   
      <Image source={require('../resources/first_img1_2.png')} style={{width: '100%', height: 150}} />   
        <Slideshow 
          height={160}
          dataSource={this.state.dataSource}
          position={this.state.position}
          arrowSize={0}
          onPress={(end)=>[console.log(urls[end.index]), this.onModalOpen(urls[end.index])]}
          onPositionChanged={position => this.setState({ position })} />                    
      </View>            
      <View style={{backgroundColor: "#F9F9F9", flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center',  paddingBottom:5,  borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
      
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
            <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}> <Icon4 name={'book-open'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Read Today's Gospel</Text>   
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
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>God said to me:</Text>   
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
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>Sentence to Meditate for a week</Text>   
        </View>    
        <View style={this.state.mysentence !== "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '58%', height: 20, marginTop:5, marginLeft:'2%'}}>
         <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>Weekend's Gospel</Text>   
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
            <View style={[styles.modalButtons, Platform.OS=="ios" ? {marginTop:18}: {}]}>
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