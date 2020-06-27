<template>
    <div class="loader">
        <div class="loader__upload-image-wrapper flexed-row">
            <div class="flexed-row__item flexed-row__item--max-size">
                <input
                    class="input-control"
                    :class="{
                        'input-control--invalid': urlValue && !isUrlValueValid
                    }"
                    type="text"
                    placeholder="https://don16obqbay2c.cloudfront.net/frontend-test-task/images/493550746.jpg"
                    spellcheck="false"
                    @input="urlInvalid = false;"
                    v-model="urlValue"
                />
            </div>
            <div class="flexed-row__item">
                <button
                    class="btn btn--primary"
                    :disabled="loading || !urlValue || !isUrlValueValid"
                    @click="loadImage"
                >
                    Загрузить
                </button>
            </div>
            <div class="flexed-row__item">
                <label for="upload-file-input" class="btn btn--primary">
                    <input
                        id="upload-file-input"
                        class="loader__file-input"
                        type="file"
                        @change="uploadFile"
                        accept="application/json,.json"
                    />
                    <span>Выбрать файл</span>
                </label>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    data() {
        return {
            urlValue: null,
            fileValue: null,
            urlInvalid: false,
            loading: false
        };
    },
    computed: {
        isUrlValueValid(): boolean {
            return this._urlTestRegExp.test(this.urlValue) && !this.urlInvalid;
        }
    },
    methods: {
        loadImage() {
            this.loading = true;
            const img = new Image();
            let url;
            img.src = url = this.urlValue;

            img.onload = (ev: any) => {
                this.$emit("load", {
                    url,
                    width: ev.target.width,
                    height: ev.target.height
                });
                this.loading = false;
            };
            img.onerror = () => {
                this.urlInvalid = true;
                this.loading = false;
            };
        },
        uploadFile(event) {
            if (event.target.files.length) {
                const fileReader = new FileReader();
                fileReader.onload = (evt: any) => {
                    this.$emit("load", JSON.parse(evt.target.result).images);
                };
                fileReader.readAsText(event.target.files[0]);
            }
        }
    },
    created(): void {
        this._urlTestRegExp = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/;
    }
};
</script>

<style lang="scss">
.loader {
    &__file-input {
        display: none;
    }
}
</style>
