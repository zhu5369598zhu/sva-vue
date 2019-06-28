<template>
  <div class="mod-result-exception">
    <div class="show-data-content">
    <div class="show-data-table">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item lable="工厂名称:" prop="factory">
        <el-input v-model="dataForm.factory" placeholder="工厂名称" clearable style="width:100px;"></el-input>
      </el-form-item>
      <el-form-item lable="部门名称:" prop="dept">
        <el-input v-model="dataForm.dept" placeholder="部门名称" clearable style="width:100px;"></el-input>
      </el-form-item>
      <el-form-item lable="车间名称:" prop="workshop">
        <el-input v-model="dataForm.workshop" placeholder="车间名称" clearable style="width:100px;"></el-input>
      </el-form-item>
      <el-form-item lable="设备名称:" prop="deviceName">
        <el-input v-model="dataForm.deviceName" placeholder="设备名称" clearable style="width:100px;"></el-input>
      </el-form-item>
      <el-form-item lable="设备编码:" prop="deviceCode">
        <el-input v-model="dataForm.deviceCode" placeholder="设备编码" clearable style="width:100px;"></el-input>
      </el-form-item>
      <el-form-item lable="巡检人:" prop="username">
        <el-input v-model="dataForm.username" placeholder="巡检人" clearable style="width:100px;"></el-input>
      </el-form-item>
      <el-form-item label="巡检类型:" prop="inspectionTypeId">
        <el-select v-model="dataForm.inspectionTypeId" placeholder="巡检类型" clearable style="width:100px;">
          <el-option
            v-for="item in inspectionTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    <el-form-item label="巡检时间从:" prop="startTime">
      <el-date-picker v-model="dataForm.startTime" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleStartTimeChange" style="width:140px;"></el-date-picker>
    </el-form-item>
    <el-form-item label="到:" prop="endTime">
      <el-date-picker v-model="dataForm.endTime" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleEndTimeChange" style="width:140px;"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button @click="getDataList()">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="exportExcelHandle()">导出excel</el-button>
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
        fixed
        type="index"
        width="50"
        lable="">
      </el-table-column>
      <el-table-column
        prop="factory"
        header-align="center"
        align="center"
        width="200"
        label="工厂名称">
      </el-table-column>
      <el-table-column
        prop="dept"
        header-align="center"
        align="center"
        width="200"
        label="部门名称">
      </el-table-column>
      <el-table-column
        prop="workshop"
        header-align="center"
        align="center"
        width="200"
        label="车间名称">
      </el-table-column>
      <el-table-column
        prop="deviceName"
        header-align="center"
        align="center"
        width="200"
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="deviceCode"
        header-align="center"
        align="center"
        width="90"
        label="设备编码">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        width="200"
        label="巡检内容">
      </el-table-column>
      <el-table-column
        prop="result"
        header-align="center"
        align="center"
        width="80"
        label="巡检结果">
      </el-table-column>
      <el-table-column
        prop="unit"
        header-align="center"
        align="center"
        width="80"
        label="单位">
      </el-table-column>
      <el-table-column
        prop="inspectionType"
        header-align="center"
        align="center"
        width="80"
        label="巡检类型">
      </el-table-column>
      <el-table-column
        prop="medias"
        header-align="center"
        align="center"
        width="90"
        label="附件">
        <template slot-scope="scope" style="display: inline-block;white-space:normal;">
          <template v-for="item in scope.row.medias">
            <i style="cursor:pointer" @click="view(item.type, item.guid, scope.row.inspectionTypeId)">
              <icon-svg
                :name="changeImg(item.type)"
                style="font-size:16px;"></icon-svg>
            </i>
            <span>&nbsp;</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="巡检人">
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        width="150"
        label="开始巡检时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        width="150"
        label="结束巡检时间">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="150"
        label="上传时间">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        width="200"
        label="备注">
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
    <viewMedia v-if="viewMediaVisible" ref="viewMedia" ></viewMedia>
    <viewChart v-if="viewChartVisible" ref="viewChart" ></viewChart>
  </div>
  </div>
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import depttree from '@/components/dept-tree'
  import splitPane from '@/components/split-pane'
  import viewMedia from './viewmedia'
  import viewChart from './viewchart'
  export default {
    data () {
      return {
        dataForm: {
          factory: null,
          dept: null,
          workshop: null,
          username: null,
          deviceName: null,
          deviceCode: null,
          inspectionTypeId: null,
          startTime: null,
          endTime: null
        },
        tableHeight: 300,
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 12,
        oldPercent: 12,
        inspectionTypeList: [],
        deviceStatusList: [],
        deviceLevelList: [],
        exceptionList: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 20,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        viewMediaVisible: false,
        viewChartVisible: false,
      }
    },
    components: {
      depttree,
      splitPane,
      viewMedia,
      viewChart
    },
    activated () {
      this.dataForm.startTime = new Date()
      this.dataForm.startTime.setDate(this.dataForm.startTime.getDate() - 7)
      this.getInspectionTypeList()
      this.getDataList()
    },
    methods: {
      view (type, url, inspectionTypeId) {
        console.log(inspectionTypeId)
        if (type !== 'data') {
          this.viewMediaVisible = true
          this.$nextTick(() => {
            this.$refs.viewMedia.init(type, url,'random')
          })
        } else {
          var inspectionType = 'acc'
          if (inspectionTypeId === 4) {
            inspectionType = 'acc'
          } else if (inspectionTypeId === 5) {
            inspectionType = 'speed'
          } else if (inspectionTypeId === 6) {
            inspectionType = 'distance'
          }
          this.viewChartVisible = true
          this.$nextTick(() => {
            this.$refs.viewChart.init(inspectionType, url,'random')
          })
        }
      },
      changeImg (type) {
        if (type === 'jpg') {
          return 'chakan'
        }
        if (type === 'png') {
          return 'chakan'
        }
        if (type === 'mp3') {
          return 'shengyin'
        }
        if (type === 'data') {
          return 'tubiao'
        }
      },
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
      getInspectionTypeList () {
        if (this.inspectionTypeList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/inspectiontype/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.inspectionTypeList = data.page.list
          })
        }
      },
      getDeviceStatusList () {
        if (this.deviceStatusList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/inspectionstatus/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deviceStatusList = data.page.list
          })
        }
      },
      // 获取数据列表
      getDataList () {
        let startTime = new Date(this.dataForm.startTime)
        startTime = formatDate(startTime, 'yyyy-MM-dd')
        let endTime = new Date(this.dataForm.endTime)
        endTime = formatDate(endTime, 'yyyy-MM-dd')
        if (startTime === 'NaN-aN-aN' || startTime === '1970-01-01') {
          startTime = ''
        }
        if (endTime === 'NaN-aN-aN' || endTime === '1970-01-01') {
          endTime = ''
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectionrandomresult/query'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'factory': this.dataForm.factory,
            'dept': this.dataForm.dept,
            'workshop': this.dataForm.workshop,
            'username': this.dataForm.username,
            'deviceName': this.dataForm.deviceName,
            'inspectionTypeId': this.dataForm.inspectionTypeId,
            'startTime': startTime,
            'endTime': endTime
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
      exportToExcel (list) {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['工厂名称', '部门名称', '车间名称', '设备名称', '设备编码', '巡检内容', '巡检结果', '单位', '巡检类型', '巡检人', '巡检时间', '上传时间', '备注']
          const filterVal = ['factory', 'dept', 'workshop', 'deviceName', 'deviceCode', 'name', 'result', 'unit', 'inspectionType', 'username', 'startTime', 'createTime', 'remark']
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
      // 获取数据列表
      exportExcelHandle () {
        let startTime = new Date(this.dataForm.startTime)
        startTime = formatDate(startTime, 'yyyy-MM-dd')
        let endTime = new Date(this.dataForm.endTime)
        endTime = formatDate(endTime, 'yyyy-MM-dd')
        if (startTime === 'NaN-aN-aN' || startTime === '1970-01-01') {
          startTime = ''
        }
        if (endTime === 'NaN-aN-aN' || endTime === '1970-01-01') {
          endTime = ''
        }
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectionrandomresult/export'),
          method: 'get',
          params: this.$http.adornParams({
            'factory': this.dataForm.factory,
            'dept': this.dataForm.dept,
            'workshop': this.dataForm.workshop,
            'username': this.dataForm.username,
            'deviceName': this.dataForm.deviceName,
            'inspectionTypeId': this.dataForm.inspectionTypeId,
            'startTime': startTime,
            'endTime': endTime
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
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      handleDeptSelect (val) {
        this.dataForm.deptId = val
        this.getDataList()
      },
      handleStartTimeChange (val) {
        this.dataForm.startTime = val
      },
      handleEndTimeChange (val) {
        this.dataForm.endTime = val
      },
      rowStyle ({row, rowIndex}) {
        return 'height:30px'
      },
      cellStyle () {
        return 'padding:0'
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      }
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      }
    },
    watch: {
      'documentClientHeight': function (val) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 105 - 32 - 20
        console.log('tableHeight %o', this.tableHeight)
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 105 - 32 - 20
      })
    }
  }
</script>
