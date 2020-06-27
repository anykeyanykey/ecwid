<template>
    <div class="gallery" ref="gallery" >
        <div v-if="!rows.length">
            <span>Нет элементов</span>
        </div>
        <div v-for="row in rows"
             :key="row.id"
             class="gallery__row"
             :style="{height: `${row.height}px`, 'grid-template-columns': row.colums}">
            <div v-for="(image, index) in row.elems"
                class="gallery__item"
                :style="{'padding-bottom': gutterPx, 'padding-right': index === row.elems.length - 1 ? 0: gutterPx}">
                <div class="gallery__item-inner"
                     :style="{'background-image': `url(${image.url})`}"
                @click="$emit('expand', image)"></div>
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
                this.update();
            }
        },
        computed: {
            gutterPx() {
                return `${this.gutter}px`;
            }
        },
        methods: {
            update() {
                const galleryInnerWidth = this.$refs.gallery.scrollWidth;
                const rows = [];
                const galleryImages = [...this.images];
                const initialHeight = galleryInnerWidth >= 860 ? 170 : galleryInnerWidth >= 780 ?  150 : galleryInnerWidth >= 540 ? 100 : 80;
                let height;
                while (galleryImages.length) {
                    height = initialHeight;
                    let count = galleryImages.length;
                    while (
                        galleryImages
                            .slice(0, count)
                            .map((item, i) => ((height - this.gutter) / item.height) * item.width)
                            .reduce((res, i) => (res += i), 0) + (count-1)*this.gutter  >= galleryInnerWidth
                        ) {
                        count--;
                    }
                    count++;
                    const elems = galleryImages.splice(0, count);
                    while (
                        elems
                            .slice(0, count)
                            .map((item, i) => ((height - this.gutter) / item.height) * item.width)
                            .reduce((res, i) => (res += i), 0) + (count-1)*this.gutter >= galleryInnerWidth
                        ) {
                        height--;
                    }
                    height++;
                    rows.push({height, elems,
                        colums: elems.map((elem, i)=>`${(((height - this.gutter) / elem.height) * elem.width + (i === elems.length-1 ? 0 : this.gutter))/galleryInnerWidth}fr`).join(' ')
                    });
                }
                console.log(rows);
                this.rows = rows;
            },

            handleResize(): void {
                this.update();
            }
        },

        mounted(): void {
            this.$nextTick(() => {
                window.addEventListener('resize', this.handleResize);
            });
        },
        beforeDestroy(): void {
            window.removeEventListener('resize', this.handleResize);
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
        }
    }
</style>
