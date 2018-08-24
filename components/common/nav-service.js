let _navigator;

function setNavigator(navigator) {
  _navigator = navigator;
}

function navigate(routeName, params) {
  _navigator.navigate(routeName, params);
}

function setParams(params) {
  _navigator.setParams(params);
}

function getParam(param) {
  return _navigator.getParam(param);
}

export default {
  navigate,
  setParams,
  getParam,
  setNavigator
};