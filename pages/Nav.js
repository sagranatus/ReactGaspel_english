import React from 'react';
import { createStackNavigator,  createAppContainer} from 'react-navigation';
import RegisterUserContainer from '../containers/RegisterUserContainer';
import FirstPageContainer from '../containers/FirstPageContainer';
import LoginUserContainer from '../containers/LoginUserContainer';

const RootStack = createStackNavigator({
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
