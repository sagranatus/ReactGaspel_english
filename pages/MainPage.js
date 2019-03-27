import React from 'react'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation'
import { Platform, Image, NetInfo, View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/EvilIcons'
import Main1 from '../containers/Main1Container'
import Main3 from '../containers/Main3Container'
import Main4 from '../containers/Main4Container'
import Main5 from '../containers/Main5Container'
import TabBarComponent from './TabBarComponent.js'
import Main3_2 from '../containers/Main3_2Container';
import Main4_2 from '../containers/Main4_2Container';
import GuidePage from './GuidePage';
import Profile from '../containers/ProfileContainer'
import Setting from './Setting'
import RegisterUser from '../containers/RegisterUserContainer';
import FirstPage from '../containers/FirstPageContainer';
import LoginUser from '../containers/LoginUserContainer';
console.log("Mainpage loaded")
 
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
			Guide: { screen: GuidePage },
			Profile: { screen: Profile},
			Setting: { screen: Setting },				
			RegisterUser: {screen: RegisterUser},
			LoginUser: {screen: LoginUser},
			FirstPage : { screen: FirstPage }			
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
				state: { ...navigation.state, routes: navigation.state.routes.filter(r => r.routeName !== 'FirstPage' && r.routeName !== 'RegisterUser' && r.routeName !== 'LoginUser' && r.routeName !== 'Main3_2'&& r.routeName !== 'Main4_2' && r.routeName !== 'Guide' && r.routeName !== 'Profile' && r.routeName !== 'Setting')}}} 
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

const AppContainer = createAppContainer(TabNavigator)
  
  export default class App extends React.Component {

	constructor(props) { 
		super(props)  
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
		<Text style= {styles.TextComponentStyle}>오늘의 복음</Text>
	  </View>
	  : 
	  (!this.state.internet) ? 
	  <View style={[styles.MainContainer, {backgroundColor:'#F8F8F8'}]}>             
		  <Text style= {[styles.TextComponentStyle, {color:'#000'}]}>인터넷을 연결해주세요</Text>
	  </View>
	  :
	  <AppContainer />;
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