<template>
  <div>
    <div class="contain">
      <el-button round type="primary" @click="loadData()">{{ t('i18n.search') }}</el-button>
      <el-button round type="primary" @click="clickNewData()">{{ t('i18n.new') }}</el-button>
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


        <el-table-column :label="t('field.owner')"
                         property="owner"
                         align="center">
        </el-table-column>
        <el-table-column
            prop="status"
            :label="t('field.status')"
            align="center"
        >
          <template #default="scope">
            <el-icon v-if="scope.row.status===0" color="grey" :size="20">
              <CircleCloseFilled/>
            </el-icon>
            <el-icon v-else-if="scope.row.status === 1" color="green" :size="20">
              <Refresh/>
            </el-icon>
            <el-icon v-else color="red" :size="20">
              <RemoveFilled/>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column :label="t('field.created_time')"
                         property="created_time"
                         :formatter="formatterTime"
                         align="center">
        </el-table-column>

        <el-table-column :label="t('field.start_time')"
                         property="start_time"
                         :formatter="formatterTime"
                         align="center">
        </el-table-column>

        <el-table-column :label="t('field.end_time')"
                         property="end_time"
                         :formatter="formatterTime"
                         align="center">
        </el-table-column>

        <el-table-column :label="t('i18n.operate')"
                         align="center">
          <template #default="scope">
            <el-button type="text" @click=clickJoinMeeting(scope.row)>
              {{ scope.row.is_owner ? t('i18n.enter') : t('i18n.join') }}
            </el-button>

          </template>
        </el-table-column>
      </el-table>
      <pagination v-bind:pagination="pagination" :load-data="loadData"/>
    </div>
    <el-dialog
        :title="t('i18n.new')"
        v-model="visible.save"
        width="30%"
        center>
      <el-form label-width="80px"
               :model="form" :rules="rules"
               ref="save_ref"
      >
        <el-form-item :label="t('field.name')" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>

        <el-button round @click="visible.save = false">{{ t('i18n.cancel') }}</el-button>
        <el-button round type="primary" @click="newData()">
          {{ t('i18n.confirm') }}
        </el-button>
      </template>
    </el-dialog>

  </div>


</template>

<script lang="ts">
import {defineComponent, computed, ref, reactive, nextTick, onMounted, onUnmounted} from "vue"


import {getMeetings, pushMeeting, createMeeting, joinMeeting, meetingOffset} from '../../api/meeting';
import tableApi from "../../components/api/table"
import {useRouter} from "vue-router";
import Pagination from "../../components/Pagination.vue"
import {CircleCloseFilled, Refresh, RemoveFilled} from "@element-plus/icons-vue";

export default defineComponent({
  name: 'Host',
  components: {CircleCloseFilled, RemoveFilled, Refresh, Pagination},
  setup() {
    const visible = reactive({
      save: false,
      delete: false,
    })
    const form = reactive({
      id: 0,
      name: '',

    })
    const table_api = tableApi(getMeetings, createMeeting, null, null, visible, form, null)


    const rules = {
      name: [{required: true, message: table_api.t('i18n.pls_input_name'), trigger: 'blur'}],
    }

    const clickNewData = () => {
      form.name = ''
      visible.save = true;
    }
    const router = useRouter()
    return {
      ...table_api,

      form,
      rules,
      visible,

      clickNewData,
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



