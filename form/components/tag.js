import { Tag } from '@/uw.ui';


function $Add(childArg, mode, argname) {
	let _arg = this.formInputData[argname]
	if (mode) {
		_arg.push(childArg)
	} else {
		_arg.splice(_arg.indexOf(childArg), 1)
	}
}

export default function $tag(_preset) {
	return this.$createElement(Tag, {
		attrs: {
			tags: this.formInputData[_preset.attr] || [],
			title: _preset.title,
		},
		on: {
			'ad-tag': (v, m) => {
				$Add.call(this,[v, m, _preset.attr])
			},
		},
	})
}