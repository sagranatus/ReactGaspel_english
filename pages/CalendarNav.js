import React from 'react';
import { View, Text} from 'react-native';
import { createStackNavigator,  createAppContainer} from 'react-navigation';
import Main2_2 from '../containers/Main2_2Container';
import Main3_2 from '../containers/Main3_2Container';
import Main4_2 from '../containers/Main4_2Container';
import Main5Container from '../containers/Main5Container';
import Main5 from './Main5';
import {NavigationEvents} from 'react-navigation'

const RootStack = createStackNavigator({
    Main5 : {
    screen: Main5Container,
    navigationOptions: {
        header: null,
    },
  },
  Main2_2: {
    screen: Main2_2,
    navigationOptions: {
      title: '',
      headerStyle: { backgroundColor: '#01579b',  height: 40 },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontSize : 15
      }
    },
  },
  Main3_2: {
    screen: Main3_2,
    navigationOptions: {
      title: '',
      headerStyle: { backgroundColor: '#01579b',  height: 40 },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontSize : 15
      }
    },
  },
  Main4_2: {
    screen: Main4_2,
    navigationOptions: {
      title: '',
      headerStyle: { backgroundColor: '#01579b',  height: 40 },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontSize : 15
      }
    },
  }
  
});

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  hi(){
    const main5 =  new Main5()    
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth()+1
    var day = date.getDate();
    if(month < 10){
        month = "0"+month;
    }
    if(day < 10){
        day = "0"+day;
    } 
    var today = year+"-"+month+"-"+day;
    // 오늘 값을 가져온다
    main5.onselectDate(null, today)
  }
  render() {
    
     return (
      <React.Fragment>
        <AppContainer />     
        <NavigationEvents
      onWillFocus={payload => {
             
      }}
      />
      </React.Fragment>  
    )
    
  }
}
