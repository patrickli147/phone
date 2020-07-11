<template>
   <div class="poem">
        <!-- 首页 开始 -->
        <div class="start-page" v-if="isStartPageShown">
            <div class="title">
                <h1>寸心</h1>
            </div>
            <div 
                class="start-button"
                @click="isStartPageShown = !isStartPageShown"    
            >
                <button>开始游戏</button>
            </div>
        </div>
        <!-- 首页 结束 -->

        <!-- 宫格诗词 开始 -->
        <div class="grid-poem" v-if="!isStartPageShown">
            <!-- 控制单元 开始 -->
            <div class="control-unit">
                <div 
                    class="control-item"
                    @click="isStartPageShown = !isStartPageShown"
                >
                    返回
                </div>
                <div 
                    class="control-item"
                    @click="handleRestartGame"
                >
                    重玩
                </div>
                <div 
                    class="control-item"
                    @click="isTipsMsgShown = !isTipsMsgShown"
                >
                    提示
                </div>
                <div 
                    class="control-item"
                    @click="isAnsShown = true"
                >
                    答案
                </div>

                
                <!-- 显示相关信息 开始-->
                <transition name="fade">
                    <div 
                        class="show-info"
                        v-show="isTipsMsgShown"    
                    >
                        <p>{{tipsMsg}}</p>
                    </div>
                </transition>
                <!-- 显示相关信息 结束 -->

            </div>
            <!-- 控制单元 结束 -->

            <!-- 游戏区域 开始 -->
            <div class="game-container leftfadein" ref="gameContainer">
                <div class="poem-sentence"
                    v-for="(sentence, index) in content"
                    :key="index"
                >
                    <div 
                        v-for="count in (sentence.length - 1)"
                        :key="count.id"
                        @click="handlePoemWordClicked($event,index, count)"
                        :class="dynamicClassNames[getCurrentIndex(index, count)]"
                    >
                        <span>{{contentForUser[getCurrentIndex(index, count)]}}</span>
                    </div>
                    <div class="punctuation">
                        <span>{{sentence[sentence.length - 1]}}</span>
                    </div>
                </div>                
            </div>
            <!-- 游戏区域 结束 -->

            <!-- 规则提示 开始 -->
            <div class="rules">
                <transition name="fade-rule">
                    <div 
                        class="rule-desc"
                        v-if="isRulesShown"
                    >
                        <p>黑色的字已经正确。蓝色的字是错误的。点击蓝色的字进行交换，直到全部正确。</p>
                    </div>
                </transition>
                    
                <div 
                    class="rule-controller"
                    @click="isRulesShown = !isRulesShown"
                >
                    <span v-if="isRulesShown">隐藏</span>
                    <span v-else>规则</span>
                </div>
            </div>
            <!-- 规则提示 结束 -->

            <!-- 答案 开始 -->
            <transition name="answer">
                <div class="answer" v-if="isAnsShown">
                    <div class="ans-detail" v-if="origin">
                        <div class="ans-title">
                            {{origin.title}}
                        </div>
                        <div class="ans-author">
                            {{`【${origin.dynasty}】 ${origin.author} `}}
                        </div>
                        <div class="ans-content">
                            <div 
                                class="content-item"
                                v-for="item in origin.content"
                                :key="item.id"
                            >
                                {{item}}
                            </div>
                        </div>
                    </div>

                    <div class="ans-control">
                        <div 
                            class="control-item"
                            @click="isStartPageShown = !isStartPageShown"    
                        >
                            返回
                        </div>
                        <div 
                            class="control-item"
                            @click="handleRestartGame"
                        >
                            重玩
                        </div>
                        <div 
                            class="control-item"
                            @click="handleContinueClicked"
                        >
                            继续
                        </div>
                    </div>
                </div>
            </transition>
            
            <!-- 答案 结束 -->

        </div>
        <!-- 宫格诗词 结束 -->
   </div>
</template>

<script>
import * as jinrishici from 'jinrishici';

