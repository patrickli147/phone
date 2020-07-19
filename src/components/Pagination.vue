<template>
    <div class="pagination-outer-wrap">
        <div 
            class="pagination-wrap"
            @scroll="handleWelcomePhotosScroll($event)"
            ref="scroller"
        >
            <slot></slot>

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

            <!-- 返回顶部 开始 -->
            <div class="scroll-btn back-to-top" v-show="isBackToTopShown" @click="backToTop('scroller')">
                <img src="../assets/down.png" alt="" title="返回顶部">

                <!-- todo 拖动 -->
            </div>
            <!-- 返回顶部 结束 -->

            <!-- 返回上次浏览位置 开始 -->
            <div class="scroll-btn" v-show="!isBackToTopShown" @click="scrollTo('scroller', lastScrollTop)">
                <img src="../assets/down.png" alt="" title="返回上次浏览位置">
            </div>
            <!-- 返回上次浏览位置 结束 -->
        </div>
    </div>
    
</template>

<script>
import _throttle from '../utils/throttle'

export default {
    props: {
        isLoading: Boolean,
        isAllDataLoaded: Boolean
    },
    data() {
        return {
            //true:显示back-to-top
            isBackToTopShown: false,
            //上次浏览位置
            lastScrollTop: 0,
            //
            isLoading2: this.isLoading
        }
    },
    methods: {
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
                if (this.isAllDataLoaded) {
                    //加载完所有数据
                    return;
                }
                else {
                    //翻页
                    this.$emit('nextpage');
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

<style lang='scss' scoped>
.pagination-outer-wrap {
    width: 100%;
    height: 100%;
    //绝对定位的参照
    position: relative;
}

.pagination-wrap {
    width: 100%;
    height: 100%;
    overflow: scroll;

    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;

    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
    -ms-overflow-style:none;
    /*火狐下隐藏滚动条*/
    scrollbar-width: none;

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
//Chrome隐藏滚动条
.pagination-wrap::-webkit-scrollbar {
    display: none;
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