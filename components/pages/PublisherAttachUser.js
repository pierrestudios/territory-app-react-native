import React from "react";
import { Text, View } from "react-native";

import Data from "../common/data";
import Language from "../common/lang";
import UTILS from "../common/utils";

import Loading from "../elements/Loading";
import Message from "../elements/Message";
import { ButtonHeader, ButtonLink, Button } from "../elements/Button";
import { SelectBox } from "../elements/FormInput";

import style, { colors } from "../styles/main";

export default class PublisherAttachUser extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      ...UTILS.headerNavOptionsDefault,
      title: Language.translate("Attach to Publisher"),
      headerRight: <View /> // To center on Andriod
    };
  };
  state = {
    data: null,
    unattachedPublishers: null,
    newPublisher: null,
    errors: {
      newPublisher: "",
      message: ""
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
    const unattachedPublishers = navigation.getParam("unattachedPublishers");
    if (!!data && !!unattachedPublishers) {
      this.setState({ data, unattachedPublishers });
    }
  }
  render() {
    const state = this.state || {};
    const props = this.props || {};
    // console.log('render:state', state)
    // console.log('render:props', props);

    if (!state.data || !state.unattachedPublishers) return <Loading />;

    return (
      <View
        style={[
          styles.section,
          styles.content,
          {
            borderColor: colors.red,
            borderWidth: 0,
            paddingRight: 20,
            paddingLeft: 20,
            minWidth: "90%"
          }
        ]}
      >
        <Message error={state.errors.message} message={state.data.message} />

        <SelectBox
          name="publisher"
          data-name="publisherId"
          showLabel={true}
          label={Language.translate("Select Publisher")}
          options={state.unattachedPublishers.map(p => ({
            label: p.firstName + " " + p.lastName,
            value: p.publisherId
          }))}
          value={{
            value: state.newPublisher && state.newPublisher.value,
            label: state.newPublisher && state.newPublisher.label
          }}
          error={state.errors.publisherId}
          onInput={this.saveData}
        />

        <Button
          customStyle={{ backgroundColor: colors.green }}
          disabled={!state.newPublisher || !state.newPublisher.value}
          onPress={this.attachPublisher}
        >
          {Language.translate("Attach Publisher")}
        </Button>

        <View style={{ height: 60 }} />
      </View>
    );
  }
  /*
  updatePublisherAfterRemoveTerritory = (data, publisherId = null) => {
    const unattachedPublishers = this.state.unattachedPublishers.slice();
    const publisher = this.state.data.publishers.find(t => t.publisherId === publisherId);
    // console.log('publisher', publisher);

    if (!!publisher) {
      unattachedPublishers.push(publisher);
    }
    
		this.setState({data, unattachedPublishers}, () => {
      if (typeof this.props.navigation.getParam('updatePublisher') === 'function') {
        this.props.navigation.getParam('updatePublisher')(data, unattachedPublishers);
      }
    })
  }
  */
  saveData = data => {
    console.log("data", data);
    const newData = { ...this.state.newPublisher, ...data.option };

    return this.setState({
      newPublisher: newData,
      errors: {
        newPublisher: "",
        message: ""
      }
    });
  };
  attachPublisher = () => {
    if (!this.state.newPublisher || !this.state.newPublisher.value) {
      return this.setState({
        errors: {
          ...this.state.errors,
          message: Language.translate("Publisher is required")
        }
      });
    }

    const postData = {
      userId: this.state.data.userId,
      publisherId: this.state.newPublisher.value
    };

    console.log("postData", postData);

    // Update User
    Data.postApiData(`publishers/attach-user`, postData)
      .then(res => {
        // console.log('then() data', data)

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
          newUser.publisher = this.state.unattachedPublishers.find(
            p => p.publisherId === postData.publisherId
          );
          const newUnattachedPublishers = this.state.unattachedPublishers.filter(
            p => p.publisherId !== postData.publisherId
          );
          this.props.navigation.getParam("updateUser")(
            newUser,
            newUnattachedPublishers
          );
        }

        return this.props.navigation.goBack();

        /*
      if (callerName === 'Users') {
        const newUsersData = (caller.state.users || []).map(u => {
          if (u.userId === data.userId)
            return {...data, publisher: caller.state.unattachedPublishers.find(p => p.publisherId === postData.publisherId) };
          return u;	
        });
        this.setState({
          errors: {
            newPublisher: '',
            message: ''
          },
          users: newUsersData,
          unattachedPublishers: newUnattachedPublishers
        });
      }
      */
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
