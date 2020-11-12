import React from 'react';
import http from "../utils/http-common";
import { ProgressBarAndroid, View, Dimensions, StyleSheet, ScrollView, TimePickerAndroid } from 'react-native';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';
// https://www.npmjs.com/package/react-native-svg-charts
import { StackedBarChart } from 'react-native-svg-charts';
import { nowTheme } from '../constants';
import { AuthConsumer, Context } from '../contexts/auth';
import {isOneDayBefore} from '../utils/day-common';

const { width, height } = Dimensions.get('screen');
export default class NutritionAnalysis extends React.Component {
  constructor(props) {
    super(props);
    // date: 2010-10-11,
    // day: 11,
    this.state = {
      fill: 100,
      uid: Context._currentValue.state.uid,
      data:[
        [
          {
            total: 1,
            current: 0,
          },
        ],
        [
          {
            total: 1,
            current: 0,
          },
        ],
        [
          {
            total: 1,
            current: 0,
          },
        ],
        [
          {
            total: 1,
            current: 0,
          },
        ],
      ],
    };
  }

  updateView() {
    //디테일 정보 요청 하기
    http
    .post("/mission/detail",{
      uid : this.state.uid,
      // 2020-10-04T15:00:00.000+0000
      date: isOneDayBefore(this.props.date)+'T15:00:00.000+0000',
    })
    .then(({data}) => {
      let obj = data

      // 목표치
      let te = obj.targetEnergy
      let tc = obj.targetCarbohidrate
      let tp = obj.targetProtein
      let tf = obj.targetFat

      // 달성치
      let ce = 0
      let cc = 0
      let cp = 0
      let cf = 0
      obj.members.forEach(e => {
        ce += e.energy
        cc += e.carbo
        cp += e.protein
        cf += e.fat
      });

      ce = ( te < ce ? te : ce)
      cc = ( tc < cc ? tc : cc)
      cp = ( tp < cp ? tp : cp)
      cf = ( tf < cf ? tf : cf)
      // 목표치와 달성치의 비율 구하기
      
      // total: (100 - 50) / 10,
      // current: 50 / 10,

      // total = 목표치 - 달성치 / 10
      // current = 달성치 / 10

      // -> 목표치 - 달성치가 음수일경우 -> 달성치 = 목표치
      let tempData = [
        [
          {
            total: (te - ce) / 10,
            current: ce / 10,
          },
        ],
        [
          {
            total: (tc - cc) / 10,
            current: cc / 10,
          },
        ],
        [
          {
            total: (tp - cp) / 10,
            current: cp / 10,
          },
        ],
        [
          {
            total: (tf - cf) / 10,
            current: cf / 10,
          },
        ],
      ]

      this.setState({
        data: tempData,
      })
      // console.log(this.state.data)
    })
    .catch(e => {
      console.error(e)
      console.log('영양 상세 정보 가져오기 실패')
    })
  }
  
  componentDidMount() {
    this.updateView();
  }

