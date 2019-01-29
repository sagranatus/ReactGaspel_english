import React, { Component } from 'react'; 
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { StyleSheet, TextInput, View, Alert, Button, Text, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons'
import Main1 from '../containers/Main1Container';
import Main2 from '../containers/Main2Container';
import Main3 from '../containers/Main3Container';
import Main4 from '../containers/Main4Container';
import Main5 from '../containers/Main5Container';
import CalendarNav from './CalendarNav'
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
	}else{
		iconName = 'calendar';
	}
  
	// You can return any component that you like here!
	return <IconComponent name={iconName} size={25} color={tintColor} />;
  };

  const TabNavigator = createBottomTabNavigator({
	Home: { screen: Main1 },
	Main2: { screen: Main2 },
	Main3: {screen: Main3 },
	Main4: { screen: Main4 },
	Main5: { screen: CalendarNav }  
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
    tabBarComponent: props => <TabBarComponent {...props} />, // 이는 keyboard show시에 navigation 안보이게 하기 위한 코드
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