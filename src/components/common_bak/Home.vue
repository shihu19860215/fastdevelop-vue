<template>
    <div class="wrapper">
        <v-head :home="this"></v-head>
        <v-sidebar :home="this"></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view :home="this"></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import bus from './bus';
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue'
    import vTags from './Tags.vue';

    export default {
        data(){
            return {
                tagsList: [],
                collapse: false,
                user:{
                    authIds:[],
                    menuList:[]
                }
            }
        },
        components:{
            vHead,
            vSidebar,
            vTags
        },
        mounted(){
            const isLogin = localStorage.getItem('is_login');
            if(null == isLogin){
                this.$router.push('/login');
                return;
            }else {
                this.userInit();
            }
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })

            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for(let i = 0, len = msg.length; i < len; i ++){
                    msg[i].name && arr.push(msg[i].name);
                }
                this.tagsList = arr;
            })
        },
        methods:{
            userInit(){
                this.$http.get(bus.url.Home.userAuthUrl).then((response) => {
                    if(bus.commonResultSuccess(response,this.$router)){
                        this.user = response.body.result;
                    }
                }, (response) => {
                    this.$message.error(`用户数据加载失败`);
                    // 响应错误回调
                });
            }
        }
    }
</script>
