import React from 'react';
import { Animated, View, Text } from 'react-native';

import Language from '../common/lang';

import styles, {colors} from '../styles/main';

import {Link} from '../elements/Button'

class AnimatedModal extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
  }

  componentDidMount() {
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 300,              // Make it take a while
      }
    ).start();                        // Starts the animation
  }

  render() {
    let { fadeAnim } = this.state;

    return (
      <Animated.View                 // Special animatable View
        style={
          [styles["modal-container"], {
          ...this.props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
        }]}
      >
        {this.props.children}
        <View style={{flex: 1, flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 20}}>
          {this.props.customButtons ? 
            this.props.customButtons.map(buttonProps => (
              <Link
                key={`${buttonProps.label}-key`}
                customStyle={[{borderColor: colors["grey-lite"], borderWidth: 1, marginTop: 20, borderRadius: 5}, buttonProps.buttonStyle]}
                onPress={buttonProps.onPress}>
                <Text style={buttonProps.textStyle}>{buttonProps.label}</Text>
              </Link>
            ))
          :
          <Link
            customStyle={{borderColor: colors["grey-lite"], borderWidth: 1, marginTop: 20, borderRadius: 5}}
            onPress={this.props.onCloseModal}>
            <Text style={{color:colors.red}}>{Language.translate('Close')}</Text>
          </Link>
          }
        </View>
      </Animated.View>
    );
  }
}

export default Modal = (props) => {
  return !props.visible ? null : (
    <AnimatedModal {...props}>{props.children}</AnimatedModal>
  )
}