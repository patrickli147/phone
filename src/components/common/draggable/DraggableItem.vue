<template>
    <div
        @dragstart="onDragStart"
        @mousedown="onMousedown"
        @mousemove="onMousemove"
        @mouseup="onMouseup"
        @mouseleave="onMouseleave"
        @click.capture="onItemClick"
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
            startY: 0,
            // is click event
            isClick: false
        }
    },
    methods: {
        onDragStart(e) {
            e.preventDefault();
        },
        onMousedown(e) {
            this.isDragStarted = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.isClick = true;

            this.$emit('itemDragStart');
        },
        onMousemove: _throttle(function(e) {
            if (!this.isDragStarted) {
                // this will be called after the dragend event due to _throttle
                return;
            }

            if (!this.isDragging) {
                // set true when onDrag fires, not dragStart
                this.isDragging = true;
            }

            if (e.clientX === 0 && e.clientY == 0) {
                // before drag end
                this.setOffset(0, 0);
                return;
            }

            const deltaX = e.clientX - this.startX;
            const deltaY = e.clientY - this.startY;

            // minus delta to be a click
            const MINUS_CLICK_DELTA = 2;

            if (this.isClick && (Math.abs(deltaX > MINUS_CLICK_DELTA)
                || Math.abs(deltaY > MINUS_CLICK_DELTA))) {
                this.isClick = false;
            }

            this.setOffset(deltaX, deltaY);
        }, 1),
        onMouseup() {
            this.isDragging = false;
            this.isDragStarted = false;

            this.setOffset(0, 0);
            this.$emit('itemDragEnd');
        },
        onMouseleave() {
            if (!this.isDragging) {
                return;
            }

            this.onMouseup();
        },
        setOffset(x, y) {
            this.offsetX = x;
            this.offsetY = y;
        },
        onItemClick(e) {
            if (!this.isClick) {
                // stop click on capture
                e.stopPropagation();
            }
        }
    },
    computed: {
        dragItemStyle() {
            return {
                transform: `translate(${this.offsetX}px, ${this.offsetY}px)`
            }
        },
        xSteps() {
            const result = this.offsetX / (this.config.width + this.config.columnGap);
            return result > 0 ? Math.floor(result) : Math.ceil(result);
        },
        ySteps() {
            const result = this.offsetY / (this.config.height + this.config.rowGap);
            return result > 0 ? Math.floor(result) : Math.ceil(result);
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
    watch: {
        newIndex(newValue, oldValue) {
            if (!this.isDragStarted || !this.isDragging) {
                // _throttle
                return;
            }
            if (newValue === oldValue) {
                return;
            }

            this.$emit('indexchange', {newIndex: newValue, index: this.config.index});
        }
    }
}
</script>

<style lang="scss" scoped>
.dragging {
    // dragging item should have higher z-index, or a mouseleave event will be triggeed when moving mouse
    // into another item
    z-index: 10;

    // transition is set in DropZone
    transition: none !important;
}
</style>
