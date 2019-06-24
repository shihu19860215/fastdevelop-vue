import Vue from 'vue';

// 使用 Event Bus
const bus = new Vue({
    data:{
        url:{
            sys:{
                dictUrl:'http://localhost:20122/api/sys/columndict/listdict'
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
            UserList:{
                roleListUrl: 'http://localhost:20122/api/sys/role/list',
                tableDataUrl: 'http://localhost:20122/api/sys/user/listvo',
                formInsertUrl: 'http://localhost:20122/api/sys/user/insertuservo',
                formUpdateUrl: 'http://localhost:20122/api/sys/user/updateuservo',
                formDeleteUrl: 'http://localhost:20122/api/sys/user/delete',
            },
            RoleList:{
                listDataUrl: 'http://localhost:20122/api/sys/role/listvo',
                formInsertUrl: 'http://localhost:20122/api/sys/role/insert',
                formUpdateUrl: 'http://localhost:20122/api/sys/role/update',
                formRealDeleteUrl: 'http://localhost:20122/api/sys/role/delete',
                formLogicDeleteUrl: 'http://localhost:20122/api/sys/role/logicdelete'
            },
            RoleAuthority:{
                tableDataUrl: 'http://localhost:20122/api/sys/role/listvo',
                authListUrl: 'http://localhost:20122/api/sys/authority/listvo',
                roleAuthUpdateUrl: 'http://localhost:20122/api/sys/roleauthoritymapping/updateroleauth'
            },
            MenuList:{
                listDataUrl: 'http://localhost:20122/api/sys/authority/listvo',
                formInsertUrl: 'http://localhost:20122/api/sys/authority/insert',
                formUpdateUrl: 'http://localhost:20122/api/sys/authority/update',
                formRealDeleteUrl: 'http://localhost:20122/api/sys/authority/delete',
                formLogicDeleteUrl: 'http://localhost:20122/api/sys/authority/logicdelete'
            },
            AuthorityList:{
                listDataUrl: 'http://localhost:20122/api/sys/authority/listvo',
                formInsertUrl: 'http://localhost:20122/api/sys/authority/insert',
                formUpdateUrl: 'http://localhost:20122/api/sys/authority/update',
                formRealDeleteUrl: 'http://localhost:20122/api/sys/authority/delete',
                formLogicDeleteUrl: 'http://localhost:20122/api/sys/authority/logicdelete'
            },
            AuthorityUrl:{
                listDataUrl: 'http://localhost:20122/api/sys/authorityurl/listvo',
                formInsertUrl: 'http://localhost:20122/api/sys/authorityurl/insert',
                formUpdateUrl: 'http://localhost:20122/api/sys/authorityurl/update',
                formRealDeleteUrl: 'http://localhost:20122/api/sys/authorityurl/delete',
                formLogicDeleteUrl: 'http://localhost:20122/api/sys/authorityurl/logicdelete'
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