<template>
  <div class="locked">
      <topbar :isBlack="true" :topBarStyle="topBarStyle"></topbar>
      <div class="unlock" v-if="!isBlackScreen">
          <div class="unlock-wallpaper" v-if="!isUnlockRequested">
              <div class="date-wrap">
                <div class="hour">
                    {{hour}}:{{minute}}
                </div>
                <div class="month">
                    {{month}}月{{day}}日 星期{{weekday}}
                </div>
                <div class="luliar">
                    {{lunarMsg}}
                </div>
            </div>

            <div class="toast">
                按下主屏幕按钮以解锁
            </div>
          </div>

          <div class="unlock-pincode" v-else>
              <div :class="isPincodeWrong ? 'toast shaking' : 'toast'">
                  {{toastmgs}}
              </div>
              <div :class="isPincodeWrong ? 'dots shaking' : 'dots'">
                  <div
                    v-for="item in dots"
                    :key="item"
                    :class="numOfInput < item ? 'dot-item' : 'dot-item inputed'"
                  >

                  </div>
              </div>
              <div class="pincode-btn">
                  <div class="pincode-item"
                    v-for="item in pincodebtn"
                    :key="item"
                    @click="handleInputPincode(item)"
                  >
                    <div class="pincode">
                        <p>{{item}}</p>
                    </div>
                  </div>
              </div>
              <div class="bottom-btn">
                  <div class="emergency">
                      紧急情况
                  </div>
                  <div class="forlayout"></div>
                  <div class="cancel" @click="handleCancelUnlock">
                      取消
                  </div>
              </div>
          </div>
      </div>
      <div class="black-screen" v-else>

      </div>
  </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'
