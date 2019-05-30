export default {
  namespaced: true,
  state: {
    lineList: []
  },
  mutations: {
    updateLineList (state, list) {
      state.lineList = list
    }
  }
}
