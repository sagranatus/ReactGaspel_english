import React, { Component } from 'react';
import { Dimensions, PanResponder,PixelRatio, StyleSheet, TextInput, View, Text, TouchableOpacity, ScrollView, Keyboard, NetInfo, KeyboardAvoidingView, Image, ImageBackground, Alert, TouchableHighlight, AsyncStorage,  ActivityIndicator  } from 'react-native';
import {PropTypes} from 'prop-types';
import Icon from 'react-native-vector-icons/EvilIcons'
import Icon3 from 'react-native-vector-icons/FontAwesome'
import Icon4 from 'react-native-vector-icons/Feather'
import Icon5 from 'react-native-vector-icons/AntDesign'
import {NavigationEvents} from 'react-navigation'
import { openDatabase } from 'react-native-sqlite-storage';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import {KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
var db = openDatabase({ name: 'UserDatabase.db' });
import OnboardingButton from '../etc/OnboardingButton'
var normalSize;
var normalSize_input;
var largeSize;

export default class Main4 extends Component { 
constructor(props) { 
  super(props)      
  this.state = {
      internet: true,
      Contents : "",
      Date: "",
      Sentence : "",
      Person: "",
      Chapter: "",
      Firstverse: "",
      Lastverse: "",
      Move:"",
      bg1:"",
      bg2:"",
      bg3:"",
      sum1:"",
      sum2:"",
      js1:"",
      js2:"",
      mysentence: "",
      mythought: "",
      question: "",
      answer:"",
      background: "",
      start: false,
      praying: false,
      Weekenddate:"",
      Weekendupdate: false,
      Weekendediting: false,
      currentIndex:0,
      initialLoading: true,
      selectShow: false,
      selectQuestion:false,
      index: 0,
      routes: [
          { key: 'first', title: '독서 과정', out: true },
          { key: 'second', title: '거룩한 독서' },
          { key: 'third', title: '주의사항' }
        ],
        out: false,
    }
    
    this.moveNext = this.moveNext.bind(this);
    this.moveFinal = this.moveFinal.bind(this);
    this.movePrevious = this.movePrevious.bind(this);
    this.transitionToNextPanel = this.transitionToNextPanel.bind(this); 
    this.getData = this.getData.bind(this); 
}

movePrevious(){
  this.transitionToNextPanel(this.state.currentIndex -1);
}

moveNext(){
  this.transitionToNextPanel(this.state.currentIndex +1);
}

moveFinal(){  
    console.log("Main4 - moveFinal")
    Keyboard.dismiss()
    // weekend server
    if(this.state.Weekendupdate){
      // 수정 - 후에 Weekendediting: false 
      try {
        AsyncStorage.setItem('refreshMain1', "refresh");
      } catch (error) {
        console.error('AsyncStorage error: ' + error.message);
      }             
        this.props.updateWeekend("update",this.props.status.loginId, this.state.Weekenddate, this.state.Sentence, this.state.bg1, this.state.bg2, this.state.bg3, this.state.sum1, this.state.sum2, this.state.js1, this.state.js2,this.state.mysentence, this.state.mythought, this.state.question, this.state.answer)
        const loginId = this.props.status.loginId;
        const date = this.state.Weekenddate;
        const bg1 = this.state.bg1
        const bg2 = this.state.bg2
        const bg3 = this.state.bg3
        const sum1 = this.state.sum1
        const sum2 = this.state.sum2
        const js1 = this.state.js1
        const js2 = this.state.js2
        const mysentence = this.state.mysentence
        const mythought = this.state.mythought
        const question = this.state.question
        const answer = this.state.answer
        // lectio, weekend DB를 업데이트한다.
        db.transaction(function(tx) {
        tx.executeSql(
            'UPDATE lectio set bg1=?, bg2=?, bg3=?, sum1=?, sum2=?, js1=?, js2=? where uid=? and date=?',
            [bg1, bg2, bg3, sum1, sum2, js1, js2, loginId, date],
            (tx, results) => {
            if (results.rowsAffected > 0) {
                console.log('Main4 - lectio data updated : ', "success")                     
            } else {
                console.log('Main4 - lectio data updated : ', "failed")   
            }
            }
        ),
        tx.executeSql(
            'UPDATE weekend set mysentence=?, mythought=?, question=?, answer=? where uid=? and date=?',
            [mysentence, mythought, question, answer, loginId, date],
            (tx, results) => {
            if (results.rowsAffected > 0) {
                console.log('Main4 - weekend data updated : ', "success")               
            } else {
                console.log('Main4 - weekend data updated : ', "failed")   
            }
            }
        );
        });         
        this.setState({ Weekendediting: false });
    }else{
      // 값을 삽입 - 후에 praying:true
        try {
            AsyncStorage.setItem('refreshMain5', 'refresh');
            AsyncStorage.setItem('refreshMain1', "refresh");
          } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
          }     
        this.props.insertWeekend("insert", this.props.status.loginId, this.state.Weekenddate, this.state.Sentence, this.state.bg1, this.state.bg2, this.state.bg3, this.state.sum1, this.state.sum2, this.state.js1, this.state.js2, this.state.mysentence, this.state.mythought, this.state.question, this.state.answer)
        const loginId = this.props.status.loginId;
        const sentence = this.state.Sentence;
        const date = this.state.Weekenddate;
        const bg1 = this.state.bg1
        const bg2 = this.state.bg2
        const bg3 = this.state.bg3
        const sum1 = this.state.sum1
        const sum2 = this.state.sum2
        const js1 = this.state.js1
        const js2 = this.state.js2
        const mysentence = this.state.mysentence
        const mythought = this.state.mythought
        const question = this.state.question
        const answer = this.state.answer
      
        // 값이 있는지 확인하고 없는 경우 lectio, weekend DB에 삽입한다 
        db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM lectio where date = ? and uid = ?',
              [date, loginId],
              (tx, results) => {
                var len = results.rows.length;
              //  값이 있는 경우에 
                if (len > 0) {                  
                    console.log('Main4 - data : ', "existed")        
                } else {
                  db.transaction(function(tx) {
                    tx.executeSql(
                      'INSERT INTO lectio (uid, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2) VALUES (?,?,?,?,?,?,?,?,?,?)',
                      [loginId,date,sentence, bg1, bg2, bg3, sum1, sum2, js1, js2],
                      (tx, results) => {                          
                        if (results.rowsAffected > 0) {
                            console.log('Main4 - lectio data inserted : ', "success")          
                            
                        } else {
                            console.log('Main4 - lectio data inserted : ', "failed") 
                        }
                      }
                    );
                  });                             
                }
              }
            );

            tx.executeSql(
                'SELECT * FROM weekend where date = ? and uid = ?',
                [date, loginId],
                (tx, results) => {
                  var len = results.rows.length;
                //  값이 있는 경우에 
                  if (len > 0) {                  
                      console.log('Message', "exist")        
                  } else {
                    db.transaction(function(tx) {
                      tx.executeSql(
                        'INSERT INTO weekend (uid, date, mysentence, mythought, question, answer) VALUES (?,?,?,?,?,?)',
                        [loginId,date,mysentence, mythought, question, answer],
                        (tx, results) => {                            
                          if (results.rowsAffected > 0) {
                            console.log('Main4 - weekend data inserted : ', "success") 
                          } else {
                            console.log('Main4 - weekend data inserted : ', "failed")
                          }
                        }
                      );
                    });                             
                  }
                }
              );
          });    
          this.setState({ praying: true });
    }
}

transitionToNextPanel(nextIndex){      
    this.setState({
        currentIndex: nextIndex
    });    
}

