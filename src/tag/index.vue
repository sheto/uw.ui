<script>
	export default {
		name: "UWTag",
		props: {
			text: String,
			closable: Boolean,
			type: String,
			hit: Boolean,
			disableTransitions: Boolean,
			color: String,
			size: String,
			effect: {
				type: String,
				default: "light",
				validator(val) {
					return ["dark", "light", "plain"].indexOf(val) !== -1;
				},
			},
		},
		methods: {
			handleClose(event) {
				event.stopPropagation();
				this.$emit("close", event);
			},
			handleClick(event) {
				this.$emit("click", event);
			},
		},
		computed: {
			tagSize() {
				return this.size || (this.$ELEMENT || {}).size;
			},
		},
		render(h) {
			const { type, tagSize, hit, effect } = this;
			const classes = [
				"uw-tag",
				type ? `uw-tag--${type}` : "",
				tagSize ? `uw-tag--${tagSize}` : "",
				effect ? `uw-tag--${effect}` : "",
				hit && "is-hit",
			];
			const tagEl = (
				<span
					class={classes}
					style={{ backgroundColor: this.color }}
					on-click={this.handleClick}
				>
					{this.$slots.default}
					{this.closable && (
						<i
							class="uw-tag__close el-icon-close"
							on-click={this.handleClose}
						></i>
					)}
				</span>
			);

			return this.disableTransitions ? (
				tagEl
			) : (
				<transition name="el-zoom-in-center">{tagEl}</transition>
			);
		},
	};
