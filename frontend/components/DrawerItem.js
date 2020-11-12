import React from "react";
import { StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "./Icon";
import nowTheme from "../constants/Theme";
import {AuthConsumer, Context} from '../contexts/auth';
// import {Button} from './index';

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case "메인화면":
        return (
          <Icon
            name="home"
            family="AntDesign"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : "white"}
            style={{ opacity: 0.5 }}
          />
        );
      case "취향지도":
        return (
          <Icon
            name="map"
            family="Entypo"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : "white"}
            style={{ opacity: 0.5 }}
          />
        );
      case "커뮤니티":
        return (
          <Icon
            name="rest"
            family="AntDesign"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : "white"}
            style={{ opacity: 0.5 }}
          />
        );
      case "영양관리":
        return (
          <Icon
            name="linechart"
            family="AntDesign"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : "white"}
            style={{ opacity: 0.5 }}
          />
        );
      case "프로필":
        return (
          <Icon
            // name="profile-circle"
            // family="NowExtra"
            name="user"
            family="AntDesign"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : "white"}
            style={{ opacity: 0.5 }}
          />
        );
      case "로그인":
        return (
            <Icon
                name="login"
                family="Entypo"
                size={18}
                style={{ borderColor: "rgba(0,0,0,0.5)", opacity: 0.5 }}user
                color={focused ? nowTheme.COLORS.PRIMARY : "white"}
            />
        );
      case "로그아웃":
        return (
          <Icon
            name="log-out"
            family="Entypo"
            size={18}
            style={{ borderColor: "rgba(0,0,0,0.5)", opacity: 0.5 }}
            color={focused ? nowTheme.COLORS.PRIMARY : "white"}
          />
        );
      case "회원가입":
        return (
            <Icon
                name="adduser"
                family="AntDesign"
                size={18}
                style={{ borderColor: "rgba(0,0,0,0.5)", opacity: 0.5 }}
                color={focused ? nowTheme.COLORS.PRIMARY : "white"}
            />
        );
      default:
        return null;
    }
  };

  render() {
    const { focused, title, navigation } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (

        <AuthConsumer>
          {({state, actions}) => (
      <TouchableOpacity
        style={{ height: 60 }}
        onPress={() =>
          ['영양관리', '프로필'].includes(title)
            ? (state.isLoggedIn ? navigation.navigate(title) : navigation.navigate("로그인"))
            : (title == "로그아웃" ? (
                  actions.logout(),
              navigation.navigate("메인화면")) : (navigation.navigate(title)))
        }
      >
        <Block flex row style={containerStyles}>
          <Block middle flex={0.1} style={{ marginRight: 5 }}>
            {this.renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              style={{
                fontFamily: "montserrat-regular",
                textTransform: "uppercase",
                fontWeight: "300"
              }}
              size={12}
              bold={focused ? true : false}
              color={focused ? nowTheme.COLORS.PRIMARY : "white"}
            >
              {title}
            </Text>
          </Block>
        </Block>
      </TouchableOpacity>
          )
          }

            </AuthConsumer>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 15,
    paddingHorizontal: 14,
    color: "white"
  },
  activeStyle: {
    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 30,
    color: "white"
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
