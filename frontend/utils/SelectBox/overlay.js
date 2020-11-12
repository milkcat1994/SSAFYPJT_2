import React from "react";
import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from "react-native";

const window = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: window.width * 2,
    height: window.height * 2,
    top: -window.height,
    left: -window.width
  }
});

class Overlay extends React.Component {
  render() {
    const { show, onPress } = this.props;

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
    );
  }
}

module.exports = Overlay;
