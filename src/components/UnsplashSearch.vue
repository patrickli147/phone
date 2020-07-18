<template>
    <div class="search-wrap">
        <!-- 顶部搜索栏 开始 -->
        <div class="search-top-wrap">
                <div class="search-input">
                    <input 
                        @keyup="handleInputKeyup($event)"
                        @focus="toggleInputFocused" 
                        @blur="toggleInputFocused"
                        type="text" 
                        placeholder="输入关键字搜索（推荐英文）" 
                        v-model="searchInput"
                    >

                    <div 
                        class="clear-input" 
                        v-show="searchInput.length"
                        @click="searchInput = ''"
                    >
                        x
                    </div>

                    <!-- 输入联想 开始 -->
                    <div class="input-relevant">

                    </div>
                    <!-- 输入联想 结束 -->
                </div>
                <div class="search-icon" @click="search">
                    搜索
                </div>
        </div>
        <!-- 顶部搜索栏 结束 -->

        <!-- 搜索结果分类 开始 -->
        <div class="search-classification">
            <div 
                :class="selectedClassificationIndex === 0 ? 'classification-item selected' : 'classification-item'"
                @click="selectClassification(0)"
            >
                Photos {{totalPhotos}}
            </div>
            <div 
                :class="selectedClassificationIndex === 1 ? 'classification-item selected' : 'classification-item'"
                @click="selectClassification(1)"
            >
                Collctions {{totalCollections}}
            </div>
            <div 
                :class="selectedClassificationIndex === 2 ? 'classification-item selected' : 'classification-item'"
                @click="selectClassification(2)"
            >
                Users {{totalUsers}}
            </div>
            <div class="classification-item filter">
                <select 
                    name="orderby" id="" 
                    v-model="selectedOrderBy"
                    @change="handleSelectedOrderByChanged"
                >
                    <option value="relevant">相关</option>
                    <option value="latest">最新</option>
                </select>
            </div>
        </div>
        <!-- 搜索结果分类 结束 -->

        <!-- 搜索结果 开始 -->
        <div class="search-outcome">
            <pagination
                :isLoading="isPhotosLoading"
                :isAllDataLoaded="isPhotosAllDataLoaded"
                @nextpage="handleNextPageEvent('photos')"
            >
                <div class="searched-photos" v-show="searchPhotosData.length">
                    <div class="photos-item"
                        v-for="count in searchPhotosData.length"
                        :key="count"
                    >
                        <img :title="searchPhotosData[count - 1]['alt_description']" :src='searchUsersUrls[count - 1]' alt="">
                    </div>
                </div>
            </pagination>
        </div>
        <!-- 搜索结果 结束 -->


    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import Mock from 'mockjs';


