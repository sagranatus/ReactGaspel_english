import React, { Component } from 'react';
import { Dimensions, PanResponder, PixelRatio, StyleSheet, TextInput, View, Text, TouchableOpacity, ScrollView, Keyboard, KeyboardAvoidingView, Alert, NetInfo, Image, ImageBackground, TouchableHighlight, AsyncStorage, ActivityIndicator } from 'react-native';
import {PropTypes} from 'prop-types';
import Icon from 'react-native-vector-icons/EvilIcons'
import { openDatabase } from 'react-native-sqlite-storage';
import {NavigationEvents} from 'react-navigation'
import Icon3 from 'react-native-vector-icons/FontAwesome'
import Icon4 from 'react-native-vector-icons/Feather'
import Icon5 from 'react-native-vector-icons/AntDesign'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
var db = openDatabase({ name: 'UserDatabase.db' });
import OnboardingButton from '../etc/OnboardingButton'

var normalSize;
var normalSize_input;
var largeSize;
export default class Main3 extends Component { 
constructor(props) { 
    super(props)      
    this.state = {
        internet: true,
        Contents : "",
        Date: "", // - - 
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
        start: false,
        praying: false,
        Lectiodate:"", // 년 월 일 요일
        Lectioupdate: false,
        Lectioediting: false,
        currentIndex:0,
        initialLoading: true,
        basic: null, // null 시에 선택창알림
        comment: null,
        doMore: false,
        weekend: false,
        selectShow: false,
        selectQuestion: false,
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
    this.transitionToNextPanel("prev", this.state.currentIndex -1);
}

moveNext(){
    this.transitionToNextPanel("next", this.state.currentIndex +1);
}

moveFinal(){
    console.log("Main3 - moveFinal")
    Keyboard.dismiss()
    // lectio server
    if(this.state.Lectioupdate){
        // 업데이트시 수정하기- 진행후에 Lectioediting: false
        
        const loginId = this.props.status.loginId;
        const date = this.state.Lectiodate;
        const bg1 = this.state.bg1
        const bg2 = this.state.bg2
        const bg3 = this.state.bg3
        const sum1 = this.state.sum1
        const sum2 = this.state.sum2
        const js1 = this.state.js1
        const js2 = this.state.js2
        const comment = this.state.comment
        try {
            AsyncStorage.setItem('refreshMain1', "refresh");
          } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
          }     
        if(this.state.basic){
            // 말씀새기기 한 경우
            this.props.updateComment("update",this.props.status.loginId,this.state.Lectiodate,this.state.Sentence, this.state.comment)
             // comment DB를 업데이트
            db.transaction(function(tx) {
                tx.executeSql(
                    'UPDATE comment set comment=? where uid=? and date=?',
                    [comment, loginId, date],
                    (tx, results) => {
                //  console.log('Results', 'done');
                    if (results.rowsAffected > 0) {
                        console.log('Main3 - comment data updated : ', "update success")        
                        Alert.alert("수정 하였습니다.")           
                    } else {
                        console.log('Main3 - comment data updated : ', "update fail")  
                    }
                    }
                );
                }); 
        }else{
            // 거룩한 독서 한경우
            this.props.updateLectio("update",this.props.status.loginId, this.state.Lectiodate, this.state.Sentence, this.state.bg1, this.state.bg2, this.state.bg3, this.state.sum1, this.state.sum2, this.state.js1, this.state.js2)
              // lectio DB를 업데이트
            db.transaction(function(tx) {
                tx.executeSql(
                    'UPDATE lectio set bg1=?, bg2=?, bg3=?, sum1=?, sum2=?, js1=?, js2=? where uid=? and date=?',
                    [bg1, bg2, bg3, sum1, sum2, js1, js2, loginId, date],
                    (tx, results) => {
                    if (results.rowsAffected > 0) {
                        console.log('Main3 - lectio data updated : ', "success")                       
                    } else {
                        console.log('Main3 - lectio data updated : ', "success")     
                    }
                    }
                );
                }); 
        }
      
        this.setState({ Lectioediting: false });
    }else{ 
        // 처음 삽입하기 - 진행 후에 praying:true
        try {
            AsyncStorage.setItem('refreshMain5', "refresh");
            AsyncStorage.setItem('refreshMain1', "refresh");
          } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
          }
        const loginId = this.props.status.loginId;
        const sentence = this.state.Sentence;
        const date = this.state.Lectiodate;
        const bg1 = this.state.bg1
        const bg2 = this.state.bg2
        const bg3 = this.state.bg3
        const sum1 = this.state.sum1
        const sum2 = this.state.sum2
        const js1 = this.state.js1
        const js2 = this.state.js2
        const comment = this.state.comment
        if(this.state.basic){
            // 말씀새기기 쓴 경우
            this.props.insertComment("insert", this.props.status.loginId,this.state.Lectiodate,this.state.Sentence, this.state.comment)
                // comment DB에 삽입
            db.transaction(tx => {
                db.transaction(function(tx) {
                    tx.executeSql(
                    'INSERT INTO comment (uid, date, onesentence, comment) VALUES (?,?,?,?)',
                    [loginId,date,sentence, comment],
                    (tx, results) => {
                        if (results.rowsAffected > 0) {
                            console.log('Main3 - comment data inserted : ', "success")                 
                        } else {
                            console.log('Main3 - comment data inserted : ', "failed") 
                        }
                    }
                    );
                }); 
            });
            this.setState({ praying : true });
         }else{
             // 거룩한 독서 한 경우
            this.props.insertLectio("insert", this.props.status.loginId, this.state.Lectiodate, this.state.Sentence, this.state.bg1, this.state.bg2, this.state.bg3, this.state.sum1, this.state.sum2, this.state.js1, this.state.js2)
    
                // lectio DB에 삽입
            db.transaction(tx => {
                tx.executeSql(
                'SELECT * FROM lectio where date = ? and uid = ?',
                [date, loginId],
                (tx, results) => {
                    var len = results.rows.length;
                //  값이 있는 경우에 
                    if (len > 0) {                  
                        console.log('Main3 - lectio data', "existed")        
                    } else {
                    db.transaction(function(tx) {
                        tx.executeSql(
                        'INSERT INTO lectio (uid, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2) VALUES (?,?,?,?,?,?,?,?,?,?)',
                        [loginId,date,sentence, bg1, bg2, bg3, sum1, sum2, js1, js2],
                        (tx, results) => {
                            if (results.rowsAffected > 0) {
                                console.log('Main3 - lectio data inserted : ', "success")                 
                            } else {
                                console.log('Main3 - lectio data inserted : ', "failed")       
                            }
                        }
                        );
                    });                             
                    }
                }
                );
            });    
            this.setState({praying : true});
            }
      
        
    }
}



