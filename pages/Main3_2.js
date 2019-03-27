import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Image, Alert, ImageBackground, TouchableHighlight, AsyncStorage, ActivityIndicator, Keyboard } from 'react-native';
import {PropTypes} from 'prop-types';
import Icon from 'react-native-vector-icons/EvilIcons'
import { openDatabase } from 'react-native-sqlite-storage';
import {NavigationEvents} from 'react-navigation'

var db = openDatabase({ name: 'UserDatabase.db' });
import OnboardingButton from '../etc/OnboardingButton'

var normalSize;
var largeSize;

export default class Main3_2 extends Component { 

constructor(props) { 
    super(props)      
    this.state = {
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
        start: false,
        praying: false,
        Lectiodate:"",
        Lectioupdate: false,
        Lectioediting: false,
        currentIndex:0,
        initialLoading: true,
        basic: null,
        comment: null,
        doMore: false,
        selectedDate: ""
     }
     
     this.moveNext = this.moveNext.bind(this);
     this.moveFinal = this.moveFinal.bind(this);
     this.movePrevious = this.movePrevious.bind(this);
     this.transitionToNextPanel = this.transitionToNextPanel.bind(this);
  }


movePrevious(){
    this.transitionToNextPanel("prev", this.state.currentIndex -1);
}

moveNext(){
    this.transitionToNextPanel("next", this.state.currentIndex +1);
}

moveFinal(){
    console.log("Main3_2 - moveFinal")
    Keyboard.dismiss()
    
    // 데이터 수정 및 삽입
    if(this.state.Lectioupdate){   
        // 수정인 경우 - 후에 Lectioediting: false
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
            this.props.updateComment("update",this.props.status.loginId,this.state.Lectiodate,this.state.Sentence, this.state.comment)
             // comment DB를 업데이트한다.
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
            this.props.updateLectio("update",this.props.status.loginId, this.state.Lectiodate, this.state.Sentence, this.state.bg1, this.state.bg2, this.state.bg3, this.state.sum1, this.state.sum2, this.state.js1, this.state.js2)
              // lectio DB를 업데이트한다.
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
        // 데이터를 삽입하는 경우 - 후에 praying: true
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
            this.props.insertComment("insert", this.props.status.loginId,this.state.Lectiodate,this.state.Sentence, this.state.comment)
                // 값이 있는지 확인하고 없는 경우 lectio DB에 삽입한다 
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
             
            this.props.insertLectio("insert", this.props.status.loginId, this.state.Lectiodate, this.state.Sentence, this.state.bg1, this.state.bg2, this.state.bg3, this.state.sum1, this.state.sum2, this.state.js1, this.state.js2)
    
                // 값이 있는지 확인하고 없는 경우 lectio DB에 삽입한다 
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
    // 선택창 띄우기   
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
      })

    // navigation params로 날짜 가져와서 today, Lectiodate 설정
    const { params } = this.props.navigation.state;
    // console.log(params.otherParam)
 
     var year, month, day
 
     if(params != null){
        console.log("Main3_2 - params : ", params+"existed" )
         date = params.otherParam
         year = params.otherParam.substring(0, 4);
         month = params.otherParam.substring(5, 7);
         day = params.otherParam.substring(8, 10);
     }
     
    var today = year+"-"+month+"-"+day;
    var today_comment_date = year+"년 "+month+"월 "+day+"일 "+this.getTodayLabel(new Date(today))
    console.log('Main3_2 - today date : ', today+"/"+today_comment_date)
    this.setState({
        Date: today,
        selectedDate: year+"-"+month,
        Lectiodate: today_comment_date
    })

    // gaspel 데이터 가져오기
    this.props.getGaspel(today) 

