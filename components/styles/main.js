import { StyleSheet } from 'react-native';

const colors = {
  "territory-blue": '#337ab7',
  white: '#fff'
};

export {colors}

/*
 * View Style Props: https://facebook.github.io/react-native/docs/view-style-props
 * Text Style Props: https://facebook.github.io/react-native/docs/text-style-props
 * Layout Props: https://facebook.github.io/react-native/docs/layout-props
 */

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  heading: {
    fontSize: 18,
    marginBottom: 40,
    marginTop: 40
  },
  "scroll-view": {
    paddingVertical: 3
  },
  "main-menu": {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'space-around',
    marginBottom: 25,
    padding: 0
  },
  "main-menu-button": {
    minWidth: '80%',
    alignItems: 'center',
    // borderStyle: 'solid',
    // borderWidth: 2,
    // borderColor: '#ccc',
    backgroundColor: colors["territory-blue"],
    borderRadius: 3,
    padding: 10,
    marginBottom: 5,
    marginTop: 5
  },
  disabled: {
    // backgroundColor: '#ccc',
    opacity: 0.2,
  },
  "main-menu-button-text": {
    fontSize: 18,
    color: colors.white
  },

  // Common styles:

  "text-center": {
    textAlign: 'center',
    width: '100%'
  }
});
