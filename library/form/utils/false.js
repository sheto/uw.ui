export function $false(_data){
	// 是否空字符串
	if(typeof _data === "string"){
		if( _data === ""){
			return true
		}
	}
	// 是否null||undefined
	if(_data === null || _data === undefined){
		return true
	}
	// 是否空数组
	if(Array.isArray(_data) && _data.length === 0){
		return true
	}
}