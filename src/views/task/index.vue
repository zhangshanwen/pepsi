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
                         align="center">
          <template #default="scope">
            <el-tag effect="dark" type="success">{{
                scope.row.host.name
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('field.cmd')+'/'+t('field.router')"
                         property="cmd"
                         align="center">
        </el-table-column>
        <el-table-column :label="t('field.spec')"
                         property="spec"
                         align="center">
        </el-table-column>
        <el-table-column :label="t('field.status')"
                         align="center">
          <template #default="scope">
            <el-tag effect="dark" :type="taskStatus(scope.row.status)">{{
                formatterTaskStatus(scope.row.status)
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('field.effect_time')"
                         property="effect_time"
                         :formatter="formatterTime"
                         align="center">
        </el-table-column>
        <el-table-column :label="t('field.expiry_time')"
                         property="expiry_time"
                         :formatter="formatterTime"
                         align="center">
        </el-table-column>
        <el-table-column :label="t('field.next_exec_time')"
                         property="next_exec_time"
                         :formatter="formatterTime"
                         align="center">
        </el-table-column>

        <el-table-column :label="t('field.created_time')"
                         property="created_time"
                         :formatter="formatterTime"
                         align="center">
        </el-table-column>

        <el-table-column :label="t('i18n.log')"
                         align="center" v-if="permission.log ">
          <template #default="scope">
            <el-button type="text" v-if="permission.log" @click=clickLogData(scope.row)>
              {{ t('i18n.log') }}
            </el-button>

          </template>
        </el-table-column>
        <el-table-column :label="t('i18n.manage')"
                         align="center" v-if="permission.run || permission.stop ">
          <template #default="scope">
            <el-button type="text" @click=clickRunData(scope.row)>
              {{ t('i18n.run') }}
            </el-button>
            <el-button type="text" @click=clickStopData(scope.row)>
              {{ t('i18n.stop') }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column :label="t('i18n.operate')"
                         align="center" v-if="permission.edit || permission.delete ">
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
               :model="form" :rules="rules"
               ref="save_ref"
      >
        <el-form-item :label="t('field.id')" v-if="visible.is_edit">
          <el-input disabled v-model="form.id"></el-input>
        </el-form-item>

        <el-form-item :label="t('field.host')" prop="host_id">
          <el-select
              v-model="form.host_id"
          >
            <el-option
                v-for="item in host_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('field.name')" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="t('field.cmd')+'/'+t('field.router')" prop="cmd">
          <el-input v-model="form.cmd"></el-input>
        </el-form-item>
        <el-form-item :label="t('field.spec')" prop="spec">
          <el-input v-model="form.spec" placeholder="* * * * *"></el-input>
        </el-form-item>
        <el-form-item :label="t('field.effect_time')" prop="effect_time">
          <el-date-picker
              v-model="form.effect_time"
              type="datetime"
              :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item :label="t('field.expiry_time')" prop="expiry_time">
          <el-date-picker
              v-model="form.expiry_time"
              type="datetime"
              :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item :label="t('field.comment')" label="comment">
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

    <el-dialog
        :title="t('i18n.log')"
        v-model="visible.log"
        width="40%"
        center
        destroy-on-close>
      <task-log :task-id="form.id" :del_log="permission.del_log"/>
    </el-dialog>

  </div>


</template>

<script lang="ts">
import {defineComponent, computed, ref, reactive, nextTick, onMounted, onUnmounted,} from "vue"


import {has_permission} from "../../utils/permission";
import tableApi from "../../components/api/table";
import {getTask, createTask, editTask, deleteTask, stopTask, runTask} from "../../api/task";
import {getHosts} from "../../api/host";
import TaskLog from "../../components/TaskLog.vue";
import Pagination from "../../components/Pagination.vue"
import {finished} from "stream";

export default defineComponent({
  name: 'task',
  components: {TaskLog, Pagination},
  setup() {
    const visible = reactive({
      save: false,
      delete: false,
      is_edit: false,
      log: false,
    })
    const form = reactive<{
      id: number,
      host_id: number,
      name: string,
      comment: string,
      cmd: string,
      spec: string,
      effect_time: Date | null,
      expiry_time: Date | null,
    }>({
      id: 0,
      host_id: 0,
      name: '',
      comment: '',
      cmd: '',
      spec: '',
      effect_time: null,
      expiry_time: null,
    })

    const disable = reactive({
      is_new: computed(() => form.name === ''),
      is_edit: computed(() => form.name === ''),
    })
    const table_api = tableApi(getTask, createTask, editTask, deleteTask, visible, form, null)
    const rules = {
      name: [{required: true, message: table_api.t('i18n.pls_input_name'), trigger: 'blur'}],
    }
    const permission = {
      add: has_permission("61_1_1655444978082"),
      edit: has_permission("61_2_1655444995571"),
      delete: has_permission("61_3_1655445011513"),
      log: has_permission('61_4_1655445024555'),
      run: has_permission('61_5_1655445038373'),
      stop: has_permission('61_6_1655445065198'),
      del_log: has_permission('61_7_1655445983121')


    }

    const clickNewData = () => {
      loadHost()
      form.name = ''
      form.comment = ''
      form.cmd = ''
      form.spec = ''
      form.effect_time = null
      form.expiry_time = null

      visible.is_edit = false;
      visible.save = true;
    }
    const clickEditData = (row: {
      id: number, name: string, cmd: string, spec: string, effect_time: number, expiry_time: number, host_id: number
    }) => {
      loadHost()
      form.id = row.id
      form.name = row.name
      form.cmd = row.cmd
      form.host_id = row.host_id
      form.spec = row.spec
      if (row.effect_time > 0) {
        form.effect_time = new Date(row.effect_time * 1000)
      }

      visible.is_edit = true;
      visible.save = true;
    }
    const clickLogData = (row: { id: number, name: string }) => {
      form.id = row.id
      form.name = row.name

      visible.log = true;
    }
    const clickStopData = (row: { id: number }) => {
      stopTask({id: row.id}).then(() => {
        table_api.loadData()
      }).catch()
    }
    const clickRunData = (row: { id: number }) => {
      runTask({id: row.id}).then(() => {
        table_api.loadData()
      }).catch()
    }
    const t = table_api.t
    const periods = [t('field.second'), t('field.minute'), t('field.hour'), t('field.day'), t('field.week'), t('field.month'), t('field.once')]
    const period_options = periods.map((period, index) => {
      return {
        label: period,
        value: index
      }
    })
    const shortcuts = [
      {
        text: t('i18n.today'),
        value: new Date(),
      },
      {
        text: t('i18n.tomorrow'),
        value: () => {
          const date = new Date()
          date.setTime(date.getTime() + 3600 * 1000 * 24)
          return date
        },
      },
      {
        text: t('i18n.a_week_later'),
        value: () => {
          const date = new Date()
          date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
          return date
        },
      },
    ]

    let host_options = ref<{ label: string, value: number }[]>([])

    const host_pagination = reactive({
      total: 0,
      page_index: 1,
      page_size: 200,
      sort: false,
      order: 'id',
    })
    const loadHost = () => {
      getHosts(host_pagination).then((res => {
        host_options.value = []
        host_pagination.total = res.data.pagination.total
        res.data.list.forEach((item: { name: string, id: number }) => {
          if (!host_options.value) {
            host_options.value = []
          }
          host_options.value.push({
            label: item.name,
            value: item.id
          })

        })
      })).catch()
    }
    const taskStatus = (status: number) => {
      switch (status) {
        case 1:
          return 'success';
        case 0:
          return 'info';
        case -1:
          return 'danger';
        case -3:
        case -2:
          return 'warning';
        default:
          return '';
      }
    }
    const formatterTaskStatus = (status: number) => {
      switch (status) {
        case -3:
          return table_api.t('i18n.failed');
        case -2:
          return table_api.t('i18n.expire');
        case -1:
          return table_api.t('i18n.stop');
        case 0:
          return table_api.t('i18n.idle');
        case 1:
          return table_api.t('i18n.running');
        default:
          return '';
      }
    }


    return {
      ...table_api,

      host_options,
      permission,
      visible,
      disable,
      form,
      rules,
      period_options,
      shortcuts,

      taskStatus,
      formatterTaskStatus,

      clickNewData,
      clickLogData,
      clickRunData,
      clickEditData,
      clickStopData,
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



