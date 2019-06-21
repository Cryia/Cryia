const generate = require('nanoid/generate')

export default {
  // 添加组件
  ADD_WIDGET (state, { data: data = null, item }) {
    let def = { top: state.top, uuid: generate('1234567890abcdef', 10) }
    let setting = JSON.parse(JSON.stringify(item.setting))

    if (setting.isContainer) {
      setting.name = def.uuid
    }

    if (data) {
      data.forEach(function (val) {
        state.widgets.push(Object.assign(setting, val, def))
      })
    } else {
      state.widgets.push(Object.assign(setting, def))
    }
  },

  // 复制组件
  COPY_WIDGET (state, payload) {
    function newWidget (origin) {
      return Object.assign({}, JSON.parse(JSON.stringify(origin)), { top: origin.top + 50, left: origin.left + 50, uuid: generate('1234567890abcdef', 10) })
    }

    if (state.type !== 'page') {
      state.widgets.push(newWidget(state.activeElement))
    } else if (state.multiSelect) {
      state.multiSelectCols.forEach(uuid => {
        for (let i = 0; i < state.widgets.length; i++) {
          if (state.widgets[i].uuid === uuid) {
            state.widgets.push(newWidget(state.widgets[i]))
          }
        }
      })
    }
  },

  // 删除选中组件
  DELETE_WIDGET (state) {
    if (state.multiSelect) {
      state.multiSelectCols.forEach(uuid => {
        for (let i = 0; i < state.widgets.length; i++) {
          if (state.widgets[i].uuid === uuid) {
            state.widgets.splice(i, 1)
          }
        }
      })
    } else {
      if (state.type === 'page') return

      if (state.activeElement.isContainer) {
        const name = state.activeElement.name

        for (let i = 0; i < state.widgets.length; i++) {
          if (state.widgets[i].belong === name) {
            state.widgets.splice(i, 1)
          }
        }
      }

      state.widgets.splice(state.index, 1)
    }

    // reset activeElement
    state.activeElement = state.page
    state.type = 'page'
    state.uuid = null
    state.index = -1
  },

  // 选中组件与取消选中
  SELECT_WIDGET (state, payload) {
    state.uuid = payload.uuid
    state.multiSelect = false

    for (let n in state.widgets) {
      if (state.widgets[n].uuid === payload.uuid) {
        state.index = n
      }
    }
    if (payload.uuid === -1) {
      state.activeElement = state.page
      state.type = 'page'
    } else {
      let widget = state.widgets.find(w => w.uuid === payload.uuid)
      state.activeElement = widget
      state.type = widget.type
    }
  },

  // 组件多选
  MULTISELECT_WIDGET (state, payload) {
    state.multiSelect = true
    state.multiSelectCols = payload
  },

  // 调整组件尺寸
  RESIZE_WIDGET (state, payload) {
    const dx = payload.x - state.startX
    const dy = payload.y - state.startY
    var value

    if (payload.type === 'right') {
      value = state.originX + Math.floor(dx * 100 / state.page.zoom)
      state.activeElement.width = value > 10 ? value : 10
      return
    }

    if (payload.type === 'down') {
      value = state.originX + Math.floor(dy * 100 / state.page.zoom)
      state.activeElement.height = value > 10 ? value : 10
      return
    }

    if (payload.type === 'left') {
      let left = state.originX + Math.floor(dx * 100 / state.page.zoom)
      let width = state.originY - Math.floor(dx * 100 / state.page.zoom)
      state.activeElement.left = left > 0 ? left : 0
      state.activeElement.width = width > 10 ? width : 10
      return
    }

    if (payload.type === 'up') {
      let top = state.originX + Math.floor(dy * 100 / state.page.zoom)
      let height = state.originY - Math.floor(dy * 100 / state.page.zoom)
      state.activeElement.top = top > 0 ? top : 0
      state.activeElement.height = height > 10 ? height : 10
    }

    if (payload.type === 'upLeft') {
      let top = state.originTop + Math.floor(dy * 100 / state.page.zoom)
      let left = state.originLeft + Math.floor(dx * 100 / state.page.zoom)
      let width = state.originX - Math.floor(dx * 100 / state.page.zoom)
      let height = state.originY - Math.floor(dy * 100 / state.page.zoom)

      state.activeElement.top = top > 0 ? top : 0
      state.activeElement.left = left > 0 ? left : 0
      state.activeElement.height = height > 10 ? height : 10
      state.activeElement.width = width > 10 ? width : 10
    }

    if (payload.type === 'upRight') {
      let top = state.originTop + Math.floor(dy * 100 / state.page.zoom)
      let width = state.originX + Math.floor(dx * 100 / state.page.zoom)
      let height = state.originY - Math.floor(dy * 100 / state.page.zoom)

      state.activeElement.top = top > 0 ? top : 0
      state.activeElement.height = height > 10 ? height : 10
      state.activeElement.width = width > 10 ? width : 10
    }

    if (payload.type === 'downLeft') {
      let left = state.originLeft + Math.floor(dx * 100 / state.page.zoom)
      let width = state.originX - Math.floor(dx * 100 / state.page.zoom)
      let height = state.originY + Math.floor(dy * 100 / state.page.zoom)

      state.activeElement.left = left > 0 ? left : 0
      state.activeElement.height = height > 10 ? height : 10
      state.activeElement.width = width > 10 ? width : 10
    }

    if (payload.type === 'downRight') {
      let width = state.originX + Math.floor(dx * 100 / state.page.zoom)
      let height = state.originY + Math.floor(dy * 100 / state.page.zoom)

      state.activeElement.height = height > 10 ? height : 10
      state.activeElement.width = width > 10 ? width : 10
    }
  },

  // 设置 mousemove 操作的初始值
  INIT_MOVE (state, payload) {
    state.startX = payload.startX
    state.startY = payload.startY
    state.originX = payload.originX
    state.originY = payload.originY
    state.originTop = payload.originTop
    state.originLeft = payload.originLeft
    state.moving = true
  },

  // 组件移动结束
  STOP_MOVE (state) {
    state.moving = false
  },

  // 移动组件
  MOVE_WIDGET (state, payload) {
    const dx = payload.x - state.startX
    const dy = payload.y - state.startY

    if (state.multiSelect) {
      state.startX = payload.x
      state.startY = payload.y

      state.multiSelectCols.forEach(uuid => {
        let widget = state.widgets.find(w => w.uuid === uuid)
        const left = widget.left + Math.floor(dx * 100 / state.page.zoom)
        const top = widget.top + Math.floor(dy * 100 / state.page.zoom)
        widget.left = left > 0 ? left : 0
        widget.top = top > 0 ? top : 0
      })
    } else {
      let target = state.activeElement
      const left = state.originX + Math.floor(dx * 100 / state.page.zoom)
      const top = state.originY + Math.floor(dy * 100 / state.page.zoom)

      target.left = left > 0 ? left : 0
      target.top = top > 0 ? top : 0
    }
  },

  // 更新组件初始 top 值
  UPDATE_SCROLL_TOP (state, top) {
    state.top = top
  },

  // 页面缩放
  ZOOM (state, val) {
    state.page.zoom = val
  },

  // 初始化选中对象
  INIT_ACTIVE (state) {
    state.activeElement = state.page
    state.type = 'page'
    state.index = -1
    state.uuid = null
    state.multiSelect = false
    state.multiSelectCols = []
  },

  // 替换图片
  REPLACE_IMAGE (state, payload) {
    // state.activeElement.width = payload[0].width
    state.activeElement.url = payload[0].url
  },

  // 添加容器背景图
  ADD_CONTAINER_BACKGROUND_IMAGE (state, payload) {
    state.activeElement.backPic = payload[0].url
    state.activeElement.backPicUrl = payload[0].src
    state.activeElement.width = payload[0].width
    state.activeElement.height = payload[0].height
  },

  // 添加背景图
  ADD_BACKGROUND_IMAGE (state, payload) {
    state.activeElement.backPic = payload[0].url
    state.activeElement.backPicUrl = payload[0].src
  },

  // 页面添加背景图
  ADD_PAGE_BACKGROUND_IMAGE (state, payload) {
    state.activeElement.backPic = 'url(' + payload[0].url + ')'
  },

  // 替换背景色
  REPLACE_BACKGROUND_COLOR (state, payload) {
    state.activeElement.bgColor = payload[0].val
  },

  // 添加动画
  ADD_ANIMATION (state) {
    state.animation.push({
      name: '',
      duration: 3,
      delay: 0,
      iteration: 1,
      timing: 'linear',
      direction: 'normal',
      fill: 'none',
      keyframes: [
        {
          stop: 0,
          css: ''
        }
      ]
    })
  },

  // 为动画添加 keyframe
  ADD_KEY_FRAME (state, name) {
    state.animation.map(val => {
      if (val.name === name) {
        val.keyframes.push({
          stop: 0,
          css: ''
        })
      }
    })
  },

  // 动画的播放与停止
  SET_ANIMATION (state, status) {
    state.playState = status
  },

  // 更新数据
  UPDATE_WIDGET (state, { uuid, key, value }) {
    let widget = state.widgets.find(w => w.uuid === uuid)
    widget[key] = value
  },

  // 图表添加颜色
  ADD_COLOR (state, payload) {
    state.activeElement[payload.property].push(payload.data)
  },

  // 更新编辑器 JSON 数据
  UPDATE_STATIC_DATA (state, payload) {
    state.activeElement.staticData = payload
  },

  UPDATE_ACTIVE_ELEMENT (state, payload) {
    state.activeElement[payload.name] = payload.value
  },

  // 更新多条数据图表(添加数据)
  UPDATE_DATAS_ADD (state, payload) {
    for (let i in payload) {
      let name = payload[i].name
      state.activeElement[name].push(payload[i].value)
    }
  },
  // 更新多条数据图表(删除数据)
  UPDATE_DATAS_DEL (state, payload) {
    let names = payload.name
    for (let i = 0; i < names.length; i++) {
      let prop = names[i]
      state.activeElement[prop] = state.activeElement[prop].slice(0, payload.value)
    }
  },

  // 图表删除颜色
  DELETE_COLOR (state, payload) {
    state.activeElement[payload.property].splice(payload.data.index, 1)
  },

  UPDATE_LINKAGE (state, { uuid, value }) {
    let obj = {}
    obj[uuid] = value

    state.linkage = Object.assign({}, state.linkage, obj)
  },

  // 存储撤销步骤
  BACKUP_WIDGET (state, payload) {
    if (state.steps.length > 10) {
      state.steps.shift()
    }
    state.steps.push(payload)
  }
}
