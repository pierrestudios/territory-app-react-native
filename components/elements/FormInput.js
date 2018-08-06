import React from 'react';
import { Text, View, TextInput as TextInputRN } from 'react-native';
 
import UTILS from '../common/utils';
 
import style from '../styles/main';
import {colors} from '../styles/main';

// import FaAlert from 'preact-icons/lib/fa/exclamation';

const getStyles = (props) => {
  const styles = [style.input];
  if (!!props.icon)
    styles.push(style['with-icon']);

	if (!!props.customClass)
    styles.push(props.customClass);

	return styles;
}

const getLabel = (props) => {
	return props.showLabel ? 
		<Text style={style['input-label']}>{props.label || props.placeholder}</Text>
	: null
}

const getIcon = (props) => {
	return null; // props.icon ? <span class={style['input-icon']}><props.icon size={14} /></span> : null
}

const getError = (props) => {
	return !!props.error ?
	  <View style={[style.errors, style["input-errors"]]}>
      {/*<FaAlert size={18} />*/}
      <Text style={{color: colors.white}}>{props.error}</Text>
    </View>
	: null
}

const elemWrapper = (props, el) => {
	return (
		<View>
			{getLabel(props)}
			{getIcon(props)}
			{el}
			{getError(props)}
		</View>
	)
}
 
export class TextBox extends React.Component {
  render() {
    const props = {
      ...this.props,
      multiline: true,
      numberOfLines: 4
    };
    return (
      <TextInput {...props} />
    )
  }
}

export class EmailInput extends React.Component {
  render() {
    const props = {
      ...this.props,
      keyboardType: 'email-address',
      autoCapitalize: 'none'
    };
    return (
      <TextInput {...props} />
    )
  }
}

export class PasswordInput extends React.Component {
  render() {
    const props = {
      ...this.props,
      secureTextEntry: true
    };
    return (
      <TextInput {...props} />
    )
  }
}
 
export class NumberInput extends React.Component {
  render() {
    const props = {
      ...this.props,
      keyboardType: 'numeric'
    };
    return (
      <TextInput {...props} />
    )
  }
}

export class TextInput extends React.Component {
  render() {
    const props = {
      ...this.props,
      onChangeText: (value) => this.props.onInput({[this.props.name]: value}), 
      placeholder: (this.props.removePlaceholder ? "" : (this.props.placeholder || this.props.label)),
      style: getStyles(this.props)
    };
    return (
      elemWrapper(props, <TextInputRN {...props} />)
    )
  }
}
