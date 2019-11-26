<template>
  <el-dialog
    v-dialog-drag
    :title="'绑定'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-input placeholder="请输入内容" v-model="dataForm.key" class="query" size="mini">
      <el-select v-model="dataForm.select" slot="prepend" placeholder="请选择">
        <el-option
          v-for="item in selectList"
          :key="item.value"
          :label="item.lable"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="getDeviceList()"></el-button>
    </el-input>
    <el-table
      :data="deviceList"
      border
      :height="300"
      v-loading="deviceListLoading"
      highlight-current-row
      @selection-change="deviceSelectionChangeHandle"
      :cell-style="cellStyle"
      :row-style="rowStyle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="deviceName"
        header-align="center"
        align="center"
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="deviceCode"
        header-align="center"
        align="center"
        label="设备编码">
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          select: 'deviceName',
          deptId: 0,
          zoneId: 0
        },
        selectList: [{lable: '设备名称', value: 'deviceName'}, {lable: '设备编码', value: 'deviceCode'}],
        visible: false,
        deviceList: [],
        deviceListLoading: false,
        deviceListSelections: [],
        selectDeviceList: []
      }
    },
    methods: {
      rowStyle ({row, rowIndex}) {
        return 'height:40px'
      },
      cellStyle () {
        return 'padding:0'
      },
      init (deptId, zoneId) {
        this.dataForm.deptId = deptId
        this.dataForm.zoneId = zoneId
        this.visible = true
        console.log('dataForm: %o', this.dataForm)
      },
       // 获取设备列表
      getDeviceList () {
        this.deviceList = []
        console.log('dataForm: %o', this.dataForm)
        this.deviceListLoading = true
        if (this.deviceList.length <= 0) {
          this.$http({
            url: this.$http.adornUrl('/inspection/device/selectunbind'),
            method: 'get',
            params: this.$http.adornParams({
              'deptId': this.dataForm.deptId,
              'zoneId': this.dataForm.zoneId,
              'filter': this.dataForm.select,
              'key': this.dataForm.key
            })
          }).then(({data}) => {
            console.log(data)
            if (data && data.code === 0) {
              console.log('deviceList %o', data.deviceList)
              this.deviceList = data.deviceList
            } else {
              this.deviceList = []
              this.$message.error(data.msg)
            }
            console.log('over')
            this.deviceListLoading = false
          })
        }
      },
      // 多选
      deviceSelectionChangeHandle (val) {
        this.deviceListSelections = val
      },
      dataFormSubmit () {
        if (this.deviceListSelections.length > 0){
          this.visible = false
          this.deviceList = []
          this.$emit('DeviceBindEvent', this.deviceListSelections)
        } else {
          this.$alert('您没有选中需要绑定的设备')
        }
      }
    },
    watch: {
      'dataForm.zoneId': function (newVal, oldVal) {
        this.deviceList = []
      }
    }
  }
</script>
<style>
.el-select .el-input {
    width: 110px;

  }
.query {
    margin-bottom: 15px;
  }
</style>
