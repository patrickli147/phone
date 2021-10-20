<template>
  <div class="phone" @mousemove="onMousemove">
    <div
        class="phone-wrap"
        :style="rotateStyle"
    >
        <div class="top-wrap">
            <div class="sensor">
                <div class="sensor-bg"></div>
            </div>
            <div class="audio">

            </div>
        </div>

        <div class="screen-wrap">
            <div class="power-off-wrap">
                <transition :name="isAppTransitionNeeded ? 'app-transition' : 'no'" mode="out-in">
                    <router-view>
                    </router-view>
                </transition>
            </div>
        </div>

        <div class="home-wrap">
            <div class="home-icon" @click="handleHomeClicked"></div>
        </div>

        <div class="phone-piece left-side"></div>
        <div class="phone-piece right-side"></div>
        <div class="phone-piece top-side"></div>
        <div class="phone-piece bottom-side"></div>
        <div class="phone-piece back"></div>
    </div>
    <div class="control-unit-wrap">
        <control-unit
            @showPowerOffModal="handleShowPowerOffModal"
            @showPowerOnAnimation="handleShowPowerOnAnimation"
        ></control-unit>
    </div>
  </div>
</template>

<script>
import ControlUnit from './ControlUnit'
import {mapGetters,mapMutations} from 'vuex'
import _throttle from '../utils/throttle';

