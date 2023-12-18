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
        <el-table-column :label="t('field.key')"
                         property="key"
                         align="center">
        </el-table-column>
        <el-table-column :label="t('field.reply')"
                         property="reply"
                         align="center">
        </el-table-column>
        <el-table-column :label="t('field.description')"
                         property="description"
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
            <el-button type="text" @click=clickEditData(scope.row)>
              {{ t('i18n.edit') }}
            </el-button>
            <el-button type="text" @click="clickDeleteData(scope.row.id)">
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
      <el-form
          label-width="70px"
          :model="form" :rules="rules" ref="save_ref">
        <el-form-item :label="t('field.id')" v-if="visible.is_edit">
          <el-input disabled v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item :label="t('field.name')" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="t('field.key')" prop="key">
          <el-input v-model="form.key"></el-input>
        </el-form-item>
        <el-form-item :label="t('field.reply')" prop="reply">
          <div class="left-right">
            <el-input v-model="form.reply" class="left"></el-input>
            <el-icon @click="" class="right">
              <Sugar/>
            </el-icon>
          </div>
        </el-form-item>
        <el-form-item :label="t('field.description')" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <!--        <div class="functions">-->
      <!--          <el-table-->
      <!--              :data="functions_table"-->
      <!--              border-->
      <!--              stripe-->
      <!--              highlight-current-row-->
      <!--              header-cell-class-name="table-header-class"-->
      <!--              style="width:100%">-->
      <!--            <el-table-column :label="t('field.function_name')"-->
      <!--                             property="function_name"-->
      <!--                             align="center">-->
      <!--            </el-table-column>-->
      <!--            <el-table-column :label="t('field.description')"-->
      <!--                             property="description"-->
      <!--                             align="center">-->
      <!--            </el-table-column>-->

      <!--          </el-table>-->
      <!--        </div>-->

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
import {defineComponent, computed, ref, reactive} from "vue"
import {ElMessageBox} from 'element-plus';


import {createRule, getFunctions, getRules, editRule, deleteRule} from '../../../api/wechat';
import tableApi from "../../../components/api/table"
import {confirmBox, confirmTipBox} from "../../../components/api/message_box"
import {elMessageSuccess} from "../../../components/api/message"
import Pagination from "../../../components/Pagination.vue"

export default defineComponent({
  name: 'User',
  components: {Pagination},
  setup() {
    const visible = reactive({
      save: false,
      delete: false,
      is_edit: false,
    })
    const form = reactive({
      id: 0,
      name: '',
      key: '',
      reply: '',
      description: '',

    })
    const disable = reactive({})
    const table_api = tableApi(getRules, createRule, editRule, deleteRule, visible, form, null)


    const rules = {}
    const functions_table = ref([])

    const loadFunctions = () => {
      getFunctions().then((res) => {
        functions_table.value = res.data.list
      }).catch()
    }

    const clickNewData = () => {
      form.id = 0
      form.name = ''
      form.key = ''
      form.reply = ''
      form.description = ''
      visible.is_edit = false;
      visible.save = true;
      loadFunctions()
    }
    const clickEditData = (row: { id: number; name: string; key: string; reply: string; description: string; }) => {
      form.id = row.id
      form.name = row.name
      form.key = row.key
      form.reply = row.reply
      form.description = row.description
      visible.is_edit = true;
      visible.save = true;
      loadFunctions()
    }

    return {
      ...table_api,

      form,
      functions_table,
      rules,

      visible,
      disable,

      clickNewData,
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

.left-right
  display: flex
  justify-content: space-between
  width: 100%

  .left
    width: 100%

  .right
    height: 100%
    align-self: center
    margin-left: 5px


</style>



