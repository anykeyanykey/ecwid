import Vue from "vue";
import AppComponent from "./components/app-component.vue";

const app: Vue = new Vue({
    render: h => h(AppComponent)
});

app.$mount("#app");
