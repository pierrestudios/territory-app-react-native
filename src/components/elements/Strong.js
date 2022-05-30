import React from "react";
import { Text } from "react-native";

import styles from "../../styles/main";

export default function Strong(props) {
  props.style = props.style || [];
  props.style.push(styles["text-strong"]);
  return <Text {...props}>{props.children}</Text>;
}
