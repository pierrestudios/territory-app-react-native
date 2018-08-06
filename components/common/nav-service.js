let _navigator;

function setNavigator(navigator) {
  _navigator = navigator;
}

function navigate(routeName, params) {
  _navigator.navigate(routeName, params);
}

export default {
  navigate,
  setNavigator
};