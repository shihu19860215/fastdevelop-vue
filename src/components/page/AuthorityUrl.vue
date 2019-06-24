<template>
    <div class="table">
        <div class="container">
            <div class="custom-tree-container">
                <div class="block">
                    <el-tree
                            :data="tableData"
                            node-key="id"
                            default-expand-all
                            :props="authProps"
                            :expand-on-click-node="false">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span v-if="data.type > 1">
                          <el-button
                                  type="text"
                                  @click="handleClick(data)">
                            {{ data.name }}
                          </el-button>
                        </span>
                        <span v-if="data.type == 1">{{ data.name }}</span>
                      </span>
                    </el-tree>
                </div>
            </div>
        </div>
        <div class="container">
            <el-header style="text-align: right; font-size: 12px">
                <el-button type="primary" class="mr10" size="medium" @click="handleAdd" >添加权限url</el-button>
            </el-header>
            <div class="handle-box">
                <h2>权限名:{{ checkAuthorityName }}</h2><br>
            </div>
            <el-table :data="authUrlTable" border class="table">
                <el-table-column prop="url" label="请求url" >
                </el-table-column>
                <el-table-column prop="linkAuthMeaning" label="权限类型" >
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" v-if="home.user.authIds.indexOf('1') >= 0 && home.user.authIds.indexOf('1') >= 0">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit"  @click="handleEdit(scope.$index, scope.row)" v-if="home.user.authIds.indexOf('1') >= 0">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"  @click="handleDelete(scope.row, true)" v-if="home.user.authIds.indexOf('1') >= 0">物理删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible="editVisible" width="30%" :show-close=false>
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="权限名">
                    <el-input v-model="form.authorityName" disabled></el-input>
                </el-form-item>
                <el-form-item label="请求url" prop="url">
                    <el-input v-model="form.url"></el-input>
                </el-form-item>
                <el-form-item label="权限类型" prop="linkAuth">
                    <el-col>
                        <el-radio v-for="(item,index) in linkAuthList" v-model="form.linkAuth" :label="item.databaseValue">{{item.meaning}}</el-radio>
                    </el-col>
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
                linkAuthList:[],
                authList:[],
                rules: {
                    url:[
                        { required: true, message: '请输入请求url', trigger: 'blur' },
                        { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
                    ],
                    linkAuth:[
                        { required: true, message: '请选择连接权限', trigger: 'blur' },
                    ]
                },
                tableData: [],
                authUrlTable:[],
                checkAuthorityName : "通用权限",
                checkAuthorityId : 0,
                authProps:{
                    children: 'children',
                    label: 'name'
                },
                query: {
                },
                form: {},
                editVisible: false,
                delVisible: false,
                delId: -1,
                waitting: false,
                realDel: false
            }
        },
        mounted() {
            this.listLinkAuth();
            this.getAuthorityTree();
        },
        computed: {},
        methods: {
            handleClick(data){
                this.checkAuthorityName = data.name;
                this.checkAuthorityId = data.id;
                this.getData();
            },
            getData(){
                this.$http.get(bus.url.AuthorityUrl.listDataUrl, {params:{authorityId: this.checkAuthorityId}}).then((response) => {
                    if(bus.commonResultSuccess(response,this.$router)){
                        this.authUrlTable = response.body.result;
                    }
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error("服务器异常");
                });
            },
            listLinkAuth(){
                var parm = {
                    tableName:'sys_authority_url',
                    columnName:'link_auth'
                };
                this.$http.get(bus.url.sys.dictUrl, {params:parm}).then((response) => {
                    if(bus.commonResultSuccess(response,this.$router)){
                        this.linkAuthList = response.body.result;
                    }
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error("服务器异常");
                });
            },
            init() {
                this.getData();
            },
            getAuthorityTree() {
                this.$http.get(bus.url.AuthorityList.listDataUrl, {params: this.query}).then((response) => {
                    if (bus.commonResultSuccess(response, this.$router)) {
                        this.tableData = response.body.result;
                        this.tableData.unshift({
                            id : 0,
                            name : "通用权限",
                            layer: 1,
                            type : 3,
                            children : []
                        });
                        this.getData();
                        console.log(this.tableData)
                    }
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error("服务器异常");
                });
            },
            delayEndWaitting() {
                setTimeout(() => {
                    this.waitting = false;
                }, 1000);
            },
            handleAdd() {
                this.form = {};
                this.form.authorityId = this.checkAuthorityId;
                this.form.authorityName = this.checkAuthorityName;
                this.editVisible = true;
            },
            handleEdit(index, row) {
                this.form = JSON.parse(JSON.stringify(this.authUrlTable[index]));
                console.log(this.form)
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
                        this.$http.post(bus.url.AuthorityUrl.formUpdateUrl,this.form).then((response) => {
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
                        this.$http.post(bus.url.AuthorityUrl.formInsertUrl,this.form).then((response) => {
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
                    delUrl = bus.url.AuthorityUrl.formRealDeleteUrl;
                }else {
                    delUrl = bus.url.AuthorityUrl.formLogicDeleteUrl
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
            }
        },
        props: ["home"]
    }

</script>

<style scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

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
