export default function $radio(_preset) {
	// 按钮样式
	let radio = _preset.childType == 'button' ? 'el-radio-button' : 'el-radio';
	let prop = {
		attrs: {
			value: this.formInputData[_preset.attr],
		},
		on: {
			input: (v) => {
				this.formInputData[_preset.attr] = v
			},
		}
	};
	if(_preset.checklist.length > 3){
		prop.style = {
			display: "flex",
			"flex-direction": "column"
		}
	};
	return this.$createElement(
		'el-radio-group',
		prop,
		_preset.checklist.map((_radio) => {
			return this.$createElement(
				radio,
				{
					attrs: {
						label: _radio.value,
					},
				},
				_radio.label
			)
		})
	)
}