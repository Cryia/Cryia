<template>
  <div
    :class="[isCollapse?'big-panel':'']"
    class="menu-bar-new toolbar-container toolbar-ctrl-panel"
    @mouseenter="enter()"
    @mouseleave="leave()">
    <div class="min-banner">组件管理</div>
    <div class="left-panel-cont">
      <p class="toolbar-title">已加组件</p>
      <ul class="layer-list-new">
        <li
          v-for="layer in layers"
          :class="{'layer-active': isSelected(layer.uuid)}"
          :key="layer.uuid"
          @click="(e) => {activeLayer(e, layer)}">{{ layer.name }}</li>
      </ul>
    </div>

  </div>
</template>

<script>
import widget from '../plugins/widget'
import { cumulativeOffset, checkInView } from '../utils/offset'
import vpd from '../mixins/vpd'

export default {
  mixins: [vpd],
  props: ['zoom'],
  data () {
    return {
      isCollapse: false
    }
  },
  computed: {
    widgets () {
      return widget.getWidgets()
    },
    layers () {
      return this.$vpd.state.widgets
    },
    activeElement () {
      return this.$vpd.state.activeElement
    }
  },
  methods: {
    activeLayer (e, item) {
      this.$vpd.commit('SELECT_WIDGET', {
        uuid: item.uuid
      })
      let viewport = document.querySelector('#viewport')
      let target = viewport.querySelector(`[data-uuid='${item.uuid}']`)
      if (target && !checkInView(target)) {
        viewport.scrollTop = (cumulativeOffset(target).top - 50) * this.zoom / 100
      }
    },

    getWidgetTitle (type) {
      return this.widgets[type].title || ''
    },

    // new
    enter () {
      this.isCollapse = true
    },
    leave () {
      this.isCollapse = false
    },
    isSelected (uuid) {
      if (this.$vpd.state.multiSelect) {
        return this.$vpd.state.multiSelectCols.indexOf(uuid) > -1
      } else {
        return this.$vpd.state.uuid === uuid
      }
    }
  }
}
</script>
<style scoped>
  .toolbar.column{
    width:40px;
  }

  .menu-bar-new.toolbar-container{
    width:40px;
    padding:60px 0 0 30px;
    box-sizing: border-box;
    border-right:1px solid #1c293a;
    color: #f1f1f1;
  }
  .toolbar-ctrl-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 120px;
    overflow-y: hidden;
    z-index: 10;
  }
  .toolbar-ctrl-panel.min{
    width:40px;
  }
  .menu-bar-new .min-banner {
    z-index: 20;
    display: block;
    height: 100%;
    cursor: pointer;
    padding: 20px 10px 0;
    font-size: 20px;
    text-align: center;
    color:#f1f1f1;
    background-color: #1c293a;
    margin-left: -3px;
    box-sizing: border-box;
  }
  .menu-bar-new.big-panel .min-banner{
    display: none;
  }
  .menu-bar-new.toolbar-ctrl-panel.big-panel {
    width: 120px;
  }
  .toolbar-title{
    height:50px;
    line-height: 50px;
    margin:0;
    text-align: center;
    font-size:14px;
    background-color: #304156;
}
  .layer-list-new{
    list-style-type:none;
    padding:0;
    margin:0;
    font-size: 12px;
    text-align: center;
  }
  .layer-list-new li{
    height:40px;
    line-height: 40px;
    box-sizing: border-box;
    border-bottom:1px solid #1c293a;
    cursor: pointer;
  }
  .layer-active {
    background-color: #3a8ee6;
    color:#fff;
  }
  .layer-list-new li:hover {
    /*background-color: #47aff3;*/
    background-color: #3a8ee6;
    color:#fff;
  }
  .left-panel-cont{
    overflow-y: auto;
    height: 100%;
    background-color: #1c293a;
  }
  .left-panel-cont::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
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
