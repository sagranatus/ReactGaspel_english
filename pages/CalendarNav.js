import React, {Component} from 'react';
import { View, Text, } from 'react-native';
import {PropTypes} from 'prop-types';
import { createStackNavigator,  createAppContainer} from 'react-navigation';
import Main2_2 from '../containers/Main2_2Container';
import Main3_2 from '../containers/Main3_2Container';
import Main4_2 from '../containers/Main4_2Container';
import Sub5Container from '../containers/Sub5Container';
import Sub5 from './Sub5'
import Main5 from './Main5';
import {NavigationEvents} from 'react-navigation'

const RootStack = createStackNavigator({
    Sub5 : {
    screen: Sub5Container,
    navigationOptions: {
        header: null,
        params: { type: "anime" }        
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

export default class CalendarNav extends Component {
  constructor(props) { 
    super(props) 
  }
  componentWillMount(){
   
  console.log("CalendarNav - componentWillMount")
  const { params } = this.props.navigation.state
 // console.log(params.otherParam)

  if(params != null){
      console.log("CalendarNav - params : ", params )      
  }

  }
  render() {
     return (
      <React.Fragment>
       <AppContainer params={this.props.navigation.state}/>
        <NavigationEvents
      onWillFocus={payload => {
         alert("adadw")   
         console.log(this.props.navigation.state)
      }}
      />
      </React.Fragment>  
    )
    
  }
}
CalendarNav.propTypes = { 
  status: PropTypes.shape({
      isLogged: PropTypes.bool,
      loginId: PropTypes.string
  })
};
