<template>
  <div class="menu-bar">
    <ul class="widget-box"
      @mousedown="updateSrollTop">
      <li
        class="btn-item"
        style="cursor: default;"
        v-for="sort in widgetClassOptions"
        :key="sort.value"
        @mouseover="selectStyle (sort) "
        @mouseout="outStyle(sort)">
        <div class="btn-container">
          <svg-icon :icon-class="sort.icon" class="icon"/>
          <span class="btn-text">{{sort.text}}</span>
        </div>
        <div class="btn-item__list" v-show="sort.active">
          <div class="list-container">
            <ul class="tool-list clearfix">
              <li
                v-for="item in widgets(sort.value)"
                :key="item.name"
                @click="(e) => {addWidget(e, item)}">
                <span class="tool-item">
                  <div class="tool-item__icon" :style="{ backgroundImage: 'url(' + item.icon + ')' }"></div>
                  <div class="tool-item__name">{{ item.title }}</div>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import widget from '../plugins/widget'
import vpd from '../mixins/vpd'

const widgetClassOptions = [
  { value: 'chart', text: '图表', icon: 'chart' },
  { value: 'indicator', text: '指标', icon: 'dashboard' },
  { value: 'table', text: '表格', icon: 'table' },
  { value: 'text', text: '文字', icon: 'language' },
  { value: 'map', text: '地图', icon: 'international' },
  { value: 'effect', text: '特效', icon: 'effect' },
  { value: 'material', text: '素材', icon: 'material' }
]

export default {
  mixins: [vpd],
  props: ['zoom'],
  data () {
    return {
      widgetClassOptions
    }
  },
  computed: {
    widgets () {
      return function (group) {
        const widgets = widget.getWidgets()
        let result = {}
        for (let item in widgets) {
          if (widgets[item].group === group) {
            result[item] = widgets[item]
          }
        }

        return result
      }
    },
    layers () {
      return this.$vpd.state.widgets
    },
    activeElement () {
      return this.$vpd.state.activeElement
    }
  },
  methods: {
    selectStyle (item) {
      var _this = this
      this.$nextTick(function () {
        this.widgetClassOptions.forEach(function (item) {
          _this.$set(item, 'active', false)
        })
        this.$set(item, 'active', true)
      })
    },
    outStyle (item) {
      this.$set(item, 'active', false)
    },
    // 添加组件
    addWidget (e, item) {
      this.$vpd.dispatch('addWidget', item)
    },

    // 为确保添加的元件出现在可视区内，用画布向上滚动距离作为元件初始 top 值
    updateSrollTop () {
      var top = document.getElementById('viewport').scrollTop / this.zoom * 100
      this.$vpd.commit('UPDATE_SCROLL_TOP', top)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-bar {
  .widget-box {
    height: 60px;
    display: inline-block;
    list-style: none;
    margin: 0;
    padding: 0;

    .btn-item {
      float: left;
      margin-top: 4px;
      height: 52px;
      padding: 4px 12px;
      cursor: pointer;
      position: relative;

      .btn-container {
        font-size: 12px;
        text-align: center;
        .icon {
          display: block;
          margin: 5px auto 2px;
          font-size: 20px;
          color: #fff;
        }
        .btn-text {
          line-height: 16px;
          color: #ccc;
        }
      }
      .btn-item__list {
        position: absolute;
        top: 52px;
        width: 375px;
        left: -125px;
        height: auto;
        padding-top: 6px;

        .list-container {
          z-index: 22;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 6px rgba(0,0,0,.1);
          padding: 4px;
          background-color: #fff;
          color: #58666e;
          max-height: 380px;
          min-height: 100px;
          overflow-y: auto;
          .tool-list {
            list-style: none;
            padding: 0;
            li {
              float: left;
              margin: 0 5px 4px;
              .tool-item {
                display: inline-block;
                width: 79px;
                white-space: nowrap;
                overflow: hidden;
                cursor: pointer;
                .tool-item__icon {
                  background-size: 100% 100%;
                  background-repeat: no-repeat;
                  display: inline-block;
                  height: 44px;
                  width: 44px;
                  margin: 8px 12px 0;
                  border-radius: 2px;
                }
              }
              &:hover {
                background-color:rgb(240, 240, 240);
                border-radius:2px;
              }
            }
          }
        }
      }
      &:hover {
        background-color:rgb(88, 88, 88);
        border-radius:2px;
      }
    }
  }
}
</style>
