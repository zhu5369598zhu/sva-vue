<template>
  <div class="mod-device">
    <div class="show-data-content">
    <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
      <template slot="paneL" >
        <div class="show-left">
        <div class="org_title">
          <span v-if="this.isDrawBack===false">机构列表</span style="vertical-align: middle;"><i :class="drawBackClass" style="float:right;cursor:pointer;" @click="onDrawBack"></i>
        </div>
        <depttree @deptSelectEvent="handleDeptSelect" v-if="this.isDrawBack===false"></depttree>
        </div>
      </template>
   <template slot="paneR">
    <div class="show-data-table">
      <div class="show-data-up">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input placeholder="请输入内容" v-model="key">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.lable"
              :value="item.value">
            </el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">查询</el-button>
        <el-button v-if="isAuth('inspection:device:save')" @click="deviceAddHandle()">新增</el-button>
        <el-button v-if="isAuth('inspection:device:delete')" type="warning" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button @click="exportExcelHandle()">导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
        class="device-import"
        accept=".xlsx,.xls"
        :action="this.$http.adornUrl(`/inspection/device/upload?token=${this.$cookie.get('token')}`)"
        :file-list="importFileList"
        :on-success="UploadSuccessHandle">
        <el-button>导入</el-button>
      </el-upload>
    </el-form-item>
    </el-form>
    <el-table
      ref="table"
      :height="tableHeight"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
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
        fixed
        type="index"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        fixed
        prop="deviceName"
        header-align="center"
        align="center"
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="deptName"
        header-align="center"
        align="center"
        label="所属机构">
      </el-table-column>
      <el-table-column
        prop="deviceCode"
        header-align="center"
        align="center"
        label="设备编码">
      </el-table-column>
      <el-table-column
        prop="deviceUnit"
        header-align="center"
        align="center"
        label="设备规格">
      </el-table-column>
      <el-table-column
        prop="deviceLevelName"
        header-align="center"
        align="center"
        label="设备等级">
      </el-table-column>
      <el-table-column
        prop="deviceMaster"
        header-align="center"
        align="center"
        label="责任人">
      </el-table-column>
      <el-table-column
        prop="isInspect"
        header-align="center"
        align="center"
        label="是否巡检">
        <template slot-scope="scope">
          <span v-if="scope.row.isInspect === 0" style="color:red;">否</span>
          <span v-if="scope.row.isInspect === 1" style="color:darkgreen">是</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="isShowDashboard"
        header-align="center"
        align="center"
        label="看板显示">
        <template slot-scope="scope">
          <span v-if="scope.row.isShowDashboard === 0" style="color:red;">否</span>
          <span v-if="scope.row.isShowDashboard === 1" style="color:darkgreen">是</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="manufactureDate"
        header-align="center"
        align="center"
        width="150"
        label="生产日期">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('inspection:device:save')" type="text" size="small" @click="deviceUpdateHandle(scope.row.deviceId)">修改</el-button>
          <el-button v-if="isAuth('inspection:device:delete')" type="text" size="small" @click="deleteHandle(scope.row.deviceId)">删除</el-button>
          <el-button v-if="isAuth('inspection:device:save')" type="text" size="small" @click="deviceViewHandle(scope.row.deviceId)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <deviceAdd v-if="deviceAddVisible" ref="deviceAdd" @refreshDataList="getDataList"></deviceAdd>
    <deviceUpdate v-if="deviceUpdateVisible" ref="deviceUpdate" @refreshDataList="getDataList"></deviceUpdate>
    <importResult v-if="importResultVisible" ref="importResult" @refreshDataList="getDataList"></importResult>
  </div>
  </div>
  </template>
  </split-pane>
  </div>
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import depttree from '@/components/dept-tree'
  import deviceAdd from './device-add'
  import deviceUpdate from './device-update'
  import importResult from './import-result'
  import splitPane from '@/components/split-pane'
  export default {
    data () {
      return {
        dataForm: {
          deptId: null
        },
        tableHeight: 300,
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 12,
        oldPercent: 12,
        key: '',
        select: 'deviceName',
        selectList: [{lable: '设备名称', value: 'deviceName'}, {lable: '设备编码', value: 'deviceCode'}],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        deviceAddVisible: false,
        deviceUpdateVisible: false,
        importResultVisible: false,
        importFileList: []
      }
    },
    components: {
      depttree,
      deviceAdd,
      deviceUpdate,
      splitPane,
      importResult
    },
    activated () {
      this.getDataList()
    },
    methods: {
      onDrawBack () {
        this.isDrawBack = !this.isDrawBack
        if (this.isDrawBack) {
          this.oldPercent = this.curPercent
          this.curPercent = 2.5
          this.drawBackClass = 'el-icon-d-arrow-right'
        } else {
          this.drawBackClass = 'el-icon-d-arrow-left'
          this.curPercent = this.oldPercent
        }
        this.$refs.splitPane.setPercent(this.curPercent)
      },
      resize (val) {
        this.curPercent = val
      },
      search () {
        this.dataForm.deptId = null
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/device/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'deptId': this.dataForm.deptId,
            'filterkey': this.select,
            'key': this.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      handleDeptSelect (val) {
        this.dataList = []
        this.deviceList = []
        this.dataForm.deptId = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      rowStyle ({row, rowIndex}) {
        return 'height:40px'
      },
      cellStyle () {
        return 'padding:0'
      },
      // 新增
      deviceAddHandle (id) {
        this.deviceAddVisible = true
        this.$nextTick(() => {
          this.$refs.deviceAdd.dataForm.deviceDept = this.dataForm.deptId
          this.$refs.deviceAdd.getDeviceLevelList()
          this.$refs.deviceAdd.getDeptList()
          this.$refs.deviceAdd.init(id)
        })
      },
      // 修改
      deviceUpdateHandle (id) {
        this.deviceUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.deviceUpdate.dataForm.deviceDept = this.dataForm.deptId
          this.$refs.deviceUpdate.getDeviceLevelList()
          this.$refs.deviceUpdate.getDeptList()
          this.$refs.deviceUpdate.init(id, true)
        })
      },
      // 查看
      deviceViewHandle (id) {
        this.deviceUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.deviceUpdate.dataForm.deviceDept = this.dataForm.deptId
          this.$refs.deviceUpdate.getDeviceLevelList()
          this.$refs.deviceUpdate.getDeptList()
          this.$refs.deviceUpdate.init(id,false)
        })
      },
       // 导入结果
      importResultHandle (result) {
        this.importResultVisible = true
        this.$nextTick(() => {
          this.$refs.importResult.init(result)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.deviceId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/inspection/device/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      exportToExcel (list) {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['设备名称<device_name>', '设备等级<device_level_name>', '所属机构<dept_name>', '生产日期<manufacture_date>', '设备编号<device_num>', '设备编码<device_code>', '设备规格<device_unit>', '生产厂家<device_manufacturer>', '供货商<device_supplier>', '设备模型<device_model>', '责任人<device_master>', '巡区<zone_name>', '是否巡检<is_inspect>', '看板显示<is_show_dashboard>']
          const filterVal = ['deviceName', 'deviceLevelName', 'deptName', 'manufactureDate', 'deviceNum', 'deviceCode', 'deviceUnit', 'deviceManufacturer', 'deviceSupplier', 'deviceModel', 'deviceMaster', 'zones', 'isInspectName', 'isShowDashboardName']
          const data = this.formatJson(filterVal, list)
          let filename = formatDate(new Date(), 'yyyyMMddhhmmss')
          export_json_to_excel({
            header: tHeader,
            data,
            filename: filename,
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.downloadLoading = false
        })
      },
      exportExcelHandle () {
        this.$http({
          url: this.$http.adornUrl('/inspection/device/export'),
          method: 'get',
          params: this.$http.adornParams({
            'deptId': this.dataForm.deptId,
            'filterkey': this.select,
            'key': this.key
          })
        }).then(({data}) => {
          console.log('data %o', data)
          if (data && data.code === 0) {
            this.exportToExcel(data.list)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      UploadSuccessHandle (response, file, fileList) {
        console.log('success')
        this.importFileList = []
        if (response.code > 0) {
          this.$message.error(response.msg)
        } else {
          var count = response.list.length
          this.$confirm(`上传成功，将要导入${count}条数据, 是否继续导入?`, '提示', {
            confirmButtonText: '导入',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log('data %o', response.list)
            this.importExcelHandle(response.list)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取导入'
            })
          })
        }
      },
      importExcelHandle (list) {
        this.$http({
          url: this.$http.adornUrl('/inspection/device/import'),
          method: 'post',
          data: this.$http.adornData(list, false)
        }).then(({data}) => {
          console.log('import result %o', data)
          if (data && data.code === 0) {
            this.importResultHandle(data.result)
          } else {
            this.$message.error(data.msg)
          }
        })
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 105 - 32 - 20

        let self = this
        window.onresize = function () {
          self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 105 - 32 - 20
        }
      })
    }
  }
</script>

<style>
  .el-select .el-input {
      width: 110px;

    }
</style>
