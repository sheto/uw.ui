<script>
	import * as Components from './components'
	import { Form, FormItem } from '../../src/form'
	import { $assign } from './methods'
	export default {
		name: 'Form',
		render() {
			// 添加表单子元素
			let children = this.fields.options.map((_item) => {
				let attribute = {
					class: 'item',
					attrs: {
						key: _item.name,
					},
					props: {
						prop: _item.attr,
						label: _item.name,
						rules: _item.rules,
					},
				}
				// 针对表单组的单独设定
				if (_item.type === 'group') {
					attribute.props.labelPosition = 'top'
				}
				if (_item.rel) {
					if (Array.isArray(this.formInputData[_item.rel])) {
						if (this.formInputData[_item.rel].includes(_item.show)) {
							return this.$createElement(FormItem, attribute, [
								this.$use(_item),
							])
						}
					} else if (this.formInputData[_item.rel] == _item.show) {
						return this.$createElement(FormItem, attribute, [
							this.$use(_item),
						])
					}
				} else {
					return this.$createElement(FormItem, attribute, [
						this.$use(_item),
					])
				}
			})
			// 默认插槽
			if (this.$scopedSlots.default) {
				let deft = this.$scopedSlots.default(this.fields.name)
				deft.forEach((_slotItem) => {
					if (_slotItem.data) {
						_slotItem.data.style = {
							marginLeft: '2%',
						}
					}
				})
				children.push(...deft)
			}
			// 添加操作按钮
			let action = this.$createElement(
				FormItem,
				{
					style: {
						width: '100%',
						marginLeft: '2%',
					},
					attrs: {
						labelWidth: '0',
					},
				},
				[
					this.fields.action && this.$action(this.fields.action),
					this.fields.reset &&
						this.$createElement(
							'el-button',
							{
								on: {
									click: this.clearFormData,
								},
							},
							this.fields.reset || '清空'
						),
					this.$scopedSlots.action &&
						this.$scopedSlots.action(this.fields.name),
				]
			)
			// 添加表单
			return this.$createElement(
				Form,
				{
					ref: 'form',
					class: [
						'form',
						'form__position--origin',
						{
							'form__position--center':
								this.fields.position === 'center',
							'form__position--left': this.fields.position === 'left',
						},
					],
					attrs: {
						model: this.formInputData,
						labelWidth: this.labelWidth,
						labelPosition: this.labelPosition,
					},
				},
				children.concat(action)
			)
		},
		data() {
			return {
				formInputData: {},
				select: {},
				status: true,
				groupFormData: {},
				childStatus: {},
				whenValidateFail: 'fail',
				isEmit: false,
			}
		},
		props: {
			rules: {
				type: Object,
				default() {
					return {
						required: false,
					}
				},
			},
			dialog: String,
			payload: [String, Object, Array, Number],
			template: {
				type: [Object, Function],
				default: () => ({}),
			},
			labelPosition: {
				type: String,
				default: 'left',
			},
			labelWidth: {
				type: String,
				default: '140px',
			},
			fields: {
				type: Object,
				required: true,
			},
			preset: {
				type: Object,
				default() {
					return {}
				},
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
									click: this.$emitFormData,
								},
							},
							_action
						)

					//action为对象是
					case 'object':
						if (Array.isArray(_action)) {
						} else {
							if (_action.fail) this.whenValidateFail = _action.fail
							Vnode = this.$createElement(
								'el-button',
								{
									on: {
										click: this.$emitFormData,
									},
								},
								_action.name
							)
						}
						return

					default:
						return this.$createElement(
							'el-button',
							{
								on: {
									click: this.$emitFormData,
								},
							},
							'添加'
						)
				}
			},
			$use(_option) {
				if (_option.type && _option.type in Components) {
					return Components[_option.type].call(this, _option)
				} else {
					return Components['input'].call(this, _option)
				}
			},
			parseGroupData(d, c, f) {
				if (c.resolve == 'array') {
					this.formInputData[f.attr] = d
				} else {
					Object.keys(d).forEach((k) => {
						this.formInputData[k] = d[k]
					})
				}
			},
			formatGroupTemplate(data) {
				let _template = {}
				if (Array.isArray(data)) {
					let _keys = []
					let _example = data[0]
					for (let key in _example) {
						_template[key] = []
						_keys.push(key)
					}
					data.forEach((item) => {
						_keys.forEach((attr) => {
							_template[attr].push(item[attr])
						})
					})
				}
				return _template
			},
			clearFormData() {
				// 通知子组件更新状态
				this.isEmit = false
				this.$refs.form.resetFields()
			},
			$checkGroupStatus() {
				let _status = true
				let _children = this.childStatus
				for (let key in _children) {
					if (!_children[key]) {
						_status = false
					}
				}
				return _status
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
			$emitFormData() {
				// 通知子组件更新状态
				this.isEmit = true
				this.$emit('leave', JSON.parse(JSON.stringify(this.formInputData)))
				//校验结果
				this.$nextTick(() => {
					this.$refs.form.validate((result) => {
						if (result && this.$checkGroupStatus()) {
							/* 冒泡之前第一步：对数据进行预期的格式化
							 * 目前提供三种格式方式：json，change，suffix
							 **/
							Object.assign(
								this.formInputData,
								$rebuildEmitResult(
									this.fields.options,
									this.formInputData
								)
							)
							// 最后一步：校验通过，冒泡表单值
							this.$emit(
								'complete',
								JSON.parse(JSON.stringify(this.formInputData)),
								this.payload,
								this.fields.action
							)
						} else {
							this.isEmit = 'reload'
							this.$emit(this.whenValidateFail, this.fields.action)
						}
					})
				})
			},
		},
		async created() {
			// 重构选项格式
			await this.$RebuildFields()
			// 获取表单数据模型
			this.formInputData = $assign.call(this)
		},
	}

	function $rebuildEmitResult(_result, _source) {
		let result = {}
		let format = {
			json(_item) {
				return JSON.stringify(_source[_item.attr])
			},
			change(_item) {
				if (_item.pre) {
					return _source[_item.attr] === _item.pre ? _item.value : ''
				} else {
					return _item.value
				}
			},
			suffix(_item) {
				return (_source[_item.attr] += _item.value)
			},
		}
		// 重新赋值
		_result
			.filter((_item) => _item.format)
			.forEach((_item) => {
				result[_item.attr] = format[_item.format]
			})
		return result
	}
</script>
<style lang="less" scoped>
.form {
	display: flex;
	flex-wrap: wrap;
	.item {
		margin-left: 2%;
	}
}
</style>