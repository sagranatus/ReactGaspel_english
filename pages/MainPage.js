import React, { Component } from 'react'; 
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { StyleSheet, TextInput, View, Alert, Button, Text, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons'
import Main1 from './Main1';
import Main2 from '../containers/Main2Container';
import Main3 from '../containers/Main3Container';
import Main4 from './Main4';
import TabBarComponent from './TabBarComponent.js'
const getTabBarIcon = (navigation, focused, tintColor) => {
	const { routeName } = navigation.state;
	let IconComponent = Icon;
	let iconName;
	if (routeName === 'Home') {
	  iconName = 'star';
	  // We want to add badges to home tab icon
	//  IconComponent = HomeIconWithBadge;
	} else if (routeName === 'Main2') {
	  iconName = 'search';
	} else if (routeName === 'Main3') {
	  iconName = 'tag';
	} else if (routeName === 'Main4') {
	  iconName = 'user';
	}
  
	// You can return any component that you like here!
	return <IconComponent name={iconName} size={25} color={tintColor} />;
  };

  const TabNavigator = createBottomTabNavigator({
	Home: { screen: Main1 },
	Main2: { screen: Main2 },
	Main3: {screen: Main3 },
	Main4: { screen: Main4 } 
	},
	(Platform.OS === 'android') // android의 경우에 keyboard 올라올때 bottomtab 안보이게
? {
	defaultNavigationOptions: ({ navigation }) => ({
	  tabBarIcon: ({ focused, tintColor }) =>
		getTabBarIcon(navigation, focused, tintColor),
	}),
	tabBarOptions: {
	  activeTintColor: 'tomato',
	  inactiveTintColor: 'gray',
	},
    tabBarComponent: props => <TabBarComponent {...props} />,
    tabBarPosition: 'bottom'
   }
: 
  {
	defaultNavigationOptions: ({ navigation }) => ({
	  tabBarIcon: ({ focused, tintColor }) =>
		getTabBarIcon(navigation, focused, tintColor),
	}),
	tabBarOptions: {
	  activeTintColor: 'tomato',
	  inactiveTintColor: 'gray',
	},
	}
	
	);

  export default createAppContainer(TabNavigator);