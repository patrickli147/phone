<template>
    <div class="album">
        <Topbar :isBlack="(!!'')"></Topbar>

        <div class="album-horizontal" v-if="!isAllAlbum">
            <!-- topinfo start -->
            <div class="top-info">
                <div class="add-btn" >
                    <span @click="handleAddAlbum">+</span>
                </div>
                <div class="title">
                    相簿
                </div>
                <div class="view-all" @click="switchAlbums">
                    查看全部
                </div>
            </div>
            <!-- topinfo end -->

            <div class="album-container">
                <div class="album-wrap"
                    :style="`left:-${offset}px`"
                    @mousedown="handleMousedown"
                    @mousemove="handleMousemove"
                    @mouseup="handleMouseup"
                    @mouseleave="handleMouseleave"
                >
                    <!-- camera album -->
                    <div class="album-item" @dragstart="cancelDrag" @click="handleAlbumItemClicked(-1)">
                        <img v-if="pictures.length" :src="pictures[pictures.length - 1].csrc" alt="">
                        <img v-else class="empty-album" src="../assets/ios-photos-empty.png">
                        <div class="album-name">相机胶卷</div>
                        <div class="album-num">{{pictures.length}}</div>
                    </div>
                    <!-- camera album -->

                    <!-- mock data -->
                    <div class="album-item" @dragstart="cancelDrag"
                        v-for="(item, index) in mockAlbum"
                        :key="index"
                        @click="handleAlbumItemClicked(index)"
                    >
                        <img v-if="item.urls.length" :src="item.urls[0].csrc" alt="...">
                        <img v-else class="empty-album" src="../assets/ios-photos-empty.png">
                        <div class="album-name">{{item.name}}</div>
                        <div class="album-num">{{item.urls.length}}</div>
                    </div>
                    <!-- mock data -->
                </div>
            </div>
            
        </div>
            
        <div class="album-vertical" v-if="isAllAlbum">
            <!-- topinfo start -->
            <div class="top-info">
                <div class="top-btn" v-if="isEdit" @click="handleAddAlbum">
                    <img src="../assets/plus.png" alt="+">
                </div>
                <div class="top-btn" v-else @click="switchAlbums">
                    <img src="../assets/left.png" alt="...">
                </div>
                <div class="title">
                    相簿
                </div>
                <div class="edit" @click="handleEditClicked">
                    <p v-if="isEdit">完成</p>
                    <p v-else>编辑</p>
                </div>
            </div>
            <!-- topinfo end -->

            <div class="album-wrap"
            >
                <!-- camera album -->
                <div :class="!isEdit ? 'album-item' : 'album-item cannot-delete'" @dragstart="cancelDrag" @click="handleAlbumItemClicked(-1)">
                    <img v-if="pictures.length" :src="pictures[pictures.length - 1].csrc" alt="...">
                    <img v-else class="empty-album" src="../assets/ios-photos-empty.png">
                    <div class="album-name">相机胶卷</div>
                    <div class="album-num">{{pictures.length}}</div>
                </div>
                <!-- camera album -->

                <!-- mock data -->
                <div class="album-item" @dragstart="cancelDrag"
                    v-for="(item, index) in mockAlbum"
                    :key="index"
                    @click="handleAlbumItemClicked(index)"
                >
                    <div class="delete-btn" v-if="isEdit"
                        @click="handleDelteAlbum($event, index)"
                    >
                        <p>一</p>
                    </div>
                    <img v-if="item.urls.length" :src="item.urls[0].csrc" alt="...">
                    <img v-else class="empty-album" src="../assets/ios-photos-empty.png">
                    <div class="album-name">{{item.name}}</div>
                    <div class="album-num">{{item.urls.length}}</div>
                </div>
                <!-- mock data -->
            </div>
        </div>


        <Photos :givenData="dataToGive" v-if="isPhotosShown" @backEventFromPhotos="handleBackEventFromPhotos"></Photos>

        <!-- 添加相簿 开始 -->
        <div class="addAlbumWindow" v-if="isAddAlbumWindowShown">
            <div class="add-title">新建相册</div>
            <div class="add-msg">{{addMsg}}</div>
            <input type="text" placeholder="标题" v-model="inputedAlbumName" @keyup="handleKeyup" maxlength="10">
            <div class="add-cancel" @click="handleCancelAddAlbum">取消</div>
            <div :class="inputedAlbumName.length ? 'add-save' : 'add-save disabled'" @click="handleSaveAlbum">存储</div>
        </div>
        <!-- 添加相簿 结束 -->

        <!-- 新建相册modal 开始 -->
        <Modal confirmMsg="新建相册" cancelMsg="取消" :isShown="isModalShown" @modalEvent="handleModalEvent"></Modal>
        <!-- 新建相册modal 结束 -->

        <!-- 删除相册modal 开始 -->
        <Modal confirmMsg="删除相册" cancelMsg="取消" :isShown="isDeleteModalShown" @modalEvent="handleDeleteModalEvent"></Modal>
        <!-- 删除相册modal 结束 -->
    </div>
