<template>
   <div class="poem">
        <!-- 首页 开始 -->
        <div class="start-page" v-if="false">
            <div class="title">
                <span>寸心</span>
            </div>
            <div class="start-button">
                <span>开始游戏</span>
            </div>
        </div>
        <!-- 首页 结束 -->

        <!-- 宫格诗词 开始 -->
        <div class="grid-poem">
            <!-- 控制单元 开始 -->
            <div class="control-unit">
                <div class="back">
                    返回
                </div>
                <div class="restart">
                    重玩
                </div>
                <div class="tips-title">
                    标题
                </div>
                <div class="tips-translation">
                    译文
                </div>
                <div class="answer">
                    答案
                </div>
            </div>
            <!-- 控制单元 结束 -->

            <!-- 游戏区域 开始 -->
            <div class="game-container">
                <div class="poem-sentence"
                    v-for="(sentence, index) in content"
                    :key="sentence.id"
                >
                    <div :class="isCurrentCorrect(index, count) ? 'poem-word correct' : 'poem-word incorrect'"
                        v-for="count in (sentence.length - 1)"
                        :key="count.id"
                    >
                        <span>{{randomContentArray[getCurrentIndex(index, count)]}}</span>
                    </div>
                    <div class="punctuation">
                        <span>{{sentence[sentence.length - 1]}}</span>
                    </div>
                </div>
            </div>
            <!-- 游戏区域 结束 -->
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
                    console.log(this.poemData.origin.content);
                    console.log(this.contentArray);
                    console.log(this.randomContentArray);
                    console.log(this.content);
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
            let currentIndex = this.getCurrentIndex(row, column);

            return this.randomContentArray[currentIndex] === this.contentArray[currentIndex];
        }
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

                if (contentInUse.length > 8) {
                    //最多8组
                    contentInUse.splice(8);
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
        randomContentArray() {
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
        }
    }
}
</script>

<style lang="scss" scoped>
.poem {
    background-color: #000;
    width: 100%;
    height: 100%;
    
    //宫格寻诗
    .grid-poem {
        width: 100%;
        height: 100%;

        .control-unit {
            width: 100%;
            height: 20%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: nowrap;

            .back {
                width: 20%;
            }

            .restart {
                width: 20%;
            }

            .tips-title {
                width: 20%;
            }

            .tips-translation {
                width: 20%;
            }

            .answer {
                width: 20%;
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
                justify-content: flex-start;
                align-items: center;

                .poem-word {
                    width: 40px;
                    height: 40px;
                    background-color: rgb(165, 167, 101);
                    border-radius: 5px;
                    margin: 2px;
                    font-size: 20px;

                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .punctuation {
                    
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
    }
}

// test


</style>