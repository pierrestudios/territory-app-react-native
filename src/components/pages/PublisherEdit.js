import React from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Data from "../../common/data";
import Language from "../../common/lang";
import UTILS from "../../common/utils";

import Loading from "../elements/Loading";
import Message from "../elements/Message";
import { ButtonHeader } from "../elements/Button";
import { TextInput } from "../elements/FormInput";

import style from "../../styles/main";

export default class PublisherEdit extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      headerTitle: Language.translate("Edit Publisher"),
      headerRight: () => (
        <ButtonHeader
          onPress={() => {
            navigation.setParams({ savePublisher: true });
          }}
          title="Save"
          color="#fff"
        />
      ),
    };
  };
  state = {
    errors: {
      firstName: "",
      lastName: "",
      message: "",
    },
    data: {
      firstName: "",
      lastName: "",
    },
  };
  componentDidMount() {
    const { navigation } = this.props;
    const data = navigation.getParam("data");
    if (!!data) {
      this.setState({ data });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    const { navigation } = this.props;
    if (!!navigation.getParam("savePublisher")) {
      this.savePublisher();
      navigation.setParams({ savePublisher: false });
    }
  }
  render() {
    const { state, props } = this;
    // console.log('render:state', state)
    // console.log('render:props', props);

    if (!state.data) return <Loading />;

    return (
      <View style={[style.container]}>
        <KeyboardAwareScrollView
          contentContainerStyle={[style["scroll-view"], { marginBottom: 40 }]}
          keyboardDismissMode="interactive"
        >
          <Message error={state.errors.message} message={state.data.message} />
          <TextInput
            name="firstName"
            placeholder={Language.translate("First Name")}
            onInput={this.saveData}
            value={UTILS.formatDiacritics(state.data.firstName)}
            error={state.errors.firstName}
            showLabel={true}
          />
          <TextInput
            name="lastName"
            placeholder={Language.translate("Last Name")}
            onInput={this.saveData}
            value={UTILS.formatDiacritics(state.data.lastName)}
            error={state.errors.lastName}
            showLabel={true}
          />

          <View style={{ height: 60 }} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
  saveData = (data) => {
    console.log("data", data);
    const newData = { ...this.state.data, ...data };

    return this.setState({
      data: newData,
      errors: {
        firstName: "",
        lastName: "",
        message: "",
      },
    });
  };
  savePublisher = () => {
    if (!this.state.data.firstName || !this.state.data.firstName)
      return this.setState({
        errors: {
          ...this.state.errors,
          firstName: !this.state.data.firstName
            ? Language.translate("Enter First Name")
            : "",
          lastName: !this.state.data.lastName
            ? Language.translate("Enter Last Name")
            : "",
          message: Language.translate("Enter required fields"),
        },
      });

    // Data

    const postData = {
      firstName: this.state.data.firstName,
      lastName: this.state.data.lastName,
    };

    // console.log('postData', postData);
    const url = !!this.state.data.publisherId
      ? `publishers/${this.state.data.publisherId}/save`
      : `publishers/add`;

    // Update Publisher
    Data.postApiData(url, postData)
      .then((res) => {
        console.log("then() res", res);

        if (!res || res.error) {
          return this.setState({
            errors: {
              ...this.state.data.errors,
              mesage: "An error occured: ",
            },
          });
        }

        // update current Publisher in list
        if (
          !!this.state.data.publisherId &&
          typeof this.props.navigation.getParam("updatePublisher") ===
            "function"
        ) {
          const newPublisher = { ...this.state.data };

          this.props.navigation.getParam("updatePublisher")(newPublisher);
        }

        // add current Publisher in list
        else if (
          typeof this.props.navigation.getParam("addPublisher") === "function"
        ) {
          const newPublisher = { ...this.state.data };

          newPublisher.publisherId = res.publisherId;
          newPublisher.territories = [];
          this.props.navigation.getParam("addPublisher")(newPublisher);
        }

        this.props.navigation.goBack();
      })
      .catch((e) => {
        this.setState({
          errors: {
            ...this.state.errors,
            mesage: "An error occured: " + e,
          },
        });
      });
  };
}
