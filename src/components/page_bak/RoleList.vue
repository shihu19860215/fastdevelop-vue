<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades" ></i> 角色配置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box" v-if="(home.user.authIds.indexOf('24') >= 0)">
                <el-button type="primary" class="mr10" @click="saveEdit">保存</el-button>
            </div>
            <el-radio v-for="(item,index) in tableData" v-model="form.id" :label="item.id" @change="roleCheck(index)">{{item.name}}</el-radio>

            <div class="handle-box">
            </div>
            <el-tree ref="tree"
                    :data="authList"
                    show-checkbox
                    default-expand-all
                    node-key="id"
                    :props="authProps"
                     filter="treeFilter">
            </el-tree>
        </div>

    </div>
</template>

<script>
    import bus from '../common_bak/bus';
    export default {
        name: 'basetable',
        data() {
            return {
                tableData: [],
                authList:[],
                authProps:{
                    children: 'children',
                    label: 'name'
                },
                query:{
                    'page.currentPage':1
                },
                form:{},
                waitting: false
            }
        },
        mounted() {
            this.init();
        },
        computed: {
        },
        methods: {
            roleCheck(index){
                var keys = this.tableData[index].authIds;
                var check = [];
                keys.forEach((item)=>{
                    if(0 == this.$refs.tree.getNode(item).childNodes.length){
                        check.push(item);
                    }
                });
                this.$refs.tree.setCheckedKeys(check);
            },
            getAllKeys(){
                var halfKeys = this.$refs.tree.getHalfCheckedKeys();
                var checkKeys = this.$refs.tree.getCheckedKeys();
                return checkKeys.concat(halfKeys);
            },
            init(){
                this.authListInit();
                this.getData();
            },
            // 分页导航
            handleCurrentChange(val) {
                this.getData();
            },
            authListInit(){
                this.$http.get(bus.url.RoleList.authListUrl,).then((response) => {
                    if(response.body.success){
                        this.authList = response.body.result;
                    }else {
                        this.$message.error('数据加载失败,请重试');
                        this.waitting = true;
                    }
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.waitting = true;
                });
            },
            getData() {
                this.$http.get(bus.url.RoleList.tableDataUrl,{params:this.query}).then((response) => {
                    if(response.body.success){
                        this.tableData = response.body.result;
                        this.dataCount =  response.body.count;
                    }else {
                        this.$message.error('数据加载失败,请重试');
                        this.waitting = true;
                    }
                }, (response) => {
                    // 响应错误回调
                    console.log(response);
                    this.waitting = true;
                });
            },
            delayEndWaitting(){
                setTimeout(() =>{
                    this.waitting = false;
                },1000);
            },
            // 保存编辑
            saveEdit() {
                var authIds = this.getAllKeys();
                this.form.authIds = authIds;

                if(this.waitting){
                    return;
                }
                this.waitting = true;
                this.$http.post(bus.url.RoleList.roleAuthUpdateUrl,this.form).then((response) => {
                    if(response.body.success){
                        this.$message.success(`保存成功`);
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
