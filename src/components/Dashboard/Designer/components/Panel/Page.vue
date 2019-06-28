<template>
  <div
    v-if="activeElement.page && tab === 1"
    class="panel-wrap">
    <div
      class="panel-row"
      flex>
      <div class="panel-label">大屏名称</div>
      <div class="panel-value">
        <input
          v-model="activeElement.title">
      </div>
    </div>

    <div
      class="panel-row"
      flex>
      <div class="panel-label">大屏简介</div>
      <div class="panel-value">
        <textarea class="panel-about"
          v-model="activeElement.about">
        </textarea>
      </div>
    </div>

    <div
      class="panel-row"
      flex>
      <div class="panel-label">页面宽度</div>
      <div class="panel-value">
        <input
          v-model.number="activeElement.width"
          type="number">
      </div>
    </div>

    <div
      class="panel-row"
      flex>
      <div class="panel-label">页面高度</div>
      <div class="panel-value">
        <input
          v-model.number="activeElement.height"
          type="number">
      </div>
    </div>

    <div
      class="panel-row"
      flex>
      <div class="panel-label">页面背景色</div>
      <div class="panel-value">
        <el-color-picker v-model="activeElement.backgroundColor" size="mini" show-alpha></el-color-picker>
      </div>
    </div>
    <div class="panel-row">
      <div class="panel-label">背景图</div>
      <div class="panel-value">
        <div
          :style="{ backgroundImage: activeElement.backPic}"
          class="panel-preview pic-updata-btn"
          @click="addPic">
          {{ (activeElement.backPic == '' || activeElement.backPic == 'url()') ? '点击上传' : '重新上传'}}
          <vpd-icon
            v-show="!activeElement.backPic"
            name="plus"/>
        </div>
        <button
          v-show="activeElement.backPic !== '' && activeElement.backPic !== 'url()'"
          class="panel-page-del-btn"
          @click="delBgImg">清空背景图</button>
      </div>
    </div>
  </div>
</template>

<script>
import vpd from '../../mixins/vpd'
export default {
  mixins: [vpd],
  props: ['activeElement', 'tab'],
  methods: {
    addPic () {
      this.$vpd.$emit('upload', (payload) => {
        this.$vpd.commit('ADD_PAGE_BACKGROUND_IMAGE', payload)
      })
    },
    delBgImg () {
      let params = [{ url: '' }]
      this.$vpd.commit('ADD_PAGE_BACKGROUND_IMAGE', params)
    }
  }
}
</script>
<style>
  .panel-preview.pic-updata-btn{
    width: 70px;
    background-color: #304156;
    text-align: center;
    line-height: 32px;
  }
  .panel-row .panel-page-del-btn{
    height:32px;
    line-height: 32px;
    margin: 0 8px;
    padding:0 6px;
    border: none;
    background: #42b983;
    color: #304156;
    cursor: pointer;
    border-radius: 2px;
  }
  .panel-about {
    width: 175px;
    height: 100px;
  }
</style>
