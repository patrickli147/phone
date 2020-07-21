<template>
    <div class="collection-wrap">
        <!-- 返回 开始 -->
        <div class="backicon" @click="handleBackiconClicked">
            x
        </div>
        <!-- 返回 结束 -->

        <!-- 专辑详情 开始 -->
        <div class="collection-desc" v-if="urlsOfPhotos.length > 0">
            <div class="title">
                {{collectionData.title}}
            </div>
            <div class="info">
                {{collectionData.total_photos}} photos · Curated by <span class="userlink" @click="routeToUser">{{collectionData.user.username}}</span>
            </div>
            <div class="tags">
                <div 
                    class="tag"
                    v-for="tagcount in 3"
                    :key="tagcount"
                    @click="handleTagClicked(collectionData.tags[tagcount - 1].title)"
                >
                    {{collectionData.tags[tagcount - 1].title}}
                </div>
            </div>
            
        </div>
        <!-- 专辑详情 结束 -->

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
            //专辑数据
            collectionData: null,
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
        getCollectionPhotos() {
            this.isLoading = true;

            this.axios({
                method:'get',
                url: this.collectionData.links.photos,
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

            let total = this.collectionData.total_photos
            let current = 18 * this.photosParams.page;

            if (current < total) {
                this.photosParams.page ++;
                this.getCollectionPhotos();
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
        /**
         * @func
         * @desc 路由到用户详情
         */
        routeToUser() {
            this.$router.push({
                name: 'UnsplashUser',
                params: {
                    data: this.collectionData.user,
                }
            })
        },
        //map mutations
        ...mapMutations({
            updatePageStack: 'UPDATE_PAGESTACK'
        })
    },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            //清除数据
            vm.photosData = [];
            vm.urlsOfPhotos = [];
            vm.isAllDataLoaded = false;

            // 通过 `vm` 访问组件实例
            let data = vm.$route.params.data;

            if (data) {
                vm.collectionData = data;
            }

            vm.getCollectionPhotos();
        });
    },
    computed: {
        //map getters
        ...mapGetters([
            'pageStack'
        ]),
    },
    components: {
        Pagination
    }
}
</script>

<style lang='scss' scoped>
.collection-wrap {
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

    .collection-desc {
        width: 100%;
        text-align: left;
        padding: 5px 10px;
        border-bottom: 1px solid #eee;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        .title {
            width: 100%;
            font-weight: 600;
        }
        .info {
            width: 100%;
            opacity: .8;

            .userlink {
                opacity: .4;
            }
            .userlink:hover {
                opacity: .8;
                text-decoration: underline;
            }
        }
        .tags {
            width: 100%;

            display: flex;
            justify-content: flex-start;
            align-items: center;
            
            .tag {
                background-color: #eee;
                opacity: .8;
                transition: all .2s;
                margin: 0 10px;
                padding: 3px 10px;
                border-radius: 5px;
            }
            .tag:hover {
                opacity: 1;
            }

            :first-child {
                //第一个元素只需要右边距
                margin-left: 0;
                margin-right: 10px;
            }
        }
    }

    .pagination-container {
        width: 100%;
        height: 80%;

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