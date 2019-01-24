import React from 'react';
import { Platform, Keyboard } from 'react-native';
import { BottomTabBar } from 'react-navigation-tabs'; // need version 2.0 react-navigation of course... it comes preinstalled as a dependency of react-navigation.

export default class TabBarComponent extends React.Component {
  state = {
    visible: true
  }

  componentDidMount() {
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
      return (
        <BottomTabBar {...this.props} />
      );
    }
  }
}