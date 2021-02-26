export default function $rate(_preset) {
	return this.$createElement('div', [
		h('el-rate', {
			class: 'form_rate',
			attrs: {
				value: this.formInputData[_preset.attr],
			},
			on: {
				change: (v) => {
					this.formInputData[_preset.attr] = v
				},
			},
		}),
		h(
			'el-button',
			{
				attrs: {
					type: 'text',
				},
				on: {
					click: () => {
						this.formInputData[_preset.attr] = 0
					},
				},
			},
			'清除'
		),
	])
}