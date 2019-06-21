<template>
  <div class="app">
    <navbar/>
    <div class="body container grid-xl">
      <div class="columns col-gapless">
        <toolbar :zoom="zoom" class="toolbar column"/>
        <div :style="styleObj" class="viewport viewport-new">
          <viewport :zoom="zoom"/>
          <div class="zoom-wrap">
            <vpd-slider
              :value="zoom"
              :step="5"
              :tuning="false"
              @input="dozoom" />
            <div class="zoom-value">{{ zoom }}%</div>
          </div>
        </div>
        <panel class="control-panel column"/>
      </div>
    </div>
    <vpd-uploader
      :upload="upload"
      :upload-option="uploadOption"/>
    <vpd-toast/>
  </div>
</template>

<script>
import Vue from 'vue'
import './style/font/font.css'

import Navbar from './components/Navbar'
import Toolbar from './components/Toolbar'
import Panel from './components/Panel'
import Viewport from './components/Viewport'
import Slider from './components/Slider'
import Toast from './components/Toast'
import Uploader from './components/Uploader'

import WidgetLibrary from './plugins/widget'

import vpd from './mixins/vpd'

export default {
  name: 'VuePageDesigner',
  components: {
    Navbar, // 顶部导航栏
    Toolbar, // 左侧菜单栏
    Panel, // 右侧参数面板
    Viewport, // 页面画布
    [Toast.name]: Toast, // 提示组件
    [Uploader.name]: Uploader, // 上传组件
    [Slider.name]: Slider
  },
  mixins: [vpd],
  props: {
    page: Object,
    widgets: Array,
    upload: Function,
    uploadOption: Object
  },
  data () {
    return {
      styleObj: {
        width: (1920 - 299) + 'px'
      }
    }
  },

  computed: {
    zoom () {
      return this.$vpd.state.page.zoom
    }
  },

  beforeCreate () {
    // TODO: custom svg path by config
    // loadSprite('//unpkg.com/vue-page-designer/dist/icons.svg', 'svgspriteit')
  },

  created () {
    // 注册所有可用 widget
    Vue.use(WidgetLibrary)

    // 清空画布
    this.$vpd.initState()

    this.$vpd.$on('save', () => {
      this.$vpd.commit('INIT_ACTIVE')

      this.$emit('save', this.$vpd.state)
    })
    this.$vpd.$on('quit', () => {
      // 清空选中样式
      this.$vpd.commit('INIT_ACTIVE')

      this.$emit('quit', this.$vpd.state)
    })
    this.$vpd.$on('preview', () => {
      this.$emit('preview', this.$vpd.state)
    })
  },

  mounted () {
    window.onresize = () => {
      return (() => {
        this.handleLableWidth()
      })()
    }
    this.handleLableWidth()
  },

  updated () {
    // 初始化选中元件（将页面作为初始选中元件）
    this.$vpd.commit('INIT_ACTIVE')
  },

  methods: {
    dozoom (val) {
      this.$vpd.commit('ZOOM', val)
    },
    handleLableWidth () {
      const wid = window.innerWidth
      this.styleObj.width = (wid - 299) + 'px'
    }
  },

  watch: {
    page: {
      handler (newValue, oldValue) {
        this.$vpd.replacePage(newValue)
        this.$vpd.commit('INIT_ACTIVE')
      },
      deep: true
    },
    widgets: {
      handler (newValue, oldValue) {
        // console.log('widget变化')
        if (!this.$vpd.state.moving) {
          let arr = JSON.parse(JSON.stringify(newValue))
          let params = {
            widget: arr,
            curUUID: this.$vpd.state.activeElement.uuid
          }
          this.$vpd.commit('BACKUP_WIDGET', params)
        }
        this.$vpd.replaceWidgets(newValue)
      },
      deep: true
    },
    '$vpd.state.moving': function (newValue, oldValue) {
      if (!newValue) {
        let arr = JSON.parse(JSON.stringify(this.$vpd.state.widgets))
        let params = {
          widget: arr,
          curUUID: this.$vpd.state.activeElement.uuid
        }
        this.$vpd.commit('BACKUP_WIDGET', params)
      }
    }
  }
}
</script>

<style lang="scss">
.body {
  width: 100%;
  height: calc(100% - 54px);
  overflow: hidden;
  flex-direction: row;
  &.container {
    padding: 0;
  }
}

.columns {
  height: 100%;
}

.toolbar,
.viewport,
.control-panel {
  height: 100%;
}

.toolbar {
  background: #1c293a;
  // user-select: none;
  box-sizing: content-box;
  &.column {
    flex: none;
    width: 120px;
  }
}

.viewport {
  /*position: relative;*/
  overflow: hidden;
}

.control-panel {
  background: #1c293a;
  color: #f1f1f1;
  // user-select: none;
  &.column {
    flex: none;
    width: 400px;
  }
}

.zoom-wrap {
  width: 500px;
  height: 40px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  margin-left: -250px;
  background-color: #90939975;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1;
}

.viewport:hover .zoom-wrap {
  opacity: 1;
}

.zoom-value {
  position: absolute;
  top: 10px;
  color: white;
  right: 8px;
}

#svgspriteit {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

.col-gapless .viewport-new {
  position: absolute;
  padding-top:60px;
  padding-left:40px;
  left:0;
  flex:1;
  z-index: 1;
}

.navbar1.container.grid-xl {
  max-width: 12200px;
}

ul li {
  list-style: none;
  margin: 0;
  padding:0;
}

.layer {
  &:hover {
    outline: 1px solid #2196f385;
    background-color: #2196f321;
  }
}

.g-active {
  outline: 1px solid #2196f385 !important;
  background-color: #2196f321;
  &:hover {
    outline: 1px solid #2196f3b5 !important;
  }
  &::after {
    content: attr(data-title);
    background: #2196f385;
    color: #fff;
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 5px;
    font-size: 12px;
    border-radius: 0 0 0 4px;
    line-height: 18px;
  }
}

.lay-cont{
  width:100%;
  height:100%;
  position: absolute;
  background-color:transparent;
  z-index:999;
}
</style>
