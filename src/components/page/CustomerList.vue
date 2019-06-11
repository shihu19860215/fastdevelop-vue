<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box" v-if="this.home.user.authIds.indexOf('7') >= 0">
                <el-button type="primary" icon="delete" class="mr10" @click="toDetailInsert">新增客户</el-button>
                <!--<el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">-->
                    <!--<el-option key="1" label="广东省" value="广东省"></el-option>-->
                    <!--<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
                <!--</el-select>-->
                <!--<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
                <!--<el-button type="primary" icon="search" @click="search">搜索</el-button>-->
            </div>
            <el-table :data="tableData" border class="table"  @expand-change="rowClick">
                <el-table-column label="客户姓名" prop="scope.row.customerInfoPO.name">
                    <template slot-scope="scope">
                    <a  href="javascript:void(0);" class="buttonText" style="color: #2d8cf0" @click="toDetailView(scope.row.customerInfoPO.id,scope.row.customerInfoPO.name)">{{scope.row.customerInfoPO.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="customerInfoPO.company" label="所在单位">
                </el-table-column>
                <el-table-column prop="customerInfoPO.position" label="职位">
                </el-table-column>
                <el-table-column prop="member" label="会员">
                </el-table-column>
                <el-table-column prop="customerInfoPO.birthday" label="生日">
                </el-table-column>
                <el-table-column prop="customerInfoPO.tel" label="手机号">
                </el-table-column>
                <el-table-column prop="customerInfoPO.mail" label="邮箱">
                </el-table-column>
                <el-table-column prop="areaId" label="所在区域">
                </el-table-column>
                <el-table-column prop="customerInfoPO.spare_contacts" label="备用联系人">
                </el-table-column>
                <el-table-column prop="customerInfoPO.appraise" label="'评价">
                </el-table-column>
                <el-table-column v-if="activityInfoVOList" label="活动"  type="expand">
                    <template slot-scope="props">
                        <el-table :data="activityInfoVOList" border class="table" ref="multipleTable"  >
                            <el-table-column  prop="activityInfoPO.name" label="活动名称" width="120">
                            </el-table-column>
                            <el-table-column prop="activityInfoPO.nature" label="活动性质">
                            </el-table-column>
                            <el-table-column prop="activityInfoPO.activityTime" label="活动时间">
                            </el-table-column>
                            <el-table-column prop="activityInfoPO.contacts" label="对接人">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column v-else label="活动" >
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" v-if="this.home.user.authIds.indexOf('8') >= 0">
                    <template slot-scope="scope">
                        <!--<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑-->
                        <!--</el-button>-->
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next"
                               :total="dataCount">
                </el-pagination>
            </div>
        </div>


        <!-- 删除提示框 -->
        <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
            <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        name: 'customerlist',
        data() {
            return {
                url: 'http://localhost:20122/api/customer/customerinfo/customerlist',
                tableData: [],
                dataCount:0,
                query:{
                    'page.currentPage':1,
                    'page.pageSize':10
                },
                activityInfoVOList:[],
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                editVisible: false,
                delVisible: false,
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
                idx: -1,
                waitting:false
            }
        },
        mounted() {
            this.getData();
        },
        computed: {
        },
        methods: {
            aaa(){
                return false;
            },
            toDetailView(id,name){
                this.$router.push({path:"/customerdetail",query:{"id":id,"tab":name}});
            },
            rowClick(obj){
                this.activityInfoVOList = obj.activityInfoVOList;
            },
            // 分页导航
            handleCurrentChange(val) {
                this.query['page.currentPage'] =val;
                this.getData();
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.$http.get(bus.url.CustomerList.customerListUrl,{params:this.query}).then((response) => {
                    this.tableData = response.body.result;
                    this.dataCount =  response.body.count;
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error("服务器异常");
                });
            },
            toDetailInsert(){
                this.$router.push('/customerdetail');
            },
            search() {
                this.is_search = true;
            },
            handleEdit(index, row) {
                this.idx = index;
                const item = this.tableData[index];
                this.form = {
                    name: item.name,
                    date: item.date,
                    address: item.address
                }
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.idx = index;
                this.delVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.$set(this.tableData, this.idx, this.form);
                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            },
            // 确定删除
            deleteRow() {
                if(this.waitting){
                    return;
                }
                this.waitting = true;
                this.$http.get(bus.url.CustomerList.customerDelUrl,{params:{"id":this.tableData[this.idx].customerInfoPO.id}}).then((response) => {
                    if(bus.commonResultSuccess(response,this.$router)){
                        this.getData()
                        this.$message.success('删除成功');
                    }
                    this.waitting = false;
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.success('系统出错');
                    this.waitting = false;
                });
                this.delVisible = false;
            }
        },
        props:["home"]
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .del-dialog-cnt {
        font-size: 16px;
        text-align: center
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }
</style>