import ViewShot from "react-native-view-shot";
import React, { Component } from 'react';
import {PropTypes} from 'prop-types';
import { Text, Image, View, TouchableOpacity, PermissionsAndroid, StyleSheet, Dimensions, Button} from 'react-native';
import { SelectMultipleGroupButton } from 'react-native-selectmultiple-button'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { openDatabase } from 'react-native-sqlite-storage';
import Share, {ShareSheet} from 'react-native-share';
import RNKakaoLink from 'react-native-kakao-links';
import {NavigationEvents} from 'react-navigation'
import fs from 'react-native-fs';
import RNFetchBlob from "rn-fetch-blob";
import ColorPalette from 'react-native-color-palette'
import Icon from 'react-native-vector-icons/FontAwesome'

import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon4 from 'react-native-vector-icons/Feather'
import Icon5 from 'react-native-vector-icons/AntDesign'

var db = openDatabase({ name: 'UserDatabase.db' });
const linkObject={
  webURL                :'https://developers.kakao.com/docs/android/kakaotalk-link',//optional
  mobileWebURL          :'https://developers.kakao.com/docs/android/kakaotalk-link',//optional
 // androidExecutionParams:'shopId=1&itemId=24', //optional For Linking URL
 // iosExecutionParams    :'shopId=1&itemId=24', //optional For Linking URL
};

