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
          <drop-zone
            :itemWidth="42"
            :itemHeight="66"
            :rowGap="20"
            :columnGap="40"
          >
            <div
              class="app-item"
              :class="[
                'app-item',
                {
                  'app-item-shaking': isAppsShaking
                }
              ]"
              v-for="(item2, index2) in item1" :key="index2"
              @click="openApp(item2.path)"
            >
              <img :src="item2.icon" alt="...">
              <p>{{item2.name}}</p>
            </div>
          </drop-zone>
        </div>
      </div>
      <!-- app 结束 -->

      <!-- dots 开始 -->
      <div class="dots">
        <div
          v-for="(item, index) in apps"
          :key="index"
          :class="index === currentIndex ? 'dot-item current' : 'dot-item'"
          @click="setCurrentIndex(index)"
        >

        </div>
      </div>
      <!-- dots 结束 -->

      <!-- 底部应用 开始 -->
      <div class="bottom-apps">
        <drop-zone
          :rows="1"
          :columnGap="40"
          :itemWidth="42"
          :itemHeight="42"
          :isDragOutAllowed="false"
        >
          <div class="bottom-app-item" v-for="(item, index) in bottomApps" :key="index" @click="openApp(item.path)">
            <img :src="item.icon" alt="...">
          </div>
        </drop-zone>
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
import gearIcon from '@/assets/gear.png';

import DropZone from './common/draggable/DropZone.vue';

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
            name: '游戏',
            path: '/phone/poem',
            icon: poemgameIcon
          },
          {
            name: '游戏',
            path: '/phone/poem',
            icon: poemgameIcon
          },
          {
            name: '游戏',
            path: '/phone/poem',
            icon: poemgameIcon
          },
          {
            name: '游戏',
            path: '/phone/poem',
            icon: poemgameIcon
          },
          {
            name: '游戏',
            path: '/phone/poem',
            icon: poemgameIcon
          },
          {
            name: '游戏',
            path: '/phone/poem',
            icon: poemgameIcon
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
          },
          {
            name: '设置',
            path: '/phone/settings',
            icon: gearIcon
          }
        ],
        [
          {
            name: '测试',
            path: '/phone/calculator',
            icon: calculatorIcon
          }
        ],
        [
          {
            name: '测试',
            path: '/phone/calendar',
            icon: calendarIcon
          }
        ],
        [
          {
            name: '测试',
            path: '/phone/poem',
            icon: poemgameIcon
          }
        ],
      ],
      //bottom apps
      bottomApps:[
          {
            name: '相机',
            path:'/phone/camera',
            icon: cameraIcon
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
          }
      ],
      // is apps shaking
      isAppsShaking: false,
      //current app page
      currentIndex: 0,
    }
  },
  methods: {
    //open app with given path
    openApp(path) {
      this.$router.push(path);
    },
    //setCurrentIndex
    setCurrentIndex(index) {
      this.currentIndex = index;
    }
  },
  computed: {

  },
  components: {
    Topbar,
    DropZone
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

        //切换过度
        transition: all 0.5s;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        .app-item {
          // width: 25%;
          //height: 16.67%;

          img {
            width: 42px;
            height: 42px;
          }

          p {
            font-size: 12px;
            font-weight: 520;
          }

          &-shaking {
            animation: shake .3s infinite;
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
        display: flex;
        justify-content: center;
        align-items: center;
        // width: 25%;

        img {
          width: 42px;
          height: 42px;
        }
      }
    }
  }
}

$shake-scale: 3deg;

// animations
@keyframes shake {
  0% {
    transform: rotateZ(0deg);
  }

  25% {
    transform: rotateZ($shake-scale);
  }

  50% {
    transform: rotateZ(0);
  }

  75% {
    transform: rotateZ(-$shake-scale);
  }

  100% {
    transform: rotateZ(0deg);
  }
}

</style>
