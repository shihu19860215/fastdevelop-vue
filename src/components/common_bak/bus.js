import Vue from 'vue';

// 使用 Event Bus
const bus = new Vue({
    data:{
        url:{
            sys:{
                dictUrl:'http://localhost:20122/api/sys/syscollumndict/list'
            },
            Login:{
                loginUrl:"http://localhost:20122/api/sys/login/login"
            },
            Header:{
                loginOutUrl:"http://localhost:20122/api/sys/login/loginout"
            },
            Home:{
                userAuthUrl:"http://localhost:20122/api/sys/user/getUserInfo",
            },
            CustomerList:{
                customerListUrl:"http://localhost:20122/api/customer/customerinfo/customerlist",
                customerDelUrl:"http://localhost:20122/api/customer/customerinfo/delete"
            },
            CustomerDetail:{
                areaUrl:"http://localhost:20122/api/sys/sysarea/sysarealist",
                insertUrl:"http://localhost:20122/api/customer/customerinfo/insertcustomer",
                updateUrl:"http://localhost:20122/api/customer/customerinfo/update",
                getCusomterUrl:"http://localhost:20122/api/customer/customerinfo/customerdetail",
                customerActivityListUrl:"http://localhost:20122/api/customer/activityinfo/likename",
                customerActivityDeleteUrl:"http://localhost:20122/api/customer/customeractivitymapping/deletebycusomeridactivityid",
                customerActivityInsertUrl:"http://localhost:20122/api/customer/customeractivitymapping/insert"
            },
            ActivityList:{
                tableDataUrl: 'http://localhost:20122/api/customer/activityinfo/list',
                formInsertUrl: 'http://localhost:20122/api/customer/activityinfo/insert',
                formUpdateUrl: 'http://localhost:20122/api/customer/activityinfo/update',
                formDeleteUrl: 'http://localhost:20122/api/customer/activityinfo/delete',
                formStopUrl: 'http://localhost:20122/api/customer/activityinfo/stop',
            },
            UserList:{
                roleListUrl: 'http://localhost:20122/api/sys/sysrole/list',
                tableDataUrl: 'http://localhost:20122/api/sys/user/list',
                formInsertUrl: 'http://localhost:20122/api/sys/user/insertuservo',
                formUpdateUrl: 'http://localhost:20122/api/sys/user/updateuservo',
                formDeleteUrl: 'http://localhost:20122/api/sys/user/delete',
            },
            RoleList:{
                tableDataUrl: 'http://localhost:20122/api/sys/sysrole/listrolevo',
                authListUrl: 'http://localhost:20122/api/sys/sysauthority/listauthorityvo',
                roleAuthUpdateUrl: 'http://localhost:20122/api/sys/sysroleauthoritymapping/updateroleauth'
            },
            SmsTemplateList:{
                listDataUrl: 'http://localhost:20122/api/customer/smstemplate/listvo',
                formInsertUrl: 'http://localhost:20122/api/customer/smstemplate/insert',
                formUpdateUrl: 'http://localhost:20122/api/customer/smstemplate/update',
                formRealDeleteUrl: 'http://localhost:20122/api/customer/smstemplate/delete',
                formLogicDeleteUrl: 'http://localhost:20122/api/customer/smstemplate/logicdelete',
            },
            EmailTemplateList:{
                listDataUrl: 'http://localhost:20122/api/customer/emailtemplate/list',
                formInsertUrl: 'http://localhost:20122/api/customer/emailtemplate/insert',
                formUpdateUrl: 'http://localhost:20122/api/customer/emailtemplate/update',
                formRealDeleteUrl: 'http://localhost:20122/api/customer/emailtemplate/delete',
                formLogicDeleteUrl: 'http://localhost:20122/api/customer/emailtemplate/logicdelete',
            },
            AreaList:{
                listDataUrl: 'http://localhost:20122/api/sys/area/list',
                formInsertUrl: 'http://localhost:20122/api/sys/area/insert',
                formUpdateUrl: 'http://localhost:20122/api/sys/area/update',
                formRealDeleteUrl: 'http://localhost:20122/api/sys/area/delete',
                formLogicDeleteUrl: 'http://localhost:20122/api/sys/area/logicdelete',
            }
        }
    },
    methods:{
        commonResultSuccess(response,router){
            if(!response.body.success){
                //未登录
                if(response.body.code == 400101){
                    localStorage.removeItem("is_login");``
                    router.push('/login');
                    return false;
                }
                this.$message.error(response.body.message);
                //错误的url
                if(response.body.code == 400100){
                    router.push('/');
                }
                return false;
            }
            return true;
        }
    }
});



export default bus;