</template>

<script>
import Photos from '@/components/Photos';
import {mapGetters, mapMutations} from 'vuex';
import Mock from 'mockjs';
import Topbar from '@/components/Topbar';
import Modal from '@/components/Modal';

export default {
    mounted() {
        this.getRandomData();
        this.mockAlbum.push({name:'empty',urls: []})
    },
    data() {
        return {
            //data mocked
            mockAlbum: [],
            //offset of album wrap
            offset: 0,
            //is scroll started 
            isStarted: false,
            //start x of mousedown
            startX: 0,
            //offset of last time
            lastOffset: 0,
            //新建相册modal
            isModalShown: false,
            //是否处于编辑模式
            isEdit: false,
            //是否显示所有相簿
            isAllAlbum: false,
            //删除相册modal
            isDeleteModalShown: false,
            //album index to delet
            toDelete: -1,
            //msg of add album
            addMsg: '请为此相簿输入名称。',
            //album name user inputed
            inputedAlbumName: '',
            //isAddAlbumWindowShown
            isAddAlbumWindowShown: false,
            //data to give to component Photos
            dataToGive: {},
            //is Photos component shown
            isPhotosShown: false,
            //标记滑动动作是否位移为0（即是否可以视为点击）
            isScrollClick: true,
        }
    },
    methods: {
        //map mutations
        ...mapMutations({
            updatePictures: 'UPDATE_PICTURES'
        }),
        //cancel drag event
        cancelDrag(e) {
            e.preventDefault();
        },
        //Mock data
        getRandomData() {
            //随机生成3~10个相册
            let numOfAlbums = Mock.Random.natural(3, 20);
            for (let i = 0; i < numOfAlbums; i ++) {
                //随机的照片数目
                let numOfPhotos = Mock.Random.natural(20, 80);
                let tempArr = [];
                for (let j = 0; j < numOfPhotos; j ++) {
                    let tempPictureObj = {name: '', csrc: '', isLiked: false};
                    let date = new Date();
                    tempPictureObj.name = date.toJSON();
                    tempPictureObj.csrc = Mock.Random.dataImage('85x85',Mock.Random.ctitle(4));
                    tempPictureObj.isLiked = Mock.Random.boolean();
                    tempArr.push(tempPictureObj);
                }
                let tempName = Mock.Random.ctitle();
                let dataObj = {
                    name: tempName,
                    urls: tempArr
                }
                this.mockAlbum.push(dataObj);
            }
            //console.log(this.mockAlbum);
        },
        //handleMousedown
        handleMousedown(e) {
            this.isStarted = true;
            this.startX = e.pageX
        },
        //handleMousemove
        handleMousemove(e) {
            if (!this.isStarted) {
                return;
            }

            //一旦出现了位移，则不视为点击
            this.isScrollClick = false;

            let currentX = e.pageX;
            let currentOffset = this.startX - currentX;
            let deltaOffset = currentOffset - this.lastOffset;
            
            if (deltaOffset + this.offset < 0) {
                //越界
                this.offset = 0;
            }
            else if (deltaOffset + this.offset > this.maxOffset) {
                //越界
                this.offset = this.maxOffset;
                //console.log(this.maxOffset);
            }
            else {
                //在合法范围内
                this.offset += deltaOffset;
            }

            //update last offset
            this.lastOffset = currentOffset;
        },
        //handleMouseup
        handleMouseup() {
            //reset: end of scroll
            this.isStarted = false;
            this.startX = 0;
            this.lastOffset = 0;
        },
        //handleMouseleave
        handleMouseleave() {
            if (!this.isStarted) {
                return;
            }
            else {
                //视为mouseup
                this.handleMouseup();
            }
        },
        //handleModalEvent: event from Modal.vue
        handleModalEvent(e) {
            //unshow modal
            this.isModalShown = false;

            if (e.eventMsg === 'confirmed') {
                //确认新建相册

                //切换到所有相簿
                if (!this.isAllAlbum) {
                    this.isAllAlbum = true;
                }

                //show
                this.isAddAlbumWindowShown = true;
            }
            else {
                //取消新建相册
                return;
            }
        },
        //handleEditClicked: change mode 
        handleEditClicked() {
            this.isEdit = !this.isEdit;
        },
        //handleAddAlbum
        handleAddAlbum() {
            //显示modal
            this.isModalShown = true;
        },
        //handleBackBtnClicked
        switchAlbums() {
            //切换回先前的页面
            this.isAllAlbum = !this.isAllAlbum;
        },
        //handleDelteAlbum
        handleDelteAlbum(event, index1) {
            event.stopPropagation();
            this.isDeleteModalShown = true;
            this.toDelete = index1;
        },
        //handleDeleteModalEvent
        handleDeleteModalEvent(e) {
            this.isDeleteModalShown = false;

            if (e.eventMsg === 'confirmed') {
                //确认删除相册
                this.mockAlbum = this.mockAlbum.filter((value, index) => {
                    //删除对应的相册
                    return this.toDelete !== index;
                });
            }
            else {
                //取消删除相册
                return;
            }
        },
        //handleKeyup
        handleKeyup() {
            //只能输入中文、英文、数字、@符号和.符号
            this.inputedAlbumName = this.inputedAlbumName.replace(/[^a-zA-Z0-9\u4E00-\u9FA5@.]/g,'');
            //console.log(this.inputedAlbumName);
        },
        //handleCancelAddAlbum
        handleCancelAddAlbum() {
            //清空输入
            this.inputedAlbumName = '';
            //隐藏窗口
            this.isAddAlbumWindowShown = false;
        },
        //handleSaveAlbum
        handleSaveAlbum() {
            if (this.inputedAlbumName.length === 0) {
                //用户尚未输入，此时禁用
                return;
            }
            else {
                //用户已经输入，存储新相簿
                let newALbum = {};
                newALbum.name = this.inputedAlbumName;
                newALbum.urls = [];

                this.mockAlbum.push(newALbum);

                //清空输入
                this.inputedAlbumName = '';
                //隐藏窗口
                this.isAddAlbumWindowShown = false;
            }
        },
        //handleAlbumItemClicked 显示Photos
        handleAlbumItemClicked(index) {
            if (!this.isScrollClick) {
                //是滑动不是点击
                this.isScrollClick = true;
                return;
            }

            if (index === -1) {
                //picturs特殊处理
                this.dataToGive.name = '相机胶卷';
                this.dataToGive.urls = this.pictures;
                //console.log(this.dataToGive.urls === this.pictures); //true
            }
            else {
                this.dataToGive = Object.assign({}, this.mockAlbum[index]);
                //console.log(this.dataToGive === this.mockAlbum[index]); //false
            }
            //console.log(this.dataToGive);
            this.isPhotosShown = true;
        },
        //handleBackEventFromPhotos
        handleBackEventFromPhotos() {
            //子组件触发返回事件
            this.isPhotosShown = false;

            //避免数据污染 已经用Object.assign()代替解决
            //this.dataToGive = {};
        }
    },
    components: {
        Photos,
        Topbar,
        Modal
    },
    computed: {
        //map getters
        ...mapGetters([
            'pictures'
        ]),
        //max offset
        maxOffset() {
            //真实的相册+mock的相册
            let length = this.mockAlbum.length + 1;
            //需要滑动的数目
            let need = Math.ceil(length / 2) - 3;
            if (need <= 0) {
                return 0;
            }
            else {
                return need * 105.6;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.album {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color:#fff;
    color: black;
    position: relative;

    .album-horizontal {
        width: 100%;
        height: 100%;
        .top-info {
            width: 100%;
            height: 20%;
            padding: 10px;
            border-bottom: 1px solid #eee;

            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            .add-btn {
                width: 100%;
                height: 70%;
                color: rgb(18,150,219);
                font-size: 30px;
                text-align: left;
            }

            .title {
                width: 50%;
                font-size: 20px;
                font-weight: 600;
                text-align: left;
            }

            .view-all {
                width: 50%;
                font-size: 18px;
                color: rgb(18,150,219);
                text-align: right;
            }
        }

        .album-container {
            position: relative;
            width: 100%;
            height: 65%;
            border-bottom: 1px solid #eee;
            .album-wrap {
                position: absolute;
                width:100%;
                height: 100%;
                top: 0;
                padding: 10px;

                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                flex-wrap: wrap;
                .album-item {
                    width: 33%;
                    height: 50%;
                    img {
                        width: 100px;
                        height: 100px;
                    }

                    .empty-album {
                        width: 100px;
                        height: 100px;
                        background-color: rgb(165, 144, 144);
                    }

                    .album-name {
                        font-size: 14px;
                        text-align: left;
                    }

                    .album-num {
                        font-size: 10px;
                        text-align: left;
                        opacity: 0.8;
                    }
                }
            }
        }
        
    }

    .album-vertical {
        width: 100%;
        height: 100%;
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
                width: 30%;
                height: 100%;
                text-align: left;
                img {
                    width: 20px;
                    height: 20px;
                }
            }

            .title {
                width: 40%;
                font-size: 20px;
                font-weight: 600;
                text-align: center;
            }

            .edit {
                width: 30%;
                font-size: 18px;
                color: rgb(18,150,219);
                text-align: right;
            }
        }

        .album-wrap {
            overflow: scroll;
            width: 100%;
            height: 85%;
            padding: 10px;
            border-bottom: 1px solid #eee;

            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            flex-wrap: wrap;
            .album-item {
                width: 33.33%;
                position: relative;
                
                .delete-btn {
                    position: absolute;
                    left: -10px;
                    top: -10px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: red;
                    color: #fff;
                }

                img {
                    width: 100px;
                    height: 100px;
                }

                .empty-album {
                    width: 100px;
                    height: 100px;
                    background-color: rgb(165, 144, 144);
                }

                .album-name {
                    font-size: 14px;
                    text-align: left;
                }

                .album-num {
                    font-size: 10px;
                    text-align: left;
                    opacity: 0.8;
                }
            }
            .cannot-delete {
                opacity: 0.5;
            }
        }
        .album-wrap::-webkit-scrollbar {
            display: none;
        }
    }
  
    .addAlbumWindow {
        position: absolute;
        left: 20%;
        top: 30%;
        width: 60%;
        height: 30%;
        background-color: rgb(255, 255, 255);
        border-radius: 10px;

        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-wrap: wrap;

        .add-title {
            width: 100%;
            font-size: 20px;
            font-weight: 600;
            padding-top: 20px;
        }

        .add-msg {
            width: 100%;
            font-size: 12px;
        }

        input {
            width: 80%;
            font-size: 12px;
        }

        .add-cancel {
            width: 50%;
            color: rgb(18,150,219);
            border-top: 1px solid #eee;
            border-right: 1px solid #eee;
        }

        .add-save {
            width: 50%;
            color: rgb(18,150,219);
            border-top: 1px solid #eee;
        }
        .disabled {
            color: gray;
        }
    }
}
</style>
