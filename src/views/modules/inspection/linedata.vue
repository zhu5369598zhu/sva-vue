<template>
  <div class="mod-absencedata" style="height: 100%;">
    <div class="show-data-content">
      <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
        <template slot="paneL" >
          <div class="show-left">
            <div class="org_title">
              <span v-if="this.isDrawBack===false" style="vertical-align: middle;">机构列表</span><i :class="drawBackClass" style="float:right;cursor:pointer;" @click="onDrawBack"></i>
            </div>
            <linetree :inspectionType="dataForm.inspectionTypeId" @TreeSelectEvent="handleDeptSelect" v-if="this.isDrawBack===false"></linetree>
          </div>
        </template>
        <template slot="paneR">
          <div class="show-data-table">
            <div class="show-data-up">
              <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
                <el-form-item label="巡检时间:" prop="startTime">
                  <el-date-picker v-model="dataForm.startTime" size="mini" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:140px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="到:" prop="endTime">
                  <el-date-picker v-model="dataForm.endTime" size="mini" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleEndTimeChange" :picker-options="startDatePicker" style="width:140px;"></el-date-picker>
                </el-form-item>
                <!--<el-form-item label="" prop="selectDay">
                  <el-select v-model="dataForm.selectDay" size="mini" clearable style="width:100px;">
                    <el-option
                      v-for="item in selectDayList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>-->
                <el-form-item>
                  <el-button size="mini" @click="search()">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button size="mini" @click="exportExcelHandle()">导出</el-button>
                </el-form-item>
              </el-form>
              <el-tabs type="border-card" value="data" ref="tabs">
                <!--<el-tab-pane label="图表" name="chart" actived="true">
                  <div v-show="hasData===true&&chartType==='chartbar'" id="chartbar" :style="{ 'height': chartHeight + 'px' }">
                    <component  :is="chartType" ref="chartbar" :category="category" :legend="legend" :series="series" title="缺勤统计图表"></component>
                  </div>
                  <div v-show="hasData===true&&chartType==='chartpie'" id="chartpie" :style="{ 'height': chartHeight + 'px' }">
                    <component  :is="chartType" ref="chartpie" :legend="legend" :series="series" title="缺勤统计图表"></component>
                  </div>
                  <div class="no-data" align="center" v-show="hasData===false" :style="{ 'height': chartHeight + 'px' }">暂无数据</div>
                </el-tab-pane>-->
                <el-tab-pane label="数据" name="data" actived="true">
                  <div class="show-data">
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
                        type="index"
                        width="50"
                        align="center"
                        lable="">
                      </el-table-column>
                      <el-table-column
                        prop="lineName"
                        header-align="center"
                        align="center"
                        min-width="150"
                        label="线路名称">
                      </el-table-column>
                      <el-table-column
                        prop="deptName"
                        header-align="center"
                        align="center"
                        min-width="150"
                        label="所属机构">
                      </el-table-column>
                      <el-table-column
                        prop="periodName"
                        header-align="center"
                        align="center"
                        min-width="80"
                        label="周期">
                      </el-table-column>
                      <el-table-column
                        prop="turnName"
                        header-align="center"
                        align="center"
                        min-width="140"
                        label="轮次">
                      </el-table-column>
                      <el-table-column
                        prop="workerList"
                        header-align="center"
                        align="center"
                        min-width="150"
                        label="班组">
                      </el-table-column>
                      <el-table-column
                        prop="turnStartTime"
                        header-align="center"
                        align="center"
                        width="140"
                        label="轮次开始时间">
                      </el-table-column>
                      <el-table-column
                        prop="turnEndTime"
                        header-align="center"
                        align="center"
                        width="140"
                        label="轮次结束时间">
                      </el-table-column>
                      <el-table-column
                        prop="inspectedStartTime"
                        header-align="center"
                        align="center"
                        width="140"
                        label="巡检开始时间">
                      </el-table-column>
                      <el-table-column
                        prop="inspectedEndTime"
                        header-align="center"
                        align="center"
                        width="140"
                        label="巡检结束时间">
                      </el-table-column>
                      <el-table-column
                        prop="haoshi"
                        header-align="center"
                        align="center"
                        width="140"
                        label="耗时">
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
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </template>
      </split-pane>
    </div>
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import chartbar from '@/components/charts/bar2'
  import chartline from '@/components/charts/line'
  import chartpie from '@/components/charts/pie-cake'
  import linetree from '@/components/only-line-tree'
  import splitPane from '@/components/split-pane'
  export default {
    data () {
      return {
        dataForm: {
          deptId: null,
          lineId: null,
          deviceId: null,
          startTime: null,
          endTime: '',
          // selectDay: 1
        },
        tableHeight: 300,
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 16,
        oldPercent: 16,
        dataList: [],
        chartData: [],
        pageIndex: 1,
        pageSize: 20,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        startDatePicker: this.beginDate(),
        // selectDayList: [{'id':0,'name':'近一天'},{'id':1,'name':'近七天'},{'id':2,'name':'上一周'},{'id':3,'name':'上一月'}],
        chartHeight: '',
        type: 'dept',
        chartType: 'chartbar',
        ids: [],
        legend: [],
        category: [],
        series: [],
        hasData: false
      }
    },
    components: {
      chartbar,
      chartpie,
      chartline,
      linetree,
      splitPane
    },
    activated () {
      this.dataForm.endTime = new Date()
      this.dataForm.startTime = new Date()
      this.dataForm.startTime.setDate(this.dataForm.endTime.getDate() - 7)
      this.search()
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
        this.getChartData()
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
        }else{
          let time = formatDate(new Date(), 'yyyy-MM-dd')  // 当日时间
          if(endTime < time){
            endTime = new Date(this.dataForm.endTime)
            endTime.setDate(endTime.getDate()+ 1)
            endTime = formatDate(endTime, 'yyyy-MM-dd')
            console.log('查询时间'+ endTime)
          }
        }
        if(endTime !=='' && endTime<startTime) {
          this.$message.error('结束时间不能小于开始时间')
          return
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectiontask/getlinebytime'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'deptId': this.dataForm.deptId,
            'lineId': this.dataForm.lineId,
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
      getStatisticsByDate () {
        /*let startTime = new Date(this.dataForm.startTime)
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
          url: this.$http.adornUrl('/inspection/inspectiontask/getabsencestatisticsbydate'),
          method: 'get',
          params: this.$http.adornParams({
            'deptId': this.dataForm.deptId,
            'lineId': this.dataForm.lineId,
            'startTime': startTime,
            'endTime': endTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.legend = data.data.legend
            this.category = data.data.category
            this.series = data.data.series
            if (this.category.length > 0) {
              this.hasData = true
            } else {
              this.hasData = false
            }
            this.drawChart()
          } else {
            this.$message.error(data.msg)
          }
        })*/
      },
      getChartData () {
        this.legend = []
        this.category = []
        this.series = []
        this.getDataList()
        this.getStatisticsByDate()
      },
      handleDeptSelect (val) {
        this.type = val.type
        this.dataForm.deptId = null
        this.dataForm.lineId = null
        this.dataList = []
        if (val.type === 'dept') {
          this.dataForm.deptId = val.id
        }
        if (val.type === 'line') {
          this.dataForm.lineId = val.id
        }
        this.pageIndex = 1
        this.getChartData()
      },
      drawChart () {
        console.log(this.chartType)
        if (this.hasData === true) {
          if (this.chartType === 'chartbar') {
            this.$nextTick(() => {
              this.$refs.chartbar.initChart(this.chartType)
            })
          }
        }
      },
      exportToExcel (list) {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['线路名称', '所属机构', '周期', '轮次', '班组', '轮次开始时间', '轮次结束时间', '巡检开始时间', '巡检结束时间', '耗时(s)']
          const filterVal = ['lineName', 'deptName', 'periodName', 'turnName', 'workerList', 'turnStartTime', 'turnEndTime', 'inspectedStartTime', 'inspectedEndTime', 'haoshi']
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
        }else{
          let time = formatDate(new Date(), 'yyyy-MM-dd')  // 当日时间
          if(endTime < time){
            endTime = new Date(this.dataForm.endTime)
            endTime.setDate(endTime.getDate()+ 1)
            endTime = formatDate(endTime, 'yyyy-MM-dd')
            console.log('查询时间'+ endTime)
          }
        }
        console.log('线路开始查询')
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectiontask/getlinebytime'),
          method: 'get',
          params: this.$http.adornParams({
            'deptId': this.dataForm.deptId,
            'lineId': this.dataForm.lineId,
            'startTime': startTime,
            'endTime': endTime
          })
        }).then(({data}) => {
          console.log(data.page.list)
          if (data && data.code === 0) {
            this.exportToExcel(data.page.list)
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
        if (this.$refs.table !== null) {
          this.tableHeight = window.innerHeight - this.$refs.tabs.$el.offsetTop - this.$refs.table.$el.offsetTop - 105 - 32 - 40 - 20
        }
        this.chartHeight = window.innerHeight - this.$refs.tabs.$el.offsetTop - 160
      },
      /* 'dataForm.selectDay': function (val) {
        if (val === 0) {
          this.dataForm.endTime = new Date()
          this.dataForm.startTime = new Date()
          this.dataForm.startTime.setDate(this.dataForm.endTime.getDate() - 1)
        }else if (val === 1) {
          this.dataForm.endTime = new Date()
          this.dataForm.startTime = new Date()
          this.dataForm.startTime.setDate(this.dataForm.endTime.getDate() - 7)
        }else if (val === 2) {
          this.dataForm.endTime = new Date()
          this.dataForm.startTime = new Date()
          this.dataForm.startTime.setDate(this.dataForm.endTime.getDate() - (this.dataForm.endTime.getDay() - 7) -7*2)
          this.dataForm.endTime.setDate(this.dataForm.endTime.getDate() - (this.dataForm.endTime.getDay() - 7) -7*1)
        }else if (val === 3) {
          let now = new Date()
          let year = now.getFullYear()
          let month = now.getMonth()
          this.dataForm.startTime = new Date(year,month - 1,1)
          this.dataForm.endTime = now
          this.dataForm.endTime.setDate(this.dataForm.startTime.getDate() - 1)
        }
        this.search()
      }*/
    },
    mounted: function () {
      this.$nextTick(function () {
        if (this.$refs.table !== null) {
          this.tableHeight = window.innerHeight - this.$refs.tabs.$el.offsetTop - this.$refs.table.$el.offsetTop - 105 - 32 - 40 - 20
        }
        this.chartHeight = window.innerHeight - this.$refs.tabs.$el.offsetTop - 160
      })
    }
  }
</script>

<style>
  .no-data {
    font-size: 20px;
    margin-top: 30px;
  }
</style>
<style scoped>
  .show-data-table .el-tab-pane .el-table {
    height: calc(100vh - 246px) !important;
  }
</style>
