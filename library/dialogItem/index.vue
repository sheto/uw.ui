<template>
	<div class="dialogitem_warp">
		<el-button :size="size" type="primary" @click="$open">{{title}}</el-button>
		<Dialog :class="{ 'dialog_item--rect':this.rect, 'dialog_item--is-locked':false }" @close="$close" @dialog.native="$close" :visible="visible" :title="title" :width="width" :fullscreen="full" :destroy-on-close="true" :modal="modal" :append-to-body="true">
			<slot :visible="visible" :payload="payload"></slot>
			<div v-if="action" class="dialog-action">
				<el-button @click="$close">取消</el-button>
				<slot name="action" :close="$close"></slot>
			</div>
		</Dialog>
	</div>
</template>
<script>
	import { Dialog } from "element-ui";
	export default {
		name: 'DialogItem',
		components:{Dialog},
		data() {
			return {
				visible: false,
				payload: {},
			}
		},
		methods: {
			$open(_payload) {
				if (_payload && typeof _payload == 'object') {
					this.payload = _payload
				}
				this.visible = true
				this.$emit('open', this.visible)
			},
			$close() {
				this.visible = false
				this.$emit('close', this.visible)
			},
		},
		props: {
			sets: {
				type: [Object, Array],
			},
			full: {
				type: Boolean,
				default: false,
			},
			rect: {
				type: Boolean,
				default: false,
			},
			modal: {
				type: Boolean,
				default: true,
			},
			title: String,
			width: String,
			size: String,
			action: {
				type: Boolean,
				default: true,
			},
		},
	}
</script>
<style lang="less" scoped>
.dialog-action {
	display: flex;
	justify-content: center;
}
.dialogitem_warp {
	display: inline-block;
	.dialog_item--rect .el-dialog {
		height: 70vh;
		overflow-y: scroll;
	}
	.dialog_item--is-locked .el-dialog__header {
		position: absolute;
		width: 100%;
		background-color: #fff;
		border-bottom: 1px solid gray;
	}
	&:first-child ~ & {
		margin-left: 4px;
	}
}
</style>
