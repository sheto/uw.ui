import Group from '../group';

export function group(_preset) {
	// 此处状态指group的传递值的触发时机，当变化就传递
	this.childStatus[_preset.name] = true;
	// 设置lablewidth值
	if(!_preset.group.labelWidth){
		_preset.group.labelWidth = this.labelWidth
	};
	return this.$createElement(Group, {
		attrs: {
			fields: _preset.group,
			template:
				this.groupFormData[_preset.attr] || this.groupFormData[_preset.name],
			emit: this.isEmit,
			required: _preset.required,
		},
		on: {
			success: (_value) => {
				this.parseGroupData(_value, _preset.group, _preset)
				this.childStatus[_preset.name] = true
			},
			failed: (v) => {
				this.childStatus[_preset.name] = false
			},
		},
	})
}