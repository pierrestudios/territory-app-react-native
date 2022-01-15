import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {Picker} from '@react-native-picker/picker';

import styles, { colors } from "../../styles/main";

export default class SelectPickerIOS extends React.Component {
  state = {
    isSelecting: false
  };

  render() {
    const { props, state } = this;

    return (
      <View>
        {state.isSelecting ? (
          <Picker
            selectedValue={props.value.value}
            style={styles["select-options-wrapper"]}
            itemStyle={styles["select-options"]}
            onValueChange={selectedValue => {
              typeof props.onInput === "function" &&
                props.onInput({
                  name: props.name,
                  "data-name": props["data-name"],
                  option: props.options.find(o => o.value === selectedValue)
                });

              // Delay for 1/2 sec
              setTimeout(() => this.setState({ isSelecting: false }), 500);
            }}
          >
            {props.renderOptions(props.options)}
          </Picker>
        ) : (
          <TouchableOpacity
            style={styles["date-input-wrapper"]}
            onPress={() => this.setState({ isSelecting: true })}
          >
            <Text
              style={[
                {
                  fontSize: 18,
                  fontWeight: "bold",
                  padding: 5,
                  color: colors.grey
                }
              ]}
            >
              {(props.value && props.value.label) || props.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
