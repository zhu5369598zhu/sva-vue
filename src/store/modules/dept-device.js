export default {
  namespaced: true,
  state: {
    deviceList: []
  },
  mutations: {
    updateDeviceList (state, list) {
      state.deviceList = list
    }
  }
}
