<template>
  <div>
    <div class="contain">
      <el-button round type="success" class="btn" @click="clickNewCode">{{ t('i18n.new') }}</el-button>
      <el-row>
        <el-col
            v-for="(item, index) in table_data"
            :key=index
            :span="6"
            :offset="1"
        >
          <el-card class="card">
            <img
                :src=getImag(item.file_type)
                class="image"
            />
            <div style="padding: 14px">
              <div class="bottom">
                <span>{{ item.name }}</span>
                <div class="button">
                  <el-button type="text" @click="clickCatCode(item)">{{ t('i18n.open') }}</el-button>
                  <el-button type="text" @click="runCode(item.id,item.name)">{{ t('i18n.run') }}</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-model="visible.code" :title="form.name" width="70%"
               center>
      <el-form label-position="left" label-width="100px" ref="save_ref" :model="form" :rules="rules">
        <el-button v-if="!form.is_edit" class="btn" round @click="form.is_edit=!form.is_edit" type="warning">
          {{ t('i18n.edit') }}
        </el-button>
        <el-button class="btn" round v-else @click="saveData(save_ref)" type="error" :loading=" form.loading">
          {{ t('i18n.save') }}
        </el-button>
        <el-form-item :label="t('field.name')" v-if="form.is_edit" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item :label="t('field.file_type')" prop="file_type">
          <el-select-v2
              :disabled="!form.is_edit"
              v-model="form.file_type"
              :options="file_type_options"
              :placeholder="t('i18n.pls_select_file_type')"
          />
        </el-form-item>
        <el-form-item>
          <Codemirror
              v-model:value="form.code"
              :options="cmOptions"
              border
              :height="400"
              ref="code_ref"
          />

        </el-form-item>
      </el-form>

    </el-dialog>
    <el-dialog v-model="visible.log" :title="form.name" class="log"
               center>
      <Codemirror
          v-model:value="form.log"
          :options="cmOptions"
          border
          :height="400"
          ref="log_ref"
      />

    </el-dialog>
  </div>


</template>

<script lang="ts">
import {getFiles, getFile, updateFile, uploadFile, runFile} from '../../api/file';
import pythonPng from '../../assets/img/python.png'
import shellPng from '../../assets/img/shell.png'
import allTableApi from '../../components/api/all_table'
import key2Path from "../../api/route";
import {nextTick, reactive, ref, computed} from "vue";
import type {FormInstance} from 'element-plus'
import type {CodeMirrorInstance} from 'codemirror-editor-vue3'
import {ElMessage} from "element-plus";
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/shell/shell.js";
import "codemirror/mode/go/go.js";
import "codemirror/theme/dracula.css";


export default {
  name: 'file',
  components: {Codemirror},

  setup() {
    const save_ref = ref<FormInstance>()
    const code_ref = ref<CodeMirrorInstance>()
    const log_ref = ref<CodeMirrorInstance>()
    const table_api = allTableApi(getFiles)

    const form = reactive({
      id: 0,
      name: '',
      code: '',
      mode: '',
      log: '',
      file_type: 0,
      is_edit: false,
      loading: false,
    })
    const visible = reactive({
      code: false,
      log: false,
    })

    const rules = {
      name: [
        {
          required: true,
          message: table_api.t('i18n.pls_input_name'),
          trigger: 'blur',
        }
      ],
      code: [
        {
          required: true,
          message: table_api.t('i18n.pls_input_code'),
          trigger: 'blur',
        }
      ],
      file_type: [
        {
          required: true,
          message: table_api.t('i18n.pls_select_file_type'),
          trigger: 'blur',
        }
      ]
    }
    const file_type_options = [
      {value: 0, label: 'shell'},
      {value: 1, label: 'python'},
    ]
    const getMode = (p: { file_type: number }) => {
      if (p.file_type === 1) {
        return 'python'
      }
      return 'shell'
    }
    const cmOptions = computed(() => {
          return {
            mode: getMode(form), // Language mode
            theme: "dracula", // Theme
            lineNumbers: true, // Show line number
            smartIndent: true, // Smart indent
            indentUnit: 2, // The smart indent unit is 2 spaces in length
            foldGutter: true, // Code folding
            styleActiveLine: true, // Display the style of the selected row
            readOnly: !form.is_edit,
            cursorHeight: 0.85,
            autoRefresh: true,
          }
        }
    )
    const logOptions = computed(() => {
          return {
            mode: "text/javascript", // Language mode
            theme: "dracula", // Theme
            lineNumbers: true, // Show line number
            smartIndent: true, // Smart indent
            indentUnit: 2, // The smart indent unit is 2 spaces in length
            foldGutter: true, // Code folding
            styleActiveLine: true, // Display the style of the selected row
            readOnly: true,
            cursorHeight: 0.85,
            autoRefresh: true,
          }
        }
    )
    const saveData = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.validate((valid: boolean) => {
        if (valid) {
          form.loading = true
          const code = btoa(form.code)
          const req = form.id === 0 ? uploadFile(code, form.name, Number(form.file_type)) :
              updateFile(form.id, code, form.name, Number(form.file_type))
          req.then(res => {
            table_api.loadData()
          }).catch(err => {
            ElMessage.error(err.message)
          }).finally(() => {
            form.loading = false
            visible.code = false
          })
        }
      })
    }
    const runCode = (id: number, name: string) => {
      runFile(id).then(res => {
        visible.log = true
        form.log = res.data
        form.name = name
        nextTick(() => {
          log_ref.value.refresh()
        })
      }).catch(err => {
        ElMessage.error(err.message)
      })
    }

    const clickCatCode = (item: { id: number, name: string, file_type: number }) => {
      getFile(item.id).then((res) => {
        form.id = item.id
        form.name = item.name
        form.file_type = item.file_type
        form.code = atob(res.data.code);
        form.is_edit = false
        visible.code = true
        nextTick(() => {
          code_ref.value.refresh()
        })

      })
    }


    const clickNewCode = () => {
      form.id = 0
      form.name = '';
      form.code = '# input your code';
      form.is_edit = true
      visible.code = true;
      nextTick(() => {
        code_ref.value.refresh()
      })

    }
    const getImag = (file_type: number) => {
      if (file_type === 1) {
        return pythonPng
      }
      return shellPng
    };
    return {
      visible,
      form,
      rules,
      save_ref,
      code_ref,
      file_type_options,
      cmOptions,
      logOptions,

      saveData,
      runCode,
      getImag,
      clickCatCode,
      clickNewCode,
      ...table_api,


    }
  }
  ,
}
;
</script>

<style scoped lang="sass">


.contain
  background: #fff
  padding: 10px
  margin-bottom: 20px


  .button
    padding: 0
    min-height: auto

  .bottom
    margin-top: 13px
    line-height: 12px
    display: flex
    justify-content: space-between
    align-items: center

  .card
    margin-top: 10px

  .image
    width: 200px
    height: 120px
    display: block

.btn
  margin-bottom: 20px

.code_edit
  margin-top: 30px

.log
  width: 50%
</style>



