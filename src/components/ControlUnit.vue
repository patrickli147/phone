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
        
        <Button icon="md-add"></Button>
        <Button icon="md-remove"></Button>
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
          startTime: 0
      }
  },
  methods: {
      //change the value of isCollapsed
      handleChangeCollapse() {
          this.isCollapsed = !this.isCollapsed;
      },
      //change the value of isLocked
      changeLockState() {
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
          //console.log("start")
      },
      //longPressEnd
      longPressEnd() {
          const endTime = Date.now();
          if (endTime - this.startTime < 2000) {
              //time is not long enough
              this.changeLockState();
              return;
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
      },
      ...mapMutations({
          setLockState: 'LOCK_STATE',
          setPoweroffState: 'POWER_OFF_STATE',
          setIsUnlockRequested: 'SET_IS_UNLOCK_REQUESTED',
          setIsBlackScreen:'SET_IS_BLACK_SCREEN'
      })
  },
  computed: {
      ...mapGetters([
        'isPoweredOff',
        'isLocked',
        'isUnlockRequested',
        'isBlackScreen'
      ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
