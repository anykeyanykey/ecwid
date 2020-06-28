<template>
    <div class="gallery" ref="gallery">
        <div v-if="!rows.length"><span>Нет элементов</span></div>
        <div
            v-for="row in rows"
            :key="row.id"
            class="gallery__row"
            :style="{
                height: row.heightPx,
                'grid-template-columns': row.gridTemplateColumns
            }"
        >
            <div
                v-for="(image, index) in row.cells"
                class="gallery__item"
                :key="image.id"
                :style="{
                    'padding-bottom': gutterPx,
                    'padding-right': index === row.cells.length - 1 ? 0 : gutterPx
                }"
            >
                <div
                    class="gallery__item-inner"
                    :style="{ 'background-image': `url(${image.url})` }"
                    @click="$emit('expand', image);"
                >
                    <div class="gallery__delete_icon" @click.stop="$emit('remove', image);"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        gutter: {
            type: Number,
            default: 5
        },
        images: {
            type: Array,
            require: true
        }
    },
    data() {
        return {
            rows: []
        };
    },
    watch: {
        images() {
            this.reCalc();
        }
    },
    computed: {
        gutterPx() {
            return `${this.gutter}px`;
        }
    },
    methods: {
        /**
         * Возвращает максимальную высоту строки для доступной ширины
         */
        getMaxRowHeight(width: number): number {
            return width >= 800 ? 170 : width >= 700 ? 150 : width >= 600 ? 120 : width >= 500 ? 100 : 80;
        },
        /**
         * Возвращает ширину строки при заданных параметрах
         */
        getWidthSum(images: IImageItem[], rowHeight: number, countInRow: number): number {
            return (
                images
                    .slice(0, countInRow)
                    .map((item) => ((rowHeight - this.gutter) / item.height) * item.width)
                    .reduce((res: number, i: number) => (res += i), 0) +
                (countInRow - 1) * this.gutter
            );
        },
        /**
         * Подбирает кол-во картинок в строке
         */
        getCountInRow(images: IImageItem[], maxRowHeight: number, maxRowWidth: number): number {
            let count: number = images.length;
            while (this.getWidthSum(images, maxRowHeight, count) >= maxRowWidth) {
                count--;
            }
            return ++count;
        },
        /**
         * Подбирает высоту строки при заданных параметрах
         */
        getFactRowHeight(images: IImageItem[], maxRowHeight: number, maxRowWidth: number, countInRow: number) {
            let factRowHeight = maxRowHeight;
            while (this.getWidthSum(images, factRowHeight, countInRow) >= maxRowWidth) {
                factRowHeight--;
            }
            return ++factRowHeight;
        },
        /**
         * Собирает строку для байндинга в стиль на шаблоне
         */
        getGridTemplateColumnsStr(images: IImageItem[], factRowHeight: number, maxRowWidth: number): string {
            const _factRowHeightWithoutGutter: number = factRowHeight - this.gutter;
            return images
                .map(
                    (image: IImageItem, i: number) =>
                        `${((_factRowHeightWithoutGutter / image.height) * image.width +
                            (i === images.length - 1 ? 0 : this.gutter)) /
                            maxRowWidth}fr`
                )
                .join(' ');
        },
        /**
         * Основной метод рекалькуляции
         */
        reCalc(): void {
            const rows: any = [];
            const images: IImageItem[] = [...this.images];
            const maxRowWidth: number = this.$refs.gallery.scrollWidth;
            console.log(maxRowWidth);
            const maxRowHeight: number = this.getMaxRowHeight(maxRowWidth);
            while (images.length) {
                const countInRow: number = this.getCountInRow(images, maxRowHeight, maxRowWidth);
                const imagesInRow: IImageItem[] = images.splice(0, countInRow);
                const factRowHeight: number = this.getFactRowHeight(imagesInRow, maxRowHeight, maxRowWidth, countInRow);
                rows.push({
                    id: Math.random(),
                    heightPx: `${factRowHeight}px`,
                    gridTemplateColumns: this.getGridTemplateColumnsStr(imagesInRow, factRowHeight, maxRowWidth),
                    cells: imagesInRow
                });
            }
            this.rows = rows;
        }
    },
    mounted(): void {
        this.$nextTick(() => {
            window.addEventListener('resize', this.reCalc);
        });
    },
    beforeDestroy(): void {
        window.removeEventListener('resize', this.reCalc);
    }
};
</script>

<style lang="scss">
.gallery {
    color: white;
    &__row {
        display: grid;
    }
    &__item {
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
    }
    &__item-inner {
        height: 100%;
        width: 100%;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: 50%;
        position: relative;
        &:hover {
            .gallery__delete_icon {
                display: block;
            }
        }
    }
    &__delete_icon {
        position: absolute;
        top: 0;
        right: 0;
        width: 30px;
        height: 30px;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.3);
        background-image: url('./../assets/icon-delete.svg');
        background-repeat: no-repeat;
        background-position: 50%;
        display: none;
        @media (max-width: 540px) {
            width: 20px;
            height: 20px;
            background-size: 70%;
        }
    }
}
</style>
