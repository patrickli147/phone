<script>
import DraggableItem from './DraggableItem.vue';

export default {
    name: 'drop-zone',
    props: {
        // all items
        items: {
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
        // num of columns
        columns: {
            type: Number,
            default: 4,
            require: false
        },
        // num of rows
        rows: {
            type: Number,
            default: 4,
            require: false
        },
        // row gap: px
        rowGap: {
            type: Number,
            default: 50,
            require: false
        },
        // column gap: px
        columnGap: {
            type: Number,
            default: 50,
            require: false
        }
    },
    data() {
        return {
            data: this.items,
            // indexes of items
            indexes: [],
            counter: 300
        }
    },
    methods: {
        onDrop(e) {
            // 取消默认拖拽
            e.preventDefault();

            console.log('drop');
        },
        onDragEnter() {
            // console.log('drag enter');
        },
        onDragOver(e) {
            // console.log('drag over');
            e.preventDefault();
        },
        onDragLeave() {
            // console.log('drag leave');
            // TODO:限制在内部
        },
        onIndexChange(e) {
            console.log('couter: ' + this.counter);
            if (this.counter > 0) {
                this.counter = this.counter - 1;
            }
            else {
                return;
            }

            console.log(e);
            const {newIndex, index} = e;
            const currentItem = this.indexes[index];

            // this.data.splice(index, 1);
            // this.data.splice(newIndex, 0, currentItem);
            // infinite loop

            const currentItems = [...this.indexes];
            currentItems.splice(index, 1);
            currentItems.splice(newIndex, 0, currentItem);
            this.indexes = [...currentItems];

            // this.$forceUpdate();

            console.log(newIndex);
            console.log(this.indexes);
        },
        onClick() {
            console.log('click');
        }
    },
    components: {
        DraggableItem
    },
    render() {
        const basicItemConfig = {
            width: this.itemWidth,
            height: this.itemHeight,
            columns: this.columns,
            maxIndex: this.indexes.length - 1
        }

        return (
            <div
                class="container"
                onDrop={() => {console.log('drop');}}
                onDragenter={this.onDragEnter}
                onDragover={this.onDragOver}
                onDragleave={this.onDragLeave}
                onClick={this.onClick}
                style={this.style}
            >
                {this.indexes.map((item, index) => {
                    const itemConfig = Object.assign({}, basicItemConfig, {index});
                    console.log('%c rendering', 'color: red;');
                    return (
                        <DraggableItem onIndexchange={this.onIndexChange} config={itemConfig}>
                            {this.$slots.default[item]}
                        </DraggableItem>
                    );
                })}
            </div>
        )
    },
    mounted() {
        this.indexes = this.$slots.default.map((value, index) => index);
        console.log('xxx1 ', this.indexes);
    },
    computed: {
        style() {
            return {
                gridTemplateColumns: `repeat(${this.columns}, ${this.itemWidth}px)`,
                gridTemplateRows: `repeat(${this.rows}, ${this.itemHeight}px)`,
                columnGap: `${this.columnGap}px`,
                rowGap: `${this.rowGap}px`
            }
        }
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
