<template>
  <div v-wechat-title="title">
    <vue-page-designer
      :page="config"
      :widgets="widget"
      :upload="handleUpload"
      :upload-option="uploadOption"
      @save="handleSave"
      @quit="handleQuit"/>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="300">
      <span>您的修改未保存！！！『直接退出』将不会保存您所做的修改。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="getBack">直接退出</el-button>
        <el-button type="primary" @click="saveAndQuit">保存并退出</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import { fetchDashboard, updateDashboard } from '@/api/dashboard'
import { fetchTemplate, updateTemplate } from '@/api/template'
import domtoimage from 'dom-to-image'
import { Loading } from 'element-ui'

import vuePageDesigner from '@/components/Dashboard/Designer'
Vue.use(vuePageDesigner)

export default {
  name: 'EditDashboard',
  data () {
    return {
      hash: this.$route.params.hash,
      details: null,
      config: null,
      widget: null,
      title: '',
      startConfig: null,
      startWidget: null,
      dialogVisible: false,
      dumpConfig: null, // 退出时用来获取方法 handleSave 的参数

      uploadOption: {
        url: process.env.BASE_API + '/upload/image/' + this.$route.params.hash
        // url: 'https://jsonplaceholder.typicode.com/photos'
      },
      isTemplate: false,
      pathFrom: '' // 退出时跳转到分组路由
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.isTemplate = (route.query && route.query.redirect) !== undefined
        this.pathFrom = route.query.from
      },
      immediate: true
    }
  },

  created () {
    this.$nextTick(() => {
      this.getDashboardConfig()
    })
  },

  methods: {
    handleSave (config) {
      const loadingInstance = Loading.service({ fullscreen: true, text: '正在保存...' })

      var dashboard = { ...this.details }
      dashboard['config'] = config.page
      dashboard['widget'] = config.widgets

      var Painter = document.getElementById('viewport-screen')

      domtoimage.toPng(Painter, { style: { 'transform': 'scale(1)' } })
        .then(function (imgData) {
          dashboard['imgData'] = imgData
        }).then(() => {
          // 提交修改
          const updateConfig = (this.isTemplate) ? updateTemplate : updateDashboard
          updateConfig(dashboard).then(response => {
            if (response.code === 0) {
              this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success',
                offset: 50,
                duration: 2000
              })

              this.startConfig = JSON.stringify(config.page)
              this.startWidget = JSON.stringify(config.widgets)

              if (config.isQuit) {
                this.dialogVisible = false
                this.getBack()
              }
            }

            this.$nextTick(() => {
              loadingInstance.close()
            })
          }).catch(() => {
            this.$notify({
              title: '错误',
              message: '保存失败, 请重试',
              type: 'error',
              offset: 50,
              duration: 2000
            })

            this.$nextTick(() => {
              loadingInstance.close()
            })
          })
        }).catch(() => {
          this.$notify({
            title: '错误',
            message: '保存失败, 请重试',
            type: 'error',
            offset: 50,
            duration: 2000
          })
          this.$nextTick(() => {
            loadingInstance.close()
          })
        })
    },
    handleQuit (config) {
      let configStr = JSON.stringify(config.page)
      let widgetStr = JSON.stringify(config.widgets)
      if (configStr !== this.startConfig || widgetStr !== this.startWidget) {
        // console.log('已修改')
        this.dumpConfig = { ...config }
        this.dumpConfig.isQuit = true

        this.dialogVisible = true
      } else {
        this.getBack()
      }
    },
    getBack () {
      // console.log(this.isTemplate)
      this.$router.push({ path: '/' + (this.isTemplate ? 'template' : ('project/' + this.pathFrom)) })
    },
    saveAndQuit () {
      this.handleSave(this.dumpConfig)
    },
    handleUpload (files) {
      return new Promise(resolve => {
        resolve({
          files: files,
          status: 200
        })
      })
    },
    getDashboardConfig () {
      const fetchConfig = (this.isTemplate) ? fetchTemplate : fetchDashboard

      fetchConfig(this.hash).then(response => {
        if (response.data) {
          this.details = response.data

          if (response.data.config) {
            this.config = response.data.config
            this.widget = response.data.widget
            this.title = this.config.title + ' - 大屏编辑'

            this.startConfig = JSON.stringify(response.data.config)
            this.startWidget = JSON.stringify(response.data.widget)
          }
        }
      })
    }
  }

}
</script>
