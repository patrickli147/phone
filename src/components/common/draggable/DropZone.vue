<script>
import DraggableItem from './DraggableItem.vue';

export default {
    name: 'drop-zone',
    props: {
        // all items
        data: {
            type: Array,
            default: new Array(0),
            required: true
        },
        // width of each grid-item
        itemWidth: {
            type: Number,
            default: 50,
            required: false
        },
        // height of each grid-item
        itemHeight: {
            type: Number,
            default: 50,
            required: false
        },
    },
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
            // TODO:限制在内部
        },
        onIndexChange(e) {
            console.log('index change');
            console.log(e);
        },
        onClick() {
            console.log('click');
        }
    },
    components: {
        DraggableItem
    },
    render() {
        const itemConfig = {
            width: this.itemWidth,
            height: this.itemHeight
        }

        return (
            <div
                class="container"
                onDrop={() => {console.log('drop');}}
                onDragenter={this.onDragEnter}
                onDragover={this.onDragOver}
                onDragleave={this.onDragLeave}
                onIndexchange={this.onIndexChange}
                onClick={this.onClick}
            >
                {this.$slots.default.map(item => {
                    return (
                        <DraggableItem config={itemConfig}>{item}</DraggableItem>
                    )
                })}
            </div>
        )
    },
    mounted() {
        console.log(this.$props);
    }
}
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    display: grid;
    grid-template-rows: repeat(auto-fill, 50px);
    grid-template-columns: repeat(auto-fill, 50px);
    gap: 50px;
    place-items: center;
    place-content: center;
}

</style>
