import Vue from 'vue';

// 使用 Event Bus
const bus = new Vue({
    data:{
        url:{
            basePath: 'http://localhost:20122',
            sys:{
                dictUrl:'http://localhost:20122/api/sys/columninfo/getbytablecolumnname'
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