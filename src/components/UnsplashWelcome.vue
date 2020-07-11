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
        <div class="welcome-photos">
            <div class="photos-item"
                v-for="item in dataOfListPhotos"
                :key="item.urls.small"
            >
                <img :src="item.urls.thumb" alt="">
            </div>
        </div>
        <!-- 首页分页 结束 -->

    </div>
</template>

<script>
export default {
    mounted() {
        this.listPhotos();
    },
    data() {
        return {
            //list photos 的url参数
            listPhotosParams: {
                'page': 1,            //Page number to retrive
                'per_page': 10,       // Number of items per page. 
                'order_by': 'latest', // How to sort the photos. (latest, oldest, popular)
                'client_id': 'GT_Bfahw73NpMk9NHvcCMqBIyZIpxdhY4qMbCV3TgPM'
            },
            //list photos 返回的data
            dataOfListPhotos: null
        }
    },
    methods: {
        /**
         * @func
         * @desc 调用list photos api 获取数据
         */
        listPhotos() {
            this.axios({
                method:'get',
                url: 'https://api.unsplash.com/photos/',
                params: this.listPhotosParams,
            }).then(res => {
                console.log(res);
                if (res.data) {
                    this.dataOfListPhotos = res.data;
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.uns-welcome-wrap {
    width: 100%;
    height: 100%;

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
            
            img {
                width: 100%;
                height: 100%;
            }
        
        }
        .photos-item:hover {
            box-shadow: .5px .5px .5px rgba(5, 5, 5, 0.623);
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
}
</style>