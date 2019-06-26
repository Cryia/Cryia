<template>
  <div
    id="rulerTool"
    :style="{ width: rulerWidth + 'px', height: rulerHeight + 'px', position:position }"
    class="ScaleBox"
    onselectstart="return false;">
    <div v-show="rulerToggle" id="levelRuler" class="ScaleRuler_h" @mousedown.stop="levelDragRuler">
      <span
        v-for="(item,index) in xScale"
        :key="index" :style="{left:index * 50 + 2 + 'px'}"
        class="n">{{ item.id }}
      </span>
    </div>

    <div v-show="rulerToggle" id="verticalRuler" class="ScaleRuler_v" @mousedown.stop="verticalDragRuler">
      <span
        v-for="(item,index) in yScale"
        :key="index"
        :style="{top:index * 50 + 2 + 'px'}"
        class="n">{{ item.id }}
      </span>
    </div>

    <div id="levelDottedLine" :style="{top:verticalDottedTop + 'px'}" class="RefLine_h">
      <span class="title-v" v-show="isDrag">{{ verticalDottedTop - 17 + 'px' }}</span>
    </div>

    <div id="verticalDottedLine" :style="{left:levelDottedLeft + 'px'}" class="RefLine_v">
      <span class="title-h" v-show="isDrag">{{ levelDottedLeft - 17 + 'px' }}</span>
    </div>

    <div
      v-for="item in levelLineList"
      :id="item.id"
      :title="item.title"
      :style="{top:item.top+ 'px'}"
      :key="item.id"
      class="RefLine_h"
      @dblclick="removeLevelLine(item.id)"
      @mousedown="dragLevelLine(item.id)">
    </div>
    <div
      v-for="item in verticalLineList"
      :id="item.id"
      :title="item.title"
      :style="{left:item.left+ 'px'}"
      :key="item.id"
      class="RefLine_v"
      @dblclick="removeVerticalLine(item.id)"
      @mousedown="dragVerticalLine(item.id)"/>

    <div
      id="content"
      :style="{left: contentLayout.left + 'px', top: contentLayout.top + 'px', padding: paddingTop + 'px'}">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VueRulerTool',
  components: {},
  props: {
    position: {
      type: String,
      default: 'relative',
      validator: function (val) {
        return ['absolute', 'fixed', 'relative', 'static', 'inherit'].indexOf(val) !== -1
      }
    },
    // 热键开关
    isHotKey: {
      type: Boolean, default: true
    },
    // 刻度修正(根据content进行刻度重置)
    isScaleRevise: {
      type: Boolean, default: false
    },
    // 预置参考线
    presetLine: {
      type: Array,
      default: () => {
        return [] // { type: 'l', site: 50 }, { type: 'v', site: 180 }
      }
    },
    // 内容部分布局
    contentLayout: {
      type: Object,
      default: () => {
        return { top: 0, left: 0 }
      }
    },
    // 标尺辅助线显示开关
    rulerToggle: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 1920
    },
    height: {
      type: Number,
      default: 1080
    },
    zoom: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      xScale: [], // 水平刻度
      yScale: [], // 垂直刻度
      refWidth: 18,
      refHeight: 18,
      topSpacing: 60, // 标尺与窗口上间距
      leftSpacing: 40, //  标尺与窗口左间距
      isDrag: false,
      dragFlag: '', // 拖动开始标记，可能值x(从水平标尺开始拖动),y(从垂直标尺开始拖动)
      levelLineList: [], // 生成的水平线列表
      verticalLineList: [], // 生成的垂直线列表
      levelDottedLeft: -999, // 水平虚线位置
      verticalDottedTop: -999, // 垂直虚线位置
      dragLineId: '', // 被移动线的ID

      timer: null // 控制双击和拖动事件
    }
  },
  computed: {
    paddingTop () {
      return this.rulerToggle ? 18 : 0
    },
    rulerWidth () {
      return this.width * (this.zoom / 100) + this.paddingTop
    },
    rulerHeight () {
      return this.height * (this.zoom / 100) + this.paddingTop
    }
  },
  watch: {
    width: function (n, o) {
      this.scaleCalc()
    },
    height: function (n, o) {
      this.scaleCalc()
    },
    zoom: function (n, o) {
      this.scaleCalc()
    }
  },
  mounted () {
    document.documentElement.addEventListener('mousemove', this.dottedLineMove, true)
    document.documentElement.addEventListener('mouseup', this.dottedLineUp, true)
    this.init()
    this.quickGeneration(this.presetLine)
  },
  beforeDestroy: function () {
    document.documentElement.removeEventListener('mousemove', this.dottedLineMove, true)
    document.documentElement.removeEventListener('mouseup', this.dottedLineUp, true)
  },
  methods: {
    init () {
      if (!this.rulerToggle) {
        return
      }
      this.refWidth = document.getElementById('verticalRuler').clientWidth
      this.refHeight = document.getElementById('levelRuler').clientHeight
      this.topSpacing = document.getElementById('levelRuler').offsetParent.offsetTop
      this.leftSpacing = document.getElementById('verticalRuler').offsetParent.offsetLeft

      this.scaleCalc()
    },
    scaleCalc () {
      this.xScale = []
      this.yScale = []

      const scale = parseInt(50 * (100 / this.zoom))
      for (let i = 0; i < this.width; i += 1) {
        if (i % scale === 0) {
          this.xScale.push({ id: i })
        }
      }

      for (let i = 0; i < this.height; i += 1) {
        if (i % scale === 0) {
          this.yScale.push({ id: i })
        }
      }
    },
    newLevelLine () {
      this.isDrag = true
      this.dragFlag = 'x'
    },
    newVerticalLine () {
      this.isDrag = true
      this.dragFlag = 'y'
    },
    // 虚线移动
    dottedLineMove ($event) {
      switch (this.dragFlag) {
        case 'x':
          if (this.isDrag) {
            this.verticalDottedTop = $event.pageY - this.topSpacing
          }
          break
        case 'y':
          if (this.isDrag) {
            this.levelDottedLeft = $event.pageX - this.leftSpacing
          }
          break
        case 'l':
          if (this.isDrag) {
            this.verticalDottedTop = $event.pageY - this.topSpacing
          }
          break
        case 'v':
          if (this.isDrag) {
            this.levelDottedLeft = $event.pageX - this.leftSpacing
          }
          break
        default:
          break
      }
    },
    // 虚线松开
    dottedLineUp ($event) {
      if (this.isDrag) {
        this.isDrag = false
        switch (this.dragFlag) {
          case 'x':
            this.levelLineList.push(
              {
                id: 'levelLine' + this.levelLineList.length + 1,
                title: $event.pageY + 1 - this.topSpacing - 18 + 'px',
                top: $event.pageY - this.topSpacing + 1
              }
            )
            break
          case 'y':
            this.verticalLineList.push(
              {
                id: 'verticalLine' + this.verticalLineList.length + 1,
                title: $event.pageX + 1 - this.leftSpacing - 18 + 'px',
                left: $event.pageX - this.leftSpacing + 1
              }
            )
            break
          case 'l':
            if ($event.pageY - this.topSpacing < this.refHeight) {
              let Index, id
              this.levelLineList.forEach((item, index) => {
                if (item.id === this.dragLineId) {
                  Index = index
                  id = item.id
                }
              })
              this.levelLineList.splice(Index, 1, {
                id: id,
                title: -600 + 'px',
                top: -600
              })
            } else {
              let Index, id
              this.levelLineList.forEach((item, index) => {
                if (item.id === this.dragLineId) {
                  Index = index
                  id = item.id
                }
              })
              this.levelLineList.splice(Index, 1, {
                id: id,
                title: $event.pageY + 1 - this.topSpacing - 18 + 'px',
                top: $event.pageY - this.topSpacing + 1
              })
            }
            break
          case 'v':
            if ($event.pageX - this.leftSpacing < this.refWidth) {
              let Index, id
              this.verticalLineList.forEach((item, index) => {
                if (item.id === this.dragLineId) {
                  Index = index
                  id = item.id
                }
              })
              this.verticalLineList.splice(Index, 1, {
                id: id,
                title: -600 + 'px',
                left: -600
              })
            } else {
              let Index, id
              this.verticalLineList.forEach((item, index) => {
                if (item.id === this.dragLineId) {
                  Index = index
                  id = item.id
                }
              })
              this.verticalLineList.splice(Index, 1, {
                id: id,
                title: $event.pageX + 1 - this.leftSpacing - 18 + 'px',
                left: $event.pageX - this.leftSpacing + 1
              })
            }
            break
          default:
            break
        }
        this.verticalDottedTop = this.levelDottedLeft = -20
      }
    },
    // 水平标尺处按下鼠标
    levelDragRuler () {
      this.newLevelLine()
    },
    // 垂直标尺处按下鼠标
    verticalDragRuler () {
      this.newVerticalLine()
    },
    // 水平线处按下鼠标
    dragLevelLine (id) {
      const that = this
      this.timer = setTimeout(function () {
        that.isDrag = true
        that.dragFlag = 'l'
        that.dragLineId = id
      }, 200)
    },
    dragVerticalLine (id) {
      const that = this
      this.timer = setTimeout(function () {
        that.isDrag = true
        that.dragFlag = 'v'
        that.dragLineId = id
      }, 200)
    },
    removeLevelLine (id) {
      clearTimeout(this.timer)
      let Index
      this.levelLineList.forEach((item, index) => {
        if (item.id === this.dragLineId) {
          Index = index
          id = item.id
        }
      })
      this.levelLineList.splice(Index, 1)
    },
    removeVerticalLine (id) {
      clearTimeout(this.timer)
      let Index
      this.verticalLineList.forEach((item, index) => {
        if (item.id === this.dragLineId) {
          Index = index
          id = item.id
        }
      })
      this.verticalLineList.splice(Index, 1)
    },
    quickGeneration (params) {
      if (params !== []) {
        params.forEach(item => {
          switch (item.type) {
            case 'l':
              this.levelLineList.push({
                id: 'levelLine' + this.levelLineList.length + 1,
                title: item.site + 'px',
                top: item.site
              })
              break
            case 'v':
              this.verticalLineList.push({
                id: 'verticalLine' + this.verticalLineList.length + 1,
                title: item.site + 'px',
                left: item.site
              })
              break
            default:
              break
          }
        })
      }
    } // 快速生成参考线
  }
}
</script>

