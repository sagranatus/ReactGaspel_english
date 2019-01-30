
import React, { Component } from 'react'; 
import { StyleSheet, TextInput, View, Alert, Button, Text } from 'react-native';
import {PropTypes} from 'prop-types';
import { openDatabase } from 'react-native-sqlite-storage';
var db = openDatabase({ name: 'UserDatabase.db' });


export default class RegisterUser extends Component {
static navigationOptions =  ({ navigation }) => {
    return {
    headerLeft: (
        <Button
        onPress={() =>{
            navigation.navigate('FirstPage', {});} }
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
      UserEmail: '',
      UserName: '',
      UserCatholicName: '',
      UserAge: '',
      UserRegion: '',
      UserCathedral: '',
      UserId: '',
      UserPassword: '' 
    } 
  }

// 등록하기 클릭시 이벤트
UserRegistrationFunction = () =>{
 
 const { UserEmail }  = this.state ;
 const { UserName }  = this.state ;
 const { UserCatholicName }  = this.state ;
 const { UserAge }  = this.state ;
 const { UserRegion }  = this.state ;
 const { UserCathedral }  = this.state ;
 const { UserPassword }  = this.state ; 
 const {UserId} = this.state ; 
 
  // 서버에 데이터 전송
fetch('https://sssagranatus.cafe24.com/servertest/user_registration.php', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    name: UserName,     
    email: UserEmail,
    christ_name: UserCatholicName,
    age: UserAge,
    region: UserRegion,
    cathedral: UserCathedral,
    id: UserId, 
    password: UserPassword 
  })
 
}).then((response) => response.json())
      .then((responseJson) => {
       if(responseJson.success === 'SUCCESS')
       {             
         
        console.log('RegisterUser - registration success : ', responseJson.id);
        const setLogin = this.props.setLogin
        const navigation = this.props.navigation
       // 데이터베이스에 삽입!
        db.transaction(function(tx) {
          tx.executeSql(
            'INSERT INTO users (uid, user_id, email, name, christ_name, age, region, cathedral, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
            [responseJson.id, UserId, UserEmail, UserName, UserCatholicName, UserAge, UserRegion, UserCathedral, "now"],
            (tx, results) => {
             // console.log('Results', results.rowsAffected);
              if (results.rowsAffected > 0) {                
                console.log('RegisterUser - DB inserted : ', responseJson.id);
                if(setLogin){
                  setLogin(responseJson.id)
                  }
                  navigation.navigate('FirstPage', {});        
             
              } else {
                console.log('RegisterUser - DB inserting failed : ', responseJson.id);
              }
            }
          );
        });

       
      } else{ 
        console.log('RegisterUser - registration failed : ', responseJson.success);
      }
       
      }).catch((error) => {
        console.error(error);
      });
 
  }
  GoLoginFunction = () =>{
   this.props.navigation.navigate('LoginUser', {});
  }
 
  render() {
    return ( 
        <View style={styles.MainContainer}>      
        <Button title="Click Here To Login" onPress={this.GoLoginFunction} color="#2196F3" />    
                <Text style= {{ fontSize: 20, color: "#000", textAlign: 'center', marginBottom: 15 }}>User Registration Form</Text>        
               
                <TextInput                
                placeholder="Enter User Email"        
                onChangeText={UserEmail => this.setState({UserEmail})}     
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />        
                 <TextInput                
                placeholder="Enter User Id"        
                onChangeText={UserId => this.setState({UserId})}    
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                 <TextInput                
                placeholder="Enter User Name"        
                onChangeText={UserName => this.setState({UserName})}  
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                 <TextInput                
                placeholder="Enter User Catholic Name"        
                onChangeText={UserCatholicName => this.setState({UserCatholicName})}        
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                 <TextInput                
                placeholder="Enter User Age"        
                onChangeText={UserAge => this.setState({UserAge})}    
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                 <TextInput                
                placeholder="Enter User Region"        
                onChangeText={UserRegion => this.setState({UserRegion})}       
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                 <TextInput                
                placeholder="Enter User Cathedral"        
                onChangeText={UserCathedral => this.setState({UserCathedral})}
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                <TextInput                
                placeholder="Enter User Password"        
                onChangeText={UserPassword => this.setState({UserPassword})}     
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}        
                secureTextEntry={true}
                /> 
                <Button title="Click Here To Register" onPress={this.UserRegistrationFunction} color="#2196F3" />  
                
        </View>
            
    );
  }
}
 
RegisterUser.propTypes = { 
  setLogin:PropTypes.func,
  status: PropTypes.shape({
    isLogged: PropTypes.bool,
    loginId: PropTypes.string
})
};

const styles = StyleSheet.create({
 
MainContainer :{
 
justifyContent: 'center',
flex:1,
margin: 10
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
 
