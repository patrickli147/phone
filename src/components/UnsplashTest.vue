<template>
    <div class="uns-welcome-wrap">

        <!-- 顶部搜索栏 开始 -->
        <div class="welcome-top-wrap">
            <transition name="fade">
                <h1 v-if="!isInputFocused">welcome</h1>
            </transition>
            

            <div :class="!isInputFocused ? 'search-wrap' : 'search-wrap zoom-animation'">
                <div class="search-input">
                    <input 
                        @keyup="handleInputKeyup($event)"
                        @focus="toggleInputFocused" 
                        @blur="toggleInputFocused"
                        type="text" 
                        placeholder="搜索图片（推荐英文）" 
                        v-model="searchInput"
                    >
                </div>
                <div class="search-icon" @click="searchPhotos">
                    搜索
                </div>
            </div>

        </div>
        <!-- 顶部搜索栏 结束 -->

        <!-- 首页分页 开始 -->
        <div class="pagination-container">
            <pagination
                :isLoading="isLoading"
                :isAllDataLoaded="isAllDataLoaded"
                @nextpage="handleNextPageEvent"
            >
                <div class="welcome-photos">
                    <div class="photos-item"
                        v-for="(item, index) in dataOfListPhotos"
                        :key="item.id + index"
                    >
                        <img :ref="item.id + index" :title="item['alt_description']" :src="getImgsWithUrls(item.urls.small, item.id + index)" alt="">
                    </div>
                </div>
                
            </pagination>
        </div>
        <!-- 首页分页 结束 -->
    </div>
</template>

<script>
import Mock from 'mockjs';
//import _throttle from '../utils/throttle';
import Pagination from '@/components/Pagination'

export default {
    mounted() {
        console.log("mounted")
        this.listPhotos();
    },
    data() {
        return {
            //list photos 的url参数
            listPhotosParams: {
                'page': 1,            //Page number to retrive
                'per_page': 18,       // Number of items per page.
                'order_by': 'latest', // How to sort the photos. (latest, oldest, popular)
                'client_id': 'GT_Bfahw73NpMk9NHvcCMqBIyZIpxdhY4qMbCV3TgPM'
            },
            //list photos 返回的data
            dataOfListPhotos: null,
            //是否在加载中
            isLoading: true,
            //是否加载完数据
            isAllDataLoaded: false,
            //搜索框输入
            searchInput: '',
            //true: input is focused
            isInputFocused: false
        }
    },
    methods: {
        /**
         * @func
         * @desc 调用list photos api 获取数据
         */
        listPhotos() {
            //显示loading动画
            this.isLoading = true;

            //请求数据
            this.axios({
                method:'get',
                url: 'https://api.unsplash.com/photos/',
                params: this.listPhotosParams,
            }).then(res => {
                this.isLoading = false;

                if (res.data) {
                    if (!this.dataOfListPhotos) {
                        //初始为null
                        this.dataOfListPhotos = res.data;
                    }
                    else {
                        //延展数组
                        this.dataOfListPhotos = [...this.dataOfListPhotos, ...res.data];
                    }
                }
            }).catch(err => {
                this.isLoading = false;
                console.log(err);
            })
        },
        /**
         * @func
         * @desc 利用url请求图片
         * @param {string} url 要请求的img的url
         * @param {string} id 图片的唯一id（作为ref的值）
         * @returns {string} 返回供img标签使用的url（base64）
         */
        async getImgsWithUrls(url, id) {
            let res = null;
            try {
                res = await this.axios.get(url, {
                    responseType: 'arraybuffer'
                });
            } catch(err) {
                console.log(err);
            }
            
            if (!res) {
                //请求失败，用mock代替
                let mockUrl = Mock.Random.dataImage();
                this.$refs[id].src = mockUrl;
                if (Array.isArray(this.$refs[id])) {
                    //在v-for中,refInFor设置为true，返回一个数组
                   this.$refs[id][0].src = mockUrl;
                }
                else {
                    //不是数组
                    this.$refs[id].src = mockUrl;
                }
            }
            else {
                let resData = res.data;
                let resFormat = res.headers['content-type'];

                //转为base64
                let base64Url = await new Buffer(resData, 'binary').toString('base64');

                if (Array.isArray(this.$refs[id])) {
                    //在v-for中,refInFor设置为true，返回一个数组
                    this.$refs[id][0].src = 'data:' + resFormat + ';base64,' + base64Url;
                }
                else {
                    //不是数组
                    this.$refs[id].src = 'data:' + resFormat + ';base64,' + base64Url;
                }
            }
        },
        /**
         * @func
         * @desc 处理input的keyup事件
         * @param {object} e keyup事件
         */
        handleInputKeyup(e) {
            let key = e.key;
            
            if (key === "Enter" && this.searchInput.length > 0) {
                //按下回车且搜索内容不为空时搜索
                this.searchPhotos();
            }
        },
        /**
         * @func
         * @desc 搜索
         */
        searchPhotos() {

        },
        /**
         * @func
         * @desc 翻转isInputFocused
         */
        toggleInputFocused() {
            this.isInputFocused = !this.isInputFocused;
        },
        /**
         * @func
         * @desc 处理翻页事件
         */
        handleNextPageEvent() {
            if (this.listPhotosParams.page >= 20) {
                //数据加载完毕
                this.isAllDataLoaded = true;
                return;
            }
            else {
                //翻页
                this.listPhotosParams.page ++;
                this.listPhotos();
            }
        }
    },
    components: {
        Pagination
    }
}
</script>

<style lang="scss" scoped>

.uns-welcome-wrap {
    width: 100%;
    height: 100%;
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    //顶部搜索栏
    .welcome-top-wrap {
        width: 100%;
        height: 20%;
        background-color: rgb(190, 183, 233);

        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        h1 {
            width: 100%
        }
        //h1的 过渡动画
        .fade-enter-active, .fade-leave-active {
            transition: all .4s;
        }
        .fade-enter, .fade-leave-to {
            opacity: 0;
        }

        .search-wrap {
            width: 100%;

            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: nowrap;
            font-size: 15px;
            padding: 0 5px;

            .search-icon {
                width: 20%;
                text-align: center;
                background-color: rgb(50, 177, 250);
                padding: 6px;
                border-top-right-radius: 3px;
                border-bottom-right-radius: 3px;
            }

            .search-input {
                width: 80%;
                text-align: right;
                input {
                    width: 90%;
                    outline-style: none;
                    border: 1px solid #ccc;
                    padding: 5px;
                    border-top-left-radius: 3px;
                    border-bottom-left-radius: 3px;
                }
                input:hover {
                    border-color: #66afe9;
                }
            }
        }
        //zoom 动画
        .zoom-animation {
            animation: zoom 1s;
        }
    }

    //首页分页
    .pagination-container {
        width: 100%;
        height: 80%;

        .welcome-photos {
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

//旋转动画
@keyframes rotating {
    0% {
        transform: rotate(0);
    }
    12% {
        transform: rotate(45deg);
    }
    25% {
        transform: rotate(90deg);
    }
    37% {
        transform: rotate(135deg);
    }
    50% {
        transform: rotate(180deg);
    }
    62% {
        transform: rotate(225deg);
    }
    75% {
        transform: rotate(270deg);
    }
    87% {
        transform: rotate(315deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

//缩放动画
@keyframes zoom {
    0% {
        transform: scale(1);
    }
    20% {
        transform: scale(1.1);
    }
    40% {
        transform: scale(1);
    }
    60% {
        transform: scale(0.8);
    }
    80% {
        transform: scale(1);
    }
    100% {
        transform: none;
    }
}
</style>
