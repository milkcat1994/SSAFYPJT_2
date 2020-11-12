<template>
  <div>
    <!-- <img class = "home" :src="bgImg"/> -->
    <HelloWorld/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  props: {
    bgImg: {
      type: String,
      default: "img/background.png",
      description: "Sidebar app logo",
    },
  }
  // data:() =>{
  //   return{
  //     url : require('/home/ubuntu/www/html/dist/background.png'),
  //   }
  // }
}
</script>
<style>
  .home{
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
  }
</style>