export default {
    mounted() {
        this.getPoemData();
    },
    data() {
        return {
            //获取的诗歌数据
            poemData: {},
            //中文标点
            punctuations: ['，','。', '、', '？', '！'],
            //true:已经显示提示信息
            isTipsMsgShown: false,
            //true:只点击了一个字
            isOneWord: false,
            //上次点击的dom
            lastClicked: {},
            //用户操作后的内容
            contentForUser: [],
            //动态类名
            dynamicClassNames: [],
            //正确类名
            correctClassName: {
                'poem-word': true,
                'correct': true,
                'incorrect': false
            },
            //错误类名
            incorrectClassName: {
                'poem-word': true,
                'correct': false,
                'incorrect': true
            },
            //诗句总数量，最大为8，最小为3
            level: 4,
            //true: 展示answer
            isAnsShown: false,
            //true: 展示规则
            isRulesShown: false,
            //true：展示首页
            isStartPageShown: true
        }
    },
    methods: {
        /**
         * @func
         * @desc 获取jinrishici数据
         */
        async getPoemData() {
            await jinrishici.load(res => {
                if (res.status === 'error') {
                    //请求出现错误
                    console.log(res.errMessage);
                }
                else {
                    //请求成功
                    this.poemData = res.data;

                    this.init();
                }
            }, (err) => {
                console.log(err);
            })
        },
        /**
         * @func
         * @desc 计算randomContentArray的index
         * @param {number} row 行数
         * @param {number} column 列数
         * @returns {number} 返回值为当前index
         */
        getCurrentIndex(row, column) {
            let index = 0;
            for (let i = 0; i < row; i ++) {
                index += this.content[i].length - 1;
            }
            index += (column - 1);

            return index;
        },
        /**
         * @func
         * @desc 当前位置是否正确
         * @param {number} row 行数
         * @param {number} column 列数
         * @returns {boolean} 正确时返回值为true
         */
        isCurrentCorrect(row, column) {
            let currentIndex;
            if (column) {
                //传入两个参数
                currentIndex = this.getCurrentIndex(row, column);
            }
            else {
                //只传入一个index
                currentIndex = row;
            }

            return this.contentForUser[currentIndex] === this.contentArray[currentIndex];
        },
        /**
         * @func
         * @desc 响应点击事件
         * @param {Event} e 事件
         * @param {number} row 行数
         * @param {number} column 列数
         */
        async handlePoemWordClicked(e, row, column) {

            if (this.isCurrentCorrect(row, column)) {
                //正确的位置不处理点击事件
                return;
            }
            else {
                let clickedColor = 'black';
                let unClickedColor = 'transparent';

                let target = e.target; //可能是div里的span 也可能是div
                if (target.tagName === 'DIV') {
                    //统一为span
                    target = target.lastChild;
                }

                if (this.isOneWord) {
                    //此前只点击了一个字，这次点击了第二个字
                    let thisClicked = target;
                    thisClicked.style.backgroundColor = clickedColor;
                    
                    if (thisClicked !== this.lastClicked) {
                        //点击不同的字，进行交换
                        //使用offsetLeft和offsetTop来计算

                        //设置z-index以展示动画
                        thisClicked.style.zIndex = "5";
                        this.lastClicked.style.zIndex = "5";
                        
                        //数据收集
                        let lastOffsetX = this.lastClicked.getAttribute('_lastOffsetX');
                        let lastOffsetY = this.lastClicked.getAttribute('_lastOffsetY');
                        let thisOffset = this.getOffsetToBody(target);
                        let thisOffsetX = thisOffset.x;
                        let thisOffsetY = thisOffset.y;

                        //偏移量
                        let deltaX = thisOffsetX - lastOffsetX;
                        let deltaY = thisOffsetY - lastOffsetY;

                        //移动动画
                        await this.switchAnimation(thisClicked, this.lastClicked, deltaX, deltaY);

                        //真正的交换
                        let thisIndex = this.getCurrentIndex(row, column);
                        let lastIndex = this.lastClicked.getAttribute("_lastIndex");

                        let tempValue = this.contentForUser[thisIndex];
                        await this.$set(this.contentForUser, thisIndex, this.contentForUser[lastIndex]);
                        await this.$set(this.contentForUser, lastIndex, tempValue);

                        if (this.isCurrentCorrect(thisIndex)) {
                            await this.$set(this.dynamicClassNames, thisIndex, {...this.correctClassName});
                        }
                        else {
                            await this.$set(this.dynamicClassNames, thisIndex, {...this.incorrectClassName});
                        }
                        if (this.isCurrentCorrect(lastIndex)) {
                            await this.$set(this.dynamicClassNames, lastIndex, {...this.correctClassName});
                        }
                        else {
                            await this.$set(this.dynamicClassNames, lastIndex, {...this.incorrectClassName});
                        }

                        //交换完成后，修改z-index
                        thisClicked.style.zIndex = "1";
                        thisClicked.style.left = thisClicked.style.top = "5px";
                        
                        this.lastClicked.style.zIndex = "1";
                        this.lastClicked.style.left = this.lastClicked.style.top = "5px";

                        //检查是否正确
                        this.checkState();
                    }

                    //第二次点击后续处理
                    this.isOneWord = false;
                    this.lastClicked.style.backgroundColor = unClickedColor;
                    this.lastClicked = {};
                    thisClicked.style.backgroundColor = unClickedColor;
                }
                else {
                    //选中第一个字
                    this.isOneWord = true;
                    this.lastClicked = target; 
                    this.lastClicked.style.backgroundColor = clickedColor;

                    let lastOffset = this.getOffsetToBody(target);
                    let lastIndex = this.getCurrentIndex(row, column);

                    //缓存要用的数据
                    this.lastClicked.setAttribute("_lastOffsetX", lastOffset.x);
                    this.lastClicked.setAttribute("_lastOffsetY", lastOffset.y);
                    this.lastClicked.setAttribute("_lastIndex", lastIndex);
                }
            }
        },
        /**
         * @func
         * @desc 获取当前到body的offset
         * @param {object} element 元素
         * @return {object} 返回offset对象
         */
        getOffsetToBody(element) {
            let offsetObj = {
                x: 0,
                y: 0
            };
            
            while (element) {
                //console.log(element.offsetLeft);
                offsetObj.x += element.offsetLeft;
                offsetObj.y += element.offsetTop;
                element = element.offsetParent;
            }

            //得到相对坐标
            offsetObj.x -= document.body.scrollLeft;
            offsetObj.y -= document.body.scrollTop;

            return offsetObj;
        },
        /**
         * @func
         * @desc 执行交换两个字的动画
         * @param {object} e1 元素1（第二次点击）
         * @param {object} e2 元素2 （第一次点击）
         * @param {number} deltaX x偏移量
         * @param {number} deltaY y偏移量
         */
        async switchAnimation(e1, e2, deltaX, deltaY) {
            let stepX = deltaX / 10;
            let stepY = deltaY / 10;
            for (let i = 1; i <= 10; i ++) {
                e1.style.left = 5 - (stepX * i) + "px";
                e1.style.top = 5 - (stepY * i) + "px";

                e2.style.left = 5 + (stepX * i) + "px";
                e2.style.top = 5 + (stepY * i) + "px";

                //延时
                await new Promise((resolve) => {
                    setTimeout(resolve, 20);
                });
            }

            e1.style.left = 5 - deltaX + "px";
            e1.style.top = 5 - deltaY + "px";

            e2.style.left = 5 + deltaX + "px";
            e2.style.top = 5 + deltaY + "px";
        },
        /**
         * @func
         * @desc 检查是否正确
         */
        checkState() {
            for (let i = 0; i < this.dynamicClassNames.length; i ++) {
                if (this.dynamicClassNames[i].incorrect) {
                    //存在错误，直接返回
                    return;
                }
            }

            //全部正确，游戏结束
            //显示答案
            this.isAnsShown = true;
        },
        /**
         * @func
         * @desc 初始化
         */
        init() {
            //初始化contentForUser
            this.contentForUser = [...this.randomContentArray];

            //清空dynamicClassName
            if (this.dynamicClassNames.length > 0) {
                this.dynamicClassNames = [];
            }
            //初始化dynamicClassNames
            for (let i = 0; i < this.contentArray.length; i ++) {
                if (this.contentForUser[i] === this.contentArray[i]) {
                    this.dynamicClassNames.push({...this.correctClassName});
                }
                else {
                    this.dynamicClassNames.push({...this.incorrectClassName});
                }
            }
        },
        /**
         * @func
         * @desc 重新开始
         */ 
        handleRestartGame() {
            //更改poemData的引用以触发computed
            //并没有改变poemData的内容
            this.poemData = {...this.poemData};

            //调用init函数，更新contentForUser等非computed但依赖于computed的数据
            this.init();

            //设置界面
            this.isAnsShown = false;

            //播放动画
            this.$refs.gameContainer.className = 'game-container';
            setTimeout(() => {
                this.$refs.gameContainer.className = 'game-container leftfadein';
            }, 1);
            
        },
        /**
         * @func
         * @desc 处理“继续”按钮点击事件
         */ 
        handleContinueClicked() {
            //更新数据
            this.getPoemData();

            //切换界面
            this.isAnsShown = false;
        },
    },
    computed: {
        //诗的具体内容
        content() {
            let content = this.poemData?.origin?.content;

            if (!content) {
                //没有数据就返回空数组
                return [];
            }
            else {
                //实际使用的内容
                let contentInUse = [];

                for (let i = 0; i < content.length; i ++) {
                    let currentSentence = content[i];
                    let tempSentence = '';

                    for (let j = 0; j < currentSentence.length; j ++) {
                        let currentWord = currentSentence[j];
                        tempSentence += currentWord;

                        if (this.punctuations.indexOf(currentWord) >= 0) {
                            //是标点符号，一句结束
                            contentInUse.push(tempSentence);
                            tempSentence = '';
                        }
                    }
                }

                if (contentInUse.length > this.level) {
                    //最多8组
                    contentInUse.splice(this.level);
                }
                return contentInUse;
            }
        },
        //content的内容转为数组(去除标点)
        contentArray() {
            if (this.content.length === 0) {
                //没有数据就返回空数组
                return [];
            }
            else {
                //将数据中的每一个字当做数组元素
                let contentArr = [];

                for (let i = 0; i < this.content.length; i ++) {
                    for (let j = 0; j < this.content[i].length; j ++) {
                        if (this.punctuations.indexOf(this.content[i][j]) >= 0) {
                            continue;
                        }
                        else {
                            contentArr.push(this.content[i][j]);
                        }
                    }
                }
                return contentArr;
            }
        },
        //随机打乱contentArray
        randomContentArray: {
            get() {
                if (this.contentArray.length === 0) {
                    return [];
                }
                else {
                    //打乱后的数组
                    let randomContentArr = [...this.contentArray];

                    //至少保证40%的字在正确的位置
                    let correctNum = Math.floor(this.contentArray.length * 0.4);

                    //随机选取正确的index
                    let correctIndexes = [];
                    for (let i = 0; i < correctNum; ) {
                        let tempIndex = Math.floor(Math.random() * this.contentArray.length);
                        if (correctIndexes.indexOf(tempIndex) < 0) {
                            //没有重复
                            correctIndexes.push(tempIndex);
                            randomContentArr[tempIndex] = this.contentArray[tempIndex];                      
                            i ++;
                        }
                    }

                    //错误的位置
                    let incorrectIndexes = [];
                    for (let i = 0; i < this.contentArray.length; i ++) {
                        if (correctIndexes.indexOf(i) < 0) {
                            incorrectIndexes.push(i);
                        }
                    }

                    //打乱错误的位置
                    let randomIncorrectIndexes = [...incorrectIndexes];
                    for (let i = 0; i < randomIncorrectIndexes.length; i ++) {
                        let tempIndex = Math.floor(Math.random() * randomIncorrectIndexes.length)
                        let tempValue = randomIncorrectIndexes[tempIndex];
                        randomIncorrectIndexes[tempIndex] = randomIncorrectIndexes[i];
                        randomIncorrectIndexes[i] = tempValue;
                    }
                    
                    //赋值给randomContentArr
                    for (let i = 0; i < randomIncorrectIndexes.length; i ++) {
                        randomContentArr[randomIncorrectIndexes[i]] = this.contentArray[incorrectIndexes[i]];
                    }

                    return randomContentArr;
                }
            },
            set({index1, index2}) {
                console.log(index1, index2);
            }
        },
        //提示信息
        tipsMsg() {
            let origin = this.poemData?.origin;
            if (!origin) {
                return '';
            }
            else {
                return `${origin.title}\n【${origin.dynasty}】 ${origin.author} `;
            }
        },
        //返回数据origin
        origin() {
            return this.poemData?.origin;
        }
    }
}
</script>

