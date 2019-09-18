<template>
  <div class="mod-item">
    <div class="show-data-content">
    <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
      <template slot="paneL" >
        <div class="show-left">
        <div class="org_title">
          <span v-if="this.isDrawBack===false">设备选择</span style="vertical-align: middle;"><i :class="drawBackClass" style="float:right;cursor:pointer;" @click="onDrawBack"></i>
        </div>
        <DeviceTree @TreeSelectEvent="treeSelectHandle" v-if="this.isDrawBack===false"></DeviceTree>
        </div>
      </template>
   <template slot="paneR">
    <div class="show-data-table">
      <div class="show-data-up">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="巡检项" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">查询</el-button>
        <el-button v-if="isAuth('inspection:inspectionitem:save')" @click="addOrUpdateHandle()" :disabled="dataForm.deviceId <= 0">新增</el-button>
        <el-button v-if="isAuth('inspection:inspectionitem:delete')" type="warning" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button @click="exportExcelHandle()">导出</el-button>
      </el-form-item>
      <el-form-item>
          <el-upload
          class="device-import"
          accept=".xlsx,.xls"
          :action="this.$http.adornUrl(`/inspection/inspectionitem/upload?token=${this.$cookie.get('token')}`)"
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
        prop="name"
        header-align="center"
        align="center"
        width="250"
        label="巡检项">
      </el-table-column>
      <el-table-column
        prop="deviceName"
        header-align="center"
        align="center"
        width="180"
        label="所属设备">
      </el-table-column>
      <el-table-column
        prop="inspectionTypeName"
        header-align="center"
        align="center"
        label="巡检类型">
      </el-table-column>
      <el-table-column
        prop="unit"
        header-align="center"
        align="center"
        label="单位">
      </el-table-column>
      <el-table-column
        prop="inspectionStatusName"
        header-align="center"
        align="center"
        label="检时状态">
      </el-table-column>
      <el-table-column
        prop="emissivity"
        header-align="center"
        align="center"
        label="发射率">
      </el-table-column>
      <el-table-column
        prop="frequencyName"
        header-align="center"
        align="center"
        label="采样频率">
      </el-table-column>
      <el-table-column
        prop="precisionName"
        header-align="center"
        align="center"
        label="采样点数">
      </el-table-column>
            <!--<el-table-column
        prop="upUsed"
        header-align="center"
        align="center"
        width="140"
        label="上上/上/下/下下">
      </el-table-column>-->
      <el-table-column
        prop="limits"
        header-align="center"
        align="center"
        width="140"
        label="上上/上/下/下下">
      </el-table-column>
      <el-table-column
        prop="defaultRpm"
        header-align="center"
        align="center"
        label="默认转速">
      </el-table-column>
      <el-table-column
        prop="extras"
        header-align="center"
        align="center"
        width="200"
        label="扩展">
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="排序">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('inspection:inspectionitem:save')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('inspection:inspectionitem:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
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
  import DeviceTree from '@/components/device-tree'
  import AddOrUpdate from './inspectionitem-add-or-update'
  import importResult from './import-result'
  import splitPane from '@/components/split-pane'
  export default {
    data () {
      return {
        dataForm: {
          name: '',
          deviceId: null
        },
        tableHeight: 300,
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 16,
        oldPercent: 16,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        importResultVisible: false,
        importFileList: []
      }
    },
    components: {
      DeviceTree,
      AddOrUpdate,
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
        this.dataForm.deviceId = null
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectionitem/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name': this.dataForm.name,
            'deviceId': this.dataForm.deviceId
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
      treeSelectHandle (val) {
        if (val.type === 'device') {
          this.dataForm.deviceId = val.id
          this.pageIndex = 1
          this.getDataList()
        } else {
          this.dataForm.deviceId = 0
        }
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        var _self = this
        this.$nextTick(() => {
          _self.$refs.addOrUpdate.dataForm.deviceId = _self.dataForm.deviceId
          _self.$refs.addOrUpdate.getUnitList()
          _self.$refs.addOrUpdate.getInspectionTypeList()
          _self.$refs.addOrUpdate.getInspectionStatusList()
          _self.$refs.addOrUpdate.getFrequencyList()
          _self.$refs.addOrUpdate.getPrecisionList()
          _self.$refs.addOrUpdate.init(id)
          
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/inspection/inspectionitem/delete'),
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
          const tHeader = ['所属设备<device_name>', '设备编码<device_code>', '巡检项<name>', '巡检类型名称<inspection_type_name>', '单位<unit>', '检时状态标记<inspection_status>', '发射率<emissivity>', '采样频率<frequency_name>', '采样点数<precision_name>', '上限报警<up_used>','上限<up_limit>', '上上限危险<upup_used>', '上上限<upup_limit>', '下限报警<down_used>', '下限<down_limit>', '下下限危险<downdwon_used>', '下下限<downdown_limit>', '扩展<extras>', '扩展异常<exceptions>', '描述<remark>', '默认转速<default_rpm>']
          const filterVal = ['deviceName', 'deviceCode', 'name', 'inspectionTypeName', 'unit', 'inspectionStatusName', 'emissivity', 'frequencyName', 'precisionName', 'upUsed', 'upLimit', 'upupUsed', 'upupLimit', 'downUsed', 'downLimit', 'downdownUsed', 'downdownLimit', 'extras', 'extraExceptions', 'remark', 'defaultRpm']
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
          url: this.$http.adornUrl('/inspection/inspectionitem/export'),
          method: 'get',
          params: this.$http.adornParams({
            'name': this.dataForm.name,
            'deviceId': this.dataForm.deviceId
          })
        }).then(({data}) => {
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
          url: this.$http.adornUrl('/inspection/inspectionitem/import'),
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
      },
       // 导入结果
      importResultHandle (result) {
        this.importResultVisible = true
        this.$nextTick(() => {
          this.$refs.importResult.init(result)
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
