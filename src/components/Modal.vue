<template>
    <div class="modal-container">
        <transition name="modal">
            <div class="modal-wrap" v-if="isModalShown">
                <div class="modal-item confirm" @click="emitModalEvent('confirmed')">
                    <p>{{confirmMsg}}</p>
                </div>
                <div class="modal-item cancel" @click="emitModalEvent('canceled')">
                    <p>{{cancelMsg}}</p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    props: {
        confirmMsg: String,
        cancelMsg: String,
        isShown: Boolean
    },
    data() {
        return {
            //true: modal is shown
            isModalShown: this.isShown
        }
    },
    watch: {
        isShown() {
            this.isModalShown = this.isShown;
        }
    },
    methods: {
        //emit event to parent component
        emitModalEvent(eventMsg) {
            this.$emit("modalEvent", {eventMsg});
        }
    }
}
</script>

<style lang="scss" scoped>
.modal-container {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;

    .modal-wrap {
        position: absolute;
        width: 100%;
        left: 0;
        bottom: 0;
        font-size: 20px;
        .modal-item {
            background-color: rgb(234, 240, 248);
            height: 40px;
            border-radius: 10px;
            margin: 2%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .confirm {
            color: red;
        }
        .cancel {
            color: rgb(18,150,219);            
        }
    }

    //过渡动画
    .modal-enter-active, .modal-leave-active {
        transition: all .5s;
    }
    .modal-enter, .modal-leave-to {
        bottom: -20px;
        opacity: 0;
    }
}
</style>