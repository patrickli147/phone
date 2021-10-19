<template>
    <div class="top" v-if="!isBlackScreen" :style="topBarStyle">
        <div class="top-left">
            <div class="signal">
                <img v-if="isColorBlack" src="../assets/signal.png" alt="...">
                <img v-else src="../assets/signal-black.png" alt="...">
            </div>
            <div class="runner">
                运营商
            </div>
            <div class="wifi">
                <img v-if="isColorBlack" src="../assets/wifi.png" alt="...">
                <img v-else src="../assets/wifi-black.png" alt="...">
            </div>
        </div>

        <div class="lockicon" v-if="isLocked">
            <img src="../assets/lock.png" alt="...">
        </div>
        <div class="time" v-else>
            {{hour}}:{{minute}}
        </div>
        <div class="power">
            <Icon type="ios-battery-full" color="rgb(33, 248, 97)" size="20"/>
        </div>
    </div>
    <div class="top blackscreened" v-else></div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'top',
  props: {
     isBlack: Boolean,
     topBarStyle: Object
  },
  created() {
      this.date = new Date();
      //console.log("created");
  },
  mounted() {
    this.updateTimeInterval = this.updateTime();
  },
  methods: {
      //update time
      updateTime() {
          return setInterval(() => {
              this.date = new Date();
          }, 500);
      },
  },
  data() {
      return{
          //current date
          date: null,
          //update time interval
          updateTimeInterval: null,
          //true when the main color if black
          isColorBlack: this.isBlack
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
      isBlack() {
          this.isColorBlack = this.isBlack;
          console.log(this.isBlack);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.top {
    width: 100%;
    height: 5%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    img {
        height: 10px;
        width: 10px;
    }
    .top-left {
        width: 30%;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .runner {
            font-size: 13px;
        }
        .wifi {
            img {
                height: 18px;
                width: 18px;
                display: flex;
            }
        }
    }
    .lockicon {
        width: 40%;
    }
    .time {
        width: 40%;
        text-align: center;
    }
    .power {
        width: 30%;
        display: flex;
        justify-content: flex-end;
    }
}

.blackscreened {
    background-color: #000;
}
</style>
