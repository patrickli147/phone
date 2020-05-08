<template>
    <div class="picture-wrap" :style="`opacity:${bgOpacity};`" >
        <topbar class="topbar" :isBlack="(!!'')"></topbar>
        <div class="picture" v-if="dataFromParent.urls">
            <div class="infobar">
                <div class="backicon" @click="handleBackIconClicked" @dragstart="cancelDrag">
                    <img src="../assets/left.png" alt="<">
                </div>
                <div class="timeinfo">
                    <div class="date">{{currentDateObj.getMonth()}}月{{currentDateObj.getDate()}}日</div>
                    <div class="time">{{currentDateObj.getHours()}}:{{currentDateObj.getMinutes()}}</div>
                </div>
                <div class="edit" v-if="currentPath === '/phone/albums'">
                    编辑
                </div>
                <div class="to-photos" v-if="currentPath === '/phone/camera'" @click="routeToPhotos">所有照片</div>
            </div>

            <div class="main-img"
                @mousedown="handleMousedown"
                @mousemove="handleMousemove"
                @mouseup="handleMouseup"
                @mouseleave="handleMouseleave"
            >
                <div 
                    class="img-wrap" 
                    :style="`left:${left - 350}px;top:${top}px`" 
                    v-if="isHorizontal && index > 0"
                >
                    <img :src="index > 0 ? dataFromParent.urls[index - 1].csrc : ''" alt="...">
                </div>

                <div class="img-wrap" :style="`left:${left}px;top:${top}px`" v-if="dataFromParent.urls.length">
                    <img :src="csrc" alt="加载失败" @dragstart="cancelDrag($event)" >
                </div> 

                <div 
                    class="img-wrap" 
                    :style="`left:${left + 350}px;top:${top}px`" 
                    v-if="isHorizontal && index < (dataFromParent.urls.length - 1)"
                >
                    <img :src="index < (dataFromParent.urls.length - 1) ? dataFromParent.urls[index + 1].csrc : ''" alt="...">
                </div>
            </div>

            <div class="scroll-bar"  id="scroll-bar" @scroll="handleScroll">
                <div class="scroll-wrap" :style="`left:${(9 - index) * 17}px;`">
                    <div
                        v-for="(item, index1) in dataFromParent.urls"
                        :key="item.name"
                        :class="index1 === index ? 'picture-item-current' : 'picture-item'"
                        @click="handleChosen(index1)"
                    >
                        <img :src="item.csrc" alt="..." @dragstart="cancelDrag($event)" >
                    </div>
                </div>
                
            </div>

            <div class="bottombar">
                <div class="share" @dragstart="cancelDrag">
                    <img src="../assets/share.png" alt="...">
                </div>
                <div class="like" @click="handleLikeClicked" @dragstart="cancelDrag">
                    <img v-if="isLiked" src="../assets/heart-full.png" alt="...">
                    <img v-else src="../assets/heart.png" alt="...">
                </div>
                <div class="delete" @click="handleDeleteClicked" @dragstart="cancelDrag">
                    <img src="../assets/delete.png" alt="...">
                </div>
                <Modal confirmMsg="删除照片" cancelMsg="取消" :isShown="isModalShown" @modalEvent="handleModalEvent"></Modal>
            </div>
        </div>
    </div>
    
</template>

<script>
import {mapGetters, mapMutations} from 'vuex';
import Topbar from '@/components/Topbar';
import Modal from '@/components/Modal';

