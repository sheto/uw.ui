export function $emit() {
	// 通知子组件更新状态
	this.isEmit = true
	this.$emit('leave', JSON.parse(JSON.stringify(this.formInputData)))
	//校验结果
	this.$nextTick(() => {
		this.$refs.form.validate((result) => {
			if (result && this.checkChildStatus()) {
				this.attr.forEach((item) => {
					if (item.format) {
						switch (item.format) {
							case 'json':
								this.formInputData[
									item.attr
								] = JSON.stringify(
									this.formInputData[item.attr]
								)
								break
							case 'change':
								if (item.pre) {
									if (
										this.formInputData[
											item.attr
										] === item.pre
									) {
										this.formInputData[item.attr] =
											item.value
									} else {
										this.formInputData[item.attr] =
											''
									}
								} else {
									this.formInputData[item.attr] =
										item.value
								}
								break
							case 'suffix':
								this.formInputData[item.attr] +=
									item.value
								break
						}
					}
				})
				let { ...value } = this.formInputData
				//校验通过
				this.$emit(
					'complete',
					value,
					this.payload,
					this.form.action
				)
			} else {
				this.isEmit = 'reload'
				this.$emit(this.whenValidateFail, this.form.action)
			}
		})
	})
}