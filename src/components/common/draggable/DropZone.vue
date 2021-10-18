<script>
import DraggableItem from './DraggableItem.vue';

export default {
    name: 'drop-zone',
    props: {
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
            // indexes backup
            originIndexes: [],
            // new indexes
            newIndexes: [],
            // is click event
            isClick: false,
            // styles(translate) of each item
            styles: [],
            // is dragging
            isDragging: false
        }
    },
    methods: {
        onItemDragEnd() {
            this.isDragging = false;
            this.initStyles();
            this.indexes = [...this.newIndexes];
        },
        onIndexChange(e) {
            const {newIndex, index} = e;
            const currentItem = this.originIndexes[index];

            // this.data.splice(index, 1);
            // this.data.splice(newIndex, 0, currentItem);
            // infinite loop

            const currentItems = [...this.originIndexes];
            currentItems.splice(index, 1);
            currentItems.splice(newIndex, 0, currentItem);
            // this.indexes = [...currentItems];
            this.newIndexes = [...currentItems];

            // this.$forceUpdate();

            console.log(newIndex);
            console.log(this.indexes);

            this.computeLayout(newIndex, index);
        },
        onItemDragStart() {
            this.isDragging = true;
            this.originIndexes = [...this.indexes];
            this.newIndexes = [...this.indexes];
            this.isClick = true;
        },
        computeLayout(newIndex, oldIndex) {
            const {columns, indexes, itemWidth, itemHeight, rowGap, columnGap} = this;
            const newStyles = Array(indexes.length).fill('');
            if (newIndex > oldIndex) {
                for (let i = oldIndex + 1; i <= newIndex; i ++) {
                    if ((i + 1) % columns === 1) {
                        const translateX = (columns - 1) * (columnGap + itemWidth);
                        const translateY = -(rowGap + itemHeight);
                        newStyles[i] = `transform: translate(${translateX}px, ${translateY}px)`;
                    }
                    else {
                        newStyles[i] = `transform: translateX(${-(columnGap + itemWidth)}px)`;
                    }
                }
            }
            else {
                for (let i = newIndex; i < oldIndex; i ++) {
                    if ((i + 1) % columns === 0) {
                        const translateX = -(columns - 1) * (columnGap + itemWidth);
                        const translateY = rowGap + itemHeight;
                        newStyles[i] = `transform: translate(${translateX}px, ${translateY}px)`;
                    }
                    else {
                        newStyles[i] = `transform: translateX(${columnGap + itemWidth}px)`;
                    }
                }
            }

            this.styles = [...newStyles];
            console.log(this.styles);
        },
        initStyles() {
            this.styles = Array(this.indexes.length).fill('');
        }
    },
    components: {
        DraggableItem
    },
    render() {
        const basicItemConfig = {
            width: this.itemWidth,
            height: this.itemHeight,
            columnGap: this.columnGap,
            rowGap: this.rowGap,
            columns: this.columns,
            maxIndex: this.indexes.length - 1
        }

        return (
            <div
                class="container"
                style={this.style}
            >
                {this.indexes.map((item, index) => {
                    const itemConfig = Object.assign({}, basicItemConfig, {index});
                    // console.log('%c rendering %d', 'color: red;', index);
                    return (
                        <DraggableItem
                            onIndexchange={this.onIndexChange}
                            onItemDragStart={this.onItemDragStart}
                            onItemDragEnd={this.onItemDragEnd}
                            config={itemConfig}
                            style={this.styles[index]}
                            class={[{'dragging-item': this.isDragging}]}
                        >
                            {this.$slots.default[item]}
                        </DraggableItem>
                    );
                })}
            </div>
        )
    },
    mounted() {
        this.indexes = this.$slots.default.map((value, index) => index);
        this.initStyles();
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

.dragging-item {
    transition: all .5s;
}

</style>
