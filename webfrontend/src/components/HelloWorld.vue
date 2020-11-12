<template>
  <div class="container hello">
    <div class="align-items-center">
    <!-- <a href="" download><button>Android Apk Download</button></a> -->
    <h1 style="color: #ffffff">
    <br>
    FOODMATE
    </h1>
    <p style="color: #cccccc">
    3반 6조 APK 다운로드 사이트 입니다.
    </p>
    <a href="https://drive.google.com/file/d/1isnTca-_4U0fvyNEP6mRUnUqEG8l-9j7/view?usp=sharing" download>
      <!-- <v-btn
        :loading="loading3"
        :disabled="loading3"
        color="blue-grey"
        class="ma-2 white--text mybtn"
        @click="loader = 'loading3'"
      >
        Android Apk Download
        <v-icon right dark>mdi-cloud-download</v-icon>
      </v-btn> -->
      </a>
      <br>
      <p style="color:#999999;">
      궁합, 상극 음식 검색<br>
      궁합음식 판매 음식점 정보 제공<br>
      식단 관리 기능, 체중관리 기능<br>
      권장 영양 섭취량을 고려한 음식 추천<br>
      사용자 취향을 기반으로 내 주변 음식점 추천<br>
      </p>
    <br><br><br><br><br>
    <!-- <div id="manual" :style="{ width: '40%', 'margin-left': screenWid + 'px' }"> -->

    <!-- </div> -->
    </div>

    <div class="row">
      <div  class="col-3 mb-3 d-flex justify-content-center"></div>
      <img class="col-3 mb-3 d-flex justify-content-center" style="border:dashed 3px #aaaaaa; margin:5px 5px 5px 5px" src="http://j3a306.p.ssafy.io/downloadQR.png"/>
      <!-- <img style="float:left;width:25%;" src="http://j3a306.p.ssafy.io/downloadQR.png"/> -->
      
      <p class="col-3 mb-3 d-flex justify-content-center textBox" >
        <br>
        <strong style="text-align:center; ">사용방법</strong><br><br>
        1. expo앱(<img src="http://j3a306.p.ssafy.io/expoApp.jpg" style="width: 25px;height:25px;">) 다운<br>
        2. expo 앱 실행 <br>
        3. Scan QR Code<br><br>
        ※안드로이드 전용
      </p>
      <div  class="col-3 mb-3 d-flex justify-content-center"></div>
    </div>
    
    <footer class="footer px-4" style="color:#888888;margin-top:15%">
      <div>
        윤희문 | 김지효 | 문명기 | 정세린 | 양지용(팀장)
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  watch: {
    loader () {
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 3000)

      this.loader = null
    },
  },
  data(){
    return{
      loading3: false,
      screenWid: screen.width / 2 - (screen.width*0.4)/2,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello{
  /* position: absolute; */
  /* margin-left: 40%; */
}
.mybtn{
  margin-top: 40px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  text-decoration: none;
}

.textBox {
  /* width: 25%; */
  /* height: 264px; */
  text-align:left; 
  /* float:right;  */
  border:solid 3px #aaaaaa; 
  /* margin-left: 20px; */
  margin:5px 5px 5px 5px;
  color: #cccccc;
  font-size: 22px;
}
</style>
