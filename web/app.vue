<template>
	<div id="app" :class="{ 'is-component': isComponent }">
		<main-header />
		<div class="main-cnt">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
import { use } from "main/locale";
import MainHeader from "./components/header";
export default {
	name: "app",
	components:{MainHeader},
	computed: {
		isComponent() {
			return /^component-/.test(this.$route.name || "");
		}
	},
	mounted() {
		use()
	}
};
</script>
