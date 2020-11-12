import React, { Component } from 'react';
import { withNavigation } from '@react-navigation/compat';
import {TouchableOpacity, StyleSheet, Platform, Dimensions, View, TouchableWithoutFeedback} from 'react-native';
import { Button, Block, NavBar, Text, theme, Button as GaButton } from 'galio-framework';
import {SearchConsumer, Context} from '../contexts/search';
import Select from '../utils/SelectBox/index'

import Icon from './Icon';
import Input from './Input';
import Tabs from './Tabs';
import nowTheme from '../constants/Theme';
const { height, width } = Dimensions.get('window');
const iPhoneX = () =>
  Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

const BellButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate('Pro')}
  >
    <Icon
      family="Feather"
      size={16}
      name="bell"
      color={nowTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    <Block middle style={[styles.notify, { backgroundColor: nowTheme.COLORS[isWhite ? 'WHITE' : 'PRIMARY'] }]} />
  </TouchableOpacity>
);

const SettingButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('설정')}>
    <Icon
      family="Feather"
      size={16}
      name="settings"
      color={nowTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
  </TouchableOpacity>
);

const EditButton = ({ isWhite, style, navigation }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={() => navigation.navigate('Pro')}>
      <Icon
          family="AntDesign"
          size={16}
          name="form"
          color={nowTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
      />
    </TouchableOpacity>
);



class Header extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  // 질병, 음식 선택시에 각각 다른 쪽으로 navigate 진행
  // 전체 coontext에 해당 검색어 가지고 있기? 결과 가지고 있기?
  onSelectedItemsChange = (actions, key, value) => {
    actions.search({searchKey: key, searchText: value})
    this.setState({ value: value });

    this.gocombiSearchScreen();
  };

  // 음식 궁합 검색
  gocombiSearchScreen(){
    this.props.navigation.navigate("궁합검색");
  }

  handleLeftPress = () => {
    const { back, navigation } = this.props;
    return back ? navigation.goBack() : navigation.openDrawer();
  };
  renderRight = () => {
    const { white, title, navigation } = this.props;


    if (title === 'Title') {
      return [
        <BellButton key="chat-title" navigation={navigation} isWhite={white} />,
        <SettingButton key="basket-title" navigation={navigation} isWhite={white} />
      ];
    }

    switch (title) {
      case '메인화면':
        return [
          <BellButton key="chat-home" navigation={navigation} isWhite={white} />,
          <SettingButton key="setting-home" navigation={navigation} isWhite={white} />
        ];
      case '취향지도':
        return [
          <BellButton key="chat-categories" navigation={navigation} />,
          <SettingButton key="setting-categories" navigation={navigation} />
        ];
      case '커뮤니티':
        return [
          <BellButton key="chat-categories" navigation={navigation} isWhite={white} />,
          <SettingButton key="setting-commumity" navigation={navigation} isWhite={white} />
        ];
      case '영양관리':
        return [
          <BellButton key="chat-deals" navigation={navigation} isWhite={white} />,
          <SettingButton key="setting-deals" navigation={navigation} isWhite={white} />
        ];
      case '프로필':
        return [
          <EditButton key="edit-profile" navigation={navigation} isWhite={white}/>,
          <SettingButton key="setting-profile" navigation={navigation} isWhite={white} />
        ];
      case '로그인':
        return [
              <BellButton key="chat-profile" navigation={navigation} />,
              <SettingButton key="setting-login" navigation={navigation} />
        ];
      case '뭐랑 먹지?':
        return [
          <BellButton key="combi-search-profile" navigation={navigation} />,
          <SettingButton key="combi-search-setting" navigation={navigation} />
        ];
      case 'Settings':
        return [
          <BellButton key="chat-search" navigation={navigation} isWhite={white} />,
          <SettingButton key="basket-search" navigation={navigation} isWhite={white} />
        ];
      default:
        break;
    }
  };
  renderSearch = (state, actions) => {
    const { value, items } = this.state;
    console.log("render")
    console.log(this.state.value);
    return (
        <View style={styles.searchView}>
          <View
            style={{justifyContent:'center'}}
          >
            {/* 선택되면 바로 검색되도록*/}
            <Select
                style={styles.search}
                data={items}
                width={330}
                height={48}
                initKey={this.state.key}
                placeholder="음식 또는 질병을 입력하세요"
                onSelect={this.onSelectedItemsChange.bind(this, actions)}
                search={true}
            />
          </View>
        </View>
    );
  };
  renderOptions = () => {
    const { navigation, optionLeft, optionRight } = this.props;

    return (
      <Block row style={styles.options}>
        <Button
          shadowless
          style={[styles.tab, styles.divider]}
          onPress={() => console.log(navigation.navigate('Pro'))}
        >
          <Block row middle>
            <Icon
              name="bell"
              family="NowExtra"
              size={18}
              style={{ paddingRight: 8 }}
              color={nowTheme.COLORS.HEADER}
            />
            <Text style={{ fontFamily: 'montserrat-regular' }} size={16} style={styles.tabTitle}>
              {optionLeft || 'Beauty'}
            </Text>
          </Block>
        </Button>
        <Button shadowless style={styles.tab} onPress={() => navigation.navigate('Pro')}>
          <Block row middle>
            <Icon
              size={18}
              name="bag-162x"
              family="NowExtra"
              style={{ paddingRight: 8 }}
              color={nowTheme.COLORS.HEADER}
            />
            <Text style={{ fontFamily: 'montserrat-regular' }} size={16} style={styles.tabTitle}>
              {optionRight || 'Fashion'}
            </Text>
          </Block>
        </Button>
      </Block>
    );
  };

  renderTabs = () => {
    const { tabs, tabIndex, navigation } = this.props;
    const defaultTab = tabs && tabs[0] && tabs[0].id;

    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => navigation.setParams({ tabId: id })}
      />
    );
  };
  renderHeader = (state, actions) => {
    const { search, options, tabs } = this.props;
    if (search || tabs || options) {
      return (
        <Block center>
          {search ? this.renderSearch(state, actions) : null}
          {options ? this.renderOptions() : null}
          {tabs ? this.renderTabs() : null}
        </Block>
      );
    }
  };
  render() {
    const {
      back,
      title,
      white,
      transparent,
      bgColor,
      iconColor,
      titleColor,
      navigation,
      ...props
    } = this.props;

    const noShadow = ['메인화면', 'Categories', '뭐랑 먹지?', 'Pro', '프로필','로그인'].includes(title);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null,{
      }
    ];

    const navbarStyles = [styles.navbar, bgColor && { backgroundColor: bgColor },
      (!['로그인'].includes(title) && {
        borderColor: nowTheme.COLORS.PRIMARY,
        borderBottomWidth: 1
      }
    )];

    return (
      <Block style={headerStyles}>
        <NavBar
          back={false}
          title={title}
          style={navbarStyles}
          transparent={transparent}
          // right={this.renderRight()}
          rightStyle={{ alignItems: 'center' }}
          left={
            <Icon
              name={back ? 'minimal-left2x' : 'align-left-22x'}
              family="NowExtra"
              size={16}
              onPress={this.handleLeftPress}
              color={iconColor || (white ? nowTheme.COLORS.WHITE : nowTheme.COLORS.ICON)}
            />
          }
          leftStyle={{ paddingVertical: 12, flex: 0.2 }}
          titleStyle={[
            styles.title,
            { color: nowTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
            titleColor && { color: titleColor }
          ]}
          {...props}
        />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative'
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'montserrat-regular'
  },
  navbar: {
    paddingVertical: 0,
    // paddingBottom: theme.SIZES.BASE * 1.5,
    // IphoneX일경우 paddingTop가 4배 이지만 G7도 Iphone으로 인식하여 잠시 삭제
    // paddingTop: iPhoneX ? theme.SIZES.BASE: theme.SIZES.BASE,
    // borderColor: nowTheme.COLORS.PRIMARY,
    // borderBottomWidth: 1,
    zIndex: 5
  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3
  },
  notify: {
    backgroundColor: nowTheme.COLORS.SUCCESS,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 9,
    right: 12
  },
  header: {
    backgroundColor: theme.COLORS.WHITE
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON
  },
  searchView:{
    flexDirection:'row',
    // height:70,
    marginVertical: 5,
  },
  searchIcon:{
    marginHorizontal:10,
    justifyContent:'center'
  },
  search: {
    borderRadius: 30,
    borderColor: nowTheme.COLORS.BORDER,
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400',
    color: nowTheme.COLORS.HEADER
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center'
  },
});

export default withNavigation(Header);
