<template>
    <div class="calendar">
        <!-- top bar start   -->
        <Topbar :isBlack="(!!'')"></Topbar>
        <!-- top bar end -->

        <!-- calendarwrap start -->
        <div class="calendar-wrap">
            <!-- 月份详细 开始 -->
            <div class="calendar-month" v-if="true">
                <div class="topbar">
                    <div class="yearIcon">
                        <div class="year-content" @click="isYearSelectShown = !isYearSelectShown">{{currentYear}}年</div>

                        <!-- 年份选择 开始 -->
                        <div class="year-select" @scroll="updateYears" v-if="isYearSelectShown">
                            <div class="year-item" v-for="year in years" :key="year.id" @click="handleSelectYear(year)">
                                {{year}}
                            </div>
                        </div>
                        <!-- 年份选择 结束 -->
                    </div>
                </div>

                <div class="weekday-bar">
                    <div class="weekday-content weekend">日</div>
                    <div class="weekday-content">一</div>
                    <div class="weekday-content">二</div>
                    <div class="weekday-content">三</div>
                    <div class="weekday-content">四</div>
                    <div class="weekday-content">五</div>
                    <div class="weekday-content weekend">六</div>
                </div>

                <div class="calendar-content-wrap" @scroll="handleScroll" ref="scrollBar">
                    <!-- 前一个月 开始 -->
                    <div class="month-item">
                        <div class="month" v-for="count in 7" :key="count.id">
                            <span v-if="(offsetsOfWeekday[0] + 1) % 7 === count || (count === 7 && offsetsOfWeekday[0] === 6)">{{lastMonth + 1}}月</span>
                        </div>
                        <div class="offsets" v-for="count in offsetsOfWeekday[0]" :key="count.id">
                            <!-- 用于填充 -->
                        </div>
                        <div class="weekday-content" v-for="day in daysOfEachMonth[lastMonth]" :key="day.id"
                            @mouseenter="showDateDesc($event, offsetsOfWeekday[0], lastMonth, day)"
                            @mouseleave="hideDateDesc"
                        >
                            <span>{{day}}</span>
                            <div class="date-desc" v-show="lastMonth === hoverMonth && day === hoverDay">
                                <div>Mock数据</div>
                                <div>{{getMockData()}}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 前一个月 结束 -->

                    <!-- 中间月份 开始 -->
                    <div class="month-item" >
                        <div class="month" v-for="count in 7" :key="count.id">
                            <span v-if="(offsetsOfWeekday[1] + 1) % 7 === count || (count === 7 && offsetsOfWeekday[1] === 6)">{{currentMonth + 1}}月</span>
                        </div>
                        <div class="offsets" v-for="count in offsetsOfWeekday[1]" :key="count.id">
                            <!-- 用于填充 -->
                        </div>
                        <div :class="isToday(currentMonth, day) ? 'weekday-content today' : 'weekday-content'"
                            v-for="day in daysOfEachMonth[currentMonth]" 
                            :key="day.id"
                            @mouseenter="showDateDesc($event, offsetsOfWeekday[1], currentMonth, day)"
                            @mouseleave="hideDateDesc"
                        >
                            <span>{{day}}</span>
                            <div class="date-desc" v-show="currentMonth === hoverMonth && day === hoverDay">
                                <div>Mock数据</div>
                                <div>{{getMockData()}}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 中间月份 结束 -->

                    <!-- 后一个月 开始 -->
                    <div class="month-item" >
                        <div class="month" v-for="count in 7" :key="count.id">
                            <span v-if="(offsetsOfWeekday[2] + 1) % 7 === count || (count === 7 && offsetsOfWeekday[2] === 6)">{{nextMonth + 1}}月</span>
                        </div>
                        <div class="offsets" v-for="count in offsetsOfWeekday[2]" :key="count.id">
                            <!-- 用于填充 -->
                        </div>
                        <div class="weekday-content" v-for="day in daysOfEachMonth[nextMonth]" :key="day.id"
                            @mouseenter="showDateDesc($event, offsetsOfWeekday[2], nextMonth, day)"
                            @mouseleave="hideDateDesc"
                        >
                            <span>{{day}}</span>
                            <div class="date-desc" v-show="nextMonth === hoverMonth && day === hoverDay">
                                <div>Mock数据</div>
                                <div>{{getMockData()}}</div>
                            </div>
                        </div>
                    </div>
                    <!-- 后一个月 结束 -->
                </div>

                <div class="bottom-bar">
                    <div class="today" @click="handleTodayClicked">
                        今天
                    </div>
                </div>
            </div>
            <!-- 月份详细 结束 -->

            <!-- 具体 开始 -->
            <div class="date-infomation" v-if="false">
                
            </div>
            <!-- 具体 结束 -->
        </div>
        <!-- calendarwrap end -->

    </div>
