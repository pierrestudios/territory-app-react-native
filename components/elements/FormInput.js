import React from "react";
import {
  Text,
  View,
  TextInput as TextInputRN,
  Switch as SwitchRN,
  Picker
} from "react-native";
import DatePicker from "react-native-datepicker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";

import style, { colors } from "../styles/main";
import { ButtonLink } from "./Button";
import Language from "../common/lang";

const getStyles = props => {
  const styles = props.baseStyle ? [props.baseStyle] : [style.input];
  if (!!props.icon) styles.push(style["with-icon"]);

  if (!!props.customStyle) styles.push(props.customStyle);

  return styles;
};

const getLabel = props => {
  return props.showLabel ? (
    <Text style={[style["label-medium"], style["text-color-blue"]]}>
      {props.label || props.placeholder}
    </Text>
  ) : null;
};

const getIconEl = (name, props) => {
  switch (name) {
    case "Feather":
      return <Feather {...props} />;
    case "Ionicons":
      return <Ionicons {...props} />;
    case "FontAwesome":
    default:
      return <FontAwesome {...props} />;
  }
};

const getIcon = props => {
  return !!props.icon ? (
    <View style={style["input-icon-wrapper"]}>
      {getIconEl(props.icon.el, {
        size: 14,
        name: props.icon.name,
        style: style["input-icon"]
      })}
    </View>
  ) : null;
};

const getError = props => {
  return !!props.error ? (
    <View style={[style.errors, style["input-errors"]]}>
      {/*<FaAlert size={18} />*/}
      <Text style={{ color: colors.white }}>{props.error}</Text>
    </View>
  ) : null;
};

const elemWrapper = (props, el) => {
  return (
    <View>
      {getLabel(props)}
      {getIcon(props)}
      {el}
      {getError(props)}
    </View>
  );
};

/*
 * Here we export the components
 * TextInput, DateInput, RadioBox, SelectBox, TextBox, Switch, etc...
 */

export const TextInput = props => {
  const finalProps = {
    ...props,
    underlineColorAndroid: "transparent", // Hide underline on Android
    editable: !props.disabled,
    inlineImageLeft: null, // The image resource must be inside /android/app/src/main/res/drawable and referenced like (inlineImageLeft='search_icon')
    onChangeText: value => props.onInput({ [props.name]: value }),
    placeholder: props.removePlaceholder
      ? ""
      : props.placeholder || props.label,
    style: getStyles(props)
  };
  return elemWrapper(finalProps, <TextInputRN {...finalProps} />);
};

export const DateInput = props => {
  const format = "YYYY-MM-DD";
  return (
    <DatePicker
      style={getStyles({ ...props, baseStyle: style["date-input-wrapper"] })}
      date={props.value}
      mode="date"
      placeholder={props.placeholder}
      format={format}
      // minDate="2018-05-01"
      // maxDate="2018-06-01"
      confirmBtnText={Language.translate("OK")}
      cancelBtnText={Language.translate("Cancel")}
      customStyles={{
        dateText: {
          fontSize: 16
        },
        dateInput: style["date-input"]
      }}
      showIcon={false}
      onDateChange={date => {
        props.onChange({ date });
      }}
    />
  );
};

export const RadioBox = props => {
  const activeOptStyle = [
    style["input-options"],
    style["input-options-active"]
  ];
  const activeIconStyle = [
    style["input-options-icon"],
    style["input-options-icon-active"]
  ];
  const activeLabelStyle = [
    style["input-options-label"],
    style["input-options-label-active"]
  ];
  const chooseOption = option => {
    if (typeof props.onChange === "function") {
      props.onChange({
        name: props.name,
        option: { label: option.label, value: option.value }
      });
    }
  };

  return (
    <View>
      {props.labelView ? (
        props.labelView
      ) : (
        <Text
          style={[
            style["options-label"],
            style["label-medium"],
            style["text-color-blue"]
          ]}
        >
          {props.label}
        </Text>
      )}
      <View style={style["input-options-container"]}>
        {props.options.map(o => (
          <ButtonLink
            key={`${o.value}-key`}
            customStyle={style["input-options-button"]}
            onPress={() => chooseOption(o)}
            customView={
              <View style={o.active ? activeOptStyle : style["input-options"]}>
                <Text
                  style={
                    o.active ? activeIconStyle : style["input-options-icon"]
                  }
                >
                  <FontAwesome
                    name={o["icon-name"] || "check-circle"}
                    size={24}
                  />
                </Text>
                <Text
                  numberOfLines={1}
                  style={
                    o.active ? activeLabelStyle : style["input-options-label"]
                  }
                >
                  {o.label}
                </Text>
              </View>
            }
          />
        ))}
      </View>
      {props.error ? (
        <View style={style["error-field"]}>
          <FontAwesome name="check-circle" size={14} />
          {props.error}
        </View>
      ) : null}
    </View>
  );
};

export const Switch = props => {
  return (
    <View>
      <Text style={[style["label-medium"], style["text-color-blue"]]}>
        {props.label}
      </Text>
      <SwitchRN
        onValueChange={value =>
          props.onChange && props.onChange({ [props.name]: value })
        }
        value={props.value}
        onTintColor={colors["territory-blue"]}
        tintColor={colors["grey-lite"]}
      />
    </View>
  );
};

export const SelectBox = props => {
  renderOptions = (options = []) => {
    // If no Label option, add it
    if (!options.find(o => o.value === "" && o.label === props.label)) {
      options.unshift({ value: "", label: props.label });
    }

    return options.map(o => (
      <Picker.Item key={`${o.value}-key`} label={o.label} value={o.value} />
    ));
  };

  return (
    <View>
      {props.showLabel ? (
        <Text style={[style["label-medium"], style["text-color-blue"]]}>
          {props.label || props.placeholder}
        </Text>
      ) : null}
      <Picker
        prompt={props.label}
        selectedValue={props.value.value}
        style={style["select-options-wrapper"]}
        itemStyle={style["select-options"]}
        onValueChange={selectedValue =>
          !!props.onInput &&
          props.onInput({
            name: props.name,
            "data-name": props["data-name"],
            option: props.options.find(o => o.value === selectedValue)
          })
        }
      >
        {this.renderOptions(props.options)}
      </Picker>
      {getError(props)}
    </View>
  );
};

export const TextBox = props => {
  const finalProps = {
    ...props,
    multiline: true,
    numberOfLines: 4
  };
  return <TextInput {...finalProps} />;
};

export const PhoneInput = props => {
  const finalProps = {
    ...props,
    keyboardType: "phone-pad"
  };
  return <TextInput {...finalProps} />;
};

export const EmailInput = props => {
  const finalProps = {
    ...props,
    keyboardType: "email-address",
    autoCapitalize: "none"
  };
  return <TextInput {...finalProps} />;
};

export const PasswordInput = props => {
  const finalProps = {
    ...props,
    secureTextEntry: true
  };
  return <TextInput {...finalProps} />;
};

export const NumberInput = props => {
  const finalProps = {
    ...props,
    keyboardType: "number-pad"
  };
  return <TextInput {...finalProps} />;
};
