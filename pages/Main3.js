import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import OnboardingButton from '../etc/OnboardingButton'
export default class Main3 extends Component { 
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
        sum1:"",
        js1:"",
        js2:"",
        Comment:"",
        Commentdate:"",
        Lectioupdate: false,
        Lectioediting: false,
        currentIndex:0,
        isDone:false
     }
     
     this.moveNext = this.moveNext.bind(this);
     this.moveFinal = this.moveFinal.bind(this);
     this.movePrevious = this.movePrevious.bind(this);
     this.transitionToNextPanel = this.transitionToNextPanel.bind(this);
  }

  movePrevious(){
    this.transitionToNextPanel(this.state.currentIndex -1);
}

moveNext(){
    this.transitionToNextPanel(this.state.currentIndex +1);
}

moveFinal(){
    console.log("saea")
    alert(this.state.bg1+this.state.bg2+this.state.bg3+this.state.sum1+this.state.sum2+this.state.js1+this.state.js2);
    // lectio server
    if(this.state.Lectioupdate){        
        this.props.updateLectio("update",this.props.status.loginId, this.state.Commentdate, this.state.Sentence, this.state.bg1, this.state.bg2, this.state.bg3, this.state.sum1, this.state.sum2, this.state.js1, this.state.js2)
        const loginId = this.props.status.loginId;
        const date = this.state.Commentdate;
        const bg1 = this.state.bg1
        const bg2 = this.state.bg2
        const bg3 = this.state.bg3
        const sum1 = this.state.sum1
        const sum2 = this.state.sum2
        const js1 = this.state.js1
        const js2 = this.state.js2
        // comment DB를 업데이트한다.
        db.transaction(function(tx) {
        tx.executeSql(
            'UPDATE lectio set bg1=?, bg2=?, bg3=?, sum1=?, sum2=?, js1=?, js2=? where uid=? and date=?',
            [bg1, bg2, bg3, sum1, sum2, js1, js2, loginId, date],
            (tx, results) => {
            console.log('Results', 'done');
            if (results.rowsAffected > 0) {
                console.log('Message', "lectio update success")                   
            } else {
                alert('Update Failed');
            }
            }
        );
        }); 
        this.setState({ Lectioediting: false });
    }else{
        this.props.insertLectio("insert", this.props.status.loginId, this.state.Commentdate, this.state.Sentence, this.state.bg1, this.state.bg2, this.state.bg3, this.state.sum1, this.state.sum2, this.state.js1, this.state.js2)
        const loginId = this.props.status.loginId;
        const sentence = this.state.Sentence;
        const date = this.state.Commentdate;
        const bg1 = this.state.bg1
        const bg2 = this.state.bg2
        const bg3 = this.state.bg3
        const sum1 = this.state.sum1
        const sum2 = this.state.sum2
        const js1 = this.state.js1
        const js2 = this.state.js2
        // 값이 있는지 확인하고 없는 경우 lectio DB에 삽입한다 
        db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM lectio where date = ? and uid = ?',
              [date, loginId],
              (tx, results) => {
                var len = results.rows.length;
              //  값이 있는 경우에 
                if (len > 0) {                  
                    console.log('Message', "exist")        
                } else {
                  db.transaction(function(tx) {
                    tx.executeSql(
                      'INSERT INTO lectio (uid, date, onesentence, bg1, bg2, bg3, sum1, sum2, js1, js2) VALUES (?,?,?,?,?,?,?,?,?,?)',
                      [loginId,date,sentence, bg1, bg2, bg3, sum1, sum2, js1, js2],
                      (tx, results) => {
                        console.log('Results', 'done');
                        if (results.rowsAffected > 0) {
                          console.log('Message', "lectio added success")                   
                        } else {
                          alert('Added Failed');
                        }
                      }
                    );
                  });                             
                }
              }
            );
          });    
    }
}

