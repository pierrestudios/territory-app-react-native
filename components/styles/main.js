import { StyleSheet } from 'react-native';

export const colors = {
  "territory-blue": '#337ab7',
  "grey-lite": '#ccc',
  "grey-dark": '#333',
  "grey": '#999',
  orange: '#F99538',
  red: '#F44336',
  "off-white": '#F3f3f3',
  white: '#fff',
  green: '#2f9e44'
};

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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff'
  },
  heading: {
    fontSize: 18,
    marginBottom: 40,
    marginTop: 40
  },
  "scroll-view": {
    paddingVertical: 20
  },
  section: {
    flex: 1,
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
  "button-link": {
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 0,
    height: 30
  },
  "button-link-text": {
    fontSize: 14,
    color: colors["territory-blue"],
  },
  "header-button": {
    alignItems: 'center',
    borderRadius: 3,
    padding: 10
  },
  "header-button-text": {
    fontSize: 14,
    color: colors.white
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

  // Form Inputs
  "input": {
    minWidth: '90%',
    borderWidth: 1,
    borderRadius: 3,
    height: 50,
    padding: 10,
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
    borderColor: colors['grey-lite'],
    backgroundColor: colors.white
  },

  "date-input-wrapper": {
    width: '100%',
    borderWidth: 1,
    borderRadius: 3,
    height: 50,
    padding: 7,
    marginTop: 5,
    marginBottom: 5,
    borderColor: colors['grey-lite'],
    backgroundColor: colors.white
  },

  "date-input": {
    width: '100%',
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },

  "input-icon-wrapper": {
    width: 18,
    position: 'absolute',
    top: 23,
    left: 10,
    zIndex: 9,
    // borderWidth: 1, // Test
    // borderColor: colors['red'], // Test
  },

  "input-icon": {
    color: colors["grey-lite"]
  },

  "with-icon": {
    paddingLeft: 30
  },

  "input-label": {
    marginTop: 10,
    marginBottom: 5
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

  "listings-results": {
    // marginBottom: 120,
    // flex: 1,
  },

  "listings-item": {
    padding: 10,
    height: 50,
    borderTopWidth: 1,
    borderColor: colors['grey-lite'],
    // position: 'relative',
    flex: 1, 
    flexDirection: 'row',
    // alignItems: 'flex-start', // 'flex-start', 'flex-end', 'center', 'stretch', 'baseline' 
    justifyContent: 'space-between' // enum('flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly') (Vertical)
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
    fontSize: 16,
  },

  "listings-name": {
    padding: 5,
    overflow: 'hidden',
    marginTop: 10,
    position: 'absolute', 
    left: 50,
    width: '65%',
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
    // borderWidth: 1, // Test
    // borderColor: colors['red'], // Test
    // padding: 7,
    height: 40
  },

  "listings-date-text": {
    color: colors["grey"]
  },

  "listings-notes": {
    width: '35%',
    height: 40,
    position: 'absolute', 
    right: 0,
    padding: 5,
    overflow: 'hidden',
    // borderWidth: 1, // Test
    // borderColor: colors['red'], // Test
  },

  "add-notes": {
    // padding: 5,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors["grey-lite"]
  },

  "address-listings-name": {
    left: 8,
    marginTop: 0
  },

  "input-options-container": {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 5,
    marginBottom: 15
  },

  "input-options-button": {
    width: '30%',
    height: 90,
  },

  "input-options": {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    padding: 5,
    margin: 5,
    backgroundColor: colors.white,
    borderColor: colors["grey-lite"],
    borderWidth: 1,
    borderRadius: 5
  },

  "input-options-label": {
    padding: 5,
  },

  "input-options-active": {
    backgroundColor: colors["territory-blue"]
  },

  "input-options-icon": {
    color: colors["grey-lite"]
  },

  "input-options-icon-active": {
    color: colors.white
  },

  "input-options-label-active" : {
    color: colors.white
  },

  "select-options-wrapper": { 
    backgroundColor: colors.white,
    borderColor: colors["grey-lite"], 
    borderWidth: 1, 
    alignItems: 'center',
  },

  "select-options": {
    height: 160, // iOS default: 216
    width: 200,
    fontSize: 22,
    // fontWeight: 'bold',
    // margin: 0,
    marginTop: 0,
    marginBottom: 0,
    // padding: 0
    // borderWidth: 1, // Test
    // borderColor: colors['red'], // Test
  },


  // Territory Details
  
  "territory-heading": {
    // flex: 1, 
    flexDirection: 'row-reverse', // enum('row', 'row-reverse', 'column', 'column-reverse')
    // alignItems: 'flex-end', // 'flex-start', 'flex-end', 'center', 'stretch', 'baseline' (Vertical)
    justifyContent: 'flex-start',
    // width: '100%',
    height: 60,
    padding: 20
  },

  "heading-number": {
    backgroundColor: colors["grey-dark"],
    alignItems: 'center', 
    padding: 5,
    marginTop: 15,
    width: 35,
    height: 30,
    position: 'absolute', 
    right: 20,
  },

  "heading-button-link": {
    borderRadius: 3,
    // flex: 1,
    alignItems: 'center',
    // padding: 5,
    paddingTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginTop: -3,
    // height: 30
  },

  "heading-button-link-text": {
    fontSize: 16,
  },

  "view-map-button": {
    backgroundColor: colors["territory-blue"],
  },

  "pdf-button": {
    backgroundColor: colors["orange"],
  },

  "csv-button": {
    backgroundColor: colors["orange"],
  },

  "add-new-street": {
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 15,
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors["grey-lite"],
    backgroundColor: colors.white
  },

  "icon-button": {
    alignItems: 'center',
    padding: 10
  },

  // Modal
  "modal-container": {
    position: 'absolute', 
    top: 20,
    // flex: 1,
    // alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    padding: 5,
    borderWidth: 0,
    borderRadius: 5,
    // borderColor: colors["grey-lite"],
    backgroundColor: colors.white,
    // iOS Shadow
    shadowColor: colors["grey-dark"],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    // Android Shadow
    elevation: 5,
    marginLeft: 25,
    marginRight: 25,
    marginTop: 0,
  },

  // Common styles:

  "text-center": {
    textAlign: 'center',
    width: '100%'
  },
  "text-strong": {
    fontWeight: 'bold',
  },
  "text-white": {
    color: colors.white
  },
  "text-color-blue": {
    color: colors["territory-blue"]
  },

  label: {
    marginBottom: 5,
    marginTop: 10
  },

  "label-medium": {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15
  },

  line: {
    height: 2,
    borderColor: '#ccc',
    borderTopWidth: 1,
    margin: 20
  }
});
