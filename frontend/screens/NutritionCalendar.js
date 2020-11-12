import React from 'react';
import http from "../utils/http-common";
import { ProgressBarAndroid, View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Block, Text, theme, Button as GaButton } from 'galio-framework';
import Icon from '../components/Icon';
// https://www.npmjs.com/package/react-native-svg-charts
import { StackedBarChart } from 'react-native-svg-charts';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { nowTheme } from '../constants';
import { AuthConsumer, Context } from '../contexts/auth';
import {getNowMonth, isNowMonth, isNowMonths, getFormatDate, convertDateCalendar, getDayOfMonth} from '../utils/day-common'

const { width, height } = Dimensions.get('screen');
export default class NutritionCalendar extends React.Component {
    calendarColor = []

  constructor(props, context) {
    super(props, context);
    this.state = {
      calendarStatusText:'0/30',
      missionList:[],
      uid: Context._currentValue.state.uid,
      markedDates:{},
      calendarSuccess:0,
      calendarTotalDay:0,
    };
    this.goNutritionDetailScreen.bind(this)
    this.getDayOfMonthText.bind(this)
    
      // value: Context._currentValue.state.combiSearchText,
    //   Object {
    //     "accountType": "",
    //     "isLoggedIn": false,
    //     "nickname": "",
    //     "uid"
    //   console.log(Context._currentValue.state);
    this.calendarColor = [
        nowTheme.COLORS.INFO,
        nowTheme.COLORS.ERROR
      ];
    // if(Context._currentValue.state.uid === ''){
    //   this.props.navigation.navigate('로그인');
    // }
  }
  
  
  updateView(props) {
    // http 요청 받아야함. 해당 월의
    console.log(this.state.uid)
    http
      .get("/mission?uid="+this.state.uid)
      .then(({data}) => {
        let tempMission = {}
        let success = 0
        let missionList = []
        data.forEach((obj) => {
          let rObj = {}
          // 2020-10-05T15:00:00.000+0000
          rObj['createDate'] = getFormatDate(obj.createDate.split('+')[0].replace('T',' '))
          rObj['progress'] = obj.progress
          rObj['profileUid'] = obj.profileUid
          let te = obj.targetEnergy
          let tc = obj.targetCarbohidrate
          let tp = obj.protein
          let tf = obj.targetFat
          //members는 for문 돌면서 해당 날짜 success인지 확인
          obj.members.forEach(e => {
            te-=e.energy
            tc-=e.carbo
            tp-=e.protein
            tf-=e.fat
          });
          if(te < 0 || tc < 0 || tp < 0 || tf < 0)
            rObj['result'] = false
          else
            rObj['result'] = true
            /*
              '2020-10-01': {
                  endingDay: true,
                  startingDay: true,
                  color: this.calendarColor[0],
                  textColor: nowTheme.COLORS.WHITE
              },
            */

            tempMission[rObj['createDate']] = {
              selected:false,
              color: rObj['result'] ? (this.calendarColor[0]) : this.calendarColor[1],
              textColor: nowTheme.COLORS.WHITE,
            };
            missionList.push({
              day: rObj['createDate'],
              success: rObj['result'],
            })

            success += (isNowMonth(rObj['createDate']) ? (rObj['result'] ? 1 : 0) : 0)

          // set(rObj['createDate'], {
          //   // selected: true,
          //   startingDay: true,
          //   endingDay: true,
          //   color: rObj['result'] ? this.calendarColor[0] : this.calendarColor[1],
          //   textColor: nowTheme.COLORS.WHITE
          // })
        });
        console.log('캘린더>>')
        console.log(tempMission)
        let totalDay = getDayOfMonth(getNowMonth())
        this.setState({
          markedDates: tempMission,
          calendarSuccess: success,
          calendarTotalDay: totalDay,
          calendarStatusText: success+'/'+totalDay,
          missionList: missionList,
        })
        console.log("사용자의 미션 가져오기 성공");
        return;
      })
      .catch(e => {
        console.log(e);
        console.log("사용자의 미션 가져오기 실패")
      });
  }

  componentWillReceiveProps(nextProps) {
    this.updateView(nextProps);
  }

  componentDidMount() {
    // console.log(Context)
    //로그인 되있지 않다면 로그인 화면으로 전환
    this.updateView(this.props);
  }

//   dateString : YYYY-MM-DD
  goNutritionDetailScreen(day) {
    this.props.navigation.navigate('영양상세', {
      dayTitle: convertDateCalendar(day.dateString),
      date: day.dateString,
      day: day,
    });
  }

  getDayOfMonthText(date){
    if(date.length == 1){
        //해당 월의 성공 수를 앞에 표시해야한다.
        let totalDay = getDayOfMonth(date[0].dateString)
        let success = 0
        // console.log(this.state.markedDates)
        this.state.missionList.forEach(e => {
          console.log(e.day+' <> '+ date[0].dateString)
          success += ((isNowMonths(e.day, date[0].dateString) && e.success) ? 1 : 0)
        })
        this.setState({
          calendarSuccess: success,
          calendarStatusText: success+'/'+totalDay,
          calendarTotalDay: totalDay
        })
    }
  }

  render() {
    // console.log(this.state.markedDates)
    return (
      <AuthConsumer>
        {({ state, actions }) => (
            <View style={styles.container}>
              <View style={styles.content}>
                <CalendarList
                  // Collection of dates that have to be colored in a special way. Default = {}
                  horizontal={true}
                  pagingEnabled={true}
                  markedDates={this.state.markedDates}
                  monthFormat={'yyyy년 MM월'}
                  onDayPress={(day) => {
                    // console.log('selected day', day);
                    this.goNutritionDetailScreen(day);
                  }}
                  onVisibleMonthsChange={(months) => {
                    // console.log('month changed', months);
                    this.getDayOfMonthText(months)
                  }}
                  // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
                  markingType={'period'}
                />
                <View style={styles.calendarStatus}>
                    <View style={styles.statusItem}>
                        <Icon
                            family="AntDesign"
                            size={20}
                            name="checkcircleo"
                            color={this.calendarColor[0]}
                            style={{
                                marginBottom:5,
                            }}
                        />
                        <Text
                            size={15}
                            style={{
                                fontFamily: 'montserrat-regular',
                                marginBottom:5,
                                // fontWeight: 'bold',
                            }}
                        >목표를 달성한 날</Text>
                        <Text
                            size={20}
                            style={{
                                fontFamily: 'montserrat-bold',
                                fontWeight: 'bold',
                            }}
                        >{this.state.calendarStatusText}</Text>
                    </View>
                    {/* <View>
                        <Text>가나다</Text>
                    </View> */}
                </View>
              </View>
            </View>
        )}
      </AuthConsumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 10,
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
  calendarStatus: {
    // alignItems: 'flex-end',
    // backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  statusItem: {
    flexDirection: 'column',
    alignItems:'center',
  },
});