transitionToNextPanel(nextIndex){      
    this.setState({
        currentIndex: nextIndex
    });    
}


  componentWillMount(){
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
    var today_comment_date = year+"년 "+month+"월 "+day+"일 "+this.getTodayLabel()
    console.log(today+" "+today_comment_date)
    this.setState({
        Date: today,
        Commentdate: today_comment_date
    })

    this.props.getGaspel(today) // 데이터 가져오기

    const loginId = this.props.status.loginId;
    //lectio있는지 확인    
    db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM lectio where date = ? and uid = ?',
          [today_comment_date,loginId],
          (tx, results) => {
            var len = results.rows.length;
          //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Message', results.rows.item(0).bg1)   
                this.setState({
                    bg1 : results.rows.item(0).bg1,
                    bg2 : results.rows.item(0).bg2,
                    bg3 : results.rows.item(0).bg3,
                    sum1 : results.rows.item(0).sum1,
                    sum2 : results.rows.item(0).sum2,
                    js1 : results.rows.item(0).js1,
                    js2 : results.rows.item(0).js2,
                    Lectioupdate: true
                })
            } else {                                  
            }
          }
        );
      });    
  }

    getTodayLabel() {        
        var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');        
        var today = new Date().getDay();
        var todayLabel = week[today];        
        return todayLabel;
    }


  componentWillReceiveProps(nextProps){
    
    var today_comment_date = this.state.Commentdate
    var loginId = this.props.status.loginId
     //lectio있는지 확인    
     db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM lectio where date = ? and uid = ?',
          [today_comment_date,loginId],
          (tx, results) => {
            var len = results.rows.length;
          //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Message', results.rows.item(0).bg1)   
                this.setState({
                    bg1 : results.rows.item(0).bg1,
                    bg2 : results.rows.item(0).bg2,
                    bg3 : results.rows.item(0).bg3,
                    sum1 : results.rows.item(0).sum1,
                    sum2 : results.rows.item(0).sum2,
                    js1 : results.rows.item(0).js1,
                    js2 : results.rows.item(0).js2,
                    Lectioupdate: true
                })
            } else {                                  
            }
          }
        );
      });    
      // 이는 getGaspel에서 받아오는 경우
      if(nextProps.lectios.sentence != null){
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
      //  contents = contents.replace(/\n/gi, " ");    
   
      // 몇장 몇절인지 찾기
        var pos = contents.match(/\d{1,2},\d{1,2}-\d{1,2}/);
        //console.log("saea",pos)
        //console.log("here", pos[0].indexOf(","))
        //console.log("here", pos[0].substring(0,pos[0].indexOf(","))) // 장 
        var chapter = pos[0].substring(0,pos[0].indexOf(","))
        //console.log("saea",pos[0].length)
        //console.log("saea",pos.index)
        contents_ = contents.substring(pos.index+pos[0].length)
        var length = pos.index+pos[0].length;
        //console.log(contents_)

        // 여기서 각 절 번호 가져옴
        pos = contents_.match(/\d{1,2}/gi) // 모든 절 위치 가져옴

        // 절 가져옴
        var first_verse = pos[0]
        var last_verse = pos[pos.length-1]

        console.log(first_verse+last_verse)

        // 복음사가 가져옴
    var idx_today = contents.indexOf("전한 거룩한 복음입니다.");
    var today_person;
    if(idx_today == -1){
        idx_today = contents.indexOf("전한 거룩한 복음의 시작입니다.");
        today_person = contents.substring(2,idx_today-2); // 복음사 사람 이름
    }else{
        today_person = contents.substring(2,idx_today-2);
    }

    console.log("saea","today who?"+today_person+chapter);
    
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

     // comment 가져올때
     if(nextProps.lectios.comment != null){   
      
        alert(nextProps.lectios.comment.comment+" is inserted")
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
    console.log(this.state.Person+this.state.Chapter+this.state.Lastverse)
     this.props.getThreeGaspel("next", this.state.Person, this.state.Chapter, this.state.Lastverse)
     this.setState({
        Lastverse: this.state.Lastverse+3,
        Move: "next"
    });
   }
   

  render() {
    console.log("state", this.state.currentIndex)
    console.log("message", this.props.lectios);
    console.log("message_loginId", this.props.status.loginId)
    if(this.state.Lectioupdate == true && this.state.Lectioediting == false){
        return (
            <View> 
                <Text style= {styles.DescriptionComponentStyle}>{this.state.bg1}</Text>   
                <Text style= {styles.DescriptionComponentStyle}>{this.state.bg2}</Text>   
                <Text style= {styles.DescriptionComponentStyle}>{this.state.bg3}</Text>   
                <Text style= {styles.DescriptionComponentStyle}>{this.state.sum1}</Text>   
                <Text style= {styles.DescriptionComponentStyle}>{this.state.sum2}</Text>   
                <Text style= {styles.DescriptionComponentStyle}>{this.state.js1}</Text>   
                <Text style= {styles.DescriptionComponentStyle}>{this.state.js2}</Text>        
                <TouchableOpacity
                onPress={() => this.setState({ Lectioediting: true, currentIndex: 0 })}
                >
                    <Text style={{color:"#000", textAlign:'center'}}>
                        Edit
                    </Text>
                </TouchableOpacity>
            </View>
         )
        }
        
        return (  
            <View> 
                    <OnboardingButton
                        totalItems={8}
                        currentIndex={this.state.currentIndex}
                        movePrevious={this.movePrevious}
                        moveNext={this.moveNext}
                        moveFinal={this.moveFinal}
                    />
                   <KeyboardAvoidingView style={{height:100}}>
                        <View style={this.state.currentIndex == 0 ? {} : {display:'none'}}>
                        <Text style={{textAlign:'center', paddingTop:40}}>말씀 듣기- 복음 말씀을 잘 듣기 위해 소리내어 읽어 봅시다</Text>                                             
                        </View>

                        <View style={this.state.currentIndex == 1 ? {} : {display:'none'}}>
                        <Text style={{textAlign:'center'}}>복음의 등장인물은?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="여기에 적어봅시다"
                        value={this.state.bg1}        
                        onChangeText={bg1 => this.setState({bg1})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={styles.TextInputStyleClass}  />                           
                        </View>

                        <View style={this.state.currentIndex == 2 ? {} : {display:'none'}}>
                        <Text style={{textAlign:'center'}}>복음의 배경장소는?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="여기에 적어봅시다"
                        value={this.state.bg2}        
                        onChangeText={bg2 => this.setState({bg2})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={styles.TextInputStyleClass} />                           
                        </View>

                        <View style={this.state.currentIndex == 3 ? {} : {display:'none'}}>
                        <Text style={{textAlign:'center'}}>배경시간 혹은 상황은?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="여기에 적어봅시다"
                        value={this.state.bg3}        
                        onChangeText={bg3 => this.setState({bg3})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={styles.TextInputStyleClass} />                           
                        </View>

                        <View style={this.state.currentIndex == 4 ? {} : {display:'none'}}>
                        <Text style={{textAlign:'center'}}>복음의 내용을 사건 중심으로 요약해 봅시다.</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="여기에 적어봅시다"
                        value={this.state.sum1}        
                        onChangeText={sum1 => this.setState({sum1})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={styles.TextInputStyleClass} />                           
                        </View>

                        <View style={this.state.currentIndex == 5 ? {} : {display:'none'}}>
                        <Text style={{textAlign:'center'}}>특별히 눈에 띄는 부분은?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="여기에 적어봅시다"
                        value={this.state.sum2}        
                        onChangeText={sum2 => this.setState({sum2})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={styles.TextInputStyleClass} />                           
                        </View>

                        <View style={this.state.currentIndex == 6 ? {} : {display:'none'}}>
                        <Text style={{textAlign:'center'}}>복음에서 보여지는 예수님의 모습은 어떠한가요?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="여기에 적어봅시다"
                        value={this.state.js1}        
                        onChangeText={js1 => this.setState({js1})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={styles.TextInputStyleClass} />                           
                        </View>

                        <View style={this.state.currentIndex == 7 ? {} : {display:'none'}}>
                        <Text style={{textAlign:'center'}}>복음을 통하여 예수님께서 내게 해주시는 말씀은?</Text>
                        <TextInput
                        multiline = {true}
                        placeholder="여기에 적어봅시다"
                        value={this.state.js2}        
                        onChangeText={js2 => this.setState({js2})}        
                        // Making the Under line Transparent.
                        underlineColorAndroid='transparent'        
                        style={styles.TextInputStyleClass} />                           
                        </View>
                        
                    </KeyboardAvoidingView>

                 
            <ScrollView style={styles.MainContainer}> 
             
                <TouchableOpacity
                onPress={() => this.getPrevMoreGaspel()}
                >
                    <Text style={{color:"#000", textAlign:'center'}}>
                        getMore
                    </Text>
                </TouchableOpacity>                          
                <Text style= {styles.TextComponentStyle}>{this.state.Sentence}</Text>        
                <Text style= {styles.DescriptionComponentStyle}>{this.state.Contents}</Text>        
                <TouchableOpacity
                onPress={() => this.getNextMoreGaspel()}
                >
                    <Text style={{color:"#000", textAlign:'center'}}>
                        getMore
                    </Text>
                </TouchableOpacity>
                                
            </ScrollView>  
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
 
    MainContainer :{  
    },
          
     TextComponentStyle: {
       fontSize: 17,
      color: "#000",
      textAlign: 'center'
     },
     DescriptionComponentStyle: {
        fontSize: 14,
        color: "#000",
        marginBottom: 1
     },

    TextInputStyleClass: { 
    textAlign: 'center',
    marginBottom: 7,
    height: 60,
    borderWidth: 1,
    // Set border Hex Color Code Here.
     borderColor: '#2196F3',
     
     // Set border Radius.
     borderRadius: 5 ,
     
    // Set border Radius.
     //borderRadius: 10 ,
    }
    });