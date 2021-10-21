<template>
  <div class="power-off-modal">
      <div class="power-off-slider">
          <div class="cover" :style="`width:${coverWidth}px`">

          </div>
          <div class="power"
            @touchstart="handleTouchstart"
            @touchmove="handleTouchmove"
            @touchend="handleTouchend"
            @mousedown="handleMousedown"
            @mousemove="handleMousemove"
            @mouseup="handleMouseup"
            @mouseleave="handleMouseup"
            :style="`left:${offset}px`"
          >
            <Button>
                <Icon type="md-power" color="red" />
            </Button>
          </div>
          <div class="toast" v-if="isToastShown">
              滑动关机
          </div>
      </div>
      <div class="power-off-cancel">
          <Button shape="circle" @click="handleCancelPoweroff">
              <Icon type="ios-close-circle"/>
          </Button>
      </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'

export default {
  name: 'powerOffModal',
  props: {
    msg: String
  },
  mounted() {
      //console.log(this.$route);
  },
  data() {
      return {
          //the width of div.cover
          coverWidth:0,
          //start x
          startX: 0,
          //true when mouse down started
          isStarted: false,
          //offset of power button
          offset: 0,
          //true: show toast
          isToastShown: true
      }
  },
  methods: {
      //handle power off button touch move
      handleTouchmove(event) {
          let currentX = event.changedTouches[0].clientX;
          this.coverWidth = currentX > this.startX ? currentX - this.startX : 0;
          this.offset = this.coverWidth;
          if (this.coverWidth > 86) {
              //unshow toast
              this.isToastShown = false;
          }
          else if (!this.isToastShown) {
              this.isToastShown = true;
          }
          if (this.coverWidth >= 165) {
              //power off confirmed
              //this.$emit("poweroffConfirmed");
              this.poweroffConfirmed();

              //reset data
              this.handleTouchend();
          }
          //console.log(this.coverWidth);
      },
      //handle power off button touch start
      handleTouchstart(event) {
          //console.log("start")
          this.startX = event.changedTouches[0].clientX;
      },
      handleTouchend() {
          this.isStarted = false;
          this.coverWidth = 0;
          this.offset = 0;
          this.isToastShown = true;
      },
      //handle power off button touch move
      handleMousemove(event) {
          if (!this.isStarted) {
              return;
          }
          //console.log(event);
          let currentX = event.pageX;
          this.coverWidth = currentX > this.startX ? currentX - this.startX : 0;
          this.offset = this.coverWidth;
          if (this.coverWidth > 86) {
              //unshow toast
              this.isToastShown = false;
          }
          else if (!this.isToastShown) {
              this.isToastShown = true;
          }
          if (this.coverWidth >= 165) {
              //power off confirmed
              //this.$emit("poweroffConfirmed");
              this.poweroffConfirmed();
              //reset data
              this.handleMouseup();
          }
          //console.log(this.coverWidth);
      },
      //handle power off button touch start
      handleMousedown(event) {
          //console.log(event);
          //console.log("start")
          this.isStarted = true;
          this.startX = event.pageX;
      },
      //handle mouse up
      handleMouseup() {
          this.isStarted = false;
          this.coverWidth = 0;
          this.offset = 0;
          this.isToastShown = true;
      },
      //handleCancelPoweroff
      handleCancelPoweroff() {
          //this.$emit("poweroffCanceled");
          if (window.history.length > 1) {
              let pageStack = this.pageStack;
              //pop当前页面
              pageStack.pop();
              //获取目标页面
              let destination = pageStack.pop();
              this.updatePageStack(pageStack);
              this.$router.push(destination);
          }
      },
      //poweroffConfirmed
      poweroffConfirmed() {
          //这里会触发phone组件中的watch 导致那边的poweroff先执行
          this.changePoweroffComfirmed(true);
        //   if (window.history.length > 1) {
        //       this.$router.go(-1);
        //   }
      },
      ...mapMutations({
          changePoweroffComfirmed:'POWER_OFF_CONFRIMED_MUTATION',
          updatePageStack: 'UPDATE_PAGESTACK'
      })
  },
  computed: {
      ...mapGetters([
          'pageStack'
      ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
div.power-off-modal {
    $out-bg:rgb(11, 6, 22);
    $out-opacity:0.5;
    width: 100%;
    height: 100%;
    background-color: $out-bg;
    padding-top: 10%;
    padding-bottom: 10%;

    display: flex;
    justify-content:space-between;
    align-items: center;
    flex-direction: column;
  div.power-off-slider {
      border-radius: 5px;
      width: 210px;
      height: 8%;
      background-color: rgba(85, 85, 85, 0.479);
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .cover {
          height: 100%;
          width: 0%;
          background-color: $out-bg;
      }
      .power {
          position: absolute;
          left: 0;
          top: 0;
      }
      .toast {
          text-align: center;
          padding-left: 30%;
      }
  }

  div.power-off-cancel {

  }
}
</style>
