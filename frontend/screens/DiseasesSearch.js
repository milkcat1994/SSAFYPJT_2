import React from 'react';
import http from '../utils/http-common';
import { StyleSheet, Dimensions, ScrollView, View } from 'react-native';
import { Block, theme, Text } from 'galio-framework';
import Select from '../utils/SelectBox/index';

import { Context, SearchConsumer } from '../contexts/search';
import nowTheme from '../constants/Theme';
import DiseaseSearchResult from './DiseaseSearchResult';
const { width } = Dimensions.get('screen');

class DiseasesSearch extends React.Component {
  searchType = '초기값';

  constructor(props, context) {
    super(props, context);
    this.searchType = '초기값';

    this.state = {
      value: Context._currentValue.state.diseasesSearchText,
      key: Context._currentValue.state.diseasesSearchKey,
      combiItems: [],
      reasonItems: [],
    };

    // console.log("궁합 검색")
    // console.log(Context._currentValue.state.searchText)
  }

  updateView() {
    let searchText = this.state.value;
    let rn = this;
    http
      .post('/disease', {
        name: searchText,
      })
      .then(({ data }) => {
        let combiFood = data.compDisease.map(function (obj) {
          let rObj = {};
          rObj['id'] = obj.id;
          rObj['foodA'] = obj.foodA;
          rObj['foodB'] = obj.foodB;
          rObj['title'] = obj.foodA + '&' + obj.foodB;
          rObj['image1'] = encodeURI('http://j3a306.p.ssafy.io/' + obj.foodA + '.jpg');
          rObj['image2'] = encodeURI('http://j3a306.p.ssafy.io/' + obj.foodB + '.jpg');
          rObj['type'] = '궁합';
          rObj['cta'] = '바로가기';
          return rObj;
        });
        console.log('~에 좋은 궁합 가져오기 성공');
        let reasonFood = data.incompDisease.map(function (obj) {
          let rObj = {};
          rObj['id'] = obj.id;
          rObj['foodA'] = obj.foodA;
          rObj['foodB'] = obj.foodB;
          rObj['title'] = obj.foodA + '&' + obj.foodB;
          rObj['image1'] = encodeURI('http://j3a306.p.ssafy.io/' + obj.foodA + '.jpg');
          rObj['image2'] = encodeURI('http://j3a306.p.ssafy.io/' + obj.foodB + '.jpg');
          rObj['type'] = '상극';
          rObj['cta'] = '바로가기';
          return rObj;
        });
        console.log('_유발 궁합 가져오기 성공');
        this.setState({
          combiItems: combiFood,
          reasonItems: reasonFood,
        });
        return;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  componentWillReceiveProps(nextProps) {
    // , value: nextProps.mainDisease
    this.setState({ combiItems: [], reasonItems: [], }, function () {
      // this.updateView();
    });
  }

  componentDidMount() {
    this.updateView(this.state);
  }

  // select 에서 궁합 검색 타입 변경 감지
  onSearchTypeSubmit(text) {
    this.searchType = text;
  }

  onSelectedItemsChange = (state, actions, key, value) => {
    // console.log("클릭")
    // 선택된 key 범위에 따라 navigate 다르게 진행
    let rn = this;
    // this.setState({ value: value }, function () {
      if (key < state.categoryIdx) {
        actions.searchC({ searchKey: key, searchText: value });
        rn.goCombiSearchScreen(value);
      } else {
        actions.searchD({ searchKey: key, searchText: value });
        rn.setState({ searchKey: key, value: value }, function () {
          rn.updateView(rn.state);
        });
      }
    // });
  };

  goCombiSearchScreen(value) {
    this.props.navigation.navigate('궁합검색',{
      mainFood: value,
    });
  }

  renderSearch = (state, actions) => {
    const { searchItemsList } = state;
    // if(state.searchType == "D")
    //   console.log("질병 검색의 Render")
    // console.log(this.state.value+","+this.state.key);
    // console.log(state.diseasesSearchText+","+state.diseasesSearchKey);
    // if(this.state.value !== state.searchText)
    //   this.setState({value:state.searchText, key:state.searchKey});

    return (
      <View style={styles.searchView}>
        <View style={{ justifyContent: 'center' }}>
          {/* 선택되면 바로 검색되도록*/}
          <Select
            style={styles.search}
            data={searchItemsList}
            width={330}
            height={48}
            initKey={state.diseasesSearchKey}
            placeholder="음식 또는 질병을 입력하세요"
            type="음식"
            onSelect={this.onSelectedItemsChange.bind(this, state, actions)}
            search={true}
          />
        </View>
      </View>
    );
  };

  renderDiseases = (state) => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.mainPage}>
        {/*궁합*/}
        <View style={{ flexDirection: 'row', flex: 1, paddingLeft: 10 }}>
          <View style={[styles.todayText]}>
            <Text
              size={20}
              style={{
                color: nowTheme.COLORS.PRIMARY,
                fontFamily: 'montserrat-bold',
              }}
            >
              {state.diseasesSearchText}에 좋은 궁합
            </Text>
          </View>
        </View>
        {/*<MainCarousel searchType={this.searchType} searchText={this.state.value} items={this.state.combiItems}/>*/}
        <DiseaseSearchResult items={this.state.combiItems} type={'궁합'} width={width} />
        {/*상극*/}
        <View style={{ flexDirection: 'row', flex: 1, marginTop: 20, paddingLeft: 10 }}>
          <View style={[styles.todayText]}>
            <Text
              size={20}
              style={{
                color: nowTheme.COLORS.PRIMARY,
                fontFamily: 'montserrat-bold',
              }}
            >
              {state.diseasesSearchText} 유발 궁합
            </Text>
          </View>
        </View>
        {/*<MainCarousel searchType={this.searchType} searchText={this.state.value} items={this.state.reasonItems} />*/}
        <DiseaseSearchResult items={this.state.reasonItems} type={'상극'} width={width} />
      </ScrollView>
    );
  };

  render() {
    return (
      <Block flex center style={styles.home}>
        <SearchConsumer>{({ state, actions }) => this.renderSearch(state, actions)}</SearchConsumer>
        <SearchConsumer>{({ state, actions }) => this.renderDiseases(state)}</SearchConsumer>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
  },
  mainPage: {
    // width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    // paddingHorizontal: 2,
    fontFamily: 'montserrat-regular',
  },
  todayText: {
    // alignItems: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  todayDropDown: {
    alignItems: 'flex-end',
    flex: 1,
  },
  searchView: {
    flexDirection: 'row',
    // height:70,
    marginVertical: 5,
  },
  searchIcon: {
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  search: {
    // height: 48,
    // marginHorizontal: 16,
    // borderWidth: 1,
    borderRadius: 30,
    borderColor: nowTheme.COLORS.BORDER,
  },
});

export default DiseasesSearch;
