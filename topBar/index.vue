<template>
	<div class="e-search">
		<slot></slot>
	</div>
</template>
<script>
	export default {
		name: "TopBar",
	};
</script>
<style lang="less" scoped>
.e-search {
	margin-top: 6px;
	margin-bottom: 10px;
	.e-search-item,
	.e-search-item__content {
		display: inline-block;
		vertical-align: top;
	}
	.e-search-item {
		margin-right: 10px;
	}
	.e-search-item__label {
		float: none;
		display: inline-block;
	}
	&.el-form--label-top .e-search-item__content {
		display: block;
	}
}
</style>