  render() {
    //data의 경우 100, 100 이면 1:1로 나뉘게 된다.
    //즉 두 값다 같은 수로 나누면 됨
    // 과다 섭취라면 색변환??
    const colors = [nowTheme.COLORS.NUTRITION_CURRENT, nowTheme.COLORS.BORDER_COLOR];
    const keys = ['current', 'total'];

    return (
      <AuthConsumer>
        {({ state, actions }) => (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              {/* 안내 UI */}
              <View style={{ flexDirection: 'row' }}>
                <Text
                  size={20}
                  style={{
                    fontFamily: 'montserrat-bold',
                    fontWeight: 'bold',
                    marginLeft: 10,
                  }}
                >
                  {'섭취 영양'}
                </Text>
                <View
                  style={{
                    marginLeft: 30,
                    marginRight: 10,
                    marginTop: 5,
                    width: 20,
                    height: 20,
                    backgroundColor: nowTheme.COLORS.NUTRITION_CURRENT,
                  }}
                ></View>
                <Text size={15} style={{ marginTop: 3 }}>
                  현재 섭취량
                </Text>

                <View
                  style={{
                    marginLeft: 20,
                    marginRight: 10,
                    marginTop: 5,
                    width: 20,
                    height: 20,
                    backgroundColor: nowTheme.COLORS.BORDER_COLOR,
                  }}
                ></View>
                <Text size={15} style={{ marginTop: 3 }}>
                  필수 섭취량
                </Text>
              </View>
              <View style={styles.content}>
                {/* 탄수화물 등등 */}
                {/* 4개 표현하고 다음 줄로 넘기는 것 필요. */}
                <View style={styles.chartContainer}>
                  <View style={{ paddingVertical: 15, paddingLeft: 20, width: 80 }}>
                    <Text
                      style={{
                        fontFamily: 'montserrat-bold',
                        fontWeight: 'bold',
                      }}
                    >
                      칼로리
                    </Text>
                  </View>
                  <View style={{ width: '100%' }}>
                    <StackedBarChart
                      style={styles.chart}
                      keys={keys}
                      colors={colors}
                      data={this.state.data[0]}
                      showGrid={false}
                      horizontal={true}
                    />
                  </View>
                </View>
                <View style={styles.chartContainer}>
                  <View style={{ paddingVertical: 15, paddingLeft: 20, width: 80 }}>
                    <Text
                      style={{
                        fontFamily: 'montserrat-bold',
                        fontWeight: 'bold',
                      }}
                    >
                      탄수화물
                    </Text>
                  </View>
                  <View style={{ width: '100%' }}>
                    <StackedBarChart
                      style={styles.chart}
                      keys={keys}
                      colors={colors}
                      data={this.state.data[1]}
                      showGrid={false}
                      horizontal={true}
                    />
                  </View>
                </View>
                <View style={styles.chartContainer}>
                  <View style={{ paddingVertical: 15, paddingLeft: 20, width: 80 }}>
                    <Text
                      style={{
                        fontFamily: 'montserrat-bold',
                        fontWeight: 'bold',
                      }}
                    >
                      단백질
                    </Text>
                  </View>
                  <View style={{ width: '100%' }}>
                    <StackedBarChart
                      style={styles.chart}
                      keys={keys}
                      colors={colors}
                      data={this.state.data[2]}
                      showGrid={false}
                      horizontal={true}
                    />
                  </View>
                </View>
                <View style={styles.chartContainer}>
                  <View style={{ paddingVertical: 15, paddingLeft: 20, width: 80 }}>
                    <Text
                      style={{
                        fontFamily: 'montserrat-bold',
                        fontWeight: 'bold',
                      }}
                    >
                      지방
                    </Text>
                  </View>
                  <View style={{ width: '100%' }}>
                    <StackedBarChart
                      style={styles.chart}
                      keys={keys}
                      colors={colors}
                      data={this.state.data[3]}
                      showGrid={false}
                      horizontal={true}
                    />
                  </View>
                </View>
              </View>
            </View>
            {/* 탄수화물 */}
            <Text
              style={{
                position: 'absolute',
                left: width / 2 + 10,
                top: 82,
                // color:nowTheme.COLORS.WHITE,
              }}
            >
              {
              (this.state.data[0][0].total == 0 ? 100 :
                Math.floor(
                  (this.state.data[0][0].current / 
                    (this.state.data[0][0].current+this.state.data[0][0].total)) * 100)) + '%'
                }
            </Text>
            <Text
              style={{
                position: 'absolute',
                left: width / 2 + 10,
                top: 152,
              }}
            >
            {
            (this.state.data[1][0].total == 0 ? 100 :
              Math.floor(
                (this.state.data[1][0].current / 
                  (this.state.data[1][0].current+this.state.data[1][0].total)) * 100)) + '%'
              }
            </Text>
            <Text
              style={{
                position: 'absolute',
                left: width / 2 + 10,
                top: 222,
                // color:nowTheme.COLORS.WHITE,
              }}
            >
            {
            (this.state.data[2][0].total == 0 ? 100 :
              Math.floor(
                (this.state.data[2][0].current / 
                  (this.state.data[2][0].current+this.state.data[2][0].total)) * 100)) + '%'
              }
            </Text>
            <Text
              style={{
                position: 'absolute',
                left: width / 2 + 10,
                top: 292,
                // color:nowTheme.COLORS.WHITE,
              }}
            >
            {
            (this.state.data[3][0].total == 0 ? 100 :
              Math.floor(
                (this.state.data[3][0].current / 
                  (this.state.data[3][0].current+this.state.data[3][0].total)) * 100)) + '%'
              }
            </Text>
          </ScrollView>
        )}
      </AuthConsumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: nowTheme.COLORS.BORDER_COLOR,
  },
  content: {
    flexDirection: 'column',
    flex: 1,
    // paddingHorizontal: 20,
    // paddingLeft:20,
    paddingVertical: 10,
  },
  chartContainer: {
    // alignItems: 'flex-end',
    // backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    flex: 1,
    // paddingLeft:30,
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  chart: {
    width: '100%',
    height: 50,
    // borderWidth:0.5,
    // borderColor:nowTheme.COLORS.BLACK,
    paddingLeft: 10,
    paddingRight: 100,
  },
});
