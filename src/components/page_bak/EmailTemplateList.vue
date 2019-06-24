<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades" ></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" class="mr10" @click="handleAdd" v-if="home.user.authIds.indexOf('1') >= 0">新增</el-button>
            </div>
            <el-table :data="tableData" border class="table">
                                <el-table-column prop="title" label="邮件标题" >
                </el-table-column>
                <el-table-column prop="content" label="邮件内容" >
                </el-table-column>
                <el-table-column label="启用禁用" align="center" v-if="home.user.authIds.indexOf('1') >= 0">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="startStop(scope.$index)" :active-value="1" :inactive-value="0"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" v-if="home.user.authIds.indexOf('1') >= 0 && home.user.authIds.indexOf('1') >= 0">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit"  @click="handleEdit(scope.$index, scope.row)" v-if="home.user.authIds.indexOf('1') >= 0">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"  @click="handleDelete(scope.row, false)" v-if="home.user.authIds.indexOf('1') >= 0">逻辑删除</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"  @click="handleDelete(scope.row, true)" v-if="home.user.authIds.indexOf('1') >= 0">物理删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="prev, pager, next" :total="dataCount">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible="editVisible" width="30%" :show-close=false>
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="邮件标题" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="邮件内容" prop="content">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleEditClose">取 消</el-button>
                <el-button type="primary" @click="saveEdit()">确 定</el-button>
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
    import bus from '../common_bak/bus';
    export default {
        name: 'SmsTemplateList',
        data() {
            return {
                rules:{
                    title:[
                        { required: true, message: '请输入邮件标题', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    content:[
                        { required: true, message: '请输入邮件内容', trigger: 'blur' },
                        { min: 1, max: 70, message: '长度在 1 到 70 个字符', trigger: 'blur' }
                    ]
                },
                listDataUrl: 'http://localhost:20122/api/customer/emailtemplate/list',
                formInsertUrl: 'http://localhost:20122/api/customer/emailtemplate/insert',
                formUpdateUrl: 'http://localhost:20122/api/customer/emailtemplate/update',
                formRealDeleteUrl: 'http://localhost:20122/api/customer/emailtemplate/delete',
                formLogicDeleteUrl: 'http://localhost:20122/api/customer/emailtemplate/logicdelete',
                tableData: [],
                query:{
                    'page.currentPage':1
                },
                dataCount:0,
                form:{},
                editVisible: false,
                delVisible: false,
                delId: -1,
                waitting: false,
                realDel:false
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
                this.query['page.currentPage'] =val;
                this.getData();
            },
            getData() {
                this.$http.get(bus.url.EmailTemplateList.listDataUrl,{params:this.query}).then((response) => {
                    if(bus.commonResultSuccess(response,this.$router)){
                        this.tableData = response.body.result;
                        this.dataCount =  response.body.count;
                    }
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error("服务器异常");
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
            handleDelete(row, realDel) {
                this.delId = row.id;
                this.realDel = realDel;
                this.delVisible = true;
            },
            handleEditClose(){
                this.$refs['form'].resetFields();
                this.editVisible = false
            },
            // 保存编辑
            saveEdit() {
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        return
                    }
                    if(this.waitting){
                        return;
                    }
                    this.waitting = true;
                    if(this.form.id && this.form.id>0){
                        //更新
                        this.$http.post(bus.url.EmailTemplateList.formUpdateUrl,this.form).then((response) => {
                            if(bus.commonResultSuccess(response,this.$router)){
                                this.editVisible = false;
                                this.init();
                                this.$message.success(`更新成功`);
                            }
                            this.delayEndWaitting();
                        }, (response) => {
                            // 响应错误回调
                            console.log(response);
                            this.$message.error("服务器异常");
                            this.delayEndWaitting();
                        });
                    }else {
                        this.$http.post(bus.url.EmailTemplateList.formInsertUrl,this.form).then((response) => {
                            if(bus.commonResultSuccess(response,this.$router)){
                                this.editVisible = false;
                                this.init();
                                this.$message.success(`添加成功`);
                            }
                            this.delayEndWaitting();
                        }, (response) => {
                            // 响应错误回调
                            console.log(response);
                            this.$message.error("服务器异常");
                            this.delayEndWaitting();
                        });
                    }
                });
            },
            // 确定删除
            deleteRow(){
                if(this.waitting){
                    return;
                }
                var delUrl = '';
                if(this.realDel){
                    delUrl = bus.url.EmailTemplateList.formRealDeleteUrl;
                }else {
                    delUrl = bus.url.EmailTemplateList.formLogicDeleteUrl
                }
                this.waitting = true;
                this.$http.get(delUrl,{params:{id:this.delId}}).then((response) => {
                    if(bus.commonResultSuccess(response,this.$router)){
                        this.init();
                        this.$message.success('删除成功');
                    }
                    this.delayEndWaitting();
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error("服务器异常");
                    this.delayEndWaitting();
                });
                this.delVisible = false;
            },
            startStop(idx){
                if(this.waitting){
                    this.tableData[idx].status =this.tableData[idx].status^1;
                    return;
                }
                this.waitting = true;
                this.$http.post(bus.url.EmailTemplateList.formUpdateUrl,this.tableData[idx]).then((response) => {
                    if(bus.commonResultSuccess(response,this.$router)){
                        this.$message.success(`更新成功`);
                        this.tableData[idx].updateVersion ++;
                    }else {
                        this.tableData[idx].status =this.tableData[idx].status^1;
                    }
                    this.delayEndWaitting();
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error('系统异常');
                    this.tableData[idx].status =this.tableData[idx].status^1;
                    this.delayEndWaitting();
                });
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
