export default {
  addWidget ({ state, commit, store }, item) {
    if (item.setting.isUpload) {
      store.$emit('upload', (payload) => {
        commit('ADD_WIDGET', { data: payload, item })
      }, true)
    } else {
      commit('ADD_WIDGET', { item })
      // 设置选中
      commit('SELECT_WIDGET', {
        uuid: state.widgets[state.widgets.length - 1].uuid
      })
    }
  },
  save ({ state, store }) {
    store.$emit('save', state)
  },
  quit ({ state, store }) {
    store.$emit('quit', state)
  },
  preview ({ state, store }) {
    store.$emit('preview', state)
  },
  // 撤销 ctrl + z
  undo ({ state, commit }) {
    let step = state.steps[state.steps.length - 2]
    if (!step || !(step.widget instanceof Array)) {
      return
    }
    let newWidget = JSON.parse(JSON.stringify(step.widget))
    state.widgets = null
    state.widgets = newWidget
    commit('SELECT_WIDGET', {
      uuid: step.curUUID || -1
    })
    state.steps.pop()
  }
}
