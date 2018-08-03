import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import styles, {colors} from '../styles/main';

const ALink = (props) => (
  // <Link {...props}>{props.children}</Link>
  <View>Link</View>
);

export {ALink};

const ButtonLink = (props) => {
	// const classes = classNames(style['button-link'], {[style[props.class]]: props.class}, {[style.disabled]: props.disabled}, {[props.customClass]: props.customClass});
	// return <Link {...props} class={classes}>{props.children}</Link>;
};

export {ButtonLink};

export default class Button extends React.Component {
  render() {
    // const classes = classNames(style.button, {[style[props.class]]: props.class}, {[style.disabled]: props.disabled}, {[props.customClass]: props.customClass});
    // return <button {...props} class={classes}>{props.children}</button>
    const buttonBlue = {
      style: [styles["main-menu-button"]]
    }
    if (!!this.props.disabled) {
      buttonBlue.style.push([styles.disabled]);
    }
    if (!!this.props.customStyle) {
      buttonBlue.style.push([this.props.customStyle]);
    }

    return (
      <TouchableOpacity
        {...buttonBlue}
        onPress={!!this.props.disabled ? () => console.log('disabled') : this.props.onPress}
        >
        <Text style={styles["main-menu-button-text"]}> {this.props.children || this.props.title} </Text>
      </TouchableOpacity>
    )
  }
}