import React from 'react';
import { Text, View, TextInput as TextInputRN, Switch as SwitchRN, Picker } from 'react-native';
import DatePicker from 'react-native-datepicker';

import { FontAwesome, EvilIcons, Feather } from '@expo/vector-icons';
// import FaAlert from 'preact-icons/lib/fa/exclamation';

import UTILS from '../common/utils';
 
import style, {colors} from '../styles/main';
import {ButtonLink} from './Button';
import Language from '../common/lang';


const getStyles = (props) => {
  const styles = props.baseStyle ? [props.baseStyle] : [style.input];
  if (!!props.icon)
    styles.push(style['with-icon']);

	if (!!props.customStyle)
    styles.push(props.customStyle);

	return styles;
}

const getLabel = (props) => {
	return props.showLabel ? 
		<Text style={[style['label-medium'], style["text-color-blue"]]}>{props.label || props.placeholder}</Text>
	: null
}

const getIcon = (props) => {
	return props.icon ? <View style={style['input-icon-wrapper']}><props.icon.el size={14} name={props.icon.name} style={style['input-icon']} /></View> : null
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
 
export const DateInput = (props) => {
  const format = 'YYYY-MM-DD';
  return (
    <DatePicker
      style={getStyles({...props, baseStyle: style["date-input-wrapper"]})}
      date={props.value}
      mode="date"
      placeholder={props.placeholder}
      format={format}
      // minDate="2018-05-01"
      // maxDate="2018-06-01"
      confirmBtnText={Language.translate('OK')}
      cancelBtnText={Language.translate('Cancel')}
      customStyles={{
        dateText: {
          fontSize: 16
        },
        dateInput: style["date-input"]
      }}
      showIcon={false}
      onDateChange={(date) => {props.onChange({date})}}
    />
  )
}

export const RadioBox = (props) => {
	const activeOptStyle = [style['input-options'], style['input-options-active']]; 
	const activeIconStyle = [style['input-options-icon'], style['input-options-icon-active']]; 
	const activeLabelStyle = [style['input-options-label'], style['input-options-label-active']]; 
	const chooseOption = (option) => {
		if (typeof props.onChange === 'function') {
			props.onChange({
        name: props.name,
        option: {'label': option.label, 'value': option.value}
      });
    }  
	}

	return (
		<View>
			<Text style={[style['options-label'], style["label-medium"], style["text-color-blue"]]}>{props.label}</Text>
			<View style={style['input-options-container']}>
				{props.options.map(o => (
          <ButtonLink key={`${o.value}-key`} customStyle={style['input-options-button']} onPress={() => chooseOption(o)}
            customView={
              <View style={o.active ? activeOptStyle : style['input-options']}>
                <Text style={o.active ? activeIconStyle : style['input-options-icon']}>
                  <FontAwesome name="check-circle" size={24} />
                </Text>
                <Text style={o.active ? activeLabelStyle : style['input-options-label']}>{o.label}</Text>
              </View>
            }>
					</ButtonLink>
				))}
			</View>
			{props.error ?
				<View style={style['error-field']}>
					<FontAwesome name="check-circle" size={14} />{props.error} 
				</View>
				: null}
		</View>	
	);
}

export const Switch = (props) => {
  return (
    <View>
      <Text style={[style["label-medium"], style["text-color-blue"]]}>{props.label}</Text>
      <SwitchRN 
        onValueChange={ (value) => props.onChange && props.onChange({[props.name]: value})} 
        value={ props.value } 
        onTintColor={colors["territory-blue"]}
        tintColor={colors["grey-lite"]}
      /> 
    </View>
  )
}

export const SelectBox = (props) => {
  renderOptions = (options = []) => {
    options.unshift({value: '', label: props.label})
    return options.map((o) => (
      <Picker.Item key={`${o.value}-key`} label={o.label} value={o.value} />
    ));
  }
 
  return (
    <View>
      <Text style={[style['label-medium'], style["text-color-blue"]]}>{props.label || props.placeholder}</Text>
      <Picker
        prompt={props.label}
        selectedValue={props.value.value}
        style={style["select-options-wrapper"]}
        itemStyle={style["select-options"]}
        onValueChange={(selectedValue) => !!props.onInput && props.onInput({
          name: props.name,
          'data-name': props['data-name'],
          option: props.options.find(o => o.value === selectedValue)
        })}
        >
        {this.renderOptions(props.options)}
      </Picker>
    </View>
  );

}

export const TextBox = (props) => {
  const finalProps = {
    ...props,
    multiline: true,
    numberOfLines: 4
  };
  return (
    <TextInput {...finalProps} />
  )
}

export const PhoneInput = (props) => {
  const finalProps = {
    ...props,
    keyboardType: 'phone-pad'
  };
  return (
    <TextInput {...finalProps} />
  )
}

export const EmailInput = (props) => {
  const finalProps = {
    ...props,
    keyboardType: 'email-address',
    autoCapitalize: 'none'
  };
  return (
    <TextInput {...finalProps} />
  )
}

export const PasswordInput = (props) => {
  const finalProps = {
    ...props,
    secureTextEntry: true
  };
  return (
    <TextInput {...finalProps} />
  )
}
 
export const NumberInput = (props) => {
  const finalProps = {
    ...props,
    keyboardType: 'number-pad'
  };
  return (
    <TextInput {...finalProps} />
  )
}

export const TextInput = (props) => {
  const finalProps = {
    ...props,
    underlineColorAndroid: 'transparent', // 
    inlineImageLeft: null, // The image resource must be inside /android/app/src/main/res/drawable and referenced like (inlineImageLeft='search_icon')
    onChangeText: (value) => props.onInput({[props.name]: value}), 
    placeholder: (props.removePlaceholder ? "" : (props.placeholder || props.label)),
    style: getStyles(props)
  };
  return (
    elemWrapper(finalProps, <TextInputRN {...finalProps} />)
  )
}
