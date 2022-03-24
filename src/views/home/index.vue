<template>
    <div class="wrapper">
        <v-header/>
        <v-sidebar/>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags/>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view/>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
    import {computed} from "vue";
    import {useStore} from "vuex";
    import vHeader from "../../components/Header.vue";
    import vSidebar from "../../components/Sidebar.vue";
    import vTags from "../../components/Tags.vue";

    export default {
        components: {
            vHeader,
            vSidebar,
            vTags,
        },
        setup() {
            const store = useStore();
            const tagsList = computed(() =>
                store.state.tagsList.filter((item) => item.name).map((item) => item.name)
            );
            const collapse = computed(() => store.state.collapse);
            return {
                tagsList,
                collapse,
            };
        },
    };
</script>
<style lang="sass">


    .content-box
        position: absolute
        left: 250px
        right: 0
        top: 70px
        bottom: 0
        padding-bottom: 30px
        -webkit-transition: left .3s ease-in-out
        transition: left .3s ease-in-out
        background: #f0f0f0


    .content
        width: auto
        height: 100%
        padding: 10px
        overflow-y: scroll
        box-sizing: border-box


    .content-collapse
        left: 65px


    .container
        padding: 30px
        background: #fff
        border: 1px solid #ddd
        border-radius: 5px

</style>