    const loginId = this.props.status.loginId;
    // comment, lectio DB있는지 확인    
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
                    if(this.state.comment == null){
                        AsyncStorage.getItem('course', (err, result) => {
                            if(result == "basic"){
                                this.setState({basic:true, initialLoading: false})
                            }else if(result == "advanced"){          
                                this.setState({basic:false, initialLoading: false})
                            }else{          
                                this.setState({basic:null, initialLoading: false})
                            }
                          })
                    }else{
                        this.setState({          
                            initialLoading: false
                        })   
                    }
                                        
                }
              }
            )
        });       
  }

  getBasicInfo(){
    AsyncStorage.getItem('course', (err, result) => {
        if(result == "basic"){
            this.setState({basic:true})
        }else if(result == "advanced"){          
            this.setState({basic:false})
        }
      })
  }

  refreshContents(){
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
      })

     // 모두 비우고, 처음부터 다시 가져옴. getGaspel, DB
      this.setState({
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
            start: false,
            praying: false,
            Lectiodate:"",
            Lectioupdate: false,
            Lectioediting: false,
            currentIndex:0,
            comment: "",
            initialLoading: true,
            basic: null})
  
       
    const { params } = this.props.navigation.state;
    // console.log(params.otherParam)
 
     var year, month, day
 
     if(params != null){
        console.log("Main3_2 - params : ", params+"existed" )
         date = params.otherParam
         year = params.otherParam.substring(0, 4);
         month = params.otherParam.substring(5, 7);
         day = params.otherParam.substring(8, 10);
     }
     
    var today = year+"-"+month+"-"+day;
    var today_comment_date = year+"년 "+month+"월 "+day+"일 "+this.getTodayLabel(new Date(today))
    console.log('Main3_2 - today date : ', today+"/"+today_comment_date)
    this.setState({
        Date: today,
        Lectiodate: today_comment_date,
        selectedDate: year+"-"+month
    })

    this.props.getGaspel(today) // 데이터 가져오기

    const loginId = this.props.status.loginId;
    // comment, lectio DB 있는지 확인    
    db.transaction(tx => {
        tx.executeSql(
            'SELECT * FROM comment where date = ? and uid = ?',
            [today_comment_date, loginId],
            (tx, results) => {
              var len = results.rows.length;
            //  값이 있는 경우에 
              if (len > 0) {                  
                  console.log('Main3_2 - check Comment data : ', results.rows.item(0).comment)   
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
                    console.log('Main3_2 - check Lectio data : ', results.rows.item(0).bg1) 
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
                    if(!this.state.Lectioupdate){
                        AsyncStorage.getItem('course', (err, result) => {
                            if(result == "basic"){
                                this.setState({basic:true})
                            }else if(result == "advanced"){          
                                this.setState({basic:false})
                            }
                        })
                    }                    
                    this.setState({          
                        initialLoading: false
                    })                        
                }
              }
            )
      });    
  }
  getTodayLabel(date) {        
    var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');        
    var todayLabel = week[date.getDay()];        
    return todayLabel;
}


