<template>
  <div
    class="phone"
    @mousemove="onMousemove"
    @mouseleave="onMouseleave"
  >
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

        <!-- used for side view -->
        <div v-show="isSideViewShown" :style="hideGapStyle" class="phone-piece left-side"></div>
        <div v-show="isSideViewShown" :style="hideGapStyle" class="phone-piece right-side"></div>
        <div v-show="isSideViewShown" :style="hideGapStyle" class="phone-piece top-side"></div>
        <div v-show="isSideViewShown" :style="hideGapStyle" class="phone-piece bottom-side"></div>
        <div
            :class="['phone-piece', 'back', {'last-back': count === backNum}]"
            v-for="count in backNum"
            :key="count"
            :style="`transform: translateZ(-${count/ (backNum / basicSides)}px)`"
            v-show="isRotateStarted"
        ></div>

        <div class="back-camera-wrap" v-show="isRotateStarted">
            <div class="flash"></div>
            <div class="camera-container">
                <div class="camera"></div>
                <div class="camera"></div>
            </div>
        </div>

        <div class="mics-wrap left-mics" v-show="isRotateStarted">
            <div
                class="mics"
                v-for="count in numOfBottomMicrophone"
                :key="count"
            ></div>
        </div>

        <div class="mics-wrap charger" v-show="isRotateStarted">
        </div>

        <div class="mics-wrap right-mics" v-show="isRotateStarted">
            <div
                class="mics"
                v-for="count in numOfBottomMicrophone"
                :key="count"
            ></div>
        </div>

        <div class="left-side-detail" v-show="isRotateStarted">
            <div class="mute">
                <div class="switcher"></div>
            </div>

            <div class="volumn">
                <div class="volumn-item"></div>
                <div class="volumn-item"></div>
            </div>
        </div>

        <div class="right-side-power" v-show="isRotateStarted"></div>

    </div>
    <div class="control-unit-wrap" >
        <control-unit
            @showPowerOffModal="handleShowPowerOffModal"
            @showPowerOnAnimation="handleShowPowerOnAnimation"
            @addclick="onAddClick"
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
              '/phone/settings'
          ],
          rotateData: {
              x: 1,
              y: 1,
              z: 0,
              degree: 45,
              rotateX: 0,
              rotateY: 0,
              lastX: 0,
              lastY: 0
          },
          // back of the phone
          backNum: 80,
          // basic thick of side view
          basicSides: 20,
          // num of bottom microphone
          numOfBottomMicrophone: 8,
          // control rotate
          isRotateStarted: false
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
          if (!this.isRotateStarted) {
              return;
          }
          const {clientX, clientY} = e;
          const {lastX, lastY, rotateX, rotateY} = this.rotateData;
          if (lastX !== 0 || lastY !== 0) {
              this.rotateData.rotateY = ((rotateY + clientX - lastX) % 360);
              this.rotateData.rotateX = ((rotateX + clientY - lastY) % 360);
          }
          this.rotateData.lastX = clientX;
          this.rotateData.lastY = clientY;
          // this.rotateData.degree = clientX - clientX + 45;
      }, 1),
      onMouseleave() {
          this.initRotate();
      },
      initRotate() {
          this.rotateData = {
              x: 1,
              y: 1,
              z: 0,
              degree: 45,
              rotateX: 0,
              rotateY: 0,
              lastX: 0,
              lastY: 0
          };
      },
      onAddClick() {
          const {isRotateStarted} = this;
          if (isRotateStarted) {
              this.initRotate();
              this.isRotateStarted = false;
          }
          else {
              this.isRotateStarted = true;
          }
      }
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
          const {rotateX, rotateY} = this.rotateData;
          return {
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
          }
      },
      isSideViewShown() {
          const {rotateX, rotateY} = this.rotateData;
          return (rotateX % 90 === 0 || rotateY % 90 === 0)
              && (((rotateX / 90) % 2) === 1 || ((rotateY / 90) % 2) === 1);
      },
      hideGapStyle() {
          const {rotateX, rotateY} = this.rotateData;
          return this.isSideViewShown && (Math.abs(rotateX) <= 2 || Math.abs(rotateY) <= 2)
              ? {'--phone-x': 'var(--phone-width)', '--phone-y': 'var(--phone-height)'}
              : '';
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

    --main-color: #111;
    --middle-color: #333;
    --color-black: #000;
    --phone-width: 350px;
    --phone-height: 600px;
    --phone-x: calc(var(--phone-width) - var(--border-radius-front));
    --phone-y: calc(var(--phone-height) - var(--border-radius-front));
    // --phone-x: var(--phone-width);
    // --phone-y: var(--phone-height);
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
        transition: all .3s ease;

        box-shadow: 0 0 5px #fff;

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
                    background: #203258b0;
                    box-shadow: 0 0 1px #fff;
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
                border-radius: 5px;
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
            // --main-color: red;
            background: var(--middle-color);
            z-index: -1;
            // border: 5px solid black;
        }

        .left-side {
            position: absolute;
            width: var(--phone-z);
            height: var(--phone-y);
            left: calc(-1 * var(--border-width));
            transform: rotateY(90deg);
            transform-origin: top left;

            // background: blue;
        }

        .right-side {
            position: absolute;
            width: var(--phone-z);
            height: var(--phone-y);
            right: calc(-1 * var(--border-width));
            transform: rotateY(-90deg);
            transform-origin: top right;

            // background: green;
        }

        .top-side {
            position: absolute;
            width: var(--phone-x);
            height: var(--phone-z);
            top: calc(-1 * var(--border-width));
            transform: rotateX(-90deg);
            transform-origin: top center;

            // background: pink;
        }

        .bottom-side {
            position: absolute;
            width: var(--phone-x);
            height: var(--phone-z);
            bottom: calc(-1 * var(--border-width));
            transform: rotateX(90deg);
            transform-origin: bottom center;

            // background: orange;
        }

        .back {
            position: absolute;
            width: var(--phone-width);
            height: var(--phone-height);
            transform: translateZ(-20px);
            border-radius: var(--border-radius-front);

            background: var(--middle-color);
        }

        .last-back {
            background: var(--main-color);
            box-shadow: 0 0 5px #fff;
        }
    }
    .powerOffAnimation {
        animation: powerOffAnimation 1s 5;
    }
    div.control-unit-wrap {

        margin-left: 5%;
    }
}

