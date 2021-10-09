<template>
    <div
        @dragstart="onDragStart"
        @drag="onDrag"
        @dragend="onDragEnd"
        @drop="onDrop(e)"
        @dragenter="onDragEnter"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        draggable="true"
    >
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'draggable-item',
    methods: {
        onDragStart() {
            console.log('drag start');
        },
        onDrag() {

        },
        onDragEnd() {
            console.log('drag end');
        },
        onDrop(e) {
            e.stopPropagation();
        },
        onDragEnter(e) {
            e.stopPropagation();
        },
        onDragOver(e) {
            e.stopPropagation();
        },
        onDragLeave(e) {
            e.stopPropagation();
        }
    }
}
</script>

<style>

</style>
