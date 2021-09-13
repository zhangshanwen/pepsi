<template>
    <div class="contain">
        <template>
            <div>
                <el-button type="success" class="new"
                           @click="addPermission(null)">{{t('i18n.new')}}
                </el-button>
            </div>
        </template>

        <el-card v-for="(group,index) in all_permission" :key="index"
                 shadow="hover">
            <div slot="header">
                <b class="group_name">{{group.name}}</b>
                <div style="float: right;">
                    <el-link
                            :underline="false"
                            @click="addPermission(group)"
                            type="success"
                            icon="el-icon-plus"
                    >{{t('i18n.add')}}
                    </el-link>&nbsp;&nbsp;
                    <el-link
                            :underline="false"
                            type="text"
                            icon="el-icon-edit"
                            @click="editPermission(group)"
                    >{{t('i18n.edit')}}
                    </el-link>&nbsp;&nbsp;
                    <el-link
                            :underline="false"
                            type="text"
                            icon="el-icon-delete"
                            style="color:#F56C6C"
                            @click="disablePermission(group)"
                    >{{t('i18n.delete')}}
                    </el-link>
                </div>
            </div>
            <el-card v-for="item in group.children" class="permission_item" :key="item.id"
                     shadow="hover">
                <template #header>
                    <b class="nav_name">{{item.name}}</b>
                    <div style="float: right;">
                        <el-link
                                :underline="false"
                                @click="addPermission(item)"
                                type="success"
                                icon="el-icon-plus"
                        >{{t('i18n.add')}}
                        </el-link>&nbsp;&nbsp;
                        <el-link
                                :underline="false"
                                type="text"
                                icon="el-icon-edit"
                                @click="editPermission(item)"
                        >{{t('i18n.edit')}}
                        </el-link>&nbsp;&nbsp;
                        <el-link
                                :underline="false"
                                type="text"
                                icon="el-icon-delete"
                                style="color:#F56C6C"
                                @click="disablePermission(item)"
                        >{{t('i18n.delete')}}
                        </el-link>
                    </div>
                </template>
                <div class="sub_permission_list" v-if="item.children.length">
                    <el-tag
                            class="sub_permission"
                            v-for="sub_item in item.children"
                            :key="sub_item.id"
                            @click="editPermission(sub_item)"
                            @close="disablePermission(sub_item)"
                    >{{sub_item.name}}
                    </el-tag>
                </div>
                <p
                        v-else
                        class="no_data"
                >{{t('i18n.no_data')}}</p>
            </el-card>

        </el-card>

        <el-dialog
                :title="permission.id?t('i18n.edit_permission'):t('i18n.add_permission')"
                v-model="visible.setting_permission"
                :close-on-click-modal="false"
        >
            <el-form
                    ref="post_permission_form"
                    :model="permission"
                    :rules="post_permission_rules"
                    label-width="120px"
            >
                <el-form-item :label="t('field.name')" prop="name">
                    <el-input v-model="permission.name" clearable></el-input>
                </el-form-item>
                <el-form-item :label="t('field.key')" prop="key">
                    <el-input v-model="permission.key" clearable></el-input>
                </el-form-item>
                <el-form-item :label="t('field.icon')" prop="icon">
                    <el-select v-model="permission.icon"
                               collapse-tags filterable :placeholder="t('i18n.pls_choose')">
                        <el-option
                                v-for="item in el_icon_options"
                                :key="item.value"
                                :value="item.value">
                            <i :class="item.value"></i>
                        </el-option>
                    </el-select>
                    &nbsp;&nbsp;
                    <i :class="permission.icon"></i>
                </el-form-item>
                <el-form-item :label="t('field.route')" prop="route">
                    <el-select v-model="permission.route_ids" multiple
                               collapse-tags filterable :placeholder="t('i18n.pls_choose')">
                        <el-option
                                v-for="item in all_route_options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer class="dialog-footer">
                <el-button @click="is_show_setting_permission_dialog = false">{{t('i18n.cancel')}}</el-button>

                <el-button type="primary" @click="saveData" :loading="submit_loading">{{t('i18n.confirm')}}</el-button>
            </template>
        </el-dialog>
    </div>

</template>

