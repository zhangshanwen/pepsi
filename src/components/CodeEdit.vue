<template>

  <Codemirror
      v-model:value="form.code"
      :options="cmOptions"
      border
      placeholder="test placeholder"
      :height="200"
  />
</template>

<script lang="ts">
import Codemirror from "codemirror-editor-vue3";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/shell/shell.js";
import "codemirror/mode/go/go.js";
import "codemirror/theme/dracula.css";
import {computed, reactive, watch} from "vue";

export default {
  components: {Codemirror},
  props: {
    form: {
      type: Object
    }
  },
  setup(props: { form: { code: string, file_type: string, is_edit: boolean } }) {

    const getMode = (p: { file_type: string }) => {
      if (p.file_type === '1') {
        return 'python'
      }
      return 'shell'
    }
    const cmOptions = computed(() => {
      return {
        mode: getMode(props.form), // Language mode
        theme: "dracula", // Theme
        lineNumbers: true, // Show line number
        smartIndent: true, // Smart indent
        indentUnit: 2, // The smart indent unit is 2 spaces in length
        // foldGutter: true, // Code folding
        styleActiveLine: true, // Display the style of the selected row
        readOnly: !props.form.is_edit,
        cursorHeight:0.85,
        autoRefresh: true,
      }
    })
    return {
      cmOptions
    }
  }
}

</script>