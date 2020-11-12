import React from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { useSafeArea } from "react-native-safe-area-context";
import Images from "../constants/Images";
import {DrawerItem as DrawerCustomItem, Icon, Input} from '../components';

import nowTheme from "../constants/Theme";
import {AuthConsumer} from '../contexts/auth';

const { width } = Dimensions.get("screen");

function CustomDrawerContent({
  drawerPosition,
  navigation,
  profile,
  focused,
  state,
  ...rest
}) {
  const insets = useSafeArea();
  let selectedIdx = state.index;
  const screens = [
    "메인화면",
    "취향지도",
    // "커뮤니티",
    "영양관리",
    "프로필",
  ];
  return (
    <AuthConsumer>
      {
        ({state}) => (
    <Block
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <Block style={styles.header}>
        {/* 아래 블럭 누를 시 로그인 창으로 이동 필요*/}

        <Block style={styles.headerProfile}>
          {/*비 로그인시 로그인 필요하다는 멘트 필요*/}
          {/*로그인을 해주세요*/}
          {
            state.img == '' ?
            <Image style={styles.profile} source={Images.UnknownProfileImg} />
            :
            <Image style={styles.profile} source={{uri:state.img}} />
          }
          <Text style={styles.headerNickname}>
            {state.isLoggedIn ? state.nickname : "로그인을 해주세요"}
          </Text>
        </Block>
        <Block right style={styles.headerIcon}>
          <Icon
            name="align-left-22x"
            family="NowExtra"
            size={15}
            color={"white"}
          />
        </Block>
      </Block>
      <Block flex style={{ paddingLeft: 8, paddingRight: 14 }}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {screens.map((item, index) => {
            return (
              <DrawerCustomItem
                title={item}
                key={index}
                navigation={navigation}
                focused={state.index === index ? true : false}
              />
            );
          })}
          <Block flex style={{ marginTop: 24, marginVertical: 8, paddingHorizontal: 8 }}>
          <Block
            style={{ borderColor: 'white', width: '93%', borderWidth: StyleSheet.hairlineWidth, marginHorizontal: 10}}
          />
          {/*<Text*/}
          {/*  color={nowTheme.COLORS.WHITE}*/}
          {/*  style={{ marginTop: 30, marginLeft: 20, marginBottom: 10, fontFamily: 'montserrat-regular', fontWeight: '300', fontSize: 12}}*/}
          {/*>*/}
          {/*  DOCUMENTATION*/}
          {/*</Text>*/}
        </Block>
          {
          state.isLoggedIn ?
              <DrawerCustomItem title="로그아웃" navigation={navigation}/>
              :
              <Block>
                <DrawerCustomItem title="로그인" focused={selectedIdx === screens.length ? true : false} navigation={navigation}/>
                {/* <DrawerCustomItem title="회원가입" focused={selectedIdx === screens.length+1 ? true : false} navigation={navigation}/> */}
              </Block>
          }
        </ScrollView>
      </Block>
    </Block>
              )
            }
          </AuthConsumer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE * 2,
    justifyContent: "center"
  },
  headerIcon: {
    marginTop: -20
  },
  headerProfile:{
    flexDirection:"row"
  },
  headerNickname:{
    color:"white",
    marginLeft:10,
    marginTop:10
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 70
  }
});

export default CustomDrawerContent;
