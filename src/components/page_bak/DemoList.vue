<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades" ></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="delete" class="mr10" @click="handleAdd">保存</el-button>
            </div>
            <el-table :data="tableData" border class="table">
                <el-table-column prop="name" label="活动名称" >
                </el-table-column>
                <el-table-column prop="nature" label="活动性质" >
                </el-table-column>
                <el-table-column prop="activityTime" label="活动时间">
                </el-table-column>
                <el-table-column prop="contacts" label="对接人">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="prev, pager, next" :total="dataCount">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="活动性质">
                    <el-input v-model="form.nature"></el-input>
                </el-form-item>
                <el-form-item label="活动时间">
                    <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
                                    v-model="form.activityTime"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="对接人">
                    <el-input v-model="form.contacts"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

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
    export default {
        name: 'basetable',
        data() {
            return {
                tableDataUrl: 'http://localhost:20122/api/sys/sysrol/listrolevo',
                formInsertUrl: 'http://localhost:20122/api/customer/activityinfo/insert',
                formUpdateUrl: 'http://localhost:20122/api/customer/activityinfo/update',
                formDeleteUrl: 'http://localhost:20122/api/customer/activityinfo/delete',
                tableData: [],
                query:{
                    'page.currentPage':1
                },
                dataCount:0,
                form:{},
                editVisible: false,
                delVisible: false,
                delId: -1,
                waitting: false
            }
        },
        mounted() {
            this.init();
        },
        computed: {
        },
        methods: {
            init(){
                this.getData();
            },
            // 分页导航
            handleCurrentChange(val) {
                this.getData();
            },
            getData() {
                this.$http.get(this.tableDataUrl,{params:this.query}).then((response) => {
                    if(response.body.success){
                        this.tableData = response.body.result;
                        this.dataCount =  response.body.count;
                    }else {
                        this.$message.error('数据加载失败,请重试');
                    }
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                });
            },
            delayEndWaitting(){
                setTimeout(() =>{
                    this.waitting = false;
                },1000);
            },
            handleAdd() {
                this.form = {};
                this.editVisible = true;
            },
            handleEdit(index, row) {
                this.form = JSON.parse(JSON.stringify(this.tableData[index]));
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.delId = row.id;
                this.delVisible = true;
            },
            // 保存编辑
            saveEdit() {
                if(this.waitting){
                    return;
                }
                this.waitting = true;
                if(this.form.id && this.form.id>0){
                    //更新
                    this.$http.post(this.formUpdateUrl,this.form).then((response) => {
                        if(response.body.success){
                            this.editVisible = false;
                            this.init();
                            this.$message.success(`更新成功`);
                        }else {
                            this.$message.error(response.body.message);
                        }
                        this.delayEndWaitting();
                    }, (response) => {
                        // 响应错误回调
                        console.log(response);
                        this.$message.error('执行失败');
                        this.delayEndWaitting();
                    });
                }else {
                    this.$http.post(this.formInsertUrl,this.form).then((response) => {
                        if(response.body.success){
                            this.init();
                            this.$message.success(`添加成功`);
                        }else {
                            this.$message.error(response.body.message);
                        }
                        this.editVisible = false;
                        this.delayEndWaitting();
                    }, (response) => {
                        // 响应错误回调
                        console.log(response);
                        this.$message.error('执行失败');
                        this.delayEndWaitting();
                    });
                }
            },
            // 确定删除
            deleteRow(){
                if(this.waitting){
                    return;
                }
                this.waitting = true;
                this.$http.get(this.formDeleteUrl,{params:{id:this.delId}}).then((response) => {
                    if(response.body.success){
                        this.init();
                        this.$message.success('删除成功');
                    }else {
                        this.$message.error(response.body.message);
                    }
                    this.delayEndWaitting();
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error('执行失败');
                    this.delayEndWaitting();
                });
                this.delVisible = false;
            }
        }
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
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
</style>
