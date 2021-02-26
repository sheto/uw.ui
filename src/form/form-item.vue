<template>
	<div class="uw-form-item" :class="[{
      'uw-form-item--feedback': elForm && elForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required,
      'is-no-asterisk': elForm && elForm.hideRequiredAsterisk
    },
    sizeClass ? 'uw-form-item--' + sizeClass : ''
  ]">
		<label-wrap :is-auto-width="labelStyle && labelStyle.width === 'auto'" :update-all="form.labelWidth === 'auto'">
			<label :for="labelFor" class="uw-form-item__label" :style="labelStyle" v-if="label || $slots.label">
				<slot name="label">{{label + form.labelSuffix}}</slot>
			</label>
		</label-wrap>
		<div class="uw-form-item__content" :style="contentStyle">
			<slot></slot>
			<transition name="el-zoom-in-top">
				<slot v-if="validateState === 'error' && showMessage && form.showMessage" name="error" :error="validateMessage">
					<div class="uw-form-item__error" :class="{
              'uw-form-item__error--inline': typeof inlineMessage === 'boolean'
                ? inlineMessage
                : (elForm && elForm.inlineMessage || false)
            }">
						{{validateMessage}}
					</div>
				</slot>
			</transition>
		</div>
	</div>
</template>
<script>
	import AsyncValidator from 'async-validator'
	import emitter from '../../mixins/emitter'
	import objectAssign from '../../utils/merge'
	import { noop, getPropByPath } from '../../utils/util'
	import LabelWrap from './label-wrap.vue'
	export default {
		name: 'ElFormItem',

		componentName: 'ElFormItem',

		mixins: [emitter],

		provide() {
			return {
				elFormItem: this,
			}
		},

		inject: ['elForm'],

		props: {
			label: String,
			labelWidth: String,
			prop: String,
			required: {
				type: Boolean,
				default: undefined,
			},
			rules: [Object, Array],
			error: String,
			validateStatus: String,
			for: String,
			inlineMessage: {
				type: [String, Boolean],
				default: '',
			},
			showMessage: {
				type: Boolean,
				default: true,
			},
			size: String,
		},
		components: {
			// use this component to calculate auto width
			LabelWrap,
		},
		watch: {
			error: {
				immediate: true,
				handler(value) {
					this.validateMessage = value
					this.validateState = value ? 'error' : ''
				},
			},
			validateStatus(value) {
				this.validateState = value
			},
		},
		computed: {
			labelFor() {
				return this.for || this.prop
			},
			labelStyle() {
				const ret = {}
				if (this.form.labelPosition === 'top') return ret
				const labelWidth = this.labelWidth || this.form.labelWidth
				if (labelWidth) {
					ret.width = labelWidth
				}
				return ret
			},
			contentStyle() {
				const ret = {}
				const label = this.label
				if (this.form.labelPosition === 'top' || this.form.inline)
					return ret
				if (!label && !this.labelWidth && this.isNested) return ret
				const labelWidth = this.labelWidth || this.form.labelWidth
				if (labelWidth === 'auto') {
					if (this.labelWidth === 'auto') {
						ret.marginLeft = this.computedLabelWidth
					} else if (this.form.labelWidth === 'auto') {
						ret.marginLeft = this.elForm.autoLabelWidth
					}
				} else {
					ret.marginLeft = labelWidth
				}
				return ret
			},
			form() {
				let parent = this.$parent
				let parentName = parent.$options.componentName
				while (parentName !== 'ElForm') {
					if (parentName === 'ElFormItem') {
						this.isNested = true
					}
					parent = parent.$parent
					parentName = parent.$options.componentName
				}
				return parent
			},
			fieldValue() {
				const model = this.form.model
				if (!model || !this.prop) {
					return
				}

				let path = this.prop
				if (path.indexOf(':') !== -1) {
					path = path.replace(/:/, '.')
				}

				return getPropByPath(model, path, true).v
			},
			isRequired() {
				let rules = this.getRules()
				let isRequired = false

				if (rules && rules.length) {
					rules.every((rule) => {
						if (rule.required) {
							isRequired = true
							return false
						}
						return true
					})
				}
				return isRequired
			},
			_formSize() {
				return this.elForm.size
			},
			elFormItemSize() {
				return this.size || this._formSize
			},
			sizeClass() {
				return this.elFormItemSize || (this.$ELEMENT || {}).size
			},
		},
		data() {
			return {
				validateState: '',
				validateMessage: '',
				validateDisabled: false,
				validator: {},
				isNested: false,
				computedLabelWidth: '',
			}
		},
		methods: {
			validate(trigger, callback = noop) {
				this.validateDisabled = false
				const rules = this.getFilteredRule(trigger)
				if ((!rules || rules.length === 0) && this.required === undefined) {
					callback()
					return true
				}

				this.validateState = 'validating'

				const descriptor = {}
				if (rules && rules.length > 0) {
					rules.forEach((rule) => {
						delete rule.trigger
					})
				}
				descriptor[this.prop] = rules

				const validator = new AsyncValidator(descriptor)
				const model = {}

				model[this.prop] = this.fieldValue

				validator.validate(
					model,
					{ firstFields: true },
					(errors, invalidFields) => {
						this.validateState = !errors ? 'success' : 'error'
						this.validateMessage = errors ? errors[0].message : ''

						callback(this.validateMessage, invalidFields)
						this.elForm &&
							this.elForm.$emit(
								'validate',
								this.prop,
								!errors,
								this.validateMessage || null
							)
					}
				)
			},
			clearValidate() {
				this.validateState = ''
				this.validateMessage = ''
				this.validateDisabled = false
			},
			resetField() {
				this.validateState = ''
				this.validateMessage = ''

				let model = this.form.model
				let value = this.fieldValue
				let path = this.prop
				if (path.indexOf(':') !== -1) {
					path = path.replace(/:/, '.')
				}

				let prop = getPropByPath(model, path, true)

				this.validateDisabled = true
				if (Array.isArray(value)) {
					prop.o[prop.k] = [].concat(this.initialValue)
				} else {
					prop.o[prop.k] = this.initialValue
				}

				// reset validateDisabled after onFieldChange triggered
				this.$nextTick(() => {
					this.validateDisabled = false
				})

				this.broadcast('ElTimeSelect', 'fieldReset', this.initialValue)
			},
			getRules() {
				let formRules = this.form.rules
				const selfRules = this.rules
				const requiredRule =
					this.required !== undefined ? { required: !!this.required } : []

				const prop = getPropByPath(formRules, this.prop || '')
				formRules = formRules ? prop.o[this.prop || ''] || prop.v : []

				return [].concat(selfRules || formRules || []).concat(requiredRule)
			},
			getFilteredRule(trigger) {
				const rules = this.getRules()

				return rules
					.filter((rule) => {
						if (!rule.trigger || trigger === '') return true
						if (Array.isArray(rule.trigger)) {
							return rule.trigger.indexOf(trigger) > -1
						} else {
							return rule.trigger === trigger
						}
					})
					.map((rule) => objectAssign({}, rule))
			},
			onFieldBlur() {
				this.validate('blur')
			},
			onFieldChange() {
				if (this.validateDisabled) {
					this.validateDisabled = false
					return
				}

				this.validate('change')
			},
			updateComputedLabelWidth(width) {
				this.computedLabelWidth = width ? `${width}px` : ''
			},
			addValidateEvents() {
				const rules = this.getRules()

				if (rules.length || this.required !== undefined) {
					this.$on('el.form.blur', this.onFieldBlur)
					this.$on('el.form.change', this.onFieldChange)
				}
			},
			removeValidateEvents() {
				this.$off()
			},
		},
		mounted() {
			if (this.prop) {
				this.dispatch('ElForm', 'el.form.addField', [this])

				let initialValue = this.fieldValue
				if (Array.isArray(initialValue)) {
					initialValue = [].concat(initialValue)
				}
				Object.defineProperty(this, 'initialValue', {
					value: initialValue,
				})

				this.addValidateEvents()
			}
		},
		beforeDestroy() {
			this.dispatch('ElForm', 'el.form.removeField', [this])
		},
	}
