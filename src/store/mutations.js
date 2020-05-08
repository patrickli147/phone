import mutationTypes from './mutation-types';

const mutations = {
    [mutationTypes.POWER_OFF_CONFRIMED_MUTATION] (state, load) {
        //power off command is comfirmed
        state.isPoweroffConfirmed = load;
    },
    [mutationTypes.POWER_OFF_STATE] (state, load) {
        state.isPoweredOff = load;
        //console.log("OWER_OFF_STATE set to " + load);
    },
    [mutationTypes.LOCK_STATE] (state, load) {
        state.isLocked = load;
    },
    [mutationTypes.SET_IS_UNLOCK_REQUESTED] (state, load) {
        state.isUnlockRequested = load;
    },
    [mutationTypes.SET_IS_BLACK_SCREEN] (state, load) {
        state.isBlackScreen = load;
    },
    [mutationTypes.UPDATE_PAGESTACK] (state, newPageStack) {
        state.pageStack = newPageStack;
    },
    [mutationTypes.UPDATE_PICTURES] (state, newPictures) {
        state.pictures = newPictures;
    }
}

export default mutations;