<template>
    <div class="contain">
        <el-button type="success" class="new"
                   v-if="permission.add"
                   @click="addPermission(null)">{{t('i18n.new')}}
        </el-button>
        <el-card v-for="(group,index) in all_permission" :key="index"
                 shadow="hover">
            <div slot="header">
                <b class="group_name">{{group.name}}</b>
                <div style="float: right;">
                    <el-link
                            :underline="false"
                            v-if="permission.add"
                            @click="addPermission(group)"
                            type="success"
                            icon="el-icon-plus"
                    >{{t('i18n.add')}}
                    </el-link>&nbsp;&nbsp;
                    <el-link
                            :underline="false"
                            type="text"
                            icon="el-icon-edit"
                            v-if="permission.edit"
                            @click="editPermission(group)"
                    >{{t('i18n.edit')}}
                    </el-link>&nbsp;&nbsp;
                    <el-link
                            :underline="false"
                            type="text"
                            icon="el-icon-delete"
                            style="color:#F56C6C"
                            v-if="permission.delete"

                            @click="deletePermission(group)"
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
                                v-if="permission.add"

                                @click="addPermission(item)"
                                type="success"
                                icon="el-icon-plus"
                        >{{t('i18n.add')}}
                        </el-link>&nbsp;&nbsp;
                        <el-link
                                :underline="false"
                                type="text"
                                icon="el-icon-edit"
                                v-if="permission.edit"

                                @click="editPermission(item)"
                        >{{t('i18n.edit')}}
                        </el-link>&nbsp;&nbsp;
                        <el-link
                                :underline="false"
                                type="text"
                                icon="el-icon-delete"
                                style="color:#F56C6C"
                                v-if="permission.add"

                                @click="deletePermission(item)"
                        >{{t('i18n.delete')}}
                        </el-link>
                    </div>
                </template>
                <div class="sub_permission_list" v-if="item.children.length">
                    <el-tag
                            class="sub_permission"
                            v-for="sub_item in item.children"
                            :key="sub_item.id"
                            :closable="permission.delete"
                            @click="permission.edit?editPermission(sub_item):null"
                            @close="deletePermission(sub_item)"
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
                :title="form.id?t('i18n.edit_permission'):t('i18n.add_permission')"
                v-model="visible.setting_permission"
                :close-on-click-modal="false"
        >
            <el-form
                    ref="post_permission_form"
                    :model="form"
                    :rules="post_permission_rules"
                    label-width="120px"
            >
                <el-form-item :label="t('field.name')" prop="name">
                    <el-input v-model="form.name" clearable></el-input>
                </el-form-item>
                <el-form-item :label="t('field.key')" prop="key">
                    <el-input v-model="form.key" clearable></el-input>
                </el-form-item>
                <el-form-item :label="t('field.icon')" prop="icon">
                    <el-select v-model="form.icon"
                               collapse-tags filterable :placeholder="t('i18n.pls_choose')">
                        <el-option
                                v-for="item in el_icon_options"
                                :key="item.value"
                                :value="item.value">
                            <i :class="item.value"></i>
                        </el-option>
                    </el-select>
                    &nbsp;&nbsp;
                    <i :class="form.icon"></i>
                </el-form-item>
                <el-form-item :label="t('field.route')" prop="route">
                    <el-select v-model="form.route_ids" multiple
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
                <el-button @click="visible.setting_permission = false">{{t('i18n.cancel')}}</el-button>

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
    import {has_permission} from "../utils/permission";


    export default {


        name: 'form',

        setup() {
            const t = useI18n().t
            const post_permission_form = ref(false)
            const submit_loading = ref(false)
            const all_permission = ref([])
            const all_route_options = ref([])
            const el_icon_options = elIcons

            const form = reactive({
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

            const permission = {
                add: has_permission("22_1_1631171034438"),
                edit: has_permission("22_3_1631263050215"),
                delete: has_permission("22_2_1631189149693"),
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
                    form.parent_id = data.id;
                    form.id = 0;
                    form.route_ids = [];
                    form.key = `${data.id}_${data.children.length + 1}_${+new Date()}`;
                } else {
                    form.parent_id = 0;
                    form.id = 0;
                    form.route_ids = [];
                    form.key = `${0}_${0}_${+new Date()}`;
                }
                visible.setting_permission = true;
            }
            const editPermission = (data: { parent_id: number; id: number; key: string; icon: string; routes: { map: (arg0: (route: { id: number; }) => number) => never[]; }; name: string; }) => {
                if (data) {
                    form.parent_id = data.parent_id;
                    form.id = data.id;
                    form.key = data.key;
                    form.icon = data.icon;
                    form.route_ids = data.routes.map((route: { id: number }) => route.id);
                    form.name = data.name;
                }
                visible.setting_permission = true;

            }

            const saveData = () => {
                submit_loading.value = true;
                if (post_permission_form.value) {

                    if (form.id) {
                        editPermissions(form).then(res => {
                            visible.setting_permission = false;
                            ElMessage.success(t('i18n.success'))
                            loadData();
                        }).catch(() => {
                        });
                    } else {
                        createPermission(form).then(res => {
                            visible.setting_permission = false;
                            ElMessage.success(t('i18n.success'))
                            loadData();
                        }).catch(() => {
                        });
                    }

                }

                submit_loading.value = false;
            }
            const deletePermission = (data: { parent_id: number; id: number; }) => {
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
                form,
                post_permission_rules,

                permission,
                visible,

                loadData,
                loadRoutes,
                addPermission,
                editPermission,
                saveData,
                deletePermission,

            }

        },


    };
</script>
<style scoped lang="sass">

    .contain
        background: #fff
        padding: 10px
        margin-bottom: 20px

        .permission_item
            display: inline-block
            width: 393px
            height: 210px
            margin: 0 20px 20px 0


        .nav_name
            font-size: 14px
            color: deepskyblue


        .group_name
            font-size: 20px
            color: orangered


        .sub_permission_list
            height: 120px
            overflow: auto


        .sub_permission
            margin: 0 10px 10px 0
            cursor: pointer


        .new
            margin-bottom: 20px

        .no_data
            text-align: center
            line-height: 100px
            color: #999
            font-size: 16px

</style>