</script>
<style scoped lang="less">
.uw-tag {
	background-color: #ecf5ff;
	border-color: #d9ecff;
	display: inline-block;
	height: 32px;
	padding: 0 10px;
	line-height: 30px;
	font-size: 12px;
	color: #409eff;
	border-width: 1px;
	border-style: solid;
	border-radius: 4px;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	white-space: nowrap;
}
.uw-tag.is-hit {
	border-color: #409eff;
}
.uw-tag .uw-tag__close {
	color: #409eff;
}
.uw-tag .uw-tag__close:hover {
	color: #fff;
	background-color: #409eff;
}
.uw-tag.uw-tag--info {
	background-color: #f4f4f5;
	border-color: #e9e9eb;
	color: #909399;
}
.uw-tag.uw-tag--info.is-hit {
	border-color: #909399;
}
.uw-tag.uw-tag--info .uw-tag__close {
	color: #909399;
}
.uw-tag.uw-tag--info .uw-tag__close:hover {
	color: #fff;
	background-color: #909399;
}
.uw-tag.uw-tag--success {
	background-color: #f0f9eb;
	border-color: #e1f3d8;
	color: #67c23a;
}
.uw-tag.uw-tag--success.is-hit {
	border-color: #67c23a;
}
.uw-tag.uw-tag--success .uw-tag__close {
	color: #67c23a;
}
.uw-tag.uw-tag--success .uw-tag__close:hover {
	color: #fff;
	background-color: #67c23a;
}
.uw-tag.uw-tag--warning {
	background-color: #fdf6ec;
	border-color: #faecd8;
	color: #e6a23c;
}
.uw-tag.uw-tag--warning.is-hit {
	border-color: #e6a23c;
}
.uw-tag.uw-tag--warning .uw-tag__close {
	color: #e6a23c;
}
.uw-tag.uw-tag--warning .uw-tag__close:hover {
	color: #fff;
	background-color: #e6a23c;
}
.uw-tag.uw-tag--danger {
	background-color: #fef0f0;
	border-color: #fde2e2;
	color: #f56c6c;
}
.uw-tag.uw-tag--danger.is-hit {
	border-color: #f56c6c;
}
.uw-tag.uw-tag--danger .uw-tag__close {
	color: #f56c6c;
}
.uw-tag.uw-tag--danger .uw-tag__close:hover {
	color: #fff;
	background-color: #f56c6c;
}
.uw-tag .el-icon-close {
	border-radius: 50%;
	text-align: center;
	position: relative;
	cursor: pointer;
	font-size: 12px;
	height: 16px;
	width: 16px;
	line-height: 16px;
	vertical-align: middle;
	top: -1px;
	right: -5px;
}
.uw-tag .el-icon-close::before {
	display: block;
}
.uw-tag--dark {
	background-color: #409eff;
	border-color: #409eff;
	color: #fff;
}
.uw-tag--dark.is-hit {
	border-color: #409eff;
}
.uw-tag--dark .uw-tag__close {
	color: #fff;
}
.uw-tag--dark .uw-tag__close:hover {
	color: #fff;
	background-color: #66b1ff;
}
.uw-tag--dark.uw-tag--info {
	background-color: #909399;
	border-color: #909399;
	color: #fff;
}
.uw-tag--dark.uw-tag--info.is-hit {
	border-color: #909399;
}
.uw-tag--dark.uw-tag--info .uw-tag__close {
	color: #fff;
}
.uw-tag--dark.uw-tag--info .uw-tag__close:hover {
	color: #fff;
	background-color: #a6a9ad;
}
.uw-tag--dark.uw-tag--success {
	background-color: #67c23a;
	border-color: #67c23a;
	color: #fff;
}
.uw-tag--dark.uw-tag--success.is-hit {
	border-color: #67c23a;
}
.uw-tag--dark.uw-tag--success .uw-tag__close {
	color: #fff;
}
.uw-tag--dark.uw-tag--success .uw-tag__close:hover {
	color: #fff;
	background-color: #85ce61;
}
.uw-tag--dark.uw-tag--warning {
	background-color: #e6a23c;
	border-color: #e6a23c;
	color: #fff;
}
.uw-tag--dark.uw-tag--warning.is-hit {
	border-color: #e6a23c;
}
.uw-tag--dark.uw-tag--warning .uw-tag__close {
	color: #fff;
}
.uw-tag--dark.uw-tag--warning .uw-tag__close:hover {
	color: #fff;
	background-color: #ebb563;
}
.uw-tag--dark.uw-tag--danger {
	background-color: #f56c6c;
	border-color: #f56c6c;
	color: #fff;
}
.uw-tag--dark.uw-tag--danger.is-hit {
	border-color: #f56c6c;
}
.uw-tag--dark.uw-tag--danger .uw-tag__close {
	color: #fff;
}
.uw-tag--dark.uw-tag--danger .uw-tag__close:hover {
	color: #fff;
	background-color: #f78989;
}
.uw-tag--plain {
	background-color: #fff;
	border-color: #b3d8ff;
	color: #409eff;
}
.uw-tag--plain.is-hit {
	border-color: #409eff;
}
.uw-tag--plain .uw-tag__close {
	color: #409eff;
}
.uw-tag--plain .uw-tag__close:hover {
	color: #fff;
	background-color: #409eff;
}
.uw-tag--plain.uw-tag--info {
	background-color: #fff;
	border-color: #d3d4d6;
	color: #909399;
}
.uw-tag--plain.uw-tag--info.is-hit {
	border-color: #909399;
}
.uw-tag--plain.uw-tag--info .uw-tag__close {
	color: #909399;
}
.uw-tag--plain.uw-tag--info .uw-tag__close:hover {
	color: #fff;
	background-color: #909399;
}
.uw-tag--plain.uw-tag--success {
	background-color: #fff;
	border-color: #c2e7b0;
	color: #67c23a;
}
.uw-tag--plain.uw-tag--success.is-hit {
	border-color: #67c23a;
}
.uw-tag--plain.uw-tag--success .uw-tag__close {
	color: #67c23a;
}
.uw-tag--plain.uw-tag--success .uw-tag__close:hover {
	color: #fff;
	background-color: #67c23a;
}
.uw-tag--plain.uw-tag--warning {
	background-color: #fff;
	border-color: #f5dab1;
	color: #e6a23c;
}
.uw-tag--plain.uw-tag--warning.is-hit {
	border-color: #e6a23c;
}
.uw-tag--plain.uw-tag--warning .uw-tag__close {
	color: #e6a23c;
}
.uw-tag--plain.uw-tag--warning .uw-tag__close:hover {
	color: #fff;
	background-color: #e6a23c;
}
.uw-tag--plain.uw-tag--danger {
	background-color: #fff;
	border-color: #fbc4c4;
	color: #f56c6c;
}
.uw-tag--plain.uw-tag--danger.is-hit {
	border-color: #f56c6c;
}
.uw-tag--plain.uw-tag--danger .uw-tag__close {
	color: #f56c6c;
}
.uw-tag--plain.uw-tag--danger .uw-tag__close:hover {
	color: #fff;
	background-color: #f56c6c;
}
.uw-tag--medium {
	height: 28px;
	line-height: 26px;
}
.uw-tag--medium .el-icon-close {
	-webkit-transform: scale(0.8);
	transform: scale(0.8);
}
.uw-tag--small {
	height: 24px;
	padding: 0 8px;
	line-height: 22px;
}
.uw-tag--small .el-icon-close {
	-webkit-transform: scale(0.8);
	transform: scale(0.8);
}
.uw-tag--mini {
	height: 20px;
	padding: 0 5px;
	line-height: 19px;
}
.uw-tag--mini .el-icon-close {
	margin-left: -3px;
	-webkit-transform: scale(0.7);
	transform: scale(0.7);
}
</style>
