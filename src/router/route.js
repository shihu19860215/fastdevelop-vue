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
            redirect: '/arealist'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '后台管理' },
            children:[
                {
                    path: '/arealist',
                    component: resolve => require(['../components/page/AreaList.vue'], resolve),
                    meta: { title: '区域列表' }
                },
                {
                    path: '/columnInfoList',
                    component: resolve => require(['../components/page/ColumnInfoList.vue'], resolve),
                    meta: { title: '字段字典列表' }
                },
                {
                    path: '/columnDictList',
                    component: resolve => require(['../components/page/ColumnDictList.vue'], resolve),
                    meta: { title: '字段字典列表' }
                },
                {
                    path: '/auditconfigurelist',
                    component: resolve => require(['../components/page/AuditConfigureList.vue'], resolve),
                    meta: { title: '审计配置列表' }
                },
                {
                    path: '/auditlist',
                    component: resolve => require(['../components/page/AuditList.vue'], resolve),
                    meta: { title: '审计列表' }
                },
                {
                    path: '/userlist',
                    component: resolve => require(['../components/page/UserList.vue'], resolve),
                    meta: { title: '用户列表' }
                },
                {
                    path: '/rolelist',
                    component: resolve => require(['../components/page/RoleList.vue'], resolve),
                    meta: { title: '角色列表' }
                },
                {
                    path: '/roleauthority',
                    component: resolve => require(['../components/page/RoleAuthority.vue'], resolve),
                    meta: { title: '角色权限' }
                },
                {
                    path: '/authoritylist',
                    component: resolve => require(['../components/page/AuthorityList.vue'], resolve),
                    meta: { title: '权限列表' }
                },
                {
                    path: '/authorityurl',
                    component: resolve => require(['../components/page/AuthorityUrl.vue'], resolve),
                    meta: { title: '权限Url' }
                }
            ]
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
