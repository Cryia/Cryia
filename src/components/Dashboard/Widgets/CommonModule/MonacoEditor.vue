<template>
  <div id="json-editor"/>
</template>

<script>
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'
import 'monaco-editor/esm/vs/language/json/monaco.contribution'

export default {
  props: {
    codes: {
      type: String,
      default: function () {
        return '{}'
      }
    },
    language: {
      type: String,
      default: function () {
        return 'json'
      }
    }
  },
  data () {
    return {
      monacoEditor: null
    }
  },
  watch: {
    codes: {
      handler: function () {
        // this.initEditor()
      }
    }
  },
  mounted () {
    this.initEditor()
  },
  beforeDestroy () {
    this.monacoEditor.dispose()
  },
  methods: {
    initEditor () {
      // custom theme
      monaco.editor.defineTheme('cryia', {
        base: 'vs',
        inherit: true,
        rules: [{ background: 'EDF9FA' }],
        colors: {
          'editor.foreground': '#000000',
          'editor.background': '#304156',
          'editor.selectionBackground': '#B4D5FE',
          'editor.lineHighlightBackground': '#FFFEEB',
          'editorCursor.foreground': '#666666',
          'editorWhitespace.foreground': '#BBBBBB'
        }
      })

      // destroy
      if (this.monacoEditor) {
        this.monacoEditor.dispose()
      }
      // create editor
      let that = this
      this.monacoEditor = monaco.editor.create(document.getElementById('json-editor'), {
        value: that.codes,
        language: that.language,
        theme: 'vs-dark',
        // theme: 'cryia',
        lineNumbers: 'off',
        contextmenu: false,
        minimap: { enabled: false },
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        selectOnLineNumbers: true
      })

      this.$emit('onMounted', this.monacoEditor) // 编辑器创建完成回调

      this.monacoEditor.onDidChangeModelContent(function (event) { // 编辑器内容changge事件
        that.$emit('onCodeChange', that.monacoEditor.getValue(), event)
      })
    }
  }
}
</script>

<style scoped>
  #json-editor{
    height:600px;
    border: 1px solid #c5c5c5;
  }
</style>
