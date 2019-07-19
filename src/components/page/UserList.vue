<template>
    <div class="table">
        <div class="crumbs" v-if="home.user.authIds.indexOf('1') >= 0">
            <el-header style="text-align: right; font-size: 12px">
                <el-button type="primary" class="mr10" size="medium" @click="handleAdd">新增</el-button>
            </el-header>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.username" placeholder="用户名" class="handle-input mr10" style="width:150px"></el-input>
                <el-input v-model="query.nickname" placeholder="昵称" class="handle-input mr10" style="width:150px"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                <el-button type="primary" icon="el-icon-delete" @click="clearQuery">清空</el-button>
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
                <el-table-column label="启用禁用" align="center" v-if="(home.user.authIds.indexOf('1') >= 0)">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="change(scope.$index)" :active-value="1" :inactive-value="0"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" v-if="(home.user.authIds.indexOf('11') >= 0)||(home.user.authIds.indexOf('12') >= 0)">
                    <template slot-scope="scope">
                        <el-button v-if="(home.user.authIds.indexOf('11') >= 0)" type="text" icon="el-icon-edit"  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button v-if="(home.user.authIds.indexOf('12') >= 0)" type="text" icon="el-icon-delete" class="red"  @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
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
        data() {
            return {
                rules:{
                    username:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ]
                },
                roleListUrl: bus.url.basePath + '/api/sys/role/list',
                tableDataUrl: bus.url.basePath + '/api/sys/user/listvo',
                formInsertUrl: bus.url.basePath + '/api/sys/user/insertuservo',
                formUpdateUrl: bus.url.basePath + '/api/sys/user/updateuservo',
                formDeleteUrl: bus.url.basePath + '/api/sys/user/delete',
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
                this.$http.post(this.formUpdateUrl,this.tableData[idx]).then((response) => {
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
                this.$http.get(this.roleListUrl,{params:{status:1}}).then((response) => {
                    if(bus.commonResultSuccess(response,this.$router)){
                        this.roleList = response.body.result;
                    }
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error('服务器崩溃了');
                });

            },
            init(){
                this.roleListData();
                this.getData();
            },
            // 分页导航
            handleCurrentChange(val) {
                this.getData();
            },
            search(){
                if(this.query.username == ''){
                    delete this.query.username;
                }
                if(this.query.password == ''){
                    delete this.query.password;
                }
                if(this.query.nickname == ''){
                    delete this.query.nickname;
                }
                this.getData();
            },
            clearQuery(){
                this.query = {
                    'page.currentPage':1
                };
            },
            getData() {
                if(this.waitting){
                    return;
                }
                this.waitting = true;
                this.$http.get(this.tableDataUrl,{params:this.query}).then((response) => {
                    if(bus.commonResultSuccess(response,this.$router)){
                        this.tableData = response.body.result;
                        this.dataCount =  response.body.count;
                    }
                    this.delayEndWaitting();
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error('服务器崩溃了');
                    this.delayEndWaitting();
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
                    this.$http.post(this.formUpdateUrl,this.form).then((response) => {
                        if(bus.commonResultSuccess(response,this.$router)){
                            this.editVisible = false;
                            this.waitting = false;
                            this.init();
                            this.$message.success(`更新成功`);
                        }else {
                            this.delayEndWaitting();
                        }
                    }, (response) => {
                        // 响应错误回调
                        console.log(response);
                        this.$message.error('执行失败');
                        this.delayEndWaitting();
                    });
                }else {
                    this.$http.post(this.formInsertUrl,this.form).then((response) => {
                        if(bus.commonResultSuccess(response,this.$router)){
                            this.waitting = false;
                            this.init();
                            this.$message.success(`添加成功`);
                        }else {
                            this.delayEndWaitting();
                        }
                        this.editVisible = false;
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
                    if(bus.commonResultSuccess(response,this.$router)){
                        this.waitting = false;
                        this.init();
                        this.$message.success('删除成功');
                    }else {
                        this.delayEndWaitting();
                    }
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
