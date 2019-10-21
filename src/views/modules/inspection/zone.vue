<template>
  <div class="mod-zone" style="height: 100%;">
    <div class="show-data-content">
    <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
      <template slot="paneL" >
        <div class="show-left" style="height: calc(100% - 15px);">
        <div class="org_title">
          <span v-if="this.isDrawBack===false">机构列表</span style="vertical-align: middle;"><i :class="drawBackClass" style="float:right;cursor:pointer;" @click="onDrawBack"></i>
        </div>
        <depttree @deptSelectEvent="handleDeptSelect" v-if="this.isDrawBack===false"></depttree>
        </div>
      </template>
   <template slot="paneR">
    <div class="show-data-table">
      <div class="show-data-up" style="flex: 1;">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getZoneList()">
      <el-form-item>
        <el-input v-model="dataForm.zoneName" size="mini" placeholder="巡区名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()" size="mini">查询</el-button>
        <el-button v-if="isAuth('inspection:zone:save')" size="mini" @click="zoneAddOrUpdateHandle()">新增</el-button>
        <el-button @click="exportExcelHandle()" size="mini">导出</el-button>
      </el-form-item>
      <el-form-item>
          <el-upload
          class="device-import"
          accept=".xlsx,.xls"
          :action="this.$http.adornUrl(`/inspection/zone/upload?token=${this.$cookie.get('token')}`)"
          :file-list="importFileList"
          :on-success="UploadSuccessHandle">
          <el-button size="mini">导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-table
      :data="zoneList"
      border
      :height="tableHeight"
      v-loading="zoneListLoading"
      highlight-current-row
      @current-change="zoneSelectionChangeHandle"
      :cell-style="cellStyle"
      :row-style="rowStyle"
      style="width: 100%;">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80">
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
        label="编码">
      </el-table-column>
      <el-table-column
        prop="deptName"
        header-align="center"
        align="center"
        label="所属机构">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('inspection:zone:save')" type="text" size="small" @click="zoneAddOrUpdateHandle(scope.row.zoneId)">修改</el-button>
          <el-button v-if="isAuth('inspection:zone:delete')" type="text" size="small" @click="zoneDeleteHandle(scope.row.zoneId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="zoneSizeChangeHandle"
      @current-change="zoneCurrentChangeHandle"
      :current-page="zonePageIndex"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="zonePageSize"
      :total="zoneTotalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <ZoneAddOrUpdate v-if="zoneAddOrUpdateVisible" ref="zoneAddOrUpdate" @refreshDataList="getZoneList"></ZoneAddOrUpdate>
  </div>
  <div class="show-data-down" style="flex: 1;display: flex;flex-direction: column;">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('inspection:zonedevice:save')" @click="deviceAddOrUpdateHandle()" :disabled="dataForm.zoneId <= 0" size="mini">绑定设备</el-button>
        <el-button v-if="isAuth('inspection:zonedevice:delete')" type="warning" @click="deviceDeleteHandle()" :disabled="deviceListSelections.length <= 0" size="mini">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      class="bottom-table"
      ref="table"
      :data="deviceList"
      height="calc(100vh - 590px)"
      v-loading="deviceListLoading"
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
        prop="orderNum"
        header-align="center"
        align="center"
        label="巡检排序">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deviceDeleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="deviceSizeChangeHandle"
      @current-change="deviceCurrentChangeHandle"
      :current-page="devicePageIndex"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="devicePageSize"
      :total="deviceTotalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <DeviceAddOrUpdate v-if="deviceAddOrUpdateVisible" ref="deviceAddOrUpdate" @DeviceBindEvent="deviceBindEvent"></DeviceAddOrUpdate>
    <importResult v-if="importResultVisible" ref="importResult" @refreshDataList="getZoneList"></importResult>
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
  import ZoneAddOrUpdate from './zone-add-or-update'
  import DeviceAddOrUpdate from './zonedevice-add-or-update'
  import importResult from './import-result'
  import splitPane from '@/components/split-pane'
  export default {
    data () {
      return {
        dataForm: {
          zoneId: null,
          deptId: 0
        },
        tableHeight: 210,
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 12,
        oldPercent: 16,
        zoneList: [],
        zonePageIndex: 1,
        zonePageSize: 5,
        zoneTotalPage: 0,
        zoneListLoading: false,
        zoneListSelections: [],
        zoneAddOrUpdateVisible: false,
        deviceList: [],
        devicePageIndex: 1,
        devicePageSize: 5,
        deviceTotalPage: 0,
        deviceListLoading: false,
        deviceListSelections: [],
        deviceAddOrUpdateVisible: false,
        importResultVisible: false,
        importFileList: []
      }
    },
    components: {
      depttree,
      ZoneAddOrUpdate,
      DeviceAddOrUpdate,
      splitPane,
      importResult
    },
    activated () {
      this.search()
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
       // 获取设备级别
      getDeviceList () {
        this.deviceList = []
        this.deviceListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/zonedevice/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.devicePageIndex,
            'limit': this.devicePageSize,
            'zoneId': this.dataForm.zoneId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.deviceList = data.page.list
            this.deviceTotalPage = data.page.totalCount
          } else {
            this.deviceList = []
            this.deviceTotalPage = 0
            this.$message.error(data.msg)
          }
          this.deviceListLoading = false
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      exportToExcel (list) {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['巡区名称<zone_name>', '编码<zone_code>', '所属机构<dept_name>']
          const filterVal = ['zoneName', 'zoneCode', 'deptName']
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
          url: this.$http.adornUrl('/inspection/zone/export'),
          method: 'get',
          params: this.$http.adornParams({
            'zoneId': this.dataForm.zoneId
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
          url: this.$http.adornUrl('/inspection/zone/import'),
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
      },
      search () {
        this.dataForm.deptId = null
        this.getZoneList()
      },
      // 获取数据列表
      getZoneList () {
        this.zoneListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/zone/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.zonePageIndex,
            'limit': this.zonePageSize,
            'zoneName': this.dataForm.zoneName,
            'deptId': this.dataForm.deptId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.zoneList = data.page.list
            this.zoneTotalPage = data.page.totalCount
          } else {
            this.zoneList = []
            this.zoneTotalPage = 0
            this.$message.error(data.msg)
          }
          this.zoneListLoading = false
        })
      },
      handleDeptSelect (val) {
        this.zoneId = 1
        this.zoneList = []
        this.deviceList = []
        this.dataForm.deptId = val
        this.zonePageIndex = 0
        this.getZoneList()
      },
      // 每页数
      zoneSizeChangeHandle (val) {
        this.zonePageSize = val
        this.zonePageIndex = 1
        this.getZoneList()
      },
      // 当前页
      zoneCurrentChangeHandle (val) {
        this.zonePageIndex = val
        this.getZoneList()
      },
      // 每页数
      deviceSizeChangeHandle (val) {
        this.devicePageSize = val
        this.devicePageIndex = 1
        this.getDeviceList()
      },
      // 当前页
      deviceCurrentChangeHandle (val) {
        this.devicePageIndex = val
        this.getDeviceList()
      },
      // 多选
      zoneSelectionChangeHandle (val) {
        if (val != null) {
          this.dataForm.zoneId = val.zoneId
          this.devicePageIndex = 1
          this.devicePageSize = 5
          this.deviceTotalPage = 0
          this.getDeviceList()
        } else {
          this.dataForm.zoneId = 0
        }
      },
       // 多选
      deviceSelectionChangeHandle (val) {
        this.deviceListSelections = val
      },

      // 新增 / 修改
      zoneAddOrUpdateHandle (id) {
        this.zoneAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.zoneAddOrUpdate.getDeptList()
          this.$refs.zoneAddOrUpdate.init(id)
        })
      },
      // 绑定设备
      deviceAddOrUpdateHandle (id) {
        this.deviceAddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.deviceAddOrUpdate.init(this.dataForm.deptId, this.dataForm.zoneId)
        })
      },
      rowStyle ({row, rowIndex}) {
        return 'height:25px'
      },
      cellStyle () {
        return 'padding:0'
      },
      deviceBindEvent (val) {
        var deviceIds = val.map(item => {
          return item.deviceId
        })
        this.$http({
          url: this.$http.adornUrl('/inspection/zonedevice/bind'),
          method: 'post',
          params: this.$http.adornParams({
            'zoneId': this.dataForm.zoneId
          }),
          data: this.$http.adornData(deviceIds, false)
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDeviceList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 删除
      zoneDeleteHandle (id) {
        var ids = id ? [id] : this.zoneListSelections.map(item => {
          return item.zoneId
        })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/inspection/zone/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getZoneList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 删除
      deviceDeleteHandle (id) {
        var ids = id ? [id] : this.deviceListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/inspection/zonedevice/delete'),
            method: 'post',
            params: this.$http.adornParams({
              'zoneId': this.dataForm.zoneId
            }),
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  var num = (this.deviceTotalPage - ids.length) % this.devicePageSize
                  if (num === 0) {
                    if (this.devicePageIndex > 1) {
                      this.devicePageIndex = this.devicePageIndex - 1
                    }
                  }
                  this.getDeviceList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>


<style scoped="">
  .up {
    float: top;
  }

  .down {
  }
  .site-content .show-data-table{
  }
    /deep/ .el-table--medium th{
      padding: 6px 0;
    }
  .site-content .show-data-up{
    margin: 0px;
  }
  .el-form-item{
    margin-bottom: 10px;
  }
  .site-wrapper .el-pagination{
    margin-top: 8px;
  }
  .site-content .show-data-down{
    height: 500px;
  }
  @media screen and (max-width: 1360px){
    .bottom-table{
      height: calc(100vh - 600px) !important;
    }
  }
</style>
