import React from "react";
import { Text, View } from "react-native";

import UTILS from "../../common/utils";

import styles from "../../styles/main";

export default Heading = (props) => {
  return (
    <View {...UTILS.getElementStyles(props)}>
      <Text
        style={[
          styles.heading,
          styles["text-center"],
          props.textStyle ? props.textStyle : null,
        ]}
      >
        {props.children}
      </Text>
    </View>
  );
};

export const HeadingBlue = (props) => {
  return (
    <View {...UTILS.getElementStyles(props)}>
      <Text
        style={[
          styles.heading,
          styles["text-center"],
          styles["text-color-blue"],
          styles["text-strong"],
          {
            marginBottom: 20,
            marginTop: 0,
            fontSize: 22,
          },
          props.textStyle ? props.textStyle : null,
        ]}
      >
        {props.children}
      </Text>
    </View>
  );
};
