import React from 'react'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation'
import { Platform, Image } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import Main1 from '../containers/Main1Container'
import Main2 from '../containers/Main2Container'
import Main3 from '../containers/Main3Container'
import Main4 from '../containers/Main4Container'
import CalendarNav from './CalendarNav'
import TabBarComponent from './TabBarComponent.js'

const getTabBarIcon = (navigation, focused, tintColor) => {
	const { routeName } = navigation.state;
	let IconComponent = Icon;
	let iconName;
	if (routeName === '오늘의복음') {
		//console.log(navigation)
		//console.log(focused)
		iconName = 'star';
		return  <Image source={require('../resources/bottom0.png')} style={{width: 24, height: 24, justifyContent: 'center'}}/>
	  // We want to add badges to home tab icon
	//  IconComponent = HomeIconWithBadge;
	} else if (routeName === '말씀새기기') {
		iconName = 'search';
		return  <Image source={require('../resources/bottom1.png')} style={{width: 24, height: 24, justifyContent: 'center'}}/>
	} else if (routeName === '거룩한독서') {
		iconName = 'tag';
		return  <Image source={require('../resources/bottom2.png')} style={{width: 24, height: 24, justifyContent: 'center'}}/>
	} else if (routeName === '주일의독서') {
		iconName = 'user';
		return  <Image source={require('../resources/bottom3.png')} style={{width: 24, height: 24, justifyContent: 'center'}}/>
	}else{
		iconName = 'calendar';
		return  <Image source={require('../resources/bottom4.png')} style={{width: 24, height: 24, justifyContent: 'center'}}/>
	}
  //<IconComponent name={iconName} size={25} color={tintColor} />;
//	return  <Image source={require('../resources/bottom0.png')} style={{width: 24, height: 24, justifyContent: 'center'}}/>
  };

  const TabNavigator = createBottomTabNavigator({
	오늘의복음: { screen: Main1 },
	말씀새기기: { screen: Main2 },
	거룩한독서: {screen: Main3 },
	주일의독서: { screen: Main4 },
	나의기록: { screen: CalendarNav }  
	},
	(Platform.OS === 'android') // android의 경우에 keyboard 올라올때 bottomtab 안보이게
? {
	defaultNavigationOptions: ({ navigation }) => ({
	  tabBarIcon: ({ focused, tintColor }) =>
		getTabBarIcon(navigation, focused, tintColor),
	}),
	tabBarOptions: {
	  activeTintColor: '#01579b',
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