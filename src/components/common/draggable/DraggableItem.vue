<template>
    <div
        @dragstart="onDragStart"
        @drag="onDrag"
        @dragend="onDragEnd"
        draggable="true"
        :class="[{'dragging': isDragging}]"
        :style="dragItemStyle"
    >
        <slot></slot>
    </div>
</template>

<script>
import _throttle from '../../../utils/throttle';

export default {
    name: 'draggable-item',
    props: {
        // config of the item being dragged
        config: Object
    },
    data() {
        return {
            //is user dragging item
            isDragging: false,
            // is drag started
            isDragStarted: false,
            // offset x: px
            offsetX: 0,
            // offset y: px
            offsetY: 0,
            // start x position
            startX: 0,
            // start y position
            startY: 0
        }
    },
    methods: {
        onDragStart(e) {
            console.log('drag start');
            // this.isDragging = true;
            this.isDragStarted = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
        },
        onDrag: _throttle(function(e) {
            if (!this.isDragStarted) {
                // this will be called after the dragend event due to _throttle
                return;
            }

            if (!this.isDragging) {
                // set true when onDrag fires, not dragStart
                this.isDragging = true;
            }
            // console.log(e);
            if (e.clientX === 0 && e.clientY == 0) {
                // before drag end
                this.setOffset(0, 0);
                return;
            }
            this.setOffset(e.clientX - this.startX, e.clientY - this.startY);
        }, 100),
        onDragEnd(e) {
            e.preventDefault();
            console.log('drag end');
            // console.log(e);
            this.isDragging = false;
            this.isDragStarted = false;

            this.setOffset(0, 0);
        },
        setOffset(x, y) {
            this.offsetX = x;
            this.offsetY = y;
        }
    },
    computed: {
        dragItemStyle() {
            return {
                transform: `translate(${this.offsetX}px, ${this.offsetY}px)`
            }
        },
        xSteps() {
            return Math.floor(this.offsetX / this.config.width);
        },
        ySteps() {
            return Math.floor(this.offsetY / this.config.height);
        },
        newIndex() {
            const {columns, maxIndex} = this.config;
            const delta = this.xSteps + this.ySteps * columns;
            let newIndex = this.config.index + delta;
            if (newIndex < 0) {
                newIndex = 0;
            }
            if (newIndex > maxIndex) {
                newIndex = maxIndex;
            }
            return newIndex;
        }
    },
    mounted() {
        // console.log(this.$props);
    },
    updated() {
        // console.log('config is');
        // console.log(this.config);
    },
    watch: {
        newIndex(newValue, oldValue) {
            if (newValue === oldValue) {
                console.log('tm yiyandeya');
                return;
            }
            console.log('drag item changed', newValue);
            this.$emit('indexchange', {newIndex: newValue, index: this.config.index});
        }
    }
}
</script>

<style lang="scss" scoped>
.dragging {
    //transform: translateX(-10px) !important;
    // opacity: 0;
}

</style>
