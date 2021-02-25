<template>
	<span v-if="counter>0">{{counter}}</span>
</template>
<script>
export default {
	name:"Counter",
	data(){
		return {
			counter:0
		}
	},
	props:{
		time:{
			type:Number,
			required:true
		}
	},
	created(){
		this.handleTimePass(this.time)
	},
	methods:{
		handleTimePass(end,time = 15) {
			let _time = time*60*1000,
				_end = end,
				_now = new Date().getTime();
			//相差的总秒数
			let _countDown = _time - (_now - _end);
			let _second =  parseInt(_countDown%60000/1000),
				_minute = parseInt(_countDown/60000);
			//重置
			_minute = _minute<10?'0'+_minute:_minute;
			_second = _second<10?'0'+_second:_second;
			//赋值
			this.counter = _minute + ":" +_second;
			if(_countDown > 182){
				setTimeout(()=>{
					this.handleTimePass(end);
				},1000)
			}
		}
	}
}
</script>
