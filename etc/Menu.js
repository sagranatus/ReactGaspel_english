import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  AsyncStorage
} from 'react-native';

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
    fontSize: 14,
    fontWeight: '300',
    paddingTop: 25,
    paddingLeft: 20,
  },
});
var name, christname;
export default function Menu({ onItemSelected }) {
  AsyncStorage.getItem('login_name', (err, result) => {
    console.log("FirstPage - login_name : ", result)
    name = result;
  
  })
  AsyncStorage.getItem('login_christ_name', (err, result) => {
    console.log("FirstPage - login_chirst_name : ", result)
    christname = result
  })
  return (
    <ScrollView scrollsToTop={false} style={styles.menu}>
          
        <Text style={styles.name}>{name} {christname}</Text>

      <Text
        onPress={() => onItemSelected('Setting')}
        style={styles.item}
      >
        환경설정
      </Text>

      <Text
        onPress={() => onItemSelected('Profile')}
        style={styles.item}
      >
        프로필 수정
      </Text>
      <Text
        onPress={() => onItemSelected('Logout')}
        style={styles.item}
      >
        로그아웃
      </Text>
    </ScrollView>
  );
}

Menu.propTypes = {
  onItemSelected: PropTypes.func.isRequired,
};