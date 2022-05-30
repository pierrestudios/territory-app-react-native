import React from "react";
import { Platform, Animated, ScrollView, View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Language from "../../common/lang";

import styles, { colors } from "../../styles/main";

import { Link } from "./Button";

class AnimatedModal extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),
  };

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  render() {
    let { fadeAnim } = this.state;

    return (
      <Animated.View
        style={[
          styles["modal-container"],
          {
            ...this.props.style,
            opacity: fadeAnim,
          },
        ]}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={[
            styles["scroll-view"],
            {
              flexGrow: 1,
              maxWidth: "100%",
            },
          ]}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === "ios"}
          extraHeight={130}
          extraScrollHeight={130}
        >
          <ScrollView>
            {this.props.children}
            <View
              style={{
                flex: 1,
                flexDirection: "row-reverse",
                justifyContent: "space-between",
                paddingRight: 20,
                paddingLeft: 20,
              }}
            >
              {this.props.customButtons ? (
                this.props.customButtons.map((buttonProps) => {
                  return (
                    <Link
                      key={`${buttonProps.label}-key`}
                      customStyle={[
                        {
                          borderColor: colors["grey-lite"],
                          borderWidth: 1,
                          borderRadius: 5,
                        },
                        buttonProps.buttonStyle,
                      ]}
                      onPress={buttonProps.onPress}
                    >
                      {buttonProps.iconBefore}
                      <Text style={buttonProps.textStyle}>
                        {buttonProps.label}
                      </Text>
                      {buttonProps.iconAfter}
                    </Link>
                  );
                })
              ) : (
                <Link
                  customStyle={{
                    borderColor: colors["grey-lite"],
                    borderWidth: 1,
                    borderRadius: 5,
                  }}
                  onPress={this.props.onCloseModal}
                >
                  <Text style={{ color: colors.red }}>
                    {Language.translate("Close")}
                  </Text>
                </Link>
              )}
            </View>
          </ScrollView>
        </KeyboardAwareScrollView>
      </Animated.View>
    );
  }
}

export default function Modal(props) {
  return !props.visible ? null : (
    <AnimatedModal {...props}>{props.children}</AnimatedModal>
  );
}