componentWillMount(){   
  // 인터넷 연결
   const setState = (isConnected) => this.setState({internet : isConnected})

    NetInfo.isConnected.fetch().then(isConnected => {
      console.log('First, is ' + (isConnected ? 'online' : 'offline'));
      setState(isConnected)
    });
    function handleFirstConnectivityChange(isConnected) {
      console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
      setState(isConnected)
     /* NetInfo.isConnected.removeEventListener(
        'connectionChange',
        handleFirstConnectivityChange
      ); */
    }
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      handleFirstConnectivityChange
    );

  // textSize 가져오기
    AsyncStorage.getItem('textSize', (err, result) => {
      if(result == "normal" || result == null){
        normalSize = {fontSize:15}
        normalSize_input = 15
        largeSize = {fontSize:17}
      }else if(result == "large"){
          normalSize = {fontSize:17}
          normalSize_input = 17
          largeSize = {fontSize:19}
      }else if(result == "larger"){
          normalSize = {fontSize:19}
          normalSize_input = 19
          largeSize = {fontSize:21}
      }
    })
   // var date = new Date(2019, 1, 10, 14, 52, 10);

   // 이번주주일 날짜 가져와서 thisweekend 저장, Date, Weekenddate setting
    var date = new Date()
    console.log(date.getDay())
    if(date.getDay() !== 0){ // 일요일인 경우에는 그대로 값을 가져옴 
        var lastday = date.getDate() - (date.getDay() - 1) - 1;
        console.log(lastday)
        date = new Date(date.setDate(lastday));
    }else{
      var lastday = date.getDate();
      date = new Date(date.setDate(lastday));
    }       
    console.log(date)
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
   
     try {
        AsyncStorage.setItem('thisweekend', today);
      } catch (error) {
        console.error('AsyncStorage error: ' + error.message);
      }

    var today_comment_date = year+"년 "+month+"월 "+day+"일 "+this.getTodayLabel(new Date(today))
    console.log('Main4 - weekend date : ', today+"/"+today_comment_date)
    this.setState({
        Date: today,
        Weekenddate: today_comment_date
    })

    // gaspel 및 weekendmore 데이터 가져오기
    this.props.getGaspel(today) 
    this.props.getWeekendMore(today) 

    // lectio, weekend DB 있는지 확인        
    const loginId = this.props.status.loginId;
    db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM lectio where date = ? and uid = ?',
          [today_comment_date,loginId],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {                  
                console.log('Main4 - check Lectio data : ', results.rows.item(0).bg1) 
                this.setState({
                    bg1 : results.rows.item(0).bg1,
                    bg2 : results.rows.item(0).bg2,
                    bg3 : results.rows.item(0).bg3,
                    sum1 : results.rows.item(0).sum1,
                    sum2 : results.rows.item(0).sum2,
                    js1 : results.rows.item(0).js1,
                    js2 : results.rows.item(0).js2,
                    Sentence : results.rows.item(0).onesentence,
                    Weekendupdate: true,
                    initialLoading: false
                })
            } else {      
                this.setState({
                    initialLoading: false
                })                              
            }
          }
        );

        tx.executeSql(
            'SELECT * FROM weekend where date = ? and uid = ?',
            [today_comment_date,loginId],
            (tx, results) => {
              var len = results.rows.length;
              if (len > 0) {                  
                console.log('Main4 - check Weekend data : ', results.rows.item(0).mysentence) 
                  this.setState({
                      mysentence : results.rows.item(0).mysentence,
                      mythought : results.rows.item(0).mythought,
                      answer:  results.rows.item(0).answer,
                      question: results.rows.item(0).question
                  })
              } else {                                     
              }
            }
          );
      });    

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
  }

  getData(){
      // lectio, weekend DB 있는지 확인        
      const loginId = this.props.status.loginId;
      var today_comment_date = this.state.Weekenddate
      db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM lectio where date = ? and uid = ?',
            [today_comment_date,loginId],
            (tx, results) => {
              var len = results.rows.length;
              if (len > 0) {                  
                  console.log('Main4 - check Lectio data : ', results.rows.item(0).bg1) 
                  this.setState({
                      bg1 : results.rows.item(0).bg1,
                      bg2 : results.rows.item(0).bg2,
                      bg3 : results.rows.item(0).bg3,
                      sum1 : results.rows.item(0).sum1,
                      sum2 : results.rows.item(0).sum2,
                      js1 : results.rows.item(0).js1,
                      js2 : results.rows.item(0).js2,
                      Weekendupdate: true,
                      initialLoading: false
                  })
              } else {      
                  this.setState({
                      initialLoading: false
                  })                              
              }
            }
          );
  
          tx.executeSql(
              'SELECT * FROM weekend where date = ? and uid = ?',
              [today_comment_date,loginId],
              (tx, results) => {
                var len = results.rows.length;
                if (len > 0) {                  
                  console.log('Main4 - check Weekend data : ', results.rows.item(0).mysentence) 
                    this.setState({
                        mysentence : results.rows.item(0).mysentence,
                        mythought : results.rows.item(0).mythought,
                        answer:  results.rows.item(0).answer,
                        question: results.rows.item(0).question
                    })
                } else {                                     
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

  componentWillReceiveProps(nextProps){    
  
      // getGaspel에서 받아오는 경우
      if(nextProps.weekend.sentence != null){
        console.log('Main4 - get Gaspel Data')  
        var contents = ""+nextProps.weekend.contents
        var sentence = ""+nextProps.weekend.sentence
        var start = contents.indexOf("✠");
        var end = contents.indexOf("◎ 그리스도님 찬미합니다");
        contents = contents.substring(start, end);
        contents = contents.replace(/&ldquo;/gi, "");
        contents = contents.replace(/&rdquo;/gi, "");
        contents = contents.replace(/&lsquo;/gi, "");
        contents = contents.replace(/&rsquo;/gi, "");
        contents = contents.replace(/&prime;/gi, "'");
        contents = contents.replace("주님의 말씀입니다.", "\n주님의 말씀입니다.");
      //  contents = contents.replace(/\n/gi, " ");    
   
      // 몇장 몇절인지 찾기
        var pos = contents.match(/\d{1,2},\d{1,2}-\d{1,2}/);
        if(pos == null){
            pos = contents.match(/\d{1,2},\d{1,2}.*-\d{1,2}/);
        }
        if(pos == null){
            pos = contents.match(/\d{1,2},\d{1,2}-\n\d{1,2}/);
        }
        var chapter = pos[0].substring(0,pos[0].indexOf(","))
        contents_ = contents.substring(pos.index+pos[0].length)

        // 여기서 각 절 번호 가져옴
        pos = contents_.match(/\d{1,2}/gi) // 모든 절 위치 가져옴

        // 절 가져옴
        var first_verse = pos[0]
        var last_verse = pos[pos.length-1]

        console.log("Main4 - first verse, last verse get : ", first_verse+"/"+last_verse)

        // 복음사가 가져옴
        var idx_today = contents.indexOf("전한 거룩한 복음입니다.");
        var today_person;
        if(idx_today == -1){
            idx_today = contents.indexOf("전한 거룩한 복음의 시작입니다.");
            today_person = contents.substring(2,idx_today-2); // 복음사 사람 이름
        }else{
            today_person = contents.substring(2,idx_today-2);
        }

       console.log("Main4 - person & chapter get : ",today_person+"/"+chapter);
        // Contents, Sentence, Firstverse, Lastverse, Person, Chapter 세팅
        this.setState({
            Contents : contents,
            Sentence : sentence,
            Firstverse: first_verse - 3,
            Lastverse: parseInt(last_verse) + 3,
            Person: today_person,
            Chapter: chapter

        });   
      }

      // threegaspel 가져올때 
    if(nextProps.weekend.threegaspels != null){  
        console.log("Main4 - Three gaspel get")           
        if(this.state.Move == "prev"){
            this.setState({
                Contents : nextProps.weekend.threegaspels+"\n"+this.state.Contents
            })    
        }else{
            this.setState({
                Contents : this.state.Contents+"\n"+nextProps.weekend.threegaspels
            })    
        }
          
    }
    // weekendMore 값 가져오기
    if(nextProps.weekend.background != null){ 
      console.log("Main4 - weekend More get") 
      var background = nextProps.weekend.background.replace(/,/gi, "\n\n");
      this.setState({
        question : nextProps.weekend.question,
        background:  background
      })    
     }
  }

  setChange(){
    // textSize 세팅
    AsyncStorage.getItem('textSize', (err, result) => {
      if(result == "normal" || result == null){
        normalSize = {fontSize:15}
        normalSize_input = 15
        largeSize = {fontSize:17}
      }else if(result == "large"){
          normalSize = {fontSize:17}
          normalSize_input = 17
          largeSize = {fontSize:19}
      }else if(result == "larger"){
          normalSize = {fontSize:19}
          normalSize_input = 19
          largeSize = {fontSize:21}
      }
    })

    // 이번주 주일 날짜 계산
    var date = new Date()
    console.log(date)
    if(date.getDay() !== 0){ // 일요일인 경우에는 그대로 값을 가져옴 
        var lastday = date.getDate() - (date.getDay() - 1) - 1;
        date = new Date(date.setDate(lastday));
    }else{
      var lastday = date.getDate();
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
    var todaydate = year+"-"+month+"-"+day;
    var today_comment_date = year+"년 "+month+"월 "+day+"일 "+this.getTodayLabel(new Date(todaydate))
    console.log(todaydate)
    AsyncStorage.getItem('thisweekend', (err, result) => {
        console.log("Main4 - get AsyncStorage thisweekend : ", result)
        if(result == todaydate){
          console.log("thisweekend is same")
          this.setState({reload:true})
        }else{
          //주일 날짜가 다른 경우 다시 세팅 및 getGaspel, DB 가져옴
          console.log("thisweekend is different")  
            try {
                AsyncStorage.setItem('thisweekend', todaydate);
            } catch (error) {
                console.error('AsyncStorage error: ' + error.message);
            }

            this.setState({
                Date: todaydate,
                Weekenddate: today_comment_date
            })
        
            // 데이터 가져오기
            this.props.getGaspel(todaydate) 
            this.props.getWeekendMore(todaydate) 

             //lectio, Weekend DB 있는지 확인        
            const loginId = this.props.status.loginId;
            db.transaction(tx => {
                tx.executeSql(
                'SELECT * FROM lectio where date = ? and uid = ?',
                [today_comment_date,loginId],
                (tx, results) => {
                    var len = results.rows.length;
                //  값이 있는 경우에 
                    if (len > 0) {                  
                        console.log('Main4 - check Lectio data : ', results.rows.item(0).bg1) 
                        this.setState({
                            bg1 : results.rows.item(0).bg1,
                            bg2 : results.rows.item(0).bg2,
                            bg3 : results.rows.item(0).bg3,
                            sum1 : results.rows.item(0).sum1,
                            sum2 : results.rows.item(0).sum2,
                            js1 : results.rows.item(0).js1,
                            js2 : results.rows.item(0).js2,
                            Weekendupdate: true
                        })
                    } else {                        
                        this.setState({
                            bg1 : "",
                            bg2 : "",
                            bg3 : "",
                            sum1 : "",
                            sum2 : "",
                            js1 : "",
                            js2 : "",
                            Weekendupdate: false
                        })            
                    }
                }
                );

                tx.executeSql(
                    'SELECT * FROM weekend where date = ? and uid = ?',
                    [today_comment_date,loginId],
                    (tx, results) => {
                    var len = results.rows.length;
                    //  값이 있는 경우에 
                    if (len > 0) {                  
                        console.log('Main4 - check Weekend data : ', results.rows.item(0).mysentence) 
                        this.setState({
                            mysentence : results.rows.item(0).mysentence,
                            mythought : results.rows.item(0).mythought,
                            answer:  results.rows.item(0).answer
                        })
                    } else {     
                        this.setState({
                            mysentence : "",
                            mythought : "",
                            answer: ""
                        })                                
                    }
                    }
                );
            });    

        }    
      })    
   
}
  // 이전 3절 가져오기
  getPrevMoreGaspel(){
    this.props.getThreeGaspel("prev", this.state.Person, this.state.Chapter, this.state.Firstverse)    
    this.setState({
        Firstverse: this.state.Firstverse-3,        
        Move: "prev"
    });
  }
  // 이후 3절 가져오기
  getNextMoreGaspel(){
     this.props.getThreeGaspel("next", this.state.Person, this.state.Chapter, this.state.Lastverse)
     this.setState({
        Lastverse: this.state.Lastverse+3,
        Move: "next"
    });
   }
   

  render() {
    console.log("Main4 - gaspels in render");
    return !this.state.internet ? 
    (    
      <View style={[styles.MainContainer, {backgroundColor:'#F8F8F8'}]}>             
      <Text style= {[styles.TextComponentStyle, {color:'#000'}]}>인터넷을 연결해주세요</Text>
      </View>
    ) :
   (this.state.initialLoading)
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

   : (this.state.Weekendupdate == true) ? 
        (this.state.Weekendediting == true) ?
        // 수정시 
          (
            <View style={{backgroundColor:'#fff'}}>     
              <NavigationEvents
                onWillFocus={payload => {
                    this.setChange();
                }}
                />
              <View style={{backgroundColor:'#fff'}}>                  
              <TouchableOpacity
                    activeOpacity = {0.9}
                    style={{backgroundColor: '#01579b', padding: 10}}
                    onPress={() =>  Alert.alert(
                        '정말 끝내시겠습니까?',
                        '확인을 누르면 쓴 내용이 저장되지 않습니다.',
                        [                                 
                          {
                            text: '취소',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {text: '끝내기', onPress:() =>   [Keyboard.dismiss(),this.setState({Weekendediting: false}), this.getData()]},
                        ],
                        {cancelable: true},
                      )}
                    >
                    <Text style={{color:"#FFF", textAlign:'left'}}>
                        {"<"} 뒤로
                    </Text>
              </TouchableOpacity>        
              </View>
              
              <OnboardingButton
                  totalItems={this.state.question != null ? 9 : 8}
                  currentIndex={this.state.currentIndex}
                  movePrevious={this.movePrevious}
                  moveNext={this.moveNext}
                  moveFinal={this.moveFinal}
              />
              <KeyboardAvoidingView style={(this.state.currentIndex == 9 && this.state.question != null) ? {height:170} : {height:130}}>  
                  <View style={this.state.currentIndex == 0 ? {} : {display:'none'}}>
                  <Text style={styles.TextQuestionStyleClass}>복음의 등장인물은?</Text>
                  <TextInput
                  multiline = {true}
                  placeholder="여기에 적어봅시다"
                  value={this.state.bg1}        
                  onChangeText={bg1 => this.setState({bg1})}        
                  // Making the Under line Transparent.
                  underlineColorAndroid='transparent'        
                  style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                           
                  </View>

                  <View style={this.state.currentIndex == 1 ? {} : {display:'none'}}>
                  <Text style={styles.TextQuestionStyleClass}>복음의 배경장소는?</Text>
                  <TextInput
                  multiline = {true}
                  placeholder="여기에 적어봅시다"
                  value={this.state.bg2}        
                  onChangeText={bg2 => this.setState({bg2})}        
                  // Making the Under line Transparent.
                  underlineColorAndroid='transparent'        
                  style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                                  
                  </View>

                  <View style={this.state.currentIndex == 2 ? {} : {display:'none'}}>
                  <Text style={styles.TextQuestionStyleClass}>배경시간 혹은 상황은?</Text>
                  <TextInput
                  multiline = {true}
                  placeholder="여기에 적어봅시다"
                  value={this.state.bg3}        
                  onChangeText={bg3 => this.setState({bg3})}        
                  // Making the Under line Transparent.
                  underlineColorAndroid='transparent'        
                  style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                                   
                  </View>

                  <View style={this.state.currentIndex == 3 ? {} : {display:'none'}}>
                  <Text style={styles.TextQuestionStyleClass}>복음의 내용을 사건 중심으로 요약해 봅시다.</Text>
                  <TextInput
                  multiline = {true}
                  placeholder="여기에 적어봅시다"
                  value={this.state.sum1}        
                  onChangeText={sum1 => this.setState({sum1})}        
                  // Making the Under line Transparent.
                  underlineColorAndroid='transparent'        
                  style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                                 
                  </View>

                  <View style={this.state.currentIndex == 4 ? {} : {display:'none'}}>
                  <Text style={styles.TextQuestionStyleClass}>특별히 눈에 띄는 부분은?</Text>
                  <TextInput
                  multiline = {true}
                  placeholder="여기에 적어봅시다"
                  value={this.state.sum2}        
                  onChangeText={sum2 => this.setState({sum2})}        
                  // Making the Under line Transparent.
                  underlineColorAndroid='transparent'        
                  style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                               
                  </View>

                  <View style={this.state.currentIndex == 5 ? {} : {display:'none'}}>
                  <Text style={styles.TextQuestionStyleClass}>복음에서 보여지는 예수님의 모습은 어떠한가요?</Text>
                  <TextInput
                  multiline = {true}
                  placeholder="여기에 적어봅시다"
                  value={this.state.js1}        
                  onChangeText={js1 => this.setState({js1})}        
                  // Making the Under line Transparent.
                  underlineColorAndroid='transparent'        
                  style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                                   
                  </View>
                  
                  <View style={(this.state.currentIndex == 6 && this.state.question != null) ? {} : {display:'none'}}>
                      <Text style={styles.TextQuestionStyleClass}>{this.state.question}</Text>
                      <TextInput
                      multiline = {true}
                      placeholder="여기에 적어봅시다"
                      value={this.state.answer}        
                      onChangeText={answer => this.setState({answer})}        
                      // Making the Under line Transparent.
                      underlineColorAndroid='transparent'        
                      style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                               
                      </View>

                  <View style={(this.state.currentIndex == 7 && this.state.question != null) || (this.state.currentIndex == 6 && this.state.question == null) ? {} : {display:'none'}}>
                  <Text style={styles.TextQuestionStyleClass}>복음을 통하여 예수님께서 내게 해주시는 말씀은?</Text>
                  <TextInput
                  multiline = {true}
                  placeholder="여기에 적어봅시다"
                  value={this.state.js2}        
                  onChangeText={js2 => this.setState({js2})}        
                  // Making the Under line Transparent.
                  underlineColorAndroid='transparent'        
                  style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                           
                  </View>

                  <View style={(this.state.currentIndex == 8 && this.state.question != null) || (this.state.currentIndex == 7 && this.state.question == null) ? {} : {display:'none'}}>
                  <Text style={styles.TextQuestionStyleClass}>이번주 복음에서 특별히 와닿는 구절을 선택해 봅시다.</Text>
                  <TextInput
                  multiline = {true}
                  placeholder="여기에 적어봅시다"
                  value={this.state.mysentence}        
                  onChangeText={mysentence => this.setState({mysentence})}        
                  // Making the Under line Transparent.
                  underlineColorAndroid='transparent'        
                  style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                                   
                  </View>                          
              </KeyboardAvoidingView>

              <KeyboardAwareScrollView style={this.state.currentIndex == 6 ? {marginBottom:230, marginTop:30} : {marginBottom:230, marginTop:10}}>           
                <TouchableHighlight
                style={{ justifyContent: 'center', alignItems: 'center'}}
                underlayColor = {"#fff"}
                onPress={() => this.getPrevMoreGaspel()}>
                    <Icon name={"chevron-up"} size={40} color={"#A8A8A8"} /> 
                </TouchableHighlight >                                       
                <Text style= {[styles.DescriptionComponentStyle, normalSize]}>{this.state.Contents}</Text>        
                <TouchableHighlight
                style={{ justifyContent: 'center', alignItems: 'center'}}
                underlayColor = {"#fff"}
                onPress={() => this.getNextMoreGaspel()}>
                    <Icon name={"chevron-down"} size={40} color={"#A8A8A8"} /> 
                </TouchableHighlight >                                      
              </KeyboardAwareScrollView>  
            </View>
          )
         :
         // 내용 있는 경우
        (
        <View  style={{backgroundColor:'#fff', flex:1}}>
         <View style={this.state.selectQuestion ? {flex:1,position: 'absolute', right:'0%', top:'0%', width:'100%', height:'100%', backgroundColor:"rgba(0,0,0, 0.7)", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>             
         <TouchableOpacity 
            activeOpacity = {0.9}
            style={{position: 'absolute', right:"4%", top:8}}
            onPress={() => this.setState({selectQuestion:false}) } 
            >    
                <Icon5 name={'closecircle'} size={22} color={"#fff"} />        
            </TouchableOpacity>   
                    <TabView
                   style={{margin:5, marginTop:35, borderTopColor:'#d8d8d8', borderTopWidth:0.5, backgroundColor:"#fff"}}
                navigationState={this.state}
                renderScene={SceneMap({
                  first: () => (
                  <ScrollView style={[styles.scene, { backgroundColor: '#fff' , paddingTop:10}]}>               
                  <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>주일의 복음으로 거룩한독서를 할 수 있습니다.</Text>                      

                  <View style={{ flex:1, justifyContent: 'center', alignItems: 'center', marginTop:20, marginBottom:20}}> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    성령청원기도 
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} />  
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    세밀한 독서
                    </Text>
                    <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>
                    · 말씀을 이해하기 위한 필요한 기초적인 정보를 찾아봅시다.
                    {"\n"}· 복음의 등장 인물은?
                    {"\n"}· 복음의 배경장소는?
                    {"\n"}· 배경시간 혹은 상황은?
                    {"\n"}· 복음의 내용을 사건 중심으로 요약해 봅시다.
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    묵상
                    </Text>
                    <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>
                    · 특별히 눈에 띄는 부분은?
                    {"\n"}· 복음에서 보여지는 예수님의 모습은 어떠한가요?
                    {"\n"}· 복음과 관련된 묵상 질문
                    {"\n"}· 복음을 통하여 예수님께서 내게 해주시는 말씀은?
                    {"\n"}· 이번주 복음에서 특별히 와닿는 구절을 선택해 봅시다.
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    묵상후 기도
                    </Text>    
                    </View>                    
                  
                  </ScrollView>
                ),
                second: () => (
                  <ScrollView style={[styles.scene, { backgroundColor: '#fff', paddingTop:10 }]}>
                  <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>
                  하느님께서 ‘지금 이순간, 나에게’ 하시는 말씀을 {"\n"}듣기 위해 기도와 함께하는 독서법입니다.
                  </Text>
                  <Text style={[styles.UpdateQuestionStyleClass, { marginTop:10}]}>침묵</Text> 
                  <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                  하느님께 우리 마음의 주파수를 맞추려는 노력으로 차분한 마음 안에서 자신을 온전히 내려놓습니다.{"\n"}
                  </Text>
                  <Text style={[styles.UpdateQuestionStyleClass]}>성령청원기도</Text>
                  <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                  하느님의 말씀은 하느님께서 이끌어 주셔야만 올바로 알아들을 수 있기에 반드시 성령의 도움이 필요합니다.{"\n"}
                  </Text>
                  <Text style={[styles.UpdateQuestionStyleClass]}>독서</Text>
                  <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                  하느님의 말씀을 듣는 것으로 세밀한 독서와 반복적인 독서를 하며, 말씀을 여러 차례 침묵 속에서 읽습니다.{"\n"}
                  </Text>
                  <Text style={[styles.UpdateQuestionStyleClass]}>묵상</Text>
                  <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                  말씀이 바로 나에게 지금 어떤 말을 걸고자 하는지에 대해 곰곰이 생각하며 노력을 기울이는 과정입니다.{"\n"}
                  </Text>
                  <Text style={[styles.UpdateQuestionStyleClass]}>기도</Text>
                  <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                  하느님께서 내게 주신 말씀을 되뇌이며 자연스럽게 솔직함과 그분께 대한 신뢰 안에서 하느님께 대답합니다.{"\n"}
                  </Text>
                  <Text style={[styles.UpdateQuestionStyleClass]}>관상</Text>
                  <Text style={[styles.textStyle, normalSize]}>
                  거룩한 독서를 통해 하느님의 말씀을 기억하면서 모든 것이 하느님의 은총임을 깨닫습니다. {"\n"}
                  </Text>
                  </ScrollView>
                ),
                third: () => (
                  <ScrollView style={[styles.scene, { backgroundColor: '#fff', paddingTop:10 }]}>            
                  <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>정해진 침묵의 시간</Text> 
                  <Text style={[styles.textStyle, normalSize]}>
                  거룩한 독서 1단계인 침묵을 준비하기 위해 반드시 따로 시간을 내야 합니다. 고요와 침묵과 고독에 도움이 되는 시간이어야 합니다. {"\n"}<Text style={{fontSize:13}}>* 조용한 장소에서 촛불을 켜고 진행하면 좋습니다.</Text>
                      {"\n"}
                  </Text>
                  <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>들을 귀가 있는 마음</Text>
                  <Text style={[styles.textStyle, normalSize]}>
                      급하게 해서는 안됩니다. 주님은 당신 말씀의 씨를 뿌리고 계시며 나 자신은 말씀이 떨어지는 땅입니다. 열매를 맺기 위해서는 좋은 땅이 준비되어야 합니다. 
                      {"\n"} 
                  </Text>
                  <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>지속적인 독서</Text>
                  <Text style={[styles.textStyle, normalSize]}>
                  꾸준함이 필요합니다. 지금 당장 성서 본문이 이해되지 않는다고 하더라도 지속적으로 연습하다보면 하느님의 말씀이 어느 순간 나의 마음을 울리게 될 것입니다.
                  </Text>
                  </ScrollView>
                )
                })}
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
                renderTabBar={(props) =>
                <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: '#01579b' }}
                style={{backgroundColor: "white"}}
                renderIcon={this.renderIcon}
                renderLabel={({ route }) => (
                    <View>
                        <Text style={{textAlign: 'center',
                            color: route.key === props.navigationState.routes[props.navigationState.index].key ?
                            '#01579b' : 'black'}}>
                            {route.title}
                        </Text>
                    </View>
                )}
                /> }
            /> 
            </View>      
            <View style={this.state.selectShow ? {flex:1,position: 'absolute', right:'2%', top:'8%', width:'96%', height:400, backgroundColor:"#fff", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>              
            <ScrollView 
            style={{flex:1, marginLeft:5, marginRight:5, paddingBottom:200, marginBottom:20}}
                {...this._panResponder.panHandlers}
                onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })}>  
                <Text style={[styles.TextStyle,{marginTop:3, padding:10, color:'#000', textAlign:'center', fontSize:14}]}>{this.state.Weekenddate}</Text>    
                <Text style={[styles.TextStyle,{marginTop:5, padding:10, color:'#01579b', textAlign:'center'}, normalSize]}>{this.state.Sentence}</Text>       
                <Text style={[styles.TextStyle,{marginTop:20, padding:5, color:'#000', textAlign:'left', lineHeight:22},  normalSize]}>{this.state.Contents}</Text>           
                </ScrollView>
                <TouchableOpacity 
                activeOpacity = {0.9}
                style={{position: 'absolute', right:2, top:2}}
                onPress={() => this.setState({selectShow:false}) } 
                >    
                <Icon name={'close'} size={30} color={"#000"} />        
            </TouchableOpacity>           
          </View>  
          <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', backgroundColor:'#fff',  borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
                <View style={{flexDirection: "column", flexWrap: 'wrap', width: '88%', height: 30, marginTop:10, paddingLeft:'1%'}}>
                    <Text style={[ styles.TextStyle, {fontSize:17, textAlign:'left', fontFamily:'NanumMyeongjoBold', color:"#000"}]}>주일의독서</Text>
                </View>
                
                <View style={{flexDirection: "column", flexWrap: 'wrap', width: '8%', height: 30, marginLeft:'0%', float:'right'}}>
                    <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() => this.setState({selectQuestion:true})} // insertComment
                    >      
                    <Icon5 name={'questioncircleo'} size={22} color={"#000"} style={{paddingTop:9}} />
                    </TouchableOpacity>
                </View>
            </View>

          <ScrollView style={{backgroundColor:'#fff'}}
          ref={(e) => { this.fScroll = e }}> 
            <NavigationEvents
            onWillFocus={payload => {
                this.setChange();
            }}
            />  

                <View style={{backgroundColor: "#fff", flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop:5, alignItems: 'center',  padding:5, paddingBottom:10, borderBottomColor:'#d8d8d8', borderBottomWidth:0.5}}>  
                  <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5,flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center',   alignItems: 'center',  width: '31%', marginRight:'1.5%', height:40}}>
                  <TouchableOpacity 
                  activeOpacity = {0.9}
                  onPress={() => this.setState({selectShow: true})} 
                  >  
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon4 name={'book-open'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  복음읽기</Text>   
                  </TouchableOpacity>
                  </View>   
                  <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '32%', marginRight:'1.5%', height: 40}}>
                  <TouchableOpacity 
                  activeOpacity = {0.9}
                  onPress={() => this.setState({ Weekendediting: true, currentIndex: 0 })}
                  > 
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon4 name={'edit-3'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  수정하기</Text>   
                  </TouchableOpacity>
                  </View>   
                  <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '32%', height: 40}}>
                  <TouchableOpacity 
                  activeOpacity = {0.9}
                  onPress={() => this.props.navigation.navigate('SendImage', {otherParam: "Main4", otherParam2: this.state.Weekenddate})}
                  > 
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon3 name={'send-o'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  공유하기</Text>   
                  </TouchableOpacity>
                  </View>   
                </View>   
            <TouchableOpacity 
              activeOpacity = {0.9}
              onPress={() => this.setState({selectShow:true}) } 
              >    
            <Text style={[{color:'#01579b', textAlign: 'center', marginTop: 10, marginBottom: 10, padding:5}, largeSize]}>{this.state.Sentence}</Text> 
            </TouchableOpacity>
            <Text style={styles.UpdateQuestionStyleClass}>복음의 등장인물은?</Text>
            <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.bg1}</Text>   
            <Text style={styles.UpdateQuestionStyleClass}>복음의 배경장소는?</Text>
            <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.bg2}</Text>   
            <Text style={styles.UpdateQuestionStyleClass}>배경시간 혹은 상황은?</Text>
            <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.bg3}</Text>
            <Text style={styles.UpdateQuestionStyleClass}>복음의 내용을 사건 중심으로 요약해봅시다.</Text>   
            <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.sum1}</Text>  
            <Text style={styles.UpdateQuestionStyleClass}>특별히 눈에 띄는 부분은?</Text> 
            <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.sum2}</Text>   
            <Text style={styles.UpdateQuestionStyleClass}>복음에서 보여지는 예수님의 모습은 어떠한가요?</Text>                
            <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.js1}</Text>   
            <View style={this.state.question != null ? {} : {display:'none'}}>
              <Text style={styles.UpdateQuestionStyleClass}>{this.state.question}</Text>
              <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.answer}</Text>  
            </View>
            <Text style={styles.UpdateQuestionStyleClass}>복음을 통하여 예수님께서 내게 해주시는 말씀은?</Text>
            <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.js2}</Text>        
            <Text style={styles.UpdateQuestionStyleClass}>이번주 복음에서 특별히 와닿는 구절을 선택해 봅시다.</Text>
            <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.mysentence}</Text>     
          </ScrollView>
          </View>
         )
        
        :
        // 내용 없이 처음
        (  
          <View style={{backgroundColor:'#fff', flex:1}}> 
              <NavigationEvents
              onWillFocus={payload => {
                  this.setChange();
              }}
              />              
              <View style={this.state.selectQuestion ? {flex:1,position: 'absolute', right:'0%', top:'0%', width:'100%', height:'100%', backgroundColor:"rgba(0,0,0, 0.7)", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>             
              <TouchableOpacity 
            activeOpacity = {0.9}
            style={{position: 'absolute', right:"4%", top:8}}
            onPress={() => this.setState({selectQuestion:false}) } 
            >    
                <Icon5 name={'closecircle'} size={22} color={"#fff"} />        
            </TouchableOpacity>   
                    <TabView
                   style={{margin:5, marginTop:35, borderTopColor:'#d8d8d8', borderTopWidth:0.5, backgroundColor:"#fff"}}
                navigationState={this.state}
                renderScene={SceneMap({
                first: () => (
                  <ScrollView style={[styles.scene, { backgroundColor: '#fff' , paddingTop:10}]}>               
                  <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>주일의 복음으로 거룩한독서를 할 수 있습니다.</Text>                      

                  <View style={{ flex:1, justifyContent: 'center', alignItems: 'center', marginTop:20, marginBottom:20}}> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    성령청원기도 
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} />  
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    세밀한 독서
                    </Text>
                    <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>
                    · 말씀을 이해하기 위한 필요한 기초적인 정보를 찾아봅시다.
                    {"\n"}· 복음의 등장 인물은?
                    {"\n"}· 복음의 배경장소는?
                    {"\n"}· 배경시간 혹은 상황은?
                    {"\n"}· 복음의 내용을 사건 중심으로 요약해 봅시다.
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    묵상
                    </Text>
                    <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>
                    · 특별히 눈에 띄는 부분은?
                    {"\n"}· 복음에서 보여지는 예수님의 모습은 어떠한가요?
                    {"\n"}· 복음과 관련된 묵상 질문
                    {"\n"}· 복음을 통하여 예수님께서 내게 해주시는 말씀은?
                    {"\n"}· 이번주 복음에서 특별히 와닿는 구절을 선택해 봅시다.
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    묵상후 기도
                    </Text>    
                    </View>                    
                  
                  </ScrollView>
                ),
                second: () => (
                  <ScrollView style={[styles.scene, { backgroundColor: '#fff', paddingTop:10 }]}>
                  <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>
                  하느님께서 ‘지금 이순간, 나에게’ 하시는 말씀을 {"\n"}듣기 위해 기도와 함께하는 독서법입니다.
                  </Text>
                  <Text style={[styles.UpdateQuestionStyleClass, { marginTop:10}]}>침묵</Text> 
                  <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                  하느님께 우리 마음의 주파수를 맞추려는 노력으로 차분한 마음 안에서 자신을 온전히 내려놓습니다.{"\n"}
                  </Text>
                  <Text style={[styles.UpdateQuestionStyleClass]}>성령청원기도</Text>
                  <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                  하느님의 말씀은 하느님께서 이끌어 주셔야만 올바로 알아들을 수 있기에 반드시 성령의 도움이 필요합니다.{"\n"}
                  </Text>
                  <Text style={[styles.UpdateQuestionStyleClass]}>독서</Text>
                  <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                  하느님의 말씀을 듣는 것으로 세밀한 독서와 반복적인 독서를 하며, 말씀을 여러 차례 침묵 속에서 읽습니다.{"\n"}
                  </Text>
                  <Text style={[styles.UpdateQuestionStyleClass]}>묵상</Text>
                  <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                  말씀이 바로 나에게 지금 어떤 말을 걸고자 하는지에 대해 곰곰이 생각하며 노력을 기울이는 과정입니다.{"\n"}
                  </Text>
                  <Text style={[styles.UpdateQuestionStyleClass]}>기도</Text>
                  <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                  하느님께서 내게 주신 말씀을 되뇌이며 자연스럽게 솔직함과 그분께 대한 신뢰 안에서 하느님께 대답합니다.{"\n"}
                  </Text>
                  <Text style={[styles.UpdateQuestionStyleClass]}>관상</Text>
                  <Text style={[styles.textStyle, normalSize]}>
                  거룩한 독서를 통해 하느님의 말씀을 기억하면서 모든 것이 하느님의 은총임을 깨닫습니다. {"\n"}
                  </Text>
                  </ScrollView>
                ),
                third: () => (
                  <ScrollView style={[styles.scene, { backgroundColor: '#fff', paddingTop:10 }]}>            
                  <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>정해진 침묵의 시간</Text> 
                  <Text style={[styles.textStyle, normalSize]}>
                  거룩한 독서 1단계인 침묵을 준비하기 위해 반드시 따로 시간을 내야 합니다. 고요와 침묵과 고독에 도움이 되는 시간이어야 합니다. {"\n"}<Text style={{fontSize:13}}>* 조용한 장소에서 촛불을 켜고 진행하면 좋습니다.</Text>
                      {"\n"}
                  </Text>
                  <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>들을 귀가 있는 마음</Text>
                  <Text style={[styles.textStyle, normalSize]}>
                      급하게 해서는 안됩니다. 주님은 당신 말씀의 씨를 뿌리고 계시며 나 자신은 말씀이 떨어지는 땅입니다. 열매를 맺기 위해서는 좋은 땅이 준비되어야 합니다. 
                      {"\n"} 
                  </Text>
                  <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>지속적인 독서</Text>
                  <Text style={[styles.textStyle, normalSize]}>
                  꾸준함이 필요합니다. 지금 당장 성서 본문이 이해되지 않는다고 하더라도 지속적으로 연습하다보면 하느님의 말씀이 어느 순간 나의 마음을 울리게 될 것입니다.
                  </Text>
                  </ScrollView>
                )
                })}
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
                renderTabBar={(props) =>
                <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: '#01579b' }}
                style={{backgroundColor: "white"}}
                renderIcon={this.renderIcon}
                renderLabel={({ route }) => (
                    <View>
                        <Text style={{textAlign: 'center',
                            color: route.key === props.navigationState.routes[props.navigationState.index].key ?
                            '#01579b' : 'black'}}>
                            {route.title}
                        </Text>
                    </View>
                )}
                /> }
            /> 
            </View>      
              <View style={this.state.selectShow ? {flex:1,position: 'absolute', right:'2%', top:'8%', width:'96%', height:400, backgroundColor:"#fff", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>              
              <ScrollView 
              style={{flex:1, marginLeft:5, marginRight:5, paddingBottom:200, marginBottom:20}}
                  {...this._panResponder.panHandlers}
                  onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })}>        
                  <Text style={[styles.TextStyle,{marginTop:3, padding:10, color:'#000', textAlign:'center', fontSize:14}]}>{this.state.Weekenddate}</Text>    
                  <Text style={[styles.TextStyle,{marginTop:5, padding:10, color:'#01579b', textAlign:'center'}, normalSize]}>{this.state.Sentence}</Text>    
                  <Text style={[styles.TextStyle,{marginTop:20, padding:5, color:'#000', textAlign:'left', lineHeight:22},  normalSize]}>{this.state.Contents}</Text>           
                  </ScrollView>
                  <TouchableOpacity 
                  activeOpacity = {0.9}
                  style={{position: 'absolute', right:2, top:2}}
                  onPress={() => this.setState({selectShow:false}) } 
                  >    
                  <Icon name={'close'} size={30} color={"#000"} />        
              </TouchableOpacity>           
            </View>
              <ScrollView style={this.state.start == false ? {} : {display:'none'}}
              ref={(e) => { this.fScroll = e }}>   
              <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', backgroundColor:'#fff', borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
                <View style={{flexDirection: "column", flexWrap: 'wrap', width: '88%', height: 30, marginTop:10, paddingLeft:'1%'}}>
                    <Text style={[ styles.TextStyle, {fontSize:17, textAlign:'left', fontFamily:'NanumMyeongjoBold', color:"#000"}]}>주일의독서</Text>
                </View>
                
                <View style={{flexDirection: "column", flexWrap: 'wrap', width: '8%', height: 30, marginLeft:'0%', float:'right'}}>
                    <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() => this.setState({selectQuestion:true})} // insertComment
                    >      
                    <Icon5 name={'questioncircleo'} size={22} color={"#000"} style={{paddingTop:9}} />
                    </TouchableOpacity>
                </View>
                </View>     
                <Image source={require('../resources/weekend_img1.png')} style={{width: '100%', height: 150}} />     
                <View style={{flex:1, backgroundColor: "#fff", flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop:5, alignItems: 'center',  padding:10, paddingBottom:15, borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
                    <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5,flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center',   alignItems: 'center',  width: '48%', marginRight:'3%', height:40}}>
                    <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() => this.setState({selectShow: true})} 
                    >  
                    <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}> <Icon4 name={'book-open'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  주일의복음 읽기</Text>   
                    </TouchableOpacity>
                    </View>   
                    <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '48%', height: 40}}>
                    <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() =>  this.setState({start: true})} 
                    > 
                    <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon4 name={'play-circle'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  주일의독서 시작하기</Text>   
                    </TouchableOpacity>
                    </View>   
                </View>
                  <Text style={[{color:'#000', margin:10, lineHeight: 25}, normalSize]}>주일의 독서는 하느님 말씀을 들을 수 있도록 성령을 청하고, 말씀을 읽기 전에 배경지식을 공부함으로써 준비를 하고, 세밀하고 반복적인 독서를 통해 말씀을 온전히 읽고, 말씀이 나에게 어떤 말을 건네고 있는지 묵상하며, 한 주간 묵상할 구절을 골라 하느님 말씀으로 기도합니다. 한 주간 선택한 구절을 되새김함으로써 말씀과 함께 살아가는 연습을 할 수 있습니다.</Text>
                  <Image source={require('../resources/weekend_img2.png')}   resizeMode={'cover'} style={{ width: '100%', height: 80 }} />  
                  <View style={{width:'100%',  justifyContent: 'center',  alignItems: 'center', marginBottom:10}}>                 
              </View>
              </ScrollView>
             
              <View style={this.state.praying == true ? {backgroundColor:'#fff'} : {display:'none'}}>        
                  <View style = {styles.container}>
                  <TouchableOpacity
                  activeOpacity={0.7}
                  style={{ paddingVertical: 8,
                      paddingHorizontal: 15}}
                  onPress={() =>  this.setState({praying: false, start: false, Weekendupdate: true}) }
                  >
                      <Text style={{color:"#000", textAlign:'right'}}>
                          완료
                      </Text>
                  </TouchableOpacity>             
                  </View>  
                  <ImageBackground source={require('../resources/pray2_img.png')} style={{width: '100%', height: 600}}>
                    <ScrollView style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, marginBottom:130}}>
        
                    <Text style={[{textAlign:'center', color:'#fff', paddingTop:270, lineHeight: 22}, normalSize]}> 
                    주님께서 나에게 말씀하셨다.{"\n"}                         
                        "{this.state.js2}"
                    {"\n"}{"\n"}
                    주님 제가 이 말씀을 깊이 새기고{"\n"}
                    하루를 살아가도록 이끄소서. {"\n"}
                    {"\n"}                              
                    "{this.state.mysentence}"{"\n"}{"\n"}
                    이 구절을 한주간 묵상하며 살게 하소서. 아멘.{"\n"}
                      </Text>                                      
                    </ScrollView>                        
                  </ImageBackground> 
              </View>

              <View style={this.state.start == true && this.state.praying ==false ? {backgroundColor:'#fff'} : {display:'none'}}>       
                  <View style={this.state.start == true ? {} : {display:'none'}} >
                          <TouchableOpacity
                          activeOpacity = {0.9}
                          style={{backgroundColor: '#01579b', padding: 10}}
                          onPress={() => this.state.currentIndex == 0 || this.state.currentIndex == 1 || !this.state.start  ? 
                            this.setState({start: false, bg1: "", bg2: "", bg3: "", sum1: "", sum2: "", js1:"", js2:"", mysentence: "", currentIndex: 0})
                            :  Alert.alert(
                              '정말 끝내시겠습니까?',
                              '확인을 누르면 쓴 내용이 저장되지 않습니다.',
                              [                                 
                                {
                                  text: '취소',
                                  onPress: () => console.log('Cancel Pressed'),
                                  style: 'cancel',
                                },
                                {text: '끝내기', onPress:() =>   [Keyboard.dismiss(), this.setState({start: false, bg1: "", bg2: "", bg3: "", sum1: "", sum2: "", js1:"", js2:"", mysentence: "", currentIndex: 0})]},
                              ],
                              {cancelable: true},
                            )}
                          >
                          <Text style={{color:"#FFF", textAlign:'left'}}>
                              {"<"} 뒤로
                          </Text>
                      </TouchableOpacity>
                  </View>
                  <OnboardingButton
                      totalItems={ this.state.question != null ? 12 : 11}
                      currentIndex={this.state.currentIndex}
                      movePrevious={this.movePrevious}
                      moveNext={this.moveNext}
                      moveFinal={this.moveFinal}
                  />
                  <KeyboardAvoidingView style={(this.state.currentIndex == 9 && this.state.question != null) ? {height:150} : {height:130}}>
                      <View style={this.state.currentIndex == 0 ? {} : {display:'none'} }>
                    
                      <ImageBackground source={require('../resources/pray1_img.png')} style={{width: '100%', height: 600}}>
                      <ScrollView style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, marginBottom:130}}>
          
                      <Text style={[{textAlign:'center', color:'#fff', paddingTop:'30%', lineHeight: 25}, normalSize]}> 빛이신 우리 아버지 하느님, {"\n"}
                            하느님께서는 세상에 아드님을 보내셨으니, {"\n"}
                            그분은 우리 사람들에게 보여주시기 위해 몸이 되신 {"\n"}
                            말씀이시옵니다.{"\n"}
                            이제 주님의 성령을 제 위에 보내시어{"\n"}
                            주님께로부터 오는 이 말씀 안에서 {"\n"}
                            예수 그리스도를 만나뵈옵게 하소서.{"\n"}
                            그리고 그분을 더 깊이 알게 해주시어, {"\n"}
                            그분을 더 깊이 사랑할 수 있게 해 주시고,{"\n"}
                            주님 나라의 참된 행복에 이르게 하소서.{"\n"}
                            아멘.{"\n"}</Text>          
                    
                      </ScrollView>
                        </ImageBackground>
                                
                      </View>

                      <View style={this.state.currentIndex == 1 ? {} : {display:'none'}}>
                        <Text style={{textAlign:'center', paddingTop:40, fontSize:15, color: "#01579b"}}>말씀을 이해하기 위한 필요한 기초적인 정보를 찾아봅시다</Text> 
                        <Text style={[{textAlign:'center', paddingTop:40, fontSize:15, color: "#000"}, normalSize]}>{this.state.background}</Text>                                             
                      </View>
                      <View style={this.state.currentIndex == 2 ? {} : {display:'none'}}>
                        <Text style={[{textAlign:'center', paddingTop:40, color: "#01579b"}, largeSize]}>{this.state.Sentence}</Text>                                               
                      </View>

                      <View style={this.state.currentIndex == 3 ? {} : {display:'none'}}>
                      <Text style={styles.TextQuestionStyleClass}>복음의 등장인물은?</Text>
                      <TextInput
                      multiline = {true}
                      placeholder="여기에 적어봅시다"
                      value={this.state.bg1}        
                      onChangeText={bg1 => this.setState({bg1})}        
                      // Making the Under line Transparent.
                      underlineColorAndroid='transparent'        
                      style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                           
                      </View>

                      <View style={this.state.currentIndex == 4 ? {} : {display:'none'}}>
                      <Text style={styles.TextQuestionStyleClass}>복음의 배경장소는?</Text>
                      <TextInput
                      multiline = {true}
                      placeholder="여기에 적어봅시다"
                      value={this.state.bg2}        
                      onChangeText={bg2 => this.setState({bg2})}        
                      // Making the Under line Transparent.
                      underlineColorAndroid='transparent'        
                      style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                         
                      </View>

                      <View style={this.state.currentIndex == 5 ? {} : {display:'none'}}>
                      <Text style={styles.TextQuestionStyleClass}>배경시간 혹은 상황은?</Text>
                      <TextInput
                      multiline = {true}
                      placeholder="여기에 적어봅시다"
                      value={this.state.bg3}        
                      onChangeText={bg3 => this.setState({bg3})}        
                      // Making the Under line Transparent.
                      underlineColorAndroid='transparent'        
                      style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                             
                      </View>

                      <View style={this.state.currentIndex == 6 ? {} : {display:'none'}}>
                      <Text style={styles.TextQuestionStyleClass}>복음의 내용을 사건 중심으로 요약해 봅시다.</Text>
                      <TextInput
                      multiline = {true}
                      placeholder="여기에 적어봅시다"
                      value={this.state.sum1}        
                      onChangeText={sum1 => this.setState({sum1})}        
                      // Making the Under line Transparent.
                      underlineColorAndroid='transparent'        
                      style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                            
                      </View>

                      <View style={this.state.currentIndex == 7 ? {} : {display:'none'}}>
                      <Text style={styles.TextQuestionStyleClass}>특별히 눈에 띄는 부분은?</Text>
                      <TextInput
                      multiline = {true}
                      placeholder="여기에 적어봅시다"
                      value={this.state.sum2}        
                      onChangeText={sum2 => this.setState({sum2})}        
                      // Making the Under line Transparent.
                      underlineColorAndroid='transparent'        
                      style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                            
                      </View>

                      <View style={this.state.currentIndex == 8 ? {} : {display:'none'}}>
                      <Text style={styles.TextQuestionStyleClass}>복음에서 보여지는 예수님의 모습은 어떠한가요?</Text>
                      <TextInput
                      multiline = {true}
                      placeholder="여기에 적어봅시다"
                      value={this.state.js1}        
                      onChangeText={js1 => this.setState({js1})}        
                      // Making the Under line Transparent.
                      underlineColorAndroid='transparent'        
                      style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                            
                      </View>

                      <View style={(this.state.currentIndex == 9 && this.state.question != null) ? {} : {display:'none'}}>
                      <Text style={styles.TextQuestionStyleClass}>{this.state.question}</Text>
                      <TextInput
                      multiline = {true}
                      placeholder="여기에 적어봅시다"
                      value={this.state.answer}        
                      onChangeText={answer => this.setState({answer})}        
                      // Making the Under line Transparent.
                      underlineColorAndroid='transparent'        
                      style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                             
                      </View>

                      <View style={(this.state.currentIndex == 10 && this.state.question!= null) || (this.state.currentIndex==9 && this.state.question == null) ? {} : {display:'none'}}>
                      <Text style={styles.TextQuestionStyleClass}>복음을 통하여 예수님께서 내게 해주시는 말씀은?</Text>
                      <TextInput
                      multiline = {true}
                      placeholder="여기에 적어봅시다"
                      value={this.state.js2}        
                      onChangeText={js2 => this.setState({js2})}        
                      // Making the Under line Transparent.
                      underlineColorAndroid='transparent'        
                      style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                          
                      </View>

                      <View style={(this.state.currentIndex == 11 && this.state.question!= null) || (this.state.currentIndex==10 && this.state.question == null) ? {} : {display:'none'}}>
                      <Text style={styles.TextQuestionStyleClass}>이번주 복음에서 특별히 와닿는 구절을 선택해 봅시다.</Text>
                      <TextInput
                      multiline = {true}
                      placeholder="여기에 적어봅시다"
                      value={this.state.mysentence}        
                      onChangeText={mysentence => this.setState({mysentence})}        
                      // Making the Under line Transparent.
                      underlineColorAndroid='transparent'        
                      style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                           
                      </View>      
                      
                  </KeyboardAvoidingView>

                
                  <KeyboardAwareScrollView style={this.state.currentIndex == 0 || this.state.currentIndex ==1 ? {display:'none'} : this.state.currentIndex == 9 ? {marginTop:20, marginBottom:130} :{marginBottom:130} }>      
                      <TouchableHighlight
                      style={this.state.currentIndex == 2  ? {display:'none'} : { justifyContent: 'center', alignItems: 'center'}}
                      underlayColor = {"#fff"}
                      onPress={() => this.getPrevMoreGaspel()}>
                          <Icon name={"chevron-up"} size={40} color={"#A8A8A8"} /> 
                      </TouchableHighlight >     
                      <Text style={[styles.DescriptionComponentStyle, normalSize]}>{this.state.Contents}</Text>        
                      <TouchableHighlight
                      style={this.state.currentIndex == 2  ? {display:'none'} : { justifyContent: 'center', alignItems: 'center'}}
                      underlayColor = {"#fff"}
                      onPress={() => this.getNextMoreGaspel()}>
                            <Icon name={"chevron-down"} size={40} color={"#A8A8A8"} /> 
                      </TouchableHighlight >                                        
                      <View style={{height:90}} />    
                  </KeyboardAwareScrollView>  
              </View>
          </View>   
        )       
  }
}
Main4.propTypes = {
    getGaspel: PropTypes.func,
    getWeekendMore: PropTypes.func,
    getThreeGaspel: PropTypes.func,
    insertWeekend: PropTypes.func,   
    updateWeekend: PropTypes.func, 
    weekend: PropTypes.object, // gaspelaction 결과값
    status: PropTypes.shape({
        isLogged: PropTypes.bool,
        loginId: PropTypes.string
    })
  };
  
