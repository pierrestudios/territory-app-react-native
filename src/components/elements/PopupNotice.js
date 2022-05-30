import React from "react";
import { View, Text } from "react-native";

import styles from "../../styles/main";
import { TextInput, DateInput, SelectBox, RadioBox, Switch } from "./FormInput";
import Message from "./Message";
import Modal from "./Modal";
import { HeadingBlue } from "./Heading";
import Line from "./Line";

export default class PopupNotice extends React.Component {
  closePopup() {
    typeof this.props.closeNotice === "function" && this.props.closeNotice();
  }

  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }

    const icon = null;
    const minWindowHeight = 400;
    const onFocus = () => {
      setTimeout(() => {
        if (window.innerHeight < minWindowHeight)
          this.setState({ SoftKeyBoard: true });
      }, 1000);
    };
    const onBlur = () => {
      this.setState({ SoftKeyBoard: false });
    };
    const getInputs = (data) => {
      if (data.inputs) {
        return data.inputs.map((a) => {
          a.removePlaceholder = true;
          switch (a.type) {
            case "TextInput":
              return (
                <TextInput
                  {...a}
                  key={`${a.name}-key`}
                  type="text"
                  showLabel={true}
                  onInput={saveData}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              );
            case "Switch":
              return (
                <Switch {...a} key={`${a.name}-key`} onChange={saveData} />
              );
            case "RadioBox":
              return (
                <RadioBox {...a} key={`${a.name}-key`} onChange={saveData} />
              );
            case "SelectBox":
              return (
                <SelectBox
                  {...a}
                  key={`${a.name}-key`}
                  showLabel={true}
                  onInput={saveData}
                  showDropDown={showDropDown}
                />
              );
            case "DateInput":
              return (
                <DateInput
                  {...a}
                  key={`${a.name}-key`}
                  showLabel={true}
                  onChange={saveData}
                />
              );

            default:
              return;
          }
        });
      }
    };
    const saveData = (e) => {
      if (typeof data.saveData === "function") data.saveData(e);
    };
    const getCustomButtons = (data) => {
      if (data.actions) {
        return data.actions.map((a) => ({
          ...a,
          onPress: a.action,
          buttonStyle: a.style,
        }));
      }
    };
    const showDropDown = (e, hide = false) => {
      if (window.innerHeight < minWindowHeight + 400) {
        this.setState({ openedDropDown: hide ? null : e.target });
      }
    };

    return (
      <Modal
        animationType="fade"
        visible={true}
        onCloseModal={() => {
          this.closePopup();
        }}
        customButtons={getCustomButtons(data)}
      >
        <View style={styles["modal-view"]}>
          <HeadingBlue>
            {icon}
            {data.title || "Notice!"}
          </HeadingBlue>

          <View style={styles["notice-box-message"]}>
            {typeof data.description === "string" ? (
              <Text>{data.description}</Text>
            ) : (
              data.description
            )}
          </View>

          <Message error={data.errorMesage} message={data.message} />

          {data.inputs ? <Line /> : null}
          <View style={styles["notice-box-inputs"]}>{getInputs(data)}</View>
        </View>
      </Modal>
    );
  }
}