<style scoped>
  .ScaleBox {
    left: 0;
    top: 0;
    z-index: 1;
    overflow: hidden;
    user-select: none;
  }

  .ScaleRuler_h, .ScaleRuler_v, .RefLine_v, .RefLine_h, .RefDot_h, .RefDot_v {
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    z-index: 1;
  }

  .ScaleRuler_h {
    width: 100%;
    height: 18px;
    left:18px;
    opacity: 1;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAASCAYAAAAZk42HAAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAUUlEQVR42mLk4hX8zzAMACMDA8N/A8ewIe8RJoZhAkY9MuqRUY+MemTUI6MeGfUIKR65sH/VoFY3vGNksIc+NnWjmX1Q9keGg0cAAAAA//8DAIMSGA8Oi7GNAAAAAElFTkSuQmCC) repeat-x;/*./image/ruler_h.png*/
  }

  .ScaleRuler_v {
    width: 18px;
    height: 100%;
    top:18px;
    opacity: 1;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAyCAIAAADeABw2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5NDc0NzhGNTkzRTMxMUU5OTY5RUFEODU1QjBCMTRGMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5NDc0NzhGNjkzRTMxMUU5OTY5RUFEODU1QjBCMTRGMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjk0NzQ3OEYzOTNFMzExRTk5NjlFQUQ4NTVCMEIxNEYxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjk0NzQ3OEY0OTNFMzExRTk5NjlFQUQ4NTVCMEIxNEYxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+fnSjBwAAAENJREFUeNpi4OIVZCAdMAK1qZm4kqTnwv5VTAxkAfpqYyHJS6NBgi0wRoNkNJWMppLRVDKaSkZTyWgqGU0lNNIGEGAARvMylGhDImMAAAAASUVORK5CYII=) repeat-y; /*./image/ruler_v.png*/
  }

  .ScaleRuler_v .n, .ScaleRuler_h .n {
    position: absolute;
    font: 10px/1 Arial, sans-serif;
    color: #bbbbbb;
    cursor: default;
  }

  .ScaleRuler_v .n {
    width: 8px;
    left: 3px;
    word-wrap: break-word;
  }

  .ScaleRuler_h .n {
    top: 1px;
  }

  .RefLine_v, .RefLine_h, .RefDot_h, .RefDot_v {
    z-index: 998;
  }

  .RefLine_h {
    width: 100%;
    height: 3px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAABCAMAAADU3h9xAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFSv//AAAAH8VRuAAAAA5JREFUeNpiYIACgAADAAAJAAE0lmO3AAAAAElFTkSuQmCC) repeat-x left center;/*./image/line_h.png*/
    cursor: n-resize; /*url(./image/cur_move_h.cur), move*/
    overflow: initial;
  }

  .RefLine_v {
    width: 3px;
    height: 100%;
    _height: 9999px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAICAMAAAAPxGVzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFSv//AAAAH8VRuAAAAA5JREFUeNpiYEAFAAEGAAAQAAGePof9AAAAAElFTkSuQmCC) repeat-y center top;/*./image/line_v.png*/
    cursor: w-resize;/*url(./image/cur_move_v.cur), move*/
    overflow: initial;
  }

  .RefDot_h {
    width: 100%;
    height: 3px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFf39/////F3PnHQAAAAJ0Uk5T/wDltzBKAAAAEElEQVR42mJgYGRgZAQIMAAADQAExkizYQAAAABJRU5ErkJggg==) repeat-x left 1px;/*./image/line_dot.png*/
    cursor:  n-resize;/*url(./image/cur_move_h.cur), move*/
    top: -50px;
  }

  .RefDot_v {
    width: 3px;
    height: 100%;
    _height: 9999px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRFf39/////F3PnHQAAAAJ0Uk5T/wDltzBKAAAAEElEQVR42mJgYGRgZAQIMAAADQAExkizYQAAAABJRU5ErkJggg==) repeat-y 1px top;/*./image/line_dot.png*/
    cursor: w-resize;/*url(./image/cur_move_v.cur), move*/
    left: -10px;
  }
  #content {
    position: absolute;
  }

  .title-h {
    font-size: 10px;
    color: #18ffff;
    margin-top: 20px;
    float: left;
  }

  .title-v {
    font-size: 10px;
    color: #18ffff;
    margin-left: 20px;
  }
</style>
