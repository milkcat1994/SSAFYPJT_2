import React from "react";
import http from "../utils/http-common";
import {
  StyleSheet,
  Dimensions,
  ScrollView, 
  Image,
  View } from "react-native";
import {Block, theme, Text} from 'galio-framework';
import DropDown from '../components/Select';
import Select from '../utils/SelectBox/index';

import {Context, SearchConsumer} from '../contexts/search';
import {AuthConsumer} from '../contexts/auth';
import Images from "../constants/Images";
import nowTheme from "../constants/Theme"
import MainCarousel from "../components/Carousel/MainCarousel"
import {isToday, getFormatDate} from '../utils/day-common';

const { width } = Dimensions.get("screen");

class Home extends React.Component {

  searchType = '초기값';
  mainCombi = [];
  // 부족한 영양소 추천 궁합
  mainLeakCombi = [];

  constructor(props, context) {
    super(props, context);
    this.searchType = '초기값';
    Context._currentValue.actions.searchC({
      searchText: null,
      searchKey: 0,
    })
    Context._currentValue.actions.searchD({
      searchText: null,
      searchKey: 0,
    })

    this.state={
      value: null,
      key: 0,
      categoryIdx:6,
      carouselItems:[],
      fixItems:[],
      needEnergy: 0,
      needCarbo: 0,
      needPro: 0,
      needFat: 0,
    }
    // title: '바나나 & 김치',
    //     image1: encodeURI("http://j3a306.p.ssafy.io/" + "바나나" + ".jpg"),
    //     image2: encodeURI("http://j3a306.p.ssafy.io/" + "김치" + ".jpg"),
    //     rank: 4,
    //     cta: '바로가기'

    console.log("홈")
    // console.log(Context._currentValue.state.searchText)
  }
  
  updateView(){
    http
        .get("/compatibility")
        .then(({data}) => {
          this.mainCombi = data.map(function(obj){
            let rObj = {};
            rObj['id'] = obj.id;
            rObj['title'] = (obj.foodA + "&" + obj.foodB);
            rObj['image1'] = encodeURI("http://j3a306.p.ssafy.io/" + obj.foodA + ".jpg");
            rObj['image2'] = encodeURI("http://j3a306.p.ssafy.io/" + obj.foodB + ".jpg");
            rObj['rank'] = 1;
            rObj['cta'] = '바로가기';
            return rObj;
          });
          this.setState({carouselItems:this.mainCombi})
          console.log("오늘의 궁합 가져오기 성공");
          return;
        })
        .catch(e => {
          console.log("오늘 궁합 가져오기 실패");
          console.log(e);
        });

        // if(this.props.isLoggedIn)
        //   this.updatefixFood()
  }

  componentWillReceiveProps(nextProps){
    this.updatefixFood(nextProps);
  }

  updatefixFood(nextProps){
    //사용자의 음식 데이터 가져오기
    let rn = this
    http
    .get("/profile?uid="+nextProps.uid)
    .then(({data}) => {
      console.log('setState 시작')
      let set = []
      let brochuresView = data.members
      // console.log(brochuresView)
      let cal=0, carbo=0, protein=0, fat = 0
      for (let i = 0; i < data.members.length; i++) {
        if(isToday(getFormatDate(brochuresView[i].createDate))){
          cal += brochuresView[i].energy
          carbo += brochuresView[i].carbo
          protein += brochuresView[i].protein
          fat += brochuresView[i].fat
        }
      }
      
        rn.setState({
            needEnergy: data.targetEnergy-cal,
            needCarbo: data.targetCarbohidrate-cal,
            needPro: data.targetProtein-cal,
            needFat: data.targetFat-cal,
        }, function(){
          http
            .post("/recommend/nutrient/", {
              energy: this.state.needEnergy,
              carbohidrate: this.state.needCarbo,
              protein: this.state.needPro,
              fat: this.state.needFat,
            })
            .then(({data}) => {
              console.log(data.object)
              let fixItems = data.object.map(function(obj){
                let rObj = {};
                rObj['energy'] = obj.energy;
                rObj['carbohidrate'] = obj.carbohidrate;
                rObj['protein'] = obj.protein;
                rObj['fat'] = obj.fat;
                rObj['food'] = obj.food;
                rObj['id'] = obj.id;
                rObj['similarity'] = obj.similarity;
                return rObj;
              });
              rn.setState({fixItems:fixItems})
              console.log("맞춤 궁합 가져오기 성공");
              return;
            })
            .catch(e => {
              console.log("맞춤 궁합 가져오기 실패");
              console.log(e);
            });
        })

        return;
    })
    .catch(e => {
        console.log(e);
        console.log('금일 식단 가져오기 실패')
    });
  }


  componentDidMount(){
    this.updateView();
    this.updatefixFood(this.props)
  }

  // select 에서 궁합 검색 타입 변경 감지
  onSearchTypeSubmit(text){
    this.searchType = text;
  }

