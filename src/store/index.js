import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
        isPoweroffConfirmed: false,
        isPoweredOff: false,
        isLocked: false,
        isUnlockRequested:false,
        isBlackScreen:false,
        //记录页面调用栈
        pageStack: [],
        //pictures
        pictures: []
    },
    mutations,
    getters: {
        isPoweroffConfirmed: state=>state.isPoweroffConfirmed,
        isPoweredOff: state=>state.isPoweredOff,
        isLocked: state=>state.isLocked,
        isUnlockRequested: state=>state.isUnlockRequested,
        isBlackScreen: state=>state.isBlackScreen,
        pageStack: state=>state.pageStack,
        pictures: state=>state.pictures
    }
})
