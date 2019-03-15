### Table表格


	html

	<v-table
		:tableData="tableData"
		:callback="updateCallBack"
		@on-custom-comp="customCompFunc1"
		:update="updateTimer">
	</v-table>

	js

	tableData： {
		requestUrl： //表格请求数据
		originData： //表格数据 当requestUrl未设置时 表格数据为 originData
		show: 是否显示
		key: //每行tr关键字
		css: 表格自定义样式
		showPage: true/false //是否支持分页
		pagePer： number //每页多少条
		sortOrder: ["string"] //表头支持排序的列
		sortOpt: Object  key为表头排序的关键字 value为asc/desc
		columns: [{
			title: string, //表头文字
			field: string //表头关键字
			format(data, rowsData) 数据转换 值为return的值
			componentName: string //自定义组件名称
			parseHtml: ture / false 是否显示为html
			width: string / percent 列宽度
		}
		...
		]

	}


	自定义表格列
	例：

	colums: [{
		componentName: "table-operation"
	}]

	// 自定义列组件
    Vue.component('table-operation', {
        template:`<div>
        	<a href="" @click.stop.prevent="update(rowData,field)">编辑</a>&nbsp;
        	<a href="" @click.stop.prevent="deleteRow(rowData,field)">删除</a>
        </div>`,
        props:["rowData", "field", "index", "tableData"],
        methods:{
            update(rowData, field){

              console.log("xxxx");
            },

            deleteRow(){

                // 参数根据业务场景随意构造
                let params = {type:'delete',index: this.index};
                this.$emit('on-custom-comp',params); //必须 触发表格的自定义事件

            }
        }
    });

callback 表格更新后的回调

update 表格更新时间  数值为ms


