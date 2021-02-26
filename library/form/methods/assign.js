import { validator } from '../utils'

export function $assign(_mode = "") {
	let { options } = this.fields;
	let preset = {};
	if(options){
		var copyOptions = JSON.parse(JSON.stringify(options))
	}else{
		return []
	};
	if(this.template){
		preset = JSON.parse(JSON.stringify(this.template && typeof this.template === 'function' ? this.template() : this.template));
	}
	let mode = this.mode
	//校验规则添加
	options.forEach($setRules)
	//单独处理group
	return $With(()=>copyOptions.filter((_item)=>_mode === "group"?_item.type === "group":_item.type !== "group"),mode,preset).then();
};

function $With(_primary,_mode,_preset){
	let primary = typeof _primary === "function"?_primary():_primary
	return {
		primary,
		data:{},
		then(_$callback){ 
			for(let i = 0;i<this.primary.length;i++){
				let item = primary[i];
				if("attr" in item){
					// 如果有中途操作
					if(_$callback){_$callback(item) };
					// 开始执行
					if (_preset) {
						this.data[item.attr] = _mode == 'editor' ? $PresetAssignEditStatus(item, _preset) : $PresetAssignAddStatus(item, _preset)
					}else{
						this.data[item.attr] = _mode == 'editor' ? $InitEdit(item) : $InitAdd(item)
					};
				}
			}
			return this.data;
		}
	}
}

//规则函数
function $setRules(item) {
	//假设所有都是必须条件
	let _rules = []
	let _presets = validator
	//必填项
	if (!item.required){
		_rules.push({
			required: true,
			message: `${item.name}不能为空!`,
		})
	}
	if (item.rule) {
		if (typeof item.rule == 'string') {
			_rules.push(_presets[item.rule])
		} else {
			_rules.push(item.rule)
		}
	}
	item.rules = _rules
}

function $InitAdd(item){
	switch (item.type) {
		case 'tag':
			return item.preset || []
		case 'select':
			/* if (item.option) {
				this.select[item.attr] = item.option
			}; */
			return item.multiple ? [] : ''
		case 'group':
			/* return item.group.options.forEach((item) => {
				this.formModel[item.attr] = ''
			}) */
			return
		case 'rate':
			return 0
		case 'checkout':
			return []
		default:
			return ''
	}
}

function $InitEdit(_item){
	return _item.value || _item.type == 'tag' ? [] : ''
}

function $PresetAssignEditStatus(_item,_template) {
	switch (_item.type) {
		case 'tag':
			let _tags = _template[_item.attr]
			if (Array.isArray(_tags)) {
				return _tags
			} else {
				if (_tags === '') {
					// 如果模板值为!!() == false
					return []
				} else {
					// 如果模板值为!!() == true
					return _tags.split(',')
				}
			}
		case 'group':
			if (_item.group.resolve == 'array') {
				return _template[_item.attr]
			} else {
				let _temp = {}
				_item.group.options.forEach((child) => {
					_temp[child.attr] =
						_template[child.attr]
				})
				return _temp
			}
		case 'picker':
			if (_template[_item.attr].length == 4) {
				return `${_template[_item.attr]
					}-01-01`
			} else {
				return String(
					_template[_item.attr]
				)
			}
		case 'upload':
			if (typeof _template[_item.attr] == 'string') {
				return /,/g.test(
					_template[_item.attr]
				)
					? _template[_item.attr].split(',')
					: _template[_item.attr]
			} else {
				if (_template[_item.attr]) {
					return _template[_item.attr]
				} else {
					return ""
				}
			}
		case 'checkout':
			return [String(_template[_item.attr])]
		case 'radio':
			return String(
				_template[_item.attr]
			)
		case 'select':
			if (_item.multiple) {
				return _template[
					_item.attr
				].split(',')
			} else {
				return _template[_item.attr]
			}
		default:
			if (_item.attr in _template) {
				return _template[_item.attr]
			} else {
				return ''
			}
	}
}

function $PresetAssignAddStatus(_item,_template) {
	if (_item.type == 'tag') {
		if(_template[_item.attr]){
			return Array.isArray(_template[_item.attr]) ? _template[_item.attr] : _template[_item.attr].split(',')
		};
		return [];
	} else {
		return _template[_item.attr]
	}
}