transitionToNextPanel(from, nextIndex){   
    if(this.state.currentIndex == 1 && this.state.basic == null && from=="next"){
        // 복음읽기 후에 선택창 띄우기 
        Alert.alert(
            '말씀새기기 / 거룩한독서를 선택하세요.',
            '환경설정에서 설정하시면 선택창이 뜨지 않습니다.',
            [
              {text: '말씀새기기', onPress: () => this.setState({
                basic:true, currentIndex: nextIndex})
               },
              {text: '거룩한독서', onPress: () => this.setState({
                basic:false, currentIndex: nextIndex})  
               },
            ],
            {cancelable: true},
          );
    }else{
        this.setState({
            currentIndex: nextIndex
        });   
    }     
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
      // course 가져와서 basic 세팅
      AsyncStorage.getItem('course', (err, result) => {
        if(result == "basic"){
            this.setState({basic:true})
        }else if(result == "advanced"){          
            this.setState({basic:false})
        }
      })

    // 날짜 생성, today3 저장, weekend, Date, LectioDate setting
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
    if(date.getDay() == 0){
        this.setState({weekend:true})
    }
    var today = year+"-"+month+"-"+day;
       // 오늘날짜를 설정 
       try {
        AsyncStorage.setItem('today3', today);
      } catch (error) {
        console.error('AsyncStorage error: ' + error.message);
      }
    var today_comment_date = year+"년 "+month+"월 "+day+"일 "+this.getTodayLabel()
    console.log('Main3 - today date : ', today+"/"+today_comment_date)

    this.setState({
        Date: today,
        Lectiodate: today_comment_date
    })

    // gaspel 데이터 가져오기
    this.props.getGaspel(today) 

    
    // comment나 lectio DB가 있는지 확인
    const loginId = this.props.status.loginId;    
    db.transaction(tx => {       
        //comment있는지 확인  
        tx.executeSql(
          'SELECT * FROM comment where date = ? and uid = ?',
          [today_comment_date, loginId],
          (tx, results) => {
            var len = results.rows.length;
          //  comment 값이 있는 경우에 가져오기 
            if (len > 0) {                  
                console.log('Main3 - check Comment data : ', results.rows.item(0).comment)   
                this.setState({
                    comment: results.rows.item(0).comment,
                    Lectioupdate: true,
                    initialLoading: false,
                    basic: true
                })
            } else {     
                this.setState({
                    initialLoading: false
                })                             
            }
          }
        ),
        tx.executeSql(
            'SELECT * FROM lectio where date = ? and uid = ?',
            [today_comment_date,loginId],
            (tx, results) => {
              var len = results.rows.length;
            //  lectio 값이 있는 경우에 가져오기
              if (len > 0) {                  
                  console.log('Main3 - check Lectio data : ', results.rows.item(0).bg1) 
                  this.setState({
                      bg1 : results.rows.item(0).bg1,
                      bg2 : results.rows.item(0).bg2,
                      bg3 : results.rows.item(0).bg3,
                      sum1 : results.rows.item(0).sum1,
                      sum2 : results.rows.item(0).sum2,
                      js1 : results.rows.item(0).js1,
                      js2 : results.rows.item(0).js2,
                      Lectioupdate: true,
                      initialLoading: false,
                      comment:null,
                      basic: false
                  })
              } else {
                  this.setState({          
                      initialLoading: false
                  })                        
              }
            }
          )
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
    //  alert("awdad")
       // comment나 lectio DB가 있는지 확인
       const loginId = this.props.status.loginId;    
       var today_comment_date =this.state.Lectiodate
       db.transaction(tx => {       
           //comment있는지 확인  
           tx.executeSql(
             'SELECT * FROM comment where date = ? and uid = ?',
             [today_comment_date, loginId],
             (tx, results) => {
               var len = results.rows.length;
             //  comment 값이 있는 경우에 가져오기 
               if (len > 0) {                  
                   console.log('Main3 - check Comment data : ', results.rows.item(0).comment)   
                   this.setState({
                       comment: results.rows.item(0).comment,
                       Lectioupdate: true,
                       initialLoading: false,
                       basic: true
                   })
               } else {     
                   this.setState({
                       initialLoading: false
                   })                             
               }
             }
           ),
           tx.executeSql(
               'SELECT * FROM lectio where date = ? and uid = ?',
               [today_comment_date,loginId],
               (tx, results) => {
                 var len = results.rows.length;
               //  lectio 값이 있는 경우에 가져오기
                 if (len > 0) {                  
                     console.log('Main3 - check Lectio data : ', results.rows.item(0).bg1) 
                     this.setState({
                         bg1 : results.rows.item(0).bg1,
                         bg2 : results.rows.item(0).bg2,
                         bg3 : results.rows.item(0).bg3,
                         sum1 : results.rows.item(0).sum1,
                         sum2 : results.rows.item(0).sum2,
                         js1 : results.rows.item(0).js1,
                         js2 : results.rows.item(0).js2,
                         Sentence : results.rows.item(0).onesentence,
                         Lectioupdate: true,
                         initialLoading: false,
                         comment:null,
                         basic: false
                     })
                 } else {
                     this.setState({          
                         initialLoading: false
                     })                        
                 }
               }
             )
         });   
  }

  getBasicInfo(){
    // basic 값 다시 가져옴
    AsyncStorage.getItem('course', (err, result) => {
        if(result == "basic"){
            this.setState({basic:true})
        }else if(result == "advanced"){          
            this.setState({basic:false})
        }
      })
  }

    getTodayLabel() {        
        var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');        
        var today = new Date().getDay();
        var todayLabel = week[today];        
        return todayLabel;
    }

componentWillReceiveProps(nextProps){    
    // getGaspel에서 받아오는 경우
    if(nextProps.lectios.sentence != null){
        console.log('Main3 - get Gaspel Data')  
        var contents = ""+nextProps.lectios.contents
        var sentence = ""+nextProps.lectios.sentence
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
        var chapter = pos[0].substring(0,pos[0].indexOf(","))
        contents_ = contents.substring(pos.index+pos[0].length)

        // 여기서 각 절 번호 가져옴
        pos = contents_.match(/\d{1,2}/gi) // 모든 절 위치 가져옴

        // 절 가져옴
        var first_verse = pos[0]
        var last_verse = pos[pos.length-1]

        console.log("Main3 - first verse, last verse get : ", first_verse+"/"+last_verse)

        // 복음사가 가져옴
        var idx_today = contents.indexOf("전한 거룩한 복음입니다.");
        var today_person;
        if(idx_today == -1){
            idx_today = contents.indexOf("전한 거룩한 복음의 시작입니다.");
            today_person = contents.substring(2,idx_today-2); // 복음사 사람 이름
        }else{
            today_person = contents.substring(2,idx_today-2);
        }

            console.log("Main3 - person & chapter get : ",today_person+"/"+chapter);
        // Contents, Sentence, Firstverse, Lastverse, Person, Capter 세팅
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
    if(nextProps.lectios.threegaspels != null){   
        console.log("Main3 - Three gaspel get")             
        if(this.state.Move == "prev"){
            this.setState({
                Contents : nextProps.lectios.threegaspels+"\n"+this.state.Contents
            })    
        }else{
            this.setState({
                Contents : this.state.Contents+"\n"+nextProps.lectios.threegaspels
            })    
        }          
    }     
}
  
setChange(){
    // textSize 가져옴
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

       if(!this.state.Lectioupdate) {
        // 업데이트가 아닌 경우 course basic 세팅      
        AsyncStorage.getItem('course', (err, result) => {
            if(result == "basic"){
                this.setState({basic:true})
            }else if(result == "advanced"){          
                this.setState({basic:false})
            }else if(result == "notselected"){          
                this.setState({basic:null})
            }
          })
        }
        
    // today3 값 오늘과 비교
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
   var todaydate = year+"-"+month+"-"+day;
   var today_comment_date = year+"년 "+month+"월 "+day+"일 "+this.getTodayLabel()
   AsyncStorage.getItem('today3', (err, result) => {
     console.log("Main3 - get AsyncStorage today : ", result)
     if(result == todaydate){
       console.log("today is same")
       this.setState({reload: true})
     }else{
        // 날짜가 다른 경우 다시 today3세팅, weekend 세팅 및 gaspel 가져오기, DB 확인
       console.log("today is different")
          // 오늘날짜를 설정 
        try {
            AsyncStorage.setItem('today3', todaydate);
        } catch (error) {
            console.error('AsyncStorage error: ' + error.message);
        }        
        if(date.getDay() == 0){
            this.setState({weekend:true})
        }else{
            this.setState({weekend:false})
        }
    
       this.setState({
            Date: todaydate,  
            Lectiodate: today_comment_date, 
            Contents : "",           
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
            start: false,
            praying: false,
            Lectioupdate: false,
            Lectioediting: false,
            currentIndex:0,
            initialLoading: true,
            basic: null,
            comment: null,
            doMore: false })
       this.props.getGaspel(todaydate)
        // comment, lectio DB 있는지 확인
        const loginId = this.props.status.loginId;    
        db.transaction(tx => {
            tx.executeSql(
                'SELECT * FROM comment where date = ? and uid = ?',
                [today_comment_date, loginId],
                (tx, results) => {
                  var len = results.rows.length;
                //  값이 있는 경우에 
                  if (len > 0) {                  
                      console.log('Main3 - check Comment data : ', results.rows.item(0).comment)   
                      this.setState({
                          comment: results.rows.item(0).comment,
                          Lectioupdate: true,
                          initialLoading: false,
                          basic: true
                      })
                  } else {     
                      this.setState({
                          initialLoading: false
                      })                             
                  }
                }
              ),
              tx.executeSql(
                  'SELECT * FROM lectio where date = ? and uid = ?',
                  [today_comment_date,loginId],
                  (tx, results) => {
                    var len = results.rows.length;
                  //  값이 있는 경우에 
                    if (len > 0) {                  
                        console.log('Main3 - check Lectio data : ', results.rows.item(0).bg1) 
                        this.setState({
                            bg1 : results.rows.item(0).bg1,
                            bg2 : results.rows.item(0).bg2,
                            bg3 : results.rows.item(0).bg3,
                            sum1 : results.rows.item(0).sum1,
                            sum2 : results.rows.item(0).sum2,
                            js1 : results.rows.item(0).js1,
                            js2 : results.rows.item(0).js2,
                            Lectioupdate: true,
                            initialLoading: false,
                            comment:null,
                            basic: false
                        })
                    } else {
                        this.setState({          
                            initialLoading: false
                        })                        
                    }
                  }
                )
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
    console.log("Main3 - in render");
    return !this.state.internet ? 
    (    
      <View style={[styles.MainContainer, {backgroundColor:'#F8F8F8'}]}>             
      <Text style= {[styles.TextComponentStyle, {color:'#000', fontSize: 16}]}>인터넷을 연결해주세요</Text>
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

    : 
    (this.state.weekend) ? 
        <View style={styles.MainContainer_weekend}> 
            <NavigationEvents
            onWillFocus={payload => {
                this.setChange();
            }}
            />
            <Text style= {styles.TextComponentStyle}>주일에는 주일의 독서를 해주세요.</Text>
        </View> 
    :
    (this.state.Lectioupdate == true) ?
        (this.state.Lectioediting == true) ?
        // lectio 수정중인 상태 
           (
            <View style={{backgroundColor:'#fff'}}>
                <NavigationEvents
                onWillFocus={payload => {
                    this.setChange();
                }}
                />
                <View>                  
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
                                {text: '끝내기', onPress: () =>  [Keyboard.dismiss(),this.setState({Lectioediting: false}), this.getData()]},
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
                totalItems={this.state.basic ? 1 : 7}
                currentIndex={this.state.currentIndex}
                movePrevious={this.movePrevious}
                moveNext={this.moveNext}
                moveFinal={this.moveFinal}
                />
                <KeyboardAvoidingView style={{height:130}}>                    
                    <View style={this.state.currentIndex == 0 && !this.state.basic ? {} : {display:'none'}}>
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
                    <View style={this.state.currentIndex == 0 && this.state.basic ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>오늘 하루동안 묵상하고 싶은 구절을 적어 봅시다.</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="여기에 적어봅시다"
                        value={this.state.comment}        
                        onChangeText={comment => this.setState({comment})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}] }  />                           
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
                    <View style={this.state.currentIndex == 6 ? {} : {display:'none'}}>
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
                </KeyboardAvoidingView>                    
                <KeyboardAwareScrollView style={{marginBottom:230}}>              
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
        // 내용이 있고 수정 아닌 상태
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
                    <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>오늘의 복음으로 간단한 말씀새기기와{"\n"} 거룩한독서를 할 수 있습니다.</Text> 
                    
                    <Text style={[styles.UpdateQuestionStyleClass, {marginTop:10}]}>말씀새기기</Text>
                    <View style={{ flex:1, justifyContent: 'center', alignItems: 'center', marginTop:10}}> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}> 
                    성령청원기도 
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} />  
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center',backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    독서 
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center',backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    간단한 묵상
                    </Text>
                    <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>· 오늘 하루동안 묵상하고 싶은 구절을 적어 봅시다.(묵상)</Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                    <Text style={[styles.textStyle, normalSize, {margin:5,width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    묵상후 기도
                    </Text>    

                    </View>   
                    <Text style={[styles.UpdateQuestionStyleClass, {marginTop:10}]}>거룩한독서</Text>
                    
                    <View style={{ flex:1, justifyContent: 'center', alignItems: 'center', marginTop:10, marginBottom:20}}> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    성령청원기도 
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} />  
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    세밀한 독서
                    </Text>
                    <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>
                    · 복음의 등장 인물은?
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
                    {"\n"}· 복음을 통하여 예수님께서 내게 해주시는 말씀은?
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
            <View style={this.state.selectShow ? {flex:1,position: 'absolute', right:'2%', top:'8%', width:'96%', height:500, backgroundColor:"#fff", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>              
                <ScrollView 
                style={{flex:1, marginLeft:5, marginRight:5, paddingBottom:200, marginBottom:20}}
                    {...this._panResponder.panHandlers}
                    onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })}>        
                    <Text style={[styles.TextStyle,{marginTop:3, padding:10, color:'#000', textAlign:'center', fontSize:14}]}>{this.state.Lectiodate}</Text>    
                     <Text style={[styles.TextStyle,{marginTop:5, padding:10, color:'#01579b', textAlign:'center'}, largeSize]}>{this.state.Sentence}</Text>    
                    <Text style={[styles.TextStyle,{marginTop:20, padding:5, color:'#000', textAlign:'left', lineHeight:22},  normalSize]}>{this.state.Contents}</Text>           
                    </ScrollView>
                    <TouchableOpacity 
                    activeOpacity = {0.9}
                    style={{position: 'absolute', right:5, top:5}}
                    onPress={() => this.setState({selectShow:false}) } 
                    >    
                    <Icon name={'close'} size={30} color={"#000"} />        
                </TouchableOpacity>           
            </View>   
            <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', backgroundColor:'#fff',  borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
                <View style={{flexDirection: "column", flexWrap: 'wrap', width: '88%', height: 30, marginTop:10, paddingLeft:'1%'}}>
                    <Text style={[ styles.TextStyle, {fontSize:17, textAlign:'left', fontFamily:'NanumMyeongjoBold', color:"#000"}]}>거룩한독서</Text>
                </View>
                
                <View style={{flexDirection: "column", flexWrap: 'wrap', width: '8%', height: 30, marginLeft:'0%', float:'right'}}>
                    <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() => this.setState({selectQuestion:true, selectShow: false})} // insertComment
                    >      
                    <Icon5 name={'questioncircleo'} size={22} color={"#000"} style={{paddingTop:9}} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView style={!this.state.basic ? {backgroundColor:'#fff'} : {display:'none'}}
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
                  onPress={() => this.setState({ Lectioediting: true, currentIndex: 0 })}
                  > 
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon4 name={'edit-3'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  수정하기</Text>   
                  </TouchableOpacity>
                  </View>   
                  <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '32%', height: 40}}>
                  <TouchableOpacity 
                  activeOpacity = {0.9}
                  onPress={() => this.props.navigation.navigate('SendImage', {otherParam: "Main3", otherParam2: this.state.Lectiodate})}
                  > 
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon3 name={'send-o'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  공유하기</Text>   
                  </TouchableOpacity>
                  </View>   
                </View>       
                <Text style={[{color:'#01579b', textAlign: 'center',  marginTop: 10, marginBottom: 10, padding:5}, largeSize]}>{this.state.Sentence}</Text>           
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
                <Text style={styles.UpdateQuestionStyleClass}>복음을 통하여 예수님께서 내게 해주시는 말씀은?</Text>
                <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.js2}</Text>        
                <View style={{width:'100%',  justifyContent: 'center',  alignItems: 'center', marginBottom:10}}>                
                </View>
            </ScrollView>

            <ScrollView style={this.state.basic ? {backgroundColor:'#fff'} : {display:'none'}}
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
                  onPress={() => this.setState({ Lectioediting: true, currentIndex: 0 })}
                  > 
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon4 name={'edit-3'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  수정하기</Text>   
                  </TouchableOpacity>
                  </View>   
                  <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '32%', height: 40}}>
                  <TouchableOpacity 
                  activeOpacity = {0.9}
                  onPress={() => this.props.navigation.navigate('SendImage', {otherParam: "Main3", otherParam2: this.state.Lectiodate})}
                  > 
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon3 name={'send-o'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  공유하기</Text>   
                  </TouchableOpacity>
                  </View>   
                </View>      

                <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() => this.setState({selectShow:true}) } 
                    >    
                <Text style={[{color:'#01579b', textAlign: 'center',  marginTop: 10, marginBottom: 10, padding:5}, largeSize]}>{this.state.Sentence}</Text>
                </TouchableOpacity> 
                <Text style={styles.UpdateQuestionStyleClass}>오늘 하루동안 묵상하고 싶은 구절</Text>
                <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.comment}</Text>   
               
                <View style={{width:'100%',  justifyContent: 'center',  alignItems: 'center', marginTop:10}}>
                <TouchableOpacity
                activeOpacity = {0.9}
                style={[styles.Button, {width:200}]}
                onPress={() => this.setState({ Lectioupdate: false, start:true, currentIndex: 0, basic:false, doMore:true })}
                >
                <Text style={{color:"#fff", textAlign:'center',fontWeight:'bold'}}>
                    거룩한독서 이어서 하기 
                </Text>
                </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
         )        
        :
        // 내용이 없는 경우
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
                    <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>오늘의 복음으로 간단한 말씀새기기와{"\n"} 거룩한독서를 할 수 있습니다.</Text> 
                  
                    <Text style={[styles.UpdateQuestionStyleClass, {marginTop:10}]}>말씀새기기</Text>
                    <View style={{ flex:1, justifyContent: 'center', alignItems: 'center', marginTop:10}}> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}> 
                    성령청원기도 
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} />  
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center',backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    독서 
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center',backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    간단한 묵상
                    </Text>
                    <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>· 오늘 하루동안 묵상하고 싶은 구절을 적어 봅시다.(묵상)</Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                    <Text style={[styles.textStyle, normalSize, {margin:5,width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    묵상후 기도
                    </Text>    

                    </View>   
                    <Text style={[styles.UpdateQuestionStyleClass, {marginTop:10}]}>거룩한독서</Text>
                 
                    <View style={{ flex:1, justifyContent: 'center', alignItems: 'center', marginTop:10, marginBottom:20}}> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    성령청원기도 
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} />  
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:120, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    세밀한 독서
                    </Text>
                    <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>
                    · 복음의 등장 인물은?
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
                    {"\n"}· 복음을 통하여 예수님께서 내게 해주시는 말씀은?
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
            <View style={this.state.selectShow ? {flex:1,position: 'absolute', right:'2%', top:'8%', width:'96%', height:500, backgroundColor:"#fff", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>              
                <ScrollView 
                style={{flex:1, marginLeft:5, marginRight:5, paddingBottom:200, marginBottom:20}}
                    {...this._panResponder.panHandlers}
                    onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })}>        
                     <Text style={[styles.TextStyle,{marginTop:3, padding:10, color:'#000', textAlign:'center', fontSize:14}]}>{this.state.Lectiodate}</Text>    
                     <Text style={[styles.TextStyle,{marginTop:5, padding:10, color:'#01579b', textAlign:'center'}, largeSize]}>{this.state.Sentence}</Text> 
                    <Text style={[styles.TextStyle,{marginTop:20, padding:5, color:'#000', textAlign:'left', lineHeight:22},  normalSize]}>{this.state.Contents}</Text>           
                    </ScrollView>
                    <TouchableOpacity 
                    activeOpacity = {0.9}
                    style={{position: 'absolute', right:5, top:5}}
                    onPress={() => this.setState({selectShow:false}) } 
                    >    
                    <Icon name={'close'} size={30} color={"#000"} />        
                </TouchableOpacity>           
            </View>                
            <ScrollView style={this.state.start == false ? {} : {display:'none'}}
            ref={(e) => { this.fScroll = e }}>   
               <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', backgroundColor:'#fff', borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
                <View style={{flexDirection: "column", flexWrap: 'wrap', width: '88%', height: 30, marginTop:10, paddingLeft:'1%'}}>
                    <Text style={[ styles.TextStyle, {fontSize:17, textAlign:'left', fontFamily:'NanumMyeongjoBold', color:"#000"}]}>거룩한독서</Text>
                </View>
                
                <View style={{flexDirection: "column", flexWrap: 'wrap', width: '8%', height: 30, marginLeft:'0%', float:'right'}}>
                    <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() => this.setState({selectQuestion:true, selectShow: false})} // insertComment
                    >      
                    <Icon5 name={'questioncircleo'} size={22} color={"#000"} style={{paddingTop:9}} />
                    </TouchableOpacity>
                </View>
                </View>                
                <Image source={require('../resources/lectio_img1.png')} style={{width: '100%', height: 150}} />              

                <View style={{flex:1, backgroundColor: "#fff", flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop:5, alignItems: 'center',  padding:10, paddingBottom:15, borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
                    <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5,flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center',   alignItems: 'center',  width: '48%', marginRight:'3%', height:40}}>
                    <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() => this.setState({selectShow: true})} 
                    >  
                    <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}> <Icon4 name={'book-open'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  오늘의복음 읽기</Text>   
                    </TouchableOpacity>
                    </View>   
                    <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '48%', height: 40}}>
                    <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() =>  this.setState({start: true})} 
                    > 
                    <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon4 name={'play-circle'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  거룩한독서 시작하기</Text>   
                    </TouchableOpacity>
                    </View>   
                </View>
                <Text style={[{color:'#000', margin:10, lineHeight: 25}, normalSize]}>거룩한 독서는 하느님 말씀을 들을 수 있도록 성령을 청하고, 세밀하고 반복적인 독서를 통해 말씀을 온전히 읽고, 말씀이 나에게 어떤 말을 건네고 있는지 묵상하며, 하느님께서 내게 주신 말씀을 되뇌며 기도를 하는 과정을 모두 포함합니다. 거룩한 독서를 통해 하느님께서 ‘지금, 나에게’ 하고 계시는 말씀을 들을 수 있습니다.</Text>
                <Image source={require('../resources/lectio_img2.png')}   resizeMode={'cover'} style={{ width: '100%', height: 80 }} />  
              
            </ScrollView>

            <View style={this.state.praying == true && !this.state.basic ? {backgroundColor:'#fff'} : {display:'none'}}>   
                                
                <View style = {styles.container}>
                <TouchableOpacity
                activeOpacity={0.7}
                style={{ paddingVertical: 8,
                    paddingHorizontal: 15}}
                onPress={() =>  this.setState({praying: false, start: false, Lectioupdate: true}) }
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
                            하루를 살아가도록 이끄소서. 아멘.{"\n"}
                            {"\n"}
                            (세번 반복한다){"\n"}
                        </Text>                                
                        </ScrollView>
                    
                    </ImageBackground>
                    
                </View>

            <View style={this.state.praying == true && this.state.basic ? {backgroundColor:'#fff'} : {display:'none'}}>                               
                <View style = {styles.container}>
                <TouchableOpacity
                activeOpacity={0.7}
                style={{ paddingVertical: 8,
                    paddingHorizontal: 15}}
                onPress={() =>  this.setState({praying: false, start: false, Lectioupdate: true}) }
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
                            "{this.state.comment}"
                            {"\n"}{"\n"}
                            주님 제가 이 말씀을 깊이 새기고{"\n"}
                            하루를 살아가도록 이끄소서. 아멘.{"\n"}
                            {"\n"}
                            (세번 반복한다){"\n"}
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
                        this.state.doMore ? this.setState({start: false, bg1: "", bg2: "", bg3: "", sum1: "", sum2: "", js1:"", js2:"", currentIndex: 0, basic:true, Lectioupdate: true}) : [this.setState({start: false, bg1: "", bg2: "", bg3: "", sum1: "", sum2: "", js1:"", js2:"", currentIndex: 0, basic:null}), this.getBasicInfo()]
                        :  Alert.alert(
                        '정말 끝내시겠습니까?',
                        '확인을 누르면 쓴 내용이 저장되지 않습니다.',
                        [                                 
                            {
                            text: '취소',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                            },
                            {text: '끝내기', onPress: () => 
                            [Keyboard.dismiss(), this.state.doMore ? this.setState({start: false, bg1: "", bg2: "", bg3: "", sum1: "", sum2: "", js1:"", js2:"", currentIndex: 0, basic:true, Lectioupdate: true}) : [this.setState({start: false,  comment:"", bg1: "", bg2: "", bg3: "", sum1: "", sum2: "", js1:"", js2:"", currentIndex: 0, basic:null}),this.getBasicInfo(), this.getData()]]},
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
                    totalItems={this.state.basic ? 3 : 9}
                    currentIndex={this.state.currentIndex}
                    movePrevious={this.movePrevious}
                    moveNext={this.moveNext}
                    moveFinal={this.moveFinal}
                />
                <View style={this.state.currentIndex == 0 ? {} : {display:'none'} }>
                    
                    <ImageBackground source={require('../resources/pray1_img.png')} style={{width: '100%', height: 600}}>
                        <ScrollView style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, marginBottom:130}}>                
                            <Text style={[{textAlign:'center', color:'#fff', paddingTop:'30%', lineHeight: 25}, normalSize]}>   빛이신 우리 아버지 하느님, {"\n"}
                                하느님께서는 세상에 아드님을 보내셨으니, {"\n"}
                                그분은 우리 사람들에게 보여주시기 위해 몸이 되신 {"\n"}
                                말씀이시옵니다.{"\n"}
                                이제 주님의 성령을 제 위에 보내시어{"\n"}
                                주님께로부터 오는 이 말씀 안에서 {"\n"}
                                예수 그리스도를 만나뵈옵게 하소서.{"\n"}
                                그리고 그분을 더 깊이 알게 해주시어, {"\n"}
                                그분을 더 깊이 사랑할 수 있게 해 주시고,{"\n"}
                                주님 나라의 참된 행복에 이르게 하소서.{"\n"}
                                아멘.{"\n"}
                            </Text>                                   
                        </ScrollView>
                    </ImageBackground>                               
                    </View>
                <KeyboardAvoidingView style={{height:130, width:'100%'}}>
                    
                    <View style={this.state.currentIndex == 1 ? {} : {display:'none'}}>
                        <Text style={[{textAlign:'center', paddingTop:40, color: "#01579b"}, largeSize]}>{this.state.Sentence}</Text>                                             
                    </View>

                    <View style={this.state.currentIndex == 2 && !this.state.basic ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>복음의 등장인물은?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="여기에 적어봅시다"
                        value={this.state.bg1}        
                        onChangeText={bg1 => this.setState({bg1})}        
                        // Making the Under line Transparent.
                        //underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                           
                    </View>

                    <View style={this.state.currentIndex == 2 && this.state.basic ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>오늘 하루동안 묵상하고 싶은 구절을 적어 봅시다.</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="여기에 적어봅시다"
                        value={this.state.comment}        
                        onChangeText={comment => this.setState({comment})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                           
                    </View>

                    <View style={this.state.currentIndex == 3 ? {} : {display:'none'}}>
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

                    <View style={this.state.currentIndex == 4 ? {} : {display:'none'}}>
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

                    <View style={this.state.currentIndex == 5 ? {} : {display:'none'}}>
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

                    <View style={this.state.currentIndex == 6 ? {} : {display:'none'}}>
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

                    <View style={this.state.currentIndex == 7 ? {} : {display:'none'}}>
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

                    <View style={this.state.currentIndex == 8 ? {} : {display:'none'}}>
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
                </KeyboardAvoidingView>   

                <KeyboardAwareScrollView style={this.state.currentIndex == 0 ? {display:'none'} : {marginBottom:160}}>                            
                    <TouchableHighlight
                    style={this.state.currentIndex == 1  ? {display:'none'} : { justifyContent: 'center', alignItems: 'center'}}
                    underlayColor = {"#fff"}
                    onPress={() => this.getPrevMoreGaspel()}>
                        <Icon name={"chevron-up"} size={40} color={"#A8A8A8"} /> 
                    </TouchableHighlight >     
                    <Text style= {[styles.DescriptionComponentStyle, normalSize]}>{this.state.Contents}</Text>        
                    <TouchableHighlight
                    style={this.state.currentIndex == 1  ? {display:'none'} : { justifyContent: 'center', alignItems: 'center'}}
                    underlayColor = {"#fff"}
                    onPress={() => this.getNextMoreGaspel()}>
                            <Icon name={"chevron-down"} size={40} color={"#A8A8A8"} /> 
                    </TouchableHighlight >
                    <View style={{height:60}} />  
                </KeyboardAwareScrollView>                     
            </View> 
        </View>   
        )       
  }
}
Main3.propTypes = {
    getGaspel: PropTypes.func,
    getThreeGaspel: PropTypes.func,
    insertLectio: PropTypes.func,   
    updateLectio: PropTypes.func, 
    lectios: PropTypes.object, // gaspelaction 결과값
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
        borderColor: '#01579b', // 이것때문에 .이 보이나 원인을 모르겠다
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
        borderBottomColor:"#d8d8d8", borderBottomWidth:0.5,
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
    MainContainer_weekend:{
        backgroundColor:"#F8F8F8",
        justifyContent: 'center',
        alignItems: 'center',
        flex:1,
        margin: 0,
        color:"#000"
    }, 
    TextComponentStyle: {
        fontSize: 16,
       color: "#000",
       textAlign: 'center',
       marginTop: 3, 
       marginBottom: 15
      },
    MainContainer :{     
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    margin: 0,
    color:"#fff"
    }
    });