export default {
    data() {
        return {
            //搜索框输入
            searchInput: '',
            //true: input is focused
            isInputFocused: false,
            //选择的classification
            selectedClassificationIndex: 0,
            //true: 加载中
            isPhotosLoading: true,
            //true: 数据加载完毕
            isPhotosAllDataLoaded: false,
            //true: 加载中
            isCollectionsLoading: true,
            //true: 数据加载完毕
            isCollectionsAllDataLoaded: false,
            //true: 加载中
            isUsersLoading: true,
            //true: 数据加载完毕
            isUsersAllDataLoaded: false,
            //选择的排序方式
            selectedOrderBy: 'relevant',
            //searchPhotos params
            searchPhotosParams: {
                'query': '',
                'page': 1,            //Page number to retrive
                'per_page': 18,       // Number of items per page.
                'order_by': 'latest', // How to sort the photos. (latest, oldest, popular)
                'client_id': 'GT_Bfahw73NpMk9NHvcCMqBIyZIpxdhY4qMbCV3TgPM'
            },
            //searchCollections params
            searchCollectionsParams: {
                'query': '',
                'page': 1,            //Page number to retrive
                'per_page': 18,       // Number of items per page.
                'order_by': 'latest', // How to sort the photos. (latest, oldest, popular)
                'client_id': 'GT_Bfahw73NpMk9NHvcCMqBIyZIpxdhY4qMbCV3TgPM'
            },
            //searchUsers params
            searchUsersParams: {
                'query': '',
                'page': 1,            //Page number to retrive
                'per_page': 18,       // Number of items per page.
                'order_by': 'latest', // How to sort the photos. (latest, oldest, popular)
                'client_id': 'GT_Bfahw73NpMk9NHvcCMqBIyZIpxdhY4qMbCV3TgPM'
            },
            //searchPhotos返回的data
            searchPhotosData: [],
            //searchCollections返回的data
            searchCollectionsData: [],
            //searchUsers返回的data
            searchUsersData: [],
            //searchPhotos需要的urls
            searchPhotosUrls: [],
            //searchCollections需要的urls
            searchCollectionsUrls: [],
            //searchUsers需要的urls
            searchUsersUrls: [],
            //photos总计
            totalPhotos: 0,
            //photos页数总计
            totalPhotosPages: 0,
            //collections总计
            totalCollections: 0,
            //collecitons页数总计
            totalCollectionsPages: 0,
            //users总计
            totalUsers: 0,
            //users页数总计
            totalUsersPages: 0,
            //搜索历史
            searchHistory: []
        }
    },
    methods: {
        /**
         * @func
         * @desc 处理input的keyup事件
         * @param {object} e keyup事件
         */
        handleInputKeyup(e) {
            let key = e.key;
            
            if (key === "Enter" && this.searchInput.length > 0) {
                //按下回车且搜索内容不为空时搜索
                this.search();
            }
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
         * @desc 搜索
         */
        search() {
            if (this.searchInput === '') {
                //输入为空
                return;
            }

            if (this.searchInput === this.searchHistory[this.searchHistory.length - 1]) {
                //输入与上次相同
                return;
            }
            else {
                //记录历史
                this.searchHistory = [...this.searchHistory, this.searchInput];
                
                //清除之前的搜索数据
                this.initData();
            }
            

            switch (this.selectedClassificationIndex) {
                case 0: 
                    this.searchPhotos();
                    break;
                case 1: 
                    this.searchCollections();
                    break;
                case 2: 
                    this.searchUsers();
                    break;
                default: 
                    break;
            }
        },
        selectClassification(index) {
            this.selectedClassificationIndex = index;

            //todo
            //reload
        },
        /**
         * @func
         * @desc 处理nextpage事件
         * @param {string} classification 翻页的页面
         */
        handleNextPageEvent(classification) {
            console.log("next page")

            switch (classification) {
                case 'photos':
                    if (this.searchPhotosParams.page < this.totalPhotosPages) {
                        this.searchPhotosParams.page ++;
                        this.searchPhotos();
                    }
                    else {
                        console.log(this.searchPhotosParams.page, this.totalPhotosPages);
                        this.isPhotosAllDataLoaded = true;
                    }

                    break;
                case 'collections':
                    if (this.searchCollectionsParams.page < this.totalCollectionsPages) {
                        this.searchCollectionsParams.page ++;
                        this.searchCollections();
                    }
                    else {
                        this.isCollectionsAllDataLoaded = true;
                    }
                    
                    break;
                case 'users':
                    if (this.searchUsersParams.page < this.totalUsersPages) {
                        this.searchUsersParams.page ++;
                        this.searchUsers();
                    }
                    else {
                        this.isUsersAllDataLoaded = true;
                    }
                    break;
                default:
                    break;
            }
        },
        handleSelectedOrderByChanged() {
            console.log(this.selectedOrderBy);

            //todo
        },
        /**
         * @func
         * @desc 搜索图片
         */
        searchPhotos() {
            //显示加载中
            this.isPhotosLoading = true;

            //直接加入对象不是响应式
            this.searchPhotosParams.query = this.searchInput;

            this.axios({
                method:'get',
                url: 'https://api.unsplash.com/search/photos',
                params: this.searchPhotosParams
            }).then(res => {
                console.log(res);

                if (res.data) {
                    //返回了data
                    let results = res.data.results;

                    this.totalPhotos = res.data.total;
                    this.totalPhotosPages = res.data.total_pages;

                    this.searchPhotosData = [...this.searchPhotosData, ...results];

                    for (let i = 0; i < results.length; i ++) {
                        this.getImgsWithUrl(results[i].urls.small).then(url => {
                            //this.searchPhotosUrls.push(url);
                            //触发响应
                            this.searchUsersUrls = [...this.searchUsersUrls, url]
                        }).catch(err => {
                            console.log(err);
                        });
                    }
                }

                //隐藏加载中
                this.isPhotosLoading = false;
            }).catch(err => {
                console.log(err);

                //隐藏加载中
                this.isPhotosLoading = false;
            });
        },
        /**
         * @func
         * @desc 搜索专辑
         */
        searchCollections() {
            //显示加载中
            this.isLoading = true;

            this.axios({
                method:'get',
                url: 'https://api.unsplash.com/photos/',
                params: this.searchPhotosParams
            }).then(res => {
                console.log(res);

                //隐藏加载中
                this.isLoading = false;
            }).catch(err => {
                console.log(err);

                //隐藏加载中
                this.isLoading = false;
            });
        },
        /**
         * @func
         * @desc 搜索用户
         */
        searchUsers() {
            //显示加载中
            this.isLoading = true;

            this.axios({
                method:'get',
                url: 'https://api.unsplash.com/photos/',
                params: this.searchPhotosParams
            }).then(res => {
                console.log(res);

                //隐藏加载中
                this.isLoading = false;
            }).catch(err => {
                console.log(err);

                //隐藏加载中
                this.isLoading = false;
            });
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
            }
            
            if (!res) {
                //请求失败，用mock代替
                let mockUrl = Mock.Random.image();
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
         * @desc 初始化
         */
        initData() {
            this.searchPhotosUrls = [];
            this.searchPhotosData = [];
            this.searchPhotosParams.page = 1;
            this.totalPhotos = 0;

            this.searchCollectionsUrls = [];
            this.searchCollectionsData = [];
            this.searchCollectionsParams.page = 1;
            this.totalCollections = 0;
            

            this.searchUsersUrls = [];
            this.searchUsersData = [];
            this.searchUsersParams.page = 1;
            this.totalUsers = 0;
        }

    },
    components: {
        Pagination
    }
}
</script>

<style lang="scss" scoped>
.search-wrap {
    width: 100%;
    height: 100%;
}

.search-top-wrap {
    width: 100%;
    //background-color: rgb(190, 183, 233);
    padding: 5px;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .search-input {
        width: 80%;
        text-align: right;
        position: relative;
        input {
            width: 100%;
            outline-style: none;
            border: 1px solid #ccc;
            padding: 5px;
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
        }
        input:hover {
            border-color: #66afe9;
            background-color: #eee;
        }

        .clear-input {
            position: absolute;
            right: 5px;
            top: 8px;
            width: 16px;
            height: 16px;
            // border-radius: 8px;;
            // border: 1px solid #000;

            display: flex;
            justify-content: center;
            align-items: center;
        }

        .input-relevant {
            position: absolute;
        }
    }

    .search-icon {
        width: 20%;
        text-align: center;
        background-color: rgb(50, 177, 250);
        padding: 6px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }
}

.search-classification {
    padding: 5px;
    border-bottom: 1px solid #eee;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;

    .classification-item {
        width: 25%;
        opacity: .5;
        border-bottom: 1px solid #fff;

        select {
            width: 100%;
            border-radius: 5px;
            padding: 2px;

            option {
                border-radius: 5px;
            }
        }
        select:focus {
            outline: none;
        }
    }
    .classification-item:hover {
        opacity: 1;
    }
    .filter {
        opacity: 1;
    }
    .selected {
        border-bottom: 1px solid black;
        opacity: 1;
    }
}

.search-outcome {
    width: 100%;
    height: 80%;

    .searched-photos {
        width: 100%;

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

</style>