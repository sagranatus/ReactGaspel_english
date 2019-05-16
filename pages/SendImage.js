import ViewShot from "react-native-view-shot";
import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import { Text, Image, View, TouchableOpacity, PermissionsAndroid, StyleSheet} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import Share, {ShareSheet, Button} from 'react-native-share';
import RNKakaoLink from 'react-native-kakao-links';
import fs from 'react-native-fs';
var db = openDatabase({ name: 'UserDatabase.db' });
import RNFetchBlob from "rn-fetch-blob";
const linkObject={
  webURL                :'https://developers.kakao.com/docs/android/kakaotalk-link',//optional
  mobileWebURL          :'https://developers.kakao.com/docs/android/kakaotalk-link',//optional
 // androidExecutionParams:'shopId=1&itemId=24', //optional For Linking URL
 // iosExecutionParams    :'shopId=1&itemId=24', //optional For Linking URL
};



//5개의 속성 중 최대 3개만 표시해 줍니다. 우선순위는 Like > Comment > Shared > View > Subscriber 입니다.
const socialObject ={
  likeCount:12,//optional
  commentCount:1,//optional
  sharedCount:23,//optional
  viewCount:10,//optional
  subscriberCount:22//optional
}

const buttonObject = {
  title:'',//required
  link : linkObject,//required
}

