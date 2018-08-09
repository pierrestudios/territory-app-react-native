import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import UTILS from '../common/utils';

export const Link = (props) => {
  return (
    <Button {...props} baseStyle={styles["main-menu-link"]} />
  )
}

export const ButtonLink = (props) => {
	return (
    <Button {...props} baseStyle={styles["button-link"]} textStyle={styles["button-link-text"]} />
  )
}; 

export const ButtonHeader = (props) => {
	return (
    <Button {...props} baseStyle={styles["header-button"]} textStyle={styles["header-button-text"]} />
  )
}; 

export const Button = (props) => {
  const buttonStyle = UTILS.getElementStyles(props, (props.baseStyle || styles["main-menu-button"]));
  if (!!props.disabled) {
    buttonStyle.style.push([styles.disabled]);
  }
  return (
    <TouchableOpacity
      {...buttonStyle}
      onPress={!!props.disabled ? () => console.log('disabled') : props.onPress}
      >
      <Text style={[styles["main-menu-button-text"], (props.textStyle || null), (props.textColorWhite ? styles["text-white"] : null)]}> {props.children || props.title} </Text>
    </TouchableOpacity>
  )
}