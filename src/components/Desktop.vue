<template>
  <div class="desktop">
    <Topbar :isBlack="(!'')"></Topbar>

    <div class="desktop-wrap">
      <!-- app 开始 -->
      <div class="apps-container">
        <div class="apps-page"
          v-for="(item1, index1) in apps"
          :key="index1"
          :style="`left:${350 * (index1 - currentIndex)}px;`"
        >
          <div class="app-item" v-for="(item2, index2) in item1" :key="index2" @click="openApp(item2.path)">
            <img :src="item2.icon" alt="...">
            <p>{{item2.name}}</p>
          </div>
        </div>
      </div>
      <!-- app 结束 -->

      <!-- dots 开始 -->
      <div class="dots">
        <div v-for="(item, index) in apps" :key="index" :class="index === currentIndex ? 'dot-item current' : 'dot-item'">

        </div>
      </div>
      <!-- dots 结束 -->

      <!-- 底部应用 开始 -->
      <div class="bottom-apps">
        <div class="bottom-app-item" v-for="(item, index) in bottomApps" :key="index">
          <img src="../assets/apple.png" alt="...">
        </div>
      </div>
      <!-- 底部应用 结束 -->
    </div>
  </div>
</template>

<script>
import Topbar from '@/components/Topbar';
import cameraIcon from '@/assets/animated_icons_camera.svg';
import photoIcon from '@/assets/photos.png';
import calculatorIcon from '@/assets/animated_icons_calculator.svg';
import calendarIcon from '@/assets/animated_icons_calendar.svg';
import poemgameIcon from '@/assets/animated_icons-_poemgame.svg';
import unsIcon from '@/assets/uns.png';

export default {
  name: 'Desktop',
  data() {
    return {
      //applications
      apps: [
        [
          {
            name: '相机',
            path:'/phone/camera',
            icon: cameraIcon
          },
          {
            name: '照片',
            path: '/phone/albums',
            icon: photoIcon
          },
          {
            name: '日历',
            path: '/phone/calendar',
            icon: calendarIcon
          },
          {
            name: '计算器',
            path: '/phone/calculator',
            icon: calculatorIcon
          },
          {
            name: '游戏',
            path: '/phone/poem',
            icon: poemgameIcon
          },
          {
            name: 'uns',
            path: '/phone/unsapp/welcome',
            icon: unsIcon
          }
        ],
        [
          {
            name: '计算器',
            path: '/phone/calculator',
            icon: calculatorIcon
          }
        ]
      ],
      //bottom apps
      bottomApps:[
        {
          name: '电话'
        },
        {
          name: '浏览器'
        },
        {
          name: '信息'
        },
        {
          name: '设置'
        }
      ],
      //current app page
      currentIndex: 0,
    }
  },
  methods: {
    //open app with given path
    openApp(path) {
      this.$router.push(path);
    }
  },
  computed: {
    
  },
  components: {
    Topbar
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.desktop {
  width: 100%;
  height: 100%;

  .desktop-wrap {
    width: 100%;
    height: 95%;


    .apps-container {
      width: 100%;
      height: 88%;
      position: relative;
      overflow: hidden;
      .apps-page {
        position: absolute;
        width: 100%;
        //height: 100%;

        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-wrap: wrap;
        .app-item {
          width: 25%;
          //height: 16.67%;

          img {
            width: 42px;
            height: 42px;
          }

          p {
            font-size: 12px;
            font-weight: 520;
          }
        }
      }
    }

    .dots {
      width: 100%;
      height: 2%;

      display: flex;
      justify-content: center;
      align-items: center;
      .dot-item {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: rgba(187, 187, 187, 0.678);
        margin: 2px;
      }
      .current {
        background-color: #fff;
      }
    }

    .bottom-apps {
      width: 100%;
      height: 10%;
      background-color: rgba(175, 163, 163, 0.336);

      display: flex;
      justify-content: center;
      .bottom-app-item {
        width: 25%;

        img {
          width: 42px;
          height: 42px;
        }
      }
    }
  }
}
</style>
