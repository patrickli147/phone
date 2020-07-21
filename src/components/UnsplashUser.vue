<template>
    <div class="user-wrap">
        <!-- 返回 开始 -->
        <div class="backicon" @click="handleBackiconClicked">
            x
        </div>
        <!-- 返回 结束 -->

        <!-- 用户信息 开始 -->
        <div class="userinfo" v-if="isUserLoaded">
            <div class="profile-img">
                <img :src="userImgUrl" alt="">
            </div>
            <div class="username">
                <div class="nameitem">
                    {{userData.first_name}} {{userData.last_name}}
                </div>
                <div class="nameitem">
                    @{{userData.username}}
                </div>
            </div>
        </div>
        <!-- 用户信息 结束 -->

        <!-- 照片分页 开始 -->
        <div class="pagination-container">
            <pagination
                :isLoading="isLoading"
                :isAllDataLoaded="isAllDataLoaded"
                @nextpage="handleNextPageEvent"
            >
                <div class="photos">
                    <div class="photos-item"
                        v-for="(item, index) in urlsOfPhotos"
                        :key="index"
                        @click="routeToPhoto(index)"
                    >
                        <img :title="photosData[index]['alt_description']" :src="item" alt="">
                    </div>
                </div>
                
            </pagination>
        </div>
        <!-- 照片分页 结束 -->

    </div>
</template>

<script>
import imgGetter from '../utils/imgGetter';
import {mapGetters, mapMutations} from 'vuex';
import Pagination from '@/components/Pagination';

export default {
    mounted() {
        //this.getCollectionPhotos();
    },
    data() {
        return {
            //用户头像
            userImgUrl: '',
            //专辑数据
            userData: null,
            //照片数据
            photosData: [],
            //照片urls
            urlsOfPhotos: [],
            //list photos 的url参数
            photosParams: {
                'page': 1,            //Page number to retrive
                'per_page': 18,       // Number of items per page.
                'client_id': 'GT_Bfahw73NpMk9NHvcCMqBIyZIpxdhY4qMbCV3TgPM'
            },
            //true: 加载中
            isLoading: false,
            //true: 数据加载完毕
            isAllDataLoaded: false
        }
    },
    methods: {
        /**
         * @func
         * @desc 获取专辑照片数据
         */
        getUserPhotos() {
            this.isLoading = true;

            this.axios({
                method:'get',
                url: this.userData.links.photos,
                params: this.photosParams
            }).then(res => {

                if (res.data) {
                    this.photosData = [...this.photosData, ...res.data];

                    this.isLoading = false;

                    for (let i = 0; i < res.data.length; i ++) {
                        this.getImgsWithUrl(res.data[i].urls.small, this)
                            .then(res => {
                                this.urlsOfPhotos = [...this.urlsOfPhotos, res];
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                }
            }).catch(err => {
                console.log(err);
            });
        },
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
         * @desc 获取专辑照片数据
         */
        handleNextPageEvent() {
            if (this.isAllDataLoaded) {
                return;
            }

            let total = this.userData.total_photos
            let current = 18 * this.photosParams.page;

            if (current < total) {
                this.photosParams.page ++;
                this.getUserPhotos();
            }
            else {
                this.isAllDataLoaded = true;
                return;
            }
        },
        /**
         * @func
         * @desc 处理翻页事件
         * @param {number} index 当前图片的index
         */
        routeToPhoto(index) {
            this.$router.push({
                name: 'UnsplashPhoto',
                params: {
                    data: this.photosData,
                    index,
                    urls: this.urlsOfPhotos
                }
            });
        },
        /**
         * @func
         * @desc 处理tag的点击事件
         * @param {string} tag 点击的tag
         */
        handleTagClicked(tag) {
            this.$router.push({
                path: '/phone/unsapp/search',
                query: {
                    searchInput: tag,
                    classificationIndex: 1
                }
            });
        },
        /**
         * @func
         * @desc 处理返回
         */
        handleBackiconClicked() {
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
        //map mutations
        ...mapMutations({
            updatePageStack: 'UPDATE_PAGESTACK'
        })
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            //清除数据
            vm.userImgUrl = '';
            vm.photosData = [];
            vm.urlsOfPhotos = [];
            vm.isAllDataLoaded = false;

            // 通过 `vm` 访问组件实例
            let data = vm.$route.params.data;
            let userImg = vm.$route.params.userImg;

            if (data) {
                vm.userData = data; 
                if (userImg) {
                    vm.userImgUrl = userImg;
                }
                else {
                    var that = vm;
                    vm.getImgsWithUrl(data.profile_image.large, vm)
                        .then(res => {
                            that.userImgUrl = res;
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            }

            vm.getUserPhotos();
        });
    },
    computed: {
        //map getters
        ...mapGetters([
            'pageStack'
        ]),
        //isUserLoaded
        isUserLoaded() {
            if (this.userData) {
                return true;
            }
            else {
                return false;
            }
        }
    },
    components: {
        Pagination
    }
}
</script>

<style lang='scss' scoped>
.user-wrap {
    width: 100%;
    height: 100%;
    position: relative;

    .backicon {
        position: absolute;
        right: 5px;
        top: 5px;
        background-color: #eee;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        opacity: .8;
        transition: all .2s;

        display: flex;
        justify-content: center;
        align-items: center;
    }
    .backicon:hover {
        opacity: 1;
        background: red;
    }

    .userinfo {
        width: 100%;
        border-bottom: 2px solid #eee;
        
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;

        .profile-img {
            width: 60px;
            height: 60px;
            flex: 0 0 1;
            text-align: left;
            border: 1px solid #eee;
            border-radius: 50%;
            img {
                width: 60px;
                height: 60px;
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

    .pagination-container {
        width: 100%;
        height: 85%;

        .photos {
            // width: 100%;
            // height: 100%;

            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: wrap;

            .photos-item {
                width: 33.33%;
                height: 100px;
                background-color: rgba(221, 182, 182, 0.904);
                border: 1px solid #eee;

                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .photos-item:hover {
                box-shadow: .5px .5px .5px rgba(5, 5, 5, 0.623);
            }
        }
    }
}

</style>