import Topbar from '@/components/Topbar'
export default {
  name: 'Locked',
  data() {
      return {
          //current date
          date: null,
          //update time interval
          updateTimeInterval: null,
          //weekday data
          weekdayData: [
              '一',
              '二',
              '三',
              '四',
              '五',
              '六',
              '日'
          ],
          //toast message for user
          toastmgs: '请输入密码(000000)',
          //dots of pincode
          dots: [1, 2, 3, 4, 5, 6],
          //pincode buttons
          pincodebtn:[1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
          //pincode inputed
          pincodeInput: '',
          //true when pincode is wrong
          isPincodeWrong: false,
          //请求url
          url: 'https://api.djapi.cn/wannianli/get?token=09ea075120bb237576097903e5d6b05d',
          //农历msg
          lunarMsg: ''
      }
  },
  beforeDestroy() {
      clearInterval(this.updateTimeInterval);
      this.updateTimeInterval = null;
  },
  created() {
     this.date = new Date();
  },
  mounted() {
    //set LOCK_STATE to true: lock the phone
    this.setLocked(true);

    this.updateTimeInterval = this.updateTime();

    try {
        //请求农历数据
        this.getLunarData();
    } catch(e) {
        console.log(e);
    }
  },
  methods: {
    ...mapMutations({
      setLocked: 'LOCK_STATE',
      setIsUnlockRequested: 'SET_IS_UNLOCK_REQUESTED',
      setIsBlackScreen:'SET_IS_BLACK_SCREEN',
      updatePageStack: 'UPDATE_PAGESTACK'
    }),
    //update time
    updateTime() {
        return setInterval(() => {
            this.date = new Date();
        }, 500);
    },
    //handleInputPincode
    handleInputPincode(inputNum) {
        this.pincodeInput += inputNum;
        if (this.numOfInput === 6) {
            setTimeout(() => {
                this.checkPincode();
            }, 100);
        }
    },
    //check pincode
    checkPincode() {

        if (this.pincodeInput === '000000') {
            //unlock when pincode is correct
            this.setLocked(false);

            //set isUnlockRequested to false
            this.setIsUnlockRequested(false);

            let pageStack = this.pageStack;
            //pop当前页面
            pageStack.pop();
            //获取目标页面
            let destination;
            if (pageStack.length === 0) {
                //默认解锁后导航到desktop
                destination = '/phone/desktop';
            }
            else {
                destination = pageStack.pop();
            }
            this.updatePageStack(pageStack);
            this.$router.push(destination);

            //clear pincode
            this.pincodeInput = '';
        }
        else {

            this.isPincodeWrong = true;
            setTimeout(() => {
                this.isPincodeWrong = false;
            }, 600);
            //clear pincode
            this.pincodeInput = '';
        }
    },
    //handleCancelUnlock
    handleCancelUnlock() {
        this.pincodeInput = '';
        this.setIsUnlockRequested(false);
    },
    //请求农历数据
    async getLunarData() {
        let res = await this.axios.get(this.url);

        if (res.data) {
            //处理接口返回的错误
            if (res.data.ErrorReason !== "no") {
                console.log(res.data.ErrorReason);
                this.lunarData = null;
            }
            else {
                let resMsg = res.data.Result.nongli;
                this.lunarMsg = resMsg.substring(0, resMsg.indexOf('('));
            }
        }
    }
  },
  computed: {
      ...mapGetters([
          'isLocked',
          'isUnlockRequested',
          'isBlackScreen',
          'pageStack'
      ]),
      hour() {
          return this.date.getHours() < 10 ? '0' + this.date.getHours() : this.date.getHours();
      },
      minute() {
          return this.date.getMinutes() < 10 ? '0' + this.date.getMinutes() : this.date.getMinutes();
      },
      month() {
          return this.date.getMonth() + 1;
      },
      day() {
          return this.date.getDate();
      },
      weekday() {
          return this.weekdayData[this.date.getDay() - 1];
      },
      numOfInput() {
          return this.pincodeInput.length;
      },
      topBarStyle() {
        return this.isUnlockRequested
          ? {background: 'rgba(11, 6, 22, 0.7)'}
          : {};
      }
  },
  components: {
      Topbar,
  },
  watch: {
      isBlackScreen() {
          if (this.isBlackScreen) {
              //黑屏的时候取消解锁请求
              this.setIsUnlockRequested(false);
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.locked {
  height: 100%;
  width: 100%;
  color: white;
  .black-screen {
      background-color: #000;
      height: 95%;
      width: 100%;
  }
  .unlock {
      height: 95%;
      width: 100%;
      position: relative;

      .unlock-wallpaper {
          .date-wrap {
            padding-top: 10%;
            .hour {
                font-size: 55px;
            }
            .month {
                font-size: 14px;
            }
            .luliar {
                font-size: 12px;
                padding: 2%;
            }
        }

        .toast {
            position: absolute;
            bottom: 20px;
            width: 100%;
            margin: auto;
        }
      }

      .unlock-pincode {
          height: 100%;
          background-color: rgba(11, 6, 22, 0.7);
          padding-top: 15%;
          .toast {
              font-size: 20px;
          }
          .dots {
              padding-top: 1%;
              padding-bottom: 9%;

              display: flex;
              justify-content: center;
              align-items: center;
              .dot-item {
                  margin: 2px;
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  border: 1px white solid;
              }
              .inputed {
                  background-color: #fff;
              }
          }
          .shaking {
              animation: shake 0.2s infinite;
          }
          @keyframes shake {
              0% {
                  margin-left: 8px;
                  //margin-top: 5px;
              }
              50% {
                  margin-left: -5px;
                  //margin-top: -5px;
              }
              100% {
                  margin-left: 0px;
                  //margin-top: 0px;
              }
          }
          .pincode-btn {
              display: flex;
              justify-content: center;
              align-items: center;
              flex-wrap: wrap;
              .pincode-item {
                  width: 30%;
                  padding: 1%;
                  .pincode {
                    margin: auto;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background-color: rgb(123 119 119 / 55%);

                    display: flex;
                    justify-content: center;
                    align-items: center;
                    p {
                        font-size: 25px;
                        font-weight: 500;
                    }
                  }
                  .pincode:hover {
                      transform: translate(1.05);
                      background-color: rgb(123 119 119 / 75%);
                  }
              }

          }
          .bottom-btn {
              display: flex;
              //padding: 3%;
              text-align: center;
              .emergency {
                  width: 33.33%;
              }
              .forlayout {
                  width: 33.33%;
              }
              .cancel {
                  width: 33.33%;
              }
          }
      }

  }
}
</style>
