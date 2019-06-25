<template>
    <div class="table">
        <div class="container">
            <el-table :data="tableData" border class="table">
                <el-table-column prop="simpleCode" label="行政简码" >
                </el-table-column>
                <el-table-column prop="simpleAddr" label="简地址" >
                </el-table-column>
                <el-table-column prop="fullAddr" label="全路径地址" >
                </el-table-column>
                <el-table-column prop="layer" label="等级" >
                </el-table-column>
                <el-table-column prop="parentCode" label="父编码" >
                </el-table-column>
                <el-table-column prop="province" label="省" >
                </el-table-column>
                <el-table-column prop="city" label="城市" >
                </el-table-column>
                <el-table-column prop="area" label="区域" >
                </el-table-column>
                <el-table-column label="启用禁用" align="center" v-if="home.user.authIds.indexOf('1') >= 0">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" @change="startStop(scope.$index)" :active-value="1" :inactive-value="0"></el-switch>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :total="dataCount" :page-size="query['page.pageSize']">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible="editVisible" width="30%" :show-close=false>
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="行政简码" prop="simpleCode">
                    <el-input v-model.number="form.simpleCode"></el-input>
                </el-form-item>
                <el-form-item label="简地址" prop="simpleAddr">
                    <el-input v-model="form.simpleAddr"></el-input>
                </el-form-item>
                <el-form-item label="全路径地址" prop="fullAddr">
                    <el-input v-model="form.fullAddr"></el-input>
                </el-form-item>
                <el-form-item label="等级" prop="layer">
                    <el-input v-model="form.layer"></el-input>
                </el-form-item>
                <el-form-item label="父编码" prop="parentCode">
                    <el-input v-model="form.parentCode"></el-input>
                </el-form-item>
                <el-form-item label="省" prop="province">
                    <el-input v-model="form.province"></el-input>
                </el-form-item>
                <el-form-item label="城市" prop="city">
                    <el-input v-model="form.city"></el-input>
                </el-form-item>
                <el-form-item label="区域" prop="area">
                    <el-input v-model="form.area"></el-input>
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
    import bus from '../common/bus';
    export default {
        name: 'SmsTemplateList',
        data() {
            return {
                rules:{
                    simpleCode:[
                        { required: true, message: '请输入行政简码', trigger: 'blur' },
                        { type: 'number', message: '行政简码必须为数字值'}
                    ],
                    simpleAddr:[
                        { required: true, message: '请输入简地址', trigger: 'blur' },
                        { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
                    ],
                    fullAddr:[
                        { required: true, message: '请输入全路径地址', trigger: 'blur' },
                        { min: 1, max: 64, message: '长度在 1 到 64 个字符', trigger: 'blur' }
                    ],
                    layer:[
                        { required: true, message: '请输入等级', trigger: 'blur' },
                        { min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'blur' }
                    ],
                    parentCode:[
                        { required: true, message: '请输入父编码', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    province:[
                        { required: true, message: '请输入省', trigger: 'blur' },
                        { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
                    ],
                    city:[
                        { required: true, message: '请输入城市', trigger: 'blur' },
                        { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
                    ],
                    area:[
                        { required: true, message: '请输入区域', trigger: 'blur' },
                        { min: 1, max: 32, message: '长度在 1 到 32 个字符', trigger: 'blur' }
                    ],
                },
                tableData: [],
                query:{
                    'page.currentPage':1,
                    'page.pageSize' : 10
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
                this.getData()
            },
            // 分页导航
            handleCurrentChange(val) {
                this.query['page.currentPage'] =val;
                this.getData();
            },
            getData() {
                if(this.waitting){
                    return;
                }
                this.waitting = true;
                this.$http.get(bus.url.AreaList.listDataUrl,{params:this.query}).then((response) => {
                    if(bus.commonResultSuccess(response,this.$router)){
                    this.tableData = response.body.result;
                    this.dataCount =  response.body.count;
                    }
                    this.delayEndWaitting();
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error("服务器异常");
                    this.delayEndWaitting();
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
                this.form = {};
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
                    this.$http.post(bus.url.AreaList.formUpdateUrl,this.form).then((response) => {
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
                            this.$message.error("服务器异常");
                            this.delayEndWaitting();
                    });
                }else {
                    this.$http.post(bus.url.AreaList.formInsertUrl,this.form).then((response) => {
                        if(bus.commonResultSuccess(response,this.$router)){
                            this.editVisible = false;
                            this.waitting = false;
                            this.init();
                            this.$message.success(`添加成功`);
                        }else {
                            this.delayEndWaitting();
                        }
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
                    delUrl = bus.url.AreaList.formRealDeleteUrl;
                }else {
                    delUrl = bus.url.AreaList.formLogicDeleteUrl
                }
                this.waitting = true;
                this.$http.get(delUrl,{params:{id:this.delId}}).then((response) => {
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
                this.$http.post(bus.url.AreaList.formUpdateUrl,this.tableData[idx]).then((response) => {
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
