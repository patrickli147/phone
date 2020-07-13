<template>
    <div class="uns-welcome-wrap">

        <!-- 顶部搜索栏 开始 -->
        <div class="welcome-top-wrap">
            <h1>welcome</h1>

            <div class="search-wrap">
                <div class="search-icon">
                    <img src="../assets/search.png" alt="">
                </div>
                <div class="search-input">
                    <input type="text" placeholder="搜索图片（推荐英文）">
                </div>
            </div>

        </div>
        <!-- 顶部搜索栏 结束 -->

        <!-- 首页分页 开始 -->
        <div
            class="welcome-photos"
            @scroll="handleWelcomePhotosScroll($event)"
            ref="welcomePhotos"
        >
            <div class="photos-item"
                v-for="(item, index) in dataOfListPhotos"
                :key="item.id + index"
            >
                <img :ref="item.id + index" :title="item['alt_description']" :src="getImgsWithUrls(item.urls.small, item.id + index)" alt="">
            </div>

            <!-- 加载中 开始 -->
            <div class="loading" v-show="isLoading">
                <div class="loading-item"></div>
                <div class="loading-item"></div>
                <div class="loading-item"></div>
                <div class="loading-item"></div>
                <div class="loading-item"></div>
            </div>
            <!-- 加载中 结束 -->

            <!-- 到底信息 开始 -->
            <div class="bottom-info" v-if="isAllDataLoaded">
                我也是有底线的……
            </div>
            <!-- 到底信息 结束 -->

        </div>
        <!-- 首页分页 结束 -->

        <!-- 返回顶部 开始 -->
        <div class="scroll-btn back-to-top" v-show="isBackToTopShown" @click="backToTop('welcomePhotos')">
            <img src="../assets/down.png" alt="" title="返回顶部">

            <!-- todo 拖动 -->
        </div>
        <!-- 返回顶部 结束 -->

        <!-- 返回上次浏览位置 开始 -->
        <div class="scroll-btn" v-show="!isBackToTopShown" @click="scrollTo('welcomePhotos', lastScrollTop)">
            <img src="../assets/down.png" alt="" title="返回上次浏览位置">
        </div>
        <!-- 返回上次浏览位置 结束 -->


    </div>
</template>

<script>
import Mock from 'mockjs';
import _throttle from '../utils/throttle'

export default {
    mounted() {
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
            //true:显示back-to-top
            isBackToTopShown: false,
            //上次浏览位置
            lastScrollTop: 0,
            //是否在加载中
            isLoading: true,
            //是否加载完数据
            isAllDataLoaded: false
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

                console.log(res);
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
            let res = await this.axios.get(url, {
                responseType: 'arraybuffer'
            });

            if (!res.data) {
                //请求失败，用mock代替
                let mockUrl = Mock.Random.image();
                this.$refs[id].src = mockUrl;
                if (Array.isArray(this.$refs[id])) {
                    //在v-for中,refInFor设置为true，返回一个数组
                   this.$refs[id].src = mockUrl;
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
         * @desc 利用url请求图片
         * @param {object} e 滑动事件
         */
        handleWelcomePhotosScroll: _throttle(function(e) {
            let target = e.target;
            let sh = target.scrollHeight;
            let st = target.scrollTop;
            let ch = target.clientHeight;

            if (st > 5) {
                //滑动大于5px时，显示back-to-top
                if (!this.isBackToTopShown) {
                    this.isBackToTopShown = true;
                }
            }
            else {
                if (this.isBackToTopShown) {
                    this.isBackToTopShown = false;
                }
            }

            if (sh - (st + ch) < 10) {
                //距离底部10px以内
                //分页
                if (this.listPhotosParams.page >= 20) {
                    //加载完所有数据
                    this.isAllDataLoaded = true;
                    return;
                }
                else {
                    //翻页

                    this.listPhotosParams.page ++;
                    this.listPhotos();
                }
                
            }
        }, 500),
        /**
         * @func
         * @desc 滑回顶部
         * @param {string} ref 滑动元素的ref值
         */
        async backToTop(ref) {
            let toScroll = this.$refs[ref];

            if (!toScroll) {
                console.log("ref is not provided or invalid");
                return;
            }

            //scroll动画
            let st = toScroll.scrollTop;
            this.lastScrollTop = st;

            if (st > 300) {
                //处理scrollTop大于300的情况：300以内才应用动画
                toScroll.scrollTop = 300;
                st = 300;
            }

            let step = st / 10;
            for (let i = 0; i < 9; i ++) {
                toScroll.scrollTop -= step;

                //延时
                await new Promise(resolve => {
                    setTimeout(resolve, 1);
                })
            }
            toScroll.scrollTop = 0;
        },
        /**
         * @func
         * @desc 滑动到指定位置
         * @param {string} ref 滑动元素的ref值
         * @param {number} scrollToHeight 要滑动到的scrollHeight
         */
        async scrollTo(ref, scrollToHeight) {
            let toScroll = this.$refs[ref];

            if (!toScroll) {
                console.log("ref is not provided or invalid");
                return;
            }

            let step;
            if (scrollToHeight > 100) {
                //处理scrollTop大于300的情况：300以内才应用动画
                toScroll.scrollTop = scrollToHeight - 100;
                step = 10;
            }
            else {
                step = scrollToHeight / 10;
            }

            //scroll动画
            for (let i = 0; i < 9; i ++) {
                toScroll.scrollTop += step;

                //延时
                await new Promise(resolve => {
                    setTimeout(resolve, 10);
                })
            }
            toScroll.scrollTop = scrollToHeight;
        },

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
        background-color: rgb(68, 46, 194);

        h1 {

        }

        .search-wrap {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: nowrap;

            .search-icon {
                img {
                    height: 15px;
                    width: 15px;
                }
            }

            .search-input {
                input {

                }
            }
        }
    }

    //首页分页
    .welcome-photos {
        width: 100%;
        height: 80%;
        overflow: scroll;

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

        .bottom-info {
            width: 100%;
            background-color: rgba(175, 170, 170, 0.589);
        }
    }
    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
    -ms-overflow-style:none;
    /*火狐下隐藏滚动条*/
    scrollbar-width: none;
    //Chrome隐藏滚动条
    .welcome-photos::-webkit-scrollbar {
        display: none;
    }

    //返回顶部
    .scroll-btn {
        position: absolute;
        bottom: 10px;
        right: 10px;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        background-color: rgba(231, 226, 226, 0.801);
        opacity: .7;

        display: flex;
        justify-content: center;
        align-items: center;

        img {
            width: 20px;
            height: 20px;
        }
    }
    .scroll-btn:hover {
        background-color: rgb(231, 226, 226);
        opacity: 1;
    }
    .back-to-top {
        //使用的down图片，旋转180度
        transform: rotateZ(180deg);
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
