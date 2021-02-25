export function $copy(_obj){
	let newObj = {};
	Object.keys(_obj).forEach(_key=>{
		if(Array.isArray(_obj[_key])){
			newObj[_key] = Array.from(_obj[_key])
		}else if(typeof _obj[_key] === "object"){
			newObj[_key] = $copy(_obj[_key])
		}else{
			newObj[_key] = _obj[_key]
		}
	});
	return newObj
}