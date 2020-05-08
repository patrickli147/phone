<template>
  <div class="poweroff">
      关机啦
  </div>
</template>

<script>
import {mapMutations} from 'vuex'
export default {
  name: 'PowerOff',
  props: {
    
  },
  mounted() {
    //set POWER_OFF_STATE to true: the phone is powered off
    this.setPoweroffState(true);
  },
  methods: {
    ...mapMutations({
      setPoweroffState: 'POWER_OFF_STATE'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.poweroff {
  background-color: black;
  height: 100%;
  width: 100%;
  color: red;
}
</style>