</template>

<script>
import Topbar from '@/components/Topbar';
import Mock from 'mockjs';

export default {
    mounted() {
        //初始化数据
        this.init();
    },
    data() {
        return {
            //current date user selected
            currentDate: null,
            //today's date
            todayDate: null,
            //年份选择框的数据
            years:[],
            //是否展示年份选择
            isYearSelectShown: false,
            //hover的month
            hoverMonth: -1,
            //hover的day
            hoverDay: -1,
        }
    },
    methods:{
        //return true when the year is leap year
        isLeapYear() {
            let year = this.currentYear;
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                return true;
            }
            else {
                return false;
            }
        },
        //handleScroll event
        handleScroll(e) {
            //console.log(e);
            this.changeCurrentMonth(e);
        },
        //change current month
        changeCurrentMonth(e) {
            let target = e.target;
            if (target.scrollTop >= 500) {
                this.changeToNextMonth();
                //532 - 304.1
                target.scrollTop = 259.9;
                return;
            }

            if (target.scrollTop === 0) {
                this.changeToLastMonth();
                target.scrollTop = 304.1;
                return;
            }

        },
        //change to next month
        changeToNextMonth() {
            if (this.currentMonth === 11) {
                //is Decemeber
                //year ++, set month to 0
                this.currentDate.setFullYear(this.currentDate.getFullYear() + 1);
                this.currentDate.setMonth(0);
            }
            else {
                //month ++
                this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            }

            //强行改变引用，触发computed
            this.currentDate = new Date(this.currentDate);
        },
        //change to last month
        changeToLastMonth() {
            if (this.currentMonth === 0) {
                //is Junurary
                //year --, set month to 11
                this.currentDate.setFullYear(this.currentDate.getFullYear() - 1);
                this.currentDate.setMonth(11);
            }
            else {
                //month --
                this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            }

            //强行改变引用，触发computed
            this.currentDate = new Date(this.currentDate);
        },
        /**
         * @func
         * @desc 判断日期是否是今天
         * @param {number} month - 月份
         * @param {number} date - 日期
         * @returns {boolean}
         */
        isToday(month, date) {
            if (this.currentYear !== this.todayDate.getFullYear() || month !== this.todayDate.getMonth() || date !== this.todayDate.getDate()) {
                //不同年份或不同月份或不同日期，返回false
                return false;
            }
            else {
                return true;
            }
        },
        /**
         * @func
         * @desc 初始化
         */
        init() {
            this.currentDate = new Date();
            this.todayDate = new Date();

            //init scroll bar
            this.$refs.scrollBar.scrollTop = 304.1;

            //init years
            for (let i = 0; i < 10; i ++) {
                this.years.push(this.currentYear + i);
            }
        },
        /**
         * @func
         * @desc 处理“今天”div的点击事件
         */
        handleTodayClicked() {
            this.init();
        },
        /**
         * @func
         * @desc 处理年份选择区域滑动，动态添加年份
         * @param {Event} e - 滑动事件
         */
        updateYears(e) {
            let target = e.target;
            if (target.scrollTop >= (10 * (this.years.length / 10))) {
                //years 最后一个元素
                let last = this.years[this.years.length - 1];
                for (let i = 1; i <= 10; i ++) {
                    if (last + i >= 2100) {
                        return;
                    }
                    this.years.push(last + i);
                }
            }

            if (target.scrollTop <= 10) {
                //years 第一个元素
                let first = this.years[0];
                for (let i = 1; i <= 10; i ++) {
                    if (first - i <= 1899) {
                        return;
                    }
                    this.years.unshift(first - i);
                }
                target.scrollTop += 10;
            }
        },
        /**
         * @func
         * @desc 处理选择年份
         * @param {number} year - 选择的年份
         */
        handleSelectYear(year) {
            //关闭年份选择框
            this.isYearSelectShown = !this.isYearSelectShown;

            //设置年份
            this.currentDate.setFullYear(year);
            this.currentDate = new Date(this.currentDate);

            //如果选择2089年及以上（最高上限）,years特殊处理
            if (year >= 2089) {
                this.years = [2089, 2090, 2091, 2092, 2093, 2094, 2095, 2096, 2097, 2098, 2099];
                return;
            }

            //重新设置years
            this.years = [];
            for (let i = 0; i < 10; i ++) {
                this.years.push(this.currentYear + i);
            }
        },
        /**
         * @func
         * @desc 显示日期详情
         * @param {Event} e - mouseenter事件
         * @param {number} offset - 本月1日星期几
         * @param {number} month - 当前的月份
         * @param {number} day - 当前的日期
         */
        showDateDesc(e, offset, month, day) {
            //计算当前是星期几 0 1 2 3 4 5 6 对应 周日 一 二 三 四 五 六
            let weekday = (offset + day - 1) % 7;         
            
            //按需设置类名（在左边展示还是在右边展示）
            if (weekday < 3) {
                //在右边展示
                e.target.lastChild.className = "date-desc right";
            }
            else {
                //在左边展示
                e.target.lastChild.className = "date-desc left";
            }

            //设置hover的month和day
            this.hoverMonth = month;
            this.hoverDay = day;
        },
        /**
         * @func
         * @desc 重置hoverMonth和hoverDay以隐藏日期详情
         */
        hideDateDesc() {
            this.hoverMonth = -1;
            this.hoverDay = -1;
        },
        /**
         * @func
         * @desc Mock数据
         */
        getMockData() {
            return Mock.Random.ctitle(4);
        }
        
    },
    computed: {
        //num of days of each month
        daysOfEachMonth() {
            if (this.currentYear === '') {
                return [];
            }

            if (this.isLeapYear(this.currentYear)) {
                //is leap year
                return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            }
            else {
                //not leap year
                return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            }
        },
        //current year
        currentYear() {
            if (this.currentDate) {
                return this.currentDate.getFullYear();
            }
            else {
                return '';
            }
        },
        //last year 
        lastYear() {
            if (this.currentYear === '') {
                return '';
            }
            else {
                return this.currentYear - 1;
            }
        },
        //next year 
        nextYear() {
            if (this.currentYear === '') {
                return '';
            }
            else {
                return this.currentYear + 1;
            }
        },
        //current month
        currentMonth() {
            if (this.currentDate) {
                return this.currentDate.getMonth();
            }
            else {
                return '';
            }
        },
        //last month
        lastMonth() {
            if (this.currentMonth === '') {
                return '';
            }
            else if (this.currentMonth === 0) {
                //Junuary 
                return 11;
            }
            else {
                return this.currentMonth - 1;
            }
        },
        //next month 
        nextMonth() {
            if (this.currentMonth === '') {
                return '';
            }
            else if (this.currentMonth === 11) {
                //Decemeber
                return 0;
            }
            else {
                return this.currentMonth + 1;
            }
        },
        //offsets of weekday in each month
        offsetsOfWeekday() {
            if (this.currentDate) {
                let offsets = [];

                //copy of currentDate
                let copyDate = new Date(this.currentDate);
                copyDate.setDate(1);
                
                //本月1日星期几
                offsets[1] = copyDate.getDay();

                //上月1日星期几
                let copyLastMonth = new Date(copyDate);
                if (copyLastMonth.getMonth() === 0) {
                    copyLastMonth.setFullYear(copyLastMonth.getFullYear() - 1);
                    copyLastMonth.setMonth(11);
                }
                else {
                    copyLastMonth.setMonth(copyLastMonth.getMonth() - 1);
                }
                offsets[0] = copyLastMonth.getDay();

                //下月1日星期几
                let copyNextMonth = new Date(copyDate);
                if (copyNextMonth.getMonth() === 11) {
                    copyNextMonth.setFullYear(copyNextMonth.getFullYear() + 1);
                    copyNextMonth.setMonth(0);
                }
                else {
                    copyNextMonth.setMonth(copyNextMonth.getMonth() + 1);
                }
                offsets[2] = copyNextMonth.getDay();

                return offsets;
            }
            else {
                return [];
            }
        }
    },
    components: {
        Topbar
    }
}
</script>

