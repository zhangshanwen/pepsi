<template>
  <div>
    <div class="contain">
      <el-form inline>
        <el-form-item :label="t('field.type')" prop="type">
          <el-select v-model="search.types" :placeholder="t('i18n.pls_select_type')" multiple>
            <el-option
                v-for="item in type_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-button round type="primary" @click="loadData()">{{ t('i18n.search') }}</el-button>
        <el-button round type="primary" @click="emptyData()">{{ t('i18n.cleanup') }}</el-button>
        <el-button round type="primary" v-show="multipleSelection.length>0" @click="deleteData()">{{
            t('i18n.delete')
          }}
        </el-button>
      </el-form>
      <el-divider></el-divider>
      <el-table
          v-loading="pagination.loading"
          :data="table_data"
          border
          stripe
          highlight-current-row
          @selection-change="handleSelectionChange"
          header-cell-class-name="table-header-class"
          style="width:100%">
        <el-table-column type="selection" width="55"/>
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
        <el-table-column :label="t('field.role')"
                         align="center">
          <template #default="scope">
            <el-tag effect="dark" :type="roleType(scope.row.role_name)">{{
                scope.row.role_name === '' ?
                    t('i18n.nothing') : scope.row.role_name
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('field.module')"
                         align="center">
          <template #default="scope">
            <el-tag effect="dark" type="success">{{
                scope.row.module
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('field.type')"
                         align="center">
          <template #default="scope">
            <el-tag effect="dark" :type="logType(scope.row.type)">{{
                formatterLogType(scope.row.type)
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('field.log')"
                         property="log"
                         align="center">
        </el-table-column>
        <el-table-column :label="t('field.created_time')"
                         property="created_time"
                         :formatter="formatterTime"
                         align="center">
        </el-table-column>
      </el-table>
      <pagination v-bind:pagination="pagination" :load-data="loadData"/>
    </div>
  </div>
</template>

<script lang="ts">
import {reactive, ref, computed, onMounted, onUnmounted, nextTick} from "vue";


import tableApi from "../../components/api/table";
import Pagination from "../../components/Pagination.vue"
import {getLogs, emptyLogs, deleteLogs} from "../../api/log";
import table from "../../components/api/table";

export default {
  name: "Log",
  components: {Pagination},
  setup() {
    const search = reactive({
      types: []
    })
    interface Row {
      id: number
    }
    const multipleSelection = ref<Row[]>([])
    const table_api = tableApi(getLogs, null, null, null, null, null, search)
    /*  method  */
    const type_options = [
      {
        value: 0,
        label: table_api.t('field.add'),
      },
      {
        value: 1,
        label: table_api.t('field.del'),
      },
      {
        value: 2,
        label: table_api.t('field.update'),
      },
      {
        value: 3,
        label: table_api.t('field.select'),
      }
    ]

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
    const logType = (type: number) => {
      switch (type) {
        case 0:
          return 'success';
        case 1:
          return 'info';
        case 2:
          return 'danger';
        case 3:
          return 'warning';
        default:
          return '';
      }
    }
    const emptyData = () => {
      emptyLogs().then(() => {
        table_api.loadData()
      })
    }
    const deleteData = () => {
      deleteLogs(multipleSelection.value.map(x => x.id)).then(()=>{
        table_api.loadData()
      })
    }

    const formatterLogType = (type: number) => {
      switch (type) {
        case 0:
          return table_api.t('field.add');
        case 1:
          return table_api.t('field.del');
        case 2:
          return table_api.t('field.update');
        case 3:
          return table_api.t('field.select');
        default:
          return '';
      }
    }
    const handleSelectionChange = async (val: []) => {
      multipleSelection.value = val
    }
    return {
      ...table_api,

      search,
      multipleSelection,
      type_options,
      emptyData,
      deleteData,
      handleSelectionChange,

      roleType,
      logType,
      formatterLogType
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

