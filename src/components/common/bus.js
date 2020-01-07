import Vue from 'vue';

// 使用 Event Bus
const bus = new Vue({
    data:{
        url:{
            basePath: 'http://localhost:18001',
            // basePath: 'http://test.gw.msh.com:18001',
            userinfoPath: '/getuserinfo',
            sys:{
                basePath : '/artascope-sys-api',
                dictUrl:'/columninfo/getbytablecolumnname'
            }
        }
    },
    methods:{
        getUserInfoUrl(){
            return this.url.basePath + this.url.userinfoPath;
        },
        getSysBaseUrl(){
          return this.url.basePath + this.url.sys.basePath;
        },
        getDictUrl(){
            return this.url.basePath + this.url.sys.basePath + this.url.sys.dictUrl;
        },
        commonResultSuccess(response,router){
            if(!response.body.success){
                console.log(response.body);
                //未登录
                var code = response.body.code;
                if(code >= 400100 && code < 400200){
                    localStorage.removeItem("is_login");
                    router.push('/login');
                    return false;
                }
                this.$message.error(response.body.message);
                //错误的url
                if(response.body.code == 400003){
                    router.push('/');
                }
                return false;
            }
            return true;
        }
    }
});



export default bus;