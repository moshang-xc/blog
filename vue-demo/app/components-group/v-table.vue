<template>
    <div class="form-group"  v-show="tableData.show" :class="tableData.css">
        <table class="table table-fixed">
            <thead>
                <tr>
                    <td v-for="columns in tableData.columns"
                        :width="columns.width"
                        :class="columns.css" class="fixed">
                        {{columns.title}}
                        <span v-if="tableData.sortOpt[columns.field]" @click="sortTable(columns.field)">排序</span>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(rowsData, rowsIndex) in pageData" :data-key="rowsData[tableData.key]">
                    <template v-for="(columns, index) in tableData.columns">
                        <td v-if="!columns.componentName"
                            :style="{'width': columns.width}">
                            <div
                            v-html="setHtml(columns, rowsData)"
                            :title="showTitle(columns, rowsData)"
                            :class="columns.css"
                            class="fixed"></div>
                        </td>
                        <!--自定义组件-->
                        <td v-if="columns.componentName"
                            :class="columns.css"
                            class="fixed">
                            <component :is="columns.componentName"
                                @on-custom-comp="customCompFunc"
                                :rowData="formatData(columns,rowsData)"
                                :field="columns.field"
                                :index="getCustonIndex(rowsIndex)"
                                :style="{'width': columns.width}">
                            </component>
                        </td>
                    </template>
                </tr>
            </tbody>
        </table>
        <div class="table-footer clearfix" v-if="tableData.showPage">
            <a class="table-btn" @click="gotoPage('prev')" :class="{'disabled': tableData.page === 0}">上一页</a>
            <a class="table-btn" :class="{'active': footerBtn.value == tableData.page}" v-for="footerBtn in footer" @click="gotoPage(footerBtn.value)">{{footerBtn.text}}</a>
            <a class="table-btn" @click="gotoPage('next')" :class="{'disabled': tableData.page === (tableData.totalPage-1)}">下一页</a>
        </div>
    </div>
</template>

<script>
import { setOptions, escapeText, sortByKey } from '@/libs/utils';

let defaluts = {
    columns: [], //表头配置
    show: true,
    showPage: false, //分页
    pagePer: 3, //每页多少数据
    totalPage: 1, //共几页
    page: 0, //当前页  从0开始
    key: "", //关键标志

    sortOpt:{}, //哪些节点支持排序
    sortOrder:[] //排序顺序
};

