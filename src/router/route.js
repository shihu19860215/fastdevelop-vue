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
