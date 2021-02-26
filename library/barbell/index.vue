<script>
function render(h){
    let _vNode = []
    let _getType = child=>{
        switch(child.type){
            case "button":return [
                h('el-button',{
                    attrs:{
                        type:"primary",
                        size:"mini"
                    }
                },child.value)
            ];
            case "slot":return this.$slots[child.value||'default']
        }
    }
    if(this.response.length > 0){
        let _span = 'details' in this.response[0] ? 8:12;
        let $getChildren = function(child){
            return typeof child == 'string' ? 
                h('p',{
                    class:{
                        'barbell__title-isNull':child == ''
                    }
                },child) :
                h('div',{
                    class:'bar_text--height'
                },child.type?_getType(child):[
                    h('p',{
                        class:'bar--mini'
                    },child.sub),
                    h('p',{
                        class:{
                            'bar_text--large': child.size == 'large',
                            'bar_text--middle': child.size == 'middle'
                        }
                    },child.value)
                ])
        };
        let $getSon = function (item,index){
            return Object.keys(item).map(key=>{
                if(
                    key == 'value'||
                    key == 'exp'||
                    key == 'details'
                ){
                    return h('el-col',{
                        class:{
                            'bar_text--left':key !== 'exp',
                            'bar_text--right':key == 'exp',
                        },
                        attrs:{
                            span:_span
                        }
                    },[$getChildren(item[key])])
                }
            })
        }
        this.response.forEach((item,index)=>{
            if(item.slot && item.slot == 'title'){
                return _vNode.unshift(h('el-row',{
                    slot:'header',
                    class:'bar--mini'
                },$getSon(item,index)))
            }
            _vNode.push(h('el-row',$getSon(item,index)))
        })
        return h('el-card',{
            class:[
                'barbell',
                {'bar--mini':this.mini}
            ],
            attrs:{
                shadow:"never"
            }
        },_vNode)
    }
}
export default {
    name:'Barbell',
	render,
    props:{
        response:{
            type:Array,
            required: true
        },
        mini:{
            type:Boolean,
            default:false
        }
    },
    title:{
        type:Array
    },
}
</script>
<style lang="less" scoped>
    .bar_text--left{
        text-align: left;
    }
    .bar_text--right{
        text-align: right;
    }
    .bar--mini{
        font-size: 12px;
    }
    .bar_text--height{
        height: 72px;
    }
    .bar_text--large{
        font-size: 26px;
        font-weight: 600
    }
    .bar_text--middle{
        font-size: 18px;
        font-weight: 600
    }
    .barbell{
        margin-bottom:8px;
        height: 220px;
    }
    p{
        margin-block-start: 0;
        margin-block-end: 0;
    }
    .barbell__title p{
        margin-block-start: 1em;
        margin-block-end: 1em;
    }
    .barbell__title-isNull{
        margin-block-end: 1em;
    }
</style>