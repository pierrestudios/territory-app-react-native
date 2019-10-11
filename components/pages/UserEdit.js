import React from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Data from "../common/data";
import Language from "../common/lang";
import UTILS from "../common/utils";

import Loading from "../elements/Loading";
import Message from "../elements/Message";
import { ButtonHeader } from "../elements/Button";
import { EmailInput, SelectBox } from "../elements/FormInput";

import style, { colors } from "../styles/main";

export default class UserEdit extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: Language.translate("Edit User"),
      headerRight: (
        <ButtonHeader
          onPress={() => {
            navigation.setParams({ saveUser: true });
          }}
          title="Save"
          color="#fff"
        />
      )
    };
  };
  state = {
    errors: {
      email: "",
      userType: ""
    },
    data: {
      email: "",
      userType: ""
    }
  };
  componentWillReceiveProps(props) {
    if (props.navigation) {
      if (!!props.navigation.getParam("saveUser")) this.saveUser();
    }
  }
  componentWillMount() {
    const { navigation } = this.props;
    const data = navigation.getParam("data");
    if (!!data) {
      this.setState({ data });
    }
  }
  render() {
    const state = this.state || {};

    if (!state.data) return <Loading />;

    return (
      <View style={[style.container]}>
        <KeyboardAwareScrollView
          contentContainerStyle={[style["scroll-view"], { marginBottom: 40 }]}
          keyboardDismissMode="interactive"
        >
          <Message error={state.errors.message} message={state.data.message} />
          <EmailInput
            name="email"
            placeholder={Language.translate("User Email")}
            onInput={this.saveData}
            value={UTILS.diacritics(state.data.email)}
            error={state.errors.email}
            showLabel={true}
          />

          <SelectBox
            name="userType"
            data-name="userType"
            showLabel={true}
            label={Language.translate("Choose account type")}
            options={UTILS.userTypes}
            value={
              UTILS.userTypes.find(t => t.value === state.data.userType) || {}
            }
            error={state.errors.streetId}
            onInput={this.saveOptionData}
          />

          <View style={{ height: 60 }} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
  saveData = data => {
    console.log("data", data);
    const newData = { ...this.state.data, ...data };

    return this.setState({
      data: newData,
      errors: {
        email: "",
        userType: "",
        message: ""
      }
    });
  };
  saveOptionData = data => {
    console.log("data", data);
    let newData = { ...this.state.data };
    if (data["data-name"]) newData[data["data-name"]] = data.option.value;

    if (data.option && data.option.label && data.option.value)
      newData[data.name] = data.option.value;

    this.setState({
      data: newData,
      errors: {
        ...this.state.errors,
        [data.name]: ""
      }
    });
  };

  saveUser = () => {
    if (
      !this.state.data.userType ||
      !this.state.data.email ||
      !UTILS.validEmail(this.state.data.email)
    )
      return this.setState({
        errors: {
          ...this.state.errors,
          email: !this.state.data.email
            ? Language.translate("Email is missing")
            : !UTILS.validEmail(this.state.data.email)
            ? Language.translate("Invalid email")
            : "",
          userType: !this.state.data.userType ? "Choose account type" : "",
          message: Language.translate("Enter required fields")
        }
      });

    // Data

    const postData = {
      email: this.state.data.email,
      userType: this.state.data.userType
    };

    const url = `users/${this.state.data.userId}/save`;

    // Update User
    Data.postApiData(url, postData)
      .then(res => {
        // console.log("then() res", res);

        if (!res || res.error) {
          return this.setState({
            errors: {
              ...this.state.data.errors,
              mesage: "An error occured "
            }
          });
        }

        // update current User in list
        if (
          !!this.state.data.userId &&
          typeof this.props.navigation.getParam("updateUser") === "function"
        ) {
          const newUser = { ...this.state.data };
          this.props.navigation.getParam("updateUser")(newUser);
        }

        this.props.navigation.goBack();
      })
      .catch(e => {
        this.setState({
          errors: {
            ...this.state.errors,
            mesage: "An error occured: " + e
          }
        });
      });
  };
}