<script lang="ts">
    import {ref, reactive, onMounted, computed} from 'vue'
    import {useI18n} from 'vue-i18n';
    import {ElMessageBox, ElMessage} from 'element-plus';


    import {getPermissions, createPermission, editPermissions, delPermissions} from '../api/permission';
    import {getRoutes} from '../api/route';
    import elIcons from '../api/icon';


    export default {


        name: 'Permission',

        setup() {
            const t = useI18n().t
            const post_permission_form = ref(false)
            const submit_loading = ref(false)
            const all_permission = ref([])
            const all_route_options = ref([])
            const el_icon_options = elIcons

            const permission = reactive({
                parent_id: 0,
                id: 0,
                route_ids: [],
                key: '',
                icon: '',
                name: '',
            })
            const visible = reactive({
                setting_permission: false
            })
            const post_permission_rules = {
                name: [
                    {required: true, message: t('i18n.pls_input_permission_name'), trigger: 'blur'}, {
                        min: 0, max: 20, message: t('i18n.char_length_limit_20'), trigger: 'blur'
                    }
                ]
            }
            const loadData = () => {
                getPermissions().then(res => {
                    all_permission.value = res.data.list;
                });
            }
            const loadRoutes = () => {
                getRoutes().then((res) => {
                    all_route_options.value = res.data.list.map((item: { method: string; path: string; id: number }) => ({
                        label: `[${item.method}]${item.path}`,
                        value: item.id
                    }))
                });
            }
            const addPermission = (data: { id: number; children: Array<any> }) => {
                if (data) {
                    permission.parent_id = data.id;
                    permission.id = 0;
                    permission.route_ids = [];
                    permission.key = `${data.id}_${data.children.length + 1}_${+new Date()}`;
                } else {
                    permission.parent_id = 0;
                    permission.id = 0;
                    permission.route_ids = [];
                    permission.key = `${0}_${0}_${+new Date()}`;
                }
                visible.setting_permission = true;
            }
            const editPermission = (data: { parent_id: number; id: number; key: string; icon: string; routes: { map: (arg0: (route: { id: number; }) => number) => never[]; }; name: string; }) => {
                if (data) {
                    permission.parent_id = data.parent_id;
                    permission.id = data.id;
                    permission.key = data.key;
                    permission.icon = data.icon;
                    permission.route_ids = data.routes.map((route: { id: number }) => route.id);
                    permission.name = data.name;
                }
                visible.setting_permission = true;

            }

            const saveData = () => {
                submit_loading.value = true;
                if (post_permission_form.value) {

                    if (permission.id) {
                        editPermissions(permission).then(res => {
                            visible.setting_permission = false;
                            ElMessage.success(t('i18n.success'))
                            loadData();
                        }).catch(() => {
                        });
                    } else {
                        createPermission(permission).then(res => {
                            visible.setting_permission = false;
                            ElMessage.success(t('i18n.success'))
                            loadData();
                        }).catch(() => {
                        });
                    }

                }

                submit_loading.value = false;
            }
            const disablePermission = (data: { parent_id: number; id: number; }) => {
                ElMessageBox.confirm(data.parent_id ? t('i18n.confirm_delete_btn_permission') :
                    t('i18n.confirm_delete_page_permission'), t('i18n.prompt'), {
                    type: 'warning',
                    beforeClose: (action, instance, done) => {
                        if (action === 'confirm') {
                            delPermissions(data).then(res => {
                                ElMessage.success(t('i18n.delete_success'))
                                loadData();
                            }).catch(() => {
                            });
                        }
                        done();
                    }
                }).catch(() => {
                });
            }
            onMounted(() => {
                loadData()
                loadRoutes()
            })

            return {
                t,
                post_permission_form,
                submit_loading,
                all_permission,
                all_route_options,
                el_icon_options,
                permission,
                post_permission_rules,

                visible,

                loadData,
                loadRoutes,
                addPermission,
                editPermission,
                saveData,
                disablePermission,

            }

        },


    };
</script>
<style scoped>

    .contain {
        background: #fff;
        padding: 10px;
        margin-bottom: 20px;
    }

    .permission_item {
        display: inline-block;
        width: 393px;
        height: 210px;
        margin: 0 20px 20px 0;
    }

    .nav_name {
        font-size: 14px;
        color: deepskyblue;

    }


    .group_name {
        font-size: 20px;
        color: orangered;
    }

    .sub_permission_list {
        height: 120px;
        overflow: auto;
    }

    .sub_permission {
        margin: 0 10px 10px 0;
        cursor: pointer;
    }

    .new {
        margin-bottom: 20px;
    }

    .no_data {
        text-align: center;
        line-height: 100px;
        color: #999;
        font-size: 16px;
    }
</style>



