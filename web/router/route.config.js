import navConfig from "./nav.config";
import langs from "../i18n/route";

const load = function (_path) {
	return r => require.ensure([], () => r(require(`../pages/${_path}.vue`)));
};

const loadDocs = function (_path) {
	return r => require.ensure([],() => r(require(`../docs${_path}.md`)))
};

const registerRoute = navConfig => {
	let father = {
		path: `/component`,
		redirect: `/component/installation`,
		component: r => require.ensure([], () => r(require(`../pages/component/index.vue`))),
		children: []
	};

	let addRoute = function (page) {
		const component = page.path === "/changelog" ? load("changelog") : loadDocs(page.path);
		let child = {
			path: page.path.slice(1),
			meta: {
				title: page.title || page.name,
				description: page.description
			},
			name: "component-" + (page.title || page.name),
			component: component.default || component
		};

		father.children.push(child);
	};

	navConfig.forEach((nav) => {
		// 如果为网络链接则返回
		if (nav.href) return;
		if (nav.groups) { 
			nav.groups.forEach(group => {
				group.list.forEach(nav => {
					addRoute(nav);
				});
			});
		} else if (nav.children) {
			nav.children.forEach(nav => {
				addRoute(nav);
			});
		} else {
			addRoute(nav);
		}
	});

	return [father];
};

let route = registerRoute(navConfig);

const generateMiscRoutes = function (lang) {

	let themeRoute = {
		path: `/theme`,
		component: load("theme-nav"),
		children: [
			{
				path: "/", // 主题管理
				name: "theme",
				meta: { lang },
				component: load("theme")
			},
			{
				path: "preview", // 主题预览编辑
				name: "theme-preview-",
				meta: { lang },
				component: load("theme-preview")
			}
		]
	};

	let resourceRoute = {
		path: `/resource`, // 资源
		meta: { lang },
		name: "resource",
		component: load("resource")
	};

	let indexRoute = {
		path: `/`, // 首页
		meta: { lang },
		name: "home",
		component: load("index")
	};

	return [resourceRoute, themeRoute, indexRoute];
};

langs.forEach(lang => {
	route = route.concat(generateMiscRoutes(lang.lang));
});

route.push({
	path: "/play",
	name: "play",
	component: require("../play/index.vue")
});

console.log(route)

export default route;
