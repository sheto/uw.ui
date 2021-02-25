<template>
    <Card class="pager-container">
		<div class="pager-content__size">
			<Table :data="table" @selection-change="$select">
				<slot></slot>
			</Table>
		</div>
		<!-- 分页 -->
		<div class="pager-pagination__warp">
			<Pagination
				class="pager-pagination__size"
				:pager-count="5"
				:page-count="pages"
				@current-change="$change"
				:current-page.sync="currentPage"
				layout="total, prev, pager, next, jumper"
				:total="total"
			/>
		</div>
    </Card>
</template>
<script>
import { Pagination,Table,Card } from "element-ui";
export default {
	name:"Page",
	components:{ Pagination,Table,Card },
    props:{
		source:{
			type:String,
			required:true
		},
		method:{
			type:String,
			default:"get"
		},
		page:{
			type:String,
			default:"page"
		},
		param:{
			type:Object,
			default(){
				return {}
			}
		},
		attr:String
    },
    watch:{
        total(n){
			this.pages = Math.ceil(n/10);
			this.currentPage = 1;
        }
    },
    data(){
        return {
            //分页数据
            currentPage: 1,
			pages:0,
			query:{},
			total:0,
			table:[]
        }
    },
    methods:{
        $change(val) {
			this.$init({
				[this.page]:val
			})
        },
		$success(_message){
			this.$message.success(_message);
			// 每次提醒后就刷新数据
			this.$init();
		},
		$clean(_key){
			Reflect.deleteProperty(this.query,_key)
			this.$init()
		},
		$select(_data){
			this.$emit("select",Array.from(_data))
		},
		$init(_query){
			let request;
			let source = this.source;
			// 合并查询参数
			if(_query){ Object.assign(this.query,_query); }
			// 获取源数据
			if(Object.keys(this.query).length > 0){
				request = this.$ajax[this.method](source,this.method === "get"?{ params:this.query }:this.query);
			}else{
				request = this.$ajax[this.method](source)
			}
			// 初始化源数据
			request.then((_data) => {
				try{
					if(this.attr){
						this.table = Array.from(_data[this.attr]);
						this.total = _data.total
					}else{
						this.table = Array.from(_data)
						this.total = _data.length
					}
				}catch(_err){
					if(_data[this.attr] === null){
						this.table = []
					}else{
						this.$message.error("数据初始化失败,请重试！");
					}
				}
			})
		}
	},
	created(){
		// 合并初始化数据
		if(Object.keys(this.param).length > 0){
			Object.assign(this.query,this.param)
		};
		// 请求数据
		this.$init({
			[this.page]:1
		})
	}
}
</script>
<style scoped>
	.pager-container{
		position: relative;
		height: 100%;
		width: 100%;
	}
	.pager-content__size{
		width: 100%;
		max-height: calc(100% - 80px);
	}
	.pager-pagination__warp{
		height: 60px;
		width: 100%;
		overflow: hidden;
	}
	.pager-pagination__size{
		text-align:center;
		margin-top: 20px;
	}
</style>