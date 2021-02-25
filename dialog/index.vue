<template>
	<div :class="{ 'dialog__warp':!this.inline, 'dialog__warp--inline':this.inline }">
		<slot :visible="visible"></slot>
	</div>
</template>
<script>
	export default {
		name:"Dialog",
		methods: {
			close(v){
				this.$emit('close')
				this.visible = v
			},
			open(v){
				this.$emit('open')
				this.visible = v
			},
		},
		data() {
			return {
				visible: false,
			}
		},
		props: {
			inline: {
				type: Boolean,
				default: false,
			},
		},
		mounted(){
			this.$slots.default
		}
	}
</script>
<style lang="less" scoped>
	.dialog__warp {
		display: flex;
		.dialog__warp--inline {
			display: inline-flex;
		}
		.dialog__item {
			justify-content: flex-end;
		}
	}
</style>
