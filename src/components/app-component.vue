<template>
    <div class="container">
        <loader-component v-on:load="onLoad" />
        <gallery-component
            v-bind:images="images"
            @expand="expandedImage = $event;"
        />
        <expand-component v-model="expandedImage" />
    </div>
</template>

<script lang="ts">
import GalleryComponent from "./gallery-component.vue";
import LoaderComponent from "./loader-component.vue";
import ExpandComponent from "./expand-component.vue";

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
        onLoad(event) {
            if (event) {
                if (Array.isArray(event)) {
                    this.images = event;
                } else {
                    this.images.unshift(event);
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
