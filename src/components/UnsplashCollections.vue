<template>
    <div class="uns-collections-wrap">
        <pagination
                :isLoading="isCollectionsLoading"
                :isAllDataLoaded="isCollectionsAllDataLoaded"
                @nextpage="handleNextPageEvent"
            >
                <div class="collections" v-show="collectionsUrls.length > 0">
                    <div class="collections-item"
                        v-for="(item, index) in collectionsUrls"
                        :key="index"
                        @click="routeToCollection(index)"
                    >
                        <!-- preview photos -->
                        <div class="preview-photos">
                            <div class="main-photo">
                                <img :src="item[0]" alt="">
                            </div>
                            <div class="other">
                                <img :src="item[1]" alt="">
                                <img :src="item[2]" alt="">
                                <img :src="item[3]" alt="">
                            </div>
                        </div>
                        <!-- preview photos end -->

                        <div class="collection-desc">
                            <div class="title">
                                {{collectionsData[index].title}}
                            </div>
                            <div class="info">
                                {{collectionsData[index].total_photos}} photos · Curated by {{collectionsData[index].user.username}}
                            </div>
                            <div class="tags">
                                <div 
                                    class="tag"
                                    v-for="tagcount in 3"
                                    :key="tagcount"
                                    @click="handleTagClicked(collectionsData[index].tags[tagcount - 1].title)"
                                >
                                    {{collectionsData[index].tags[tagcount - 1].title}}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </pagination>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import Mock from 'mockjs';

export default {
    mounted() {
        this.listCollections();
    },
    data() {
        return {
            //true: 加载中
            isCollectionsLoading: false,
            //true: 数据加载完毕
            isCollectionsAllDataLoaded: false,
            //listCollections params
            listCollectionsParams: {
                'page': 1,            //Page number to retrive
                'per_page': 18,       // Number of items per page.
                'client_id': 'GT_Bfahw73NpMk9NHvcCMqBIyZIpxdhY4qMbCV3TgPM'
            },
            //collections返回的data
            collectionsData: [],
            //collections需要的urls
            collectionsUrls: [],
        }
    },
    methods: {
        /**
         * @func
         * @desc 处理nextpage事件
         */
        handleNextPageEvent() {
            if (this.searchCollectionsParams.page < 30) {
                this.searchCollectionsParams.page ++;

                this.searchCollections();
            }
            else {
                this.isCollectionsAllDataLoaded = true;
            }

        },
        /**
         * @func
         * @desc 利用url请求图片
         * @param {string} url 要请求的img的url
         * @returns {string} 返回供img标签使用的url（base64）
         */
        async getImgsWithUrl(url) {
            let res = null;
            try {
                res = await this.axios.get(url, {
                    responseType: 'arraybuffer'
                });
            } catch(err) {
                console.log(err);
                //请求失败，用mock代替
                let mockUrl = Mock.Random.dataImage();
                return Promise.resolve(mockUrl);
            }
            
            if (!res) {
                //请求失败，用mock代替
                let mockUrl = Mock.Random.dataImage();
                return Promise.resolve(mockUrl);
            }
            else {
                let resData = res.data;
                let resFormat = res.headers['content-type'];

                //转为base64
                let base64Url = await new Buffer(resData, 'binary').toString('base64');

                return Promise.resolve('data:' + resFormat + ';base64,' + base64Url);
            }
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
         * @desc 搜索专辑
         */
        listCollections() {
            //显示加载中
            this.isCollectionsLoading = true;

            this.axios({
                method:'get',
                url: 'https://api.unsplash.com/collections',
                params: this.listCollectionsParams
            }).then(res => {
                console.log(res);

                let data = res && res.data;
                if (data) {
                    this.collectionsData = [...this.collectionsData, ...data];

                    for (let i = 0; i < data.length; i ++) {
                        //获取4张previewphotos的base64 url
                        let previewPhotos = data[i].preview_photos;
                        let previewPhotosUrls = [];
                        let promises = [];

                        for (let j = 0; j < 4; j ++) {
                            promises[j] = new Promise(resolve => {
                                //一定会resolve
                                this.getImgsWithUrl(previewPhotos[j].urls.small)
                                    .then(res => {
                                        resolve(res);
                                    }).catch (err => {
                                        console.log(err);
                                    });
                            });
                        }

                        Promise.allSettled(promises)
                            .then(res1 => {
                                //隐藏加载中
                                this.isCollectionsLoading = false;

                                //res is an array
                                res1.forEach(val => {
                                    previewPhotosUrls.push(val.value);
                                });
                                this.collectionsUrls = [...this.collectionsUrls, previewPhotosUrls];
                            });
                    }
                }
            }).catch(err => {
                console.log(err);

                //隐藏加载中
                this.isCollectionsLoading = false;
            });
        },
        /**
         * @func
         * @desc 路由到专辑详情
         * @param {number} index 当前专辑的index
         */
        routeToCollection(index) {  
            this.$router.push({
                name: 'UnsplashCollection',
                params: {
                    data: this.collectionsData[index]
                }
            })
        }
    },
    components: {
        Pagination
    }
}
</script>

<style lang='scss' scoped>
.uns-collections-wrap {
    width: 100%;
    height: 100%;
    
    .collections {
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        .collections-item {
            width: 100%;
            border-bottom: 3px solid #eee;
            padding: 5px 0;

            .preview-photos {
                width: 100%;

                display: flex;
                justify-content: center;
                align-items: center;

                .main-photo {
                    width: 70%;
                    height: 200px;

                    img {
                        width: 100%;
                        height: 100%;
                    }
                }

                .other {
                    width: 30%;
                    height: 200px;

                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-wrap: wrap;

                    img {
                        width: 100%;
                        height: calc(100% / 3);
                    }
                }
            }

            .collection-desc {
                width: 100%;
                text-align: left;
                padding: 5px 10px;

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
        }
    }
}
</style>