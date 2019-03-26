import React from 'react';
import { Platform, Keyboard } from 'react-native';
import { BottomTabBar } from 'react-navigation-tabs'; 

export default class TabBarComponent extends React.Component {
  state = {
    visible: true
  }

  componentDidMount() {
    console.log("saea", this.props)
    if (Platform.OS === 'android') {
      this.keyboardEventListeners = [
        Keyboard.addListener('keyboardDidShow', this.visible(false)), // keyboard가 보여질때 bottomtab 안보이게 하기
        Keyboard.addListener('keyboardDidHide', this.visible(true))
      ];
    }
  }

  componentWillUnmount() {
    this.keyboardEventListeners && this.keyboardEventListeners.forEach((eventListener) => eventListener.remove());
  }

  visible = visible => () => this.setState({visible});

  render() {
    if (!this.state.visible) {
      return null;
    } else {
      // 아래 페이지에서 tabbar 안보이게
      if(this.props.navigation.state.index == 4 || this.props.navigation.state.index == 5 || this.props.navigation.state.index == 6 || this.props.navigation.state.index == 7 || this.props.navigation.state.index == 8 || this.props.navigation.state.index == 9 || this.props.navigation.state.index == 10 || this.props.navigation.state.index == 11){return null}
      return (
        <BottomTabBar {...this.props} />
      );
    }
  }
}