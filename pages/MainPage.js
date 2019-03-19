import React from 'react'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation'
import { Platform, Image } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import Main1 from '../containers/Main1Container'
import Main2 from '../containers/Main2Container'
import Main3 from '../containers/Main3Container'
import Main4 from '../containers/Main4Container'
import Main5 from '../containers/Main5Container'
import Sub5 from '../containers/Sub5Container'
import TabBarComponent from './TabBarComponent.js'
import Main2_2 from '../containers/Main2_2Container';
import Main3_2 from '../containers/Main3_2Container';
import Main4_2 from '../containers/Main4_2Container';
import GuidePage from './GuidePage';
import Profile from '../containers/ProfileContainer'
import Setting from './Setting'
var date = new  Date()
var weekend = date.getDay() == 0
const getTabBarIcon = (navigation, focused, tintColor) => {
	console.log("tabbar", weekend)
	const { routeName } = navigation.state;
	let IconComponent = Icon;
	let iconName;
	if (routeName === 'Main1') {
		//console.log(navigation)
		//console.log(focused)
		iconName = 'user';
	  // We want to add badges to home tab icon
	//  IconComponent = HomeIconWithBadge;
	} else if (routeName === 'Main2') {
		iconName = 'comment';
	} else if (routeName === 'Main3') {
		iconName = 'pencil';
	} else if (routeName === 'Main4') {
		iconName = 'bell';
	}else if (routeName === 'Main5'){
		iconName = 'calendar';
	}else{
		return  <Image source={require('../resources/bottom4.png')} style={{width: 25, height: 25, justifyContent: 'center'}}/>
	}
  return <IconComponent name={iconName} size={35} color={tintColor} />;
  };
	
	const TabNavigator = createBottomTabNavigator(
		weekend = date.getDay() == 0 ? 
		{
			Main1: { screen: Main1 },
		//Main2: { screen: Main2 },
			Main4: { screen: Main4 },
			Main5: { screen: Main5 },
			Sub5: {screen: Sub5},
		//	Main2_2: {screen: Main2_2},
			Main3_2: {screen: Main3_2},
			Main4_2: {screen: Main4_2},
			Guide: { screen: GuidePage },
			Profile: { screen: Profile},
			Setting: { screen: Setting }
		
		} : {
			Main1: { screen: Main1 },
			//Main2: { screen: Main2 },
				Main3: {screen: Main3 },
				Main4: { screen: Main4 },
				Main5: { screen: Main5 },
				Sub5: {screen: Sub5},
			//	Main2_2: {screen: Main2_2},
				Main3_2: {screen: Main3_2},
				Main4_2: {screen: Main4_2},
				Guide: { screen: GuidePage },
				Profile: { screen: Profile},
				Setting: { screen: Setting }
			
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
				state: { ...navigation.state, routes: navigation.state.routes.filter(r => r.routeName !== 'Sub5' && r.routeName !== 'Main2_2'&& r.routeName !== 'Main3_2'&& r.routeName !== 'Main4_2' && r.routeName !== 'Guide' && r.routeName !== 'Profile' && r.routeName !== 'Setting')}}} 
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

	
  export default  createAppContainer(TabNavigator)