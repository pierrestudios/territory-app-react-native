import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import UTILS from '../common/utils';

import styles, {colors} from '../styles/main';

export class Link extends React.Component {
  render() {
    const buttonStyle = UTILS.getElementStyles(this.props, styles["main-menu-link"]);
    if (!!this.props.disabled) {
      buttonStyle.style.push([styles.disabled]);
    }

    return (
      <TouchableOpacity
        {...buttonStyle}
        onPress={!!this.props.disabled ? () => console.log('disabled') : this.props.onPress}
        >
        <Text style={[styles["main-menu-button-text"], styles["text-color-blue"]]}> {this.props.children || this.props.title} </Text>
      </TouchableOpacity>
    )
  }
}

const ButtonLink = (props) => {
	// const classes = classNames(style['button-link'], {[style[props.class]]: props.class}, {[style.disabled]: props.disabled}, {[props.customClass]: props.customClass});
	// return <Link {...props} class={classes}>{props.children}</Link>;
};

export {ButtonLink};

export default class Button extends React.Component {
  render() {
    const buttonStyle = UTILS.getElementStyles(this.props, styles["main-menu-button"]);
    if (!!this.props.disabled) {
      buttonStyle.style.push([styles.disabled]);
    }

    return (
      <TouchableOpacity
        {...buttonStyle}
        onPress={!!this.props.disabled ? () => console.log('disabled') : this.props.onPress}
        >
        <Text style={styles["main-menu-button-text"]}> {this.props.children || this.props.title} </Text>
      </TouchableOpacity>
    )
  }
}