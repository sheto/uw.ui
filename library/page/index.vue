<template>
    <Card class="pager-container">
		<div class="pager-content__size">
			<slot></slot>
		</div>
		<!-- 分页 -->
		<div class="pager-pagination__warp">
			<Pagination
				class="pager-pagination__size"
				:pager-count="5"
				:page-count="pages"
				@current-change="handleCurrentChange"
				:current-page.sync="currentPage"
				layout="total, prev, pager, next, jumper"
				:total="total"
			/>
		</div>
    </Card>
</template>
<script>
import { Card,Pagination } from "element-ui";
export default {
	name:"Page",
	components:{Card,Pagination},
    props:{
        total:{
            type:Number,
            required:true
        }
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
            pages:0
        }
    },
    methods:{
        handleCurrentChange(val) {
            this.$emit('pagechange',val-1)
        }
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

