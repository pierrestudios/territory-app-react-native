import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import UTILS from '../common/utils';

export const Link = (props) => {
  return (
    <Button {...props} baseStyle={styles["main-menu-link"]} textStyle={[styles["button-link-text"], styles["text-color-blue"], props.textStyle]} />
  )
}

export const ButtonLink = (props) => {
	return (
    <Button {...props} baseStyle={styles["button-link"]} textStyle={[styles["button-link-text"], props.textStyle]} />
  )
}; 

export const ButtonHeader = (props) => {
	return (
    <Button {...props} baseStyle={styles["header-button"]} textStyle={[styles["header-button-text"], props.textStyle]} />
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
      {props.customView ? props.customView :
        <Text style={[styles["main-menu-button-text"], (props.textStyle || null), (props.textColorWhite ? styles["text-white"] : null)]}> {props.children || props.title} </Text>
      }
    </TouchableOpacity>
  )
}