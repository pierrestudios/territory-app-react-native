import React from "react";
import { Text, View, ScrollView } from "react-native";

import Data from "../../common/data";
import Api from "../../common/api";
import Language from "../../common/lang";
import UTILS from "../../common/utils";
import getSiteSetting from "../../common/settings";
import NavigationService from "../../common/nav-service";

import Logo from "../elements/Logo";
import { EmailInput, PasswordInput } from "../elements/FormInput";
import { Button, Link } from "../elements/Button";
import Heading from "../elements/Heading";
import Message from "../elements/Message";
import Loading from "../elements/Loading";
import Line from "../elements/Line";

import style from "../../styles/main";

export default class Login extends React.Component {
  static navigationOptions = {
    ...UTILS.headerNavOptionsDefault,
    headerTitle: <Logo />,
    headerLeft: <View />, // To center on Andriod
    headerRight: <View />, // To center on Andriod
    headerBackImage: <View /> // Disabled
  };
  state = {
    data: {
      email: "",
      password: ""
    },
    errors: {
      email: "",
      password: "",
      message: ""
    },
    waitingForResponse: false
  };
  loadUserData() {
    (async () => {
      const user = await Data.loadSavedUser();
      // console.log("loadUserData() user:", user);

      if (!!user && !!user.email)
        this.setState({
          data: { ...this.state.data, email: user.email },
          user
        });
    })();
  }
  componentDidMount() {
    this.props.navigation.addListener("willFocus", () => {
      this.loadUserData();
    });

    this.loadUserData();
  }
  componentWillUpdate(props, state) {
    // console.log('componentWillUpdate() state', state)

    const user = Data.unAuthUser;

    if (!user || !user.apiUrl) {
      NavigationService.navigate("UserPrefs");
    }
  }
  render() {
    const state = this.state;
    // console.log('Login:render() state', state)

    if (state.waitingForResponse) return <Loading />;

    const apiPath = getSiteSetting("apiPath");
    const user = state.user;
    const isLoggedIn = !!user && !!user.token;

    return (
      <View style={[style.container]}>
        <Heading>{Language.translate("Sign in")}</Heading>
        <ScrollView contentContainerStyle={style["scroll-view"]}>
          <Message error={state.errors.message} message={state.data.message} />
          <EmailInput
            disabled={isLoggedIn}
            name="email"
            placeholder={Language.translate("Email")}
            onInput={this.saveData}
            value={this.state.data.email}
            error={this.state.errors.email}
            icon={{ el: "FontAwesome", name: "envelope" }}
          />
          {isLoggedIn
            ? null
            : [
                <PasswordInput
                  key="password"
                  name="password"
                  placeholder={Language.translate("Password")}
                  onInput={this.saveData}
                  value={this.state.data.password}
                  error={this.state.errors.password}
                  icon={{ el: "FontAwesome", name: "key" }}
                />,
                <Button key="send-login" onPress={this.sendLogin}>
                  {Language.translate("Sign in")}
                </Button>
              ]}

          <Line />

          <View style={style["inner-content"]}>
            {!!apiPath && (!user || !user.token) ? (
              [
                <Link
                  key="PasswordRetrieve"
                  onPress={() => NavigationService.navigate("PasswordRetrieve")}
                  textStyle={{ fontSize: 16 }}
                >
                  {Language.translate("Lost your password")}
                </Link>,
                <Link
                  key="Signup"
                  onPress={() => NavigationService.navigate("Signup")}
                  textStyle={{ fontSize: 16 }}
                >
                  {Language.translate("Create an account")}
                </Link>
              ]
            ) : isLoggedIn ? (
              <Link
                onPress={() => NavigationService.navigate("Home")}
                textStyle={{ fontSize: 16 }}
              >
                {Language.translate("Home")}
              </Link>
            ) : null}
            <Link
              onPress={() => NavigationService.navigate("UserPrefs")}
              textStyle={{ fontSize: 16 }}
            >
              {Language.translate("Server Url")}
            </Link>
          </View>
        </ScrollView>
      </View>
    );
  }
  saveData = newValue => {
    // console.log('newValue', newValue);
    const newData = { ...this.state.data, ...newValue };
    this.setState({ data: newData });
  };
  sendLogin = () => {
    // console.log('state', this.state);

    // First, reset errors
    const errors = {
      email: "",
      password: "",
      message: ""
    };

    this.setState({ errors, waitingForResponse: true });

    // Validate
    if (!this.state.data.email || !this.state.data.password)
      return this.setState({
        errors: {
          ...errors,
          email: !this.state.data.email
            ? Language.translate("Email is missing")
            : !UTILS.validEmail(this.state.data.email)
            ? Language.translate("Invalid email")
            : "",
          password: !this.state.data.password
            ? Language.translate("Password is missing")
            : ""
        },
        waitingForResponse: false
      });

    if (!UTILS.validEmail(this.state.data.email))
      return this.setState({
        errors: {
          ...errors,
          email: Language.translate("Invalid email")
        },
        waitingForResponse: false
      });

    // All good, send to api
    Api("signin", this.state.data, "POST")
      .then(data => {
        // console.log('data', data)
        if (data && data.token) {
          // Get User data
          Api("auth-user", null, "GET", {
            Authorization: "Bearer " + data.token
          }).then(user => {
            user.token = data.token;
            const newData = { ...this.state.data, ...user };
            Data.saveUser(user);

            // Need to wait for "saveUser" to complete before switching screen
            UTILS.waitForIt(
              () => !!Data.user && !!Data.user.token,
              () => {
                this.setState(
                  {
                    data: newData,
                    waitingForResponse: false
                  },
                  () => NavigationService.navigate("Home")
                );
              }
            );
          });
        }
      })
      .catch(e => {
        console.log("error", e);
        const errorMessage =
          typeof e === "string" && (e.match("email") || e.match("password"))
            ? e
            : Language.translate("Sign in failed");
        this.setState({
          errors: {
            ...errors,
            message: errorMessage
          },
          waitingForResponse: false
        });
      });
  };
}
