<template>
  <el-dialog
    v-dialog-drag
    :title="'绑定'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-input placeholder="请输入内容" v-model="dataForm.key" class="query">
      <el-select v-model="dataForm.select" slot="prepend" placeholder="请选择">
        <el-option
          v-for="item in selectList"
          :key="item.value"
          :label="item.lable"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="getZoneList()"></el-button>
    </el-input>
    <el-table
      :data="zoneList"
      border
      v-loading="zoneListLoading"
      highlight-current-row
      @selection-change="zoneSelectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="zoneName"
        header-align="center"
        align="center"
        label="巡区名称">
      </el-table-column>
      <el-table-column
        prop="zoneCode"
        header-align="center"
        align="center"
        label="巡区编码">
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
    model: {
      prop: 'lineZoneAddOrUpdateVisible',
      event: 'lineZoneAddOrUpdateVisible'
    },
    props: ['lineZoneAddOrUpdateVisible'],
    data () {
      return {
        dataForm: {
          key: '',
          select: 'zoneName',
          deptId: 0,
          zoneId: 0,
          inspectionLineId: 0
        },
        selectList: [{lable: '巡区名称', value: 'zoneName'}, {lable: '巡区编码', value: 'zoneCode'}],
        visible: false,
        zoneList: [],
        zoneListLoading: false,
        zoneListSelections: [],
        selectZoneList: []
      }
    },
    methods: {
      init (deptId) {
        this.dataForm.deptId = deptId
        this.visible = true
      },
       // 获取设备列表
      getZoneList () {
        console.log('deptid %o', this.dataForm.deptId)
        this.zoneList = []
        this.zoneListLoading = true
        if (this.zoneList.length <= 0) {
          this.$http({
            url: this.$http.adornUrl('/inspection/linezone/selectunbind'),
            method: 'get',
            params: this.$http.adornParams({
              'deptId': this.dataForm.deptId,
              'lineId': this.dataForm.inspectionLineId,
              'filter': this.dataForm.select,
              'key': this.dataForm.key
            })
          }).then(({data}) => {
            console.log(data)
            if (data && data.code === 0) {
              this.zoneList = data.zoneList
            } else {
              this.zoneList = []
              this.$message.error(data.msg)
            }
            this.zoneListLoading = false
          })
        }
      },
      // 多选
      zoneSelectionChangeHandle (val) {
        this.zoneListSelections = val
      },
      dataFormSubmit () {
        console.log('zoneListSelections: %o', this.zoneListSelections)
        this.visible = false
        this.$emit('ZoneBindEvent', this.zoneListSelections)
      }
    },
    watch: {
      'dataForm.inspectionLineId' () {
        this.getZoneList()
        // this.zoneList = []
      },
      visible (newVal) {
        this.$emit('lineZoneAddOrUpdateVisible', newVal)
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
