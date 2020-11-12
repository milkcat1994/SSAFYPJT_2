import React from 'react';
import http from "../utils/http-common";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  ImageBackground,
  Linking,
  View,
} from 'react-native';

import SearchResult from './SearchResult';
// Galio components
import { Block, Text, Button as GaButton, theme } from 'galio-framework';

// Now UI themed components
import MapView,
  {
    Marker,
    Callout,
    CalloutSubview,
    ProviderPropType,
  } from 'react-native-maps';
import Toast from 'react-native-simple-toast';
import nowTheme from '../constants/Theme';
import Select from '../utils/SelectBox/index';
import { Button, Icon, Input, Header, Switch } from '../components';
import {Context, SearchConsumer} from '../contexts/search';

const { width } = Dimensions.get('screen');

class FavoriteMap extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value:'',
      key:'',
      region: this.getInitialState(),
      stores:[],
      tags:[],
      selectedTag:-1,
    };
    this.updateView = this.updateView.bind(this)
    this.onRegionChange = this.onRegionChange.bind(this);
    this.moveWeb = this.moveWeb.bind(this)
    this.getUserTags = this.getUserTags.bind(this)
  }

  onRegionChange(region) {
    this.setState({ region });
  }
  
  moveWeb(name){
    console.log('clickMoveWeb')
    let url = "https://www.google.com/search?q="+name+"&oq="+name+"&aqs=chrome..69i57.3557j0j1&sourceid=chrome&ie=UTF-8"
    const supported = Linking.canOpenURL(url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL(url);
    } else {
      Toast.show('검색할 수 없습니다.', Toast.LONG);
    }
  }

  getInitialState() {
    return {
      latitude: 37.5326,
      longitude: 127.024612,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    };
  }

  updateView(){
    let rn = this
    let stores = []
    console.log(this.state.value)
    http
        .post("/recommend/store",
          this.state.value,
        )
        .then(({data}) => {
          console.log("취향지도 검색결과 확인완료")
          // console.log(data)
    //       "address": "울산광역시 울주군 청량면 개곡리 229-1",
    // "area": "울주군",
    // "category": "민물장어|장어",
    // "id": 100937,
    // "latitude": 35.496653,
    // "longitude": 129.289285,
    // "menu": "장어",
    // "name": "돌집민물장어",
    // "tel": "052-258-8292",

    // marker에 띄워주어야한다.
          data.forEach((e) => {
            stores.push(e)
          })
          Toast.show(data.length+'건이 검색 되었습니다.', Toast.LONG);
          rn.setState({
            stores:stores,
          })
          console.log("유저베이스 가져오기 성공");
          return;
        })
        .catch(e => {
          console.log("유저베이스 가져오기 실패");
          console.log(e);
        });

  }

  getUserTags(props){
    let rn = this
    http
      .get("/profile?uid="+props.uid)
      .then(({data}) => {
        let tags = []
        if(data.tagname !== null)
          tags = data.tagName.split(', ')
        tags = tags.slice(0, tags.length-1)

        rn.setState({
          tags: tags,
        })
      })
  }
  componentWillReceiveProps(nextProps){
    this.getUserTags(nextProps);
  }

  componentDidMount(){
    this.updateView();
    this.getUserTags(this.props);
    this.getCurrentLocation();
  }

  
  getCurrentLocation = async () => {
    let region = {}
    await navigator.geolocation.getCurrentPosition(
      position => {
          region = {
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude),
            latitudeDelta: 0.3,
            longitudeDelta: 0.3,
        };
        this.setState({
          region: region
        });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  // 검색어 선택 되었을때
  onSelectedItemsChange = (state, actions, key, value) => {
    let rn = this
    this.setState({
      value: value,
      key:key,
      selectedTag:-1
    }, function() {
      rn.updateView();
    });
  };

  renderSearch(state, actions) {
    let { categoryList } = state;
    return (
      <View style={styles.searchView}>
        <View style={{ justifyContent: 'center' }}>
          {/* 선택되면 바로 검색되도록*/}
          <Select
            style={styles.search}
            data={categoryList}
            width={360}
            height={48}
            initKey={this.state.key}
            placeholder="검색어를 입력하세요."
            type="지도"
            onSelect={this.onSelectedItemsChange.bind(this, state, actions)}
            search={true}
          />
        </View>
      </View>
    );
  }

  render() {
    return (
      <SearchConsumer>
        {({state, actions}) => (
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View>
              {/* 4개 표현하고 다음 줄로 넘기는 것 필요. */}
              <Text
                size={20}
                style={{
                  fontFamily: 'montserrat-bold',
                  fontWeight: 'bold',
                  margin: 10,
                  // marginHorizontal:10
                }}
              >
                {'내 취향'}
              </Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <ScrollView horizontal={true}>
                {this.state.tags.map((tag, i) => (
                  <View key={i}>
                      <Button style={styles.tagBtn}
                      color={this.state.selectedTag == i ? 'PRIMARY' : 'PLACEHOLDER'}
                        onPress={() => {
                          if(this.state.selectedTag == i){
                            // this.setState({
                            //   selectedTag:-1,
                            // })
                          }
                          else{
                            this.setState({
                              //태그가 선택되면서 검색이 되야한다.
                              selectedTag:i,
                              value: this.state.tags[i],
                            }, function(){
                              this.updateView()
                            })
                          }
                        }}
                      >{tag}</Button>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View>{this.renderSearch(state,actions)}</View>
            <View style={styles.container}>
              <MapView
                style={styles.mapStyle}
                initialRegion={this.state.region}
                region={this.state.region}
                showsUserLocation={true}
                onRegionChangeComplete={this.onRegionChange}
              >
                {this.state.stores.map((row, i) => (
                  // 아이콘 제작자 <a href="https://www.flaticon.com/kr/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/kr/" title="Flaticon"> www.flaticon.com</a>
                  <Marker
                      key={i}
                      coordinate={{
                        latitude: row.latitude,
                        longitude: row.longitude,
                      }}
                      title={row.name}
                      description= {row.address}
                      image={require('../assets/imgs/free-icon-shop-679845.png')}
                    >
                        <Callout
                          onPress={e => {
                            if (
                              e.nativeEvent.action === 'marker-inside-overlay-press' ||
                              e.nativeEvent.action === 'callout-inside-press'
                            ) {
                              return;
                            }
                            this.moveWeb(row.name);
                          }}
                        >
                          <View>
                            <Text>{row.name}</Text>
                          </View>
                        </Callout>
                    </Marker>
                  ))}
              </MapView>
            </View>
          </View>
              )
            }
          </SearchConsumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    // alignItems: 'flex-end',
    // justifyContent: 'space-between'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: '100%',
    // height: Dimensions.get('window').height,
  },
  searchView: {
    flexDirection: 'row',
    marginTop: 10,
  },
  search: {
    borderColor: nowTheme.COLORS.BORDER,
  },
  tagBtn: {
    width: 80,
    height: 35,
    marginHorizontal: 5,
    borderRadius: 15,
  },
  tagBtnContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
  },
});

export default FavoriteMap;
