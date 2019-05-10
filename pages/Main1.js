import React, { Component } from 'react';
import { Platform, PanResponder, StyleSheet, View, Text, TouchableOpacity, AsyncStorage, ActivityIndicator,  ScrollView, NetInfo, Modal, WebView, Linking, Image} from 'react-native';
import {Navigation} from 'react-navigation';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'
import Slideshow from 'react-native-image-slider-show';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/EvilIcons'
import Icon3 from 'react-native-vector-icons/Ionicons'
import RNFetchBlob from "rn-fetch-blob";
var smallSize;
var normalSize;
var largeSize;

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
    selectShow: false
  
  }
 
  this.onModalClose = this.onModalClose.bind(this);
  this.onModalOpen = this.onModalOpen.bind(this);
  this.getSlideImagefromServer = this.getSlideImagefromServer.bind(this);
}

urlSetting(){
  this.setState({reload:true})
}

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
         url: "file:///storage/emulated/0/Android/data/com.yellowpg.gaspel/slide1.png"
       }, {
         url: "file:///storage/emulated/0/Android/data/com.yellowpg.gaspel/slide2.png"
       }, {
         url: "file:///storage/emulated/0/Android/data/com.yellowpg.gaspel/slide3.png"
       }]}) 

       this.setState( {dataSource2: [
        {
          url: "file:///storage/emulated/0/Android/data/com.yellowpg.gaspel/ad1.png"
        }, {
          url: "file:///storage/emulated/0/Android/data/com.yellowpg.gaspel/ad2.png"
        },]}) 
 
}
componentWillMount(){
  if(Platform.OS !== "ios"){
    this.getSlideImagefromServer(); 
  }
  
  this._panResponder = PanResponder.create({
    onMoveShouldSetResponderCapture: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: (e, gestureState) => {
      this.fScroll.setNativeProps({ scrollEnabled: false })
    },
    onPanResponderMove: () => {

    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: () => {
      this.fScroll.setNativeProps({ scrollEnabled: true })
    },
  })

  console.log("Main1 - componentWillMount : ", this.props.status.isLogged + this.props.status.loginId)

  // 로그인 상태값 가져오고 없으면 FirstPage이동, 값이 있으면 setLogin
  AsyncStorage.getItem('login_id', (err, result) => {
    console.log("Main1 - login_id : ", result)
    if(result == null){      
      this.props.navigation.navigate('Home') 
    }else{
      this.props.setLogin(result) 
    }             
    })

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
          this.urlSetting()
        
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
  var todayShow =  year+"년"+month+"월"+day+"일";

  // 일요일날짜 구하기
  if(date.getDay() !== 0){ 
    var lastday = date.getDate() - (date.getDay() - 1) - 1;
    date = new Date(date.setDate(lastday));
  }else{
    // 일요일인 경우에는 그대로 값을 가져옴 
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
  var weekend = year+"-"+month+"-"+day; // 주일날짜 세팅


  // 오늘날짜와 주일 날짜를 today1, weekend1에 저장 
  try {
    AsyncStorage.setItem('today1', today);
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
  // interval 삭제
  clearInterval(this.state.interval2);
  clearInterval(this.state.interval);
}


componentWillReceiveProps(nextProps){
    if(nextProps.status.isLogged == this.props.status.isLogged){
      if(nextProps.gaspels.sentence != null){
      console.log(nextProps.gaspels.sentence) 
      console.log(nextProps.gaspels.thisdate) 

      // 오늘날짜인 경우
      if(nextProps.gaspels.created_at == this.state.today){
        var contents = ""+nextProps.gaspels.contents
        var start = contents.indexOf("✠");
        var end = contents.indexOf("◎ 그리스도님 찬미합니다");
        contents = contents.substring(start, end);
        contents = contents.replace(/&ldquo;/gi, "");
        contents = contents.replace(/&rdquo;/gi, "");
        contents = contents.replace(/&lsquo;/gi, "");
        contents = contents.replace(/&rsquo;/gi, "");
        contents = contents.replace(/&prime;/gi, "'");
        contents = contents.replace("주님의 말씀입니다.", "\n주님의 말씀입니다.");

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
            today_person = contents.substring(2,idx_today-2); 
        }else{
            today_person = contents.substring(2,idx_today-2);
        }

        var place = today_person+" "+pos
        console.log("place", place)
        place = place.replace(/\n/gi, "");   
        // sentence, todayDate, place state setting
        this.setState({contents: contents, sentence: nextProps.gaspels.sentence, todayDate: nextProps.gaspels.thisdate, place: place})
        
        var date = new Date();
        // 일요일인 경우는 today == 주일날짜이므로 여기서 sentence_weekend, place_weekend를 설정해줘야 한다.
        if(date.getDay() == 0){
          this.setState({sentence_weekend: nextProps.gaspels.sentence, place_weekend: place})
        }
        var changed = this.changeDateFormat(date)
        // 오늘 DB값을 가져옴
        this.getData(changed)  
      }else{
        // 주일 내용인 경우
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
          // 주일 sentence, place state setting 
          place = place.replace(/\n/gi, "");  
          this.setState({sentence_weekend: nextProps.gaspels.sentence, place_weekend: place})
      } 
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

    // 일요일 경우는 weekend true, 아닌경우 false setting
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
              this.urlSetting()
            
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
    const loginId = this.props.status.loginId 
    var date = new Date()
    console.log(date)
    if(date.getDay() !== 0){
        var lastday = date.getDate() - (date.getDay() - 1) - 1;
        date = new Date(date.setDate(lastday));
    }else{
       // 일요일인 경우에는 그대로 값을 가져옴 
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
    <ScrollView 
    style={{backgroundColor:'#fff'}} 
    ref={(e) => { this.fScroll = e }}>    

     <View style={this.state.selectShow ? {flex:1,position: 'absolute', right:'2%', top:'8%', width:'96%', height:'80%', backgroundColor:"#fff", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>              
       <ScrollView 
       style={{flex:1, marginLeft:5, marginRight:5, paddingBottom:200, marginBottom:20}}
        {...this._panResponder.panHandlers}
        onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })}>   
          <Text style={[styles.TextStyle,{marginTop:3, padding:10, color:'#000', textAlign:'center', fontSize:14}]}>{this.state.todayDate}</Text>    
          <Text style={[styles.TextStyle,{marginTop:5, padding:10, color:'#01579b', textAlign:'center'}, normalSize]}>{this.state.sentence}</Text>    
          <Text style={[styles.TextStyle,{marginTop:5, padding:5, color:'#000', textAlign:'left', lineHeight:22},  smallSize]}>{this.state.contents}</Text>           
        </ScrollView>
        <TouchableOpacity 
          activeOpacity = {0.9}
          style={{position: 'absolute', right:2, top:2}}
          onPress={() => this.setState({selectShow:false}) } 
          >    
            <Icon2 name={'close'} size={30} color={"#000"} />        
        </TouchableOpacity>           
      </View>     

      <NavigationEvents
      onWillFocus={payload => {console.log(payload),
        this.setChange();
      }} />
      <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', backgroundColor:'#fff'}}>  
        <View style={{flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 30, marginTop:10, marginLeft:'1%'}}>
        <TouchableOpacity 
          activeOpacity = {0.9}
          onPress={() => this.setState({selectShow:true})} // insertComment
          >  
          <Image source={require('../resources/ic_launcher.png')} style={{width: 20, height: 20}} />    
          </TouchableOpacity>          
          <Text style={[ styles.TextStyle, {fontSize:17, textAlign:'left', fontFamily:'NanumMyeongjoBold', paddingLeft:3}]}>오늘의복음</Text>
           
        </View>
        <View style={{flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 30, marginTop:10, marginLeft:'0%', paddingLeft:'40%', float:'right'}}>
          <TouchableOpacity 
          activeOpacity = {0.9}
          onPress={() => this.props.navigation.navigate('Guide')} // insertComment
          >      
          <Image source={require('../resources/info.png')} style={{width: 20, height: 20}} />       
          </TouchableOpacity>
        </View>
      </View>
  
      <View>      
        <Slideshow 
          dataSource={this.state.dataSource}
          position={this.state.position}
          arrowSize={0}
          onPress={(end)=>[console.log(urls[end.index]), this.onModalOpen(urls[end.index])]}
          onPositionChanged={position => this.setState({ position })} />                    
      </View>            
    
      <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center',  paddingBottom:5,  borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
        <View style={{flexDirection: "column", flexWrap: 'wrap', width: '30%', height: 20, marginTop:5, marginLeft:'2%'}}>
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>{this.state.todayDate_show}</Text>   
        </View>   
        <View style={{flexDirection: "column", flexWrap: 'wrap', width: '66%', height: 20, marginTop:5, marginRight:'2%'}}>
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'right', color:'#686868'}]}>{this.state.todayDate}</Text>   
        </View>   
      </View>
      <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center',  paddingBottom:10,  borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
        <View style={this.state.comment == "" && this.state.js2 == "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginLeft:'2%'}}>
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>오늘 해주신 말씀</Text>   
        </View> 
        <View style={this.state.comment == "" && this.state.js2 == "" ? {flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginLeft:'2%'} : {display:'none'} }>
         <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>오늘의 복음 말씀</Text>   
        </View>  
        <View style={{flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginRight:'2%'}}>
          <Text style={[ styles.TextStyle, {fontSize:15, textAlign:'right', color:'#686868'}]}></Text>   
        </View>  
        <Icon style={{paddingTop:5}} name={'quote-left'} size={13} color={"#000"} />
        <View style={this.state.js2 == "" && this.state.comment == "" ? {width:'100%',justifyContent: 'center', alignItems: 'center'}: {display:'none'}}>
          <Text style={[normalSize, styles.TextStyle,{padding:5}]}>{this.state.sentence}</Text>   
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

        <View style={this.state.js2 !== ""  ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '85%', height: 30, marginBottom:10, marginLeft:'2%'}}>       
        </View>  
        <View style={this.state.js2 !== "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '12%', height: 30, marginBottom:10, marginRight:'1%'}} >
          <TouchableOpacity 
          activeOpacity = {0.9}
          style={this.state.comment == "" && this.state.js2 == "" ? {} : {display:'none'}}
          onPress = {() => this.state.weekend ? this.props.navigation.navigate('Main4') : this.props.navigation.navigate('Main3')}
          >    
          <Icon2 name={'arrow-right'} size={35} color={"#01579b"} />        
          </TouchableOpacity>      
          <TouchableOpacity 
            activeOpacity = {0.9}
            style={this.state.comment !== "" && this.state.js2 =="" ? {} : {display:'none'}}
            onPress = {() => this.props.navigation.navigate('Main3')}
            >    
            <Icon2 name={'arrow-right'} size={35} color={"#01579b"} />  
          </TouchableOpacity>    
        </View>         
      
       
      </View>

      <View style={!this.state.weekend ? {flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center',  paddingBottom:10, borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}: {display:'none'}}>  
        <View style={this.state.mysentence == "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginLeft:'2%'}}>
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>한주간 묵상할 구절</Text>   
        </View>    
        <View style={this.state.mysentence !== "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginLeft:'2%'}}>
         <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'left', color:'#686868'}]}>주일의 복음 말씀</Text>   
        </View>  
        <View style={{flexDirection: "column", flexWrap: 'wrap', width: '48%', height: 20, marginTop:5, marginRight:'2%'}}>
          <Text style={[ styles.TextStyle, {fontSize:15, textAlign:'right', color:'#686868'}]}></Text>   
        </View>    

        <Icon style={{paddingTop:5}} name={'quote-right'} size={13} color={"#000"} />
        <Text style={this.state.mysentence == "" ? {display:'none'} : [normalSize, styles.TextStyle,{marginTop:5, padding:5, color:'#01579b'}]}>{this.state.mysentence}</Text>   
        <Text style={this.state.mysentence == "" ? [normalSize, styles.TextStyle,{padding:5}] : {display:'none'}}>{this.state.sentence_weekend}</Text>
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
        <View style={this.state.mysentence !== ""   ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '85%', height: 30, marginBottom:10, marginLeft:'2%'}}>       
        </View>  
        <View style={this.state.mysentence !== "" ? {display:'none'} : {flexDirection: "column", flexWrap: 'wrap', width: '12%', height: 30, marginBottom:10, marginRight:'1%'}} >
          <TouchableOpacity 
          activeOpacity = {0.9}
          onPress = {() => this.props.navigation.navigate('Main4')}
          >    
            <Icon2 name={'arrow-right'} size={35} color={"#01579b"} />        
          </TouchableOpacity>     
        </View>          
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
      )
      
  }
}
Main1.propTypes = { 
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