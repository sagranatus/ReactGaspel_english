import React, { Component } from 'react';
import { PanResponder, PixelRatio, StyleSheet, TextInput, View, Button, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Image, Alert, ImageBackground, TouchableHighlight, AsyncStorage, ActivityIndicator, Keyboard } from 'react-native';
import {PropTypes} from 'prop-types';
import Icon from 'react-native-vector-icons/EvilIcons'
import Icon3 from 'react-native-vector-icons/FontAwesome'
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon5 from 'react-native-vector-icons/AntDesign'
import { openDatabase } from 'react-native-sqlite-storage';
import {NavigationEvents} from 'react-navigation'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
var db = openDatabase({ name: 'UserDatabase.db' });
import OnboardingButton from '../etc/OnboardingButton'
import {toShortFormat, dateFormat1} from '../etc/dateFormat';
var date;
var normalSize;
var normalSize_input;
var largeSize;

export default class Main4_2 extends Component { 
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
      mysentence: "",
      start: false,
      praying: false,
      Weekenddate:"",
      Weekendupdate: false,
      Weekendediting: false,
      currentIndex:0,
      initialLoading: true,
      selectedDate: "",
      selectShow: false
    }
    
    this.moveNext = this.moveNext.bind(this);
    this.moveFinal = this.moveFinal.bind(this);
    this.movePrevious = this.movePrevious.bind(this);
    this.transitionToNextPanel = this.transitionToNextPanel.bind(this);  
    this.getData = this.getData.bind(this);    
}

getData(today_comment_date){
  db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM lectio where date = ?',
        [today_comment_date],
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
                  Sentence:  results.rows.item(0).onesentence,
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
          'SELECT * FROM weekend where date = ?',
          [today_comment_date],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {                  
              console.log('Main4 - check Weekend data : ', results.rows.item(0).mysentence) 
                this.setState({
                    mysentence : results.rows.item(0).mysentence
                })
            } else {                                     
            }
          }
        );
    });    
}
movePrevious(){
  this.transitionToNextPanel(this.state.currentIndex -1);
}

moveNext(){
  this.transitionToNextPanel(this.state.currentIndex +1);
}