componentWillReceiveProps(nextProps){   
    // 이는 getGaspel에서 받아오는 경우
    if(nextProps.lectios.sentence != null){
        console.log('Main3_2 - get Gaspel Data')  
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

        console.log("Main3_2 - first verse, last verse get : ", first_verse+"/"+last_verse)

         // 복음사가 가져옴
        var idx_today = contents.indexOf("전한 거룩한 복음입니다.");
        var today_person;
        if(idx_today == -1){
            idx_today = contents.indexOf("전한 거룩한 복음의 시작입니다.");
            today_person = contents.substring(2,idx_today-2); // 복음사 사람 이름
        }else{
            today_person = contents.substring(2,idx_today-2);
        }
 
       console.log("Main3_2 - person & chapter get : ",today_person+"/"+chapter);
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
     if(nextProps.lectios.threegaspels != null){   
         console.log("Main3_2 - Three gaspel get")             
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
    console.log("Main3_2 - gaspels in render");
    return   (this.state.initialLoading)
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
    (this.state.Lectioupdate == true) ?
        (this.state.Lectioediting == true) ?
        // 수정시
            (
            <View style={{backgroundColor:"#fff"}}>
                <NavigationEvents
                onWillFocus={payload => {
                this.refreshContents()
                }}
                />
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
                            {text: '끝내기', onPress: () =>  this.props.navigation.navigate('Main5', {otherParam: this.state.selectedDate})},
                        ],
                        {cancelable: true},
                        )}
                    >
                    <Text style={{color:"#FFF", textAlign:'left'}}>
                        {"<"} 뒤로
                    </Text>
                </TouchableOpacity>   
                
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
                    style={[styles.TextInputStyleClass, normalSize]}  />                           
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
                    style={[styles.TextInputStyleClass, normalSize]}  />                           
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
                        style={[styles.TextInputStyleClass, normalSize]}  />                       
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
                        style={[styles.TextInputStyleClass, normalSize]}  />                         
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
                        style={[styles.TextInputStyleClass, normalSize]}  />                        
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
                        style={[styles.TextInputStyleClass, normalSize]}  />                          
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
                        style={[styles.TextInputStyleClass, normalSize]}  />                            
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
                        style={[styles.TextInputStyleClass, normalSize]}  />                          
                    </View>                    
                </KeyboardAvoidingView>                    
                <ScrollView style={{marginBottom:210}}>              
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
                                                
                </ScrollView>  
            </View>
            )
            :
            // 내용이 있는 경우
            (
            <View style={{flex:1, backgroundColor:"#fff"}}>
                <NavigationEvents
                onWillFocus={payload => {
                this.refreshContents()
                }}
                />
                <TouchableOpacity
                activeOpacity = {0.9}
                style={{backgroundColor: '#01579b', padding: 10}}
                onPress={() =>  (!this.state.Lectioediting&&this.state.Lectioupdate)  ? 
                    this.props.navigation.navigate('Main5', {otherParam: this.state.selectedDate})
                    : Alert.alert(
                        '정말 끝내시겠습니까?',
                        '확인을 누르면 쓴 내용이 저장되지 않습니다.',
                        [                                 
                        {
                            text: '취소',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {text: '끝내기', onPress: () =>  this.props.navigation.navigate('Main5', {otherParam: this.state.selectedDate})},
                        ],
                        {cancelable: true},
                    )}
                >
                    <Text style={{color:"#FFF", textAlign:'left'}}>
                        {"<"} 뒤로
                    </Text>
                </TouchableOpacity>
                <ScrollView style={!this.state.basic ? {backgroundColor:"#fff"} : {display:'none'}}>                        
                    <Text style={[{color:'#01579b', textAlign: 'center',  marginTop: 30, marginBottom: 20, padding:5}, largeSize]}>{this.state.Sentence}</Text> 
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
                    <TouchableOpacity
                        activeOpacity = {0.9}
                        style={styles.Button}
                        onPress={() => this.setState({ Lectioediting: true, currentIndex: 0 })}
                        >
                        <Text style={{color:"#FFF", textAlign:'center', fontWeight:'bold'}}>
                            수정
                        </Text>
                    </TouchableOpacity>
                    </View>
                </ScrollView>
    
                <ScrollView style={this.state.basic ? {backgroundColor:"#fff"} : {display:'none'}}>                   
                <Text style={[{color:'#01579b', textAlign: 'center',  marginTop: 30, marginBottom: 20}, largeSize]}>{this.state.Sentence}</Text> 
                <Text style={styles.UpdateQuestionStyleClass}>오늘 하루동안 묵상하고 싶은 구절</Text>
                <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.comment}</Text>   
                <View style={{width:'100%',  justifyContent: 'center',  alignItems: 'center', marginTop:0}}>
                <TouchableOpacity
                activeOpacity = {0.9}
                style={[styles.Button, {backgroundColor:"#87CEEB"}]}
                onPress={() => this.setState({ Lectioediting: true, currentIndex: 0 })}
                >
                <Text style={{color:"#FFF", textAlign:'center',fontWeight:'bold'}}>
                    수정
                </Text>
                </TouchableOpacity>
                </View>
                <View style={{width:'100%',  justifyContent: 'center',  alignItems: 'center', marginTop:10}}>
                <TouchableOpacity
                activeOpacity = {0.9}
                style={[styles.Button, {width:200}]}
                onPress={() => this.setState({ Lectioupdate: false, start:true, currentIndex: 0, basic:false, doMore:true })}
                >
                <Text style={{color:"#fff", textAlign:'center',fontWeight:'bold'}}>
                    심화과정 이어서 하기 
                </Text>
                </TouchableOpacity>
                </View>
                </ScrollView>
                </View>
                
            )        
        :
        // 내용이 없는 경우
            (  
            <View style={{backgroundColor:"#fff", flex:1}}>   
                <NavigationEvents
                onWillFocus={payload => {
                this.refreshContents()
                }}
                />
                <TouchableOpacity
                activeOpacity = {0.9}
                style={{backgroundColor: '#01579b', padding: 10}}
                onPress={() => this.state.currentIndex == 0 || this.state.currentIndex == 1 || !this.state.start  ? 
                    this.props.navigation.navigate('Main5', {otherParam: this.state.selectedDate})
                    : Alert.alert(
                        '정말 끝내시겠습니까?',
                        '확인을 누르면 쓴 내용이 저장되지 않습니다.',
                        [                                 
                        {
                            text: '취소',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                        },
                        {text: '끝내기', onPress: () =>  this.props.navigation.navigate('Main5', {otherParam: this.state.selectedDate})},
                        ],
                        {cancelable:true},
                    )}
                >
                    <Text style={{color:"#FFF", textAlign:'left'}}>
                        {"<"} 뒤로
                    </Text>
                </TouchableOpacity>             
                <ScrollView style={this.state.start == false ? {marginBottom:40, backgroundColor:"#fff"} : {display:'none'}}>       
                    <Image source={require('../resources/lectio_img1.png')} style={{width: '100%', height: 150}} />       
                        <Text style={[{color:'#01579b', textAlign: 'right', marginRight:10, marginTop:20}, largeSize]}>거룩한 독서</Text>
                        <Text style={{color:'#01579b', textAlign: 'right', marginRight:10, fontSize:14}}>Lectio Divina</Text>

                        <Text style={[{color:'#000', margin:10, lineHeight: 25}, normalSize]}>거룩한 독서는 하느님 말씀을 들을 수 있도록 성령을 청하고, 세밀하고 반복적인 독서를 통해 말씀을 온전히 읽고, 말씀이 나에게 어떤 말을 건네고 있는지 묵상하며, 하느님께서 내게 주신 말씀을 되뇌며 기도를 하는 과정을 모두 포함합니다. 거룩한 독서를 통해 하느님께서 ‘지금, 나에게’ 하고 계시는 말씀을 들을 수 있습니다.</Text>
                        <Image source={require('../resources/lectio_img2.png')}   resizeMode={'cover'} style={{ width: '100%', height: 80 }} />  
                        <View style={{width:'100%',  justifyContent: 'center',  alignItems: 'center', marginBottom:10}}>
                        <TouchableOpacity
                        activeOpacity = {0.9}
                        style={styles.Button}
                        onPress={() =>  this.setState({start: true})} 
                        >
                        <Text style={{color:"#FFF", textAlign:'center', fontWeight:'bold'}}>
                            거룩한 독서 시작하기
                        </Text>
                    </TouchableOpacity>
                    </View>
                </ScrollView>
               <View style={this.state.praying == true && !this.state.basic ? {backgroundColor:"#fff"} : {display:'none'}}>                       
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

                <View style={this.state.praying == true && this.state.basic ? {} : {display:'none'}}>                                   
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

                <View style={this.state.start == true && this.state.praying ==false ? {backgroundColor:"#fff"} : {display:'none'}}>                      
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
                    <KeyboardAvoidingView style={{height:130}}>
                    
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
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, normalSize]}  />                           
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
                        style={[styles.TextInputStyleClass, normalSize]}  />                           
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
                        style={[styles.TextInputStyleClass, normalSize]}  />             
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
                        style={[styles.TextInputStyleClass, normalSize]}  />                             
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
                        style={[styles.TextInputStyleClass, normalSize]}  />                           
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
                        style={[styles.TextInputStyleClass, normalSize]}  />                          
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
                        style={[styles.TextInputStyleClass, normalSize]}  />                         
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
                        style={[styles.TextInputStyleClass, normalSize]}  />                             
                    </View>                        
                </KeyboardAvoidingView>   

                <ScrollView style={this.state.currentIndex == 0 ? {display:'none'} : {marginBottom:160}}>                            
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
                </ScrollView>                     
            </View> 
        </View>   
        )       
    }
}
Main3_2.propTypes = {
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
          
    DescriptionComponentStyle: {
        lineHeight:25,
        padding:1,
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
        borderWidth: 1,
        borderColor: '#01579b',
        borderRadius: 5,
        fontSize:14 
    },
    UpdateQuestionStyleClass: {
        textAlign: 'center',
        color: '#000',
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
    }
});