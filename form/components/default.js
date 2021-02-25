export default function $default(_preset){
	if(_preset.type === "textarea"){
		return this.$createElement('el-input', {
			props: {
				type: 'textarea',
			},
			attrs: {
				rows: 6,
				value: this.formInputData[_preset.attr],
			},
			on: {
				input: (v) => {
					this.formInputData[_preset.attr] = v
				},
			},
		})
	};
	return this.$createElement("el-input", {
		attrs: {
			placeholder: _preset.placeholder,
			value: this.formInputData[_preset.attr],
		},
		on: {
			input: (v) => {
				this.formInputData[_preset.attr] = v
			},
		}
	})
}