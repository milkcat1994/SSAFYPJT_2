import React, {useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  View,
  Modal,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import http from '../utils/http-common';
import Toast from 'react-native-simple-toast';
import { Block, Text, Input, theme, Button as GaButton } from 'galio-framework';
import { Button } from '../components';
import { Images, nowTheme } from '../constants';
import { HeaderHeight } from '../constants/utils';
import { InputAutoSuggest } from 'react-native-autocomplete-search';
import {isToday, isOneDayBefore, getFormatDate, getCurrentDate} from '../utils/day-common';

import {Context as AContext, AuthConsumer} from '../contexts/auth';
import Icon from '../components/Icon';
import { Dropdown } from 'react-native-material-dropdown';
import Select from '../utils/SelectBox/index';
import {Context, SearchConsumer} from '../contexts/search';
const { width, height } = Dimensions.get('screen');

const thumbMeasure = (width - 48 - 32) / 3;

{/*>{state.nickname}</Text>*/}
class Profile extends React.Component{

  dropdown = {
    '아침' : 0,
    '점심' : 1,
    '저녁' : 2,
    '간식1' : 3,
    '간식2' : 4
  }

  constructor(props, context) {
    super(props, context);
    Context._currentValue.actions.searchC({
      searchText: null,
      searchKey: 0,
    })
    Context._currentValue.actions.searchD({
      searchText: null,
      searchKey: 0,
    })
    this.state = {
      uid: AContext._currentValue.state.uid,
      categoryKey:0,
      selectedCategory:'',
      key: 0,
      photo: null,
      dietModalVisible : false,
      favorModalVisible : false,
      targetModalVisible : false,
      age:0,
      height:0,
      // 0-남, 1-여
      gender:0,
      currentWeight: 0,
      targetWeight : 0,
      weightDownBtn : false,
      weightUpBtn : false,
      muscleUpBtn : false,
      selectedTarget : "",
      selectedFood : "",
      selectedWeight:0,
      dietItemsList : [],
      data : [{
        value: '아침',
      }, {
        value: '점심',
      }, {
        value: '저녁',
      },{
        value: '간식1',
      },{
        value: '간식2',
      }],
      originGenders:[{
        value: '남',
      },{
        value: '여',
      }],
      userTags : [],
      selectedDiet : "아침",
      totalCalorie : 0, //해당 식사 총 칼로리
      totalCarbo : 0, //탄수화물
      totalPro : 0, //단백질
      totalFat : 0, //지방
      dietAddBtn : false,
    };
    this.deleteFav = this.deleteFav.bind(this)
  }

  deleteFav(state, actions, tag){
    let uid = state.uid
    let sc = tag
    Alert.alert(
      '취향 삭제',
      ''.concat('\'',tag, '\'를 삭제하시겠습니까?',),
      [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: '확인',
          onPress: () => {
            http
              .get("/profile/tag?uid="+uid+'&tagName='+sc)
              .then(({data}) => {
                console.log('취향 삭제')
                //취향 삭제
                let tags = this.state.userTags
                const idx = tags.indexOf(sc)
                if (idx > -1) tags.splice(idx, 1)

                this.setState({
                  userTags: tags
              }, function(){
                actions.addDish()
              })
            })
            .catch(e => {
                console.log(e);
                console.log('취향 삭제 실패')
            });
          },
        }
      ],
      { cancelable: false }
    );
  }

  updateView(){
    // console.log(this.props)
    let rn = this
    http
    .get("/profile?uid="+this.props.uid)
    .then(({data}) => {
      console.log('setState 시작2')
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
          set.push({
            food: brochuresView[i].food,
            time: rn.state.data[brochuresView[i].dietType].value,
            weight: brochuresView[i].dish,
          });
        }
      }
      console.log(data)
        let tags = []
        if(data.tagname !== null && typeof data.tagname  != undefined){
          tags = data.tagName.split(', ')
        }
console.log(data.tagname !== null)
console.log(typeof data.tagname !== undefined)
        tags = tags.slice(0, tags.length-1)
        rn.setState({
            totalCalorie: cal,
            totalCarbo: carbo,
            totalPro: protein,
            totalFat: fat,
            gender: data.genderType,
            age: data.age,
            height: data.height,
            targetWeight: data.targetWeight,
            selectedTarget: data.targetType,
            dietItemsList: set,
            userTags: tags,
        }, function(){
          switch (this.state.selectedTarget) {
            case '체중감량':
              this.setState({
                weightDownBtn: true
              })
              break;
            case '체중증가':
              this.setState({
                weightUpBtn: true
              })
              break;
            case '근육생성':
              this.setState({
                muscleUpBtn: true
              })
              break;
          }
          
        })

        return;
    })
    .catch(e => {
        console.log(e);
        console.log('금일 식단 가져오기 실패')
    });

    //mission에 대해서도 get해와야한다.
  }

  componentDidMount(){
    this.updateView();
  }

  selecTargetBtn(target){ //몸무게 관련 목표 설정 버튼
    this.setState({
      weightDownBtn:false,
      weightUpBtn:false,
      muscleUpBtn:false
    })
    if(target == "down"){
      this.setState({
        weightDownBtn:!this.state.weightDownBtn,
        selectedTarget : "체중감량"
      })
    }
    else if(target == "up"){
      this.setState({
        weightUpBtn:!this.state.weightUpBtn,
        selectedTarget : "체중증가"
      })
    }
    else if(target == "muscle"){
      this.setState({
        muscleUpBtn:!this.state.muscleUpBtn,
        selectedTarget : "근육생성"
      })
    }
  }
  setModalWeight(weight){
    if(this.state.targetModalVisible == true){
      if(
        this.state.height == 0 ||
        this.state.age == 0 ||
        this.state.targetWeight == 0 ||
        this.state.selectedTarget == "" 
        ){
        (Toast.show('모두 채우거나 선택해주세요.', Toast.SHORT))
        // alert("목표 체중과 목표를 선택해주세요.")
        return;
      }
    }
    this.setState({
      targetModalVisible:!this.state.targetModalVisible
    }, function(){
      if(this.state.targetModalVisible == false){ //modal창을 닫는경우
        // /profile/target
        // API 콜하길
        http
          .post("/profile/target",{
            uid: this.state.uid,
            targetType: this.state.selectedTarget,
            targetWeight: this.state.targetWeight,
            age: this.state.age,
            genderType: this.state.gender,
            height: this.state.height,
          })
          .then(({data}) => {
            console.log('목표 등록 시작')
            this.setState({
              targetWeight : weight
            })
          })
        }
    })
  }
  setModalFavor(){
    this.setState({
      favorModalVisible:!this.state.favorModalVisible
    })
  }

  setUserFavor(state, actions){
    // (@RequestParam("uid") String uid, @RequestParam("tagName") String tagName
    let uid = state.uid
    let sc = this.state.selectedCategory
    http
      .post("/profile/tag?uid="+uid+'&tagName='+sc)
      .then(({data}) => {
        console.log('취향 등록')
        //취향등록
        let tags = this.state.userTags
        tags.push(sc)
        this.setState({
          categoryKey:0,
          selectedCategory:'',
          userTags: tags,
          favorModalVisible:!this.state.favorModalVisible
      }, function(){
        actions.addDish()
      })
    })
  }
  

  setModalDiet(){
    this.setState({
      dietModalVisible:!this.state.dietModalVisible
    })
  }
  closeModal(){
    this.setState({
      favorModalVisible:false,
      targetModalVisible:false,
      dietModalVisible:false
    })
  }

  onChangeHandler = (value) => {
    console.log(`Selected value: ${value}`);
    this.setState({
      selectedDiet:value
    })
  }

  onChangeGenderHandler = (value) => {
    console.log(`Selected value: ${value}`);
    this.setState({
      age: value =='남' ? 0 : 1
    })
  }
  
  renderSearch = (state, actions) => {
    // const { query } = this.state;
    let tempList = state.dietList
    return (
        <View style={styles.searchView}>
          <View
              style={{justifyContent:'center'}}
          >
            <View>
              {/* <Block style={{width : 100, height : 200, backgroundColor : 'white', borderColor : 'black'}}> */}
                <Select
                  width={width*0.3}
                  data={tempList}
                  placeholder ='음식입력'
                  initKey={this.state.key}
                  type="프로필"
                  onSelect={this.onSelectedItemsChange.bind(this)}
                  search={true}
                />
              {/* </Block> */}
            </View>
          </View>
        </View>
    );
  };
  
  onSelectedCategoryChange = (key, value) => {
    this.setState({ categoryKey: key, selectedCategory: value });
  };

  onSelectedItemsChange = (key, value) => {
    this.setState({ key: key, selectedFood: value });
  };

  handleChangeCurrentAge = (text) => {
    let num = text*1
    Number.isInteger(num)
    ?
      this.setState({age: num})
    :
    (Toast.show('숫자만 입력해주세요.', Toast.SHORT))
  }

  handleChangeCurrentWeight = (text) => {
    let num = text*1
    Number.isInteger(num)
    ?
      this.setState({currentWeight: num})
    :
    (Toast.show('숫자만 입력해주세요.', Toast.SHORT))
  }

  handleChangeCurrentHeight = (text) => {
    let num = text*1
    Number.isInteger(num)
    ?
      this.setState({height: num})
    :
    (Toast.show('숫자만 입력해주세요.', Toast.SHORT))
  }

  handleChangeTargetWeight = (text) => {
    let num = text*1
    Number.isInteger(num)
    ?
      this.setState({targetWeight: num})
    :
    (Toast.show('숫자만 입력해주세요.', Toast.SHORT))
  }

  handleChangeWeight = (text) => {
    let num = text*1
    Number.isInteger(num)
    ?
      this.setState({selectedWeight: num})
    :
    (Toast.show('숫자만 입력해주세요2.', Toast.SHORT))
  }

  selectedDietView(select){
    return(
      <View
        style={{
          marginHorizontal:10,
          flexDirection:'column',
          height:height*0.8,
          
      }}>
        <Text style={{fontSize : 17, fontWeight : 'bold', marginBottom : 10}}>총 칼로리 : {Math.floor(this.state.totalCalorie)}</Text>
        {/* 소수점 컷트 */}
        <Text style={{color : 'rgba(168, 162, 162, 1)'}}>탄수화물 : {Math.floor(this.state.totalCarbo)}g, 
        단백질 : {Math.floor(this.state.totalPro)}g, 
        지방 : {Math.floor(this.state.totalFat)}g</Text>
        <View style={{marginTop : 15, marginBottom : 20,paddingRight:30, flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1, height: 1, backgroundColor: '#E6E6E6'}} />
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 17, fontWeight : 'bold', marginBottom : 20}}>식단 리스트</Text>
          <Text style={styles.addText}
            textStyle={styles.targetBtnText}
            onPress={() => {
              this.setState({
                dietAddBtn:true
              })
            }}
          ><Icon
          family="AntDesign"
          size={16}
          name="pluscircleo"
          color="#FA5858"
          /> 식단추가</Text>
          
        </View>
        
        {
            this.state.dietAddBtn ? 
            <View>
              <View style={{flexDirection: 'row'}}>
                <SearchConsumer style ={{marginTop : 100}}>
                  {({state, actions}) => (
                      this.renderSearch(state, actions)
                    )
                  }
                </SearchConsumer>
                <Input
                  placeholder = "인분"
                  style = {{width : 100, marginLeft : width*0.05, borderRadius : 0}}
                  keyboardType='numeric'
                  value={this.state.selectedWeight.toString()}
                  onChangeText={this.handleChangeWeight}
                  maxLength={4}
                ></Input>

<AuthConsumer>
      {({state, actions}) => (
              <Button style={{width : 60, borderColor : "#FA5858", 
              borderWidth : 1, backgroundColor : "white", marginTop : 9, marginLeft : 20}}
              textStyle = {{color : "#FA5858"}}
              onPress={() => {
                // 숫자만 넣기
                Number.isInteger(this.state.selectedWeight) ?
                (
                this.setState({
                  dietAddBtn:false,
                  key:0,
                }, function(){
                  http
                  .post("/profile/diet",{
                    userId: state.uid,
                    food: this.state.selectedFood,
                    dish: this.state.selectedWeight,
                    dietType: this.dropdown[select],
                    // moment로 현재 날짜 넘겨주기
                    createDate: isOneDayBefore(getCurrentDate())+'T15:00:00.000+0000',
                  })
                  .then(({data}) => {
                    console.log('등록됨>>>>>>>>>>>>>')
                    console.log(data)
                   this.state.totalCalorie += data.energy//해당 식사 총 칼로리
                   this.state.totalCarbo += data.carbo //탄수화물
                   this.state.totalPro += data.protein //단백질
                   this.state.totalFat += data.fat //지방

                  let temp = this.state.dietItemsList
                  temp.push({
                    time: select,
                    food: this.state.selectedFood,
                    weight: this.state.selectedWeight
                   })
                   this.setState({
                     dietItemsList: temp
                   }, function(){
                     actions.addDish()
                     console.log(this.state.dietItemsList)
                   })
                  })
                })
                )
                :
                (Toast.show('숫자만 입력해주세요.', Toast.SHORT))
              }}
              >추가</Button>
              )
              }
            </AuthConsumer>

              </View>
              
            </View>
            :
            null
          }

          <View style={styles.modalContentBorder}></View>
          
      <ScrollView
        style={{
          flexDirection:'column',
          flex:1
        }}>
        <View
        style={{
          minHeight:500
        }}>
          
          {/* 이미 등록된 식단 나타내기 */}
          {
            this.state.dietItemsList.map((row, i) =>(
              <View
                style={styles.modalFoodList}
                key={i}
                >
                <View style={{
                  alignItems: 'flex-start',
                  flexDirection:'row',
                  flex:1
                }}>
                  <Text
                      size={16}
                      style={{
                        fontFamily: 'montserrat-bold',
                      }}
                  >{row.food}</Text>
                  <Text
                      size={16}
                      style={{
                        fontFamily: 'montserrat-regular',
                        marginLeft:10,
                      }}
                  >{row.weight}인분</Text>
                </View>
                <View style={{
                  alignItems:'flex-end',
                  flex:3
                }}>
                  <Text style={{
                    fontFamily: 'montserrat-regular',}}
                  >{row.time}</Text>
                </View>
              </View>
            ))
          }
          </View>
          </ScrollView>
        {/* <View style={{flexDirection: 'row'}}></View> */}
        {/* <Text style={styles.dietList}>현미밥 200g</Text>
        <Text style={styles.dietList}>삼겹살 150g</Text>
        <Text style={styles.dietList}>김치</Text>
        <Text style={styles.dietList}>계란후라이 1개</Text> */}
        {/* <View style={{marginTop : 15, marginBottom : 20, paddingRight:30, flexDirection: 'row', alignItems: 'center'}}> */}
        {/* </View> */}
      </View>
    )
  }

  render() {
    return (
    <Block style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    }} >
      <ScrollView showsVerticalScrollIndicator={false}>
    <AuthConsumer>
      {({state, actions}) => (
        <View style={styles.profileCard}>
          <View style={{flex:1, alignItems:'center'}}>
            {
              state.img == '' ?
              <Image style={styles.avatar} source={Images.UnknownProfileImg} />
              :
              <Image style={styles.avatar} source={{uri:state.img}} />
            }            
          </View>
          <View style={{flex:1}}>
            <View style={{flexDirection:'row', justifyContent:'space-around', paddingVertical: 10}}>
              <View style={{alignItems:'center', justifyContent: 'space-around'}}>
                <Text
                    size={16}
                      style={{
                        fontFamily: 'montserrat-bold',
                        fontWeight: 'bold',
                      }}
                >{state.nickname}</Text>
              </View>
            </View>
          </View>
        </View>
        )
        }
      </AuthConsumer>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.targetModalVisible}
          onRequestClose={() => { this.closeModal(); } }
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* 나이 */}
              <View style={styles.targetModalInnerView}>
                <Text style={styles.modalText}>
                  성별
                </Text>
                  <Dropdown
                    data={this.state.originGenders}
                    value= {this.state.originGenders[0].value}
                    dropdownOffset = {{ top: 0, left: 0}}
                    fontSize = {20}
                    dropdownPosition={0}
                    containerStyle = {{ marginLeft : 'auto', width : 70, height : 60}}
                    onChangeText={value => this.onChangeGenderHandler(value)}
                  />
              </View>
              {/* 나이 */}
              <View style={styles.targetModalInnerView}>
                <Text style={styles.modalText}>
                  신장
                </Text>
                <Input
                    placeholder="신장"
                    value={this.state.height.toString()}
                    style={styles.inputs}
                    color = "black"
                    keyboardType="numeric"
                    onChangeText={this.handleChangeCurrentHeight}
                    maxLength={3}
                  />
                  <Text style={{
                    marginLeft : 10, 
                    fontSize : 20,
                    }}>cm
                  </Text>
              </View>

              {/* 나이 */}
              <View style={styles.targetModalInnerView}>
                <Text style={styles.modalText}>
                  나이
                </Text>
                <Input
                    placeholder="나이"
                    value={this.state.age.toString()}
                    style={styles.inputs}
                    color = "black"
                    keyboardType="numeric"
                    onChangeText={this.handleChangeCurrentAge}
                    maxLength={2}
                  />
              </View>

              {/* 현재 체중 */}
              {/* <View style={styles.targetModalInnerView}>
                <Text style={styles.modalText}>
                  현재 체중
                </Text>
                <Input
                    placeholder="몸무게"
                    value={this.state.currentWeight}
                    style={styles.inputs}
                    color = "black"
                    keyboardType="numeric"
                    onChangeText={this.handleChangeCurrentWeight}
                    maxLength={3}
                  />
                <Text style={{
                  marginLeft : 10, 
                  fontSize : 20,
                  }}>kg
                </Text>
              </View> */}
              <View style={styles.targetModalInnerView}>
                <Text style={styles.modalText}>목표 체중</Text>
                <Input
                    placeholder="몸무게"
                    value={this.state.targetWeight.toString()}
                    style={styles.inputs}
                    color = "black"
                    keyboardType="numeric"
                    onChangeText={this.handleChangeTargetWeight}
                    maxLength={3}
                  /> 
                <Text style={{
                  marginLeft : 10, 
                  fontSize : 20,
                  }}>kg</Text>
              </View>
              <Text style={styles.modalText}>목표 유형</Text>
              <View style={{flexDirection: 'row'}}>
                <Button style={this.state.weightDownBtn ? styles.targetBtn : styles.selectedBtn}
                  textStyle={styles.targetBtnText}
                  onPress={() => {
                  this.selecTargetBtn("down");
                  }}
                >체중감량</Button>
                
                <Button style={this.state.weightUpBtn ? styles.targetBtn : styles.selectedBtn}
                  textStyle={styles.targetBtnText}
                  onPress={() => {
                    this.selecTargetBtn("up");
                    }}
                >체중증가</Button>

                <Button style={this.state.muscleUpBtn ? styles.targetBtn : styles.selectedBtn}
                  textStyle={styles.targetBtnText}
                  onPress={() => {
                    this.selecTargetBtn("muscle");
                    }}
                >근육생성</Button>
                
              </View>
              
