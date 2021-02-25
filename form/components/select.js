function $RebuildOption(_option) {
	return _option.map(_item => {
		return {
			label: _item.label,
			value: _item.value,
		}
	})
};

export default function (_preset) {
	let children = [];
	if (_preset.preset) {
		let { preset } = _preset
		// 如果为字符则作为请求链接
		if (typeof preset === 'string') {
			this.$ajax.get(preset).then(_data => {
				$RebuildOption(_preset.rebuild ? _preset.rebuild(_data) : _data).forEach(_item=>{
					children.push(_item)
				});
			})
			// 如果是数据，传递格式为[{lable:"",value:""}]
		} else if (Array.isArray(preset)) {
			children = $RebuildOption(preset)
		} else {
			children = $RebuildOption(this.select[_preset.attr])
		}
	} else {
		try {
			children = $RebuildOption(this.preset[_preset.attr])
		} catch (e) {
			this.$message.error(_preset.name + '获取失败，请刷新！')
		}
	};
	// 返回下拉框
	return this.$createElement("el-select", {
		attrs: {
			value: this.formInputData[_preset.attr],
			placeholder: `请选择${_preset.name}`,
			multiple: _preset.multiple,
		},
		on: {
			change: (v) => {
				this.formInputData[_preset.attr] = v
				/* element下拉框有个bug，选择之后不会更新 */
				this.$forceUpdate()
			},
		},
	}, children.map(_item => {
		return this.$createElement('el-option', {
			attrs: {
				label: _item.label,
				value: _item.value,
			},
		})
	}));
}