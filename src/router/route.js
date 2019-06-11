import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/',
            redirect: '/table'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '后台管理' },
            children:[
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/customerlist',
                    component: resolve => require(['../components/page/CustomerList.vue'], resolve),
                    meta: { title: '客户列表页' }
                },
                {
                    path: '/customerdetail',
                    component: resolve => require(['../components/page/CustomerDetail.vue'], resolve),
                    meta: { title: '客户信息页' }
                },
                {
                    path: '/activitylist',
                    component: resolve => require(['../components/page/ActivityList.vue'], resolve),
                    meta: { title: '活动信息页' }
                },
                {
                    path: '/chartactivity',
                    component: resolve => require(['../components/page/ActivityChart.vue'], resolve),
                    meta: { title: '活动统计页' }
                },
                {
                    path: '/user',
                    component: resolve => require(['../components/page/UserList.vue'], resolve),
                    meta: { title: '用户信息页' }
                },
                {
                    path: '/role',
                    component: resolve => require(['../components/page/RoleList.vue'], resolve),
                    meta: { title: '角色信息页' }
                },
                {
                    path: '/smstemplate',
                    component: resolve => require(['../components/page/SmsTemplateList.vue'], resolve),
                    meta: { title: '短信模板页' }
                },
                {
                    path: '/arealist',
                    component: resolve => require(['../components/page/AreaList.vue'], resolve),
                    meta: { title: '行政区域模板页' }
                },

                {
                    path: '/emailtemplate',
                    component: resolve => require(['../components/page/EmailTemplateList.vue'], resolve),
                    meta: { title: '邮件模板页' }
                },

                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                }
            ]
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
