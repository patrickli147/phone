<template>
    <div class="photo-wrap">
        <div class="picture-wrap">
            <div class="main-img" v-show="currentUrl">
                <img :src="currentUrl" alt="">
            </div>

            <div class="loading" v-show="!currentUrl">
                <div class="loading-item"></div>
                <div class="loading-item"></div>
                <div class="loading-item"></div>
                <div class="loading-item"></div>
                <div class="loading-item"></div>
            </div>
        </div>
        
        <div class="slider last" @click="handleSlideEvent('last')">
            <img src="../assets/left.png" alt="">
        </div>
        <div class="slider next" @click="handleSlideEvent('next')">
            <img src="../assets/left.png" alt="">
        </div>
        <div class="backicon" @click="handleBackiconClicked">
            <img src="../assets/left.png" alt="">
        </div>

        <!-- 用户信息 开始 -->
        <div class="userinfo" v-show="currentUser">
            <div class="profile-img">
                <img :src="currentUserImg" alt="">
            </div>
            <div class="username">
                <div class="nameitem">
                    {{currentUser.name}}
                </div>
                <div class="nameitem">
                    @{{currentUser.username}}
                </div>
            </div>
        </div>
        <!-- 用户信息 结束 -->

    </div>
</template>

<script>
import imgGetter from '../utils/imgGetter';
import {mapGetters} from 'vuex';

export default {
    mounted() {
        //this.getImgUrls();
        //this.getCurrentUserImg();
    },
    data() {
        return {
            //图片数据
            dataOfPhotos: [],
            //当前index
            currentIndex: 0,
            //图片的urls
            urlsOfPhotos: [],
            //当前用户头像
            currentUserImg: ''
        }
    },
    methods: {
        /**
         * @func
         * @desc 利用url请求图片
         * @param {string} url 要请求的img的url
         * @param {object} ctx this
         * @returns {string} 返回供img标签使用的url（base64）
         */
        getImgsWithUrl: imgGetter,
        /**
         * @func
         * @desc 获取图片的base64 url
         */
        getImgUrls() {
            for (let i = 0; i < this.dataOfPhotos.length; i ++) {
                let url = this.dataOfPhotos[i].urls.regular;

                this.getImgsWithUrl(url, this)
                    .then(res => {
                        this.urlsOfPhotos[i] = res;

                        //触发响应
                        this.urlsOfPhotos = [...this.urlsOfPhotos];
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        },
        /**
         * @func
         * @desc 处理翻页
         * @param {string} direction 方向
         */
        handleSlideEvent(direction) {
            if (direction === 'last') {
                if (this.currentIndex > 0) {
                    this.currentIndex --;
                }
            }
            else {
                if (this.currentIndex < this.urlsOfPhotos.length - 1) {
                    this.currentIndex ++;
                }
            }
        },
        /**
         * @func
         * @desc 处理返回
         */
        handleBackiconClicked() {
            let pageStack = this.pageStack;
            pageStack.pop();
            this.$router.push(pageStack.pop());
        },
        /**
         * @func
         * @desc 获取当前用户头像
         */
        getCurrentUserImg() {
            this.getImgsWithUrl(this.currentUser.profile_image.small, this)
                .then(res => {
                    this.currentUserImg = res;
                })
                .catch(err => {
                    console.log(err);
                })
        }
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            // 通过 `vm` 访问组件实例
            let data = vm.$route.params.data;
            let index = vm.$route.params.index;
            let urls = vm.$route.params.urls;

            if (data.length > 0) {
                vm.dataOfPhotos = [...data];
                vm.currentIndex = index;
                vm.urlsOfPhotos = urls;
            }
        });
    },
    computed: {
        //当前图片url
        currentUrl() {
            return this.urlsOfPhotos[this.currentIndex];
        },
        //当前用户信息
        currentUser() {
            if (this.dataOfPhotos.length > 0) {
                return this.dataOfPhotos[this.currentIndex].user;
            }
            else {
                return false;
            }
        },
        //map getters
        ...mapGetters([
            'pageStack'
        ]),
    },
    watch: {
        currentIndex() {
            //切换用户头像
            this.currentUserImg = '';
            this.getCurrentUserImg();
        }
    }
}
</script>

<style lang='scss' scoped>
.photo-wrap {
    width: 100%;
    height: 100%;
    position: relative;

    .picture-wrap {
        width: 100%;
        height: 100%;
        
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        .main-img {
            width: 100%;
            
            img {
                width: 100%;
                max-height: 300px;
            }
        }

        .loading {
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;

            .loading-item {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #000;
                margin: 2px;
            }
            :nth-child(1) {
                animation: ripple 1s  infinite;
            }
            :nth-child(2) {
                animation: ripple 1s .1s infinite;
            }
            :nth-child(3) {
                animation: ripple 1s .2s infinite;
            }
            :nth-child(4) {
                animation: ripple 1s .3s infinite;
            }
            :nth-child(5) {
                animation: ripple 1s .4s infinite;
            }
        }
    }

    .slider {
        position: absolute;
        top: 50%;
        background-color: rgb(228, 224, 224);
        border-radius: 50%;
        padding: 5px;
        opacity: .5;
        transition: all .2s;

        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 20px;
            height: 20px;
        }
    }
    .slider:hover {
        opacity: 1;
    }

    .last {
        left: 5px;
    }

    .next {
        right: 5px;

        img {
            transform: rotate(180deg);
        }
    }

    .backicon {
        position: absolute;
        left: 15px;
        top: 15px;

        img {
            width: 20px;
            height: 20px;
        }
    }

    .userinfo {
        position: absolute;
        top: 5px;
        left: 50px;
        width: 100%;
        
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;

        .profile-img {
            width: 20%;
            flex: 0 0 1;
            text-align: left;
            img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
        }

        .username {
            width: 80%;
            text-align: left;
            flex: 0 0 1;

            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            .nameitem {
                width: 100%;
                padding-left: 10px;
            }

            :nth-child(2) {
                opacity: .5;
            }
        }
    }
}

//涟漪动画
@keyframes ripple {
    0% {
        transform: scale(1.3);
        background:red;
    }
    100% {
        background:rgb(5, 182, 252);
    }
}

</style>