import React from 'react';
import {
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    ImageBackground,
    Platform,
    View,
    Modal,
    Linking,
    ToastAndroid,
    TouchableOpacity,
} from 'react-native';
import { Block, Text } from 'galio-framework';
import { Rating } from 'react-native-ratings';
import MapView,
  {
    Marker,
    Callout,
    CalloutSubview,
    ProviderPropType,
  } from 'react-native-maps';
import Toast from 'react-native-simple-toast';
import nowTheme from '../constants/Theme';
import Button from '../components/Button';
import {Context} from '../contexts/auth';
import {SearchConsumer} from '../contexts/search';
import http from '../utils/http-common';

const { width, height } = Dimensions.get('screen');

const thumbMeasure = width / 2;

class CombiDetail extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state={
            uid: Context._currentValue.state.uid,
            // targetId: this.props.targetId,
            // targetFood:this.props.targetFood,
            description:'',
            avgStar:0,
            reviewCnt:0,
            region: this.getInitialState(),
            stores:[],
            location: null,
            // 평점 모달
            reviewModalVisible : false,
            myStar:0,
            isReviewed:false,
            compatibilityId:0,
            compatibilityType:0,
        }
        
        this.makeRatingText = this.makeRatingText.bind(this);
        this.makeRatingResultText = this.makeRatingResultText.bind(this);
        this.onRegionChange = this.onRegionChange.bind(this);
        this.moveWeb = this.moveWeb.bind(this)
        this.ratingCompleted = this.ratingCompleted.bind(this)
        this.uploadReview = this.uploadReview.bind(this)
    }

    closeModal(){
      this.setState({
        reviewModalVisible:false,
      })
    }

    setModalReview(){
      this.setState({
        reviewModalVisible:!this.state.reviewModalVisible
      })
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
        longitude: 127.024613,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
    }

    //Review 다는 것 요청 보낼때 필요.
	// private int id;
	
  // //	@ManyToOne
  // //	@JoinColumn(name ="COMPATIBILITY_ID")
  // //    private Compatibility compatibility;
    
  //     @Column(name = "STAR")
  //     private double star;
      
  //     @Column(name = "COMPATIBILITY_ID")
  //     private int compatibilityId;
      
  //     @Column(name = "USER_ID")
  //     private String userId;
      
  //     @Column(name = "COMPATIBILITY_TYPE")
  //     private int compatibilityType;
    uploadReview(){
      let ts = this.state
      let rn = this
      http
        .post('/compatibility/detail',{
          star: ts.myStar,
          compatibilityId: ts.compatibilityId,
          userId: ts.uid,
          compatibilityType: ts.compatibilityType,
        })
        .then(({data}) => {
            console.log('리뷰 달기 성공');
            this.setState({
              reviewModalVisible:false,
              myStar:0,
              isReviewed:true,
            }, function(){
              rn.updateBoard(rn.props)
            })
            return;
        })
        .catch(e => {
            console.log(e);
            console.log('리뷰 달기 실패');
        });
    }

    updateBoard(nextProps){

      let rn = this;
      // this.setState({targetId: this.props.targetId, targetFood: this.props.targetFood})
      let type = nextProps.type;
      let mainFood = nextProps.mainFood
      let targetFood = nextProps.targetFood
      let stores = []

      console.log("targetId: "+nextProps.targetId)

      if(type == "궁합" || type== "메인"){
          http
              .get("/compatibility/detail?id="+nextProps.targetId+"&uid="+this.state.uid)
              .then(({data}) => {
                let object = data.data
                  rn.setState({
                    compatibilityId:object.id,
                      description:object.description,
                      searchCnt: object.searchCnt,
                      reviewCnt: object.reviewCnt,
                      avgStar: object.avgStar ? parseFloat(object.avgStar).toFixed(1) : 0,
                      isReviewed: data.reviewCheck,
                      compatibilityType: 0,
                  })
                  console.log(type+" 상세 궁합 가져오기 성공");
                  return;
              })
              .catch(e => {
                  console.log(e);
                  console.log(type+" 상세 궁합 가져오기 실패")
              });
      }
      else if(type == "상극"){
          http
              .get("/incompatibility/detail?id="+nextProps.targetId+"&uid="+this.state.uid)
              .then(({data}) => {
                let object = data
                  rn.setState({
                    compatibilityId:object.id,
                      description:object.description,
                      searchCnt: object.searchCnt,
                      reviewCnt: object.reviewCnt,
                      avgStar: object.avgStar ? parseInt(object.avgStar) : 0,
                      isReviewed: data.reviewCheck,
                      compatibilityType: 1,
                  })
                  console.log("상세 상극 가져오기 성공");
                  return;
              })
              .catch(e => {
                  console.log(e);
                  console.log("상세 상극 가져오기 실패")
              });
      }
    }

    updateView(nextProps){
        let rn = this;
        let mainFood = nextProps.mainFood
        let targetFood = nextProps.targetFood
        let stores = []

        console.log("targetId: "+nextProps.targetId)


        console.log(this.state.region.longitude)
        http
          .get("/store/near?food1="+mainFood+"&food2="+targetFood+"&lat="+this.state.region.latitude+"&lng="+this.state.region.longitude)
          .then(({data}) => {
            data.object.forEach((e) => {
              stores.push(e)
            })

            Toast.show(data.object.length+'건이 검색 되었습니다.', Toast.LONG);
            rn.setState({
              stores:stores,
            })

            console.log("가까운 음식점 가져오기 성공");
            return;
          })
          .catch(e => {
              console.log(e);
              console.log("가까운 음식점 가져오기 실패")
          });
    }

    componentWillReceiveProps(nextProps){
        //description 초기화 위한 작업
        this.setState({description:'', avgStar:0, reviewCnt:0})
        this.updateView(nextProps);
        console.log('리시브 프롭스')
        console.log(nextProps)
    }

    getCurrentLocation = async () => {
       await navigator.geolocation.getCurrentPosition(
        position => {
            let region = {
              latitude: parseFloat(position.coords.latitude),
              longitude: parseFloat(position.coords.longitude),
              latitudeDelta: 0.3,
              longitudeDelta: 0.3,
          };
          this.setState({
            region: region
          }, function(){
            this.updateView(this.props);
          });
        },
        error => Alert.alert(error.message),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    }

    componentDidMount() {
      this.updateBoard(this.props)
      this.getCurrentLocation();
    }

    ratingCompleted(rating) {
      this.setState({myStar:rating})
      console.log("Rating is: " + rating)
    }

    makeRatingResultText(){
        if(this.state.avgStar >= 4.0)
            return '도움이 됐어요'
        else if(this.state.avgStar >= 2.5)
            return '그럭저럭이에요'
        return '그다지 도움이 안 되요'
    }

    makeRatingText(){
        return '('.concat(this.state.avgStar, '/5.0) ', this.state.reviewCnt,'명의 후기')
    }

    render() {
        // console.log("콤비 디테일")
        // console.log(this.props)
        return (
            <SearchConsumer>
                {({state, actions}) => (
                    <Block style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          <View style={styles.profileCard}>
                              <View style={{flex: 1, alignItems: 'center', flexDirection:'row'}}>
                                  <Image
                                      source={{uri: encodeURI("http://j3a306.p.ssafy.io/" + this.props.mainFood + ".jpg")}}
                                      style={styles.foodImage}/>
                                  <Image
                                      source={{uri: encodeURI("http://j3a306.p.ssafy.io/" + this.props.targetFood + ".jpg")}}
                                      style={styles.foodImage}/>
                              </View>
                              {/*<View style={{flex: 1}}>*/}
                              {/*    <View style={{*/}
                              {/*        flexDirection: 'row',*/}
                              {/*        justifyContent: 'space-around',*/}
                              {/*        paddingVertical: 10*/}
                              {/*    }}>*/}
                              {/*        <View style={{alignItems: 'center', justifyContent: 'space-around'}}>*/}
                              {/*            <Text*/}
                              {/*                size={16}*/}
                              {/*                style={{*/}
                              {/*                    fontFamily: 'montserrat-bold',*/}
                              {/*                    fontWeight: 'bold',*/}
                              {/*                }}*/}
                              {/*            >{state.searchText}</Text>*/}
                              {/*        </View>*/}
                              {/*    </View>*/}
                              {/*</View>*/}
                          </View>
                          {/*<View style={styles.titleBorder}></View>*/}

                          {/* 영양 상세 */}
                          <View style={styles.content}>
                                  <Text
                                      size={20}
                                      style={{
                                          fontFamily: 'montserrat-bold',
                                          fontWeight: 'bold',
                                      }}
                                  >상세 설명</Text>
                          </View>

                          {/*목표 체중*/}
                          <View style={styles.description}>
                              <View style={{
                                  // borderWidth:1,
                                  // borderColor:nowTheme.COLORS.MUTED,
                                  // borderRadius:20,
                                  minHeight:100,
                                  paddingHorizontal:5,
                                  paddingVertical:5,
                              }}>
                                  <Text
                                      size={16}
                                      style={{
                                          fontFamily: 'montserrat-regular',
                                          // fontWeight: 'bold',
                                      }}
                                  >{this.state.description}</Text>
                              </View>
                          </View>

                          {/*<View style={styles.contentBorder}></View>*/}
                          <View style={styles.titleBorder}></View>

                          {/* 점수 */}
                          <View style={{flexDirection:'row', flex:1}}>
                              <View style={{flexDirection:'column',justifyContent:'center', alignItems:'center', flex:1}}>
                                  <View style={{justifyContent:'center', alignItems:'center', marginTop:10}} >
                                      <Text style={{color: nowTheme.COLORS.PRIMARY}}>{this.makeRatingResultText()}</Text>
                                  </View>
                                  <View>
                                      <Rating
                                          type='heart'
                                          imageSize={30}
                                          startingValue={this.state.avgStar.toString()}
                                          fractions={1}
                                          readonly={true}
                                          ratingCount={5}
                                          // onFinishRating={this.ratingCompleted}
                                          style={{ paddingVertical: 10 }}
                                      />
                                  </View>
                              </View>
                              
                              <View style={{flexDirection:'column', flex:1}}>
                                <View style={{justifyContent:'center', alignItems:'center', flex:1, marginTop:25}} >
                                    <Text style={{color: nowTheme.COLORS.MUTED}}>{this.makeRatingText()}</Text>
                                </View>
                                <View style={{justifyContent:'center', alignItems:'center', flex:1, marginTop:25}}>
                                {
                                  !this.state.isReviewed ? 
                                    <Button
                                    style={{
                                      width : 100,
                                      // borderColor : nowTheme.COLORS.PRIMARY, 
                                      // borderWidth : 1,
                                      backgroundColor : nowTheme.COLORS.PRIMARY, 
                                      // marginTop : 9,
                                      // marginLeft : 20
                                    }}
                                    textStyle = {{color : nowTheme.COLORS.WHITE}}
                                    onPress={() => {
                                      this.setModalReview()
                                    }}
                                    >
                                      평점 남기기
                                    </Button>
                                  :
                                    <Button
                                    style={{
                                      width : 100,
                                      // borderColor : nowTheme.COLORS.BLACK, 
                                      // borderWidth : 1,
                                      backgroundColor : nowTheme.COLORS.BORDER_COLOR, 
                                      // marginTop : 9,
                                      // marginLeft : 20
                                    }}
                                    textStyle = {{color : nowTheme.COLORS.MUTED}}
                                    >
                                      평점 남기기
                                    </Button>
                              }
                                </View>
                              </View>

                              {/* 평점 모달 시작 */}

                              <Modal
                                animationType="slide"
                                transparent={true}
                                visible={this.state.reviewModalVisible}
                                onRequestClose={() => { this.closeModal(); } }
                              >
                                <View style={styles.centeredView2}>
                                  <View style={styles.modalViewFavor}>
                                    {/* <Text style={styles.modalText}>평점</Text> */}
                                    
                                    <View style={{
                                      flexDirection:'row',
                                      }}>
                                      <Rating
                                          type='heart'
                                          imageSize={30}
                                          startingValue={'0'}
                                          fractions={1}
                                          showRating={true}
                                          ratingCount={5}
                                          onFinishRating={this.ratingCompleted}
                                          style={{ paddingVertical: 10 }}
                                      />
                                    </View>
                                    <Button
                                        textStyle={{
                                          fontFamily: 'montserrat-regular',
                                          fontSize: 12
                                        }}
                                        style={styles.reviewAddButton}
                                        // small
                                        onPress={() => {
                                          this.uploadReview()
                                          // console.log('평점 등록 확인하세요.'+this.state.myStar);
                                        }}
                                      >
                                      평점 등록
                                    </Button>
                                  </View>
                                </View>
                              </Modal>
                              {/* 평점 모달 끝 */}
                          </View>
                          <View style={{
                            alignItems:'center',
                            marginVertical:20,
                          }}>
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
                        </ScrollView>
                    </Block>
                )
                }
            </SearchConsumer>
        )
    }
}

