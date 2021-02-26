export default function $Picker(_presets){
	let _timeFormat = _presets.timeFormat ? _presets.timeFormat : 'HH:mm:ss'
	let _displayFormat = _presets.displayFormat ? _presets.displayFormat : '';
	if (_presets.pickerType == 'time') {
		return this.$createElement('el-time-picker', {
			props: {
				isRange: _presets.range ? true : false,
				rangeSeparator: '-',
				startPlaceholder: '营业开始',
				endPlaceholder: '营业结束',
				valueFormat: _timeFormat,
				format: _displayFormat,
			},
			attrs: {
				value: this.formInputData[_presets.attr],
			},
			on: {
				input: (v) => {
					if (_presets.zone) {
						this.formInputData[_presets.attr] = v.replace(
							/^(\d{2})/,
							(m) => m + _presets.zone
						)
					} else {
						this.formInputData[_presets.attr] = v
					}
				},
			},
		})
	} else {
		let date = this.formInputData[_presets.attr];
		let props = {
			type: 'date',
			placeholder: _presets.name,
			valueFormat: _timeFormat,
			format: _displayFormat,
		};
		if(typeof date === "number"){
			if((""+date).length === 10){
				date = date*1000
			};
			props.valueFormat = "timestamp"
		}
		return this.$createElement('el-date-picker', {
			attrs: { value: date },
			props,
			on: {
				input: (v) => {
					this.formInputData[_presets.attr] = v
				},
			},
		})
	}
}