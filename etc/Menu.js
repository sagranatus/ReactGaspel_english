import React from 'react';
import PropTypes from 'prop-types';
import {NavigationEvents} from 'react-navigation'
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  AsyncStorage
} from 'react-native';
var normalSize;
var largeSize;

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#d8d8d8'
  },
  avatarContainer: {
    marginBottom: 20,

  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flex: 1,
  },
  name: {
    marginTop:7,
    paddingBottom:9,
    paddingLeft: 20,
    borderBottomWidth: 0.5,
    borderColor: '#d8d8d8'
  },
  item: {
    fontWeight: '300',
    paddingTop: 25,
    paddingBottom: 10,
    paddingLeft: 20,
  },
});
var name, christname;
export default function Menu({ onItemSelected }) {
  
  AsyncStorage.getItem('name', (err, result) => {
    console.log("Menu - login_name : ", result)
    name = result;
  
  })
  AsyncStorage.getItem('catholic_name', (err, result) => {
    console.log("Menu - catholic_name : ", result)
    christname = result
  })

  function setChange(){
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
  }

  return (
    <ScrollView scrollsToTop={false} style={styles.menu}>
            <NavigationEvents
            onWillFocus={payload => {
                setChange()
            }}
            />
        <Text style={[styles.name, normalSize, {height:33}]}>{name} {christname}</Text>

      <Text
        onPress={() => onItemSelected('Setting')}
        style={[styles.item, normalSize]}
      >
        환경설정
      </Text>     
     
    </ScrollView>
  );
}

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};