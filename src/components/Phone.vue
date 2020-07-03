<template>
  <div class="phone">
    <div class="phone-wrap">
        <div class="top-wrap">
            <div class="sensor">
                <div class="sensor-bg"></div>
            </div>
            <div class="audio">

            </div>
        </div>

        <div class="screen-wrap">
            <div class="power-off-wrap">
                <!-- <power-off-modal 
                    @poweroffConfirmed="handlePoweroffConfirmed"
                    @poweroffCanceled="handlePoweroffCanceled"
                ></power-off-modal> -->
                <router-view
                >
                </router-view>
            </div>
        </div>

        <div class="home-wrap">
            <div class="home-icon" @click="handleHomeClicked"></div>
        </div>
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

<<<<<<< Updated upstream
          //已锁屏
=======
>>>>>>> Stashed changes
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
  },
  watch: {
      isPoweroffConfirmed() {
          if (this.isPoweroffConfirmed) {
              //power off 
            this.powerOff();
          }   
      },
      '$route'(to, from) {
          //console.log(from);
          console.log('route changed from ' + from.path + ' to ' + to.path);
          //console.log(this.$route)
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

    div.phone-wrap {
        align-self: center;
        height: 600px;
        width: 350px;
        border: 5px solid black;
        border-radius: 15px;
        background-color: #111;

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
                    background-color: orange;
                    width: 2%;
                    height: 0;
                    padding-bottom: 2%;
                    margin-right: 5%;
                    border-radius: 50%;
                }
            }
            
            div.audio {
                background-color: pink;
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
            }
        }

        div.home-wrap {
            height: 10%;
            width: 100%;

            display: flex;
            justify-content: center;
            align-items: center;
            div.home-icon {
                background-color: yellow;
                width: 13%;
                height: 0;
                padding-bottom: 13%;
                border-radius: 50%;
            }
        }
    }
    div.control-unit-wrap {

        margin-left: 5%;
    }
}

</style>
