<template>
    <div
        class="container"
        @drop="onDrop"
        @dragenter="onDragEnter"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
    >
        <slot></slot>
    </div>
</template>

<script>
// import DraggableItem from './DraggableItem.vue';

export default {
    name: 'drop-zone',
    methods: {
        onDrop(e) {
            // 取消默认拖拽
            e.preventDefault();

            console.log('drop');
        },
        onDragEnter() {
            console.log('drag enter');
        },
        onDragOver(e) {
            // console.log('drag over');
            e.preventDefault();
        },
        onDragLeave() {
            console.log('drag leave');
        }
    },
    components: {

    }
}
</script>

<style>

</style>
