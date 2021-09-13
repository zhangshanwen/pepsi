<template>
    <div>
        <div class="contain">
            <el-button type="primary" @click="loadData()">{{t('i18n.search')}}</el-button>
            <el-button type="primary" @click="clickNewData()">{{t('i18n.new')}}</el-button>
            <el-divider></el-divider>
            <el-table
                    v-loading="pagination.loading"
                    :data="table_data"
                    border
                    stripe
                    highlight-current-row
                    header-cell-class-name="table-header-class"
                    style="width:100%">
                <el-table-column :label="t('field.id')"
                                 property="id"
                                 align="center">
                </el-table-column>
                <el-table-column :label="t('field.username')"
                                 property="username"
                                 align="center">
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
                <el-table-column :label="t('i18n.operate')"
                                 align="center">
                    <template #default="scope">
                        <el-button type="text" @click="clickResetPassword(scope.row.id)">{{t('i18n.reset_password')}}
                        </el-button>
                        <el-button type="text" @click=clickEditData(scope.row)>{{t('i18n.edit')}}</el-button>
                        <el-button type="text" @click="clickDeleteData(scope.row.id)">{{t('i18n.delete')}}</el-button>
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
            <el-form :model="form" :rules="rules">
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

            <el-button @click="visible.save = false">{{t('i18n.cancel')}}</el-button>
            <el-button v-if="form.is_edit" type="primary" :disabled="disable.is_edit" @click="editData()">
                {{t('i18n.confirm')}}
            </el-button>
            <el-button v-else type="primary" :disabled="disable.is_new" @click="newData()">{{t('i18n.confirm')}}
            </el-button>
        </el-dialog>
        <el-dialog :title="t('i18n.delete')" v-model="visible.delete" width="20%">
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="visible.delete = false">{{t('i18n.cancel')}}</el-button>
                <el-button type="primary" @click="deleteOne()">{{t('i18n.confirm')}}</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="t('i18n.reset_password')" v-model="visible.reset_password" width="20%">
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="visible.reset_password = false">{{t('i18n.cancel')}}</el-button>
                <el-button type="primary" @click="resetPassword()">{{t('i18n.confirm')}}</el-button>
            </div>
        </el-dialog>

    </div>


</template>

<script lang="ts">
    import {defineComponent, computed, ref, reactive} from "vue"

    import {getUsers, createUser, editUser, deleteUser, resetUserPassword} from '../api/user';
    import tableApi from "../components/api/table"

    export default defineComponent({
        name: 'User',
        setup() {
            const visible = reactive({
                save: false,
                delete: false,
                reset_password: false,
            })
            const form = reactive({
                id: 0,
                username: '',
                password: '',
                is_edit: false,
            })

            const table_api = tableApi(getUsers, createUser, editUser, deleteUser, visible, form)


            const rules = {
                username: [{required: true, message: table_api.t('i18n.pls_input_username'), trigger: 'blur'}],
                password: [{required: true, message: table_api.t('i18n.pls_input_password'), trigger: 'blur'}]
            }
            const disable = reactive({
                is_new: computed(() => form.username === '' || form.password === ''),
                is_edit: computed(() => form.username === ''),
            })

            const clickNewData = () => {
                form.username = ''
                form.password = ''
                form.is_edit = false;

                visible.save = true;
            }
            const clickEditData = (row: { id: number; username: string; }) => {
                form.id = row.id
                form.username = row.username
                form.is_edit = true;

                visible.save = true;
            }
            const clickDeleteData = (operate_id: number) => {
                form.id = operate_id
                visible.delete = true;
            }
            const clickResetPassword = (operate_id: number) => {
                form.id = operate_id
                visible.reset_password = true;
            }


            const resetPassword = () => {
                resetUserPassword(form).then((res) => {
                        visible.reset_password = false;
                        table_api.loadData();
                    }
                );
            }
            return {
                ...table_api,

                form,
                rules,

                visible,
                disable,

                clickNewData,
                clickEditData,
                clickDeleteData,
                clickResetPassword,
                resetPassword,
            }
        }
    });


</script>

<style scoped>

    .contain {
        background: #fff;
        padding: 10px;
        margin-bottom: 20px;
    }


</style>



