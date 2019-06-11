<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades" ></i> 基础表格</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" class="mr10" @click="handleAdd" v-if="(home.user.authIds.indexOf('19') >= 0)">新增</el-button>
            </div>
            <el-table :data="tableData" border class="table">
                <el-table-column prop="username" label="用户名" >
                </el-table-column>
                <el-table-column prop="nickname" label="昵称" >
                </el-table-column>
                <el-table-column prop="sysRolePOList" label="角色" :formatter="roleFormatter">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间">
                </el-table-column>
                <el-table-column label="启用禁用" align="center" v-if="(home.user.authIds.indexOf('20') >= 0)">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="change(scope.$index)" :active-value="1" :inactive-value="0"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" v-if="(home.user.authIds.indexOf('21') >= 0)||(home.user.authIds.indexOf('22') >= 0)">
                    <template slot-scope="scope">
                        <el-button v-if="(home.user.authIds.indexOf('21') >= 0)" type="text" icon="el-icon-edit"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button v-if="(home.user.authIds.indexOf('22') >= 0)" type="text" icon="el-icon-delete" class="red"  @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
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
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="用户名"  prop="username">
                    <el-input v-model="form.username" :disabled="someReadOnly"></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="form.nickname"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-checkbox-group v-model="form.roleIds">
                        <el-checkbox  v-for="(item,index) in roleList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
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
    import bus from '../common/bus';
    export default {
        name: 'userlist',
        data() {
            return {
                rules:{
                    username:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ]
                },
                roleList:[],
                value1:true,
                tableData: [],
                query:{
                    'page.currentPage':1
                },
                dataCount:0,

                someReadOnly:true,
                form:{roleIds:[]},
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
            change(idx){
                if(this.waitting){
                    this.tableData[idx].status =this.tableData[idx].status^1;
                    return;
                }
                this.waitting = true;
                this.$http.post(bus.url.UserList.formUpdateUrl,this.tableData[idx]).then((response) => {
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
            },
            roleFormatter(row, column){
                var role = '';
                this.roleList.forEach((item)=>{
                    if(row.roleIds.indexOf(item.id)>=0){
                            role = role + item.name +' ';
                    }
                });
                return role;
            },
            roleListData(){
                this.$http.get(bus.url.UserList.roleListUrl).then((response) => {
                    if(response.body.success){
                        this.roleList = response.body.result;
                    }else {
                        this.$message.error(response.body.message);
                    }
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error('请求服务器失败');
                });

            },



            init(){
                this.getData();
                this.roleListData();
            },
            // 分页导航
            handleCurrentChange(val) {
                this.getData();
            },
            getData() {
                this.$http.get(bus.url.UserList.tableDataUrl,{params:this.query}).then((response) => {
                    if(response.body.success){
                        this.tableData = response.body.result;
                        this.dataCount =  response.body.count;
                    }else {
                        this.$message.error(response.body.message);
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
                this.someReadOnly =false;
                this.form = {roleIds:[]};
                this.editVisible = true;
            },
            handleEdit(index, row) {
                this.form = JSON.parse(JSON.stringify(this.tableData[index]));
                this.editVisible = true;
            },
            handleDelete(index, row) {
                this.someReadOnly =true;
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
                    this.$http.post(bus.url.UserList.formUpdateUrl,this.form).then((response) => {
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
                    this.$http.post(bus.url.UserList.formInsertUrl,this.form).then((response) => {
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
                this.$http.get(bus.url.UserList.formDeleteUrl,{params:{id:this.delId}}).then((response) => {
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
