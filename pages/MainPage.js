import React from 'react'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation'
import { Platform, Image } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import Main1 from '../containers/Main1Container'
import Main2 from '../containers/Main2Container'
import Main3 from '../containers/Main3Container'
import Main4 from '../containers/Main4Container'
import Main5 from '../containers/Main5Container'
import CalendarNav from '../containers/CalendarNavContainer'
import Sub5 from '../containers/Sub5Container'
import TabBarComponent from './TabBarComponent.js'
import Main2_2 from '../containers/Main2_2Container';
import Main3_2 from '../containers/Main3_2Container';
import Main4_2 from '../containers/Main4_2Container';

const getTabBarIcon = (navigation, focused, tintColor) => {

	const { routeName } = navigation.state;
	let IconComponent = Icon;
	let iconName;
	if (routeName === '오늘의복음') {
		//console.log(navigation)
		//console.log(focused)
		iconName = 'user';
	//	return  <Image source={require('../resources/bottom0.png')} style={{width: 24, height: 24, justifyContent: 'center'}}/>
	  // We want to add badges to home tab icon
	//  IconComponent = HomeIconWithBadge;
	} else if (routeName === '말씀새기기') {
		iconName = 'comment';
	//	return  <Image source={require('../resources/bottom1.png')} style={{width: 24, height: 24, justifyContent: 'center'}}/>
	} else if (routeName === '거룩한독서') {
		iconName = 'pencil';
	//	return  <Image source={require('../resources/bottom2.png')} style={{width: 24, height: 24, justifyContent: 'center'}}/>
	} else if (routeName === '주일의독서') {
		iconName = 'bell';
	//	return  <Image source={require('../resources/bottom3.png')} style={{width: 24, height: 24, justifyContent: 'center'}}/>
	}else if (routeName === '나의기록'){
		iconName = 'calendar';
	//	return  <Image source={require('../resources/bottom4.png')} style={{width: 24, height: 24, justifyContent: 'center'}}/>
	}else{
		return  <Image source={require('../resources/bottom4.png')} style={{width: 25, height: 25, justifyContent: 'center'}}/>
	}
  return <IconComponent name={iconName} size={35} color={tintColor} />;
//	return  <Image source={require('../resources/bottom0.png')} style={{width: 24, height: 24, justifyContent: 'center'}}/>
  };
	
  const TabNavigator = createBottomTabNavigator({
	오늘의복음: { screen: Main1 },
	말씀새기기: { screen: Main2 },
	거룩한독서: {screen: Main3 },
	주일의독서: { screen: Main4 },
	나의기록: { screen: Main5 },
	Sub5: {screen: Sub5},
	Main2_2: {screen: Main2_2},
	Main3_2: {screen: Main3_2},
	Main4_2: {screen: Main4_2}
	},
	
	(Platform.OS === 'android') // android의 경우에 keyboard 올라올때 bottomtab 안보이게
? {
	
	defaultNavigationOptions: ({ navigation }) => ({
	  tabBarIcon: ({ focused, tintColor }) =>
		getTabBarIcon(navigation, focused, tintColor),
		
	}),
	tabBarOptions: {
		showLabel: false,
		showIcon: this.state !== '오늘의복음',
	  activeTintColor: '#01579b',
	  inactiveTintColor: 'gray',
	},
    tabBarComponent: ({ navigation, ...rest }) => <TabBarComponent {...rest}
    navigation={{
			...navigation,
			state: { ...navigation.state, routes: navigation.state.routes.filter(r => r.routeName !== 'Sub5' && r.routeName !== 'Main2_2'&& r.routeName !== 'Main3_2'&& r.routeName !== 'Main4_2')}}} 
			/>, // 이는 keyboard show시에 navigation 안보이게 하기 위한 코드
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