export default {
  name: 'Phone',
  props: {
    msg: String
  },
  created() {
      this.date = new Date();
  },
  mounted() {
    //更新时间
    this.updateTimeInterval = this.updateTime();
  },
  components: {
    ControlUnit,
  },
  beforeDestroy() {
      clearInterval(this.updateTimeInterval);
      this.updateTimeInterval = null;
  },
  data() {
      return{
          //current date
          date: null,
          //update time interval
          updateTimeInterval: null,
          //need app-transition apps
          needAppTransitions: [
              '/phone/desktop',
              '/phone/camera',
              '/phone/albums',
              '/phone/calculator',
              '/phone/calendar',
              '/phone/poem',
              '/phone/unsapp/welcome',
          ],
          rotateData: {
              x: 1,
              y: 1,
              z: 0,
              degree: 45
          }
      }
  },
  methods: {
      //show power off modal, let user confirm; unshown if canceled
      handleShowPowerOffModal() {
          //if already in this page
          console.log(this.$route.path);
          if (this.$route.path === '/phone/poweroffmodal') {
              return;
          }

          this.$router.push('/phone/poweroffmodal');
          //console.log(this.isPoweroffConfirmed);
      },
      //show power on animation
      handleShowPowerOnAnimation() {
          this.$router.push('/phone/powerOnAnimation')
      },
      //show power off
      powerOff() {
        //   console.log("poweroff")
          this.changePoweroffComfirmed(false);

        //   console.log(this.$route);
        //   console.log(window.location.hash);
          this.$router.push('/phone/poweroff');
      },
      ...mapMutations({
          changePoweroffComfirmed:'POWER_OFF_CONFRIMED_MUTATION',
          setIsUnlockRequested: 'SET_IS_UNLOCK_REQUESTED',
          setIsBlackScreen:'SET_IS_BLACK_SCREEN'
      }),
      //update time
      updateTime() {
          return setInterval(() => {
              this.date = new Date();
          }, 500);
      },
      //handleHomeClicked
      handleHomeClicked() {
          //已关机
          if(this.isPoweredOff) {
              return;
          }

          //已锁屏
          if (this.isLocked) {
              if (this.isBlackScreen) {
                  this.setIsBlackScreen(false);
              }
              else {
                  this.setIsUnlockRequested(true);
              }
          }
          else {
              //back to desktop
              this.$router.push('/phone/desktop');
          }
      },
      onMousemove: _throttle(function(e) {
          const {clientX} = e;
          this.rotateData.degree = clientX;
      }, 1)
  },
  computed: {
      ...mapGetters([
          'isPoweroffConfirmed',
          'isPoweredOff',
          'isLocked',
          'isBlackScreen'
      ]),
      hour() {
          return this.date.getHours() < 10 ? '0' + this.date.getHours() : this.date.getHours();
      },
      minute() {
          return this.date.getMinutes() < 10 ? '0' + this.date.getMinutes() : this.date.getMinutes();
      },
      //true: need app-transition
      isAppTransitionNeeded() {
          let path = this.$route.path;
          return this.needAppTransitions.includes(path);
      },
      rotateStyle() {
          const {x, y, z, degree} = this.rotateData;
          return {
              transform: `rotate3d(${x}, ${y}, ${z}, ${degree}deg)`
          }
      }
  },
  watch: {
      isPoweroffConfirmed() {
          if (this.isPoweroffConfirmed) {
              //power off
            this.powerOff();
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
div.phone {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    color: white;

    --main-color: #000;
    --phone-x: 350px;
    --phone-y: 600px;
    --phone-z: 20px;
    --border-width: 5px;
    --border-radius-front: 30px;

    box-sizing: content-box;

    div.phone-wrap {
        align-self: center;
        height: 600px;
        width: 350px;
        border: 5px solid black;
        border-radius: 30px;
        background-color: #111;
        position: relative;
        transform-style: preserve-3d;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        div.top-wrap {
            width: 100%;
            height: 10%;

            display: flex;
            justify-content: flex-start;
            align-items: center;
            .sensor {
                width: 42.5%;
                display: flex;
                justify-content: flex-end;

                div.sensor-bg {
                    background-color: #0051ffb0;
                    width: 2%;
                    height: 0;
                    padding-bottom: 2%;
                    margin-right: 5%;
                    border-radius: 50%;
                }
            }

            div.audio {
                background-color: #444;
                width: 15%;
                height: 5%;
                border-radius: 5%;
            }
        }

        div.screen-wrap {
            background-image: url('../assets/wallpaper.jpg');
            background-size: cover;
            height: 80%;
            width: 100%;



            .power-off-wrap {
                width: 100%;
                height: 100%;

                //过渡动画
                .app-transition-enter-active {
                    transition: all .5s;
                }
                .app-transition-enter {
                    transform: scale(0.1);
                    transform-origin: 50% 10%;
                    opacity: 0;
                }
            }
        }

        div.home-wrap {
            height: 10%;
            width: 100%;

            display: flex;
            justify-content: center;
            align-items: center;
            div.home-icon {
                background-color: #000;
                box-shadow: 0 0 3px #999;
                width: 13%;
                height: 0;
                padding-bottom: 13%;
                border-radius: 50%;
            }
        }

        .phone-piece {
            --main-color: red;
            background: var(--main-color);
            // border: 5px solid black;
        }

        .left-side {
            position: absolute;
            width: var(--phone-z);
            height: var(--phone-y);
            left: calc(-1 * var(--border-width));
            transform: rotateY(90deg);
            transform-origin: top left;

            background: blue;
        }

        .right-side {
            position: absolute;
            width: var(--phone-z);
            height: var(--phone-y);
            right: calc(-1 * var(--border-width));
            transform: rotateY(-90deg);
            transform-origin: top right;

            background: green;
        }

        .top-side {
            position: absolute;
            width: var(--phone-x);
            height: var(--phone-z);
            top: calc(-1 * var(--border-width));
            transform: rotateX(-90deg);
            transform-origin: top center;

            background: pink;
        }

        .bottom-side {
            position: absolute;
            width: var(--phone-x);
            height: var(--phone-z);
            bottom: calc(-1 * var(--border-width));
            transform: rotateX(90deg);
            transform-origin: bottom center;

            background: orange;
        }

        .back {
            position: absolute;
            width: var(--phone-x);
            height: var(--phone-y);
            transform: translateZ(-20px);
            border-radius: var(--border-radius-front);

            background: purple;
        }
    }
    .powerOffAnimation {
        animation: powerOffAnimation 1s 5;
    }
    div.control-unit-wrap {

        margin-left: 5%;
    }
}
</style>
