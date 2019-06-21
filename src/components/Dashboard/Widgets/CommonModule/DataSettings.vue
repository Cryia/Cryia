<template>
<div>
  <div class="panel-item-new">
    <div class="panel-item-title">数据结构</div>
    <div class="panel-row">
      <div class="panel-label">数据对象</div>
      <div>
        <input
          v-model="activeElement.keyPrimary">
      </div>
    </div>

    <div class="panel-row">
      <div class="panel-label">匹配数据</div>
      <div>
        <input
          v-model="activeElement.keyTarget">
      </div>
    </div>

    <div class="panel-row">
      <div class="panel-label">X轴集合</div>
      <div>
        <input
          v-model="activeElement.keyXAxis">
      </div>
    </div>

    <div class="panel-row">
      <div class="panel-label">Y轴集合</div>
      <div>
        <input
          v-model="activeElement.keyYAxis">
      </div>
    </div>
  </div>

  <div class="panel-item-new">
    <div class="panel-item-title">联动</div>
    <div class="panel-row" flex>
      <div class="panel-label">开启联动</div>
      <div class="panel-value">
        <label class="form-switch">
          <input
            v-model="activeElement.linkEnable"
            type="checkbox" >
          <i class="form-icon"/>
        </label>
      </div>
      <div class="panel-value" v-show="activeElement.linkEnable">
        <input
          v-model="activeElement.linkIsMain"
          type="checkbox"
          id='checkbox-im' >
        <label class="panel-label" for='checkbox-im'>推送数据</label>
      </div>
    </div>

    <div v-if="activeElement.linkEnable && !activeElement.linkIsMain">
      <div class="panel-row">
        <div class="panel-label">选择数据源</div>
        <div class="panel-value">
          <select v-model="activeElement.linkMainUUID">
            <option
              v-for="widget in linkages"
              :key="widget.uuid"
              :value='widget.uuid'>{{ widget.name }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>

  <div v-if="(activeElement.linkEnable && activeElement.linkIsMain) || !activeElement.linkEnable" class="panel-item-new">
    <div class="panel-item-title">数据源</div>
    <div class="data-group">
      <div
        class="radioscont">
        <label class="radiolabel">
          <input
            v-model="activeElement.dataOrigin"
            type="radio"
            class="inpRadio"
            name="task"
            value="api">API拉取
        </label>
        <label class="radiolabel">
          <input
            v-model="activeElement.dataOrigin"
            type="radio"
            class="inpRadio"
            name="task"
            value="local">静态JSON
        </label>
      </div>
      <div class="radiowrap">
        <div v-if="dataOrigin == 'api'">
          <textarea
            v-model="activeElement.dataAPI"
            cols="30"
            rows="3"
            placeholder="$CUR_HOST/openapi/demo/chart?type=sellGoods"/>

          <p class="api-p">可使用示例API：</p>
          <textarea cols="30" rows="2" style="border:none" readonly>https://mock.kunteng.org.cn/mock/5ca2cba34918866472494a14/barchart</textarea>
          <br/>
          <div
            class="panel-row"
            flex>
            <el-button class="api-btn" size="mini" type="primary" @click="activeElement.dataRefresh = !activeElement.dataRefresh">刷新图表</el-button>
            <div class="panel-label">自动刷新</div>
            <div class="panel-value">
              <label class="form-switch">
                <input
                  v-model="activeElement.dataAutoRefresh"
                  type="checkbox" >
                <i class="form-icon"/>
              </label>
            </div>
          </div>
          <div
            v-if="activeElement.dataAutoRefresh"
            class="panel-row">
            <div class="panel-label">时间间隔</div>
            <div>
              <input
                :value="activeElement.dataRefreshTime"
                type="number"
                @input="changeTimer($event)">
            </div>
          </div>
          <p class="api-p">数据的自动刷新在非编辑模式下有效，最小刷新间隔为10秒<span style="color:red">未完成</span></p>
        </div>
        <div v-if="dataOrigin == 'local'">
          <json-editor
            :codes="localData"
            @onCodeChange="changeJsonCode" />
          <!-- <button class="btn-small" @click="refreshMonaco">刷新数据</button> -->
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import JsonEditor from './MonacoEditor'

import vpd from '@/components/Dashboard/Designer/mixins/vpd'

export default {
  name: 'WidgetDataSettings',
  components: {
    JsonEditor
  },
  mixins: [vpd],
  props: ['activeElement'],
  computed: {
    dataOrigin () {
      return this.activeElement.dataOrigin
    },
    localData () {
      return JSON.stringify(this.activeElement.staticData, null, 2)
    },
    linkages () {
      return this.$vpd.state.widgets.map(
        val => val.linkEnable && val.linkIsMain && { uuid: val.uuid, name: val.name }
      )
    }
  },
  methods: {
    changeJsonCode (value, event) {
      this.$vpd.commit('UPDATE_STATIC_DATA', JSON.parse(value))
    },
    changeTimer (e) {
      const param = {
        name: 'dataRefreshTime',
        value: e.target.value
      }
      this.$vpd.commit('UPDATE_ACTIVE_ELEMENT', param)
    }
  }
}
</script>
<style>
  .api-p{
    font-size:14px;
  }
  .panel-wrap .api-btn{
    padding:0 6px;
  }
</style>
