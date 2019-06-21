<template>
  <div
    id="viewport"
    class="holder left-panel-cont"
    :style="preview ? screenSize : {}">
    <ruler-tool
      :ruler-toggle=!preview
      :width=width
      :height=height
      :zoom=zoom
      :content-layout="{left: 0, top: 0}"
      :is-scale-revise="true">

      <div
        :style="{
          backgroundColor: backgroundColor,
          backgroundImage: backPic,
          backgroundRepeat: 'no-repeat',
          width: width + 'px',
          height: height + 'px',
          position: 'relative',
          transform: 'scale(' + zoom / 100 + ')'
        }"
        class="screen"
        id="viewport-screen"
        @dblclick="replaceImage">

        <drag-select :zoom="zoom" :minHeight="height" v-model="selectedList" ref="dragSelect">
          <!-- 组件 -->
          <component
            v-for="val in widgetStore"
            :is="val.type"
            :data-title="val.name"
            :class="{'g-active': isSelected(val.uuid)}"
            :key="val.uuid"
            :val="val"
            :h="height"
            :w="width"
            :data-type="val.type"
            :data-uuid="val.uuid"
            class="layer">
            <component
              v-for="child in getChilds(val.name)"
              :is="child.type"
              :data-title="child.name"
              :class="{'g-active': isSelected(child.uuid)}"
              :key="child.uuid"
              :val="child"
              :h="height"
              :w="width"
              :data-type="child.type"
              :data-uuid="child.uuid"
              class="layer layer-child" />
          </component>
        </drag-select>

        <!-- 参考线 -->
        <component v-bind:is="preview ? '' : 'reference-line'"/>

        <!-- 尺寸控制器 -->
        <component v-bind:is="preview ? '' : 'size-control'"/>
      </div>

      <!-- 右键菜单 -->
      <component v-bind:is="preview ? '' : 'context-menu'"/>
    </ruler-tool>
  </div>
</template>

<script>
import ReferenceLine from './ReferenceLine'
import SizeControl from './SizeControl'
import ContextMenu from './ContextMenu'
import RulerTool from './RulerTool'
import DragSelect from './DragSelect'

import move from '../../mixins/move'
import vpd from '../../mixins/vpd'

export default {
  name: 'Viewport',
  components: {
    ReferenceLine, // 参考线
    SizeControl, // 尺寸控制
    ContextMenu, // 右键菜单
    RulerTool, // 标尺辅助线
    DragSelect // 鼠标框选
  },

  mixins: [move, vpd],

  props: {
    'zoom': Number,
    'preview': Boolean
  },
  data () {
    return {
      selectedList: [],
      presetLine: [{ type: 'l', site: 100 }, { type: 'v', site: 200 }]
    }
  },
  computed: {
    screenSize () {
      return {
        width: window.screen.width + 'px',
        height: window.screen.height + 'px',
        overflowX: this.width === window.screen.width ? 'hidden' : 'auto',
        overflowY: this.height === window.screen.height ? 'hidden' : 'auto'
      }
    },

    // 已添加的组件
    widgetStore () {
      return this.$vpd.state.widgets.filter(item => item.belong === 'page')
    },

    // 画布高度
    height () {
      return Number(this.$vpd.state.page.height)
    },

    // 页面宽度
    width () {
      return Number(this.$vpd.state.page.width)
    },

    // 页面背景色
    backgroundColor () {
      return this.$vpd.state.page.backgroundColor
    },

    // 页面背景图片
    backPic () {
      return this.$vpd.state.page.backPic
    },

    // 选中项id
    id () {
      return this.$vpd.state.uuid
    }
  },

  mounted () {
    // 预览窗口禁止改变组件位置
    if (this._props.preview) {
      return
    }

    // 采用事件代理的方式监听元件的选中操作
    document
      .getElementById('viewport')
      .addEventListener('mousedown', this.handleSelection, false)

    // 绑定键盘上下左右键用于元件的移动
    document
      .getElementById('viewport')
      .addEventListener(
        'keydown',
        e => {
          e.stopPropagation()
          var target = this.$vpd.state.activeElement

          // 左
          if (e.keyCode === 37 && target.left) {
            target.left -= 1
            return
          }
          // 上
          if (e.keyCode === 38 && target.top) {
            e.preventDefault()
            target.top -= 1
            return
          }
          // 右
          if (e.keyCode === 39 && target.left) {
            target.left += 1
            return
          }

          // 下
          if (e.keyCode === 40 && target.top) {
            e.preventDefault()
            target.top += 1
          }
        },
        true
      )
  },

  methods: {
    isSelected (uuid) {
      if (this.$vpd.state.multiSelect) {
        return this.$vpd.state.multiSelectCols.indexOf(uuid) > -1
      } else {
        return this.$vpd.state.uuid === uuid
      }
    },

    handleSelection (e) {
      var target = e.target
      var type, uuid, curDiv
      if (target.tagName === 'CANVAS') {
        curDiv = target.parentNode.parentNode.parentNode
        type = curDiv.getAttribute('data-type')
      } else if (target.className === 'lay-cont') {
        curDiv = target.parentNode
        type = curDiv.getAttribute('data-type')
      } else {
        type = target.getAttribute('data-type')
      }

      if (type) {
        uuid = target.getAttribute('data-uuid') || curDiv.getAttribute('data-uuid')

        // 设置选中元素
        if (this.$vpd.state.multiSelect && (this.$vpd.state.multiSelectCols.indexOf(uuid) > -1)) {
          this.initmovement(e)
        } else {
          this.$vpd.commit('SELECT_WIDGET', {
            uuid: uuid || -1
          })
          // 绑定移动事件：只有从属于 page 的，除背景图以外的元件才能移动
          target = this.$vpd.state.activeElement
          if (target.belong === 'page' && target.dragable) {
            this.initmovement(e) // 参见 mixins
          }
        }
      } else {
        // 取消选中元素
        this.$vpd.commit('SELECT_WIDGET', {
          uuid: -1
        })
      }
    },

    // 替换图片
    replaceImage (e) {
      if (this.$vpd.state.activeElement.isUpload) {
        this.$vpd.$emit('upload', payload => {
          this.$vpd.commit('REPLACE_IMAGE', payload)
        })
      }
    },

    // 获取子组件
    getChilds (name) {
      return this.$vpd.state.widgets.filter(
        item => item.belong === name
      )
    }
  },
  watch: {
    selectedList: function (newValue) {
      if (newValue.length > 0) {
        this.$vpd.commit('MULTISELECT_WIDGET', newValue)
      }
    }
  }
}
</script>

<style scoped>
.holder {
  width: 100%;
  height: 100%;
  overflow: auto;
  justify-content: center;
  font-size: 0;
  background-image: linear-gradient(45deg,#f7f4f4 5%,transparent 0,transparent 5%,#304156 0);
  background-position: 0 0, 8px 8px;
  background-size: 16px 16px;
  background-color: #f0f3f4;
}
.screen {
  /*margin: 25px auto;*/
  transform-origin: left top;
}
.left-panel-cont{
  /* overflow: auto; */
  height: 100%;
}
.left-panel-cont::-webkit-scrollbar {/*滚动条整体样式*/
  width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}
.left-panel-cont::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
  border-radius: 10px;
  /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);*/
  background: #999999;
}
.left-panel-cont::-webkit-scrollbar-track {/*滚动条里面轨道*/
  /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);*/
  border-radius: 10px;
  background: #e8e8e8;
}
</style>
