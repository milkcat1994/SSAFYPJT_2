import React from "react";
import http from "../utils/http-common";
import { StyleSheet, Dimensions, ScrollView, View } from "react-native";
import {Block, theme, Text} from 'galio-framework';
import Select from '../utils/SelectBox/index';
import SearchResult from './SearchResult';
import {Context, SearchConsumer} from '../contexts/search';
import nowTheme from "../constants/Theme"
const { width } = Dimensions.get("screen");

class CombiSearch extends React.Component {

  searchType = '초기값';

  constructor(props, context) {
    super(props, context);
    this.searchType = '초기값';

    this.state={
      value: Context._currentValue.state.combiSearchText,
      key: Context._currentValue.state.combiSearchKey,
      combiItems:[],
      diffItems:[],
    }

    // console.log("궁합 검색")
    console.log(Context._currentValue.state.combiSearchText)
  }

  updateView(test){
    console.log(test)
    // console.log(nextProps)
    // console.log(this.state)
    let searchText = this.state.value
    // let searchText = nextProps.mainFood
    let rn = this;
    console.log("이거다>>"+searchText)
    http
        .post("/compatibility",{
          foodA: searchText
        })
        .then(({data}) => {
          rn.mainCombi = data.map(function(obj){
            let rObj = {};
            let food = (searchText != obj.foodA) ? obj.foodA : obj.foodB
            rObj['id'] = obj.id;
            rObj['title'] = food;
            rObj['image'] = encodeURI("http://j3a306.p.ssafy.io/" + food + ".jpg");
            rObj['cta'] = '바로가기';
            return rObj;
          });;
          rn.setState({combiItems:this.mainCombi})
          console.log("궁합 가져오기 성공");
          return;
        })
        .catch(e => {
          console.log(e);
          console.log("궁합 가져오기 실패")
        });

    http
        .post("/incompatibility",{
          foodA: searchText
        })
        .then(({data}) => {
          rn.mainCombi = data.map(function(obj){
            var rObj = {};
            let food = (searchText != obj.foodA) ? obj.foodA : obj.foodB
            rObj['id'] = obj.id;
            rObj['title'] = food;
            rObj['image'] = encodeURI("http://j3a306.p.ssafy.io/" + food + ".jpg");
            rObj['cta'] = '바로가기';
            return rObj;
          });;
          rn.setState({diffItems:this.mainCombi})
          console.log("상극 가져오기 성공");
          return;
        })
        .catch(e => {
          console.log(e);
          rn.setState({diffItems:[]})
          console.log("상극 가져오기 실패")
        });
  }

  componentWillReceiveProps(nextProps){
    // value:nextProps.mainFood
    this.setState({combiItems:[], diffItems:[], }, function(){
      // this.updateView();
    })
  }

  componentDidMount(){
    this.updateView(this.state);
  }

  // select 에서 궁합 검색 타입 변경 감지
  onSearchTypeSubmit(text){
    this.searchType = text;
  }

  onSelectedItemsChange = (state, actions, key, value) => {
    // console.log("클릭")
    // 선택된 key 범위에 따라 navigate 다르게 진행
    let rn = this;
    // this.setState({ value: value }, function(){
      if(key < state.categoryIdx){
        actions.searchC({searchKey: key, searchText: value})
        // console.log("state변경")
        rn.setState({searchKey: key, value: value}, function(){
          rn.updateView(rn.state);
        })
      }
      else{
        actions.searchD({searchKey: key, searchText: value})
        rn.goDiseasesSearchScreen(value);
      }
    // });
  };

  goDiseasesSearchScreen(value){
    this.props.navigation.navigate("질병검색",{
      mainDisease: value,
    });
  }

  renderSearch = (state, actions) => {
    const { searchItemsList } = state;
    // if(state.searchType == "C")
    //   console.log("궁합 검색의 Render")
    // console.log(this.state.value+","+this.state.key);
    // console.log(state.combiSearchText+","+state.combiSearchKey);
    // if(this.state.value !== state.searchText)
    //   this.setState({value:state.searchText, key:state.searchKey});

    return (
        <View style={styles.searchView}>
          <View
              style={{justifyContent:'center'}}
          >
            {/* 선택되면 바로 검색되도록*/}
            <Select
                style={styles.search}
                data={searchItemsList}
                width={330}
                height={48}
                initKey={state.combiSearchKey}
                placeholder="음식 또는 질병을 입력하세요"
                type="음식"
                onSelect={this.onSelectedItemsChange.bind(this, state, actions)}
                search={true}
            />
          </View>
        </View>
    );
  };

  renderCombiResult = () => {
    // if(state.searchType == "C"){
    //   http.get()
    //   console.log("궁합 검색의 Render")
    //
    // }
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mainPage}
        >
          {/*궁합*/}
          <View style={{flexDirection:'row', flex:1, paddingLeft:10}}>
            <View style={[styles.todayText]} >
              <Text
                  size={30}
                  style={{
                    color: nowTheme.COLORS.PRIMARY,
                    fontFamily: 'montserrat-bold',
                  }}>궁합</Text>
            </View>
          </View>
          {/*<ImageCarousel searchType={this.searchType} searchText={this.state.value} items={this.state.combiItems}/>*/}
          <SearchResult items={this.state.combiItems} type={"궁합"} width={width}/>
          {/*상극*/}
          <View style={{flexDirection:'row', flex:1, marginTop:20, paddingLeft:10}}>
            <View style={[styles.todayText]} >
              <Text
                  size={30}
                  style={{
                    color: nowTheme.COLORS.PRIMARY,
                    fontFamily: 'montserrat-bold',
                  }}>상극</Text>
            </View>
          </View>
          <SearchResult items={this.state.diffItems} type={"상극"} width={width}/>
        </ScrollView>
    );
  };

  render() {
    return (
        <Block flex center style={styles.home}>
          <SearchConsumer>
            {({state, actions}) => (
                this.renderSearch(state, actions)
              )
            }
          </SearchConsumer>
            {this.renderCombiResult()}
        </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width
  },
  mainPage: {
    // width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    // paddingHorizontal: theme.SIZES.BASE,
    fontFamily: 'montserrat-regular'
  },
  todayText:{
    // alignItems: 'flex-start',
    alignItems: 'center',
    flex:1,
  },
  todayDropDown:{
    alignItems:'flex-end',
    flex:1
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
    // height: 48,
    // marginHorizontal: 16,
    // borderWidth: 1,
    borderRadius: 30,
    borderColor: nowTheme.COLORS.BORDER,
  },
});

export default CombiSearch;