const styles = StyleSheet.create({    
  textStyle:{ backgroundColor: '#fff', color:'#000', lineHeight:25, fontSize:15, margin:5 },
  TextStyle:{
    color:'#000', 
    textAlign: 'center', 
    width:'100%',
    marginBottom:3
  },    
  DescriptionComponentStyle: {
    fontSize: 15,
    lineHeight:25,
    padding:5,
    color: "#000",
    marginBottom: 1
  },
  TextInputStyleClass: { 
    padding:5,
    textAlign: 'center',
    margin:5,
    marginBottom: 7,
    height: 90,
    borderWidth: 1,
    borderColor: '#01579b',
    borderRadius: 5 
  },
  TextResultStyleClass: { 
    padding:5,
    textAlign: 'center',
    color: "#000",
    margin:5,
    marginBottom: 7,
     fontSize:14 
    },
  UpdateQuestionStyleClass: {
    textAlign: 'center',
    color: '#686868',
    backgroundColor:'#F9F9F9',
    padding:5,
    borderBottomColor:"#d8d8d8", 
    borderBottomWidth:0.5,
    fontSize:14
  },
  TextQuestionStyleClass: {
    textAlign:'center', 
    fontSize:15, 
    color: "#01579b", 
    marginBottom:10
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
  Button:{
    textAlign:'center',
    backgroundColor: '#01579b', 
    padding: 10, 
    marginTop:10,
    width:200,
    borderRadius: 10,
    height:40
  },
  MainContainer :{     
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    margin: 0,
    color:"#fff"
    },    
  TextComponentStyle: {
    fontSize: 16,
    color: "#000",
    textAlign: 'center',
    marginTop: 3, 
    marginBottom: 15
  },
});