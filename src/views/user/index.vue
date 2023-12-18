<template>
  <div>
    <div class="contain">
      <el-button round type="primary" @click="loadData()">{{ t('i18n.search') }}</el-button>
      <el-button round type="primary" v-if="permission.add" @click="clickNewData()">{{ t('i18n.new') }}</el-button>
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
            <p>{{ scope.$index + 1 + (pagination.page_index - 1) * pagination.page_size }}</p>
          </template>
        </el-table-column>
        <el-table-column :label="t('field.username')"
                         property="username"
                         align="center">
        </el-table-column>
        <el-table-column :label="t('field.balance')"
                         property="balance"
                         :formatter="formatterBalance"
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

        <el-table-column :label="t('i18n.balance')"
                         align="center" v-if="permission.balance_adjust">
          <template #default="scope">
            <el-button type="text" v-if="permission.balance_adjust"
                       @click="clickBalanceAdjust(scope.row)">{{ t('i18n.adjust') }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column :label="t('i18n.password')"
                         align="center" v-if="permission.rest_password">
          <template #default="scope">
            <el-button type="text" v-if="permission.rest_password"
                       @click="clickResetPassword(scope.row.id)">{{ t('i18n.reset') }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column :label="t('i18n.operate')"
                         align="center" v-if="permission.edit || permission.delete">
          <template #default="scope">
            <el-button type="text" v-if="permission.edit" @click=clickEditData(scope.row)>
              {{ t('i18n.edit') }}
            </el-button>
            <el-button type="text" v-if="permission.delete" @click="clickDeleteData(scope.row.id)">
              {{ t('i18n.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-bind:pagination="pagination" :load-data="loadData"/>
    </div>
    <el-dialog
        :title="visible.is_edit? t('i18n.edit'):t('i18n.new')"
        v-model="visible.save"
        width="30%"
        center>
      <el-form label-width="80px"
               :model="form" :rules="rules">
        <el-form-item :label="t('field.id')" v-if="visible.is_edit">
          <el-input disabled v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item :label="t('field.username')" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item v-if="!visible.is_edit" :label="t('field.password')" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>

      </el-form>
      <template #footer>

        <el-button round @click="visible.save = false">{{ t('i18n.cancel') }}</el-button>
        <el-button round v-if="visible.is_edit" type="primary" :disabled="disable.is_edit" @click="editData()">
          {{ t('i18n.confirm') }}
        </el-button>
        <el-button round v-else type="primary" :disabled="disable.is_new" @click="newData()">
          {{ t('i18n.confirm') }}
        </el-button>
      </template>
    </el-dialog>
    <el-dialog
        :title="t('i18n.balance_adjust')"
        status-icon
        v-model="visible.balance_adjust"
        width="30%"
        center>
      <el-form label-width="80px"
               :model="form" :rules="balance_adjust_rules">
        <el-form-item :label="t('i18n.amount')" prop="amount">
          <el-input-number :precision="2" v-model="form.amount"></el-input-number>
        </el-form-item>

      </el-form>
      <template #footer>

        <el-button round type="primary" @click="visible.balance_adjust = false">{{ t('i18n.cancel') }}</el-button>
        <el-button round type="primary" :disabled="disable.is_balance_adjust" @click="AdjustBalance()">
          {{ t('i18n.confirm') }}
        </el-button>
      </template>
    </el-dialog>

  </div>


</template>

<script lang="ts">
import {defineComponent, computed, ref, reactive} from "vue"
import {ElMessageBox} from 'element-plus';


import {getUsers, createUser, editUser, deleteUser, resetUserPassword, adjustUserBalance} from '../../api/user';
import tableApi from "../../components/api/table"
import {confirmBox, confirmTipBox} from "../../components/api/message_box"
import {elMessageSuccess} from "../../components/api/message"
import {has_permission} from "../../utils/permission";
import {loadavg} from "os";
import Pagination from "../../components/Pagination.vue"

export default defineComponent({
  name: 'User',
  components: {Pagination},
  setup() {
    const visible = reactive({
      save: false,
      delete: false,
      reset_password: false,
      is_edit: false,
      balance_adjust: false,
    })
    const form = reactive({
      id: 0,
      balance: 0,
      amount: 0,
      username: '',
      password: '',
    })
    const disable = reactive({
      is_new: computed(() => form.username === '' || form.password === ''),
      is_edit: computed(() => form.username === ''),
      is_balance_adjust: computed(() => (form.balance / 100 + form.amount) < 0),
    })
    const table_api = tableApi(getUsers, createUser, editUser, deleteUser, visible, form, null)


    const rules = {
      username: [{required: true, message: table_api.t('i18n.pls_input_username'), trigger: 'blur'}],
      password: [{required: true, message: table_api.t('i18n.pls_input_password'), trigger: 'blur'}]
    }
    const balance_adjust_rules = {
      amount: [
        {
          validator: function (rule: any, value: any, callback: any) {
            if ((form.balance / 100 + form.amount) < 0) {
              callback(new Error(table_api.t('i18n.balance_less')))
            }
          }, trigger: ['blur', 'change']
        }],
    }

    const permission = {
      add: has_permission("29_1_1631589517500"),
      edit: has_permission("29_2_1631589543207"),
      delete: has_permission("29_3_1631589558934"),
      rest_password: has_permission("29_4_1631589569386"),
      balance_adjust: has_permission("29_5_1631954785974")

    }
    const clickBalanceAdjust = (row: { id: number; balance: number }) => {
      form.id = row.id
      form.balance = row.balance
      form.amount = 0

      visible.balance_adjust = true;
    }
    const AdjustBalance = () => {
      adjustUserBalance(form).then((res: any) => {
            visible.balance_adjust = false;
            elMessageSuccess(table_api.t)
            table_api.loadData()
          }
      ).catch(() => {
      });
    }

    const clickNewData = () => {
      form.username = ''
      form.password = ''

      visible.is_edit = false;
      visible.save = true;
    }
    const clickEditData = (row: { id: number; username: string; }) => {
      form.id = row.id
      form.username = row.username

      visible.is_edit = true;
      visible.save = true;
    }

    const resetPassword = () => {
      resetUserPassword(form).then((res: { data: { password: string; }; }) => {
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
    const formatterBalance = (row: any, column: any, cellValue: number, index: any) => {
      return cellValue / 100
    }

    return {
      ...table_api,

      form,
      rules,
      balance_adjust_rules,

      permission,
      visible,
      disable,

      formatterBalance,
      clickBalanceAdjust,
      clickNewData,
      clickEditData,
      clickResetPassword,
      resetPassword,
      AdjustBalance
    }
  }
});


</script>

<style scoped lang="sass">

.contain
  background: #fff
  padding: 10px
  margin-bottom: 20px


</style>



