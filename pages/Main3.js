import React, { Component } from 'react';
import { Dimensions, PanResponder, PixelRatio, StyleSheet, TextInput, View, Text, TouchableOpacity, ScrollView, Keyboard, KeyboardAvoidingView, Alert, NetInfo, Image, ImageBackground, TouchableHighlight, AsyncStorage, ActivityIndicator } from 'react-native';
import {PropTypes} from 'prop-types';
import Icon from 'react-native-vector-icons/EvilIcons'
import { openDatabase } from 'react-native-sqlite-storage';
import {NavigationEvents} from 'react-navigation'
import Icon3 from 'react-native-vector-icons/FontAwesome'
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon5 from 'react-native-vector-icons/AntDesign'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
var db = openDatabase({ name: 'UserDatabase.db' });
import OnboardingButton from '../etc/OnboardingButton'
import {toShortFormat, dateFormat1} from '../etc/dateFormat';

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
            { key: 'first', title: 'Reading Procedure', out: true },
            { key: 'second', title: 'Lectio Divina' },
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
        const date = this.state.Date;
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
             // comment DB를 업데이트
            db.transaction(function(tx) {
                tx.executeSql(
                    'UPDATE comment set comment=? where date=?',
                    [comment, date],
                    (tx, results) => {
                //  console.log('Results', 'done');
                    if (results.rowsAffected > 0) {
                        console.log('Main3 - comment data updated : ', "update success")        
                        //Alert.alert("Edition succeeded.")           
                    } else {
                        console.log('Main3 - comment data updated : ', "update fail")  
                    }
                    }
                );
                }); 
        }else{
                // lectio DB를 업데이트
            db.transaction(function(tx) {
                tx.executeSql(
                    'UPDATE lectio set bg1=?, bg2=?, bg3=?, sum1=?, sum2=?, js1=?, js2=? where date=?',
                    [bg1, bg2, bg3, sum1, sum2, js1, js2, date],
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
        const sentence = this.state.Sentence;
        const date = this.state.Date;
        const bg1 = this.state.bg1
        const bg2 = this.state.bg2
        const bg3 = this.state.bg3
        const sum1 = this.state.sum1
        const sum2 = this.state.sum2
        const js1 = this.state.js1
        const js2 = this.state.js2
        const comment = this.state.comment
        const place = this.state.place
        if(this.state.basic){
                // comment DB에 삽입
            db.transaction(tx => {
                db.transaction(function(tx) {
                    tx.executeSql(
                    'INSERT INTO comment (date, onesentence, comment, place) VALUES (?,?,?,?)',
                    [date,sentence, comment, place],
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
                // lectio DB에 삽입
            db.transaction(tx => {
                tx.executeSql(
                'SELECT * FROM lectio where date = ?',
                [date],
                (tx, results) => {
                    var len = results.rows.length;
                //  값이 있는 경우에 
                    if (len > 0) {                  
                        console.log('Main3 - lectio data', "existed")        
                    } else {
                    db.transaction(function(tx) {
                        tx.executeSql(
                        'INSERT INTO lectio (date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2, place) VALUES (?,?,?,?,?,?,?,?,?,?)',
                        [date,sentence, bg1, bg2, bg3, sum1, sum2, js1, js2, place],
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
            'Select Simple Meditation / Lectio Divina',
            'When you select one, selection window does not open.',
            [
              {text: 'Simple Meditation', onPress: () => this.setState({
                basic:true, currentIndex: nextIndex})
               },
              {text: 'Lectio Divina', onPress: () => this.setState({
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
    if(date.getDay() == 0){
        this.setState({weekend:true})
    }
    var today = dateFormat1("today")
       // 오늘날짜를 설정 
       try {
        AsyncStorage.setItem('today3', today);
      } catch (error) {
        console.error('AsyncStorage error: ' + error.message);
      }
    var today_comment_date = toShortFormat(date)
   // alert(today_comment_date)
    console.log('Main3 - today date : ', today+"/"+today_comment_date)
      
    this.setState({
        Date: today,
        Lectiodate: today_comment_date
    })

    // gaspel 데이터 가져오기
    this.props.getGaspel(today) 
    this.getData(today)
     
  }

  getData(today){
    //  alert("awdad")
       // comment나 lectio DB가 있는지 확인
      
    db.transaction(tx => {       
        //comment있는지 확인  
        tx.executeSql(
          'SELECT * FROM comment where date = ?',
          [today],
          (tx, results) => {
            var len = results.rows.length;
          //  comment 값이 있는 경우에 가져오기 
            if (len > 0) {                  
                console.log('Main3 - check Comment data : ', results.rows.item(0).comment)   
                this.setState({
                    comment: results.rows.item(0).comment,
                    Sentence:  results.rows.item(0).onesentence,
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
            'SELECT * FROM lectio where date = ?',
            [today],
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
                      Sentence:  results.rows.item(0).onesentence,
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


componentWillReceiveProps(nextProps){    
  
    if(nextProps.gaspels.contents != null){
        console.log(nextProps.gaspels.contents) 
        console.log(nextProps.gaspels.person) 
      //  alert(nextProps.gaspels.created_at)
  
          var contents = nextProps.gaspels.contents
          var firstdot = contents.indexOf(".");
        //  var firstsentence = contents.substring(0, firstdot)+"...";
          var firstsentence = contents.split(" ").splice(0,18).join(" ")+"...";
          var sentence_from = "Holy Gospel of Jesus Christ \naccording to Saint "+nextProps.gaspels.person;
          var chapter = nextProps.gaspels.cv.substring(0,nextProps.gaspels.cv.indexOf(":"))
          var first = nextProps.gaspels.cv.substring(nextProps.gaspels.cv.indexOf(":")+1,nextProps.gaspels.cv.indexOf("-"))
          var last =  nextProps.gaspels.cv.substring(nextProps.gaspels.cv.indexOf("-")+1)
          this.setState({
          Contents : contents+"\n",
          Sentence : sentence_from,
          place: nextProps.gaspels.person+" "+nextProps.gaspels.cv,
          Firstverse:  Number(first.replace(/[^0-9]/g, ''))-3,
          Lastverse: Number(last.replace(/[^0-9]/g, ''))+3,
          Person: nextProps.gaspels.person,
          Chapter: chapter,
          cv: nextProps.gaspels.cv
        })
       // alert(last);
       // alert(chapter+first+last)
    }

    // threegaspel 가져올때 
    if(nextProps.gaspels.threegaspels != null){   
        console.log("Main3 - Three gaspel get")             
        if(this.state.Move == "prev"){
            this.setState({
                Contents : nextProps.gaspels.threegaspels+"\n"+this.state.Contents
            })    
        }else{
            this.setState({
                Contents : this.state.Contents+"\n"+nextProps.gaspels.threegaspels
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
   var todaydate = dateFormat1("today")
   var today_comment_date = toShortFormat(date)
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
       this.getData(todaydate)
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
    //  alert(this.state.Lastverse)
     this.props.getThreeGaspel("next", this.state.Person, this.state.Chapter, this.state.Lastverse)
     this.setState({
        Lastverse: this.state.Lastverse+3,
        Move: "next"
    });
   }   


  render() {   
    console.log("Main3 - in render");
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
                            'Do you really want to close it?',
                            'If you click OK, your entries are not saved.',
                            [                                 
                                {
                                text: 'cancel',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel',
                                },
                                {text: 'OK', onPress: () =>  [Keyboard.dismiss(),this.setState({Lectioediting: false}), this.getData(this.state.Date)]},
                            ],
                            {cancelable: true},
                            )} 
                        >
                        <Text style={{color:"#FFF", textAlign:'left'}}>
                            {"<"} back
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
                        <Text style={styles.TextQuestionStyleClass}>Who are the characters of the gospel?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.bg1}        
                        onChangeText={bg1 => this.setState({bg1})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                           
                    </View>
                    <View style={this.state.currentIndex == 0 && this.state.basic ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>Let's write a verse to meditate on today down.</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.comment}        
                        onChangeText={comment => this.setState({comment})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}] }  />                           
                    </View>
                    <View style={this.state.currentIndex == 1 ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>Where is the background location of the gospel?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.bg2}        
                        onChangeText={bg2 => this.setState({bg2})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                       
                    </View>
                    <View style={this.state.currentIndex == 2 ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>The time or situation of the gospel?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.bg3}        
                        onChangeText={bg3 => this.setState({bg3})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                         
                    </View>
                    <View style={this.state.currentIndex == 3 ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>Let's summarize the contents centered on events.</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.sum1}        
                        onChangeText={sum1 => this.setState({sum1})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                        
                    </View>
                    <View style={this.state.currentIndex == 4 ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>What verses are touching particularly?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.sum2}        
                        onChangeText={sum2 => this.setState({sum2})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                          
                    </View>
                    <View style={this.state.currentIndex == 5 ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>Let's look for characteristics of jesus in the gospel.</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.js1}        
                        onChangeText={js1 => this.setState({js1})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                            
                    </View>
                    <View style={this.state.currentIndex == 6 ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>What does jesus say to me through the gospel?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
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
                        <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>You can do Simple Meditation or {"\n"} Lectio Divina on today's Gospel.</Text> 
                      
                        <Text style={[styles.UpdateQuestionStyleClass, {marginTop:10}]}>Simple Meditation</Text>
                        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center', marginTop:10}}> 
                        <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}> 
                        The Prayer Come Holy Spirit 
                        </Text>
                        <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} />  
                        <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center',backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                        Reading
                        </Text>
                        <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                        <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center',backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                        Simple Meditation
                        </Text>
                        <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>· Let's write a verse to meditate on today down.(Meditation)</Text>
                        <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                        <Text style={[styles.textStyle, normalSize, {margin:5,width:220, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                        Prayer after Meditation
                        </Text>    
    
                        </View>   
                        <Text style={[styles.UpdateQuestionStyleClass, {marginTop:10}]}>Lectio Divina</Text>
                     
                        <View style={{ flex:1, justifyContent: 'center', alignItems: 'center', marginTop:10, marginBottom:20}}> 
                        <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                        The Prayer Come Holy Spirit 
                        </Text>
                        <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} />  
                        <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                        Careful Reading
                        </Text>
                        <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>
                        · Who are the characters of the gospel?
                        {"\n"}· Where is the background location of the gospel?
                        {"\n"}· The time or situation of the gospel?
                        {"\n"}· Let's summarize the contents centered on events.
                        </Text>
                        <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                        <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                        Meditation
                        </Text>
                        <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>
                        · What verses are touching particularly?
                        {"\n"}· Let's look for characteristics of jesus in the gospel.
                        {"\n"}· What does jesus say to me through the gospel?
                        </Text>
                        <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                        <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                        Prayer after Meditation
                        </Text>    
    
                        </View> 
                    
                        </ScrollView>
                    ),
                    second: () => (
                        <ScrollView style={[styles.scene, { backgroundColor: '#fff', paddingTop:10 }]}>
                         <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>
                         Lectio Divina (Latin for "Divine Reading") is a traditional monastic practice of scriptural reading, meditation and prayer intended to promote communion with God. 
                        </Text>
                        <Text style={[styles.UpdateQuestionStyleClass, { marginTop:10}]}>Silence</Text> 
                        <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                        In an effort to match the frequency of our hearts to God, you put yourself down in a calm mind.{"\n"}
                        </Text>
                        <Text style={[styles.UpdateQuestionStyleClass]}>The Prayer Come Holy Spirit</Text>
                        <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                        The Word of God must be helped of the Holy Spirit because it can be understood correctly when it is led by God.{"\n"}
                        </Text>
                        <Text style={[styles.UpdateQuestionStyleClass]}>Reading</Text>
                        <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                        Since Reading is to listen to Word of God, you should read carefully and repeatedly.{"\n"}
                        </Text>
                        <Text style={[styles.UpdateQuestionStyleClass]}>Meditation</Text>
                        <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                        You are trying to think about what Gospel want to say to you right now.{"\n"}
                        </Text>
                        <Text style={[styles.UpdateQuestionStyleClass]}>Prayer</Text>
                        <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                        You naturally respond to God in the trust in Him repeating the Words God has given you.{"\n"}
                        </Text>
                        <Text style={[styles.UpdateQuestionStyleClass]}>contemplation</Text>
                        <Text style={[styles.textStyle, normalSize]}>
                        Through holy reading, you remember God's Word and realize that everything is God's grace. {"\n"}
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
                    onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })}>        
                     <Text style={[styles.TextStyle,{marginTop:3, padding:10, color:'#000', textAlign:'center', fontSize:14}]}>{this.state.Lectiodate}</Text>    
                     <Text style={[styles.TextStyle,{marginTop:15, color:'#01579b', textAlign:'center'}, largeSize]}>{this.state.Sentence}</Text> 
                     <Text style={[styles.TextStyle,{marginTop:3, paddingBottom:0, color:'#01579b', textAlign:'center', fontSize:14}]}>{this.state.place}</Text>
                    <Text style={[styles.TextStyle,{marginTop:10, padding:5, color:'#000', textAlign:'left', lineHeight:22},  normalSize]}>{this.state.Contents}</Text>     
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
                    <Text style={[ styles.TextStyle, {fontSize:17, textAlign:'left', fontFamily:'NanumMyeongjoBold', color:"#000"}]}>Lectio Divina</Text>
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
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon4 name={'book-open-page-variant'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Read Gospel</Text>   
                  </TouchableOpacity>
                  </View>   
                  <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '32%', marginRight:'1.5%', height: 40}}>
                  <TouchableOpacity 
                  activeOpacity = {0.9}
                  onPress={() => this.setState({ Lectioediting: true, currentIndex: 0 })}
                  > 
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon4 name={'circle-edit-outline'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Edit</Text>   
                  </TouchableOpacity>
                  </View>   
                  <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '32%', height: 40}}>
                  <TouchableOpacity 
                  activeOpacity = {0.9}
                  onPress={() => this.props.navigation.navigate('SendImage', {otherParam: "Main3", otherParam2: this.state.Date})}
                  > 
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon3 name={'send-o'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Share</Text>   
                  </TouchableOpacity>
                  </View>   
                </View>       
                <Text style={[{color:'#01579b', textAlign: 'center',  marginTop: 10, marginBottom: 10, padding:5}, largeSize]}>{this.state.Sentence}</Text>           
                <Text style={styles.UpdateQuestionStyleClass}>Who are the characters of the gospel?</Text>
                <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.bg1}</Text>   
                <Text style={styles.UpdateQuestionStyleClass}>Where is the background location of the gospel?</Text>
                <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.bg2}</Text>   
                <Text style={styles.UpdateQuestionStyleClass}>The time or situation of the gospel?</Text>
                <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.bg3}</Text>
                <Text style={styles.UpdateQuestionStyleClass}>Let's summarize the contents centered on events.</Text>   
                <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.sum1}</Text>  
                <Text style={styles.UpdateQuestionStyleClass}>What verses are touching particularly?</Text> 
                <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.sum2}</Text>   
                <Text style={styles.UpdateQuestionStyleClass}>Let's look for characteristics of jesus in the gospel.</Text>
                <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.js1}</Text>   
                <Text style={styles.UpdateQuestionStyleClass}>What does jesus say to me through the gospel?</Text>
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
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon4 name={'book-open-page-variant'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Read Gospel</Text>   
                  </TouchableOpacity>
                  </View>   
                  <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '32%', marginRight:'1.5%', height: 40}}>
                  <TouchableOpacity 
                  activeOpacity = {0.9}
                  onPress={() => this.setState({ Lectioediting: true, currentIndex: 0 })}
                  > 
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon4 name={'circle-edit-outline'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Edit</Text>   
                  </TouchableOpacity>
                  </View>   
                  <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '32%', height: 40}}>
                  <TouchableOpacity 
                  activeOpacity = {0.9}
                  onPress={() => this.props.navigation.navigate('SendImage', {otherParam: "Main3", otherParam2: this.state.Date})}
                  > 
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon3 name={'send-o'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Share</Text>   
                  </TouchableOpacity>
                  </View>   
                </View>      

                <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() => this.setState({selectShow:true}) } 
                    >    
                <Text style={[{color:'#01579b', textAlign: 'center',  marginTop: 10, marginBottom: 10, padding:5}, largeSize]}>{this.state.Sentence}</Text>
                </TouchableOpacity> 
                <Text style={styles.UpdateQuestionStyleClass}>A verse to meditate today</Text>
                <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.comment}</Text>   
               
                <View style={{width:'100%',  justifyContent: 'center',  alignItems: 'center', marginTop:10}}>
                <TouchableOpacity
                activeOpacity = {0.9}
                style={[styles.Button, {width:200}]}
                onPress={() => this.setState({ Lectioupdate: false, start:true, currentIndex: 0, basic:false, doMore:true })}
                >
                <Text style={{color:"#fff", textAlign:'center',fontWeight:'bold'}}>
                    Continue to Lectio Divina 
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
                    <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>You can do Simple Meditation or {"\n"} Lectio Divina on today's Gospel.</Text> 
                  
                    <Text style={[styles.UpdateQuestionStyleClass, {marginTop:10}]}>Simple Meditation</Text>
                    <View style={{ flex:1, justifyContent: 'center', alignItems: 'center', marginTop:10}}> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}> 
                    The Prayer Come Holy Spirit 
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} />  
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center',backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    Reading
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center',backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    Simple Meditation
                    </Text>
                    <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>· Let's write a verse to meditate on today down.(Meditation)</Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                    <Text style={[styles.textStyle, normalSize, {margin:5,width:220, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    Prayer after Meditation
                    </Text>    

                    </View>   
                    <Text style={[styles.UpdateQuestionStyleClass, {marginTop:10}]}>Lectio Divina</Text>
                 
                    <View style={{ flex:1, justifyContent: 'center', alignItems: 'center', marginTop:10, marginBottom:20}}> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    The Prayer Come Holy Spirit 
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} />  
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    Careful Reading
                    </Text>
                    <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>
                    · Who are the characters of the gospel?
                    {"\n"}· Where is the background location of the gospel?
                    {"\n"}· The time or situation of the gospel?
                    {"\n"}· Let's summarize the contents centered on events.
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    Meditation
                    </Text>
                    <Text style={[styles.textStyle, {fontSize:13, margin:0}]}>
                    · What verses are touching particularly?
                    {"\n"}· Let's look for characteristics of jesus in the gospel.
                    {"\n"}· What does jesus say to me through the gospel?
                    </Text>
                    <Icon3 name={'chevron-down'} size={15} color={"#e6e8ef"} /> 
                    <Text style={[styles.textStyle, normalSize, {margin:5, width:220, textAlign:'center', backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, padding:5}]}>
                    Prayer after Meditation
                    </Text>    

                    </View> 
                
                    </ScrollView>
                ),
                second: () => (
                    <ScrollView style={[styles.scene, { backgroundColor: '#fff', paddingTop:10 }]}>
                     <Text style={[{color:'#01579b', textAlign:'center', marginTop:10}, largeSize]}>
                     Lectio Divina (Latin for "Divine Reading") is a traditional monastic practice of scriptural reading, meditation and prayer intended to promote communion with God. 
                    </Text>
                    <Text style={[styles.UpdateQuestionStyleClass, { marginTop:10}]}>Silence</Text> 
                    <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                    In an effort to match the frequency of our hearts to God, you put yourself down in a calm mind.{"\n"}
                    </Text>
                    <Text style={[styles.UpdateQuestionStyleClass]}>The Prayer Come Holy Spirit</Text>
                    <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                    The Word of God must be helped of the Holy Spirit because it can be understood correctly when it is led by God.{"\n"}
                    </Text>
                    <Text style={[styles.UpdateQuestionStyleClass]}>Reading</Text>
                    <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                    Since Reading is to listen to Word of God, you should read carefully and repeatedly.{"\n"}
                    </Text>
                    <Text style={[styles.UpdateQuestionStyleClass]}>Meditation</Text>
                    <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                    You are trying to think about what Gospel want to say to you right now.{"\n"}
                    </Text>
                    <Text style={[styles.UpdateQuestionStyleClass]}>Prayer</Text>
                    <Text style={[styles.textStyle, normalSize,{marginBottom:0}]}>
                    You naturally respond to God in the trust in Him repeating the Words God has given you.{"\n"}
                    </Text>
                    <Text style={[styles.UpdateQuestionStyleClass]}>contemplation</Text>
                    <Text style={[styles.textStyle, normalSize]}>
                    Through holy reading, you remember God's Word and realize that everything is God's grace. {"\n"}
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
                    onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })}>        
                     <Text style={[styles.TextStyle,{marginTop:3, padding:10, color:'#000', textAlign:'center', fontSize:14}]}>{this.state.Lectiodate}</Text>    
                     <Text style={[styles.TextStyle,{marginTop:15, color:'#01579b', textAlign:'center'}, largeSize]}>{this.state.Sentence}</Text> 
                     <Text style={[styles.TextStyle,{marginTop:3, paddingBottom:0, color:'#01579b', textAlign:'center', fontSize:14}]}>{this.state.Person} {this.state.cv}</Text>
                    <Text style={[styles.TextStyle,{marginTop:10, padding:5, color:'#000', textAlign:'left', lineHeight:22},  normalSize]}>{this.state.Contents}</Text>           
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
                    <Text style={[ styles.TextStyle, {fontSize:17, textAlign:'left', fontFamily:'NanumMyeongjoBold', color:"#000"}]}>Lectio Divina</Text>
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
                    <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}> <Icon4 name={'book-open-page-variant'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Read Today's Gospel</Text>   
                    </TouchableOpacity>
                    </View>   
                    <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '48%', height: 40}}>
                    <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() =>  this.setState({start: true})} 
                    > 
                    <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon4 name={'play-circle-outline'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Start Lectio Divina</Text>   
                    </TouchableOpacity>
                    </View>   
                </View>
                <Text style={[{color:'#000', margin:10, lineHeight: 25}, normalSize]}>Lectio Divina is the process including praying to the Holy Spirit, reading the Gospel thoroughly and repetitively and meditating on what the God is saying to you. Through holy reading, you can listen to what God is saying "now, to you".</Text>
                <Image source={require('../resources/lectio_img2_en.png')}   resizeMode={'cover'} style={{ width: '100%', height: 80 }} />  
              
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
                        complete
                    </Text>
                </TouchableOpacity>             
                </View>  
                <ImageBackground source={require('../resources/pray2_img.png')} style={{width: '100%', height: 600}}>
                        <ScrollView style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, marginBottom:130}}>
            
                        <Text style={[{textAlign:'center', color:'#fff', paddingTop:270, lineHeight: 22}, normalSize]}> 
                        God told me that{"\n"}
                            "{this.state.js2}"
                            {"\n"}{"\n"}
                            Lord, lead me to live a day {"\n"}with this message {"\n"}deeply engraved. {"\n"}Amen.
                            {"\n"}
                            (Repeat three times){"\n"}
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
                        complete
                    </Text>
                </TouchableOpacity>             
                </View>  
                <ImageBackground source={require('../resources/pray2_img.png')} style={{width: '100%', height: 600}}>
                    <ScrollView style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, marginBottom:130}}>
                        <Text style={[{textAlign:'center', color:'#fff', paddingTop:270, lineHeight: 22}, normalSize]}> 
                        God told me that{"\n"}
                            "{this.state.comment}"
                            {"\n"}{"\n"}
                            Lord, lead me to live a day {"\n"}with this verse {"\n"}deeply engraved. {"\n"}Amen.
                            {"\n"}
                            (Repeat three times){"\n"}
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
                        'Do you really want to close it?',
                        'If you click OK, your entries are not saved.',
                        [                                 
                            {
                            text: 'cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                            },
                            {text: 'OK', onPress: () => 
                            [Keyboard.dismiss(), this.state.doMore ? this.setState({start: false, bg1: "", bg2: "", bg3: "", sum1: "", sum2: "", js1:"", js2:"", currentIndex: 0, basic:true, Lectioupdate: true}) : [this.setState({start: false,  comment:"", bg1: "", bg2: "", bg3: "", sum1: "", sum2: "", js1:"", js2:"", currentIndex: 0, basic:null}),this.getBasicInfo(), this.getData(Date)]]},
                        ],
                        {cancelable: true},
                        )}  
                    >
                        <Text style={{color:"#FFF", textAlign:'left'}}>
                            {"<"} back
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
                            <Text style={[{textAlign:'center', color:'#fff', paddingTop:'30%', lineHeight: 25}, normalSize]}>   Come Holy Spirit, {"\n"}fill the hearts of your faithful and kindle in them the fire of your love. {"\n"}Send forth your Spirit and they shall be created. {"\n"}And You shall renew the face of the earth. {"\n"}O, God, who by the light of the Holy Spirit, did instruct the hearts of the faithful, {"\n"}grant that by the same Holy Spirit we may be truly wise and ever enjoy His consolations, {"\n"}Through Christ Our Lord, {"\n"}Amen.
                            </Text>                                   
                        </ScrollView>
                    </ImageBackground>                               
                    </View>
                <KeyboardAvoidingView style={{height:130, width:'100%'}}>
                    
                    <View style={this.state.currentIndex == 1 ? {} : {display:'none'}}>
                        <Text style={[{textAlign:'center', paddingTop:40, color: "#01579b"}, largeSize]}>{this.state.Sentence}</Text>          
                         <Text style={[styles.TextStyle,{marginTop:3, paddingBottom:0, color:'#01579b', textAlign:'center', fontSize:14}]}>{this.state.Person} {this.state.cv}</Text>                                   
                    </View>

                    <View style={this.state.currentIndex == 2 && !this.state.basic ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>Who are the characters of the gospel?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.bg1}        
                        onChangeText={bg1 => this.setState({bg1})}        
                        // Making the Under line Transparent.
                        //underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                           
                    </View>

                    <View style={this.state.currentIndex == 2 && this.state.basic ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>Let's write a verse to meditate on today down.</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.comment}        
                        onChangeText={comment => this.setState({comment})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                           
                    </View>

                    <View style={this.state.currentIndex == 3 ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>Where is the background location of the gospel?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.bg2}        
                        onChangeText={bg2 => this.setState({bg2})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />             
                    </View>

                    <View style={this.state.currentIndex == 4 ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>The time or situation of the gospel?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.bg3}        
                        onChangeText={bg3 => this.setState({bg3})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                             
                    </View>

                    <View style={this.state.currentIndex == 5 ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>Let's summarize the contents centered on events.</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.sum1}        
                        onChangeText={sum1 => this.setState({sum1})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                           
                    </View>

                    <View style={this.state.currentIndex == 6 ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>What verses are touching particularly?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.sum2}        
                        onChangeText={sum2 => this.setState({sum2})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                          
                    </View>

                    <View style={this.state.currentIndex == 7 ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>Let's look for characteristics of jesus in the gospel.</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
                        value={this.state.js1}        
                        onChangeText={js1 => this.setState({js1})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                         
                    </View>

                    <View style={this.state.currentIndex == 8 ? {} : {display:'none'}}>
                        <Text style={styles.TextQuestionStyleClass}>What does jesus say to me through the gospel?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="Please write it here."
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
    getThreeGaspel: PropTypes.func   
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