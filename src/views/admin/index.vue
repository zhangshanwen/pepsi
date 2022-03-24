<template>
    <div>
        <div class="contain">
            <el-button round type="primary" @click="loadData()">{{t('i18n.search')}}</el-button>
            <el-button round type="primary" v-if="permission.add" @click="clickNewData()">{{t('i18n.new')}}</el-button>
            <el-divider></el-divider>
            <el-table
                    v-loading="pagination.loading"
                    :data="table_data"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column :label="t('field.index')"
                                 align="center">
                    <template #default="scope">
                        <p>{{scope.$index+1+ (pagination.page_index-1)*pagination.page_size}}</p>
                    </template>
                </el-table-column>
                <el-table-column :label="t('field.username')"
                                 property="username"
                                 align="center">
                </el-table-column>
                <el-table-column :label="t('field.role')"
                                 align="center">
                    <template #default="scope">
                        <el-tag effect="dark" :type="roleType(scope.row.role.name)">{{ scope.row.role.name === '' ?
                            t('i18n.nothing') : scope.row.role.name}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="t('field.last_login_time')"
                                 property="last_login_time"
                                 :formatter="formatterTime"
                                 align="center">
                </el-table-column>
                <el-table-column :label="t('field.updated_time')"
                                 property="updated_time"
                                 :formatter="formatterTime"
                                 align="center">
                </el-table-column>
                <el-table-column :label="t('field.created_time')"
                                 property="created_time"
                                 :formatter="formatterTime"
                                 align="center">
                </el-table-column>
                <el-table-column :label="t('i18n.role')"
                                 align="center" v-if="permission.change_role">
                    <template #default="scope">
                        <el-button type="text" v-if="permission.change_role" @click="clickChangeRole(scope.row)">
                            {{t('i18n.change')}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="t('i18n.permission')"
                                 align="center" v-if="permission.change_permission">
                    <template #default="scope">
                        <el-button type="text" v-if="permission.change_permission" @click=clickPermission(scope.row)>
                            {{t('i18n.change')}}
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column :label="t('i18n.password')"
                                 align="center" v-if="permission.rest_password ">
                    <template #default="scope">
                        <el-button type="text" v-if="permission.rest_password"
                                   @click="clickResetPassword(scope.row.id)">
                            {{t('i18n.reset')}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column :label="t('i18n.operate')"
                                 align="center" v-if="permission.edit || permission.delete">
                    <template #default="scope">
                        <el-button type="text" v-if="permission.edit" @click=clickEditData(scope.row)>
                            {{t('i18n.edit')}}
                        </el-button>
                        <el-button type="text" v-if="permission.delete" @click="clickDeleteData(scope.row.id)">
                            {{t('i18n.delete')}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='pagination.total > 0'
                                :page-sizes="pagination.page_size_array"
                                :page-size="pagination.page_size"
                                :layout="pagination.layout"
                                :total="pagination.total"
                                :current-page='pagination.page_index'
                                @current-change='handleCurrentChange'
                                @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-dialog
                :title="form.is_edit? t('i18n.edit'):t('i18n.new')"
                v-model="visible.save"
                width="30%"
                center>
            <el-form :model="form" :rules="rules" label-width="80px">
                <el-form-item :label="t('field.id')" v-if="form.is_edit">
                    <el-input disabled v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item :label="t('field.username')" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item v-if="!form.is_edit" :label="t('field.password')" prop="password">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>

            </el-form>
            <template #footer>
                <el-button round @click="visible.save = false">{{t('i18n.cancel')}}</el-button>
                <el-button round v-if="form.is_edit" type="primary" :disabled="disable.is_edit" @click="editData()">
                    {{t('i18n.confirm')}}
                </el-button>
                <el-button round v-else type="primary" :disabled="disable.is_new" @click="newData()">
                    {{t('i18n.confirm')}}
                </el-button>
            </template>
        </el-dialog>
        <el-dialog :title="t('i18n.change_role')" v-model="visible.change_role" width="20%">
            <div class="role_options">
                <el-select-v2
                        v-model="form.role_id"
                        :options="role_options"
                        :loading="role_loading"
                >
                </el-select-v2>
            </div>
            <template #footer>
            <span class="dialog-footer">
                <el-button round type="primary" @click="visible.change_role = false">{{t('i18n.cancel')}}</el-button>
                <el-button round type="primary" @click="saveRole()">{{t('i18n.confirm')}}</el-button>
            </span>
            </template>
        </el-dialog>
        <el-drawer
                :title="t('i18n.change_permission')"
                v-model="visible.change_permission"
                direction="rtl"
                size="60%"
        >
            <role-permission :role_permissions="role_permissions" :role_id="form.role_id"></role-permission>
        </el-drawer>
    </div>
</template>

<script lang="ts">
    import {reactive, ref, computed, onMounted, onUnmounted, nextTick} from "vue";

    import RolePermission from "../../components/RolePermission.vue";

    import tableApi from "../../components/api/table";
    import {createAdmin, deleteAdmin, editAdmin, getAdmins, changeRole, resetAdminPassword} from "../../api/admin";
    import {getRolePermissions} from "../../api/rolePermission";
    import {getRoles} from "../../api/role";
    import {has_permission} from "../../utils/permission";
    import {confirmBox, confirmTipBox} from "../../components/api/message_box";

    export default {
        name: "Admin",
        components: {RolePermission},
        setup() {

            const visible = reactive({
                save: false,
                delete: false,
                reset_password: false,
                change_role: false,
                change_permission: false,
            })
            const form = reactive({
                id: 0,
                username: '',
                password: '',
                role_name: '',
                role_id: 0,
                is_edit: false,
            })

            const disable = reactive({
                is_new: computed(() => form.username === '' || form.password === ''),
                is_edit: computed(() => form.username === ''),
            })

            const role_options = ref([])
            const role_permissions = ref([])
            const role_loading = ref(false)

            const table_api = tableApi(getAdmins, createAdmin, editAdmin, deleteAdmin, visible, form)
            const rules = {
                username: [{required: true, message: table_api.t('i18n.pls_input_username'), trigger: 'blur'}],
                password: [{required: true, message: table_api.t('i18n.pls_input_password'), trigger: 'blur'}]
            }
            const role_options_pagination = ref({
                total: 0,
                page_index: 1,
                page_size: 20,
                sort: false,
                order: 'id'
            })

            const permission = {
                add: has_permission("30_1_1631276859399"),
                edit: has_permission("30_2_1631276890248"),
                delete: has_permission("30_3_1631276905329"),
                change_role: has_permission("30_4_1631276938272"),
                change_permission: has_permission("30_5_1631276967393"),
                rest_password: has_permission("30_6_1631277265508"),
            }


            /*  method  */
            const clickNewData = () => {
                form.username = ''
                form.password = ''
                form.role_name = ''
                form.is_edit = false

                visible.save = true
            }
            const clickEditData = (row: { id: number; role_name: string; username: any; }) => {
                form.id = row.id
                form.username = row.username
                form.role_name = row.role_name
                form.is_edit = true

                visible.save = true
            }
            const clickChangeRole = async (row: { id: number; role: { name: string; id: number; }; }) => {
                if (role_options.value.length === 0) {
                    await initRoleOption();
                }
                form.id = row.id
                form.role_name = row.role.name
                form.role_id = row.role.id

                visible.change_role = true
                await nextTick(async () => {
                })

            }
            const clickPermission = (row: { id: number; }) => {
                getRolePermissions(row.id).then(res => {
                    form.role_id = row.id;
                    role_permissions.value = res.data.list;
                    visible.change_permission = true;
                }).catch(() => {
                });

            }


            const initRoleOption = async () => {
                role_options_pagination.value = {
                    total: 0,
                    page_index: 1,
                    page_size: 20,
                    sort: false,
                    order: 'id'
                }
                role_options.value = [];
                await loadRoles();
            }
            const loadRoles = async () => {
                if (role_options.value.length >= role_options_pagination.value.total && role_options.value.length > 0) {
                    return
                }
                await getRoles(role_options_pagination.value).then(res => {
                    if (res.data.list.length > 0) {
                        role_options_pagination.value.total = res.data.pagination.total;
                        role_options_pagination.value.page_index += 1;
                        role_options.value = role_options.value.concat(res.data.list.map((item: any) => ({
                            value: item.id,
                            label: item.name,
                        })));

                    }

                }).catch(() => {
                });
            }
            const resetPassword = () => {
                resetAdminPassword(form).then((res: { data: { password: string; }; }) => {
                        visible.reset_password = false;
                        confirmTipBox(table_api.t, table_api.loadData, {
                            message: table_api.t('i18n.password_reset_success') + ':' + res.data.password
                        })
                    }
                ).catch(() => {
                });
            }
            const clickResetPassword = (operate_id: number) => {
                form.id = operate_id
                confirmBox(table_api.t, resetPassword, {
                    message: table_api.t('i18n.reset_password')
                })
            }
            const roleType = (role_name: string) => {
                const remainder = role_name.length % 5;
                switch (remainder) {
                    case 1:
                        return 'success';
                    case 2:
                        return 'info';
                    case 3:
                        return 'danger';
                    case 4:
                        return 'warning';
                    default:
                        return '';
                }
            }
            const saveRole = () => {
                changeRole(form).then(res => {
                    table_api.loadData();
                }).catch(() => {

                }).finally(() => {
                    visible.change_role = false;
                });
            }
            return {
                ...table_api,

                form,
                rules,
                permission,
                visible,
                disable,
                role_loading,
                role_options,
                role_permissions,

                clickNewData,
                clickEditData,
                clickChangeRole,
                clickPermission,
                clickResetPassword,
                resetPassword,
                loadRoles,
                saveRole,
                roleType,
            }
        }
    }
</script>

<style scoped lang="sass">

    .contain
        background: #fff
        padding: 10px
        margin-bottom: 20px


        .role_options
            margin-top: 20px
            margin-bottom: 20px


</style>