<AuthConsumer>
      {({state, actions}) => (
              <View style={{
                // alignItems : "flex-end",
                flexDirection:'row',
                }}>
                <TouchableHighlight
                  style={{ ...styles.openButton}}
                  onPress={() => {
                    this.setModalWeight(this.state.targetWeight);
                    actions.addDish()
                  }}
                >
                  <Text style={{color : 'white'}}>입력 완료</Text>
                </TouchableHighlight>
              </View>
              )
              }
            </AuthConsumer>
            </View>
          </View>
        </Modal>
        
        {/* 내 취향과 관련된 Modal */}
        <ScrollView>
          
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.favorModalVisible}
          onRequestClose={() => { this.closeModal(); } }
        >
          <View style={styles.centeredView2}>
            <View style={styles.modalViewFavor}>
              <Text style={styles.modalText}>취향 추가</Text>
              
              <View style={{
                flexDirection:'row',
              }}>
                <View
                    style={{
                      flexDirection:'row',
                      justifyContent:'flex-start',
                    }}
                >
                  
                <SearchConsumer>
                  {({state, actions}) => (
                    <View>
                      {/* <Block style={{width : 100, height : 200, backgroundColor : 'white', borderColor : 'black'}}> */}
                        <Select
                          width={width*0.4}
                          data={state.categoryList}
                          placeholder ='취향입력'
                          initKey={this.state.categoryKey}
                          type="프로필"
                          onSelect={this.onSelectedCategoryChange.bind(this)}
                          search={true}
                        />
                      {/* </Block> */}
                    </View>
                      )
                    }
                </SearchConsumer>
                </View>

                <AuthConsumer>
                  {({state, actions}) => (
                    <TouchableHighlight
                      style={{ 
                        backgroundColor: nowTheme.COLORS.PRIMARY,
                        padding: 10,
                        marginLeft : 20,
                        width : 80,
                        elevation: 2,
                        alignItems : "center",
                        justifyContent:'flex-end',
                      }}
                      onPress={() => {
                        this.setUserFavor(state, actions);
                      }}
                    >
                      <Text style={{color : 'white'}}>입력 완료</Text>
                    </TouchableHighlight>
                  )
                }
                </AuthConsumer>
              </View>
            </View>
          </View>
        </Modal>
        </ScrollView>
        {/* 오늘 나의 식단관련 Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.dietModalVisible}
          onRequestClose={() => { this.closeModal(); } }
        >
          <View style={styles.allViewModal}>
            <View style={styles.modalViewDiet}>
              <View style={{
                flexDirection: 'row'
              }}>
                <Text style={styles.modalText}>
                  <TouchableWithoutFeedback
                  onPress={() => { this.closeModal() }}>
                    <Icon
                    style={{marginRight : 30}}
                    family="AntDesign"
                    size={20}
                    name="left"
                    />
                  </TouchableWithoutFeedback> 나의 식단
                </Text>
                {/* <Text style={styles.modalComplete}
                  onPress={() => {
                    this.setModalDiet();
                  }}
                >완료</Text> */}
              </View>
              <View style={{marginTop : 10, marginBottom : 10, flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.contentBorder}></View>
              </View>
              <View style={{marginLeft : 10}}>
                  <Dropdown
                    data={this.state.data}
                    value= {this.state.data[0].value}
                    dropdownOffset = {{ top: 0, left: 0}}
                    fontSize = {20}
                    dropdownPosition={0}
                    containerStyle = {{ marginLeft : 'auto', width : 70, height : 60}}
                    onChangeText={value => this.onChangeHandler(value)}
                  />
              </View>
                  {
                    this.selectedDietView(this.state.selectedDiet)
                  }
            </View>
          </View>
        </Modal>
        <View style={styles.titleBorder}></View>

        {/* 목표 */}
        <View style={styles.content}>
          <View style={{
            alignItems: 'flex-start',
          }}>
            <Text
                size={20}
                style={{
                  fontFamily: 'montserrat-bold',
                  fontWeight: 'bold',
                }}
            >목표</Text>
          </View>

          <View style={{
            alignItems:'flex-start',
            justifyContent: 'center',
            marginLeft:15,
            marginTop : 4
          }}>
          <TouchableOpacity
            onPress={() => {this.setModalWeight(this.state.targetWeight)}}
          >
                <Icon
              family="AntDesign"
              size={16}
              name="pluscircleo"
              color={nowTheme.COLORS.PRIMARY}
              // onPress={() => {
              //   this.setModalWeight(0);
              // }}
              />
            </TouchableOpacity>
          </View>
        </View>
            
        {/*목표 체중*/}
        <View style={styles.content}>
          {/* <View style={{
            alignItems: 'flex-start',
            flex:1,
            flexDirection: 'row'
          }}>
            <Text
                size={16}
                style={{
                  fontFamily: 'montserrat-regular',
                  fontWeight: 'bold',
                }}
            >현재 체중</Text>
            <Text style={{
              fontFamily: 'montserrat-regular',
              marginLeft:20,
            }}
            >{this.state.targetWeight} kg</Text>
          </View> */}
          {/* <View>
            <Icon
            family="Entypo"
            size={16}
            name="arrow-bold-right"
            color="#FA5858"
            />
          </View> */}
          <View style={{
            alignItems:'flex-end',
            flex:1,
            flexDirection: 'row'
          }}>
            <Text
                size={16}
                style={{
                  fontFamily: 'montserrat-bold',
                  fontWeight: 'bold',
                  marginLeft:20,
                }}
            >목표 체중</Text>
            <Text style={{
              fontFamily: 'montserrat-regular',
              marginLeft:20,
            }}
            >{this.state.targetWeight} kg</Text>
          </View>
        </View>
        {/* <View style={styles.contentBorder}></View> */}

        {/*목표 타입*/}
        {/* <View style={styles.content}>
          <View style={{
            alignItems: 'flex-start',
            flex:1
          }}>
            <Text
                size={16}
                style={{
                  fontFamily: 'montserrat-regular',
                  // fontWeight: 'bold',
                }}
            >목표</Text>
          </View>
          <View style={{
            alignItems:'flex-end',
            flex:3
          }}>
            <Text style={{
              fontFamily: 'montserrat-regular',}}
            >{this.state.selectedTarget}</Text>
          </View>
        </View> */}
        <View style={styles.contentBorder}></View>


        <View style={styles.titleBorder}></View>
        {/*내 취향*/}
        <View style={styles.content}>
          <View style={{
            alignItems: 'flex-start',
          }}>
            <Text
                size={20}
                style={{
                  fontFamily: 'montserrat-bold',
                  fontWeight: 'bold',
                }}
            >내 취향</Text>
          </View>
          <View style={{
            alignItems:'flex-start',
            justifyContent: 'center',
            marginLeft:15,
            marginTop : 4
          }}>
          <TouchableOpacity
            onPress={() => {
              this.setModalFavor();
            }}
          >
            <Icon
                family="AntDesign"
                size={16}
                name="pluscircleo"
                color={nowTheme.COLORS.PRIMARY}
                // onPress={() => {
                //   this.setModalFavor();
                // }}
            />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <ScrollView horizontal={true}>
            {this.state.userTags.map((tag, i) => (
              <View key={i}
              style={{
                flexDirection:'row',
                alignItems:'center',
                justifyContent: 'space-around',
                // width: 80,
                minWidth:80,
                height: 35,
                marginRight: 10,
                paddingLeft: 10,
                borderRadius: 15,
                backgroundColor:nowTheme.COLORS.PRIMARY,
              }}>
                <Text
                  style={{
                    // alignItems:'center',
                    // justifyContent:'center',
                    color:nowTheme.COLORS.WHITE
                  }}>
                  {tag}
                </Text>
                <AuthConsumer>
                  {({state, actions}) => (
                    <TouchableOpacity
                      onPress={() => {this.deleteFav(state, actions, tag)}}
                    >
                      <Icon
                        family="AntDesign"
                        size={16}
                        // style={{justifyContent:'flex-end'}}
                        name="close"
                        color={nowTheme.COLORS.WHITE}
                      />
                    </TouchableOpacity>
                    )
                  }
                </AuthConsumer>
                {/* <Button style={styles.tagBtn}>
                  {tag}
                </Button> */}
              </View>
            ))}
          </ScrollView>
          {/* <Text style={styles.myFavoritTag}>매운</Text>
          <Text style={styles.myFavoritTag}>한식</Text> */}
        </View>

        <View style={styles.titleBorder}></View>

        {/*오늘 나의 식단*/}
        <View style={styles.content}>
          <View style={{
            alignItems: 'flex-start',
          }}>
            <Text
                size={20}
                style={{
                  fontFamily: 'montserrat-bold',
                  fontWeight: 'bold',
                }}
            >오늘 나의 식단</Text>
          </View>
          <View style={{
            alignItems:'flex-start',
            justifyContent: 'center',
            marginLeft:15,
            marginTop : 4
          }}>
          <TouchableOpacity
                onPress={() => {
                  this.setModalDiet();
                }}
          >
            <Icon
                family="AntDesign"
                size={16}
                name="pluscircleo"
                color={nowTheme.COLORS.PRIMARY}
                // onPress={() => {
                //   this.setModalDiet();
                // }}
            />
          </TouchableOpacity>
          </View>
        </View>

        {/* 식단 세부 내용 */}
        {
          // dietItemsList
          
          this.state.dietItemsList.map((row, i) =>(
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 30,
                paddingVertical:10
              }}
              key={i}
            >
              <View style={{
                alignItems: 'flex-start',
                flexDirection:'row',
                flex:1
              }}>
                <Text
                    size={16}
                    style={{
                      fontFamily: 'montserrat-regular',
                    }}
                >{row.food}</Text>
                <Text
                    size={16}
                    style={{
                      fontFamily: 'montserrat-regular',
                      marginLeft:10,
                    }}
                >{row.weight}인분</Text>
              </View>
              <View style={{
                alignItems:'flex-end',
                flex:3
              }}>
                <Text style={{
                  fontFamily: 'montserrat-regular',}}
                >{row.time}</Text>
              </View>
            </View>
          ))
        }

        <View style={styles.contentBorder}></View>

        {/* 영양 분석 페이지 이동 버튼 */}
        <View style={styles.content}>
          <View style={{
            alignItems: 'flex-start',
            flex:3
          }}>
          </View>
          <View style={{
            alignItems:'flex-end',
            flex:1
          }}>
            <Button
                textStyle={{ fontFamily: 'montserrat-regular', fontSize: 12 }}
                style={styles.button}
                small
                onPress={() => {
                  this.props.navigation.navigate("영양관리");
                }}
            >
              영양 분석
            </Button>
          </View>
        </View>
      </ScrollView>
    </Block>
    );
  }
}




