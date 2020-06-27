<template>
    <div
        class="expander"
        @click.stop="close"
        :class="{ 'expander--expanded': value }"
    >
        <div v-if="value" class="expander__inner">
            <div class="expander__image_holder"><img :src="value.url" /></div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        value: {
            type: Object,
            require: false,
            default: null
        }
    },
    data() {
        return {};
    },
    computed: {},
    methods: {
        close() {
            this.$emit("input", null);
        }
    },
    created(): void {}
};
</script>

<style lang="scss">
.expander {
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    left: 0;
    height: 0;
    width: 0;
    z-index: -1;

    &--expanded {
        height: 100%;
        width: 100%;
        z-index: 1;
    }
    &__image_holder {
        height: 100%;
        width: 100%;
    }
    &__inner {
        position: absolute;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: 50%;
        height: 80%;
        width: 80%;
        text-align: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        img {
            max-width: 100%;
            max-height: 100%;
        }
    }
}
</style>
