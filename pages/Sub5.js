
import React, { Component } from 'react'; 
import { StyleSheet, View, Button, Text, ScrollView, Image, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });
import {NavigationEvents} from 'react-navigation'

export default class Sub5 extends Component {

constructor(props) { 
    super(props) 
    this.state = {
  selectedDate: "",
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
  buttonStatus: "sentence",
  showButton1: false,
  showButton2: false
  }
  }

componentWillMount(){
 

  console.log("Sub5 - componentWillMount")
    const { params } = this.props.navigation.state;
   // console.log(params.otherParam)
  
    if(params != null){
        console.log("Sub5 - params : ", params )      
    }

    const date = params.otherParam
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
                  onesentence: results.rows.item(0).onesentence,
                  showButton1: true,
                  showButton2: true
                })
            } else {  
              this.setState({
                Comment: "",
                onesentence: "",
                showButton1: false,
                showButton2: false
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
                showButton1: true,
                showButton2: true
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
                showButton3: false
              })        
              if(this.state.Comment == ""){
                this.setState({
                  onesentence: "",
                  showButton1: false
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
                  selectedDay:true
                })
              } else {          
                          
              }
            }
          );
        }else{
          this.setState({
            mysentence:"",
            mythought:"",
            selectedDay:false
          })  
        }
      
      });    
    

    }

    refreshContents(){
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
                    showButton1: true,
                    showButton2: true
                  })
              } else {  
                this.setState({
                  Comment: "",
                  onesentence: "",
                  showButton1: false,
                  showButton2: false
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
                  showButton1: true,
                  showButton2: true
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
                  showButton3: false
                })        
                if(this.state.Comment == ""){
                  this.setState({
                    onesentence: "",
                    showButton1: false
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
                    selectedDay:true
                  })
                } else {          
                            
                }
              }
            );
          }else{
            this.setState({
              mysentence:"",
              mythought:"",
              selectedDay:false
            })  
          }
        
        });    
      
    }

 
  render() {
    return ( 
      <ScrollView>   
      <NavigationEvents
        onWillFocus={payload => {
          this.refreshContents()
        }}
        />
         <TouchableOpacity
              activeOpacity = {0.9}
              style={{backgroundColor: '#01579b', padding: 10}}
              onPress={() =>  this.props.navigation.navigate('나의기록', {otherParam: this.state.selectedDate})} 
              >
              <Text style={{color:"#FFF", textAlign:'left'}}>
                  {"<"} BACK
              </Text>
          </TouchableOpacity>      
          <Text style={{ color: "#01579b", textAlign: 'center', fontSize:15, marginTop:20 }}>{this.state.selectedDate_format}</Text>
         
         <View>   
           <Text style={this.state.onesentence !== "" ? styles.smallText : {display:'none'}}>그날의 복음 말씀</Text>     
           <Text style={{color: "#01579b", textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginTop:10}}>{this.state.onesentence}</Text>              
         </View>

         <View>   
           
           <View style={!this.state.selectedDay && this.state.Comment!="" ? {marginTop:20} : {display:'none'}}>
           <Text style={styles.smallText}>말씀새기기</Text>   
           <Text style={{ fontSize: 14, color: "#000", marginTop: 10, marginBottom: 10, textAlign: 'center'}}>{this.state.Comment}</Text>
           <TouchableOpacity 
             activeOpacity = {0.9}
             style={{backgroundColor: '#01579b', padding: 10}}
             onPress={() =>  this.props.navigation.navigate('Main2_2', {otherParam: this.state.selectedDate}) } 
             >
             <Text style={{color:"#fff", textAlign:'center'}}>
             말씀새기기 편집
             </Text>
           </TouchableOpacity>
           </View>    
          
         </View>
           
         
         <Text style={this.state.js2!=""&&this.state.selectedDay==false ? styles.smallText : {display:'none'}}>거룩한 독서</Text> 
         <Text style={this.state.js2!=""&&this.state.selectedDay==true ? styles.smallText : {display:'none'}}>주일의 독서</Text>  
         <View style={this.state.js2 !== "" ? {marginTop:10} : {display:'none'}}>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>이 복음의 등장인물은</Text> {this.state.bg1}</Text>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>장소는</Text> {this.state.bg2}</Text>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>시간은</Text> {this.state.bg3}</Text>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>이 복음의 내용을 간추리면</Text> {this.state.sum1}</Text>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>특별히 눈에 띄는 부분은</Text> {this.state.sum2}</Text>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>이 복음에서 보여지는 예수님은</Text> {this.state.js1}</Text>
          <Text style={styles.lectioText}><Text style={{color:"#495057"}}>결과적으로 이 복음을 통해 예수님께서 내게 해주시는 말씀은</Text> "{this.state.js2}"</Text>
         </View>
         <Text style={this.state.mysentence !== "" ? styles.lectioText : {display:'none'}}><Text style={{color:"#495057"}}>주일 복음에서 묵상한 구절은</Text> {this.state.mysentence}</Text>

           <View style={!this.state.selectedDay && this.state.bg1!="" ? {} : {display:'none'}}>
           <TouchableOpacity 
               activeOpacity = {0.9}
               style={{backgroundColor: '#01579b', padding: 10, marginTop: 20}}
               onPress={() =>  this.props.navigation.navigate('Main3_2', {otherParam: this.state.selectedDate}) } 
               >
               <Text style={{color:"#fff", textAlign:'center'}}>
               거룩한 독서 편집
               </Text>
           </TouchableOpacity>          
          </View>
           <View style={this.state.selectedDay && this.state.bg1!="" ? {} : {display:'none'}}>
           <TouchableOpacity 
               activeOpacity = {0.9}
               style={{backgroundColor: '#01579b', padding: 10, marginTop: 20}}
               onPress={() => this.props.navigation.navigate('Main4_2', {otherParam: this.state.selectedDate}) } 
               >
               <Text style={{color:"#fff", textAlign:'center'}}>
               주일의 독서 편집
               </Text>
           </TouchableOpacity> 
           </View>            
         
         
           <View>
             <View style={!this.state.selectedDay && this.state.Comment=="" ? {} : {display:'none'}}>
             <TouchableOpacity 
                 activeOpacity = {0.9}
                 style={{backgroundColor: '#01579b', padding: 10}}
                 onPress={() => this.props.navigation.navigate('Main2_2', {otherParam: this.state.selectedDate}) } 
                 >
                 <Text style={{color:"#fff", textAlign:'center'}}>
                 말씀새기기 하러가기
                 </Text>
             </TouchableOpacity> 
             </View>      
             <View style={!this.state.selectedDay && this.state.bg1=="" ? {} : {display:'none'}}>
             <TouchableOpacity 
                 activeOpacity = {0.9}
                 style={{backgroundColor: '#01579b', padding: 10}}
                 onPress={() => this.props.navigation.navigate('Main3_2', {otherParam: this.state.selectedDate}) } 
                 >
                 <Text style={{color:"#fff", textAlign:'center'}}>
                 거룩한 독서 하러가기
                 </Text>
             </TouchableOpacity> 
             </View>
             <View style={this.state.selectedDay && this.state.bg1=="" ? {} : {display:'none'}}>
             <TouchableOpacity 
                 activeOpacity = {0.9}
                 style={{backgroundColor: '#01579b', padding: 10}}
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
    
    TextComponentStyle: {
      fontSize: 20,
     color: "#000",
     textAlign: 'center', 
     marginBottom: 15
    },
     
    smallText: {
     color: "#01579b",
     textAlign: 'center', 
     fontSize: 11,
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
     }
   });