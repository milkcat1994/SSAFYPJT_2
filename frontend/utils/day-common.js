import moment from "moment";
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
moment.locale('ko');

function getNowMonth() {
    return moment().format("YYY-MM-DD")
}

function getCurrentDate() {
    return moment().format("YYYY-MM-DD");
}

//YYYY-MM-DD -> YYYY년 MM월 DD일로 나타내기
function convertDateCalendar(date) {
    return moment(new Date(date)).format("YYYY년 MM월 DD일");
}

function getDayOfMonth(date) {
    return moment(date, "YYYY-MM").daysInMonth()
}

function isToday(date) {
    return moment(date).isSame(moment(), "day");
}

function isNowMonth(date) {
    return moment(date).isSame(moment(), "month")
}

function isOneDayBefore(date) {
    return moment(date).subtract(1, 'day').format('YYYY-MM-DD');
}

function isNowMonths(date, now) {
    return moment(date).isSame(now, "month")
}

function getEndDate(startDate, term) {
    return moment(moment(new Date(startDate)).format('YYYY-MM-DD')).add(term, 'day').format('YYYY-MM-DD')
}

//un -> asia
function getFormatDate(regtime) {
    return moment(regtime).add(9, 'hours').format('YYYY-MM-DD');
}

function getDayDiff(startDate, endDate) {
    return moment(new Date(endDate), "YY-MM-DD").diff(moment(new Date(startDate)), 'days');
}
export { getNowMonth, isOneDayBefore, isToday, getFormatDate, getCurrentDate, convertDateCalendar, getDayOfMonth, isNowMonth, isNowMonths };