moveFinal(){
    console.log("Main4_2 - moveFinal")
    Keyboard.dismiss()

    if(this.state.Weekendupdate){        
      // 수정시 - 후에 Weekendediting: false     
        const date = this.state.Date;
        const bg1 = this.state.bg1
        const bg2 = this.state.bg2
        const bg3 = this.state.bg3
        const sum1 = this.state.sum1
        const sum2 = this.state.sum2
        const js1 = this.state.js1
        const js2 = this.state.js2
        const mysentence = this.state.mysentence
        // lectio, weekend DB를 업데이트한다.
        db.transaction(function(tx) {
            tx.executeSql(
                'UPDATE lectio set bg1=?, bg2=?, bg3=?, sum1=?, sum2=?, js1=?, js2=? where date=?',
                [bg1, bg2, bg3, sum1, sum2, js1, js2, date],
                (tx, results) => {
                if (results.rowsAffected > 0) {
                    console.log('Main4_2 - lectio data updated : ', "success")                     
                } else {
                    console.log('Main4_2 - lectio data updated : ', "failed")   
                }
                }
            );
    
            tx.executeSql(
                'UPDATE weekend set mysentence=? where date=?',
                [mysentence, date],
                (tx, results) => {
                if (results.rowsAffected > 0) {
                    console.log('Main4_2 - weekend data updated : ', "success")               
                } else {
                    console.log('Main4_2 - weekend data updated : ', "failed")   
                }
                }
            );
            }); 

        
        this.setState({ Weekendediting: false });
}else{
  // 삽입시에 - 후에 praying:true
    try {
      AsyncStorage.setItem('refreshMain5', 'refresh');
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
    const mysentence = this.state.mysentence
    const place = this.state.place
    // 값이 있는지 확인하고 없는 경우 lectio,weekend DB에 삽입한다 
    db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM lectio where date = ?',
          [date],
          (tx, results) => {
            var len = results.rows.length;
          //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Main4_2 - data : ', "existed")        
            } else {
              db.transaction(function(tx) {
                tx.executeSql(
                  'INSERT INTO lectio (date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2, place) VALUES (?,?,?,?,?,?,?,?,?,?)',
                  [date,sentence, bg1, bg2, bg3, sum1, sum2, js1, js2, place],
                  (tx, results) => {                          
                    if (results.rowsAffected > 0) {
                        console.log('Main4_2 - lectio data inserted : ', "success")          
                        
                    } else {
                        console.log('Main4_2 - lectio data inserted : ', "failed") 
                    }
                  }
                );
              });                             
            }
          }
        );

        tx.executeSql(
            'SELECT * FROM weekend where date = ?',
            [date],
            (tx, results) => {
              var len = results.rows.length;
            //  값이 있는 경우에 
              if (len > 0) {                  
                  console.log('Main4_2', "data exist")        
              } else {
                db.transaction(function(tx) {
                  tx.executeSql(
                    'INSERT INTO weekend (date, mysentence, place) VALUES (?,?,?)',
                    [date,mysentence,place],
                    (tx, results) => {                            
                      if (results.rowsAffected > 0) {
                        console.log('Main4_2 - weekend data inserted : ', "success") 
                      } else {
                        console.log('Main4_2 - weekend data inserted : ', "failed")
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
  //textSize 가져옴
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

  // navigation.params 날짜 가져오고 Date,selectedDate,Wekeenddate 세팅
  const { params } = this.props.navigation.state;

    var year, month, day

    if(params != null){
      console.log("Main4_2 - params : ", params+"existed" )
        date = params.otherParam
        year = params.otherParam.substring(0, 4);
        month = params.otherParam.substring(5, 7);
        day = params.otherParam.substring(8, 10);
    }
    
  var today = year+"-"+month+"-"+day;
  
  var today_comment_date = toShortFormat(new Date(today))
  console.log('Main4_2 - today date : ', today+"/"+today_comment_date)
  this.setState({
      Date: today,
      selectedDate: year+"-"+month,
      Weekenddate: today_comment_date
  })

  // 데이터 가져오기
  this.props.getGaspel(today) 
  this.getData(today)
}

  refreshContents(){
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

    // 모두 비우고, 다시 날짜 가져와서 세팅 및 getGaspel, DB 체크
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
      mysentence: "",
      start: false,
      praying: false,
      Weekenddate:"",
      Weekendupdate: false,
      Weekendediting: false,
      currentIndex:0,
      initialLoading: true})
    const { params } = this.props.navigation.state;
 
    var year, month, day

    if(params != null){
        console.log("Main4_2 - params : ", params+"existed" )
        date = params.otherParam
        year = params.otherParam.substring(0, 4);
        month = params.otherParam.substring(5, 7);
        day = params.otherParam.substring(8, 10);
    }
    
    var today = year+"-"+month+"-"+day;
    
    var today_comment_date = toShortFormat(new Date(today))
    console.log('Main4_2 - today date : ', today+"/"+today_comment_date)
    this.setState({
        Date: today,
        selectedDate: year+"-"+month,
        Weekenddate: today_comment_date
    })

    this.props.getGaspel(today) // 데이터 가져오기
    //Weekend있는지 확인    
    this.getData(today)
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
      Firstverse:  Number(first.replace(/[^0-9]/g, ''))-3,
      Lastverse: Number(last.replace(/[^0-9]/g, ''))+3,
      Person: nextProps.gaspels.person,
      place: nextProps.gaspels.person+" "+nextProps.gaspels.cv,
      Chapter: chapter,
      cv: nextProps.gaspels.cv
    })
   // alert(last);
   // alert(chapter+first+last)
  }

  // threegaspel 가져올때 
  if(nextProps.gaspels.threegaspels != null){   
      console.log("Main4 - Three gaspel get")             
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
    console.log("Main4_2 - in render");
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

    : (this.state.Weekendupdate == true) ? 
        (this.state.Weekendediting == true) ?
        // 수정시
            (
              <View style={{backgroundColor:'#fff'}}>      
                <NavigationEvents
                onWillFocus={payload => {
                this.refreshContents()
                }}
                />
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
                      {text: 'OK', onPress:() => [Keyboard.dismiss(), this.setState({Weekendediting: false}), this.getData(this.state.Date)]},
                    ],
                    {cancelable: false},
                  )}
                  >
                  <Text style={{color:"#FFF", textAlign:'left'}}>
                      {"<"} back
                  </Text>
              </TouchableOpacity>
              <OnboardingButton
                  totalItems={8}
                  currentIndex={this.state.currentIndex}
                  movePrevious={this.movePrevious}
                  moveNext={this.moveNext}
                  moveFinal={this.moveFinal}
              />
              <KeyboardAvoidingView style={{height:130}}>  
                  <View style={this.state.currentIndex == 0 ? {} : {display:'none'}}>
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

                  <View style={this.state.currentIndex == 7 ? {} : {display:'none'}}>
                  <Text style={styles.TextQuestionStyleClass}>Let's choose a verse of the gospel deeply touching.</Text>
                  <TextInput
                  multiline = {true}
                  placeholder="Please write it here."
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
          <View style={{backgroundColor:'#fff', flex:1}}> 
            <NavigationEvents
              onWillFocus={payload => {
              this.refreshContents()
              }}
              />              
              <View style={this.state.selectShow ? {flex:1,position: 'absolute', right:'2%', top:'8%', width:'96%', height:500, backgroundColor:"#fff", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>              
                <ScrollView 
                style={{flex:1, marginLeft:5, marginRight:5, paddingBottom:200, marginBottom:20}}
                    onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })}>        
                   <Text style={[styles.TextStyle,{marginTop:3, padding:10, color:'#000', textAlign:'center', fontSize:14}]}>{this.state.Weekenddate}</Text>    
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
              <TouchableOpacity
                  activeOpacity = {0.9}
                  style={{backgroundColor: '#01579b', padding: 10}}
                  onPress={() =>  (!this.state.Weekendediting&&this.state.Weekendupdate)  ? 
                    this.props.navigation.navigate('Main5', {otherParam: this.state.selectedDate})
                    : Alert.alert(
                    'Do you really want to close it?',
                    'If you click OK, your entries are not saved.',
                    [                                 
                      {
                        text: 'cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {text: 'OK', onPress:() =>  [Keyboard.dismiss(), this.props.navigation.navigate('Main5', {otherParam: this.state.selectedDate})]},
                    ],
                    {cancelable: false},
                  )} 
                  >
                  <Text style={{color:"#FFF", textAlign:'left'}}>
                      {"<"} back
                  </Text>
              </TouchableOpacity>
              <ScrollView style={{marginBottom:40}}
              ref={(e) => { this.fScroll = e }}>
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
                  onPress={() => this.setState({ Weekendediting: true, currentIndex: 0 })}
                  > 
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon4 name={'circle-edit-outline'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Edit</Text>   
                  </TouchableOpacity>
                  </View>   
                  <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5, flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '32%', height: 40}}>
                  <TouchableOpacity 
                  activeOpacity = {0.9}
                  onPress={() => this.props.navigation.navigate('SendImage', {otherParam: "Main4_2", otherParam2: this.state.Date})}
                  > 
                  <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}><Icon3 name={'send-o'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Share</Text>   
                  </TouchableOpacity>
                  </View>   
                </View>   
            <TouchableOpacity 
              activeOpacity = {0.9}
              onPress={() => this.setState({selectShow:true}) } 
              >       
              <Text style={[{color:'#01579b', textAlign: 'center', marginTop: 10, marginBottom: 10, padding:5}, largeSize]}>{this.state.Sentence}</Text> 
              <Text style={[styles.TextStyle,{marginTop:3, paddingBottom:0, color:'#01579b', textAlign:'center', fontSize:14}]}>{this.state.Person} {this.state.cv}</Text>
              </TouchableOpacity>
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
            <Text style={styles.UpdateQuestionStyleClass}>Let's choose a verse of the gospel deeply touching.</Text>
            <Text style={[styles.TextResultStyleClass, normalSize]}>{this.state.mysentence}</Text>      
             
              </ScrollView> 
          </View>          
          )
        
        :
        // 처음 없을때 시작
        (  
          <View style={{backgroundColor:'#fff', flex:1}}> 
            <NavigationEvents
              onWillFocus={payload => {
              this.refreshContents()
              }}
              />              
              <View style={this.state.selectShow ? {flex:1,position: 'absolute', right:'2%', top:'8%', width:'96%', height:500, backgroundColor:"#fff", zIndex:1, borderWidth:1, borderColor:'#686868'} : {display:'none'}}>              
                <ScrollView 
                style={{flex:1, marginLeft:5, marginRight:5, paddingBottom:200, marginBottom:20}}
                    onScrollEndDrag={() => this.fScroll.setNativeProps({ scrollEnabled: true })}>        
                   <Text style={[styles.TextStyle,{marginTop:3, padding:10, color:'#000', textAlign:'center', fontSize:14}]}>{this.state.Weekenddate}</Text>    
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
              <TouchableOpacity
                  activeOpacity = {0.9}
                  style={{backgroundColor: '#01579b', padding: 10}}
                  onPress={() => this.state.currentIndex == 0 || this.state.currentIndex == 1 || this.state.currentIndex == 2&&this.state.question || !this.state.start  ? 
                    this.state.start ? this.setState({start:false}): this.props.navigation.navigate('Main5', {otherParam: this.state.selectedDate})
                    : Alert.alert(
                    'Do you really want to close it?',
                    'If you click OK, your entries are not saved.',
                    [                                 
                      {
                        text: 'cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {text: 'OK', onPress:() =>  this.state.start ? [Keyboard.dismiss(), this.setState({start: false,  answer:"",  bg1: "", bg2: "", bg3: "", sum1: "", sum2: "", js1:"", js2:"", mysentence: "", currentIndex: 0})] : this.props.navigation.navigate('Main5', {otherParam: this.state.selectedDate})},
                    ],
                    {cancelable: false},
                  )} 
                  >
                  <Text style={{color:"#FFF", textAlign:'left'}}>
                      {"<"} back
                  </Text>
              </TouchableOpacity>
              <ScrollView style={this.state.start == false ? {} : {display:'none'}}
               ref={(e) => { this.fScroll = e }}>                          
                <Image source={require('../resources/weekend_img1.png')} style={{width: '100%', height: 150}} /> 
                <View style={{backgroundColor: "#F9F9F9", flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center',  paddingBottom:5,  borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
                    <View style={{flexDirection: "column", flexWrap: 'wrap', width: '100%', height: 20, marginTop:5}}>
                    <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#686868'}]}>{this.state.Weekenddate}</Text>   
                    </View>   
                </View>  
                 <View style={{flex:1, backgroundColor: "#fff", flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop:5, alignItems: 'center',  padding:10, paddingBottom:15, borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
                    <View style={{backgroundColor:"#f9fafc", borderColor:"#e6e8ef", borderWidth:1, borderRadius:5,flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center',   alignItems: 'center',  width: '48%', marginRight:'3%', height:40}}>
                    <TouchableOpacity 
                    activeOpacity = {0.9}
                    onPress={() => this.setState({selectShow: true})} 
                    >  
                    <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#43484b'}]}> <Icon4 name={'book-open-page-variant'} size={20} color={"#4e99e0"} style={{paddingTop:9}} />  Read Gospel</Text>   
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
                  <Text style={[{color:'#000', margin:10, lineHeight: 25}, normalSize]}>Lectio Divina of the Lord's Day is the process including praying to the Holy Spirit, reading the Gospel thoroughly and repetitively, meditating on what the God is saying to you and choosing a biblical verse to meditate for a week. You can practice to living with the God's word by meditating selected verse for a week.</Text>
                  <Image source={require('../resources/weekend_img2_en.png')}   resizeMode={'cover'} style={{ width: '100%', height: 80 }} />                   
                </ScrollView>
              
                <View style={this.state.praying == true ? {} : {display:'none'}}>        
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
                    God told me that{"\n"}
                    "{this.state.js2}"
                    {"\n"}{"\n"}
                    Lord, lead me to live a day {"\n"}with this message {"\n"}deeply engraved.
                    {"\n"} 
                    "{this.state.mysentence}"{"\n"}{"\n"}
                     Please let me meditate on this verse for a week.{"\n"}Amen.{"\n"}
                    </Text>                                
                    </ScrollView>                        
                  </ImageBackground> 
              </View>

              <View style={this.state.start == true && this.state.praying ==false ? {} : {display:'none'}}>                           
              <OnboardingButton
                      totalItems={10}
                      currentIndex={this.state.currentIndex}
                      movePrevious={this.movePrevious}
                      moveNext={this.moveNext}
                      moveFinal={this.moveFinal}
                  />
                  <KeyboardAvoidingView style={(this.state.currentIndex == 9 && this.state.question != null) ? {height:150} : {height:130}}>
                      <View style={this.state.currentIndex == 0 ? {} : {display:'none'} }>
                    
                      <ImageBackground source={require('../resources/pray1_img.png')} style={{width: '100%', height: 600}}>
                      <ScrollView style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, marginBottom:130}}>
          
                      <Text style={[{textAlign:'center', color:'#fff', paddingTop:'30%', lineHeight: 25}, normalSize]}> Come Holy Spirit, {"\n"}fill the hearts of your faithful and kindle in them the fire of your love. {"\n"}Send forth your Spirit and they shall be created. {"\n"}And You shall renew the face of the earth. {"\n"}O, God, who by the light of the Holy Spirit, did instruct the hearts of the faithful, {"\n"}grant that by the same Holy Spirit we may be truly wise and ever enjoy His consolations, {"\n"}Through Christ Our Lord, {"\n"}Amen.</Text>          
                    
                      </ScrollView>
                        </ImageBackground>
                                
                      </View>

                      <View style={this.state.currentIndex == 1 ? {} : {display:'none'}}>
                        <Text style={[{textAlign:'center', paddingTop:40, color: "#01579b"}, largeSize]}>{this.state.Sentence}</Text>       
                        <Text style={[styles.TextStyle,{marginTop:3, paddingBottom:0, color:'#01579b', textAlign:'center', fontSize:14}]}>{this.state.Person} {this.state.cv}</Text>                                        
                      </View>

                      <View style={this.state.currentIndex == 2 ? {} : {display:'none'}}>
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
                      <View style={(this.state.currentIndex == 8) ? {} : {display:'none'}}>
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

                      <View style={(this.state.currentIndex==9) ? {} : {display:'none'}}>
                      <Text style={styles.TextQuestionStyleClass}>Let's choose a verse of the gospel deeply touching.</Text>
                      <TextInput
                      multiline = {true}
                      placeholder="Please write it here."
                      value={this.state.mysentence}        
                      onChangeText={mysentence => this.setState({mysentence})}        
                      // Making the Under line Transparent.
                      underlineColorAndroid='transparent'        
                      style={[styles.TextInputStyleClass, {fontSize: normalSize_input / PixelRatio.getFontScale()}]}  />                           
                      </View>      
                      
                  </KeyboardAvoidingView>

              
                  <KeyboardAwareScrollView style={this.state.currentIndex == 0  ? {display:'none'} : {marginBottom:130} }>   
     
                      <TouchableHighlight
                      style={this.state.currentIndex == 1  ? {display:'none'} : { justifyContent: 'center', alignItems: 'center'}}
                      underlayColor = {"#fff"}
                      onPress={() => this.getPrevMoreGaspel()}>
                        <Icon name={"chevron-up"} size={40} color={"#A8A8A8"} /> 
                      </TouchableHighlight >     
                      <Text style={[styles.DescriptionComponentStyle, normalSize]}>{this.state.Contents}</Text>        
                      <TouchableHighlight
                      style={this.state.currentIndex == 1  ? {display:'none'} : { justifyContent: 'center', alignItems: 'center'}}
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

Main4_2.propTypes = {
  getGaspel: PropTypes.func,
  getThreeGaspel: PropTypes.func
};
      
const styles = StyleSheet.create({    
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
    }
  });