var selectedval;
var from;
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
          visible: false,
          fontColor: '#286F92',
          index: 0,
          routes: [
            { key: 'second', title: '배경선택', out: true },
            { key: 'third', title: '글씨색상 선택' }
          ],
          out: false,
          weekend: false,
          backgroundWhite: false
      }
      this.saveImage = this.saveImage.bind(this);
      this.getData = this.getData.bind(this);
      this.linkFeed= this.linkFeed.bind(this);
  }
 
  componentWillMount () {

    const { params } = this.props.navigation.state;
    // console.log(params.otherParam)
    
    if(params != null){
    console.log("Main1 - params : ", params+"existed" )
        date = params.otherParam2
        from = params.otherParam
        this.getData(date)  
    }
    /*
    var date = new Date();    
    this.getData("오늘의복음")  
    selectedval = [0]
    if(date.getDay() == 0){
      this.setState({weekend:true})
    }
    */
    
  this.setState({backgroundImageName:'el1.png', backgroundImage: require('../resources/el1.png')})
    
  }
  getData(date){      
    var selectedday = date
    console.log("SendImage - getData")
    const loginId = this.props.status.loginId    
    console.log(selectedday+loginId)
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM comment where date = ? and uid = ?',
          [selectedday, loginId],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {                  
                console.log('Main1 - check Comment data : ', results.rows.item(0).comment)   
                this.setState({
                   Sentence_comment: results.rows.item(0).onesentence,
                    comment: results.rows.item(0).comment,
                    date_comment: results.rows.item(0).date
                })
            } else {  
              console.log("nono")      
                this.setState({
                    Sentence_comment: "",
                    comment: "",
                    date_comment: ""
                })                             
            }
          }
        ),
        tx.executeSql(
          'SELECT * FROM lectio where date = ? and uid = ?',
          [selectedday,loginId],
          (tx, results) => {
              var len = results.rows.length;
              if (len > 0) {                  
                  console.log('SendImage - check Lectio data : ', results.rows.item(0).js2) 
                  this.setState({
                      Sentence: results.rows.item(0).onesentence,
                      js2 : results.rows.item(0).js2,
                      date: results.rows.item(0).date
                  })
              } else {   
                console.log("nono")             
                  this.setState({
                    Sentence: "",
                      js2 : "",
                      date:""
                  })                   
              }
          }
          ), 
          tx.executeSql(
            'SELECT * FROM weekend where date = ? and uid = ?',
            [selectedday,loginId],
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

  saveImage1(){    
    this.refs.viewShot.capture().then(uri => {
      console.log("do something with ", uri);
     // alert(uri);
      this.setState({uri: uri})        
      fs.readFile(this.state.uri, 'base64')
      .then(res =>{
        console.log(res);
        this.setState({sendVal: res})
        Share.open({
          title: "오늘의복음",
          message: "오늘의 복음 앱을 사용해서 하느님 말씀을 들어보세요!",
          url: "data:image/png;base64,"+res,
          subject: "오늘의복음에 대한 나의 묵상" //  for email
        });
      })
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

              this.linkFeed() 
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
          imageHeight:200//optional
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

setChange(){
  const { params } = this.props.navigation.state;
  // console.log(params.otherParam)
  
  if(params != null){
  console.log("Main1 - params : ", params+"existed" )
      date = params.otherParam2
      from = params.otherParam
      this.getData(date)  
  }
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
     <NavigationEvents
      onWillFocus={payload => {console.log(payload),
        this.setChange();
      }} />
      <TouchableOpacity
        activeOpacity = {0.9}
        style={{backgroundColor: '#01579b', padding: 10}}
        onPress={ () =>  this.props.navigation.navigate(from)}
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
    <ViewShot ref="viewShot" options={{ format: "jpg", quality: 1 }} style={{alignItems: 'center', width:300, height:200, marginTop:10}}>
      <Image source={this.state.backgroundImage} style={{width: 300, height:200, borderRadius:0, borderWidth: 1, borderColor: '#535454'}} ImageResizeMode={'center'} />  
      <View style={this.state.backgroundWhite ? {position: 'absolute', top:'3%', color:'white',alignItems: 'center', padding:10, borderColor:"#fff", borderWidth:0.5, margin:10, width: 270, height:170} :  {position: 'absolute', top:'3%', color:'white',alignItems: 'center', padding:10, margin:10, width: 270, height:170} }>
      <View style={this.state.backgroundWhite ? {padding:10, backgroundColor:'rgba(256,256,256, 0.5)', width: 250, height:150,  justifyContent: 'center', alignItems: 'center'} : {padding:10, width: 250, height:150,  justifyContent: 'center', alignItems: 'center'}}>
   
      <Text style={this.state.comment=="" ? {fontSize:16,color:this.state.fontColor, textAlign:'center'} : {display:'none'}}>{this.state.Sentence}</Text>
      <Text style={this.state.comment!=="" ? {fontSize:16,color:this.state.fontColor, textAlign:'center'} : {display:'none'}}>{this.state.Sentence_comment}</Text>
      <Text style={this.state.comment!=="" && this.state.js2 =="" ? {fontSize:14,color:'black', textAlign:'center',marginTop:10} : {display:'none'}}>{this.state.comment}</Text>
      <Text style={this.state.js2 !=="" ? {fontSize:14,color:'black', textAlign:'center',marginTop:10} : {display:'none'}}>{this.state.js2}</Text>

      <Text style={this.state.comment==!"" ? {fontSize:12,color:'black', textAlign:'right', marginTop:3} : {display:'none'}}>__{this.state.date_comment} 복음 묵상</Text>
      <Text style={this.state.js2 !=="" ? {fontSize:12,color:'black', textAlign:'right', marginTop:3} : {display:'none'}}>__{this.state.date} 복음 묵상</Text>
      </View>
      </View>
    </ViewShot>
    </View>
    <TabView
        navigationState={this.state}
        renderScene={SceneMap({
          first: () => (
            <View>
            
            </View>
          ),
          second: () => (
            <View style={{flex: 1, flexWrap: 'wrap', justifyContent: 'center'}}>
              <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop: 10, width:'100%'}}>
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'cd1.png' ,backgroundImage: require('../resources/cd1.png'), backgroundWhite: true})}>
                <Image source={require('../resources/cd1.png')} style={{width: 70, height: 48}} />      
                </TouchableOpacity>        
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'cd2.png' , backgroundImage: require('../resources/cd2.png'), backgroundWhite: true})}>
                  <Image source={require('../resources/cd2.png')} style={{width: 70, height: 48}} />          
                </TouchableOpacity> 
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'cd3.png', backgroundImage: require('../resources/cd3.png'), backgroundWhite: true})}>
                <Image source={require('../resources/cd3.png')} style={{width: 70, height: 48}} />  
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'cd4.png', backgroundImage: require('../resources/cd4.png'), backgroundWhite: true})}>
                <Image source={require('../resources/cd4.png')} style={{width: 70, height: 48}} />  
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'cd10.png', backgroundImage: require('../resources/cd10.png'), backgroundWhite: true})}>
                <Image source={require('../resources/cd10.png')} style={{width: 70, height: 48}} />  
                </TouchableOpacity>
              </View>   
              <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop: 10, width:'100%'}}>
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'cd5.png' ,backgroundImage: require('../resources/cd5.png'), backgroundWhite: true})}>
                <Image source={require('../resources/cd5.png')} style={{width: 70, height: 48}} />      
                </TouchableOpacity>        
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'cd6.png' , backgroundImage: require('../resources/cd6.png'), backgroundWhite: true})}>
                  <Image source={require('../resources/cd6.png')} style={{width: 70, height: 48}} />          
                </TouchableOpacity> 
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'cd7.png', backgroundImage: require('../resources/cd7.png'), backgroundWhite: true})}>
                <Image source={require('../resources/cd7.png')} style={{width: 70, height: 48}} />  
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'cd8.png', backgroundImage: require('../resources/cd8.png'), backgroundWhite: true})}>
                <Image source={require('../resources/cd8.png')} style={{width: 70, height: 48}} />  
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'cd11.png', backgroundImage: require('../resources/cd11.png'), backgroundWhite: true})}>
                <Image source={require('../resources/cd11.png')} style={{width: 70, height: 48}} />  
                </TouchableOpacity>
              </View>    
              <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop: 10, width:'100%'}}>
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'el1.png' ,backgroundImage: require('../resources/el1.png'), backgroundWhite: false})}>
                <Image source={require('../resources/el1.png')} style={{width: 70, height: 48}} />      
                </TouchableOpacity>        
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'el2.png' , backgroundImage: require('../resources/el2.png'), backgroundWhite: false})}>
                  <Image source={require('../resources/el2.png')} style={{width: 70, height: 48}} />          
                </TouchableOpacity> 
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'el3.png', backgroundImage: require('../resources/el3.png'), backgroundWhite: false})}>
                <Image source={require('../resources/el3.png')} style={{width: 70, height: 48}} />  
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'el4.png', backgroundImage: require('../resources/el4.png'), backgroundWhite: false})}>
                <Image source={require('../resources/el4.png')} style={{width: 70, height: 48}} />  
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'el5.png', backgroundImage: require('../resources/el5.png'), backgroundWhite: false})}>
                <Image source={require('../resources/el5.png')} style={{width: 70, height: 48}} />  
                </TouchableOpacity>
              </View>  
              <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', marginTop: 10, width:'100%'}}>
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'el6.png' ,backgroundImage: require('../resources/el6.png'), backgroundWhite: false})}>
                <Image source={require('../resources/el6.png')} style={{width: 70, height: 48}} />      
                </TouchableOpacity>        
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'el7.png' , backgroundImage: require('../resources/el7.png'), backgroundWhite: false})}>
                  <Image source={require('../resources/el7.png')} style={{width: 70, height: 48}} />          
                </TouchableOpacity> 
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'el8.png', backgroundImage: require('../resources/el8.png'), backgroundWhite: false})}>
                <Image source={require('../resources/el8.png')} style={{width: 70, height: 48}} />  
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'el9.png', backgroundImage: require('../resources/el9.png'), backgroundWhite: false})}>
                <Image source={require('../resources/el9.png')} style={{width: 70, height: 48}} />  
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection: "column", flexWrap: 'wrap', width: 70, height: 48}} onPress={()=>this.setState({backgroundImageName:'el10.png', backgroundImage: require('../resources/el10.png'), backgroundWhite: false})}>
                <Image source={require('../resources/el10.png')} style={{width: 70, height: 48}} />  
                </TouchableOpacity>
              </View>  
            </View>   
          
          ),
          third: () => (
            <View style={{flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center', margin: 20}}>                        
              <ColorPalette
                onChange={color => [this.setState({fontColor: color})] }
                value={this.state.fontColor}
                colors={['#286F92', '#0B614B', '#1abc9c', '#3498db', '#0489B1', '#34495e', '#C0392B', '#E74C3C', '#8A084B', '#4B088A', '#6E6E6E', '#000']}
                title={""}
                icon={
                  <Icon name={'check-circle-o'} size={25} color={'black'} />
                // React-Native-Vector-Icons Example
              }
              />
            </View>
          )
        })} 
        
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width, height: 250}}
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
       <View style={{backgroundColor: "#fff", flexDirection: "row", flexWrap: 'wrap', justifyContent: 'center',   alignItems: 'center',  paddingBottom:5,  borderBottomColor:"#d8d8d8", borderBottomWidth:0.5}}>  
        <View style={{flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center',   alignItems: 'center',  width: '50%', height: 30, marginTop:5}}>
        <TouchableOpacity 
          activeOpacity = {0.9}
          onPress={() => this.saveImage1()} 
          >  
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#686868'}]}> <Icon4 name={'book-open'} size={18} color={"#000"} style={{paddingTop:9}} />  복음카드 공유하기</Text>   
        </TouchableOpacity>
        </View>   
        <View style={{flexDirection: "column", flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center',  width: '50%', height: 30, marginTop:5}}>
        <TouchableOpacity 
          activeOpacity = {0.9}
          onPress={() => this.saveImage()} 
          >  
          <Text style={[ styles.TextStyle, {fontSize:14, textAlign:'center', color:'#686868'}]}><Icon name={'send-o'} size={18} color={"#000"} style={{paddingTop:9}} />  카카오톡 보내기</Text>   
          </TouchableOpacity>
        </View>   
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