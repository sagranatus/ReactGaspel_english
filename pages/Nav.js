import React from 'react';
import { createStackNavigator,  createAppContainer} from 'react-navigation';
import RegisterUserContainer from '../containers/RegisterUserContainer';
import FirstPageContainer from '../containers/FirstPageContainer';
import LoginUserContainer from '../containers/LoginUserContainer';

const RootStack = createStackNavigator({
  FirstPage : {
    screen: FirstPageContainer,
    navigationOptions: {
      title: 'First page',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
  RegisterUser: {
    screen: RegisterUserContainer,
    navigationOptions: {
      title: 'Register User',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
  LoginUser: {
    screen: LoginUserContainer,
    navigationOptions: {
      title: 'Login User',
      headerStyle: { backgroundColor: '#f05555' },
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
