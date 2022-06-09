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
        <el-table-column :label="t('field.name')"
                         property="name"
                         align="center">
        </el-table-column>
        <el-table-column :label="t('field.host')"
                         property="host"
                         align="center">
        </el-table-column>
        <el-table-column :label="t('field.connect_type')"
                         property="connect_type"
                         :formatter="formatterConnectType"
                         align="center">
        </el-table-column>
        <el-table-column :label="t('field.port')"
                         property="port"
                         align="center">
        </el-table-column>
        <el-table-column
            prop="status"
            :label="t('field.status')"
        >
          <template #default="scope">
            <el-tag
                :type="scope.row.status === 1 ? 'success' : 'danger'"
                disable-transitions
            >{{ scope.row.status === 1 ? t('i18n.success') : t('i18n.failed') }}
            </el-tag
            >
          </template>
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
                         align="center" v-if="permission.edit || permission.delete">
          <template #default="scope">
            <el-button type="text" v-if="permission.connect" @click=clickConnect(scope.row)>
              {{ t('i18n.connect') }}
            </el-button>
            <el-button type="text" v-if="permission.edit" @click=clickEditData(scope.row)>
              {{ t('i18n.edit') }}
            </el-button>
            <el-button type="text" v-if="permission.delete" @click="clickDeleteData(scope.row.id)">
              {{ t('i18n.delete') }}
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
    <div id="terminal"></div>
    <el-dialog
        :title="visible.is_edit? t('i18n.edit'):t('i18n.new')"
        v-model="visible.save"
        width="30%"
        center>
      <el-form label-width="80px"
               :model="form" :rules="rules"
               ref="save_ref"
      >
        <el-form-item :label="t('field.id')" v-if="visible.is_edit">
          <el-input disabled v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item :label="t('field.name')" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="t('field.host')" prop="host">
          <el-input v-model="form.host"></el-input>
        </el-form-item>

        <el-form-item :label="t('field.connect_type')" prop="connect_type">
          <el-select v-model="form.connect_type" :placeholder="t('i18n.pls_select_connect_type')">
            <el-option
                v-for="item in connect_type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('field.port')" prop="port">
          <el-input-number v-model="form.port" :precision="0" :min="0" :max="65535"></el-input-number>
        </el-form-item>
        <el-form-item :label="t('field.comment')" prop="comment">
          <el-input v-model="form.comment"></el-input>
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

  </div>


</template>

<script lang="ts">
import {defineComponent, computed, ref, reactive, nextTick, onMounted} from "vue"
import {ElMessageBox} from 'element-plus';


import {getHosts, createHost, editHost, deleteHost} from '../../api/host';
import tableApi from "../../components/api/table"
import {confirmBox, confirmTipBox} from "../../components/api/message_box"
import {elMessageSuccess} from "../../components/api/message"
import {has_permission} from "../../utils/permission";
import {negate, omit, values} from "lodash";

export default defineComponent({
  name: 'Host',
  setup() {
    const visible = reactive({
      save: false,
      delete: false,
      is_edit: false,
      item: false,
    })
    const form = reactive({
      id: 0,
      name: '',
      host: '',
      connect_type: 0,
      port: 0,
      status: 0,
      comment: ''

    })
    const disable = reactive({
      is_new: computed(() => form.name === '' || form.host === ''),
      is_edit: computed(() => form.name === ''),
    })
    const table_api = tableApi(getHosts, createHost, editHost, deleteHost, visible, form)


    const rules = {
      name: [{required: true, message: table_api.t('i18n.pls_input_name'), trigger: 'blur'}],
      host: [{required: true, message: table_api.t('i18n.pls_input_host'), trigger: 'blur'}]
    }
    const connect_type_options = [
      {value: 0, label: 'http'},
      {value: 1, label: 'https'},
      {value: 2, label: 'shell'},
    ]
    const permission = {
      add: has_permission("29_1_1631589517500"),
      edit: has_permission("29_2_1631589543207"),
      delete: has_permission("29_3_1631589558934"),
      connect: true,

    }

    const clickNewData = () => {
      form.name = ''
      form.host = ''
      form.comment = ''
      form.connect_type = 0
      form.port = 0
      form.status = 0

      visible.is_edit = false;
      visible.save = true;
    }
    const clickEditData = (row: {
      id: number, name: string, host: string, comment: string,
      connect_type: number, port: number, status: number
    }) => {
      form.id = row.id
      form.name = row.name
      form.host = row.host
      form.comment = row.comment
      form.connect_type = row.connect_type
      form.port = row.port
      form.status = row.status

      visible.is_edit = true;
      visible.save = true;
    }
    const clickConnect = (row: {}) => {
      visible.item = true
    }
    const formatterConnectType = (row: any, column: any, cellValue: number, index: any) => {
      const i = connect_type_options.filter(x => x.value === cellValue)
      if (i.length > 0) {
        return i[0].label
      }
      return cellValue
    }
    onMounted(() => {
      // var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    })
    return {
      ...table_api,

      form,
      rules,
      connect_type_options,

      formatterConnectType,
      permission,
      visible,
      disable,

      clickNewData,
      clickConnect,
      clickEditData,
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



