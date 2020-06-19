<template>
    <div class="photos">
        <Topbar :isBlack="(!!'')"></Topbar>
        
        <!-- 顶部操作栏 开始 -->
        <div class="top-info">
            <div class="top-btn" :style="!isEdit ? `opacity:1;` : `opacity:0;`" @click="emitBackEvent">
                <img src="../assets/left.png" alt="...">
            </div>
            <div class="title">
                <span v-if="!isEdit">{{dataFromParent.name}}</span>
                <span v-if="isEdit && (picturesSelected.length === 0)">选择项目</span>
                <span v-if="isEdit && (picturesSelected.length > 0)">已选择{{picturesSelected.length}}张照片</span>
            </div>
            <div class="edit" @click="handleEditClicked">
                <p v-if="isEdit">取消</p>
                <p v-else>选择</p>
            </div>
        </div>
        <!-- 顶部操作栏 结束 -->

        <!-- photo-container 开始 -->
        <div class="photo-container">
            <div class="photo-item-wrap">
                <div 
                    v-for="(item, index) in dataFromParent.urls"
                    :key="index"
                    @click="handlePictureClicked(index)"
                    @dragstart="cancelDrag"
                    :class="(picturesSelected.indexOf(index) >= 0) ? 'photo-item selected' : 'photo-item'"
                >
                    <div class="selected-icon" v-if="picturesSelected.indexOf(index) >= 0">
                        <span>√</span>
                    </div>
                    <img :src="item.csrc" alt="加载失败" >
                </div>
            </div>
        </div>
        <!-- photo-container 结束 -->  

        <!-- bottombar start -->
        <div class="bottombar" v-if="isEdit">
            <div :class="picturesSelected.length ? 'delete-btn' : 'delete-btn disabled'">
                <img src="../assets/delete.png" alt="..." @click="handleDeleteSelected">
            </div>
        </div>
        <!-- bottombar end -->

        <!-- picture component 开始 -->
        <Picture :givenData="dataFromParent" :givenIndex="indexToGive" v-show="isPreviewed" @backIconClicked="handleBackIconClicked"></Picture>
        <!-- picture component 结束 -->

        <!-- 删除选中modal 开始 -->
        <Modal confirmMsg="删除选中照片" cancelMsg="取消" :isShown="isDeleteModalShown" @modalEvent="handleDeleteModalEvent"></Modal>
        <!-- 删除选中modal 结束 -->
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import Topbar from '@/components/Topbar';
import Picture from '@/components/Picture';
import Mock from 'mockjs';
import Modal from '@/components/Modal';

export default {
    props: {
        givenData: Object
    },
    mounted() {
        //mock data
        //this.getRandomUrls();
    },
    data() {
        return {
            //is picture previewed
            isPreviewed: false,
            //indexToGive
            indexToGive: 0,
            //mocked img urls
            mockUrls: [],
            //title of album
            dataFromParent: this.givenData,
            //is edit mode
            isEdit: false,
            //pictures selected: save the indexes
            picturesSelected: [],
            //isDeleteModalShown
            isDeleteModalShown: false,

        }
    },
    methods: {
        //map mutations
        ...mapMutations({
            updatePictures: 'UPDATE_PICTURES'
        }),
        //handleBackIconClicked: set isPreviewed to false
        handleBackIconClicked() {
            this.isPreviewed = false;
        },
        //open Photos
        handlePictureClicked(index) {
            if (this.isEdit) {
                //处于编辑模式
                if (this.picturesSelected.indexOf(index) >= 0) {
                    //已选中
                    return;
                }
                else {
                    this.picturesSelected.push(index);
                }
            }
            else {
                //打开图片
                this.indexToGive = index;
                this.isPreviewed = true;
            }
        },
        //cancel drag event
        cancelDrag(e) {
            e.preventDefault();
        },
        //get random img url with Mock
        getRandomUrls() {
            for (let i = 0; i < 100; i ++) {
                this.mockUrls.push(Mock.Random.dataImage('85x85',Mock.Random.ctitle(4)))
            }
        },
        //handleEditClicked
        handleEditClicked() {
            if (this.isEdit) {
                //处于编辑模式,清空已选中
                this.picturesSelected = [];
            }
            this.isEdit = !this.isEdit;
        },
        //emitBackEvent
        emitBackEvent() {
            //向父组件发出返回事件
            this.$emit("backEventFromPhotos");
        },
        //处理删除选中
        handleDeleteSelected() {
            this.isDeleteModalShown = true;
        },
        //处理子组件事件
        handleDeleteModalEvent(e) {
            this.isDeleteModalShown = false;

            if (e.eventMsg === 'confirmed') {
                //确认删除
                this.dataFromParent.urls = this.dataFromParent.urls.filter((value, index) => {
                    //删除对应的相册
                    return !(this.picturesSelected.indexOf(index) >= 0);
                });

                //清空选中
                this.picturesSelected = [];
            }
            else {
                //取消删除相册
                return;
            }
        }
    },  
    computed: {
        //map getters
        ...mapGetters([
            'pictures'
        ])
    },
    components: {
        Topbar,
        Picture,
        Modal
    },
    watch: {
        givenData() {
            this.dataFromParent = this.givenData;
        }
    }
}
</script>

<style lang="scss" scoped>
.photos {
    width: 100%;
    height: 100%;
    background-color: rgb(211, 189, 189);
    color: black;
    position: absolute;
    left: 0;
    top: 0;

    .top-info {
        width: 100%;
        height: 10%;
        padding: 10px;
        border-bottom: 1px solid #eee;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        .top-btn {
            width: 25%;
            height: 100%;
            text-align: left;
            img {
                width: 20px;
                height: 20px;
            }
        }

        .title {
            width: 50%;
            font-size: 20px;
            font-weight: 600;
            text-align: center;
        }

        .edit {
            width: 25%;
            font-size: 18px;
            color: rgb(18,150,219);
            text-align: right;
        }
    }

    .photo-container {
        width: 100%;
        height: 85%;
        background-color: #fff;
        overflow: scroll;
        position: relative;
        /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
        -ms-overflow-style:none;
        /*火狐下隐藏滚动条*/
        scrollbar-width: none;

        .photo-item-wrap {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: wrap;
            .photo-item {
                width: 25%;
                height: 85px;
                position: relative;
                .selected-icon {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: rgb(18,150,219);
                    color: #fff;
                    font-weight: 600;
                    font-size: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                img {
                    width: 85px;
                    height: 85px;
                }
            }
            .selected {
                opacity: 0.2;
            }
        }
        
    }
    .photo-container::-webkit-scrollbar {
        display: none;
    }
    
    .bottombar {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 8%;
        background-color: rgb(211, 189, 189);
        padding: 10px;

        display: flex;
        justify-content: center;
        align-items: center;
        .delete-btn {
            width: 100%;
            text-align: right;
            img {
                width: 20px;
                height: 20px;
            }
        }
        .disabled {
            opacity: 0.2;
        }
    }
}
</style>