import { StyleSheet } from "react-native";

export const colors = {
  "territory-blue": "#337ab7",
  "grey-lite": "#ccc",
  "grey-dark": "#333",
  grey: "#999",
  orange: "#F99538",
  red: "#F44336",
  "off-white": "#F3f3f3",
  white: "#fff",
  black: "#000",
  green: "#2f9e44",
  "green-bright": "#00d748",
};

/*
 * View Style Props: https://facebook.github.io/react-native/docs/view-style-props
 * Text Style Props: https://facebook.github.io/react-native/docs/text-style-props
 * Layout Props: https://facebook.github.io/react-native/docs/layout-props
 */

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  heading: {
    fontSize: 18,
    marginBottom: 40,
    marginTop: 40,
  },
  "scroll-view": {
    paddingVertical: 20,
    maxWidth: "90%",
  },
  section: {
    flex: 1,
    height: "100%",
  },

  // Menu
  "main-menu": {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 25,
    padding: 0,
  },
  "main-menu-button": {
    minWidth: "90%",
    alignItems: "center",
    backgroundColor: colors["territory-blue"],
    borderRadius: 3,
    padding: 10,
    marginBottom: 5,
    marginTop: 5,
  },
  "main-menu-link": {
    alignItems: "center",
    borderRadius: 3,
    padding: 10,
  },
  "button-link": {
    borderRadius: 3,
    paddingTop: 3,
    paddingBottom: 3,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 0,
    height: 30,
  },
  "button-link-text": {
    fontSize: 14,
    color: colors["territory-blue"],
  },
  "header-button": {
    alignItems: "center",
    borderRadius: 3,
    padding: 10,
  },
  "header-button-text": {
    fontSize: 14,
    color: colors.white,
  },
  "list-button": {
    minWidth: "90%",
    borderTopWidth: 1,
    borderColor: colors["grey-lite"],
  },
  disabled: {
    opacity: 0.2,
  },
  "main-menu-button-text": {
    fontSize: 18,
    color: colors.white,
  },

  // Form Inputs
  input: {
    minWidth: "90%",
    borderWidth: 1,
    borderRadius: 3,
    height: 50,
    padding: 10,
    fontSize: 18,
    marginTop: 5,
    marginBottom: 5,
    borderColor: colors["grey-lite"],
    backgroundColor: colors.white,
  },

  "date-input-wrapper": {
    width: "100%",
    borderWidth: 1,
    borderRadius: 3,
    height: 50,
    padding: 7,
    marginTop: 5,
    marginBottom: 5,
    borderColor: colors["grey-lite"],
    backgroundColor: colors.white,
  },

  "date-input": {
    width: "100%",
    borderWidth: 0,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  "input-icon-wrapper": {
    width: 18,
    position: "absolute",
    top: 23,
    left: 10,
    zIndex: 9,
  },

  "input-icon": {
    color: colors["grey-lite"],
  },

  "with-icon": {
    paddingLeft: 30,
  },

  "input-label": {
    marginTop: 10,
    marginBottom: 5,
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
    alignItems: "center",
  },

  listings: {
    backgroundColor: colors.white,
  },

  "listings-item": {
    padding: 10,
    height: 50,
    borderTopWidth: 1,
    borderColor: colors["grey-lite"],
    borderBottomWidth: 0,
    backgroundColor: colors.white,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between", // enum('flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly') (Vertical)
  },

  "listings-item-inactive": {
    backgroundColor: colors["grey-lite"],
  },

  "listings-item-warning": {
    backgroundColor: colors.red,
  },

  "listings-number": {
    backgroundColor: colors["grey-dark"],
    alignItems: "center",
    padding: 5,
    width: 35,
    height: 30,
  },

  "listings-number-text": {
    color: colors.white,
    fontSize: 16,
  },

  "listings-name": {
    padding: 5,
    overflow: "hidden",
    marginTop: 10,
    position: "absolute",
    left: 50,
    width: "55%",
    height: 40,
  },

  "listings-name-text": {
    color: colors["territory-blue"],
  },

  "listings-date": {
    position: "absolute",
    right: 15,
    marginTop: 15,
    height: 40,
  },

  "listings-date-text": {
    color: colors["grey"],
  },

  "listings-email": {
    position: "absolute",
    left: "55%",
    width: "45%",
    marginTop: 15,
    height: 40,
  },

  "listings-email-text": {
    fontSize: 12,
    color: colors["territory-blue"],
  },

  "listings-notes": {
    width: "35%",
    position: "absolute",
    right: 20,
    padding: 5,
    overflow: "hidden",
  },

  "add-notes": {
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors["grey-lite"],
  },

  "listings-notes-edit": {
    right: 10,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors["grey-lite"],
  },

  "address-listings-name": {
    left: 8,
    marginTop: 0,
  },

  "publisher-listings-name": {
    left: 8,
    marginTop: 10,
  },

  "user-listings-name": {
    left: 8,
    paddingTop: 0,
  },

  "listings-right-arrow": {
    position: "absolute",
    width: 10,
    height: "100%",
    top: 15,
    right: 5,
  },

  "input-options-container": {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    margin: 0,
    marginTop: 5,
    marginBottom: 15,
  },

  "input-options-button": {
    width: "31%",
    height: 90,
  },

  "input-options": {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: 90,
    padding: 0,
    margin: 2,
    backgroundColor: colors.white,
    borderColor: colors["grey-lite"],
    borderWidth: 1,
    borderRadius: 5,
  },

  "input-options-label": {
    padding: 5,
  },

  "input-options-active": {
    backgroundColor: colors["territory-blue"],
  },

  "input-options-icon": {
    color: colors["grey-lite"],
  },

  "input-options-icon-active": {
    color: colors.white,
  },

  "input-options-label-active": {
    color: colors.white,
  },

  "select-options-wrapper": {
    backgroundColor: colors.white,
    borderColor: colors["grey-lite"],
    borderWidth: 1,
    alignItems: "center",
  },

  "select-options": {
    height: 160,
    width: 200,
    fontSize: 22,
    marginTop: 0,
    marginBottom: 0,
  },

  "check-box": {
    borderColor: colors["grey-lite"],
    borderWidth: 5,
    margin: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignSelf: "center",
  },

  "check-box-checked": {
    backgroundColor: colors["territory-blue"],
    width: 20,
    height: 20,
    borderRadius: 10,
    alignSelf: "center",
  },

  // Territory Details
  "territory-heading": {
    flexDirection: "row-reverse", // enum('row', 'row-reverse', 'column', 'column-reverse')
    justifyContent: "flex-start",
    height: 60,
    padding: 20,
  },

  "heading-number": {
    backgroundColor: colors["grey-dark"],
    alignItems: "center",
    padding: 5,
    marginTop: 15,
    width: 35,
    height: 30,
    position: "absolute",
    right: 20,
  },

  "heading-button-link": {
    borderRadius: 3,
    alignItems: "center",
    padding: 5,
    paddingTop: 5,
    marginLeft: 5,
    marginRight: 0,
    marginTop: -3,
  },

  "border-grey-bg-lite": {
    borderColor: colors["grey-lite"],
    borderWidth: 1,
    backgroundColor: colors["off-white"],
  },

  "heading-button-link-text": {
    fontSize: 16,
  },

  "view-map-button": {
    backgroundColor: colors["territory-blue"],
  },

  "select-button": {
    backgroundColor: colors.orange,
  },

  "send-button": {
    backgroundColor: colors.green,
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
    height: "auto",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors["grey-lite"],
    backgroundColor: colors.white,
  },

  // Publisher Details
  "heading-publisher-name": {
    position: "absolute",
    color: colors["territory-blue"],
    right: 20,
    top: 20,
    fontSize: 18,
  },

  "heading-user-email": {
    position: "absolute",
    right: 20,
    top: 70,
    fontSize: 14,
  },

  "icon-button": {
    alignItems: "center",
    padding: 10,
  },

  // Modal
  "modal-container": {
    position: "absolute",
    top: 20,
    maxHeight: "100%",
    alignSelf: "center",
    width: "90%",
    padding: 5,
    borderWidth: 0,
    borderRadius: 5,
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

  "modal-view": { padding: 20 },

  // Common styles:
  "text-center": {
    textAlign: "center",
    width: "100%",
  },
  "text-strong": {
    fontWeight: "bold",
  },
  "text-white": {
    color: colors.white,
  },
  "text-color-blue": {
    color: colors["territory-blue"],
  },

  label: {
    marginBottom: 5,
    marginTop: 10,
  },

  "label-medium": {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 15,
  },

  line: {
    height: 2,
    borderColor: "#ccc",
    borderTopWidth: 1,
    margin: 20,
  },

  "line-blank": {
    height: 2,
    borderTopWidth: 0,
    margin: 10,
  },

  errors: {
    padding: 10,
    marginTop: 5,
    borderRadius: 3,
    marginBottom: 5,
    backgroundColor: colors.red,
  },

  success: {
    padding: 10,
    marginTop: 5,
    borderRadius: 3,
    marginBottom: 5,
    backgroundColor: colors.green,
  },
});
