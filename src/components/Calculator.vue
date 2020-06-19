<template>
    <div class="calculator">
        <!-- topbar start     -->
        <Topbar :isBlack="(!'')"></Topbar>
        <!-- topbar end -->

        <!-- calculator-wrap start    -->
        <div class="calculator-wrap">
            <div class="output-wrap">
                <span class="expression-content">{{expresssion}}</span>
                <span class="output-content">{{output}}</span>
            </div>
            <div class="buttons-wrap">
                <div class="button-item"
                    v-for="(item, index) in buttons"
                    :key="item"
                    @click="handleButtonClicked(index)"
                >
                    <div v-if="index <= 2" class="item gray">{{item}}</div>
                    <div v-else-if="index % 4 === 3" class="item orange">{{item}}</div>
                    <div v-else class="item black">{{item}}</div>
                </div>
            </div>
        </div>
        <!-- calculator-wrap end -->
    </div>
</template>

<script>
import Topbar from '@/components/Topbar';
import * as math from 'mathjs';

export default {
    mounted() {
        
    },
    data() {
        return {
            //the output of calculator
            output: '0',
            //values of buttons
            buttons: ['C', '+/-', '%', '÷', '7', '8', '9', 'x', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '←','='],
            //expression of user input
            expresssion: '',
            //max length of output
            maxLength: 8,
            //是否需要清除之前的output
            isClearNeeded: false,
        }
    },
    methods: {
        //处理按钮事件
        handleButtonClicked(index) {
            let buttonClicked = this.buttons[index];
            //处理C按键
            if (buttonClicked === 'C') {
                this.output = '0';
                this.expresssion = '';
                return;
            }

            //处理+/-
            if (buttonClicked === '+/-') {
                if (this.output.indexOf("-") >= 0) {
                    this.output = this.output.substring(1);
                }
                else {
                    this.output = '-' + this.output;
                }
                this.expresssion = this.output;
                return;
            }

            //处理数字
            if (buttonClicked >= '0' && buttonClicked <= '9') {
                if (this.output === '0') {
                    this.output = buttonClicked;
                }   
                else if (this.output === '-0') {
                    this.output = '-' + buttonClicked;
                      
                }
                else {
                    if (this.isClearNeeded) {
                        //清理之前的output
                        this.output = '';
                        this.isClearNeeded = false;
                    }
                    this.output += buttonClicked;
                }
            }

            //处理+ - x ÷
            if (this.hasOperator(buttonClicked)) {
                if (!this.hasOperator(this.expresssion)) {
                    //表达式里还不包含operator
                    this.expresssion = this.output + buttonClicked;

                    //之前的output需要清除
                    this.isClearNeeded = true;
                }
                else if (this.hasOperator(this.expresssion[this.expresssion.length - 1])) {
                    //表达式以operator结尾
                    if (this.isClearNeeded) {
                        //需要清理output的情况:按下operator后还没有输入数字。仅需更换operator即可
                        this.expresssion = this.expresssion.substr(0, this.expresssion.length - 1);
                        this.expresssion += buttonClicked;
                    }
                    else {
                        //不需要清理output
                        this.expresssion += this.output;

                        //计算output
                        this.output = math.evaluate(this.format(this.expresssion));

                        this.expresssion += buttonClicked;
                        this.isClearNeeded = true;
                    }
                }
            }

            //处理等于
            if (buttonClicked === '=') {
                if (!this.hasOperator(this.expresssion)) {
                    //表达式里还不包含operator
                    return;
                }
                else {
                    this.expresssion += this.output;
                    this.output = math.evaluate(this.format(this.expresssion));
                    //计算结束
                    this.expresssion = '';
                    this.isClearNeeded = true;
                }
            }

            //处理小数点
            if (buttonClicked === '.') {
                if (this.isClearNeeded) {
                    this.output = '.';
                    this.isClearNeeded = false;
                }
                else {
                    if (this.output.indexOf('.') >= 0) {
                        return;
                    }
                    else {
                        this.output += buttonClicked;
                    }
                }
            }

            //处理backspace
            if (buttonClicked === '←') {
                if (this.isClearNeeded) {
                    return;
                }
                else {
                    if (this.output.length >= 2) {
                        this.output = this.output.substring(0, this.output.length - 1);
                    }
                    else if(this.output.length === 1) {
                        this.output = '0';
                    }
                    else {
                        return;
                    }
                }
            }

            //处理%（不是求余数操作）
            if (buttonClicked === '%') {
                this.output /= 100;
            }

        },
        //字符串是否包含+ - x ÷
        hasOperator(s) {
            if (s.indexOf('+') >= 0) {
                return true;
            }
            if (s.indexOf('-') >= 0) {
                return true;
            }
            if (s.indexOf('x') >= 0) {
                return true;
            }
            if (s.indexOf('÷') >= 0) {
                return true;
            }

            return false;
        },
        //格式化表达式
        format(s) {
            let exp = s.replace('x', '*').replace('÷', '/');
            return exp;
        }
    },
    components: {
        Topbar
    }
}
</script>

<style lang="scss" scoped>
.calculator {
    width: 100%;
    height: 100%;
    background-color: #000;

    .calculator-wrap {
        width: 100%;
        height: 95%;

        .output-wrap {
            width: 100%;
            height: 20%;
            font-size: 40px;
            font-weight: 500;
            text-align: right;
            color: #fff;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            flex-wrap: wrap;
            .output-content {
                width: 100%;
                padding-right: 20px;
            }
            .expression-content {
                width: 100%;
                font-size: 20px;
                padding-right: 20px;
                opacity: 0.8;
            }
        }

        .buttons-wrap {
            width: 100%;
            height: 80%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            transition: all 0.2s;

            .button-item {
                width: 25%;
                color: white;
                
                display: flex;
                justify-content: center;
                align-items: center;

                .item {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;

                }

                .gray {
                    background-color: gray;
                    color: black;
                }
                .orange {
                    background-color: orange;
                }
                .black {
                    background-color: rgb(24, 23, 23);
                }
            }
            .button-item:hover {
                transform: scale(1.1);
            }
        }
    }
}
</style>