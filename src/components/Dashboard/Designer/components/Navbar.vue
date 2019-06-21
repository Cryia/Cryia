<template>
  <header class="header">
    <div class="navbar1 container grid-xl">
      <section class="logo navbar-cont">
        <a><img class="edit-log" src="../../../../assets/logo-white.png" alt=""></a>
      </section>
      <section class="navbar-cont nav-middle">
        <widget-box :zoom="zoom"/>
      </section>
      <section class="navbar-cont navbar-right">
        <a
          class="btn btn-link tooltip tooltip-bottom"
          data-tooltip="预览"
          @click="preview">
          <svg-icon icon-class="eye-open" />
        </a>
        <a
          class="btn btn-link tooltip tooltip-bottom"
          data-tooltip="撤销 Ctrl + Z"
          @click="undo">
          <svg-icon icon-class="undo" />
        </a>
        <a
          class="btn btn-link tooltip tooltip-bottom"
          data-tooltip="保存"
          @click="save">
          <svg-icon icon-class="save" />
        </a>
        <a
          class="btn btn-link tooltip tooltip-bottom"
          data-tooltip="退出"
          @click="quit">
          <svg-icon icon-class="quit" />
        </a>
      </section>
    </div>
  </header>
</template>

<script>
import vpd from '../mixins/vpd'
import WidgetBox from './WidgetBox.vue'

export default {
  components: {
    WidgetBox
  },
  mixins: [vpd],
  computed: {
    show () {
      return this.$vpd.state.type !== 'page'
    },
    zoom () {
      return this.$vpd.state.page.zoom
    }
  },
  mounted () {
    document.addEventListener('keyup', this.triggerKeyupFn)
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.triggerKeyupFn)
  },
  methods: {
    save () {
      this.$vpd.dispatch('save')
    },

    copyWidget () {
      this.$vpd.commit('COPY_WIDGET')
    },

    dele () {
      this.$vpd.commit('DELETE_WIDGET')
    },

    quit () {
      this.$vpd.dispatch('quit')
    },

    undo () {
      this.$vpd.dispatch('undo')
    },

    preview () {
      this.$vpd.dispatch('preview')
    },

    triggerKeyupFn (e) {
      e.stopPropagation()

      // 快捷键 - 删除
      if (e.keyCode === 46) {
        this.dele()
      }

      // 快捷键 - 复制
      // if ((e.ctrlKey || e.metaKey) && e.keyCode === 67) {
      //   this.copyWidget()
      // }

      // 快捷键 - 撤销
      if ((e.ctrlKey || e.metaKey) && e.keyCode === 90) {
        this.undo()
      }
    }
  }
}
</script>

<style lang="scss">
  @import '../style/_variables.scss';
  .header {
    background-color: #24292e;
    padding: 12px 0;
  }
  .navbar1 {
    .svg-icon {
      svg {
        vertical-align: middle;
      }
    }
    .btn.btn-link {
      color: $gray-color;
      margin-right: 5px;
    }
    .btn.btn-link:hover {
      color: $light-color;
    }
    .logo {
      font-size: 20px;
      .svg-icon {
        width: 30px;
        text-align: center;
        background-color: $light-color;
        border-radius: 50%;
      }
    }
  }
</style>
<style scoped>
  .navbar-section{
    flex:0 1 0;
  }
  .addWidget{
    width: 90px;
    color:#3fff;
    cursor: pointer;
    height:60px;
    line-height: 60px;
    display: inline-block;
  }
  .addWidget:hover{
    color:#3ffeee;
  }
  .navbar-widget-cont{
    width:100%;
    height:100%;
  }
  .index-show{
    position: absolute;
    width:400px;
    height:320px;
    z-index: 9999;
    top:60px;
    left:0;
    right:0;
    margin-left: auto;
    margin-right: auto;
    display: none;
  }
  .navbar-cont{
    float:left;
    width:33%;
  }
  .nav-middle:hover .index-show{
    display: block;
  }
  .header{
    padding:0;
    height:60px;
    position: fixed;
    top: 0;
    z-index: 9998;
    width: 100%;
  }
  .navbar-right{
    text-align: right;
  }
  .nav-middle{
    text-align: center;
  }
  .navbar-right,.logo{
    line-height: 60px;
  }
  .logo a{
    color:#bcc3ce;
  }
  .icon-item {
    font-size: 25px;
    color: #FFFFFF;
    cursor: pointer;
  }
  .icon-item span {
    display: block;
    font-size: 12px;
  }
  .edit-log{
    height:55px;
    padding-top:6px;
  }
</style>