<style lang="scss" scoped>
.poem {
    background-color: #000;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-image: url('../assets/gamebg.jpg');

    .start-page {
        width: 100%;
        height: 100%;
        color: #000;
        padding: 3%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;

        .title {
            width: 100%;
            margin-bottom: 20px;
            font-size: 30px;
            position: relative;

            h1 {
                animation: topjump 1s;
            }
        }

        .start-button {
            width: 100%;
            button {
                font-size: 20px;
                padding: 5px;
                background: linear-gradient(135deg,#56c8ff,#6f99fc) no-repeat;
                border-radius: 15px;
                opacity: 0.8;
                transition: all 0.3s;
                animation: leftfadein 1s;
                transform: rotateZ(7deg);
            }
            button:hover {
                opacity: 1;
                transform: scale(1.1);
            }
        }
    }

    //宫格寻诗
    .grid-poem {
        width: 100%;
        height: 100%;
        color: #000;
        padding: 3%;
        position: relative;

        .control-unit {
            width: 100%;
            height: 20%;

            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: nowrap;
            position: relative;

            .control-item {
                width:25%;
                margin: 0 5px;
                background-color: rgb(232, 250, 133);
                border-radius: 10px;
            }
            .control-item:hover {
                background-color: rgb(241, 55, 22);
                transform: scale(1.1);
                font-weight: 600;
            }

            .show-info {
                position: absolute;
                bottom: 10px;
                background-color: #a2e1d46e;
                width: 100%;
                border-radius: 5px;
            }
            // transition部分
            .fade-enter-active, .fade-leave-active {
                transition: all .5s;
            }
            .fade-enter, .fade-leave-to {
                bottom: 0px;
                opacity: 0;
            }
        }

        .game-container {
            width: 100%;
            //height: 80%;

            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-wrap: wrap;

            .poem-sentence {
                width: 100%;
                //height: 12.5%;

                display: flex;
                justify-content: center;
                align-items: center;

                .poem-word {
                    width: 40px;
                    height: 40px;
                    background-color: rgb(165, 167, 101);
                    border-radius: 5px;
                    margin: 2px;
                    font-size: 20px;

                    //配合动画的绝对定位
                    position: relative;

                    display: flex;
                    justify-content: center;
                    align-items: center;

                    span {
                        width: 30px;
                        height: 30px;
                        position: absolute;
                        left: 5px;
                        top: 5px;
                    }
                }

                .selected {
                    border: 1px solid red;
                }

                .correct {
                    color: black;
                }
                .incorrect {
                    color: blue;
                    //border: 1px blue solid;
                }
            }

            
        }
        .leftfadein {
            animation: leftfadein .5s;
        }

        .rules {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;

            //height: 20%;

            .rule-desc {
                p {
                    background-color: #a2e1d46e;
                    width: 100%;
                    border-radius: 5px;
                    color: red;
                }
            }
            // transition部分
            .fade-rule-enter-active, .fade-rule-leave-active {
                transition: all 1s;
            }
            .fade-rule-enter, .fade-rule-leave-to {
                opacity: 0;
                color: blue;
            }

            .rule-controller {
                span {
                    background-color: rgba(233, 223, 223, 0.575);
                    padding: 5px;
                    border-radius: 5px;
                }
                span:hover {
                    background-color: rgb(233, 223, 223);
                }
            }
        }

        .answer {
            position: absolute;
            background-image: url('../assets/gamebg.jpg');
            top: 0;
            left: 0;
            padding: 5%;
            width: 100%;
            height: 100%;
            z-index: 5;

            .ans-detail {            
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;

                .ans-title {
                    width: 100%;
                    height: 10%;
                    padding: 10px;
                    font-size: 15px;
                    font-weight: 600;
                }

                .ans-author {
                    width: 100%;
                    height: 10%;
                    padding-bottom: 10px;
                }

                .ans-content {
                    //height: 80%;
                    max-height: 300px;
                    overflow: scroll;
                    /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
                    -ms-overflow-style:none;
                    /*火狐下隐藏滚动条*/
                    scrollbar-width: none;

                    background-color: rgba(255, 255, 255, 0.445);

                    padding: 5px;
                }
                .ans-content::-webkit-scrollbar {
                    display: none;
                }
            }

            .ans-control {
                padding: 10%;
                height: 20%;
                width: 100%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .control-item {
                    width:25%;
                    margin: 0 5px;
                    background-color: rgb(232, 250, 133);
                    border-radius: 10px;
                }
                .control-item:hover {
                    background-color: rgb(241, 55, 22);
                    transform: scale(1.1);
                    font-weight: 600;
                }
            }
        }

        // transition部分:answer
        .answer-enter-active, .answer-leave-active {
            transition: all 1s;
        }
        .answer-enter, .answer-leave-to {
            top: -300px;
            opacity: 0;
            color: blue;
        }
    }
}

//动画
@keyframes topjump {
    0% {
        opacity: 0;
        transform: translate3d(0, -500px, 0);
    }
    40% {
        transform: translate3d(-10px, 20px, 0);
    }
    75% {
        transform: translate3d(5px, -10px, 0);
    }
    90% {
        transform: translate3d(0, 5px, 0);
        opacity: 1;
    }
    100% {
        transform: none;
    }
}

@keyframes fadein {
    0% {
        opacity: 0;
    }
    100% {
        opacity: .8;
    }
}

@keyframes leftfadein {
    0% {
        opacity: 0;
        transform: translate3d(-500px, 0, 0);
    }
    90% {
        opacity: 1;
    }
    100% {
        transform: none;
    }
}


</style>