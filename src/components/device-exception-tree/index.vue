<template>
  <div class="common-device-tree">
    <!--<el-form :inline="true" @keyup.enter.native="getDeviceList()">
      <div class="search">
        <el-input v-model="deviceName">
          <el-button slot="append" icon="el-icon-search" @click="getDeviceList"></el-button>
        </el-input>
      </div>
    </el-form>-->
    <el-tree
      :data="deviceList"
      :props="deviceTreeProps"
      node-key="deptId"
      @current-change="selectTreeCurrentChangeHandle"
      :default-expand-all="false"
      :highlight-current="true"
      :expand-on-click-node="false">
    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span v-if="data.type === 'level'">
            <span style="font-size: 12px;vertical-align: middle;">{{ node.label }}{{data.label}}</span>
        </span>
        <span >
            {{ node.label }}
        </span>
    </span>
    </el-tree>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        deviceName: '',
        deviceTreeProps: {
          label: 'lable',
          children: 'children'
        }
      }
    },
    components: {

    },
    activated () {
      this.getDeviceList()
    },
    methods: {
      // 获取数据列表
      getDeviceList () {
        this.$http({
          url: this.$http.adornUrl(`/sys/deviceexception/tree`),
          method: 'get',
          params: this.$http.adornParams({
            'deviceName': this.deviceName
          })
        }).then(({data}) => {
          this.deviceList = data.deviceTree
        })
      },
      // 部门树选中
      selectTreeCurrentChangeHandle (data, node) {
        this.deptId = data.id
        this.$emit('TreeSelectEvent', data)
      }
    },
    computed: {
      deviceList: {
        get () { return this.$store.state.deptDevice.deviceList },
        set (val) { this.$store.commit('deptDevice/updateDeviceList', val) }
      }
    }
  }
</script>

<style>
  .common-device-tree {
    mini-height: 300px;
    Border: 1px solid #ebeef5;
  }
  .search {
    width:100%;
    padding: 3px 0px 3px;
    Border-bottom: 1px solid #ebeef5;
  }
  .el-tree-node:focus>.el-tree-node__content{
    background-color: rgb(231, 247, 251);
  }
  .title {
    display: block;
    height: 46px;
    padding: 10px;
    color: #909399;
    font-size: 14px;
  }
  .common-device-tree .el-form-item{
    margin-bottom: 0px;
  }

  .device{
    background-color: rgb(231, 247, 251);
  }
</style>
