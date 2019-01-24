import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });

export default class Main1 extends Component { 
constructor(props) { 
    super(props)  
    
    this.state = {
        Contents : "",
        Sentence : "",
        Person: "",
        Chapter: "",
        Firstverse: "",
        Lastverse: "",
        Move:"",
        Comment:""
     }
  }

  componentWillMount(){
    this.props.getGaspel("2018-01-11") // 데이터 가져오기
  }

  componentWillReceiveProps(nextProps){
      // 이는 getGaspel에서 받아오는 경우
      if(nextProps.gaspels.sentence != null){
        var contents = ""+nextProps.gaspels.contents
        var sentence = ""+nextProps.gaspels.sentence
        var start = contents.indexOf("✠");
        var end = contents.indexOf("◎ 그리스도님 찬미합니다");
        contents = contents.substring(start, end);
        contents = contents.replace(/&ldquo;/gi, "");
        contents = contents.replace(/&rdquo;/gi, "");
        contents = contents.replace(/&lsquo;/gi, "");
        contents = contents.replace(/&rsquo;/gi, "");
        contents = contents.replace(/&prime;/gi, "'");
        contents = contents.replace(/\n/gi, " ");    
    // var pos = contents.search(/\d+/g)
      // 몇장 몇절인지 찾기
        var pos = contents.match(/\d{1,2},\d{1,2}-\d{1,2}/);
        console.log("saea",pos)
        console.log("saea",pos[0].length)
        console.log("saea",pos.index)
        contents_ = contents.substring(pos.index+pos[0].length)
        var length = pos.index+pos[0].length;
        console.log(contents_)

        // 여기서 각 절 번호 가져옴
        pos = contents_.match(/\d{1,2}/gi) // 모든 절 위치 가져옴

        // 절 가져옴
        var first_verse = pos[0]
        var last_verse = pos[pos.length-1]

        console.log(first_verse+last_verse)

        // 숫자 엔터 시도
        console.log("saea",pos)
        var proc1;
        for(var i=0; i<pos.length; i++){
            console.log(contents_.indexOf(pos[i]))
            proc1 = contents_.indexOf(pos[i]);
            console.log(contents_.substring(proc1))
            proc2 = proc1 + length
        //   contents = contents.substring(0,p)+"\n"+contents.substring(p)
        }
     //   contents = contents.substring(0,20)+"saea"+contents.substring(20) 
        
        
        // 복음사가 + 장 가져옴
    var idx_today = contents.indexOf("전한 거룩한 복음입니다.");
    var today_length;
    var today_person;
    if(idx_today == -1){
        idx_today = contents.indexOf("전한 거룩한 복음의 시작입니다.");
        today_length = "전한 거룩한 복음의 시작입니다.".length;
        today_person = contents.substring(2,idx_today-2); // 복음사 사람 이름
    }else{
        today_length = "전한 거룩한 복음입니다.".length;
        today_person = contents.substring(2,idx_today-2);
    }

    var today_where = contents.substring(idx_today+today_length,idx_today+today_length+5);  
    if(today_where.includes(",")){
        today_where = today_where.substring(3,4); // 장
    }else{
        today_where = today_where.substring(3);
    }
    console.log("saea","today who?"+today_person+today_where);
    
        this.setState({
            Contents : contents,
            Sentence : sentence,
            Firstverse: first_verse - 3,
            Lastverse: parseInt(last_verse) + 3,
            Person: today_person,
            Chapter: today_where

        });   
      }

      // threegaspel 가져올때 
    if(nextProps.gaspels.threegaspels != null){        
        if(this.state.Move == "prev"){
            this.setState({
                Contents : nextProps.gaspels.threegaspels+this.state.Contents
            })    
        }else{
            this.setState({
                Contents : this.state.Contents+nextProps.gaspels.threegaspels
            })    
        }
          
    }

     // comment 가져올때
     if(nextProps.gaspels.comment != null){   
        const loginId = this.props.status.loginId;
        const sentence = this.state.Sentence;
        const comment = this.state.Comment;
        // 값이 있는지 확인하고 없는 경우 comment DB에 삽입한다 
        db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM comment where date = ? and uid = ?',
              ["2018년 01월 11일",loginId],
              (tx, results) => {
                var len = results.rows.length;
              //  값이 있는 경우에 
                if (len > 0) {                  
                    console.log('Message', "exist")        
                } else {
                  db.transaction(function(tx) {
                    tx.executeSql(
                      'INSERT INTO comment (uid, date, onesentence, comment) VALUES (?,?,?,?)',
                      [loginId,"2018년 01월 11일",sentence, comment],
                      (tx, results) => {
                        console.log('Results', 'done');
                        if (results.rowsAffected > 0) {
                          console.log('Message', "added success")                   
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
        alert(nextProps.gaspels.comment.comment+" is inserted")
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
   // comment 저장
   insertComment(){
    this.props.insertComment("insert",this.props.status.loginId,"2018년 01월 11일",this.state.Sentence, this.state.Comment)  
   }

  render() {
    console.log("message", this.props.gaspels);
    console.log("message_loginId", this.props.status.loginId)
        return (  
            <View> 
            <ScrollView style={styles.MainContainer}> 
                <KeyboardAvoidingView >
                    <Text style={{textAlign:'center'}}>오늘 복음에서 가장 마음에 드는 구절을 적어 봅시다.</Text>
                    <TextInput
                    placeholder="Enter User Id"        
                    onChangeText={Comment => this.setState({Comment})}        
                    // Making the Under line Transparent.
                    underlineColorAndroid='transparent'        
                    style={styles.TextInputStyleClass} />     
                     <TouchableOpacity
                    onPress={() => this.insertComment()} // insertComment
                    >
                    <Text style={{color:"#000", textAlign:'center'}}>
                        insert
                    </Text>
                </TouchableOpacity>
                </KeyboardAvoidingView>
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
Main1.propTypes = {
    getGaspel: PropTypes.func,
    getThreeGaspel: PropTypes.func,
    insertComment: PropTypes.func,    
    gaspels: PropTypes.object, // gaspelaction 결과값
    status: PropTypes.shape({
        isLogged: PropTypes.bool,
        loginId: PropTypes.string
    })
  };
  
const styles = StyleSheet.create({
 
    MainContainer :{     
    marginBottom: 30
    },
     
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
     
     TextComponentStyle: {
       fontSize: 20,
      color: "#000",
      textAlign: 'center', 
      marginBottom: 15
     },
     DescriptionComponentStyle: {
        fontSize: 14,
        color: "#000",
        marginBottom: 1
     },

    TextInputStyleClass: { 
    textAlign: 'center',
    marginBottom: 7,
    height: 40,
    borderWidth: 1,
    // Set border Hex Color Code Here.
     borderColor: '#2196F3',
     
     // Set border Radius.
     borderRadius: 5 ,
     
    // Set border Radius.
     //borderRadius: 10 ,
    }
    });