<template>
	<div class="tab">
		<div v-for="(item) in view" :key="item" class="title">
			<div>{{item}}</div>
		</div>
	</div>
</template>
<script>
	export default {
		props:{
			view:Array
		}
	}
</script>
<style scoped lang="less">
	.tab{
		display: flex;
		width: 100%;
		.title{
			height: 24px;
			line-height: 24px;
			font-size: 14px;
			padding-left: 10px;
			padding-right: 10px;
			background-color: #2b2f3a;
			color: #ffffff;
		}
	}
</style>