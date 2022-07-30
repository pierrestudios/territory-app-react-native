import React from "react";
import {
  Text,
  View,
  TextInput as TextInputRN,
  Switch as SwitchRN,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CheckBoxRN from "@react-native-community/checkbox";
import DatePicker from "@react-native-community/datetimepicker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import style, { colors, webStyles } from "../../styles/main";
import { ButtonLink } from "./Button";
import DatePickerAndroid from "./DatePickerAndroid";
import SelectPickerIOS from "./SelectPickerIOS";
import utils from "../../common/utils";
import SelectPickerWeb from "./SelectPickerWeb";

const getStyles = (props) => {
  const styles = props.baseStyle ? [props.baseStyle] : [style.input];
  if (!!props.icon) styles.push(style["with-icon"]);

  if (!!props.customStyle) styles.push(props.customStyle);

  return styles;
};

const getLabel = (props) => {
  return props.showLabel ? (
    <InputLabel>{props.label || props.placeholder}</InputLabel>
  ) : null;
};

const getIconEl = (name, props) => {
  switch (name) {
    case "MaterialIcons":
      return <MaterialIcons {...props} />;
    case "Feather":
      return <Feather {...props} />;
    case "Ionicons":
      return <Ionicons {...props} />;
    case "FontAwesome":
    default:
      return <FontAwesome {...props} />;
  }
};

const getIcon = (props) => {
  return !!props.icon ? (
    <View style={style["input-icon-wrapper"]}>
      {getIconEl(props.icon.el, {
        size: 14,
        name: props.icon.name,
        style: style["input-icon"],
      })}
    </View>
  ) : null;
};

const getError = (props) => {
  return !!props.error ? (
    <View style={[style.errors, style["input-errors"]]}>
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
 * getIconElement
 * utils function for icon element
 */
export const getIconElement = (props) => {
  return getIconEl(props);
};

/*
 * Here we export the components
 * InputLabel, TextInput, DateInput, RadioBox, SelectBox, TextBox, Switch, etc...
 */

export const InputLabel = (props) => {
  return (
    <Text
      style={[style["label-medium"], style["text-color-blue"], props.style]}
    >
      {props.children}
    </Text>
  );
};

export const TextInput = (props) => {
  const finalProps = {
    ...props,
    underlineColorAndroid: "transparent", // Hide underline on Android
    editable: !props.disabled,
    inlineImageLeft: null, // The image resource must be inside /android/app/src/main/res/drawable and referenced like (inlineImageLeft='search_icon')
    onChangeText: (value) => props.onInput({ [props.name]: value }),
    placeholder: props.removePlaceholder
      ? ""
      : props.placeholder || props.label,
    style: getStyles(props),
  };
  return elemWrapper(finalProps, <TextInputRN {...finalProps} />);
};

export const DateInput = (props) => {
  const dateValue =
    props.value && typeof props.value.getMonth === "function"
      ? props.value
      : utils.getDateObject(props.value);

  return {
    android: <DatePickerAndroid {...props} value={dateValue} />,
    ios: (
      <DatePicker
        value={dateValue}
        onChange={(e, date) => {
          props.onChange({ date });
        }}
      />
    ),
    web: (
      <input
        {...{ ...props, value: utils.formatDate(props.value, "YYYY-MM-DD") }}
        onChange={({ target }) => {
          props.onChange({ date: utils.getDateObject(target.value) });
        }}
        type="date"
        style={webStyles.date}
      />
    ),
  }[Platform.OS];
};

export const RadioBox = (props) => {
  const activeOptStyle = [
    style["input-options"],
    style["input-options-active"],
  ];
  const activeIconStyle = [
    style["input-options-icon"],
    style["input-options-icon-active"],
  ];
  const activeLabelStyle = [
    style["input-options-label"],
    style["input-options-label-active"],
  ];
  const chooseOption = (option) => {
    if (typeof props.onChange === "function") {
      props.onChange({
        name: props.name,
        option: { label: option.label, value: option.value },
      });
    }
  };

  return (
    <View>
      {props.labelView ? (
        props.labelView
      ) : (
        <InputLabel style={[style["options-label"]]}>{props.label}</InputLabel>
      )}
      <View style={[style["input-options-container"], { flexWrap: "wrap" }]}>
        {props.options.map((o) => (
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

export const Checkbox = (props) => {
  /*
Warning: React.jsx: type is invalid -- expected a string (for built-in components) 
or a class/function (for composite components) but got: undefined. You likely forgot 
to export your component from the file it's defined in, or you might have mixed up 
default and named imports.

Check the render method of `Checkbox`.
  */
  return (
    <View
      nativeID={`checkbox-${props.name || Math.random()}`}
      style={Platform.OS === "web" ? { flexDirection: "row" } : null}
    >
      {props.label ? <InputLabel>{props.label}</InputLabel> : null}
      <TouchableOpacity
        style={[style["check-box"], props.style]}
        onPress={(value) =>
          props.onChange && props.onChange({ [props.name]: value })
        }
      >
        <View
          style={props.value === true ? style["check-box-checked"] : null}
        />
      </TouchableOpacity>
      {/*
        {
          ios: (
            <TouchableOpacity
              style={[style["check-box"], props.style]}
              onPress={(value) =>
                props.onChange && props.onChange({ [props.name]: value })
              }
            >
              <View
                style={props.value === true ? style["check-box-checked"] : null}
              />
            </TouchableOpacity>
          ),
          android:
            Platform.OS === "web" ? null : (
              <CheckBoxRN
                style={style["check-box"]}
                onChange={(value) =>
                  props.onChange && props.onChange({ [props.name]: value })
                }
                value={props.value}
              />
            ),
          web: <input type="checkbox" />,
        }[Platform.OS]
      */}
    </View>
  );
};

export const Switch = (props) => {
  return (
    <View>
      <InputLabel>{props.label}</InputLabel>
      <SwitchRN
        onValueChange={(value) =>
          props.onChange && props.onChange({ [props.name]: value })
        }
        value={props.value}
        trackColor={
          Platform.OS === "web" ? colors.grey : colors["territory-blue"]
        }
        ios_backgroundColor={colors["grey-lite"]}
      />
    </View>
  );
};

export const SelectBox = (props) => {
  const renderOptions = (options = []) => {
    // If no Label option, add it
    if (!options.find((o) => o.value === "" && o.label === props.label)) {
      options.unshift({ value: "", label: props.label });
    }

    return options.map((o) => (
      <Picker.Item key={`${o.value}-key`} label={o.label} value={o.value} />
    ));
  };

  return (
    <View>
      {props.showLabel ? (
        <InputLabel>{props.label || props.placeholder}</InputLabel>
      ) : null}
      {
        {
          android: (
            <Picker
              prompt={props.label}
              selectedValue={props.value.value}
              style={style["select-options-wrapper"]}
              itemStyle={style["select-options"]}
              onValueChange={(selectedValue) =>
                !!props.onInput &&
                props.onInput({
                  name: props.name,
                  "data-name": props["data-name"],
                  option: props.options.find((o) => o.value === selectedValue),
                })
              }
            >
              {renderOptions(props.options)}
            </Picker>
          ),
          ios: <SelectPickerIOS {...props} renderOptions={renderOptions} />,
          web: <SelectPickerWeb {...props} />,
        }[Platform.OS]
      }
      {getError(props)}
    </View>
  );
};

export const TextBox = (props) => {
  const finalProps = {
    ...props,
    multiline: true,
    numberOfLines: 4,
  };
  return <TextInput {...finalProps} />;
};

export const PhoneInput = (props) => {
  const finalProps = {
    ...props,
    keyboardType: "phone-pad",
  };
  return <TextInput {...finalProps} />;
};

export const EmailInput = (props) => {
  const finalProps = {
    ...props,
    keyboardType: "email-address",
    autoCapitalize: "none",
  };
  return <TextInput {...finalProps} />;
};

export const PasswordInput = (props) => {
  const finalProps = {
    ...props,
    secureTextEntry: true,
  };
  return <TextInput {...finalProps} />;
};

export const NumberInput = (props) => {
  const finalProps = {
    ...props,
    keyboardType: "number-pad",
  };
  return <TextInput {...finalProps} />;
};
