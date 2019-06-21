<template>
  <div
    :class="[isCollapse?'big-panel':'']"
    class="menu-bar-new big-panel panel-container panel-ctrl-panel"
    @mouseenter="enter()"
    @mouseleave="leave()">
    <div class="min-banner">控制面板</div>
    <div
      :class="[isCollapse?'':'noShow']"
      class="panel-detail">

      <page
        :active-element="activeElement"
        :tab="activeTab"/>
      <appearance
        :active-element="activeElement"
        :tab="activeTab"/>
      <event
        :active-element="activeElement"
        :tab="activeTab"/>
      <animation
        :active-element="activeElement"
        :tab="activeTab"/>
    </div>
  </div>
</template>

<script>
import Page from './Page'
import Style from './Style'
import Event from './Event'
import Animation from './Animation'

import vpd from '../../mixins/vpd'

export default {
  components: {
    page: Page,
    appearance: Style,
    event: Event,
    animation: Animation
  },
  mixins: [vpd],

  data () {
    return {
      activeTab: 1,
      isCollapse: false
    }
  },

  computed: {
    // 选中元素对象
    activeElement () {
      return this.$vpd.state.activeElement
    }
  },
  methods: {
    // new
    enter () {
      this.isCollapse = true
    },
    leave () {
      this.isCollapse = false
    }
  }
}
</script>

<style>
  .panel-container.panel-ctrl-panel{
    width:40px;
    padding:60px 0 0 0;
    box-sizing: border-box;
  }
  .panel-ctrl-panel{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 120px;
    overflow-y: hidden;
    background-color: #fff;
    padding-left: 3px;
    z-index: 10;
  }
  .panel-ctrl-panel .min-banner{
    z-index: 20;
    display: block;
    height: 100%;
    cursor: pointer;
    padding: 20px 10px 0;
    font-size: 20px;
    text-align: center;
    color:#aab2bd;
    margin-left: -3px;
    box-sizing: border-box;
  }
  .panel-container .panel-ctrl-panel .noShow{
    display: none;
  }
  .panel-container.panel-ctrl-panel.big-panel{
    width:300px;
    border-left:1px solid #1c293a;
  }
  .panel-ctrl-panel.big-panel .min-banner{
    display: none;
  }
  .panel-detail{
    overflow-y: auto;
    height:100%;
  }
  .panel-wrap::-webkit-scrollbar {/*滚动条整体样式*/
    width: 10px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .panel-wrap::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 10px;
    /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);*/
    background: #999999;
  }
  .panel-wrap::-webkit-scrollbar-track {/*滚动条里面轨道*/
    /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.1);*/
    border-radius: 10px;
    background: #e8e8e8;
  }

</style>
<style lang="scss">
  @import '../../style/_variables.scss';
  .panel-tab {
    padding: 0;
  }
  .panel-wrap {
    height: calc(100%);
    padding: 15px 0;
    position: relative;
    overflow-y: auto;
    .btn-action {
      background-color: none;
      border: none;
      border-radius: 50%;
    }
    .btn-action:hover {
      background-color: #f5f5f5;
    }
  }
  .panel-row {
    display: flex;
    font-size: 13px;
    line-height: 36px;
  }
  .panel-row .svg-icon {
    font-size: 16px;
    color: $gray-color;
  }
  .panel-label {
    display: inline-block;
    width: 80px;
    height: 36px;
    padding-left: 6px;
    margin-left:15px;
  }
  .panel-value {
    min-width: 80px;
    display: flex;
    align-items: center;
  }
  .panel-slider-wrap {
    flex-grow: 1;
    padding: 6px 5px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .panel-row:hover .panel-slider-wrap {
    opacity: 1;
  }
  .panel-cell {
    flex-grow: 1;
  }
  .panel-wrap input:checked ~ .svg-icon svg {
    stroke: #333;
  }
  .panel-select {
    width: 100%;
    height: 32px;
    border: 1px solid #ccc;
  }
  .panel-wrap hr {
    margin: 20px 0;
    border: none;
    border-top: 1px solid #f5f5f5;
  }
  .panel-wrap select,
  .panel-wrap input[type="text"] {
    /*width: 100%;*/
  }

  .panel-preview {
    width: 150px;
    height: 32px;
    background: no-repeat center/100%;
    cursor: pointer;
  }
  .panel-item-new {
    /*padding-bottom: 10px;*/
  }
  .panel-item-title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    font-size:14px;
    background-color: #304156;
    border-bottom: 1px solid #1c293a;
    cursor: pointer;
  }
  .panel-item-new-set{
    padding: 10px 0;
  }
  .panel-title-arrow{
    float: right;line-height: 40px
  }
</style>
