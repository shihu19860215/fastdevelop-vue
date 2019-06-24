import Vue from 'vue'
import App from './App.vue'
import router from './router/route.js'
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';

//element ui
import ElementUI from 'element-ui';
Vue.use(ElementUI, {
    size: 'small'
});


import VueResource from 'vue-resource'
Vue.use(VueResource);

import VueSchart from 'vue-schart'

Vue.config.productionTip = false;

//---------------校验器开始-------------------
import VueValidator from 'vue-validator'
Vue.use(VueValidator);
//自定义验证器 //添加一个简单的手机号验证
//匹配0-9之间的数字,并且长度是11位
Vue.validator('tel', function (val) {
    return /^[0-9]{11}$/.test(val)
});
//添加一个密码验证
//匹配6-20位的任何字类字符，包括下划线。与“[A-Za-z0-9_]”等效。
Vue.validator('passw', function (val) {
    return /^(\w){6,20}$/.test(val)
});
//---------------校验器结束-------------------


//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {// 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    const isLogin = localStorage.getItem('is_login');
    if(null == isLogin && to.path !== '/login'){
        next('/login');
        return;
    }
    if(null != isLogin && to.path === '/login'){
        next({path:'/'});
        return;
    }
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
        Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
            confirmButtonText: '确定'
        });
    } else {
        next();
    }
})
Vue.http.interceptors.push(function(request, next) {//拦截器
// 跨域携带cookie
    request.credentials = true;
    next()
})
new Vue({
    router,
  render: h => h(App),
}).$mount('#app')
