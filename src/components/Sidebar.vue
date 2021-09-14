<template>
    <div class="sidebar">
        <el-menu
                class="sidebar-el-menu"
                :collapse="collapse"
                background-color="#324157"
                text-color="#bfcbd9"
                :default-active="onRoutes"
                active-text-color="#20a0ff"
                router
                unique-opened>
            <tree-menu v-bind:menus="items"></tree-menu>
        </el-menu>
    </div>
</template>

<script>
    import {defineComponent, computed} from 'vue'
    import {useStore} from "vuex";
    import {useRoute} from "vue-router";

    import treeMenu from './TreeMenu.vue';
    import {getPermissionMenus} from '../utils/permission';

    export default defineComponent({
        components: {treeMenu},
        setup() {
            const route = useRoute();
            const items = getPermissionMenus()
            const onRoutes = computed(() => {
                return route.path;
            });
            const store = useStore();
            const collapse = computed(() => store.state.collapse);
            return {
                items,
                onRoutes,
                collapse,
            };
        },


    });
</script>

<style scoped lang="sass">
    .sidebar
        display: block
        position: absolute
        left: 0
        top: 70px
        bottom: 0
        overflow-y: scroll

        ::-webkit-scrollbar
            width: 0

        > ul
            height: 100%

        .sidebar-el-menu:not(.el-menu--collapse)
            width: 250px


</style>
`
