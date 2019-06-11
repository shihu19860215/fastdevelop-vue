<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
                 text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in home.user.menuList">
                <template v-if="item.children">
                    <el-submenu :index="item.code" :key="item.code">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-submenu v-if="subItem.children" :index="subItem.code" :key="subItem.code">
                                <template slot="title">{{ subItem.name }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.children" :key="i" :index="threeItem.code">
                                    {{ threeItem.name }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.code" :key="subItem.code">
                                {{ subItem.name }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.code" :key="item.code">
                        <i :class="item.icon"></i><span slot="title">{{ item.name }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus.js';
    export default {
        data() {
            return {
                collapse: false,
            }
        },
        methods :{
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        mounted() {
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        },
        props:["home"]
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
