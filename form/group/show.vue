<script>
	import { Tag } from 'element-ui'
	// list组件: 当group组件需要的值为array型组合值的时候
	export default {
		render(h) {
			let children = ''
			// 如果有tag
			if (this.tag.length > 0) {
				children = this.tag.map((tag, index) =>
					h(
						Tag,
						{
							class: 'el-tag--margin',
							attrs: {
								closable: true,
							},
							on: {
								close: (v) => {
									this.$emit('close', index)
								},
							},
						},
						tag
					)
				)
			}
			return h('div', children)
		},
		data() {
			return {
				show: [],
			}
		},
		props: {
			list: {
				type: Array,
				default: () => [],
			},
		},
		computed: {
			tag() {
				return this.list.length > 0
					? this.list.map((item) => {
							let _text = ''
							Object.keys(item).forEach((child, index) => {
								_text +=
									index == 0 ? item[child] : ` - ${item[child]}`
							})
							return _text
					  })
					: []
			},
		},
	}
</script>
<style lang="less">
.el-tag--margin {
	margin-right: 6px;
}
</style>