<template>
    <div class="header-contain">
        <div class="collapse-btn" @click="collapseChange">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">{{t('i18n.backend_system')}}</div>
        <div class="header-right">
            <div class="header-user-con">

                <div class="user-avatar" @click="permission.change_avatar?clickAvatar():null">
                    <el-image :src="form.avatar.url"/>
                </div>
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{form.username}}
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
                v-model="visible.change_password"
                width="30%"
                center>
            <el-form :model="form" ref="change_password">
                <el-form-item :label="t('field.password')">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>

            </el-form>

            <el-button round @click="visible.change_password = false">{{t('i18n.cancel')}}</el-button>
            <el-button round type="primary" :disabled="disable.change_password" @click="onchangePassword()">
                {{t('i18n.confirm')}}
            </el-button>
        </el-dialog>
        <el-dialog
                :title="t('i18n.change_avatar')"
                v-model="visible.change_avatar"
                width="30%"
                center>
            <el-upload
                    :show-file-list="false"
                    :multiple="false"
                    :drag="true"
                    accept="image/png, image/jpeg"
                    :auto-upload="false"
                    :on-change="clickChangeAvatar"
                    class="avatar-uploader"

            >
                <el-image v-if="avatar.url" :src="avatar.url" class="avatar"/>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button round @click="visible.change_avatar = false">{{t('i18n.cancel')}}</el-button>
            <el-button round type="primary" @click="onchangeAvatar()">
                {{t('i18n.confirm')}}
            </el-button>
        </el-dialog>
    </div>

</template>
<script lang="ts">
    import {defineComponent, computed, onMounted, reactive, ref} from 'vue';
    import {useStore} from 'vuex';
    import {useRouter} from 'vue-router';
    import {useI18n} from 'vue-i18n';


    import {changeAdminAvatar, changePassword} from '../api/admin';
    import {getOssToken} from '../api/oss';
    import {getUserInfo, removeToken, setUserInfo} from '../utils/auth';
    import {sha256Str} from '../utils/hash';
    import {uploadFile} from '../utils/oss';
    import {elMessageError, elMessageSuccess} from './api/message';
    import {has_permission} from "../utils/permission";
    import {confirmBox, confirmTipBox} from './api/message_box';

    export default defineComponent({
        setup() {
            const visible = reactive({
                change_password: false,
                change_avatar: false
            })
            const user_info = getUserInfo()
            const form = reactive({
                username: user_info.username,
                password: '',
                avatar: reactive({
                    url: user_info.avatar.url,
                    name: user_info.avatar.name,
                }),
            });
            const avatar = reactive({
                name: '',
                url: '',
                raw: null
            })
            const t = useI18n().t
            const store = useStore();
            const collapse = computed(() => store.state.collapse);
            const disable = reactive({
                change_password: computed(() => form.password === ''),
            })
            const permission = {
                change_avatar: has_permission("30_7_1632291149973")
            }
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
                    visible.change_password = true
                }
            };
            const onchangePassword = () => {
                changePassword(form.password).then(res => {
                    confirmTipBox(t, function () {
                        removeToken();
                        router.push('/login');
                    }, {
                        message: t('i18n.password_change_success') + ':' + res.data.password
                    })
                });
            }
            const onchangeAvatar = () => {
                getOssToken().then((res) => {
                    const observer = uploadFile(res.data.token, avatar.name, avatar.raw as unknown as File);
                    observer.subscribe({
                        next(res) {
                        },
                        error(err) {
                            elMessageError(err)
                        },
                        complete(res) {
                            changeAdminAvatar(avatar).then(() => {
                                elMessageSuccess(t)
                                form.avatar.name = avatar.name
                                visible.change_avatar = false
                                form.avatar.url = avatar.url
                                user_info.avatar.name = avatar.name
                                user_info.avatar.url = avatar.url
                                setUserInfo(user_info)

                            }).catch(() => {
                            })
                        }
                    })

                }).catch(() => {
                })
            }


            const clickAvatar = () => {
                avatar.name = form.avatar.name
                avatar.url = form.avatar.url
                visible.change_avatar = true
            }

            const clickChangeAvatar = (file: any, fileList: any) => {
                const reader = new FileReader()
                reader.readAsArrayBuffer(file.raw)
                reader.onload = function (e) {
                    if (e.target && e.target.result) {
                        const key = sha256Str(e.target.result as ArrayBuffer) + ".jpeg"
                        if (key !== avatar.name) {
                            avatar.url = URL.createObjectURL(file.raw)
                            avatar.raw = file.raw
                            avatar.name = key
                        } else {
                            visible.change_avatar = false
                        }

                    }
                }
            }
            return {
                t,

                collapse,
                visible,
                disable,
                form,
                permission,
                avatar,

                clickAvatar,
                handleCommand,
                collapseChange,
                onchangePassword,
                onchangeAvatar,
                clickChangeAvatar
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

        .avatar-uploader
            cursor: pointer
            text-align: center


            .avatar-uploader:hover
                border-color: #409eff


            .avatar
                width: 178px
                height: 178px
                border-radius: 50%

</style>
