<template>
  <div class="btn">
    <el-button round type="primary" @click="cleanLog()" v-if="del_log">
      {{ t('i18n.clean_all') }}
    </el-button>
  </div>
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
    <el-table-column :label="t('field.status')"
                     align="center">
      <template #default="scope">
        <el-tag effect="dark" :type="logStatus(scope.row.status)">{{
            formatterLogStatus(scope.row.status)
          }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column :label="t('field.comment')"
                     property="comment"
                     align="center">
    </el-table-column>
    <el-table-column :label="t('field.created_time')"
                     property="created_time"
                     :formatter="formatterTime"
                     align="center">
    </el-table-column>
  </el-table>
  <pagination v-bind:pagination="pagination" :load-data="loadData"/>

</template>


<script lang="ts">
import {reactive, ref, computed, onMounted, onUnmounted, nextTick, watch, defineComponent} from "vue";

import {delAllTaskLogs, getTaskLogs} from '../api/task'
import tableApi from "../components/api/table";
import Pagination from "./Pagination.vue"
import {elMessageSuccess} from "./api/message";

export default defineComponent({
  name: "TaskLog",
  props: {
    taskId: {
      type: Number,
      required: true
    },
    del_log: {
      type: Boolean,
      default: false
    }
  },
  components: {Pagination},

  setup(props) {
    const search = reactive({
      id: props.taskId
    })
    const table_api = tableApi(getTaskLogs, null, null, null, null, null, search)
    /*  method  */

    const formatterLogStatus = (type: number) => {
      switch (type) {
        case 0:
          return table_api.t('i18n.failed');
        case 1:
          return table_api.t('i18n.success');
        default:
          return '';
      }
    }

    const logStatus = (type: number) => {
      switch (type) {
        case 0:
          return 'danger';
        case 1:
          return 'success';
        default:
          return '';
      }
    }
    const cleanLog = () => {
      delAllTaskLogs(props.taskId).then(() => {
        elMessageSuccess(table_api.t)
        table_api.loadData()
      }).catch()
    }
    return {
      ...table_api,

      search,
      logStatus,
      cleanLog,

      formatterLogStatus
    }
  }
})
</script>

<style scoped lang="sass">
.btn
  padding-bottom: 10px


</style>