export default {
    name: "v-table",
    props: ["tableData", "callback", "update"],
    created(){
        //数据合并
        this.tableData = this.setOptions(this.tableData, defaluts);
        if(this.tableData.originData) {
            return;
        }
        //未定义时 先初始化originData
        this.$set(this.tableData, 'originData', []);
    },

    mounted() {
        this.tabaleCallback = this.callback || function() {};
        this.getTableData();
    },

    data() {
        return {
            pageData: [], //当前页数据
            footer: [], //
            updateTimer: null, //定时器
            sortKey: null, // 排序元素
            sortType: "asc"
        };
    },

    methods: {
        //自定义事件
        customCompFunc(params){
            //触发父组件的自定义事件
            this.$emit('on-custom-comp', params);
        },

        setHtml(tdField, groupData) {
            //转换后的html
            let formatHtml = "";
            if(typeof tdField.format === "function") { //自定义fomat
                formatHtml = tdField.format(groupData[tdField.field], groupData);
                if(!tdField.parseHtml) { //是否需要显示为html
                    formatHtml = escapeText(formatHtml);
                }
            } else {
                formatHtml = escapeText(groupData[tdField.field]);
            }
            return formatHtml;
        },

        formatData(fieldData, rowsData) {
            let field = fieldData.field;
            if(typeof fieldData.format === "function") {
                rowsData[field] = fieldData.format(rowsData[field], rowsData);
            }

            return rowsData;
        },

        showTitle(tdField, groupData) {
            let formatHtml = "";
            if(typeof tdField.format === "function") {
                formatHtml = tdField.format(groupData[tdField.field], groupData);
                if(tdField.parseHtml) {
                    formatHtml = "";
                }
            } else {
                formatHtml = groupData[tdField.field];
            }
            return formatHtml;
        },

        updateTable() {
            //更新总页数
            if(this.tableData.showPage) {
                this.tableData.totalPage = Math.ceil(this.tableData.originData.length / this.tableData.pagePer);
                this.tableData.totalPage <= 1 ? this.tableData.totalPage = 1 : '';

                //更新当前页
                if(this.tableData.totalPage - 1 < this.tableData.page) {
                    this.tableData.page = this.tableData.totalPage - 1;
                }
                this.updateFooter();
            }

            //当前页显示的数据
            this.pageData = this.getPageData();
            //this.tableData.pageData = this.pageData;

            this.tabaleCallback(); //执行表格更新的回调
        },

        updateFooter() { //更新表格的页操作
            this.footer = [];
            let footerArr = [];

            if(this.tableData.totalPage >= 8) {
                for(let i = 0; i < this.tableData.totalPage; i++) {
                    if(Math.abs(this.tableData.page - i) < 3) {
                        footerArr.push({
                            text: i + 1,
                            value: i
                        });
                    }
                }

                if(footerArr.length < 5) {
                    if(footerArr[0].value === 0) { //向后扩展
                        while (footerArr.length < 5) {
                            footerArr.push({
                                text: footerArr[footerArr.length - 1].text + 1,
                                value: footerArr[footerArr.length - 1].value + 1
                            });
                        }

                    } else if(footerArr[footerArr.length - 1].value === this.tableData.totalPage - 1) { //向前扩展
                        while (footerArr.length < 5) {
                            footerArr.unshift({
                                text: footerArr[0].text - 1,
                                value: footerArr[0].value - 1
                            });
                        }
                    }
                }

                //

                if(footerArr[0].value < 3) {
                    while (footerArr[0].value != 0) {
                        footerArr.unshift({
                            text: footerArr[0].text - 1,
                            value: footerArr[0].value - 1
                        });
                    }
                } else {
                    footerArr.unshift({
                        text: "...",
                        value: - 1
                    });
                    footerArr.unshift({
                            text: 1,
                            value: 0
                        });
                }
                if(this.tableData.totalPage - 1 - footerArr[footerArr.length - 1].value < 3) {
                    while (footerArr[footerArr.length - 1].value != this.tableData.totalPage - 1) {
                        footerArr.push({
                            text: footerArr[footerArr.length - 1].text + 1,
                            value: footerArr[footerArr.length - 1].value + 1
                        });
                    }
                } else {
                    footerArr.push({
                        text: "...",
                        value: - 1
                    });
                    footerArr.push({
                        text: this.tableData.totalPage,
                        value: this.tableData.totalPage - 1
                    });
                }
                this.footer = footerArr;

            } else {
                for(let i = 0; i < this.tableData.totalPage; i++) {
                    this.footer.push({
                        text: i + 1,
                        value: i
                    });
                }
            }


        },

        getCustonIndex(index) {
            return this.tableData.page * this.tableData.pagePer + index;
        },

        gotoPage(nextPage) { //切换页
            if(nextPage == "prev") {
                nextPage = this.tableData.page - 1;

            } else if(nextPage == "next") {
                nextPage = this.tableData.page + 1;
            }

            if(nextPage < 0 || nextPage > this.tableData.totalPage - 1 || nextPage == this.tableData.page) {
                return;
            }

            this.tableData.page = nextPage;
            this.pageData = this.getPageData();
            this.updateFooter();

        },
        getPageData() {
            if(this.tableData.showPage) {
                return this.tableData.originData.slice(this.tableData.page * this.tableData.pagePer, (this.tableData.page+1) * this.tableData.pagePer);
            }
            return this.tableData.originData;
        },
        reload() {
            this.getTableData();
        },
        getTableData() {
            let _this = this;
            if(_this.tableData.requestUrl) { //请求数据
                this.sortKey = _this.tableData.sortOrder;
                this.$getData(_this.tableData.requestUrl, function(res) {
                    //数据修改后  执行监听回调
                     _this.tableData.originData = _this.sortData(res.list, _this.tableData.sortOpt);
                });
            }
        },
        sortTable(field) {
            let _this = this;

            //排序元素
            this.sortKey = field;

            //排序方式
            this.sortType = this.sortType == "asc" ? "desc" : "asc";

            //按照某列数据排序
            _this.tableData.originData = _this.sortData(_this.tableData.originData, {
                    [_this.sortKey]: _this.sortType
            });
        },

        sortData(data, sortConfig) {
            let _this = this;
            data = data ||[];
            return _this.sortKey ? data.sort(function(a, b) {
                return sortByKey(a, b, _this.sortKey, sortConfig);
            }) : data;
        }
    },
    watch:{
        'tableData.originData': {
            handler(newData, oldData) {
                let _this = this;

                //解决初次定义执行表格更新问题
                if(typeof oldData === "undefined") {
                    return;
                }
                this.updateTable();
            }
        },
       'update':{
            handler(newData) {
                clearInterval(this.updateTimer);
                let _this = this;
                if(newData) {
                    this.updateTimer = setInterval(function() {
                        _this.reload();
                    }, newData);
                }
            },
            //立即执行
            immediate: true
        }
    },
    destroyed() {
        clearInterval(this.updateTimer);
        this.updateTimer = null;
    }
};
</script>

<style lang="scss">

    .table {
        border-collapse: separate;
        border-spacing: 1px;
        text-align: center;
        &.table-fixed {
            table-layout: fixed;
        }
        tr {
            line-height: 30px;
        }
        tr:nth-child(even), thead tr {
            background: #ccc;
        }
        width: 100%;
        max-width: 100%;
        .fixed {
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: keep-all;
            white-space: nowrap;
        }
    }
    .table-footer {
        margin-top: 15px;
        line-height: 30px;
        .active {
            color: $main-active-color;
        }
        .table-btn {
            cursor: pointer;
            padding: 4px;
            border: 1px solid #ccc;
            float: left;
            & + .table-btn {
                border-left: none;
            }
            &.disabled {
                background: #ddd;
                cursor: not-allowed;
            }
        }
    }

</style>