export default {
  namespaced: true,
  state: {
    deviceLevelList: []
  },
  mutations: {
    updateDeviceLevelList (state, list) {
      state.deviceLevelList = list
    }
  }
}
