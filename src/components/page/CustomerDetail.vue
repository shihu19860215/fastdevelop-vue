<template>
    <div :key="this.$route.query.id">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-calendar"></i> 表单</el-breadcrumb-item>
                <el-breadcrumb-item>基本表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-header>
                <el-button type="primary" @click="toEditeHandle" justify="end" v-if="(this.home.user.authIds.indexOf('9') >= 0) && readOnly">编辑</el-button>
                <el-button type="primary" @click="saveHandle" justify="end" v-if="(this.home.user.authIds.indexOf('10') >= 0) && !readOnly">保存</el-button>
            </el-header>
            <div class="form-box">
                <el-form ref="customerInfoVO" :model="customerInfoVO" label-width="100px" :rules="rules">
                    <el-form-item label="姓名" prop="customerInfoPO.name">
                        <el-input v-model="customerInfoVO.customerInfoPO.name" :disabled="readOnly"></el-input>
                    </el-form-item>
                    <el-form-item label="所在单位" prop="name">
                        <el-input v-model="customerInfoVO.customerInfoPO.company" :disabled="readOnly"></el-input>
                    </el-form-item>
                    <el-form-item label="职位">
                        <el-input v-model="customerInfoVO.customerInfoPO.position" :disabled="readOnly"></el-input>
                    </el-form-item>
                    <el-form-item label="会员">
                        <el-select v-model="customerInfoVO.customerInfoPO.member" placeholder="请选择" :disabled="readOnly">
                            <el-option key="0" label="否" value="0"></el-option>
                            <el-option key="1" label="是" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生日">
                        <el-col :span="11">
                            <el-date-picker format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="date" placeholder="选择日期" v-model="customerInfoVO.customerInfoPO.birthday" style="width: 100%;" :disabled="readOnly" ></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="手机号">
                        <el-input v-model="customerInfoVO.customerInfoPO.tel" :disabled="readOnly"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="customerInfoVO.customerInfoPO.mail" :disabled="readOnly"></el-input>
                    </el-form-item>
                    <el-form-item label="所在区域">
                        <el-input v-model="customerInfoVO.fullArea" :disabled="readOnly" v-if="readOnly"></el-input>
                        <el-cascader :options="sysArea" v-model="customerInfoVO.areaIds" :disabled="readOnly" :props="areaProps" v-else></el-cascader>
                    </el-form-item>

                    <el-form-item label="备用联系人">
                        <el-input v-model="customerInfoVO.customerInfoPO.spareContacts" :disabled="readOnly"></el-input>
                    </el-form-item>
                    <el-form-item label="评价">
                        <el-input v-model="customerInfoVO.customerInfoPO.appraise" :disabled="readOnly"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-select  v-model="activityId" filterable placeholder="活动列表" :disabled="readOnly"  :filter-method="loadActivity" class="mr10">
                    <el-option
                            v-for="item in activityInfoVOList"
                            :key="item.activityInfoPO.id"
                            :label="item.activityInfoPO.name"
                            :value="item.activityInfoPO.id">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="search" @click="addActiity" v-if="(this.home.user.authIds.indexOf('11') >= 0) && !readOnly">添加</el-button>
            </div>
            <el-table :data="customerInfoVO.activityInfoVOList" border class="table"  >
                <el-table-column  prop="activityInfoPO.name" label="活动名称" width="120">
                </el-table-column>
                <el-table-column prop="activityInfoPO.nature" label="活动性质">
                </el-table-column>
                <el-table-column prop="activityInfoPO.activityTime" label="活动时间">
                </el-table-column>
                <el-table-column prop="activityInfoPO.contacts" label="对接人">
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" v-if="(this.home.user.authIds.indexOf('14') >= 0) && !readOnly">
                    <template slot-scope="scope">
                        <!--<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑-->
                        <!--</el-button>-->
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="deleteActivityHandle(scope.$index)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
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
    import bus from '../common/bus'
    export default {
        name: 'customerDetail',
        data: function(){
            return {
                rules:{
                    'customerInfoPO.name':[
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ]
                },
                readOnly:false,
                demo: [],
                areaProps:{
                    value: 'id',
                    label: 'name',
                    children: 'children'
                },
                activityInfoVOList:[],
                sysArea:[],
                customerInfoVO: {
                    customerInfoPO:{
                        name: '',
                        member: '0',
                        company: '',
                        position: '',
                        member: '',
                        birthday: '',
                        tel: '',
                        mail: '',
                        spareContacts: '',
                        appraise: ''
                    },
                    activityInfoVOList:[]
                },
                delVisible:false,
                delIndex:-1,
                activityId:'',
                waitting : false
            }
        },
        watch:{
            '$route'(newValue, oldValue){
                if("/customerdetail" === newValue.path){
                    this.initCustomer();
                }
            }
        },
        mounted(){
            this.initCustomer();
            this.areaData();
        },
        methods: {
            initCustomer(){
                var id = this.$route.query.id;
                if(id && id>0){
                    var params = {'id' : id};
                    this.readOnly = true;
                    this.$http.get(bus.url.CustomerDetail.getCusomterUrl,{params:{'id':id}}).then((response) => {
                        if(response.body.success){
                            this.customerInfoVO = response.body.result;
                            this.loadActivity();
                        }else {
                            this.$message.error(response.body.message);
                        }
                    }, (response) => {
                        // 响应错误回调
                    });
                }else {
                    this.customerInfoVO ={
                        customerInfoPO:{
                            name: '',
                                member: '0',
                                company: '',
                                position: '',
                                member: '',
                                birthday: '',
                                tel: '',
                                mail: '',
                                spareContacts: '',
                                appraise: ''
                        },
                        activityInfoVOList:[]
                    }
                    this.readOnly = false;
                    this.loadActivity();
                }

            },
            areaData(){
                this.$http.get(bus.url.CustomerDetail.areaUrl).then((response) => {
                    var sysArea = response.body.result;
                    this.sysArea = sysArea;
                }, (response) => {
                    // 响应错误回调
                });
            },
            loadActivity(data){
                if(data && ''!=data){
                    this.$http.get(bus.url.CustomerDetail.customerActivityListUrl,{params:{'name':data}}).then((response) => {
                        this.activityInfoVOList = this.activityFilter(response.body.result);
                    }, (response) => {
                        // 响应错误回调
                    });
                }else {
                    this.$http.get(bus.url.CustomerDetail.customerActivityListUrl).then((response) => {
                        this.activityInfoVOList = this.activityFilter(response.body.result);
                    }, (response) => {
                        // 响应错误回调
                    });
                }
            },
            activityFilter(array ){
                var activityInfoVOList = this.customerInfoVO.activityInfoVOList;
                return array.filter(function (row){
                    for(var i=0 ; i < activityInfoVOList.length; i++){
                        if (activityInfoVOList[i].activityInfoPO.id === row.activityInfoPO.id) {
                            return false;
                        }
                    }
                    return true;
                })
            },
            toEditeHandle(){
                this.readOnly = false;
            },
            saveHandle() {
                var id = this.customerInfoVO.customerInfoPO.id;
                if(id && id>0){
                    this.update();
                }else {
                    this.insert();
                }
            },
            update(){
                if(this.waitting){
                    return;
                }
                this.waitting = true;
                this.$http.post(bus.url.CustomerDetail.updateUrl,this.customerInfoVO.customerInfoPO).then((response) => {
                    if(response.body.success){
                        this.$message.success('提交成功！');
                        this.customerInfoVO.customerInfoPO=response.body.result;
                        this.readOnly = true;
                    }else {
                        this.$message.error(response.body.message);
                    }
                    this.waitting = false;
                }, (response) => {
                    // 响应错误回调
                    this.$message.error(response);
                    this.waitting = false;
                });
            },
            insert(){
                if(this.waitting){
                    return;
                }
                this.waitting = true;
                this.$http.post(bus.url.CustomerDetail.insertUrl,this.customerInfoVO).then((response) => {
                    if(response.body.success){
                        this.customerInfoVO.customerInfoPO=response.body.result;
                        this.$message.success('提交成功！');
                        this.readOnly = true;
                    }else {
                        this.$message.error(response.body.message);
                    }
                    this.waitting = false;
                }, (response) => {
                    // 响应错误回调
                    this.$message.success(response);
                    this.waitting = false;
                });
            },
            deleteActivityHandle(idx){
                this.delIndex = idx;
                this.delVisible = true;
            },
            // 确定删除
            deleteRow() {
                var customerId = this.customerInfoVO.customerInfoPO.id;
                var activityId = this.customerInfoVO.activityInfoVOList[this.delIndex].activityInfoPO.id;
                if(this.waitting){
                    return;
                }
                this.waitting = true;
                this.$http.get(bus.url.CustomerDetail.customerActivityDeleteUrl,{params:{'customerId':customerId,'activityId':activityId}}).then((response) => {
                    this.delVisible = false;
                    if(response.body.success){
                        this.changeActivityToSelect();
                        this.$message.success('删除成功');
                    }else {
                        this.$message.error(response.body.message);
                    }
                    this.waitting = false;
                }, (response) => {
                    this.delVisible = false;
                    // 响应错误回调
                    this.$message.error("未知错误");
                    this.waitting = false;
                });
                this.delVisible = false;
            },
            addActiity(){
                var activityId = this.activityId;
                var customerId = this.customerInfoVO.customerInfoPO.id;
                if(activityId == ''){
                    return
                }
                if(this.waitting){
                    return;
                }
                this.waitting = true;
                this.$http.post(bus.url.CustomerDetail.customerActivityInsertUrl,{'customerId':customerId,'activityId':activityId}).then((response) => {
                    if(response.body.success){
                        this.$message.success('添加成功');
                        this.changeActivityToInfo(activityId);
                    }else {
                        this.$message.error(response.body.message);
                    }
                    this.waitting = false;
                }, (response) => {
                    // 响应错误回调
                    this.$message.error("未知错误");
                    this.waitting = false;
                });
            },
            //选择列表中删除，加入到信息展示列表
            changeActivityToInfo(activityId){
                var i=0;
                for(;i< this.activityInfoVOList.length ; i++){
                    if(this.activityInfoVOList[i].activityInfoPO.id === activityId){
                        this.customerInfoVO.activityInfoVOList.push(this.activityInfoVOList[i]);
                        break;
                    }
                }
                this.activityInfoVOList.splice(i,1);
                this.activityId="";
            },
            //信息展示列表删除，加入到选择列表中
            changeActivityToSelect(){
                if(this.customerInfoVO.activityInfoVOList[this.delIndex]){
                    this.activityInfoVOList.push(this.customerInfoVO.activityInfoVOList[this.delIndex]);
                    this.customerInfoVO.activityInfoVOList.splice(this.delIndex, 1);
                }
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