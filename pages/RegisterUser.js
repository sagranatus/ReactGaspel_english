
import React, { Component } from 'react'; 
import { AppRegistry, StyleSheet, TextInput, View, Alert, Button, Text } from 'react-native';
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
        title="Info"
        color="#000"
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

          // If server response message same as Data Matched
       if(responseJson.success === 'SUCCESS')
       {             
        const setLogin = this.props.setLogin
        const navigation = this.props.navigation
       // 데이터베이스에 삽입!
        db.transaction(function(tx) {
          tx.executeSql(
            'INSERT INTO users (uid, user_id, email, name, christ_name, age, region, cathedral, created_at) VALUES (?,?,?,?,?,?,?,?,?)',
            [responseJson.id, UserId, UserEmail, UserName, UserCatholicName, UserAge, UserRegion, UserCathedral, "now"],
            (tx, results) => {
              console.log('Results', results.rowsAffected);
              console.log('Result', responseJson.id); // response로 uid값이 나와야 함
              if (results.rowsAffected > 0) {
                if(setLogin){ // action setLogin
                  setLogin(responseJson.id)
                  }
                // Alert.alert(responseJson.success); 
                  navigation.navigate('FirstPage', {});        
             
              } else {
                alert('Registration Failed');
              }
            }
          );
        });

       
      } else{ 
        Alert.alert(responseJson.success);
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
                // Adding hint in Text Input using Place holder.
                placeholder="Enter User Email"        
                onChangeText={UserEmail => this.setState({UserEmail})}        
                // Making the Under line Transparent.
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />        
                 <TextInput                
                // Adding hint in Text Input using Place holder.
                placeholder="Enter User Id"        
                onChangeText={UserId => this.setState({UserId})}        
                // Making the Under line Transparent.
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                 <TextInput                
                // Adding hint in Text Input using Place holder.
                placeholder="Enter User Name"        
                onChangeText={UserName => this.setState({UserName})}        
                // Making the Under line Transparent.
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                 <TextInput                
                // Adding hint in Text Input using Place holder.
                placeholder="Enter User Catholic Name"        
                onChangeText={UserCatholicName => this.setState({UserCatholicName})}        
                // Making the Under line Transparent.
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                 <TextInput                
                // Adding hint in Text Input using Place holder.
                placeholder="Enter User Age"        
                onChangeText={UserAge => this.setState({UserAge})}        
                // Making the Under line Transparent.
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                 <TextInput                
                // Adding hint in Text Input using Place holder.
                placeholder="Enter User Region"        
                onChangeText={UserRegion => this.setState({UserRegion})}        
                // Making the Under line Transparent.
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                 <TextInput                
                // Adding hint in Text Input using Place holder.
                placeholder="Enter User Cathedral"        
                onChangeText={UserCathedral => this.setState({UserCathedral})}        
                // Making the Under line Transparent.
                underlineColorAndroid='transparent'        
                style={styles.TextInputStyleClass}
                />
                <TextInput                
                // Adding hint in Text Input using Place holder.
                placeholder="Enter User Password"        
                onChangeText={UserPassword => this.setState({UserPassword})}        
                // Making the Under line Transparent.
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
 
