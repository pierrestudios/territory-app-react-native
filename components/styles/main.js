import { StyleSheet } from 'react-native';

const colors = {
  "territory-blue": '#337ab7',
  "grey-lite": '#ccc',
  "grey-dark": '#333',
  red: 'red',
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
    justifyContent: 'center',
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
  section: {
    height: '100%'
  },

  // Menu

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
  "main-menu-link": {
    // minWidth: '80%',
    alignItems: 'center',
    borderRadius: 3,
    padding: 10
  },
  "list-button": {
    minWidth: '90%',
    borderTopWidth: 1,
    borderColor: colors['grey-lite']
  },
  disabled: {
    // backgroundColor: '#ccc',
    opacity: 0.2,
  },
  "main-menu-button-text": {
    fontSize: 18,
    color: colors.white
  },
  "text-color-blue": {
    color: colors["territory-blue"]
  },

  // Form Inputs
  "input": {
    minWidth: '90%',
    borderWidth: 1,
    borderRadius: 3,
    height: 40,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    borderColor: colors['grey-lite'],
    backgroundColor: colors.white
  },

  errors: {
    padding: 10,
    marginTop: 5,
    borderRadius: 3,
    marginBottom: 5,
    backgroundColor: colors.red
  },

  "input-errors": {    
    marginTop: -5,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 3,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },

  // Listings 

  list: {
    alignItems: 'center'
  },

  listings: {
    // flex: 1,
    // flexDirection: 'column',
    // alignItems: 'flex-start', // center, flex-start, flex-end
    backgroundColor: colors.white,
    // borderColor: colors["grey-lite"],
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // padding: 2,
    // height: '100%'
  },

  "listings-item": {
    padding: 10,
    height: 50,
    borderTopWidth: 1,
    borderColor: colors['grey-lite'],
    // position: 'relative',
    flex: 1, 
    flexDirection: 'row',
    // alignItems: 'flex-start', // 'flex-start', 'flex-end', 'center', 'stretch', 'baseline' (Vertical)
    justifyContent: 'space-between' // enum('flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly')
  },

  "listings-number": {
    backgroundColor: colors["grey-dark"],
    alignItems: 'center', 
    padding: 5,
    // margin: 5,
    width: 35,
    height: 30
  },

  "listings-number-text": {
    color: colors.white,
    fontSize: 18,
  },

  "listings-name": {
    padding: 5,
    marginTop: 10,
    position: 'absolute', 
    left: 50,
    height: 40
  },

  "listings-name-text": {
    color: colors["territory-blue"]
  },

  "listings-date": {
    // alignSelf: 'flex-end',
    position: 'absolute', 
    right: 15,
    marginTop: 15,
    // borderTopWidth: 1, // Test
    // borderColor: colors['red'], // Test
    // padding: 7,
    height: 40
  },

  "listings-date-text": {
    color: colors["grey-lite"]
  },

  // Common styles:

  "text-center": {
    textAlign: 'center',
    width: '100%'
  },

  "text-strong": {
    fontWeight: 'bold',
  },

  line: {
    height: 2,
    borderColor: '#ccc',
    borderTopWidth: 1,
    margin: 20
  }
});
