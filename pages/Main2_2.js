import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Alert, Button, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
var date;
export default class Main2_2 extends Component { 

static navigationOptions =  ({ navigation }) => {
    return {
    headerLeft: (
        <Button
        onPress={() =>{
            navigation.navigate('Main5', {otherParam: date});} } // date값 전달해서 받도록 함
        title="back"
        color="transparent"
        titleColor="#fff"
        />
    ),
    }
};

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
        Comment:"",
        Commentdate:"",
        Commentupdate: false
     }
  }

  componentWillMount(){
    console.log("Main2_2 - componentWillMount")
    const { params } = this.props.navigation.state;
   // console.log(params.otherParam)
   
    var year, month, day

    if(params != null){
        console.log("Main2_2 - params : ", params+"existed" )
        date = params.otherParam
        year = params.otherParam.substring(0, 4);
        month = params.otherParam.substring(5, 7);
        day = params.otherParam.substring(8, 10);
    }
    

    var today = year+"-"+month+"-"+day;
    var today_comment_date = year+"년 "+month+"월 "+day+"일 "+this.getTodayLabel(new Date(today))

    console.log("Main2_2 - date : ", today+"/"+today_comment_date)
    this.setState({
        Date: today,
        Commentdate: today_comment_date
    })

    this.props.getGaspel(today) // 데이터 가져오기   

    //comment있는지 확인        
    const loginId = this.props.status.loginId;
    db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM comment where date = ? and uid = ?',
          [today_comment_date, loginId],
          (tx, results) => {
            var len = results.rows.length;
          //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Main2_2 - check Comment data : ', results.rows.item(0).comment)   
                this.setState({
                    Comment: results.rows.item(0).comment,
                    Commentupdate: true
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
    console.log("Main2_2 - componentWillReceiveProps")
     // comment 삽입시
     if(nextProps.gaspels.comment != null){
       
        alert(nextProps.gaspels.comment.comment+" is inserted")
         //comment insert 후에 update로 변하도록 하기 위함
        var today_comment_date = this.state.Commentdate
        var loginId = this.props.status.loginId
            
        db.transaction(tx => {
            tx.executeSql(
            'SELECT * FROM comment where date = ? and uid = ?',
            [today_comment_date,loginId],
            (tx, results) => {
                var len = results.rows.length;
            //  값이 있는 경우에 
                if (len > 0) {                  
                    console.log('Main2_2 - check Comment data : ', results.rows.item(0).comment)   
                    this.setState({
                        Comment: results.rows.item(0).comment,
                        Commentupdate: true
                    })
                  //  const main5 =  new Main5()
                 //   main5.getAllPoints()
                } else {                                  
                }
            }
            );
        });    
       
     }
    
      // 이는 getGaspel에서 받아오는 경우
      if(nextProps.gaspels.sentence != null){
        console.log('Main2_2 - get Gaspel Data')   
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
      //  contents = contents.replace(/\n/gi, " ");    
   
      // 몇장 몇절인지 찾기
        var pos = contents.match(/\d{1,2},\d{1,2}-\d{1,2}/);
        if(pos == null){
            pos = contents.match(/\d{1,2},\d{1,2}.-\d{1,2}/);
        }
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

        console.log("Main2_2 - first verse, last verse get : ", first_verse+"/"+last_verse)

        // 숫자 엔터 시도
    /*    pos = contents_.match(/\d{1,2}/) 
        console.log("here",pos)
        var p = pos.index+length
        contents = contents.substring(0,p)+"\n"+contents.substring(p)

        pos = contents.substring(p+2).match(/\d{1,2}/)
        var p = pos.index+p+2
        contents = contents.substring(0,p)+"\n"+contents.substring(p)
      
        pos = contents.substring(p+2).match(/\d{1,2}/)
        var p = pos.index+p+2
        contents = contents.substring(0,p)+"\n"+contents.substring(p)

        pos = contents.substring(p+2).match(/\d{1,2}/)
        var p = pos.index+p+2
        contents = contents.substring(0,p)+"\n"+contents.substring(p)
        

        pos = contents.substring(p+2).match(/\d{1,2}/)
        var p = pos.index+p+2
        contents = contents.substring(0,p)+"\n"+contents.substring(p)

        pos = contents.substring(p+2).match(/\d{1,2}/)
        var p = pos.index+p+2
        contents = contents.substring(0,p)+"\n"+contents.substring(p)
        

        pos = contents.substring(p+2).match(/\d{1,2}/)
        var p = pos.index+p+2
        contents = contents.substring(0,p)+"\n"+contents.substring(p)

        pos = contents.substring(p+2).match(/\d{1,2}/)
        var p = pos.index+p+2
        contents = contents.substring(0,p)+"\n"+contents.substring(p)

        pos = contents.substring(p+2).match(/\d{1,2}/)
        var p = pos.index+p+2
        contents = contents.substring(0,p)+"\n"+contents.substring(p)

        pos = contents.substring(p+2).match(/\d{1,2}/)
        var p = pos.index+p+2
        contents = contents.substring(0,p)+"\n"+contents.substring(p)
   
        pos = contents.substring(p+3).match(/\d{1,2}/)
        var p = pos.index+p+3
        contents = contents.substring(0,p)+"\n"+contents.substring(p)
        */

        
        // 복음사가 가져옴
    var idx_today = contents.indexOf("전한 거룩한 복음입니다.");
    var today_person;
    if(idx_today == -1){
        idx_today = contents.indexOf("전한 거룩한 복음의 시작입니다.");
        today_person = contents.substring(2,idx_today-2); // 복음사 사람 이름
    }else{
        today_person = contents.substring(2,idx_today-2);
    }

    console.log("Main2_2 - person & chapter get : ",today_person+"/"+chapter);
    
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
    if(nextProps.gaspels.threegaspels != null){
        console.log("Main2_2 - Three gaspel get")        
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
   // comment 저장
   insertComment(){
    if(this.state.Commentupdate){        
        this.props.updateComment("update",this.props.status.loginId,this.state.Commentdate,this.state.Sentence, this.state.Comment)
        const loginId = this.props.status.loginId;
        const comment = this.state.Comment;
        const date = this.state.Commentdate;

        // comment DB를 업데이트한다.
        db.transaction(function(tx) {
        tx.executeSql(
            'UPDATE comment set comment=? where uid=? and date=?',
            [comment, loginId, date],
            (tx, results) => {
          //  console.log('Results', 'done');
            if (results.rowsAffected > 0) {
                console.log('Main2_2 - comment data updated : ', "update success")                   
            } else {
                console.log('Main2_2 - comment data updated : ', "update fail")  
            }
            }
        );
        }); 
              
    }else{
        this.props.insertComment("insert",this.props.status.loginId,this.state.Commentdate,this.state.Sentence, this.state.Comment)
        const loginId = this.props.status.loginId;
        const sentence = this.state.Sentence;
        const comment = this.state.Comment;
        const date = this.state.Commentdate;
        // 값이 있는지 확인하고 없는 경우 comment DB에 삽입한다 
        db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM comment where date = ? and uid = ?',
              [date, loginId],
              (tx, results) => {
                var len = results.rows.length;
              //  값이 있는 경우에 
                if (len > 0) {                  
                    console.log('Main2_2 - comment data : ', "already existed")      
                } else {
                  db.transaction(function(tx) {
                    tx.executeSql(
                      'INSERT INTO comment (uid, date, onesentence, comment) VALUES (?,?,?,?)',
                      [loginId,date,sentence, comment],
                      (tx, results) => {
                        if (results.rowsAffected > 0) {
                            console.log('Main2_2 - comment data inserted : ', "success")                 
                        } else {
                            console.log('Main2 - comment data inserted : ', "failed") 
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

  render() {
    console.log("Main2_2 - gaspels in render");
        return (  
            <View> 
              
            <ScrollView style={styles.MainContainer}> 
                <KeyboardAvoidingView >
                <View style={this.state.Commentupdate == false ? {} : {display:'none'}}>
                    <Text style={{textAlign:'center'}}>오늘 복음에서 가장 마음에 드는 구절을 적어 봅시다.</Text>
                    <TextInput
                    placeholder="Enter User Id"
                    value={this.state.Comment}        
                    onChangeText={Comment => this.setState({Comment})}     
                    underlineColorAndroid='transparent'        
                    style={styles.TextInputStyleClass} />     
                     <TouchableOpacity
                    onPress={() => this.insertComment()} // insertComment
                    >
                    <Text style={{color:"#000", textAlign:'center'}}>
                        insert
                    </Text>
                </TouchableOpacity>
                </View>

                <View style={this.state.Commentupdate == true ? {} : {display:'none'}}>
                    <Text style={{textAlign:'center'}}>오늘 복음에서 가장 마음에 드는 구절</Text>
                    <TextInput
                    placeholder="Enter User Id"
                    value={this.state.Comment}        
                    onChangeText={Comment => this.setState({Comment})}   
                    underlineColorAndroid='transparent'        
                    style={styles.TextInputStyleClass} />     
                     <TouchableOpacity
                    onPress={() => this.insertComment()} // insertComment - update
                    >
                    <Text style={{color:"#000", textAlign:'center'}}>
                        update
                    </Text>
                </TouchableOpacity>
                </View>
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
Main2_2.propTypes = {
    getGaspel: PropTypes.func,
    getThreeGaspel: PropTypes.func,
    insertComment: PropTypes.func,   
    updateComment: PropTypes.func, 
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