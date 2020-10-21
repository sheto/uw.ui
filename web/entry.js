import Vue from "vue";
import entry from "./app";
import Element from "main/index.js";
import router from "./router";
import demoBlock from "./components/demo-block";
import SideNav from "./components/side-nav";

import "packages/theme-chalk/src/index.scss";
import "./demo-styles/index.scss";
import "./assets/styles/common.css";
import "./assets/styles/fonts/style.css";
import icon from "./icon.json";

Vue.use(Element);
Vue.component("demo-block", demoBlock);
Vue.component("side-nav", SideNav);

const globalEle = new Vue({
	data: { $isEle: false } // 是否 ele 用户
});

Vue.mixin({
	computed: {
		$isEle: {
			get: () => globalEle.$data.$isEle,
			set: data => {
				globalEle.$data.$isEle = data;
			}
		}
	}
});

Vue.prototype.$icon = icon; // Icon 列表页用

new Vue({
	// eslint-disable-line
	...entry,
	router
}).$mount("#app");