.back-camera-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: nowrap;

    --camera-height: 45px;

    position: absolute;
    top: 25px;
    right: 10px;
    width: 120px;
    height: var(--camera-height);
    border-radius: calc(var(--camera-height) / 2);
    transform: translateZ(-20px);
    z-index: -1;
}

.camera-container {
    --camera-height: 45px;

    width: 80px;
    height: var(--camera-height);
    border-radius: calc(var(--camera-height) / 2);
    background: var(--color-black);
    padding: 5px;
    box-shadow: 0 0 3px #444;

    display: flex;
    justify-content: space-between;
    align-items: center;

    .camera {
        --camera-radius: 15px;
        width: var(--camera-radius);
        height: var(--camera-radius);
        border-radius: var(--camera-radius);
        background: #203258b0;
        box-shadow: 0 0 3px #999;
    }
}

.flash {
    --flash-radius: 15px;
    background: #fff;
    width: var(--flash-radius);
    height: var(--flash-radius);
    border-radius: var(--flash-radius);
    margin-right: 20px;
    box-shadow: 0 0 3px #999;
}

.mics-wrap {
    --mics-radius: 7px;
    position: absolute;
    bottom: calc(-1 * var(--border-width));
    transform: rotateX(91deg) translateY(calc(-1 * var(--phone-z) / 4));
    transform-origin: bottom center;
    display: flex;
    flex-wrap: nowrap;

    .mics {
        width: var(--mics-radius);
        height: var(--mics-radius);
        border-radius: var(--mics-radius);
        background: var(--color-black);
        margin-right: 2px;
        box-shadow: 0 0 3px #444;
    }
}

.left-mics {
    left: 45px;
}

.right-mics {
    right: 45px;
}

.charger {
    width: 30px;
    height: 10px;
    background: var(--color-black);
    border-radius: 5px;
}

.left-side-detail {
    position: absolute;
    left: calc(-1 * var(--border-width));
    top: 60px;
    transform: rotateY(91deg) translateX(calc(var(--phone-z) / 4));
    transform-origin: top left;
}

.mute {
    width: 10px;
    height: 20px;
    background: #ff5500;
    display: flex;
    justify-content: flex-end;
    border-radius: 2px;

    .switcher {
        width: 50%;
        height: 100%;
        background: var(--color-black);
        border-radius: 2px;
    }
}

.volumn {
    margin-top: 20px;

    .volumn-item {
        width: 10px;
        height: 40px;
        background: var(--color-black);
        box-shadow: 0 0 3px #444;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
    }
}

.right-side-power {
    position: absolute;
    width: 10px;
    height: 40px;
    right: calc(-1 * var(--border-width));
    top: 100px;
    transform: rotateY(-90deg) translateX(calc(-1 * var(--phone-z) / 4));
    transform-origin: top right;
    background: var(--color-black);
    box-shadow: 0 0 3px #444;
    border-radius: 5px;
}

</style>