const styles = StyleSheet.create({
  targetBtn:{
    width : width*0.2,
    marginLeft : 10,
    backgroundColor : "#FA5858",
    borderRadius: 20
  },
  selectedBtn :{
    width : width*0.2,
    marginLeft : 10,
    backgroundColor : "black",
    borderRadius: 20
  },
  targetBtnText:{
    fontSize : 13,
    
  },
  centeredView:{
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    position:'absolute',
    left: width*0.03,
    top: height*0.05,
    marginTop: 22
  },
  centeredView2:{
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    position:'absolute',
    left: width*0.03,
    top: height*0.2,
    marginTop: 22
  },
  allViewModal: {
    // flex: 1,
    position:'absolute',
    top:-40,
    right:-20,

    // justifyContent: "flex-start",
    // alignItems: "flex-start",
    marginTop: 22
  },
  modalViewFavor:{
    alignItems : "flex-start",
    width : width*0.852,
    height : height*0.4,
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
  modalViewDiet:{
    alignItems : "flex-start",
    flexDirection:'column',

    width : width*1,
    height : height*1,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop : 40,
    margin : 20,
    padding : 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalView: {
    flexDirection:'column',
    alignItems : "flex-start",
    width : width*0.852,
    // height : height*0.4,
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
  openButton: {
    backgroundColor: nowTheme.COLORS.PRIMARY,
    padding: 10,
    marginTop : 30,
    marginLeft : width*0.48,
    width : 80,
    elevation: 2,
    alignItems : "center"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "right"
  },
  targetModalInnerView:{
    flexDirection: 'row',
    alignItems:'center',
    marginBottom:10,
  },
  modalText: {
    minWidth:100,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize : 20,
    textAlign: "center",
    alignItems:'center',
  },
  modalComplete: {
    marginBottom: 10,
    marginLeft : width*0.5,
    fontWeight: "bold",
    fontSize : 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    paddingTop:20,
    borderBottomWidth:1,
    borderBottomColor: nowTheme.COLORS.BORDER_COLOR,
    // backgroundColor: nowTheme.COLORS.PRIMARY,
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
  modalFoodList:{
    paddingRight:30,
    paddingVertical:10,
    flexDirection:'row',
  },
  modalContentBorder:{
    height:1,
    marginHorizontal: 10,
    backgroundColor:nowTheme.COLORS.PROFILE_BORDER
  },
  contentBorder:{
    flex:1,
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
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    width : width * 0.3,
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -80
  },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 50,
    borderWidth: 0
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
  dietList :{
    marginBottom : 10
  },
  addDiet: {
    marginTop : 8,
    marginLeft : 10,
    fontWeight: "bold",
    fontSize : 17,
    color : "#FA5858",
    width : width*0.16,
    height : 45
  },
  addText:{
    marginBottom: 10,
    marginLeft : width*0.5,
    fontWeight: "bold",
    fontSize : 17,
    color : "#FA5858"
  },
  searchView:{
    flexDirection:'row',
    width:width*0.3,
    // height:70,
    marginVertical: 5,
  },
  search: {
    borderRadius: 30,
    borderColor: nowTheme.COLORS.BORDER,
  },
  button: {
    // marginBottom: theme.SIZES.BASE,
    // width: width - theme.SIZES.BASE * 2,
  },
  tagBtn: {
    width: 80,
    height: 35,
    marginRight: 10,
    borderRadius: 15,
  },
});

export default Profile;
