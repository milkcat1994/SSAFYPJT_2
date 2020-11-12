import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Component, View, Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 10
  }
});

class Option extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { style, styleText } = this.props;

    return (
      <View style={[styles.container, style]}>
        <Text style={styleText}>{this.props.children}</Text>
      </View>
    );
  }
}

Option.propTypes = {
  children: PropTypes.string.isRequired
};

module.exports = Option;
