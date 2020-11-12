import React from "react";
import PropTypes from "prop-types";
import {
  Dimensions,
  StyleSheet,
  Component,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  Text,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {theme} from 'galio-framework';
import {nowTheme} from '../../constants';

const Overlay = require("./overlay");

const window = Dimensions.get("window");

let searchHeight = 0;
let searchBorder = 25;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    borderColor: "#BDBDC1",
    borderWidth: 2 / window.scale,
    // borderRadius: searchBorder,
    backgroundColor: "white",
    opacity: 0.9
  }
});

class Items extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      items,
      onPress,
      width,
      height,
      location,
      show,
      handleClose,
      onChangeText,
      placeholder,
      initValue,
        type,
    } = this.props;
    let x = 0;
    let y = 0;
    if (location) {
      x = location.fx;
      y = location.fy;
    }

    searchHeight = height*3;

    const renderedItems = items.map((item, idx) => {
      return item.section ? (
        <View style={{ padding: 5,backgroundColor:nowTheme.COLORS.PROFILE_BORDER }} key={idx}>
          <Text style={{ fontWeight: "bold", color:nowTheme.COLORS.PRIMARY }}>{item.label}</Text>
        </View>
      ) : (
        <TouchableOpacity
            onPress={() => onPress(item.key, item.label)}
          key={idx}
        >
          <View style={{ padding: 5 }}>
            <Text style={{ marginLeft: 20}}>{item.label}</Text>
          </View>
        </TouchableOpacity >
      );
    });

    if(items.length == 0){
      searchHeight = 0;
    }

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={show}
        onRequestClose={handleClose}
      >
        <Overlay onPress={handleClose} />
        <View style={[styles.container, { left: x, top: y, width: width},
          (type == "음식") ?
              ((items.length ==0) ? {borderRadius:25} : {borderTopLeftRadius:25, borderTopRightRadius:25})
          :{borderRadius:0}]}>
          <View
            style={[{
                height: height,
                borderBottomColor: "#BDBDC1",
                // borderTopLeftRadius:25,
                // borderTopRightRadius:25,
                // borderRadius:25,
              }
              // ,(searchBorder == 30 ?  {borderRadius:30} : {borderRadius:0})
            ]}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center"
              }}
            >
              <Icon
                name="ios-search"
                style={{
                  color: "black",
                  fontSize: 26,
                  marginLeft: 5,
                  flex: 1
                }}
              />
              <TextInput
                onChangeText={onChangeText}
                placeholder={placeholder}
                value={initValue}
                underlineColorAndroid="transparent"
                style={{ flex: 5, margin: 0, padding: 0 }}
              />
            </View>
          </View>
          <ScrollView
            style={{ width: width - 2, height: searchHeight }}
            automaticallyAdjustContentInsets={false}
            bounces={false}
          >
            {renderedItems}
          </ScrollView>
        </View>
      </Modal>
    );
  }
}

Items.propTypes = {
  onPress: PropTypes.func
};

Items.defaultProps = {
  width: 0,
  height: 0,
  onPress: () => {}
};

module.exports = Items;
