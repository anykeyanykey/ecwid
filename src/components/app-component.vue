<template>
    <div class="container">
        <loader-component @load="onLoad" />
        <gallery-component :images="images" @expand="expandedImage = $event" @remove="onRemove" />
        <expand-component v-model="expandedImage" />
    </div>
</template>

<script lang="ts">
import GalleryComponent from './gallery-component.vue';
import LoaderComponent from './loader-component.vue';
import ExpandComponent from './expand-component.vue';

export default {
    components: {
        GalleryComponent,
        LoaderComponent,
        ExpandComponent
    },
    data() {
        return {
            images: [],
            expandedImage: null
        };
    },
    methods: {
        onRemove(image: IImageItem): void {
            this.images.splice(this.images.indexOf(image), 1);
        },
        onLoad(images: IImageItem[]): void {
            if (images) {
                if (Array.isArray(images)) {
                    this.images = images;
                } else {
                    this.images.unshift(images);
                }
            }
        }
    }
};
</script>

<style lang="scss">
.container {
    min-width: 320px;
    max-width: 860px;
    margin-left: auto;
    margin-right: auto;
    padding: 2rem;
    .loader {
        margin-bottom: 2rem;
    }
}
</style>
