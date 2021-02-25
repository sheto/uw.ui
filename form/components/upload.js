import {Upload} from '../../index';


function $Success(uploadFileInfo, uploadPayload) {
	let _file = this.formInputData[uploadPayload]
	if (_file) {
		this.attr.forEach((item) => {
			if (item.attr == uploadPayload) {
				if (typeof _file == 'string') {
					if (item.limit === 1) {
						this.$set(
							this.formInputData,
							uploadPayload,
							uploadFileInfo
						)
					} else {
						this.$set(this.formInputData, uploadPayload, [
							_file,
							uploadFileInfo,
						])
					}
				} else if (Array.isArray(_file)) {
					if (item.limit === 1) {
						this.$set(
							this.formInputData,
							uploadPayload,
							uploadFileInfo
						)
					} else {
						this.formInputData[uploadPayload].push(
							uploadFileInfo
						)
					}
				}
			}
		})
	} else {
		this.$set(this.formInputData, uploadPayload, uploadFileInfo)
	}
}


function $Remove(filelist, attr) {
	this.formInputData[attr] = filelist.map((item) => {
		return item.url
	})
}

export default function $upload(_preset) {
	let template = this.formInputData[_preset.attr];
	if (Array.isArray(template)) {
		var list = template.map((item) => {
			return {
				url: item,
			}
		})
	} else if (typeof template === 'string') {
		var list = template === '' ? [] : { url: template }
	} else {
		var list = []
	}
	return this.$createElement(Upload, {
		class: {
			'e-upload-round': _preset.round,
		},
		attrs: {
			limit: _preset.limit,
			list: list,
			payload: _preset.attr,
		},
		on: {
			upload: $Success.bind(this),
			remove: $Remove.bind(this),
		},
	})
}