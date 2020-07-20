<template>
  <div id="app">
    <router-view></router-view>
    <hello-world ></hello-world>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  mounted() {
    window.addEventListener("beforeunload", () => {
      this.writeToLocalStorage();
    });
    this.readFromLocalStorage();
  },
  beforeDestroy() {
    this.writeToLocalStorage();
  },
  methods: {
    ...mapMutations({
      updatePictures: 'UPDATE_PICTURES'
    }),
    //handle close
    handleClose() {
      this.writeToLocalStorage();
    },
    //handle refresh
    handleRefresh() {
      this.writeToLocalStorage();
    },
    // read data from localstorage
    readFromLocalStorage() {
      try {
        //读取pictures
        let picturesFromLocalStorage = JSON.parse(window.localStorage.getItem("pictures"));
        
        if (!Array.isArray(picturesFromLocalStorage)) {
          picturesFromLocalStorage = [];
        }
        this.updatePictures(picturesFromLocalStorage);
      } catch(e) {
        console.log(e);
      }       
    },
    // write date to localstorage
    writeToLocalStorage() {
      try {
        window.localStorage.setItem("pictures", JSON.stringify(this.pictures));
      } catch(e) {
        console.log(e);
      }

      //调试用，删除localstorage
      //window.localStorage.setItem("pictures", []);
    }
  },
  computed: {
    ...mapGetters([
      'pictures'
    ])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

  
  user-select: none;
  min-width: 420px;
  
}
</style>
