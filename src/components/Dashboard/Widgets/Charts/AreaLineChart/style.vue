<template>
  <div>
    <div v-show="tab === 1">
      <!-- 基础设置 -->
      <basic-settings :activeElement="activeElement"/>

      <div class="panel-item-new">
        <div @click="isShowX = !isShowX" class="panel-item-title">{{activeElement.axisReverse ? 'Y 轴' : 'X 轴'}}<i :class="isShowX ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" class="panel-title-arrow"></i></div>
        <div v-show="isShowX" class="panel-item-new-set">
          <div class="panel-row">
            <div class="panel-label">名称</div>
            <div>
              <input v-model="activeElement.xName" type="text">
            </div>
          </div>
          <div class="panel-row">
            <div class="panel-label">文本颜色</div>
            <div class="panel-value">{{ activeElement.xTextColor }}</div>
            <el-color-picker size="small" v-model="activeElement.xTextColor"/>
          </div>
          <div class="panel-row">
            <div class="panel-label">文本旋转</div>
            <div>
              <input
                v-model.number="activeElement.xRotate" type="number">
            </div>
          </div>
          <div class="panel-row">
            <div class="panel-label">轴线颜色</div>
            <div class="panel-value">{{ activeElement.xLineColor }}</div>
            <el-color-picker size="small" v-model="activeElement.xLineColor"/>
          </div>
          <div
            class="panel-row"
            flex>
            <div class="panel-label">显示轴</div>
            <div class="panel-value">
              <label class="form-switch">
                <input
                  v-model="activeElement.showX"
                  type="checkbox" >
                <i class="form-icon"/>
              </label>
            </div>
          </div>
          <div
            class="panel-row"
            flex>
            <div class="panel-label">显示网格</div>
            <div class="panel-value">
              <label class="form-switch">
                <input
                  v-model="activeElement.showXSplitLine"
                  type="checkbox" >
                <i class="form-icon"/>
              </label>
            </div>
          </div>
          <div
            class="panel-row"
            flex>
            <div class="panel-label">显示刻度</div>
            <div class="panel-value">
              <label class="form-switch">
                <input
                  v-model="activeElement.showXaxisTick"
                  type="checkbox" >
                <i class="form-icon"/>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-item-new">
        <div @click="isShowY = !isShowY" class="panel-item-title">{{activeElement.axisReverse ? 'X 轴' : 'Y 轴'}}<i :class="isShowY ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" class="panel-title-arrow"></i></div>
        <div v-show="isShowY" class="panel-item-new-set">
          <div class="panel-row">
            <div class="panel-label">名称</div>
            <div>
              <input v-model="activeElement.yName" type="text">
            </div>
          </div>
          <div class="panel-row">
            <div class="panel-label">文本颜色</div>
            <div class="panel-value">{{ activeElement.yTextColor }}</div>
            <el-color-picker size="small" v-model="activeElement.yTextColor"/>
          </div>
          <div
            class="panel-row"
            flex>
            <div class="panel-label">显示轴</div>
            <div class="panel-value">
              <label class="form-switch">
                <input
                  v-model="activeElement.showY"
                  type="checkbox" >
                <i class="form-icon"/>
              </label>
            </div>
          </div>
          <div
            class="panel-row"
            flex>
            <div class="panel-label">显示刻度</div>
            <div class="panel-value">
              <label class="form-switch">
                <input
                  v-model="activeElement.showYTick"
                  type="checkbox" >
                <i class="form-icon"/>
              </label>
            </div>
          </div>
          <div
            class="panel-row"
            flex>
            <div class="panel-label">显示轴线</div>
            <div class="panel-value">
              <label class="form-switch">
                <input
                  v-model="activeElement.showYLine"
                  type="checkbox" >
                <i class="form-icon"/>
              </label>
            </div>
          </div>
          <div
            v-show="activeElement.showYLine"
            class="panel-row">
            <div class="panel-label">轴线颜色</div>
            <div class="panel-value">{{ activeElement.yLineColor }}</div>
            <el-color-picker size="small" v-model="activeElement.yLineColor"/>
          </div>
          <div
            class="panel-row"
            flex>
            <div class="panel-label">显示标线</div>
            <div class="panel-value">
              <label class="form-switch">
                <input
                  v-model="activeElement.showYSplitLine"
                  type="checkbox" >
                <i class="form-icon"/>
              </label>
            </div>
          </div>
          <div
          v-show="activeElement.showYSplitLine"
          class="panel-row">
          <div class="panel-label">标线颜色</div>
          <div class="panel-value">{{ activeElement.splitLineColor }}</div>
          <el-color-picker size="small" v-model="activeElement.splitLineColor"/>
        </div>
        </div>
      </div>
      <div class="panel-item-new">
        <div @click="isShowLine = !isShowLine" class="panel-item-title">图表设置<i :class="isShowLine ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" class="panel-title-arrow"></i></div>
        <div v-show="isShowLine" class="panel-item-new-set">
          <div class="panel-row">
            <div class="panel-label">上边距</div>
            <div>
              <input
                v-model="activeElement.gridTop">
            </div>
          </div>
          <div class="panel-row">
            <div class="panel-label">下边距</div>
            <div>
              <input
                v-model="activeElement.gridBottom">
            </div>
          </div>
          <div class="panel-row">
            <div class="panel-label">左边距</div>
            <div>
              <input
                v-model="activeElement.gridLeft">
            </div>
          </div>
          <div class="panel-row">
            <div class="panel-label">右边距</div>
            <div>
              <input
                v-model="activeElement.gridRight">
            </div>
          </div>
          <div class="panel-row">
            <div class="panel-label">标题</div>
            <div>
              <input
                v-model="activeElement.chartTitle">
            </div>
          </div>
          <div class="panel-row">
          <div class="panel-label">标题颜色</div>
          <div class="panel-value">{{ activeElement.titleColor }}</div>
          <el-color-picker size="small" v-model="activeElement.titleColor"/>
        </div>
        </div>
      </div>
      <div class="panel-item-new">
        <div @click="isShowSet = !isShowSet" class="panel-item-title">相关配置<i :class="isShowSet ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" class="panel-title-arrow"></i></div>
        <div v-show="isShowSet" class="panel-item-new-set">
          <div class="panel-row">
            <div class="panel-label">配置颜色</div>
            <div class="panel-setcolor">
              <div
                v-for="(item,index) in activeElement.lgArr"
                :key="index"
                class="panel-setcolor-item">
                <div class="panel-value-new">{{ item.color }}</div>
                <el-color-picker size="small" v-model="item.color"/>
                <div>
                  <input
                    v-if="activeElement.lgArr.length > 1"
                    v-model="item.offset"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    class="radiusInp">
                </div>
                <button
                  v-if="index == 0"
                  class="pannel-setcolor-item-btn"
                  @click="addLGColor">添加</button>
                <button
                  v-else
                  class="pannel-setcolor-item-btn"
                  @click="delLGColor(index)">删除</button>
              </div>
            </div>
          </div>
          <div class="panel-row">
            <div class="panel-label">折线宽度</div>
            <div>
              <input
                v-model="activeElement.seriesLineWidth"
                type="number"
                min="0">
            </div>
          </div>
          <div
            class="panel-row"
            flex>
            <div class="panel-label">折线平滑</div>
            <div class="panel-value">
              <label class="form-switch">
                <input
                  v-model="activeElement.isSmooth"
                  type="checkbox" >
                <i class="form-icon"/>
              </label>
            </div>
          </div>
          <div>
            <div class="panel-row">
              <div class="panel-label">拐点图形</div>
              <div class="panel-value">
                <select v-model="activeElement.seriesSymbol">
                  <!--<option>{{activeElement.legendIcon}}</option>-->
                  <option
                    v-for="(val, index) in icon"
                    :key="index" :value="val.value">{{ val.name }}</option>
                </select>
              </div>
            </div>
          </div>
          <div
          v-show="activeElement.seriesSymbol !== 'none'"
          class="panel-row">
          <div class="panel-label">拐点大小</div>
          <div>
            <input
              v-model="activeElement.seriesSymbolSize"
              type="number"
              min="0">
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- 数据源设置 -->
    <div v-if="tab === 2">
      <data-settings :activeElement="activeElement"/>
    </div>

    <div v-show="tab === 3">
      <div
        class="panel-row"
        flex>
        <div class="panel-label">X/Y轴翻转</div>
        <div class="panel-value">
          <label class="form-switch">
            <input
              v-model="activeElement.axisReverse"
              type="checkbox" >
            <i class="form-icon"/>
          </label>
        </div>
      </div>
      <div
        class="panel-row"
        flex>
        <div class="panel-label">显示提示框</div>
        <div class="panel-value">
          <label class="form-switch">
            <input
              v-model="activeElement.showTooltip"
              type="checkbox" >
            <i class="form-icon"/>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataSettings from '../../CommonModule/DataSettings'
import BasicSettings from '../../CommonModule/BasicSettings'

export default {
  name: 'AreaLineChartStyle',
  components: {
    DataSettings,
    BasicSettings
  },
  props: ['activeElement', 'tab'],
  data () {
    return {
      isShowX: true,
      isShowY: true,
      isShowLine: true,
      isShowSet: true,
      icon: [
        {
          name: '无',
          value: 'none'
        }, {
          name: '圆形',
          value: 'circle'
        }, {
          name: '矩形',
          value: 'rectangle'
        }, {
          name: '三角形',
          value: 'triangle'
        }, {
          name: '空心圆',
          value: 'emptyCircle'
        }, {
          name: '菱形',
          value: 'diamond'
        }, {
          name: '标注',
          value: 'pin'
        }, {
          name: '箭头',
          value: 'arrow'
        }
      ]
    }
  },
  methods: {
    addLGColor () {
      let params = {
        property: 'lgArr',
        data: {
          color: '#0000ff',
          offset: 1
        }
      }
      this.$vpd.commit('ADD_COLOR', params)
    },
    delLGColor (index) {
      let params = {
        property: 'lgArr',
        data: {
          index: index
        }
      }
      this.$vpd.commit('DELETE_COLOR', params)
    }
  }
}
</script>
