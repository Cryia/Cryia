<template>
  <div
    :style="{
      position: 'absolute',
      width: val.width / w * 100 + '%',
      height: val.height / h * 100 + '%',
      left: val.left / w * 100 + '%',
      top: val.top / h * 100 + '%',
      zIndex: val.z,
      backgroundColor: val.bgColor,
      color: val.color
    }"
    contenteditable="true">
    <v-echart
      :options="options"
      autoresize
      class="ffff"/>
  </div>
</template>

<script>
import stylec from './style.vue'
import echarts from 'echarts/lib/echarts'
import dataControl from '../../CommonModule/mixins/dataControl'

const WIDGET_NAME = 'AreaLineChart'
export default {
  name: WIDGET_NAME,
  group: 'chart',
  icon: require('./icon/thumb-linechart.png'),
  title: '折线区域图',
  panel: stylec,
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: false,
    hasGuide: true,
    isChild: true,
    dragable: true,
    resizable: true,
    width: 500,
    height: 250,
    left: 400,
    top: 400,
    z: 0,
    color: '#555555',
    name: '折线区域图', // 组件名称, 可自定义
    desc: '', // 描述, 可自定义
    belong: 'page',
    animationName: '',

    chartTitle: '销量', // 图表标题
    textStyleColor: '#666666', // 文本颜色
    itemStyleColor: '#42b983', // 柱状图颜色
    xyturn: false, // xy轴翻转
    titleColor: '#666666', // 标题颜色
    xTextColor: '#666666', // X 轴文字颜色
    yTextColor: '#666666', // Y 轴文字颜色
    xLineColor: '#666666', // X 轴线条颜色
    yLineColor: '#666666', // Y 轴线条颜色
    xName: '', // x 轴名称（单位文本）
    yName: '', // x 轴名称（单位文本）
    xRotate: 0, // x 轴文本旋转角度
    splitLineColor: '#3c4084', // y轴标线颜色
    showXaxisTick: false, // 是否显示 X 轴刻度线
    showYTick: false, // 是否显示 Y 轴刻度线
    showXLine: true, // 是否显示 X 轴轴线
    showYLine: false, // 是否显示Y 轴轴线
    showYSplitLine: true, // 是否显示Y 轴网格线
    showXSplitLine: false, // 是否显示X 轴网格线
    showX: true, // 是否显示 X 轴
    showY: true, // 是否显示 Y 轴

    lgArr: [{ // 设置渐变颜色数组
      color: '#9e1aa6',
      offset: 0
    }, {
      color: '#0000ff',
      offset: 1
    }],
    xyArr: ['xAxis', 'yAxis'],

    gridTop: '70', // 图表位置（距顶部）
    gridLeft: '3%', // 图表位置（距左边）
    gridRight: '8%', // 图表位置（距右边）
    gridBottom: '3%', // 图表位置（距底部）

    seriesLineWidth: 0, // 折线宽度
    seriesSymbol: 'none', // 拐点图形
    seriesSymbolSize: 5, // 拐点大小
    isSmooth: true, // 折线是否平滑
    showTooltip: false, // 是否显示提示框

    dataAPI: 'https://easy-mock.com/mock/5cc6c0a89edd7844f38df463/cryia/api/salevolume', // API拉取地址
    dataAutoRefresh: false, // 是否自动刷新
    dataOrigin: 'local', // local 本地 api 远程接口
    dataRefreshTime: 5, // 自动刷新间隔（秒）
    dataRefresh: false, // 刷新图表, 控制面板中测试dataApi使用

    // 数据联动配置
    linkEnable: false, // 开启联动
    linkIsMain: false, // 是否是数据源
    linkMainUUID: '', // 上级的UUID, 通过此标志获取联动的数据

    keyPrimary: 'data',
    keyTarget: 'statistics', // 响应数据对应的字段名
    keyXAxis: 'vendor', // 从该字段取x轴数据
    keyYAxis: 'sales', // 从该字段取y轴数据

    staticData: {
      'code': 0,
      'data': {
        'year': 2019,
        'statistics': [
          {
            'vendor': 'Samsung',
            'sales': 33801
          },
          {
            'vendor': 'iPhone',
            'sales': 63395
          },
          {
            'vendor': 'HUAWEI',
            'sales': 89297
          },
          {
            'vendor': 'VIVO',
            'sales': 76689
          },
          {
            'vendor': 'OPPO',
            'sales': 32219
          },
          {
            'vendor': 'MI',
            'sales': 98748
          },
          {
            'vendor': 'Meizu',
            'sales': 18290
          },
          {
            'vendor': '8848',
            'sales': 66282
          }
        ]
      }
    }
  },
  mixins: [dataControl],
  props: ['w', 'h', 'val'],
  data () {
    return {
      dynamicData: {}
    }
  },
  computed: {
    categories () {
      if (this.dynamicData[this.val.keyPrimary] && this.dynamicData[this.val.keyPrimary][this.val.keyTarget]) {
        return this.dynamicData[this.val.keyPrimary][this.val.keyTarget].map(item => {
          return item[this.val.keyXAxis]
        })
      } else {
        return []
      }
    },
    dataSeries () {
      if (this.dynamicData[this.val.keyPrimary] && this.dynamicData[this.val.keyPrimary][this.val.keyTarget]) {
        return this.dynamicData[this.val.keyPrimary][this.val.keyTarget].map(item => {
          return item[this.val.keyYAxis]
        })
      } else {
        return []
      }
    },
    xAxis () {
      return {
        name: this.val.xName,
        nameTextStyle: {
          color: this.val.xTextColor
        },
        type: 'category',
        nameLocation: 'end',
        show: this.val.showX, // 是否显示 X 轴
        nameGap: '12',
        boundaryGap: false,
        axisTick: {
          show: this.val.showXaxisTick // 是否显示 X 轴刻度线
        },
        axisLine: {
          show: this.val.showXLine, // 是否显示 X 轴轴线
          lineStyle: {
            color: this.val.xLineColor // X 轴线条颜色
          }
        },
        splitLine: {
          show: this.val.showXSplitLine // X 轴网格线
        },
        axisLabel: {
          interval: 0, // 当x轴宽度不够时，设置每隔几项显示一项
          rotate: this.val.xRotate, // x轴文本旋转角度 -90 ~ 90
          textStyle: {
            color: this.val.xTextColor // X 轴文字颜色
          }
        },
        data: this.categories // 数据
      }
    },
    yAxis () {
      return { // 纵轴标尺固定
        name: this.val.yName,
        nameTextStyle: {
          color: this.val.yTextColor
        },
        show: this.val.showY, // 是否显示 Y 轴
        type: 'value',
        scale: true,
        inverse: false,
        // max: Math.max.apply(null, this.val.dataJSON.data.series),
        min: 0,
        axisLine: {
          show: this.val.showYLine, // 是否显示 Y 轴轴线
          lineStyle: {
            color: this.val.yLineColor // Y 轴线条颜色
          }
        },
        axisLabel: {
          textStyle: {
            color: this.val.yTextColor // Y 轴文字颜色
          }
        },
        axisTick: {
          show: this.val.showYTick, // 是否显示 Y 轴刻度线
          alignWithLabel: this.val.yAxisLabel // Y 轴偏移
        },
        splitLine: {
          show: this.val.showYSplitLine, // 是否显示 Y 轴网格线
          lineStyle: {
            type: 'solid',
            color: this.val.splitLineColor // y轴标线颜色
          }
        },
        boundaryGap: [0.2, 0.2]
      }
    },
    options () {
      return {
        title: {
          text: this.val.chartTitle, // 图表标题
          textStyle: {
            color: this.val.titleColor
          }
        },
        tooltip: {
          show: this.val.showTooltip, // 是否显示提示框
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: '销量'
        },
        grid: {
          top: this.val.gridTop, // 上边距
          left: this.val.gridLeft, // 图表位置 左边距
          right: this.val.gridRight, // 右边距
          bottom: this.val.gridBottom, // 下边距
          containLabel: true
        },
        xAxis: this.val.axisReverse ? this.yAxis : this.xAxis,
        yAxis: this.val.axisReverse ? this.xAxis : this.yAxis,
        series: [{
          name: '销量',
          type: 'line',
          symbol: this.val.seriesSymbol, // 拐点图形 'circle' | 'rectangle' | 'triangle' | 'diamond' | 'pin'（标注）、'arrow'（箭头）
          symbolSize: this.val.seriesSymbolSize, // 拐点圆的大小
          smooth: this.val.isSmooth, // 平滑
          itemStyle: {
            normal: {
              lineStyle: {
                width: this.val.seriesLineWidth, // 折线宽度
                type: 'solid', // 折线样式
                color: this.val.lgArr[0].color // 折线颜色
              }
            }
          },
          areaStyle: {
            show: false,
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, this.val.lgArr) // 折线区域渐变色
            }
          },
          // data: this.val.dataJSON.data.series
          data: this.dataSeries
        }]
      }
    }
  }
}
</script>