const styles = StyleSheet.create({
    profileContainer: {
        width,
        height,
        padding: 0,
        // zIndex: 1
    },
    profileBackground: {
        width,
        height: height * 0.6
    },
    profileCard:{
        flexDirection:'column',
        // paddingTop:20,
        borderBottomWidth:1,
        borderBottomColor: nowTheme.COLORS.BORDER_COLOR,
        // backgroundColor: nowTheme.COLORS.PRIMARY,
    },
    foodImage: {
        // marginHorizontal:10,
        width: "50%",
        height: thumbMeasure,
        // borderRadius: 30,
        borderWidth: 0,
    },
    titleBorder:{
        height:15,
        backgroundColor:nowTheme.COLORS.PROFILE_BORDER
    },
    content:{
        flexDirection: 'row',
        flex:1,
        paddingHorizontal: 30,
        paddingVertical:10
    },
    description:{
        flex:1,
        paddingHorizontal: 30,
        paddingVertical:10
    },
    contentBorder:{
        height:1,
        marginHorizontal: 10,
        backgroundColor:nowTheme.COLORS.PROFILE_BORDER
    },
    myFavoritTag:{
        marginRight: 20,
        fontFamily: 'montserrat-regular',
    },
    info: {
        marginTop: 30,
        paddingHorizontal: 10,
        height: height * 0.8
    },
    nameInfo: {
        marginTop: 35
    },
    thumb: {
        borderRadius: 4,
        marginVertical: 4,
        alignSelf: 'center',
        width: thumbMeasure,
        height: thumbMeasure
    },
    social: {
        width: nowTheme.SIZES.BASE * 3,
        height: nowTheme.SIZES.BASE * 3,
        borderRadius: nowTheme.SIZES.BASE * 1.5,
        justifyContent: 'center',
        zIndex: 99,
        marginHorizontal: 5
    },
    button: {
        // marginBottom: theme.SIZES.BASE,
        // width: width - theme.SIZES.BASE * 2,
    },
    mapStyle: {
      width: 300,
      height: 300,
      // height: Dimensions.get('window').height,
    },
    // 모달 CSS
    centeredView2:{
      // flex: 1,
      // justifyContent: "center",
      // alignItems: "center",
      position:'absolute',
      left: width*0.03,
      top: height*0.25,
      marginTop: 22
    },
    modalViewFavor:{
      alignItems : "center",
      justifyContent: 'center',
      width : width*0.852,
      height : height*0.3,
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    modalText: {
      minWidth:100,
      marginBottom: 10,
      fontWeight: "bold",
      fontSize : 20,
      textAlign: "center",
      alignItems:'center',
    },
    reviewAddButton:{
      width:'50%',
      height: '30%'
    }
});
export default CombiDetail;