export default class SendImage extends Component {
  constructor(props) { 
      super(props)         
      this.state = {
          uri: null,
          js2: "",
          sendVal: "saea",
          visible: false
      }
      this.saveImage = this.saveImage.bind(this);
      this.getData = this.getData.bind(this);
      this.linkFeed= this.linkFeed.bind(this);
  }
  componentWillMount () {
    var date = new Date();
    var changed = this.changeDateFormat(date)
    // 오늘 DB값을 가져옴
    this.getData(changed)  
      
  }
  getData(today){ 
    console.log("SendImage - getData")
    const loginId = this.props.status.loginId    
    console.log(today+loginId)
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM comment where date = ? and uid = ?',
          [today, loginId],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {                  
                console.log('Main1 - check Comment data : ', results.rows.item(0).comment)   
                this.setState({
                    comment: results.rows.item(0).comment
                })
            } else {  
              console.log("nono")      
                this.setState({
                    comment: ""
                })                             
            }
          }
        ),
        tx.executeSql(
          'SELECT * FROM lectio where date = ? and uid = ?',
          [today,loginId],
          (tx, results) => {
              var len = results.rows.length;
              if (len > 0) {                  
                  console.log('SendImage - check Lectio data : ', results.rows.item(0).js2) 
                  this.setState({
                      Sentence: results.rows.item(0).onesentence,
                      js2 : results.rows.item(0).js2
                  })
              } else {   
                console.log("nono")             
                  this.setState({
                      js2 : ""
                  })                   
              }
          }
          ), 
          tx.executeSql(
            'SELECT * FROM weekend where date = ? and uid = ?',
            [today,loginId],
            (tx, results) => {
                var len = results.rows.length;
                if (len > 0) {                  
                    console.log('Main1 - check Weekend data : ', results.rows.item(0).mysentence) 
                    this.setState({
                        mysentence : results.rows.item(0).mysentence,
                        initialLoading:false
                    })
                } else {               
                    this.setState({
                        mysentence : "",
                        initialLoading:false
                    })                   
                }
            }
          )
      }); 
  
  }
 
  saveImage(){
    try {
      const granted = PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome picntures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
      this.refs.viewShot.capture().then(uri => {
          console.log("do something with ", uri);
         // alert(uri);
          this.setState({uri: uri})        
          let dirs = RNFetchBlob.fs.dirs;
          console.log(dirs.DCIMDir)
          //this.setState({uri2: "/data/data"+this.state.uri.substring(19, uri.length)})
          RNFetchBlob.fs.cp(uri, dirs.DCIMDir+"/sendimg.png")
          .then(() => { 
           /* RNFetchBlob.config({
              fileCache: true
            })
              .fetch("GET", "http://sssagranatus.cafe24.com/resource/slide1.png")
              // the image is now dowloaded to device's storage
              .then(resp => {
                // the image path you can use it directly with Image component
                imagePath = resp.path();
                return resp.readFile("base64");
              })
              .then(base64Data => {
                // here's base64 encoded image
                console.log(base64Data);
                this.setState({sendVal: base64Data})
                // remove the file from storage
                return fs.unlink(imagePath);
              });*/
              fs.readFile(this.state.uri, 'base64')
              .then(res =>{
                console.log(res);
                this.setState({sendVal: res})
              });
           })
          .catch((error) => { 
            alert(error) 
          })
      });

     


  }

  linkFeed = async () => {
   
    try{
      let dirs = RNFetchBlob.fs.dirs;
      const options = {
     /*   objectType:'feed',//required
        content:contentObject,//required
       // social:socialObject,//optional
        buttons:[buttonObject]//optional*/
        objectType:'image',
        url: dirs.DCIMDir+"/sendimg.png"
      };
      const response = await RNKakaoLink.link(options);
      console.log(response);
     // alert(response);
      if(response !== null){
        var image = response.argumentMsg;
        const contentObject = {
          title     : "오늘의복음을 해보았습니다.",
          link      : linkObject,
          imageURL  : image,
          imageFile: this.state.uri,
          desc      : "하느님 말씀을 들으니 참 좋네요~ 한번 써보세요~!",//optional
          imageWidth: 300,//optional
          imageHeight:150//optional
          }

          try{
            let dirs = RNFetchBlob.fs.dirs;
            const options = {
              objectType:'feed',//required
              content:contentObject,//required
             // social:socialObject,//optional
              buttons:[buttonObject]//optional
            };
            const response = await RNKakaoLink.link(options);
            console.log(response);
          }catch(e){
            console.warn(e);
          }
      }
      
    }catch(e){
      console.warn(e);
    }
  }

changeDateFormat(date){
  var year = date.getFullYear();
  var month = date.getMonth()+1
  var day = date.getDate();
  if(month < 10){
      month = "0"+month;
  }
  if(day < 10){
      day = "0"+day;
  } 
  var date_changed = year+"년 "+month+"월 "+day+"일 "+ this.getTodayLabel( new Date(date))
  console.log(date_changed)
  return date_changed

}
getTodayLabel(date) {        
  var week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');        
  var todayLabel = week[date.getDay()];        
  return todayLabel;
}
render() {
 
  let shareImageBase64 = {
    title: "오늘의복음",
    message: "오늘의 복음 앱을 사용해서 하느님 말씀을 들어보세요!",
    url: "data:image/png;base64,"+this.state.sendVal,
    subject: "오늘의복음에 대한 나의 묵상" //  for email
  };
  
  return (
    <View
    style={{
      flex: 1,
      paddingTop: 0,
      backgroundColor: 'white'
    }}>      
      <TouchableOpacity
        activeOpacity = {0.9}
        style={{backgroundColor: '#01579b', padding: 10}}
        onPress={ () =>  this.props.navigation.navigate('Main1')}
        >
        <Text style={{color:"#FFF", textAlign:'left'}}>
            {"<"} 뒤로
        </Text>
      </TouchableOpacity>   
    <View
    style={{
      alignItems: 'center'
    }}
    > 
    <ViewShot ref="viewShot" options={{ format: "jpg", quality: 1 }} style={{alignItems: 'center',backgroundColor:'white', borderRadius: 4, borderWidth: 0.5, borderColor: '#d6d7da', width:300, height:150}}>
      <Image source={this.state.backgroundImage} style={{width: '100%', height:150}} ImageResizeMode={'center'} />  
      <View style={{position: 'absolute', top:'18%', color:'white',alignItems: 'center', padding:10}}>
      <Text style={{fontSize:16,color:'white', textAlign:'center'}}>{this.state.Sentence}</Text>
      <Text style={{fontSize:15,color:'white', textAlign:'center',marginTop:10}}>{this.state.js2}</Text>
      </View>
    </ViewShot>
    </View>
    <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop: 10}}>
      <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 70, marginTop:10}} onPress={()=>this.setState({backgroundImageName:'pray1_img.png' ,backgroundImage: require('../resources/pray1_img.png')})}>
       <Image source={require('../resources/pray1_img.png')} style={{width: 70, height: 70}} />      
      </TouchableOpacity>        
      <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 70, marginTop:10}} onPress={()=>this.setState({backgroundImageName:'pray2_img.png' , backgroundImage: require('../resources/pray2_img.png')})}>
        <Image source={require('../resources/pray2_img.png')} style={{width: 70, height: 70}} />          
      </TouchableOpacity> 
      <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 70, marginTop:10}} onPress={()=>this.setState({backgroundImageName:'weekend_img1.png', backgroundImage: require('../resources/weekend_img1.png')})}>
        <Image source={require('../resources/weekend_img1.png')} style={{width: 70, height: 70}} />  
        </TouchableOpacity>
    </View>

    <TouchableOpacity 
        activeOpacity = {0.9}
        onPress={() => this.saveImage() } 
        >    
            <Text>Save</Text>      
      </TouchableOpacity>    
   
      <Image source={this.state.uri !== null ? {uri: this.state.uri} : {}} style={{width: '100%', height: 120}} resizeMode={"contain"}/>  
      <View style={{width:'100%', justifyContent: 'center',  alignItems: 'center', marginTop:10, marginBottom: 20, padding:10}}>
      <TouchableOpacity 
        activeOpacity = {0.9}
        style={styles.Button}
        onPress={() => this.linkFeed() }>    
            <Text style={{color:"#fff", textAlign:'center'}}>카카오톡 보내기</Text>      
      </TouchableOpacity>    

          <TouchableOpacity 
           style={styles.Button}
           onPress={()=>{
          Share.open(shareImageBase64);
        }}>
            <Text style={{color:"#fff", textAlign:'center'}}>이미지 전달하기</Text>
        </TouchableOpacity> 
      </View>
  </View>
  );
}
}

SendImage.propTypes = { 
  status: PropTypes.shape({
      isLogged: PropTypes.bool,
      loginId: PropTypes.string
  })
};
const styles = StyleSheet.create({
    Button:{
      textAlign:'center',
      backgroundColor: '#01579b', 
      padding: 10, 
      marginTop:10,
      width:200,
      borderRadius: 10,
      height:40}
    });