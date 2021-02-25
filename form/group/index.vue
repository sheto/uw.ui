<script>
	import {
		picker,
		input,
		select,
		radio,
		checkout,
		upload,
		tag,
		rate,
	} from '../components';
	import { Form,FormItem } from "../src";
	// 此组件用于以可关闭tag组件方式展示group的值;
	import Show from './show'
	import { $assign } from '../methods'
	export default {
		name: 'FormGroup',
		render(h) {
			let _inline = this.fields.inline
			// 表单子项
			let _children = this.fields.options.map((item) => {
				let attribute = {
					attrs: {
						key: item.name,
						prop: item.attr,
						rules: item.rules,
					},
				}
				// 为内联表单是是否有特殊项
				if (_inline) {
					// 显示方式
					if (item.block) attribute.class = ['form__display--inline', 'child']
				} else {
					attribute.attrs.label = item.name
					attribute.class = ['form__display--bloack', 'child']
				}
				return h(FormItem, attribute, [this.$use(item)])
			})
			//添加操作按钮（假设都需要）
			_children.push(
				h(
					FormItem,
					{
						class: 'el-item__action',
						props:{
							labelWidth: "20px"
						}
					},
					[this.$action(this.fields.action)]
				)
			)
			// 添加表单
			return h('div', [
				h(
					Form,
					{
						ref: 'form',
						class: ['group'],
						attrs: {
							model: this.formInputData,
							inline: _inline,
							labelPosition: 'left',
							labelWidth: this.fields.labelWidth,
						},
					},
					_children
				),
				h(Show, {
					attrs: {
						list: this.childFormData,
					},
					on: {
						close: (v) => {
							this.childFormData.splice(v, 1)
						},
					},
				}),
			])
		},
		data() {
			return {
				formInputData: {},
				select: {},
				status: true,
				groupFormData: {},
				childFormData: [],
				childStatus: {},
				whenValidateFail: 'fail',
				isEmit: false,
			}
		},
		props: {
			dialog: String,
			emit: [Boolean, String],
			payload: [String, Object, Array, Number],
			rules: {
				type: Object,
				default() {
					return {
						required: false,
					}
				},
			},
			template: {
				type: [Object, Function],
				default: () => ({}),
			},
			fields: {
				type: Object,
				required: true,
			},
			preset: {
				type: Object,
				default: () => ({}),
			},
			type: {
				type: String,
				default: '添加',
			},
			mode: {
				type: String,
				default: 'addit',
			},
		},
		watch: {
			childStatus: {
				deep: true,
				handler(v) {
					let _status = true
					for (let key in v) {
						if (!v[key]) {
							_status = false
						}
					}
					this.status = _status
				},
			},
			dialog(_evtname) {
				if (_evtname === 'close') {
					//原生事件-假如内嵌对话框，用于关闭对话框
					this.$$emit('dialog', false, this.$el)
				}
			},
			template(_newFields) {
				this.formInputData = $assign.call(this, _newFields)
			},
			emit(_status) {
				if (_status) {
					if (typeof _status == 'boolean') this.emitFormData()
				} else {
					this.clearFormData()
				}
			},
		},
		methods: {
			$action(_action) {
				switch (typeof _action) {
					//action为字符串时
					case 'string':
						return this.$createElement(
							'el-button',
							{
								on: {
									click: this.copyFormData,
								},
							},
							_action
						)

					//action为对象是
					case 'object':
						if (Array.isArray(_action)) {
						} else {
							return this.$createElement(
								'el-button',
								{
									on: {
										click: this.copyFormData,
									},
								},
								_action.name
							)
						}
				}
			},
			$use(_option) {
				try {
					if (
						!_option.type ||
						eval(`typeof ${_option.type}`) === 'undefined'
					) {
						return input.call(this, _option)
					} else {
						console.log(_option.type)
						return eval(`${_option.type}.call(this,_option)`)
					}
				} catch (_err) {
					return input.call(this, _option)
				}
			},
			copyFormData() {
				//校验表单项
				this.$refs.form.validate((result) => {
					if (result) {
						this.fields.options.forEach((item) => {
							if (item.format) {
								switch (item.format) {
									case 'default':
										this.formInputData[item.attr] = item.default
										break
								}
							}
						})
						//校验通过
						this.childFormData.push(this.$copy(this.formInputData))
						this.clearFormData()
					}
				})
			},
			async $RebuildFields() {
				let { options } = this.fields
				let $rebuild = (_list) =>
					_list.map((_child) => ({
						label: _child.label,
						value: _child.value,
					}))
				for (let i = 0; i < options.length; i++) {
					let item = options[i]
					if (item.type === 'select' && typeof item.preset === 'string') {
						let data = await this.$ajax.get(item.preset)
						item.preset = $rebuild(
							item.rebuild ? item.rebuild(data) : data
						)
					}
				}
			},

			//传值
			emitFormData() {
				// 如果复制值数组有值就取copy数值如果无就取primitive
				let _data =
					this.childFormData.length > 0
						? this.childFormData
						: this.formInputData
				let _emit;
				if (this.childFormData.length > 0) {
					switch (this.fields.resolve) {
						case 'array':
							_emit = this.childFormData
							break
						default:
							_emit = this.childFormData
					}
				} else {
					switch (this.fields.resolve) {
						case 'array':
							_emit = Object.keys(_data).every((key) => {
								return _data[key] !== ''
							})
								? [_data]
								: []
							break
						default:
							_emit = _data
					}
				}
				//校验表单项
				this.$refs.form.validate((result) => {
					if (result) {
						//校验通过
						this.$emit('success', this.$copy(_emit))
					} else {
						//校验失败
						this.$emit('failed')
					}
				})
			},

			clearFormData() {
				this.$refs.form.clearValidate()
				this.$refs.form.resetFields()
			},
		},
		async created() {
			// 重构选项格式
			await this.$RebuildFields()
			// 获取表单数据模型
			this.formInputData = $assign.call(this)
		},
	}
</script>
<style lang="less" scoped>
.group {
	display: flex;
	.child ~ .child {
		margin-left: 2%;
	}
}
</style>