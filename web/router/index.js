import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./route.config";
import title from "../i18n/title";
import hljs from "highlight.js";

Vue.use(VueRouter);

const router = new VueRouter({
	mode: "hash",
	base: __dirname,
	routes
});

router.afterEach(route => {
	// https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
	Vue.nextTick(() => {
		const blocks = document.querySelectorAll("pre code:not(.hljs)");
		Array.prototype.forEach.call(blocks, hljs.highlightBlock);
	});
	const data = title[route.meta.lang];
	for (let val in data) {
		if (new RegExp("^" + val, "g").test(route.name)) {
			document.title = data[val];
			return;
		}
	}
	document.title = "Element";
});

export default router