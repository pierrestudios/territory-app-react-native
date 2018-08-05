import React from 'react';
import { NavigationActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  console.log('setTopLevelNavigator()', navigatorRef);
  _navigator = navigatorRef;
}

function setNavigator(navigator) {
  _navigator = navigator;
}

function navigate(routeName, params) {
  // console.log('navigate()', {_navigator, routeName, params});
  _navigator.navigate(routeName, params);
}

export default {
  navigate,
  setNavigator,
  setTopLevelNavigator,
};