<style lang="scss" scoped>
.calendar {
    width: 100%;
    height: 100%;
    background-color: #fff;
    color: black;

    .calendar-wrap {
        width: 100%;
        height: 95%;

        .calendar-month {
            width: 100%;
            height: 100%;

            .topbar {
                width: 100%;
                height: 6%;

                .yearIcon {
                    width: 30%;

                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-wrap: wrap;

                    .year-content {
                        color: rgb(18,150,219);
                        font-size: 20px;
                        width: 100%;
                    }
                    .year-content:hover {
                        background-color: rgb(18,150,219);
                        color: #fff;
                    }

                    .year-select {
                        width: 100%;
                        height: 200px;
                        overflow: scroll;
                        z-index: 5;
                        background:rgba(34, 34, 34, 0.411);
                        color: #fff;

                        .year-item:hover {
                            background-color: rgb(18,150,219);
                        }
                    }
                }
            }

            .weekday-bar {
                width: 100%;
                height: 4%;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: center;
                align-items: center;

                .weekday-content {
                    width: 14.28%;
                }
                .weekend {
                    opacity: 0.25;
                }
            }

            .calendar-content-wrap {
                overflow: scroll;
                width: 100%;
                height: 85%;
                border-bottom: 1px solid #eee;

                /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
                -ms-overflow-style:none;
                /*火狐下隐藏滚动条*/
                scrollbar-width: none;

                .month-item {
                    width: 100%;
                    height: 80%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex-wrap: wrap;
                    text-align: center;

                    .month {
                        width: 14.28%;
                        font-weight: 600;
                        border: 2px solid red;
                    }

                    .offsets{ 
                        width: 14.28%;
                    }
                    .weekday-content {
                        width: 14.28%;
                        //border-radius: 5px;
                        border-bottom: 1px solid red;
                        transition: all 0.2s;
                        position: relative;

                        .date-desc {
                            position: absolute;
                            top: 0;
                            background-color: #eee;
                            width: 150%;
                            color: black;
                            z-index: 5;
                            border-radius: 5px;
                            font-size: 15px;
                        }
                        .date-desc:hover {
                            background-color: rgb(248, 7, 47);
                            color: #fff;
                        }
                        .right {
                            left: 50px;
                        }
                        .left {
                            right: 50px;
                        }
                    }
                    .weekday-content:hover {
                        background-color: rgb(18, 149, 219);
                        border-radius: 5px;
                        transform: scale(1.2);
                        color: #fff;
                        z-index: 5;
                    }
                    .weekend {
                        opacity: 0.25;
                    }
                    .today {
                        background-color: red;
                        //border-radius: 5px;
                        //transform: scale(1.2);
                    }
                }
                
            }
            .calendar-content-wrap::-webkit-scrollbar {
                display: none;
            }

            .bottom-bar {
                width: 100%;
                height: 5%;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                .today {
                    width: 20%;
                    height: 100%;
                    color: red;
                    transition: all 0.2s;
                }
                .today:hover {
                    background-color: red;
                    border-radius: 5px;
                    color: white;
                    font-weight: 600;
                }
            }
        }
    }
}
</style>