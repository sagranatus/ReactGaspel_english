
import React, { Component } from 'react'; 
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'
var normalSize;
var largeSize;

export default class Sub5 extends Component {

constructor(props) { 
    super(props) 
    this.state = {
      selectedDate: "", // - - 
      selectedDay: false, // 일요일 여부
      selectedDate_format: "",// 요일
      onesentence: "",
      Comment: "",
      bg1:"",
      bg2:"",
      bg3:"",
      sum1:"",
      sum1:"",
      js1:"",
      js2:"",
      mysentence: "",
      question:"",
      answer:"",
      mythought: "",
      initialLoading: true
      }
  }

componentWillMount(){ 
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

  console.log("Sub5 - componentWillMount")
    const { params } = this.props.navigation.state;
   // console.log(params.otherParam)
  
    if(params != null){
        console.log("Sub5 - params : ", params )      
    }

    const date = params.otherParam
    console.log("!!date", date)
    const date2= params.otherParam2
    console.log("date2", date2)
    this.setState({selectedDate_format: date, selectedDate: date2})
    //comment있는지 확인    
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM comment where date = ? and uid = ?',
          [date,this.props.status.loginId],
          (tx, results) => {
            var len = results.rows.length;
          //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Main5 - comment data : ', results.rows.item(0).comment)   
                this.setState({
                  Comment: results.rows.item(0).comment,
                  onesentence: results.rows.item(0).onesentence
                })
            } else {  
              this.setState({
                Comment: "",
                onesentence: ""
              })                                
            }
          }
        );

        tx.executeSql(
          'SELECT * FROM lectio where date = ? and uid = ?',
          [date,this.props.status.loginId],
          (tx, results) => {
            var len = results.rows.length;
          //  값이 있는 경우에 
            if (len > 0) {                  
                console.log('Main5 - lectio data : ', results.rows.item(0).bg1)   
            this.setState({
                bg1:results.rows.item(0).bg1,
                bg2:results.rows.item(0).bg2,
                bg3:results.rows.item(0).bg3,
                sum1:results.rows.item(0).sum1,
                sum2:results.rows.item(0).sum2,
                js1:results.rows.item(0).js1,
                js2:results.rows.item(0).js2,
                onesentence: results.rows.item(0).onesentence,
                initialLoading:false
              })
            } else {          
              this.setState({
                bg1:"",
                bg2:"",
                bg3:"",
                sum1:"",
                sum2:"",
                js1:"",
                js2:"",
                initialLoading:false
              })        
              if(this.state.Comment == ""){
                this.setState({
                  onesentence: ""
                })     
              }                
            }
          }
        );

        if(date.includes("일요일")){
          tx.executeSql(
            'SELECT * FROM weekend where date = ? and uid = ?',
            [date,this.props.status.loginId],
            (tx, results) => {
              var len = results.rows.length;
            //  값이 있는 경우에 
              if (len > 0) {                  
                  console.log('Main5 - weekend data : ', results.rows.item(0).mysentence)   
              this.setState({
                  mysentence:results.rows.item(0).mysentence,
                  mythought:results.rows.item(0).mythought,
                  question: results.rows.item(0).question,
                  answer: results.rows.item(0).answer,
                  selectedDay:true
                })
              } else {          
                this.setState({
                  mysentence:"",
                  mythought:"",
                  question: "",
                  answer: "",
                  selectedDay:true
                })          
              }
            }
          );
        }else{
          this.setState({
            mysentence:"",
            mythought:"",
            question:"",
            answer:"",
            selectedDay:false
          })  
        }
      
      });    
    

    }

    refreshContents(){
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
        this.setState({reload:true})
      })
      console.log("Sub5 - componentWillMount")
      const { params } = this.props.navigation.state;
     // console.log(params.otherParam)
      
      if(params != null){
          console.log("Sub5 - params : ", params.otherParam )      
      }
  
      const date = params.otherParam
      const date2= params.otherParam2
      this.setState({selectedDate_format: date, selectedDate: date2})
      //comment있는지 확인    
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM comment where date = ? and uid = ?',
            [date,this.props.status.loginId],
            (tx, results) => {
              var len = results.rows.length;
            //  값이 있는 경우에 
              if (len > 0) {                  
                  console.log('Main5 - comment data : ', results.rows.item(0).comment)   
                  this.setState({
                    Comment: results.rows.item(0).comment,
                    onesentence: results.rows.item(0).onesentence,
                    initialLoading:false
                  })
              } else {  
                this.setState({
                  Comment: "",
                  onesentence: "",
                  initialLoading:false
                })                                
              }
            }
          );
  
          tx.executeSql(
            'SELECT * FROM lectio where date = ? and uid = ?',
            [date,this.props.status.loginId],
            (tx, results) => {
              var len = results.rows.length;
            //  값이 있는 경우에 
              if (len > 0) {                  
                  console.log('Main5 - lectio data : ', results.rows.item(0).bg1)   
              this.setState({
                  bg1:results.rows.item(0).bg1,
                  bg2:results.rows.item(0).bg2,
                  bg3:results.rows.item(0).bg3,
                  sum1:results.rows.item(0).sum1,
                  sum2:results.rows.item(0).sum2,
                  js1:results.rows.item(0).js1,
                  js2:results.rows.item(0).js2,
                  onesentence: results.rows.item(0).onesentence,
                  initialLoading:false
                })
              } else {          
                this.setState({
                  bg1:"",
                  bg2:"",
                  bg3:"",
                  sum1:"",
                  sum2:"",
                  js1:"",
                  js2:"",
                  initialLoading:false
                })        
                if(this.state.Comment == ""){
                  this.setState({
                    onesentence: ""
                  })     
                }                
              }
            }
          );
  
          if(date.includes("일요일")){
            tx.executeSql(
              'SELECT * FROM weekend where date = ? and uid = ?',
              [date,this.props.status.loginId],
              (tx, results) => {
                var len = results.rows.length;
              //  값이 있는 경우에 
                if (len > 0) {                  
                    console.log('Main5 - weekend data : ', results.rows.item(0).mysentence)   
                this.setState({
                    mysentence:results.rows.item(0).mysentence,
                    mythought:results.rows.item(0).mythought,
                    question: results.rows.item(0).question,
                    answer: results.rows.item(0).answer,
                    selectedDay:true
                  })
                } else {          
                  this.setState({
                    mysentence:"",
                    mythought:"",
                    question: "",
                    answer: "",
                    selectedDay:true
                  })               
                }
              }
            );
          }else{
            this.setState({
              mysentence:"",
              mythought:"",
              question:"",
              answer:"",
              selectedDay:false
            })  
          }
        
        });    
      
    }

 
  render() {
    return (this.state.initialLoading)
    ? (    
        <View style={styles.loadingContainer}>
          <NavigationEvents
          onWillFocus={payload => {
            this.refreshContents()
          }}
          />
          <ActivityIndicator
            animating
            size="large"
            color="#C8C8C8"
            {...this.props}
          />
      </View>
      )
 
    : (
      <ScrollView>   
      <NavigationEvents
        onWillFocus={payload => {
          this.refreshContents()
        }}
        />
         <TouchableOpacity
              activeOpacity = {0.9}
              style={{backgroundColor: '#01579b', padding: 10}}
              onPress={() =>  [this.setState({ selectedDate: "",
              selectedDay: false, 
              selectedDate_format: "",// 요일
              onesentence: "",
              Comment: "",
              bg1:"",
              bg2:"",
              bg3:"",
              sum1:"",
              sum1:"",
              js1:"",
              js2:"",
              mysentence: "",
              mythought: "",
              question:"",
              answer:"",
              initialLoading: true}),this.props.navigation.navigate('Main5', {otherParamFromSub5: this.state.selectedDate})]} 
              >
              <Text style={{color:"#FFF", textAlign:'left'}}>
                  {"<"} BACK
              </Text>
          </TouchableOpacity>      
          <Text style={{ color: "#01579b", textAlign: 'center', fontSize:15, marginTop:20 }}>{this.state.selectedDate_format}</Text>
         
         <View>   
           <Text style={this.state.onesentence !== "" ? styles.smallText : {display:'none'}}>그날의 복음 말씀</Text>     
           <Text style={[{color: "#01579b", textAlign: 'center', fontWeight: 'bold', marginTop:10}, largeSize]}>{this.state.onesentence}</Text>              
         </View>

         <View>   
           
           <View style={!this.state.selectedDay && this.state.Comment!="" ? {marginTop:10} : {display:'none'}}>
           <Text style={styles.smallText}>간단한 독서</Text>   
           <Text style={[{ color: "#000", marginTop: 10, marginBottom: 10, textAlign: 'center'}, normalSize]}>{this.state.Comment}</Text>
           <TouchableOpacity 
             activeOpacity = {0.9}
             style={styles.Button}
             onPress={() =>  this.props.navigation.navigate('Main2_2', {otherParam: this.state.selectedDate}) } 
             >
             <Text style={{color:"#fff", textAlign:'center'}}>
             간단한독서 편집
             </Text>
           </TouchableOpacity>
           </View>    
          
         </View>
           
         
         <Text style={this.state.js2!=""&&this.state.selectedDay==false ? styles.smallText : {display:'none'}}>거룩한 독서</Text> 
         <Text style={this.state.js2!=""&&this.state.selectedDay==true ? styles.smallText : {display:'none'}}>주일의 독서</Text>  
         <View style={this.state.js2 !== "" ? {marginTop:10} : {display:'none'}}>
          <Text style={[styles.lectioText, normalSize]}><Text style={{color:"#495057"}}>이 복음의 등장인물은</Text> {this.state.bg1}</Text>
          <Text style={[styles.lectioText, normalSize]}><Text style={{color:"#495057"}}>장소는</Text> {this.state.bg2}</Text>
          <Text style={[styles.lectioText, normalSize]}><Text style={{color:"#495057"}}>시간은</Text> {this.state.bg3}</Text>
          <Text style={[styles.lectioText, normalSize]}><Text style={{color:"#495057"}}>이 복음의 내용을 간추리면</Text> {this.state.sum1}</Text>
          <Text style={[styles.lectioText, normalSize]}><Text style={{color:"#495057"}}>특별히 눈에 띄는 부분은</Text> {this.state.sum2}</Text>
          <Text style={[styles.lectioText, normalSize]}><Text style={{color:"#495057"}}>이 복음에서 보여지는 예수님은</Text> {this.state.js1}</Text>
          <Text style={this.state.question !== null ? styles.lectioText : {display:'none'}}><Text style={{color:"#495057"}}>{this.state.question}</Text> {this.state.answer}</Text>
          <Text style={[styles.lectioText, normalSize]}><Text style={{color:"#495057"}}>결과적으로 이 복음을 통해 예수님께서 내게 해주시는 말씀은</Text> "{this.state.js2}"</Text>
         </View>
         <Text style={this.state.mysentence !== "" ? [styles.lectioText, normalSize] : {display:'none'}}><Text style={{color:"#495057"}}>주일 복음에서 묵상한 구절은</Text> {this.state.mysentence}</Text>
         
           <View style={!this.state.selectedDay && this.state.js2!="" ? {} : {display:'none'}}>
           <TouchableOpacity 
               activeOpacity = {0.9}
               style={styles.Button}
               onPress={() =>  this.props.navigation.navigate('Main3_2', {otherParam: this.state.selectedDate}) } 
               >
               <Text style={{color:"#fff", textAlign:'center'}}>
               거룩한 독서 편집
               </Text>
           </TouchableOpacity>          
          </View>
           <View style={this.state.selectedDay && this.state.js2!="" ? {} : {display:'none'}}>
           <TouchableOpacity 
               activeOpacity = {0.9}
               style={styles.Button}
               onPress={() => this.props.navigation.navigate('Main4_2', {otherParam: this.state.selectedDate}) } 
               >
               <Text style={{color:"#fff", textAlign:'center'}}>
               주일의 독서 편집
               </Text>
           </TouchableOpacity> 
           </View>            
         
         
           <View>   
             <View style={!this.state.selectedDay && this.state.js2=="" ? {} : {display:'none'}}>
             <TouchableOpacity 
                 activeOpacity = {0.9}
                 style={styles.Button}
                 onPress={() => this.props.navigation.navigate('Main3_2', {otherParam: this.state.selectedDate}) } 
                 >
                 <Text style={{color:"#fff", textAlign:'center'}}>
                 거룩한 독서 하러가기
                 </Text>
             </TouchableOpacity> 
             </View>
             <View style={this.state.selectedDay && this.state.js2=="" ? {} : {display:'none'}}>
             <TouchableOpacity 
                 activeOpacity = {0.9}
                 style={styles.Button}
                 onPress={() => this.props.navigation.navigate('Main4_2', {otherParam: this.state.selectedDate}) } 
                 >
                 <Text style={{color:"#fff", textAlign:'center'}}>
                 주일의 독서 하러가기
                 </Text>
             </TouchableOpacity> 
             </View>
           </View> 
         
           </ScrollView>  
           
     )
  
   
   
      
 }
}
Sub5.propTypes = { 
   status: PropTypes.shape({
       isLogged: PropTypes.bool,
       loginId: PropTypes.string
   })
 };
 
const styles = StyleSheet.create({

   MainContainer :{     
   justifyContent: 'center',
   flex:1,
   margin: 10,
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
    smallText: {
     color: "#01579b",
     textAlign: 'center', 
     fontSize: 12,
     margin:  5,
     marginTop: 20
    },
    lectioText:{
      color: "#000", 
      fontSize: 14,
      padding: 5},
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
      backgroundColor: '#01579b', 
      padding: 10, 
      marginTop:10,
      marginBottom:5, 
      width:'100%'}
   });