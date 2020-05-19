<template>
    <div class="camera" v-show="isVideoLoaded">
        <div class="top-container">
            <video id="video" v-show="isVideoPlaying"></video>
            <canvas id="canvas"></canvas>
            
        </div>
        <div class="bottom-container">
            <div class="small-picture" @click="openPicture" @dragstart="cancelDrag">
                <img v-show="pictures.length" :src="csrc" alt="img">
            </div>
            <div class="take-picture-outline">
                <div class="take-picture" @click="handleTakePicture"></div>
            </div>    
            <div class="switchcamera" @dragstart="cancelDrag">
                <img src="../assets/share_switchcamera.png" alt="img">
            </div>
        </div>  
        <Picture :givenIndex="indexToGive" :givenData="{name: '相机胶卷'}" v-show="isPreviewed" @backIconClicked="handleBackIconClicked"></Picture>
    </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex';
import Picture from '@/components/Picture';

export default {
  name: 'camera',
  props: {
    
  },
  mounted() {
      try {
          this.getUserMedia();
      } catch(e) {
          alert("打开摄像头失败!");
          console.log(e);
          this.$router.push('phone/desktop');
      }
  },
  data() {
      return {
          //true: video is playing
          isVideoPlaying: false,
          //constraints of media
          constraints: {
              audio: false,
              video: true
          },
          //src of img
          src:'',
          //isVideoLoaded
          isVideoLoaded: false,
          //is picture previewed
          isPreviewed: false
      }
  },
  methods: {
    //get user media
    getUserMedia() {
        navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
            console.log(stream);
            let video = document.getElementById("video");
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                video.play();
                this.isVideoPlaying = true;
                this.isVideoLoaded = true;
            }
        }).catch((err) => {
            console.log(err);
        });
    },
    //handleTakePicture
    handleTakePicture() {
        let canvas = document.getElementById("canvas");
        let video = document.getElementById("video");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        this.src = canvas.toDataURL();

        //save the img to localstorage
        let name = this.getPictureName();
        let csrc = this.src;
        let currentImg = {
            name,
            csrc,
            isLiked: false
        };
        //console.log(currentImg);
        let pictures = this.pictures;
        pictures.push(currentImg);
        this.updatePictures(pictures);
    },
    //get picture name by current time
    getPictureName() {
        let date = new Date();
        let name = date.toJSON();
        return name;
    },
    //open Photos
    openPicture() {
        if (this.pictures.length === 0) {
            //no picture to show
            return;
        }
        else {
            this.isPreviewed = true;
        }
    },
    //map mutations
    ...mapMutations({
        updatePictures: 'UPDATE_PICTURES'
    }),
    //handleBackIconClicked: set isPreviewed to false
    handleBackIconClicked() {
        this.isPreviewed = false;
    },
    //cancel drag event
    cancelDrag(e) {
        e.preventDefault();
    },
  },
  computed: {
      ...mapGetters([
          'pictures'
      ]),
      //index of the first picture in pictures
      indexToGive() {
          return this.pictures.length - 1;
      },
      //current src of small picture
      csrc() {
          if (this.pictures[this.indexToGive]) {
              return this.pictures[this.indexToGive].csrc;
          }
          else {
              return '';
          }
      }
  },
  components: {
      Picture
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.camera {
    height: 100%;
    width: 100%;
    background-color: #000;
    position: relative;

    .top-container {
        width: 100%;
        height: 85%;

        video {
            width: 100%;
            height: 100%;
        }

        canvas {
            display: none;
        }
    }

    .bottom-container {

        display: flex;
        justify-content: space-between;
        align-items: center;

        .small-picture {
            width: 40px;
            height: 40px;
            background-color: #333;

            img {
                width: 100%;
                height: 100%;
            }
        }

        .take-picture-outline {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 3px solid #fff;
            
            display: flex;
            justify-content: center;
            align-items: center;
            .take-picture {
                background-color: #fff;
                width: 40px;
                height: 40px;
                box-sizing: content-box;
                border-radius: 50%;
            }
        }
        
        .switchcamera {
            width: 40px;
            height: 40px;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}
</style>