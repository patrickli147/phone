<template>
    <div class="unsplash-app-wrap">
        <keep-alive>
            <div class="current-page">
                <component :is="currentComponent"></component>
            </div>
        </keep-alive>
        
        <!-- 底部切换栏 开始-->
        <div class="bottom-bar">
            <div class="welcome" @click="switchPage('welcome')">
                首页
            </div>
            <div class="search" @click="switchPage('welcome')">
                搜索
            </div>
            <div class="collections" @click="switchPage('welcome')">
                专辑
            </div>
        </div>
        <!-- 底部切换栏 结束 -->
    </div>
</template>

<script>
import UnsplashWelcome from '@/components/UnsplashWelcome';
import UnsplashSearch from '@/components/UnsplashSearch';
import UnsplashCollections from '@/components/UnsplashCollections';


export default {
    mounted() {
        
    },
    data() {
        return {
            //组件的id
            componentNames: {
                'colletions':'unsplash-collections',
                'welcome':'unsplash-welcome',
                'search':'unsplash-search'
            },
            //当前的组件
            currentComponent: 'unsplash-welcome'
        }
    },
    methods: {
        /**
         * @func
         * @desc 切换当前页面
         * @param {string} pageid 要切换到的page的id
         */
        switchPage(pageid) {
            this.currentComponent = this.componentNames[pageid];
        }
    },
    components: {
        UnsplashCollections,
        UnsplashSearch,
        UnsplashWelcome
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
    }

    .bottom-bar {
        width: 100%;
        height: 10%;
        border-top: #eee solid 3px;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
    }
}
</style>