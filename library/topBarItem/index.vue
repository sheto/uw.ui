<template>
	<div class="e-search-item" :class="{
		right:position === 'right'
	}">
		<slot></slot>
	</div>
</template>
<script>
	export default {
		name: 'TopBarItem',
		props:{
			position:String
		}
	}
</script>
<style scoped>
	.right{
		float:right;
	}
</style>