</script>
<style lang="less">
.uw-form-item::after,
.uw-form-item__content::after {
	clear: both;
}
.uw-form-item {
	margin-bottom: 22px;
	.uw-form-item__label-wrap > .uw-form-item__label:before,
	.uw-form-item__label:before {
		content: '';
		margin-right: 8px;
	}
	&.is-required:not(.is-no-asterisk) {
		.uw-form-item__label-wrap > .uw-form-item__label:before,
		&.is-required:not(.is-no-asterisk) > .uw-form-item__label:before {
			content: '*';
			color: #f56c6c;
			margin-right: 4px;
		}
	}
	&::after,
	&::before {
		display: table;
		content: '';
	}
	.uw-form-item {
		margin-bottom: 0;
	}
}
.uw-form-item--mini.uw-form-item,
.uw-form-item--small.uw-form-item {
	margin-bottom: 18px;
}
.uw-form-item .el-input__validateIcon {
	display: none;
}
.uw-form-item--medium .uw-form-item__content,
.uw-form-item--medium .uw-form-item__label {
	line-height: 36px;
}
.uw-form-item--small .uw-form-item__content,
.uw-form-item--small .uw-form-item__label {
	line-height: 32px;
}
.uw-form-item--small .uw-form-item__error {
	padding-top: 2px;
}
.uw-form-item--mini .uw-form-item__content,
.uw-form-item--mini .uw-form-item__label {
	line-height: 28px;
}
.uw-form-item--mini .uw-form-item__error {
	padding-top: 1px;
}
.uw-form-item__label {
	text-align: right;
	vertical-align: middle;
	float: left;
	font-size: 14px;
	color: #606266;
	line-height: 40px;
	padding: 0 12px 0 0;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
}
.uw-form-item__content {
	line-height: 40px;
	position: relative;
	font-size: 14px;
	min-width: 180px;
}
.uw-form-item__content::after,
.uw-form-item__content::before {
	display: table;
	content: '';
}
.uw-form-item__content .el-input-group {
	vertical-align: top;
}
.uw-form-item__error {
	color: #f56c6c;
	font-size: 12px;
	line-height: 1;
	padding-top: 4px;
	position: absolute;
	top: 100%;
	left: 0;
}
.uw-form-item__error--inline {
	position: relative;
	top: auto;
	left: auto;
	display: inline-block;
	margin-left: 10px;
}
.uw-form-item.is-error .el-input__inner,
.uw-form-item.is-error .el-input__inner:focus,
.uw-form-item.is-error .el-textarea__inner,
.uw-form-item.is-error .el-textarea__inner:focus {
	border-color: #f56c6c;
}
.uw-form-item.is-error .el-input-group__append .el-input__inner,
.uw-form-item.is-error .el-input-group__prepend .el-input__inner {
	border-color: transparent;
}
.uw-form-item.is-error .el-input__validateIcon {
	color: #f56c6c;
}
.uw-form-item--feedback .el-input__validateIcon {
	display: inline-block;
}
</style>
