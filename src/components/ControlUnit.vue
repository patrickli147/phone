<template>
  <div class="control-unit-wrap">
    <Button icon="ios-arrow-forward" v-if="isCollapsed" @click="handleChangeCollapse"></Button>
    <ButtonGroup vertical v-else>
        <Button icon="ios-arrow-down" @click="handleChangeCollapse"></Button>
        <div
            @mousedown="longPressStart"
            @mouseup="longPressEnd"
        >
          <Button icon="md-power"></Button>
        </div>

        <Tooltip :content="rotateHinter" placement="right">
            <Button :icon="rotateIcon" @click="onAddClick"></Button>
        </Tooltip>
    </ButtonGroup>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'ControlUnit',
  props: {
    isPowerOffComfirmed: Boolean
  },
  mounted() {

  },
  data() {
      return {
          //true: control unit is collapsed
          isCollapsed: false,
          //start time of a long press
          startTime: 0,
          //longpress interval
          longPressInterval: null,
          //true: is pressing
          isPressing: false,
          // rotate controller
          isRotating: false
      }
  },
  methods: {
      //change the value of isCollapsed
      handleChangeCollapse() {
          this.isCollapsed = !this.isCollapsed;
      },
      //change the value of isLocked
      changeLockState() {
          //已关机
          if(this.isPoweredOff) {
              return;
          }

          //console.log("change lock state")
          if (this.isLocked) {
              //the phone is locked
              //this.$emit('showUnlockModal');
              if (this.isBlackScreen) {
                 //show black screen
                 this.setIsBlackScreen(false);
                 this.setIsUnlockRequested(false);
              }
              else {
                  //request to unlock
                  this.setIsBlackScreen(true);
              }
          }
          else {
              //lock the phone
              this.setIsBlackScreen(true);
              this.$router.push('/phone/locked');
          }
      },
      //longPressStart
      longPressStart() {
          this.startTime = Date.now();
          this.isPressing = true;
          //console.log("start")

          this.longPressInterval = setInterval(() => {
              let currentTime = Date.now();
              if (currentTime - this.startTime > 2000) {
                  this.longPressEnd();
              }
          }, 100);

      },
      //longPressEnd
      longPressEnd() {
          if (!this.isPressing) {
              //按下动作已经结束或超过2000ms
              return;
          }

          const endTime = Date.now();
          if (endTime - this.startTime < 2000) {
              //time is not long enough
              this.changeLockState();
          }
          else {
              if (!this.isPoweredOff) {
                  //if phone is on, send request to power off
                  this.$emit("showPowerOffModal");
              }
              else {
                  //phone is powered off, turn it on
                  this.setPoweroffState(false);
                  this.$emit("showPowerOnAnimation");
              }
          }

          //按下动作结束
          this.isPressing = false;
      },
      ...mapMutations({
          setLockState: 'LOCK_STATE',
          setPoweroffState: 'POWER_OFF_STATE',
          setIsUnlockRequested: 'SET_IS_UNLOCK_REQUESTED',
          setIsBlackScreen:'SET_IS_BLACK_SCREEN'
      }),
      onAddClick() {
          this.isRotating = !this.isRotating;
          this.$emit("addclick");
      }
  },
  computed: {
      ...mapGetters([
        'isPoweredOff',
        'isLocked',
        'isUnlockRequested',
        'isBlackScreen'
      ]),
      rotateHinter() {
          return this.isRotating
              ? 'Click to Stop'
              : 'Click to Rotate';
      },
      rotateIcon() {
          return this.isRotating
              ? 'ios-bulb-outline'
              : 'ios-bulb';
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