export default {
    mounted() {
        //console.log(this.givenData);
    },
    props: {
        givenData: Object,
        givenIndex: Number,
    },
    data() {
        return {
            //current index of the picture
            index: this.givenIndex,
            //left of picture wrap
            left: 0,
            //top of picture wrap
            top: 0,
            //is mouse event started
            isStarted: false,
            //start x of mousedown
            startX: 0,
            //start y of mousedown
            startY: 0,
            //direction of swipe
            direction: 'nodirection',
            //is horizontal
            isHorizontal: true,
            //is main img clicked
            isMainImgClicked: false,
            //isModalShown
            isModalShown: false,
            //opacity of the bg 背景虚化
            bgOpacity: 1,
            //data from parent
            dataFromParent: this.givenData,
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
        //change current index when clicked
        handleChosen(index1) {
            this.index = index1;
        },
        //handleBackIconClicked: 告诉父组件返回
        handleBackIconClicked() {
            //TODO
            //set index

            this.$emit("backIconClicked");
        },
        //routeToPhotos
        routeToPhotos() {
            this.$router.push('/phone/albums');
        },
        //handle mousedown on main img
        handleMousedown(e) {
            //记录起始坐标
            this.isStarted = true;
            this.startX = e.pageX;
            this.startY = e.pageY;
        },
        //handle mousemove on main img
        handleMousemove(e) {
            if (!this.isStarted) {
                //当没有按下鼠标时，直接返回
                return;
            }
            let currentX = e.pageX;
            let currentY = e.pageY;
            let offsetX = Math.abs(currentX - this.startX);
            let offsetY = Math.abs(currentY - this.startY);

            if (this.direction === 'nodirection' && (offsetX > 10 || offsetY > 10)) {
                //任意一个方向的位移达到10px以上,判断是左右滑动还是上下滑动
                if (offsetX > offsetY) {
                    //判定为左右滑动
                    if (this.left > 0) {
                        this.direction = 'right';
                    }
                    else {
                        this.direction = 'left';
                    }
                    this.isHorizontal = true;
                }
                else {
                    //判定为上下滑动
                    if (this.top > 0) {
                        this.direction = 'down';
                    }
                    else {
                        this.direction = 'up';
                    }
                    this.isHorizontal = false;
                }
            }
            else {
                //方向已经确定
                if (this.direction === 'up' || this.direction === 'down') {
                    //竖直滑动需要考虑y方向的位移
                    this.top = currentY - this.startY;
                    //同时需要背景虚化
                    if (Math.abs(this.top) > 270) {
                        //最小的opacity为0.1
                        this.bgOpacity = 0.1;
                    }
                    else {
                        this.bgOpacity = 1 - (Math.abs(this.top) / 300);
                    }
                }
                //x方向的位移始终要考虑
                this.left = currentX - this.startX;
            }
        },
        //handle mouseup: end of swipe
        async handleMouseup() {
            //reset bgOpacity
            this.bgOpacity = 1;

            //没有发生移动，视为click
            if (this.left === 0 && this.top === 0) {
                this.handleMainImgClicked();
            }
            
            //滑动结束
            this.isStarted = false;
            this.startX = 0;
            this.startY = 0;

            if (this.direction === 'left' || this.direction === 'right') {
                //左右滑动
                if (Math.abs(this.left) < 100) {
                    //滑动距离不足100px，视为无效的滑动
                    this.left = 0;
                }
                else {
                    //滑动有效,给出最终滑动方向，并执行滑动响应
                    if (this.left > 0) {
                        await this.handleSwipe('right');
                    }
                    else {
                        await this.handleSwipe('left');
                    }
                }
            }
            else {
                //竖直方向滑动，相当于按下返回按钮
                if (Math.abs(this.top) > 50) {
                    //需要足够的移动距离
                    this.handleBackIconClicked();
                }
            }

            //重置
            this.left = 0;
            this.top = 0;
            this.direction = 'nodirection';
        },
        //handle mouseleave main img
        handleMouseleave() {
            if (!this.isStarted) {
                //滑动没有开始
                return;
            }
            else {
                //等同于mouseup
                this.handleMouseup();
            }
        },
        //handle swipe action
        async handleSwipe(direction) {
            //只需要处理左右滑动
            if (direction === 'left') {
                //处理左滑动

                if (this.index < this.dataFromParent.urls.length - 1) {
                    //剩余动画
                    for (; this.left > -350;) {
                        if (this.left - 10 < -350) {
                            this.left = -350;
                        }
                        else {
                            this.left -= 10;
                        }
                        //延时
                        await new Promise((resolve) => {
                            setTimeout(resolve, 1);
                        });
                    }

                    //更新index
                    this.index ++;
                }
                else {
                    console.log("returned")
                    return;
                }
            }
            else {
                //处理右滑动

                if (this.index > 0) {
                    //剩余动画
                    for (; this.left < 350;) {
                        if (this.left + 10 > 350) {
                            this.left = 350;
                        }
                        else {
                            this.left += 10;
                        }
                        //延时
                        await new Promise((resolve) => {
                            setTimeout(resolve, 1);
                        });
                    }

                    //更新index
                    this.index --;
                }
                else {
                    return;
                }
            }
        },
        //handleMainImgClicked
        handleMainImgClicked() {
            //console.log(this.index);
            this.isMainImgClicked = !this.isMainImgClicked;
        },
        //handleLikeClicked: user like or unlike
        handleLikeClicked() {
            if (this.givenData.name === '相机胶卷') {
                //处理pictures
                let pictures1 = this.pictures;
                pictures1[this.index].isLiked = !pictures1[this.index].isLiked;
                this.updatePictures(pictures1);
            }
            
            //处理data from parent
            this.dataFromParent.urls[this.index].isLiked = !this.dataFromParent.urls[this.index].isLiked;
        },
        //handleDeleteClicked: delete current picture
        handleDeleteClicked() {
            //show modal
            this.isModalShown = true;
        },
        //handleModalEvent: event from Modal.vue
        handleModalEvent(e) {
            //unshow modal
            this.isModalShown = false;

            if (e.eventMsg === 'confirmed') {
                //删除确认
                if (this.givenData.name === '相机胶卷') {
                    //处理pictures
                    let newPictures = this.pictures.filter((item, index)=> {
                        return !(this.index === index);
                    });
                    
                    this.updatePictures(newPictures);
                }
                
                //处理data from parent
                this.dataFromParent.urls = this.dataFromParent.urls.filter((item, index) => {
                    return !(this.index === index);
                });
            }
            else {
                //删除取消
                return;
            }
        },
        //handleScroll
        handleScroll(e) {
            console.log(e);
        }
    },
    computed: {
        //current src of img
        csrc() {
            if (this.currentPictureObj) {
                return this.currentPictureObj.csrc;
            }
            else {
                return '';
            }
        },
        //current picture obj 
        currentPictureObj() {
            if (this.dataFromParent.urls) {
                return this.dataFromParent.urls[this.index];
            }
            else {
                return {};
            }
        },
        //is current picture liked
        isLiked() {
            if (this.currentPictureObj) {
                return this.currentPictureObj.isLiked;
            }
            else {
                return false;
            }
        },
        //current date obj
        currentDateObj() {
            if (this.currentPictureObj) {
                let name = this.currentPictureObj.name;
                let date = new Date(name);
                return date;
            }
            else {
                return new Date();
            }
        },
        //current path 
        currentPath() {
            return this.$route.path;
        },
        //map getters
        ...mapGetters([
            'pictures'
        ])
    },
    watch: {
        givenData() {
            if (this.givenData.name === '相机胶卷') {
                let tempObj = {
                    name: '相机胶卷',
                    urls: this.pictures
                };
                this.dataFromParent = Object.assign({}, tempObj);
            }
            //console.log(this.givenData);
            else {
                this.dataFromParent = Object.assign({}, this.givenData);
            }
            
        },
        givenIndex() {
            this.index = this.givenIndex;
        }
    },
    components: {
        Topbar,
        Modal
    }
}
</script>

<style lang="scss" scoped>
.picture-wrap {
    width: 100%;
    height: 100%;
    background-color: #fff;
    color: black;
    position: absolute;
    left: 0;
    top: 0;
}

.picture {
    width: 100%;
    height: 95%;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .infobar {
        width: 100%;
        height: 10%;
        color: rgb(18,150,219);
        padding: 2%;
        border-bottom: 1px solid #777;

        display: flex;
        justify-content: center;
        align-items: center;
        .backicon {
            width: 30%;
            text-align: left;
            img {
                width: 20px;
                height: 20px;
            }
        }

        .timeinfo {
            width: 40%;
            color: black;
            .date {
                font-weight: 500;
                font-size: 15px;
            }

            .time {
                font-size: 10px;
            }
        }

        .edit {
            width: 30%;
            text-align: right;
        }

        .to-photos {
            width: 30%;
            text-align: right;
        }
    }

    .main-img {
        height: 70%;
        width: 100%;
        overflow: hidden;
        position: relative;
        
        .img-wrap {
            width: 100%;
            height: 100%;
            position: absolute;
            img {
                width: 100%;
            }
        }
    }
    
    .scroll-bar {
        width: 100%;
        height: 10%;
        border-top: 1px solid rgba(119, 119, 119, 0.199);
        position: relative;

        .scroll-wrap {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;

            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: nowrap;
            //overflow-x: scroll;
            .picture-item {
                width: 5%;
                height: 100%;
                flex-shrink: 0;
                
                img{
                    width: 100%;
                    height: 100%;
                }
            }
            .picture-item-current {
                width: 10%;
                height: 100%;
                flex-shrink: 0;
                margin-left: 2.5%;
                margin-right: 2.5%;
                
                img{
                    width: 100%;
                    height: 100%;
                }
            }

        }
    }
    .scroll-bar::-webkit-scrollbar {
        display:none;
    }
    
    .bottombar {
        height: 10%;
        width: 100%;
        padding: 2%;

        display: flex;
        justify-content: center;
        align-items: center;
        .share {
            width:30%;
            height: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }

        .like {
            width:40%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .delete {
            width:30%;
            height: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }

        //统一设置img
        img {
            height: 20px;
            width: 20px;
        }
    }
}
</style>