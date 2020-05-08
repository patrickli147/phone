<template>
  <div class="poweron">
      <div class="logo">
          <img src="../assets/apple.png" alt="...">
      </div>
      <div class="progress">
          <Progress
             :percent="percent"
             :stroke-width='3'
             hide-info
          ></Progress>
      </div>
  </div>
</template>

<script>
import {mapMutations} from 'vuex';

export default {
  name: 'Poweron',
  props: {
    
  },
  mounted() {
      this.finishProgress();
  },
  data() {
      return {
          //percent of animation
          percent: 0
      }
  },
  methods: {
      //show animation by finishing progress
      finishProgress() {
          setTimeout(() => {
              if (this.percent === 100) {
                  this.animationFinished();
              }
              else {
                  this.percent ++;
                  this.finishProgress();
              }
              
          }, 20);
      },
      //called when animation finished
      animationFinished() {
          
          //
          //等待动画延迟
          setTimeout(() => {
              //console.log("finished");
              this.setIsBlackScreen(false);

              //开机时清空调用栈
              this.updatePageStack([]);

              this.$router.push('/phone/locked');
          }, 300);
      },
      ...mapMutations({
          setIsBlackScreen: 'SET_IS_BLACK_SCREEN',
          updatePageStack: 'UPDATE_PAGESTACK'
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.poweron {
    width: 100%;
    height: 100%;
    background-color: black;

    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    .logo {
        width: 100%;
        padding-top: 20%;
        img {
            width: 100px;
            height: 100px;
        }
    }
    .progress {
        margin-top: -20%;
        width: 35%;
    }
}
</style>
