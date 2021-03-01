import { Tag } from '../../index';

export default function $tag(_preset) {
	return this.$createElement(Tag, {
		attrs: {
			tags: this.formInputData[_preset.attr] || [],
			title: _preset.title,
		},
		on: {
			add: (_value, _mode) => {
                if (_mode) {
                    this.formInputData[_preset.attr].push(_value)
                } else {
                    this.formInputData[_preset.attr].splice(this.formInputData[_preset.attr].indexOf(_value), 1)
                }
			},
		},
	})
}