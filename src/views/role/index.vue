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
                <el-table-column :label="t('field.name')"
                                 property="name"
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

                <el-table-column :label="t('i18n.permission')"
                                 align="center" v-if="permission.change_permission">
                    <template #default="scope">
                        <el-button round type="text" v-if="permission.change_permission"
                                   @click=clickPermission(scope.row)>{{t('i18n.change')}}
                        </el-button>
                    </template>

                </el-table-column>
                <el-table-column :label="t('i18n.operate')"
                                 align="center" v-if="permission.edit|| permission.delete">
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
                <el-form-item :label="t('field.name')" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>

            </el-form>
            <template #footer>

                <el-button round @click="visible.save = false">{{t('i18n.cancel')}}</el-button>
                <el-button round v-if="form.is_edit" type="primary" :disabled="visible.edit" @click="editData()">
                    {{t('i18n.confirm')}}
                </el-button>
                <el-button round v-else type="primary" :disabled="disable.is_new" @click="newData()">
                    {{t('i18n.confirm')}}
                </el-button>
            </template>
        </el-dialog>
        <el-drawer
                :title="t('i18n.change_permission')"
                v-model="visible.change_permission"
                direction="rtl"
                size="60%"
        >
            <role-permission :role_permissions="role_permissions" :role_id="form.id"></role-permission>
        </el-drawer>
    </div>


</template>

<script lang="ts">

    import {reactive, ref, provide, computed} from "vue";

    import RolePermission from "../../components/RolePermission.vue";


    import tableApi from "../../components/api/table";
    import {getRolePermissions} from "../../api/rolePermission";
    import {getRoles, createRole, editRole, deleteRole} from "../../api/role";
    import {has_permission} from "../../utils/permission";


    export default {
        name: 'Role',
        components: {RolePermission},
        setup() {
            const visible = reactive({
                save: false,
                delete: false,
                change_permission: false,
            })
            const form = reactive({
                id: 0,
                name: '',
                is_edit: false,
            })
            const disable = reactive({
                is_new: computed(() => form.name === ''),
                is_edit: computed(() => form.name === ''),
            })

            const role_permissions = ref([])

            const table_api = tableApi(getRoles, createRole, editRole, deleteRole, visible, form)
            const rules = {
                username: [{required: true, message: table_api.t('i18n.pls_input_username'), trigger: 'blur'}],
                password: [{required: true, message: table_api.t('i18n.pls_input_password'), trigger: 'blur'}]
            }
            const permission = {
                add: has_permission("31_1_1631277588024"),
                edit: has_permission("31_2_1631277662260"),
                delete: has_permission("31_3_1631277678919"),
                change_permission: has_permission("30_5_1631276967393"),
            }


            const clickNewData = () => {
                form.name = ''
                form.is_edit = false

                visible.save = true
            }
            const clickEditData = (row: { id: number; name: string; }) => {
                form.id = row.id
                form.name = row.name
                form.is_edit = true

                visible.save = true
            }
            const clickDeleteData = (operate_id: number) => {
                form.id = operate_id

                visible.delete = true
            }
            const clickPermission = (row: { id: number; }) => {
                getRolePermissions(row.id).then(res => {
                    form.id = row.id;
                    role_permissions.value = res.data.list;
                    visible.change_permission = true;
                }).catch(() => {
                });

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

            return {
                ...table_api,

                form,
                rules,
                permission,
                visible,
                disable,
                role_permissions,

                clickNewData,
                clickEditData,
                clickPermission,
                roleType,
            }
        },
    };
</script>

<style scoped lang="sass">

    .contain
        background: #fff
        padding: 10px
        margin-bottom: 20px


</style>



