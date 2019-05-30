export default {
  namespaced: true,
  state: {
    deptList: []
  },
  mutations: {
    updateDeptList (state, list) {
      state.deptList = list
    }
  }
}
