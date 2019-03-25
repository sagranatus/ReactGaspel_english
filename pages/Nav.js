import React from 'react';
import { createStackNavigator,  createAppContainer} from 'react-navigation';
import RegisterUserContainer from '../containers/RegisterUserContainer';
import FirstPageContainer from '../containers/FirstPageContainer';
import LoginUserContainer from '../containers/LoginUserContainer';
import Main1 from '../containers/Main1Container'
import Main3 from '../containers/Main3Container'
import Main4 from '../containers/Main4Container'
import Main5 from '../containers/Main5Container'
import Main3_2 from '../containers/Main3_2Container';
import Main4_2 from '../containers/Main4_2Container';
import GuidePage from './GuidePage';
import Profile from '../containers/ProfileContainer'
import Setting from './Setting'
const RootStack = createStackNavigator({ 
  Main1 : {
    screen: Main1,
    navigationOptions: {
      header: null
    },
  },
  Main3 : {
    screen: Main3,
    navigationOptions: {
      header: null
    },
  },
  Main4 : {
    screen: Main4,
    navigationOptions: {
      header: null
    },
  }, 
  Main3_2 : {
    screen: Main3_2,
    navigationOptions: {
      header: null
    },
  },
  Main4_2 : {
    screen: Main4_2,
    navigationOptions: {
      header: null
    },
  },
  Setting : {
    screen: Setting,
    navigationOptions: {
      header: null
    },
  },
  GuidePage : {
    screen: GuidePage,
    navigationOptions: {
      header: null
    },
  },
  Profile : {
    screen: Profile,
    navigationOptions: {
      header: null
    },
  },
  Main5 : {
    screen: Main5,
    navigationOptions: {
      header: null
    },
  },
  FirstPage : {
    screen: FirstPageContainer,
    navigationOptions: {
      header: null
    },
  },
  RegisterUser: {
    screen: RegisterUserContainer,
    navigationOptions: {
      title: '',
      headerStyle: { backgroundColor: '#01579b', display:'none'},
      headerTintColor: '#ffffff',
    },
  },
  LoginUser: {
    screen: LoginUserContainer,
    navigationOptions: {
      title: '로그인',
      headerStyle: { backgroundColor: '#01579b', display:'none' },
      headerTintColor: '#ffffff',
    },
  }
 
  
});

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
