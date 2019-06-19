import React from 'react'
import { createBottomTabNavigator, createAppContainer, createStackNavigator, NavigationActions } from 'react-navigation'
import { Platform, Image, View, Text, StyleSheet, AsyncStorage } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import NetInfo from "@react-native-community/netinfo";
import Main1 from '../containers/Main1Container'
import Main3 from '../containers/Main3Container'
import Main4 from '../containers/Main4Container'
import Main5 from './Main5'
import TabBarComponent from './TabBarComponent.js'
import Main3_2 from '../containers/Main3_2Container';
import Main4_2 from '../containers/Main4_2Container';
import Setting from './Setting'
import SendImage from './SendImage'
import { TextInput } from 'react-native-gesture-handler';

//saea only change sdk root testtest
const getTabBarIcon = (navigation, focused, tintColor) => {
	const { routeName } = navigation.state;
	let IconComponent = Icon;
	let iconName;
	if (routeName === 'Main1') {
		iconName = 'user';
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
		{
			Main1: { screen: Main1 },
			Main3: {screen: Main3 },
			Main4: { screen: Main4 },
			Main5: { screen: Main5 },
			Main3_2: {screen: Main3_2},
			Main4_2: {screen: Main4_2},
	//		Profile: { screen: Profile},
			Setting: { screen: Setting },
			SendImage: {screen: SendImage}
		
		},
		 {	
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
	//	order: ['Main1', 'Main3', 'Main4', 'Main5'],
			tabBarComponent: ({ navigation, ...rest }) => <TabBarComponent {...rest}
			navigation={{
				...navigation,
				state: { ...navigation.state, routes: navigation.state.routes.filter(r => r.routeName !== 'Main3_2'&& r.routeName !== 'Main4_2' && r.routeName !== 'Setting' && r.routeName !== 'SendImage' )}}} 
				/>, // 이는 keyboard show시에 navigation 안보이게 하기 위한 코드
			tabBarPosition: 'bottom',
			backBehavior: Platform.OS == 'ios' ? 'none' : 'history'
		 }	
		);
		

	if(	Platform.OS !== 'ios' ){
	const defaultGetStateForAction = TabNavigator.router.getStateForAction;
	TabNavigator.router.getStateForAction = (action, state) => {
		const screen = state ? state.routes[state.index] : null;
		console.log("tab",state)
		console.log("tab",screen)

		// FirstPage에서 뒤로가기 세팅
		if (action.type === "Navigation/NAVIGATE" && action.routeName == 'Home') 
		{
			console.log("home!!!")
			return {
				...state,
				routeName : "Home",
				index: 0			
			};	
		}

		// Main1, 3, 4, 5 의 경우 LoginUser로 가는 것을 방지하기 위한 세팅 
		if(screen !== null && state.routeKeyHistory.length !== 0 && state.routeKeyHistory !== 'undefined'){
		console.log("key",screen.key)
		console.log("history",state.routeKeyHistory)	
			if (action.type === NavigationActions.BACK && screen.key == 'Main1' && state.routeKeyHistory.length == 1) 
			{
				console.log("not Move!!!"+screen.key)
				
			const newRoutes = state.routes;
			return {
				...state,
				index: 0,
				routes: newRoutes		 
			};
			}else if (action.type === NavigationActions.BACK && screen.key == 'Main3' && state.routeKeyHistory.length == 1) 
			{
				console.log("not Move!!!"+screen.key)
				
				const newRoutes = state.routes;
				return {
					...state,
					index: 1,
					routes: newRoutes		 
				};
			}else if (action.type === NavigationActions.BACK && screen.key == 'Main4' && state.routeKeyHistory.length == 1) 
				{
				console.log("not Move!!!"+screen.key)
				
				const newRoutes = state.routes;
				return {
					...state,
					index: 2,
					routes: newRoutes		 
				};
			}else if (action.type === NavigationActions.BACK && screen.key == 'Main5' && state.routeKeyHistory.length == 1) 
			{
				console.log("not Move!!!"+screen.key)
				
				const newRoutes = state.routes;
				return {
					...state,
					index: 3,
					routes: newRoutes		 
				};
			}
		}
		return defaultGetStateForAction(action, state);
	};
}
const AppContainer = createAppContainer(TabNavigator)
	

export default class App extends React.Component {

	constructor(props) { 
		super(props)  
		Text.defaultProps = Text.defaultProps || {};
		Text.defaultProps.allowFontScaling = false;

		this.state = {
			initialLoading: true,
			internet: false
		} 		
	}

	componentWillMount(){	
				
		const setState1 = (state) => this.setState({initialLoading : state})
		setTimeout(function() {
		  setState1(false)
		}, 500);   

		 // 인터넷 연결
		 const setState = (isConnected) => this.setState({internet : isConnected})
		  NetInfo.isConnected.fetch().then(isConnected => {
			console.log('First, is ' + (isConnected ? 'online' : 'offline'));
			setState(isConnected)		   
		  });
		  function handleFirstConnectivityChange(isConnected) {
			console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
			setState(isConnected)
		   /* NetInfo.isConnected.removeEventListener(
			  'connectionChange',
			  handleFirstConnectivityChange
			); */
		  }
		  NetInfo.isConnected.addEventListener(
			'connectionChange',
			handleFirstConnectivityChange
			);		

	}
	render() {	
	  return this.state.initialLoading ?
	  <View style={styles.MainContainer}> 
		<Image source={require('../resources/main_bible.png')} style={{width: 100, height: 100, justifyContent: 'center'}}/>
		<Text style= {styles.TextComponentStyle}>Today's Gospel</Text>
	  </View>
	  : 
	  (!this.state.internet) ? 
	  <View style={[styles.MainContainer, {backgroundColor:'#F8F8F8'}]}>             
		  <Text style= {[styles.TextComponentStyle, {color:'#000'}]}>Please connect the Internet.</Text>
	  </View>
		:
	<View style={Platform.OS == "ios" ? {flex:1, marginTop:18} : {flex:1}}>
	<AppContainer />
	</View>
	}
}

const styles = StyleSheet.create({
MainContainer :{     
    backgroundColor:"#01579b",
    justifyContent: 'center',
    alignItems: 'center',
    flex:1,
    margin: 0,
    color:"#fff"
    },          
     TextComponentStyle: {
       fontSize: 16,
      color: "#fff",
      textAlign: 'center',
      marginTop: 3, 
      marginBottom: 15
	 }
});