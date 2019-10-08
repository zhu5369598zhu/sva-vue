<template>
  <div class="mod-result-exception" style="height: 100%;">
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
      <el-row style="display: flex;">
      <el-form-item lable="" prop="deviceName">
        <el-input v-model="dataForm.deviceName" placeholder="设备名称" clearable size="small"></el-input>
      </el-form-item>
      <el-form-item lable="" prop="itemName">
        <el-input v-model="dataForm.itemName" placeholder="巡检内容" clearable size="small"></el-input>
      </el-form-item>
      <el-form-item lable="" prop="username">
        <el-input v-model="dataForm.username" placeholder="巡检人员" clearable size="small"></el-input>
      </el-form-item>
      <el-form-item label="" prop="isOk">
        <el-select v-model="dataForm.isOk" placeholder="是否正常" clearable size="small">
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="statusId">
        <el-select v-model="dataForm.statusId" placeholder="检时状态" clearable size="small">
          <el-option
            v-for="item in deviceStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="statusId">
        <el-select v-model="dataForm.exceptionId" placeholder="异常等级" clearable size="small">
          <el-option
            v-for="item in exceptionList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="inspectionTypeId">
        <el-select v-model="dataForm.inspectionTypeId" placeholder="巡检类型" clearable size="small">
          <el-option
            v-for="item in inspectionTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="statusId">
        <el-select v-model="dataForm.deviceLevelId" placeholder="设备等级" clearable size="small">
          <el-option
            v-for="item in deviceLevelList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
      </el-select>
    </el-form-item>
  </el-row>
    <el-row>
    <el-form-item label="巡检时间:" prop="startTime">
      <el-date-picker v-model="dataForm.startTime" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:140px;" size="small"></el-date-picker>
    </el-form-item>
    <el-form-item label="到:" prop="endTime">
      <el-date-picker v-model="dataForm.endTime" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleEndTimeChange" :picker-options="startDatePicker" style="width:140px;" size="small"></el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button @click="search()" size="small">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="exportExcelHandle()" size="small">导出</el-button>
    </el-form-item>
    </el-row>
    </el-form>
    <el-table
      ref="table"
      height="calc(100vh - 300px)"
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
        fixed
        prop="deviceName"
        header-align="center"
        align="center"
        width="150"
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="itemName"
        header-align="center"
        align="center"
        width="250"
        label="巡检内容">
      </el-table-column>
      <el-table-column
        prop="isOk"
        header-align="center"
        align="center"
        width="50"
        label="正常">
        <template slot-scope="scope">
          <span v-if="scope.row.isOk === 0" style="color:red;">否</span>
          <span v-if="scope.row.isOk === 1">是</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="exceptionName"
        header-align="center"
        align="center"
        width="80"
        label="异常等级">
        <template slot-scope="scope">
          <span v-if="scope.row.exceptionName === '危险' || scope.row.exceptionName === '紧急'" style="color:#ff7f46;">{{scope.row.exceptionName}}</span>
          <span v-if="scope.row.exceptionName === '报警'" style="color:#ffdc4d;">{{scope.row.exceptionName}}</span>
          <span v-if="scope.row.exceptionName === '正常'">{{scope.row.exceptionName}}</span>
        </template>
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
        prop="limits"
        header-align="center"
        align="center"
        width="140"
        label="上上/上/下/下下">
      </el-table-column>
      <el-table-column
        prop="inspectionType"
        header-align="center"
        align="center"
        width="80"
        label="巡检类型">
      </el-table-column>
      <el-table-column
        prop="deviceLevel"
        header-align="center"
        align="center"
        width="80"
        label="设备等级">
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
        prop="deviceStatus"
        header-align="center"
        align="center"
        width="80"
        label="设备状态">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="巡检人">
      </el-table-column>
      <el-table-column
        prop="turnName"
        header-align="center"
        align="center"
        label="轮次">
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
  </template>
  </split-pane>
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
          deptId: '',
          isHere: '',
          itemName: '',
          username: '',
          deviceName: '',
          statusId: '',
          deviceLevelId: '',
          exceptionId: '',
          inspectionTypeId: '',
          isOk: '',
          startTime: '',
          endTime: ''
        },
        tableHeight: 300,
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 12,
        oldPercent: 16,
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
        startDatePicker: this.beginDate()
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
      this.getExceptionList()
      this.getDeviceLevelList()
      this.getInspectionTypeList()
      this.getDeviceStatusList()
      this.getDataList()
    },
    methods: {
      beginDate () {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now() // 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      search () {
        this.getDataList()
      },
      view (type, url, inspectionTypeId) {
        console.log(inspectionTypeId)
        if (type !== 'data') {
          this.viewMediaVisible = true
          this.$nextTick(() => {
            this.$refs.viewMedia.init(type, url)
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
            console.log(inspectionType)
            this.$refs.viewChart.init(inspectionType, url)
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
        if (type === 'video') {
          return 'video'
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
      getExceptionList () {
        if (this.deviceLevelList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/exception/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.exceptionList = data.page.list
          })
        }
      },
      getDeviceLevelList () {
        if (this.deviceLevelList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/devicelevel/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deviceLevelList = data.page.list
          })
        }
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
        if(endTime !=='' && endTime<startTime) {
          this.$message.error('结束时间不能小于开始时间')
          return
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectionresult/query'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'isOk': this.dataForm.isOk,
            'isHere': this.dataForm.isHere,
            'deptId': this.dataForm.deptId,
            'itemName': this.dataForm.itemName,
            'username': this.dataForm.username,
            'deviceName': this.dataForm.deviceName,
            'statusId': this.dataForm.statusId,
            'deviceLevelId': this.dataForm.deviceLevelId,
            'exceptionId': this.dataForm.exceptionId,
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
          const tHeader = ['设备名', '巡检内容', '正常', '异常等级', '巡检结果', '巡检类型', '设备等级', '单位', '巡检时间', '上传时间', '设备状态', '巡检人', '轮次', '跳过', '备注']
          const filterVal = ['deviceName', 'itemName', 'isOkName', 'exceptionName', 'result', 'inspectionType', 'deviceLevel', 'unit', 'startTime', 'createTime', 'deviceStatus', 'username', 'turnName', 'isCheckName', 'remark']
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
          url: this.$http.adornUrl('/inspection/inspectionresult/export'),
          method: 'get',
          params: this.$http.adornParams({
            'isOk': this.dataForm.isOk,
            'isHere': this.dataForm.isHere,
            'deptId': this.dataForm.deptId,
            'itemName': this.dataForm.itemName,
            'username': this.dataForm.username,
            'deviceName': this.dataForm.deviceName,
            'statusId': this.dataForm.statusId,
            'deviceLevelId': this.dataForm.deviceLevelId,
            'exceptionId': this.dataForm.exceptionId,
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
        this.pageIndex = 1
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
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 105 - 32 - 20
      })
    }
  }
</script>

<style lang="scss" scoped="">
  @media screen and (max-width: 1360px){
    .el-table{
      height: calc(100vh - 320px) !important;
    }
  }
</style>