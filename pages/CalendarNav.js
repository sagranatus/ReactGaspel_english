import React from 'react';
import { createStackNavigator,  createAppContainer} from 'react-navigation';
import Main2_2 from '../containers/Main2_2Container';
import Main3_2 from '../containers/Main3_2Container';
import Main4_2 from '../containers/Main4_2Container';
import Main5 from '../containers/Main5Container';

const RootStack = createStackNavigator({
    Main5 : {
    screen: Main5,
    navigationOptions: {
        header: null
    },
  },
  Main2_2: {
    screen: Main2_2,
    navigationOptions: {
      title: 'Main2_2',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
  Main3_2: {
    screen: Main3_2,
    navigationOptions: {
      title: 'Main3_2',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
  Main4_2: {
    screen: Main4_2,
    navigationOptions: {
      title: 'Main4_2',
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