  onSelectedItemsChange = (state, actions, key, value) => {
    // console.log("클릭")
    // 선택된 key 범위에 따라 navigate 다르게 진행
    let rn = this;
    this.setState({ value: value }, function(){
      if(key < state.categoryIdx){
        actions.searchC({searchKey: key, searchText: value})
        rn.goCombiSearchScreen(value);
      }
      else{
        actions.searchD({searchKey: key, searchText: value})
        rn.goDiseasesSearchScreen(value);
      }
    });
  };

  goCombiSearchScreen(value){
    this.props.navigation.navigate("궁합검색",{
      mainFood: value,
    });
  }

  goDiseasesSearchScreen(value){
    this.props.navigation.navigate("질병검색",{
      mainDisease: value,
    });
  }

  renderSearch = (state, actions) => {
    const { value, items } = this.state;
    // console.log("홈의 Render")
    // console.log(this.state.value);
    // console.log(state.searchItemsList);
    return (
        <View style={styles.searchView}>
          <View
              style={{justifyContent:'center'}}
          >
            {/* 선택되면 바로 검색되도록*/}
            <Select
                style={styles.search}
                data={state.searchItemsList}
                width={330}
                height={48}
                initKey={this.state.key}
                placeholder="음식 또는 질병을 입력하세요"
                type="음식"
                onSelect={this.onSelectedItemsChange.bind(this, state, actions)}
                search={true}
            />
          </View>
        </View>
    );
  };

  renderCarousel = () => {
    console.log("캐러셀 그리기 전(홈)")
    return (
      <AuthConsumer>
        {({state, actions}) => (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainPage}
      >
        <View style={{flexDirection:'row', flex:1}}>
          <View style={[styles.todayText]} >
            <Text
                size={20}
                style={{
                  fontFamily: 'montserrat-bold',
                }}>오늘의 궁합</Text>
          </View>
          {/* <View style={styles.todayDropDown} >
            <Block flex >
              <DropDown onSubmit={this.onSearchTypeSubmit} defaultIndex={0} options={['인기순', '평점순']} menuItem={this.searchType}
              color={nowTheme.COLORS.PRIMARY}/>
            </Block>
          </View> */}
        </View>
        <MainCarousel searchType={this.searchType} searchText={this.state.value} items={this.state.carouselItems} />
        
        <View style={[styles.todayText],
        {
          marginTop:10,
          marginBottom:10
          }} >
            <Text
                size={20}
                style={{
                  fontFamily: 'montserrat-bold',
                }}>맞춤 식단</Text>
          </View>
          {
            state.isLoggedIn
            ?
              this.renderFitFood()
              // <View></View>
            :
            this.renderNoLogin()
          }
      </ScrollView>
            )
          }
          </AuthConsumer>
    );
  };

  renderNoLogin(){
    return(
      <View
        style={{
          flexDirection:'column',
          alignItems:'center',
        }}>
        <Image style={{
          width: 160,
          height: 160,
          borderRadius: 90,
          flex:1,
          alignItems:'center',
          justifyContent:'center',
          }} source={require('../assets/imgs/gummibarchen-318362_640.jpg')} />
        <Text
          size={25}
          styles={{
            flex:1,
          }}
          color={
            nowTheme.COLORS.ERROR
          }
        >{"로그인이 필요해요!"}</Text>
      </View>
    )
  }
  
  renderFitFood(){
    return(
        this.state.fixItems.map((row, i) =>(
          <View
          key={i}>
            <View style={{
                flexDirection: 'row',
                justifyContent:'flex-start',
                alignItems:'center',
                paddingHorizontal: 30,
                paddingVertical:10
              }}>
              <View style={{
                alignItems: 'center',
                justifyContent:'flex-start',
                flexDirection:'row',
                flex:3
              }}>
                <Image style={{
                  width:20,
                  height:30,
                }}
                source={
                  i == 0 ? Images.First : (i == 1 ? Images.Second : (i == 2 ? Images.Third : Images.NonImage))} />
                <Text
                    size={16}
                    style={{
                        fontFamily: 'montserrat-regular',
                        marginLeft:10,
                    }}
                >{row.food}</Text>
              </View>
              <View style={{
                alignItems: 'center',
                justifyContent:'flex-end',
                flex:1
              }}>
              <Text style={{
                  fontFamily: 'montserrat-regular',}}
              >{Math.floor(row.energy)}kcal</Text>
              </View>
            </View>
            <View style={styles.contentBorder}></View>
          </View>
        ))
    )
}

  render() {
    return (
      <Block flex center style={styles.home}>
        <SearchConsumer>
          {({state, actions}) => (
              this.renderSearch(state, actions)
            )
          }
        </SearchConsumer>
        <SearchConsumer>
          {({state}) => (
              this.renderCarousel()
            )
          }
        </SearchConsumer>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width
  },
  mainPage: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: 2,
    fontFamily: 'montserrat-regular'
  },
  todayText:{
    alignItems: 'flex-start',
    flex:1
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
  contentBorder:{
    flex:1,
    height:1,
    marginHorizontal: 10,
    backgroundColor:nowTheme.COLORS.PROFILE_BORDER
  },
});

export default Home;
