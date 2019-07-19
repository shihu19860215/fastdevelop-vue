<template>
    <div class="table">
        <div class="crumbs">
            <el-header style="text-align: right; font-size: 12px">
                <el-button type="primary" class="mr10" size="medium" @click="handleAddRoot">添加主菜单</el-button>
            </el-header>
        </div>
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
                        <span style="width:15%">{{ node.label }}</span>
                        <span style="width:10%">{{ data.typeMeaning }}</span>
                        <span>{{ data.sort }}</span>
                        <span>
                          <el-button
                                  type="text"
                                  size="mini"
                                  @click="handleAddChildren(data)">
                            新增
                          </el-button>
                          <el-button
                                  type="text"
                                  size="mini"
                                  @click="handleEdit(data)">
                            修改
                          </el-button>
                          <el-button
                                  type="text"
                                  size="mini"
                                  @click="() => handleDelete(data, true)">
                            删除
                          </el-button>
                        </span>
                      </span>
                    </el-tree>
                </div>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible="editVisible" width="30%" :show-close=false>
            <el-form ref="form" :model="form" label-width="80px" :rules="rules">
                <el-form-item label="权限名" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="编号" prop="code">
                    <el-input v-model="form.code"></el-input>
                </el-form-item>
                <el-form-item label="父权限" prop="parentId">
                    <el-input v-model="form.parentName" disabled></el-input>
                </el-form-item>
                <el-form-item label="层级" prop="layer">
                    <el-input v-model.number="form.layer" disabled></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-col>
                        <el-radio v-for="(item,index) in typeList" v-model="form.type" :label="item.databaseValue">
                            {{item.meaning}}
                        </el-radio>
                    </el-col>
                </el-form-item>
                <el-form-item label="排序值" prop="sort">
                    <el-input v-model.number="form.sort"></el-input>
                </el-form-item>
                <el-form-item label="图标" prop="icon">
                    <el-input v-model="form.icon"></el-input>
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
        data() {
            return {
                authList:[],
                rules: {
                    name: [
                        {required: true, message: '请输入权限名', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入编号', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                    ],
                    parentId: [
                        {required: true, message: '请输入父权限', trigger: 'blur'},
                    ],
                    layer: [
                        {required: true, message: '请选择层级', trigger: 'blur'},
                    ],
                    type: [
                        {required: true, message: '请选择类型', trigger: 'blur'},
                    ],
                    sort: [
                        {required: true, message: '请选择排序值', trigger: 'blur'},
                    ],
                    icon: [
                        {min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur'}
                    ]
                },
                listDataUrl: bus.url.basePath + '/api/sys/authority/listvo',
                formInsertUrl: bus.url.basePath + '/api/sys/authority/insert',
                formUpdateUrl: bus.url.basePath + '/api/sys/authority/update',
                formRealDeleteUrl: bus.url.basePath + '/api/sys/authority/delete',
                formLogicDeleteUrl: bus.url.basePath + '/api/sys/authority/logicdelete',
                tableData: [],
                authProps:{
                    children: 'children',
                    label: 'name'
                },
                query: {
                },
                dataCount: 0,
                form: {},
                layerList: [],
                typeList: [],
                sortList: [],
                statusList: [],
                editVisible: false,
                delVisible: false,
                delId: -1,
                waitting: false,
                realDel: false
            }
        },
        mounted() {
            this.init();
        },
        computed: {},
        methods: {
            append(data){
                console.log(data);
            },
            remove(data){

                console.log(data);
            },
            listType() {
                var parm = {
                    tableName: 'sys_authority',
                    columnName: 'type'
                };
                this.$http.get(bus.url.sys.dictUrl, {params: parm}).then((response) => {
                    if (bus.commonResultSuccess(response, this.$router)) {
                        this.typeList = response.body.result;
                    }
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error("服务器异常");
                });
            },
            init() {
                    this.listType(),
                    this.getData()
            },
            getData() {
                if (this.waitting) {
                    return;
                }
                this.waitting = true;
                this.$http.get(this.listDataUrl, {params: this.query}).then((response) => {
                    if (bus.commonResultSuccess(response, this.$router)) {
                        this.tableData = response.body.result;
                        this.dataCount = response.body.count;
                    }
                    this.delayEndWaitting();
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error("服务器异常");
                    this.delayEndWaitting();
                });
            },
            delayEndWaitting() {
                setTimeout(() => {
                    this.waitting = false;
                }, 1000);
            },
            handleAddRoot() {
                this.form = {
                    layer: 1,
                    parentId: 0,
                    parentName: ''
                };
                this.editVisible = true;
            },
            handleAddChildren(data) {
                this.form = {
                    layer: data.layer+1,
                    parentId: data.id,
                    parentName: data.name
                };
                this.editVisible = true;
            },
            handleEdit(data){
                this.form = JSON.parse(JSON.stringify(data));
                this.editVisible = true;
            },
            handleDelete(data, realDel) {
                if(null != data.children){
                    this.$message.error("该节点存在字节的，无法删除");
                    return;
                }
                this.delId = data.id;
                this.realDel = realDel;
                this.delVisible = true;
            },
            handleEditClose() {
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
                    if (this.waitting) {
                        return;
                    }
                    this.waitting = true;
                    if (this.form.id && this.form.id > 0) {
                        //更新
                        this.$http.post(this.formUpdateUrl, this.form).then((response) => {
                            if (bus.commonResultSuccess(response, this.$router)) {
                                this.editVisible = false;
                                this.waitting=false;
                                this.init();
                                this.$message.success(`更新成功`);
                            }else{
                                this.delayEndWaitting();
                            }
                        }, (response) => {
                            // 响应错误回调
                            console.log(response);
                            this.$message.error("服务器异常");
                            this.delayEndWaitting();
                        });
                    } else {
                        this.$http.post(this.formInsertUrl, this.form).then((response) => {
                            if (bus.commonResultSuccess(response, this.$router)) {
                                this.editVisible = false;
                                this.waitting=false;
                                this.init();
                                this.$message.success(`添加成功`);
                            }else{
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
            deleteRow() {
                if (this.waitting) {
                    return;
                }
                var delUrl = '';
                if (this.realDel) {
                    delUrl = this.formRealDeleteUrl;
                } else {
                    delUrl = this.formLogicDeleteUrl
                }
                this.waitting = true;
                this.$http.get(delUrl, {params: {id: this.delId}}).then((response) => {
                    if (bus.commonResultSuccess(response, this.$router)) {
                        this.waitting=false;
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
            startStop(idx) {
                if (this.waitting) {
                    this.tableData[idx].status = this.tableData[idx].status ^ 1;
                    return;
                }
                this.waitting = true;
                this.$http.post(this.formUpdateUrl, this.tableData[idx]).then((response) => {
                    if (bus.commonResultSuccess(response, this.$router)) {
                        this.$message.success(`更新成功`);
                        this.tableData[idx].updateVersion++;
                    } else {
                        this.tableData[idx].status = this.tableData[idx].status ^ 1;
                    }
                    this.delayEndWaitting();
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.$message.error('系统异常');
                    this.tableData[idx].status = this.tableData[idx].status ^ 1;
                    this.delayEndWaitting();
                });
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
