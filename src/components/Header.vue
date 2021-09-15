<template>
    <div class="header-contain">
        <div class="collapse-btn" @click="collapseChange">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">{{t('i18n.backend_system')}}</div>
        <div class="header-right">
            <div class="header-user-con">

                <div class="user-avatar">
                    <el-image :src="user_avatar"/>
                </div>
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item divided command="logout">{{t('i18n.logout')}}</el-dropdown-item>
                            <el-dropdown-item divided command="change_password">{{t('i18n.change_password')}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <el-dialog
                :title="t('i18n.change_password')"
                :visible.sync="changePasswordVisible"
                width="30%"
                center>
            <el-form :model="form" ref="change_password">
                <el-form-item :label="t('field.password')">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>

            </el-form>

            <el-button round @click="changePasswordVisible = false">{{t('i18n.cancel')}}</el-button>
            <el-button round type="primary" :disabled="changePasswordDisable" @click="onchangePassword()">
                {{t('i18n.confirm')}}
            </el-button>
        </el-dialog>
    </div>

</template>
<script lang="ts">
    import {defineComponent, computed, onMounted, reactive} from 'vue';
    import {useStore} from 'vuex';
    import {useRouter} from 'vue-router';
    import {useI18n} from 'vue-i18n';
    import {ElMessageBox} from 'element-plus';

    import {changePassword} from '../api/admin';
    import {removeToken} from '../utils/auth';
    import user_avatar from "../assets/img/img.jpg"

    export default defineComponent({
        setup() {
            let username = localStorage.getItem("ms_username");
            username = username ? username : "admin"
            let changePasswordVisible = false
            const form = reactive({
                username: username,
                password: ''
            });

            const t = useI18n().t
            const store = useStore();
            const collapse = computed(() => store.state.collapse);
            const changePasswordDisable = computed(() => form.password === '');
            // 侧边栏折叠
            const collapseChange = () => {
                store.commit("handleCollapse", !collapse.value);
            };

            onMounted(() => {
                if (document.body.clientWidth < 1500) {
                    collapseChange();
                }
            });
            // 用户名下拉菜单选择事件
            const router = useRouter();
            const handleCommand = (command: string) => {
                if (command === "logout") {
                    removeToken();
                    localStorage.removeItem('ms_username');
                    router.push('/login');
                } else if (command === "change_password") {
                    changePasswordVisible = true
                }
            };
            const onchangePassword = () => {
                changePassword(form.password).then(res => {
                    ElMessageBox.confirm(t('i18n.password_change_success') + ':' + res.data.password, t('i18n.prompt'), {
                        type: 'warning',
                        beforeClose: (action, instance, done) => {
                            done();
                            removeToken();
                            router.push('/login');
                        }
                    }).catch(() => {
                    });
                });
            }

            return {
                t,
                collapse,
                user_avatar,
                username,
                changePasswordVisible,
                changePasswordDisable,
                form,
                handleCommand,
                collapseChange,
                onchangePassword,
            }
        },
    });
</script>
<style scoped lang="sass">
    .header-contain
        position: relative
        box-sizing: border-box
        width: 100%
        height: 70px
        font-size: 22px
        color: #fff
        background-color: #242f42

        .logo
            float: left
            width: 400px
            line-height: 70px

        .collapse-btn
            float: left
            padding: 0 21px
            cursor: pointer
            line-height: 70px


        .header-right
            margin:
                top: 0
            float: right
            padding-right: 50px

        .header-user-con
            display: flex
            height: 70px
            align-items: center


        .user-name
            margin-left: 10px


        .user-avatar
            margin-right: 20px

            .el-image
                display: block
                width: 40px
                height: 40px
                border-radius: 50%


        .el-dropdown-link
            color: #fff
            cursor: pointer


        .el-dropdown-menu__item
            text-align: center

</style>
