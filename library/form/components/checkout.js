import { Checkbox, CheckboxGroup, CheckboxButton } from "element-ui";
export function Checkout(_preset) {
	if (_preset.single) {
		return this.$createElement(Checkbox, {
			attrs: {
				value: this.formInputData[_preset.attr] === 1 ? true : false,
				label: _preset.value,
			},
			on: {
				change: (_value) => {
					this.formInputData[_preset.attr] = _value ? 1 : 0
				},
			},
		},
			_preset.single
		)
	};

	return this.$createElement(CheckboxGroup, {
		attrs: {
			value: this.formInputData[_preset.attr],
		},
		nativeOn: {
			change: (_evt) => {
				let { value } = _evt.target;
				let start;
				let checklist = this.formInputData[_preset.attr]
				checklist.find((_value, _index) => _value == value && (start = _index, true))
					? checklist.splice(start, 1)
					: checklist.push(value)
			},
		},
	},
		_preset.checklist.map((check) => {
			return this.$createElement(
				_preset.childType == 'box' ? Checkbox : CheckboxButton,
				{
					attrs: {
						label: check.value,
					},
				},
				check.label
			)
		}));
}