<template>
    <div class="unsplash-app-wrap">
        <div class="current-page">
            <transition name="leftfade" mode="out-in">
                <keep-alive>
                    <!-- <component :is="currentComponent"></component> -->
                    <router-view></router-view>
                </keep-alive>
            </transition>
            
        </div>
        
        <!-- 底部切换栏 开始-->
        <div class="bottom-bar">
            <div :class="currentSelection === 'welcome' ? 'bottom-item selected' : 'bottom-item'" @click="switchPage('welcome')">
                首页
            </div>
            <div :class="currentSelection === 'search' ? 'bottom-item selected' : 'bottom-item'" @click="switchPage('search')">
                搜索
            </div>
            <div :class="currentSelection === 'collections' ? 'bottom-item selected' : 'bottom-item'" @click="switchPage('collections')">
                专辑
            </div>
        </div>
        <!-- 底部切换栏 结束 -->
    </div>
</template>

<script>
// import UnsplashWelcome from '@/components/UnsplashWelcome';
// import UnsplashSearch from '@/components/UnsplashSearch';
// import UnsplashCollections from '@/components/UnsplashCollections';
// import UnsplashTest from '@/components/UnsplashTest';
import {mapGetters} from 'vuex';

export default {
    mounted() {
        
    },
    data() {
        return {
            //组件的id
            componentNames: [
                'colletions',
                'welcome',
                'search',
            ],
            //当前选择
            currentSelection: 'welcome'
        }
    },
    methods: {
        /**
         * @func
         * @desc 切换当前页面
         * @param {string} pageid 要切换到的page的id
         */
        switchPage(pageid) {
            let pagestack = this.pageStack;
            let currentPage = pagestack.pop();
            if (currentPage.includes(pageid)) {
                return;
            }
            else {
                this.currentSelection = pageid;
                this.$router.push(`/phone/unsapp/${pageid}`);
            }
        }
    },
    computed: {
        //map getters
        ...mapGetters([
            'pageStack'
        ]),
    }
}
</script>

<style lang="scss" scoped>
.unsplash-app-wrap {
    width: 100%;
    height: 100%;
    background-color: #fff;
    color: black;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .current-page {
        width: 100%;
        height: 90%;

        //过渡动画
        .leftfade-enter-active, .leftfade-leave-active {
            transition: all .2s;
        }
        .leftfade-leave-to {
            transform: translateX(-10px);
            opacity: 0;
        }
        .leftfade-enter {
            transform: translateX(10px);
            opacity: 0;
        }
    }

    .bottom-bar {
        width: 100%;
        height: 10%;
        border-top: #eee solid 3px;

        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-wrap: nowrap;

        .bottom-item {
            margin: 2px;
            border: 1px solid #eee;
            border-radius: 3px;
            width: 40px;
            background-color: rgb(38, 169, 245);
            opacity: .5;
            transition: all .2s;
        }
        .bottom-item:hover {
            opacity: 1;
        }
        .selected {
            opacity: 1;
        }
    }
}
</style>