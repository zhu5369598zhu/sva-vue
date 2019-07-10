<template>
  <div class="mod-home">
    <div class="show-data-content">
      <el-row :gutter="10" class="home-row-main">
        <el-col :span="8" class="home-col-left">
          <el-row :gutter="10" class="home-row-up">
            <div class="show-chart">
                <div class="charts">
                <div class="chart-up">
                  <div class="chart-header">
                    <span class="title">异常频度排名</span>
                    <div class="filter">
                      <el-checkbox-group v-show="false" size="mini"  @change="topCheckboxChange" v-model="topFilter" style="display: inline;vertical-align: text-bottom;">
                        <el-checkbox-button  v-for="level in deviceLevelList" :label="level" :key="level">{{level}}</el-checkbox-button>
                      </el-checkbox-group>
                      <el-radio-group size="mini" @change="topRadioChange" v-model="topPeriod" style="display: inline;vertical-align: text-bottom;">
                        <el-radio-button v-for="period in topPeriodList" :label="period" :key="period"></el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                   <el-table
                    ref="table"
                    :data="deviceExceptionTopList"
                    :border="false"
                    :show-header="false"
                    :cell-style="cellStyle"
                    :row-style="rowStyle"
                    style="width: 100%;">
                    <el-table-column
                      prop="deviceName"
                      header-align="center"
                      align="left"
                      label="设备">
                    </el-table-column>
                    <el-table-column 
                      prop="exceptionCount"
                      header-align="center"
                      align="right"
                      label="频次">
                    </el-table-column>
                    </el-table>
                </div>
              </div>
            </div>
          </el-row>
          <el-row :gutter="10" class="home-row-down">
            <div class="show-chart">
                <div class="charts">
                <div class="chart-up">
                  <div class="chart-header">
                    <span class="title">巡检完成率</span>
                    <div class="filter">
                      <el-date-picker v-model="this.finishStartTime" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:140px;"></el-date-picker>
                    </div>
                  </div>
                </div>
                <div v-show="hasFinishData===true" class="chart-down">
                  <chartpie id="chartFinish" ref="chartFinish" align="center" style="height:100%"></chartpie>
                </div>
                <div class="no-data" align="center" v-show="hasFinishData===false">暂无数据</div>
              </div>
            </div>
          </el-row>
        </el-col>
        <el-col :span="12" class="home-col-middle">
          <el-row :gutter="10" class="home-row-up">
            <div class="show-chart">
                <div class="charts">
                <div class="chart-up">
                  <div class="chart-header">
                    <span class="title">异常分布</span>
                    <div class="filter">
                      <el-radio-group size="mini" @change="exceptionRadioChange" v-model="exceptionFilter" style="display: inline;vertical-align: text-bottom;">
                        <el-radio-button v-for="period in exceptionPeriodList" :label="period" :key="period"></el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
                <div class="chart-down">
                  <chartcolumn v-show="hasExceptionData===true" id="chartException" ref="chartException" align="center" style="height:100%;" :legend="exceptionLegend" :category="exceptionCategory" :seriesA="exceptionSeriesA" :seriesB="exceptionSeriesB" :seriesC="exceptionSeriesC"></chartcolumn>
                  <div class="no-data" align="center" v-show="hasExceptionData===false">暂无数据</div>
                </div>
              </div>
            </div>
          </el-row>
          <el-row :gutter="10" class="home-row-down">
            <div class="show-chart">
                <div class="charts">
                <div class="chart-up">
                  <div class="chart-header">
                    <span class="title">设备指标趋势</span>
                    <div class="filter">
                      <el-radio-group size="mini" @change="inspectionRadioChange" v-model="inspectionFilter" style="display: inline;vertical-align: text-bottom;">
                        <el-radio-button v-for="period in inspectionPeriodList" :label="period" :key="period"></el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
                <div class="chart-down">
                  <chartline v-show="hasInspectionData===true" id="chartInspection" ref="chartInspection" align="center" :category="inspectionCategory" :series="inspectionSeries" style="height:100%;"></chartline>
                  <div class="no-data" align="center" v-show="hasInspectionData===false">暂无数据</div>
                </div>
              </div>
            </div>
            <div class="chart-filter-container">
              <div align="center">
                <el-form :inline="true" :model="dataForm" align="center">
                  <el-form-item>
                    <el-select v-model="dataForm.deviceId" placeholder="巡检设备" @change="deviceSelectChange" clearable style="width:140px;">
                      <el-option
                        v-for="item in deviceList"
                        :key="item.deviceId"
                        :label="item.deviceName"
                        :value="item.deviceId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-select v-model="dataForm.itemId" placeholder="巡检项" @change="itemSelectChange" clearable style="width:140px;">
                      <el-option
                        v-for="item in itemList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-row>
        </el-col>
        <el-col :span="4" class="home-col-right">
          <el-row :gutter="10" class="home-row-up-alert">
            <div class="show-alert" align="center">
              <el-badge :value="workLog" :max="99" class="alert">
                <el-button type="primary">交接日志</el-button>
              </el-badge>
              <el-badge :value="bugLog" :max="10" class="alert">
                <el-button  type="primary">工单</el-button>
            </el-badge>
            </div>
          </el-row>
          <el-row :gutter="10" class="home-row-down-alert">
            <div class="show-chart">
                <div class="charts">
                <div class="exception-chart-up">
                  <div class="chart-header">
                    <span class="title">设备状态分布</span>
                  </div>
                </div>
                <div class="exception-chart-down">
                  <chartlink v-show="hasLinkData===true" id="chartLink" ref="chartLink" class="chart-link" :series="statusList" align="center"></chartlink>
                  <div class="no-data" align="center" v-show="hasLinkData===false">暂无数据</div>
                </div>
              </div>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { formatDate,getFirstDayOfWeek,getFirstDayOfMonth,getFirstDayOfYear } from '@/utils'
  import chartbar from '@/components/charts/bar'
  import chartpie from '@/components/charts/pie'
  import chartline from '@/components/charts/lines'
  import chartcolumn from '@/components/charts/column'
  import chartlink from '@/components/charts/link'
export default {
    data () {
      return {
        dataForm: {
          deviceId: '',
          itemId: ''
        },
        finishStartTime: '',
        finishEndTime: '',
        topStartTime: '',
        topEndTime: '',
        inspectionStartTime: '',
        inspectionEndTime: '',
        exceptionStartTime: '',
        exceptionEndTime: '',
        deviceList: [],
        itemList: [],
        workLog: '',
        bugLog: '',
        levelIds: [],
        topFilter: ['A类', 'B类', 'C类'],
        topPeriod: '全部',
        topPeriodList: ['全部','本周', '本月', '本年'],
        finishFilter: [''],
        exceptionFilterType: '',
        inspectionFilter: '全部',
        exceptionFilter: '本年',
        deviceLevelList: ['A类','B类','C类'],
        inspectionPeriodList: ['全部','本周', '本月', '本年'],
        exceptionPeriodList: ['全部','本周', '本月', '本年'],
        hasLinkData: false,
        hasInspectionData: false,
        hasFinishData: true,
        hasExceptionData: false,
        statusList: [],
        deviceExceptionTopList: [],
        startDatePicker: this.beginDate(),
        exceptionLegend: [],
        exceptionCategory: [],
        exceptionSeries: [],
        exceptionSeriesA: [],
        exceptionSeriesB: [],
        exceptionSeriesC: [],
        inspectionCategory: [],
        inspectionSeries: []
      }
    },
    components: {
      chartbar,
      chartpie,
      chartline,
      chartcolumn,
      chartlink
    },
    created () {
      let today = new Date()
      this.finishStartTime = today
      this.finishStartTime.setDate(this.finishStartTime.getDate() - 30)
      if (this.topFilter === '本周') {
        this.topStartTime = getFirstDayOfWeek(today)
      } else if (this.topFilter === '本月') {
        this.topStartTime = getFirstDayOfMonth(today)
      } else if (this.topFilter === '本年') {
        this.topStartTime = getFirstDayOfYear(today)
      } else if (this.topFilter === '全部') {
        this.topStartTime = ''
      }
      
      if (this.inspectionFilter === '本周') {
        this.inspectionStartTime = getFirstDayOfWeek(today)
      } else if (this.inspectionFilter === '本月') {
        this.inspectionStartTime = getFirstDayOfMonth(today)
      } else if (this.inspectionFilter === '本年') {
        this.inspectionStartTime = getFirstDayOfYear(today)
      } else if (this.inspectionFilter === '全部') {
        this.inspectionStartTime = ''
      }
      
      if (this.exceptionFilter === '本周') {
        this.exceptionFilterType = '%w'
        this.exceptionStartTime = getFirstDayOfWeek(today)
      } else if (this.exceptionFilter === '本月') {
        this.exceptionFilterType = '%d'
        this.exceptionStartTime = getFirstDayOfMonth(today)
      } else if (this.exceptionFilter === '本年') {
        this.exceptionFilterType = '%m'
        this.exceptionStartTime = getFirstDayOfYear(today)
      } else if (this.exceptionFilter === '全部') {
        this.exceptionFilterType = '%y'
        this.exceptionStartTime = ''
      }
      
      this.levelIds = []
      for (var i=0; i<this.topFilter.length; i++) {
      	if(this.topFilter[i] === 'A类') {
      	  this.levelIds.push(1)
      	} else if (this.topFilter[i] === 'B类') {
      	  this.levelIds.push(2)
      	} else if (this.topFilter[i] === 'C类') {
      	  this.levelIds.push(3)
      	}
      }
      
      this.getDataList()
    },
    mounted () {
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
      topCheckboxChange (val) {
        this.levelIds = []
        for (var i=0; i<val.length; i++) {
        	if(val[i] === 'A类') {
            console.log(val[i])
        	  this.levelIds.push(1)
        	} else if (val[i] === 'B类') {
        	  this.levelIds.push(2)
        	} else if (val[i] === 'C类') {
        	  this.levelIds.push(3)
        	}
        }
        this.getDeviceExceptionTop()
      },
      topRadioChange (val) {
        let today = new Date()
        if (val === '本周') {
          this.topStartTime = getFirstDayOfWeek(today)
        } else if (val === '本月') {
          this.topStartTime = getFirstDayOfMonth(today)
        } else if (val === '本年') {
          this.topStartTime = getFirstDayOfYear(today)
        } else if (val === '全部') {
          this.topStartTime = ''
        }

        this.getDeviceExceptionTop()
      },
      getDeviceExceptionTop () {
        this.$http({
          url: this.$http.adornUrl(`/inspection/device/getexceptiontop`),
          method: 'post',
          data: this.$http.adornParams({
            'levleIds': this.levelIds,
            'startTime': this.topStartTime,
            'endTime': this.topEndTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.deviceExceptionTopList = data.topList
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      inspectionRadioChange (val) {
        let today = new Date()
        if (val === '本周') {
          this.inspectionStartTime = getFirstDayOfWeek(today)
        } else if (val === '本月') {
          this.inspectionStartTime = getFirstDayOfMonth(today)
        } else if (val === '本年') {
          this.inspectionStartTime = getFirstDayOfYear(today)
        } else if (val === '全部') {
          this.inspectionStartTime = ''
        }
        
        this.getDeviceInspection()
      },
      exceptionRadioChange (val) {
        let today = new Date()
        if (val === '本周') {
          this.exceptionFilterType = '%w'
          this.exceptionStartTime = getFirstDayOfWeek(today)
        } else if (val === '本月') {
          this.exceptionFilterType = '%d'
          this.exceptionStartTime = getFirstDayOfMonth(today)
        } else if (val === '本年') {
          this.exceptionFilterType = '%m'
          this.exceptionStartTime = getFirstDayOfYear(today)
        } else if (val === '全部') {
          this.exceptionFilterType = '%Y'
          this.exceptionStartTime = ''
        }
        this.getExceptionStatus()
      },
      deviceSelectChange (val) {
        this.dataForm.itemId = ''
        this.itemList = []
        this.getItemsByDevice(val)
      },
      itemSelectChange (val) {
        this.getDeviceInspection()
      },
      handleStartTimeChange (val) {
      },
      getDataList () {
        this.getDeviceStatus()
        this.getDeviceExceptionTop()
        this.getDevice()
        this.getItemsByDevice()
        this.getExceptionStatus()
      },
      getExceptionStatus () {
        this.exceptionLegend = []
        this.exceptionCategory = []
        this.exceptionSeriesA = []
        this.exceptionSeriesB = []
        this.exceptionSeriesC = []
        this.hasExceptionData = false
        this.$http({
          url: this.$http.adornUrl(`/inspection/inspectionresult/statisticsbytime`),
          method: 'get',
          params: this.$http.adornParams({
            'type': this.exceptionFilterType,
            'startTime': this.exceptionStartTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log(data.data)
              this.hasExceptionData = true
              this.exceptionLegend = data.data.legend
              this.exceptionCategory = data.data.category
              if (data.data.legend.length > 0 && data.data.series.A.length > 0){
                this.hasExceptionData = true
                this.exceptionSeriesA = data.data.series.A
                this.exceptionSeriesB = data.data.series.B
                this.exceptionSeriesC = data.data.series.C
                this.drawChart()
              } else {
                this.hasExceptionData = false
              }
          } else {
            this.$message.error(data.msg)
            this.hasExceptionData = false
          }
        }) 
      },
      getDeviceStatus () {
        this.hasLinkData = false
        this.$http({
          url: this.$http.adornUrl(`/inspection/device/getstatus`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.status.length > 0) {
              this.hasLinkData = true
              this.statusList = data.status
              this.drawChart()
            } else {
              this.hasLinkData = false
            }
          } else {
            this.$message.error(data.msg)
            this.hasLinkData = false
          }
        }) 
      },
      getDevice () {
        if (this.deviceList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/inspection/device/getdevicetoinspection'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deviceList = data.deviceList
            this.dataForm.deviceId = this.deviceList[0].deviceId
            this.getItemsByDevice(this.dataForm.deviceId)
          })
        }
      },
      getItemsByDevice (deviceId) {
        if (this.itemList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/inspection/inspectionitem/getitemsbydevice'),
            method: 'get',
            params: this.$http.adornParams({
              'deviceId': deviceId
            })
          }).then(({data}) => {
            if(data.list.length > 0) {
              this.itemList = data.list
              this.dataForm.itemId = data.list[0].id
              if (this.dataForm.itemId > 0) {
                this.$nextTick(function(){
                  this.getDeviceInspection()
                })
              }
            }
          })
        }
      },
      getDeviceInspection () {
        this.series = []
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectionresult/selectbyitem'),
          method: 'get',
          params: this.$http.adornParams({
            'itemId': this.dataForm.itemId,
            'deviceId': this.dataForm.deviceId,
            'startTime': this.inspectionStartTime,
            'endTime': this.inspectionEndTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.ids = data.data.ids
            this.inspectionCategory = data.data.category.map(item=>formatDate(new Date(item),'yyyy-MM-dd hh:mm:ss'))
            this.inspectionSeries = data.data.series
            if (this.inspectionSeries.length > 0) {
              this.hasInspectionData = true
            } else {
              this.hasInspectionData = false
            }
            this.drawChart()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      drawChart () {
        if (this.hasLinkData === true) {
          this.$nextTick(() => {
            this.$refs.chartLink.initChart('chartLink')
          })
        }
        if (this.hasInspectionData === true) {
          this.$nextTick(() => {
            this.$refs.chartInspection.initChart('chartInspection')
          })
        }
        if (this.hasFinishData === true) {
          this.$nextTick(() => {
            this.$refs.chartFinish.initChart('chartFinish')
          })
        }
        if (this.hasExceptionData === true) {
          this.$nextTick(() => {
            this.$refs.chartException.initChart('chartException')
          })
        }
      },
      rowStyle ({row, rowIndex}) {
        return 'height:40px'
      },
      cellStyle () {
        return 'padding:0'
      }
    },
    watch: {
      'this.topFilter': function(newVal, oldVal) {
        console.log(newVal, oldVal)
      }
    }
}
</script>

<style>
  .alert {
    margin-left: 10px;
    margin-top: 40px;
    margin-right: 10px;
}
  .no-data {
    margin-top: 80px;
    font-size: 24px;
  }
  .mod-home {
    position: relative;
    height: 100%;
    line-height: 1.5;
    background-color: #f1f4f5;
    overflow: hidden;
    
  }
  .home-row-main {
    width: 100%;
    height: 100%;
  }
  .home-row-up {
    width: 100%;
    height: 50%;
    margin-bottom: 10px;
  }
  .home-row-up-alert {
    width: 100%;
    height: 15%;
    margin-bottom: 10px;
  }
  .home-row-down-alert {
    position: relative;
    width: 100%;
    height: 85%;
    margin-bottom: 10px;
  }
  .home-row-down {
    position: relative;
    width: 100%;
    height: 50%;
    margin-bottom: 10px;
  }
  .home-col-left{
    position: relative;
    height: 100%;
  }
  .home-col-middle{
    position: relative;
    height: 100%;
  }
  .home-col-right{
    position: relative;
    height: 100%;
  }
  .show-chart {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
    padding-bottom: 10px;
  }
  .show-alert {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
    padding-bottom: 10px;
  }
  .charts {
    width: 100%;
    height: 100%;
  }
  .chart-up {
    width: 100%;
    height: 15%;
  }
  .chart-down {
    width: 100%;
    height: 85%;
  }
  .chart-header {
    position: relative;
    padding-bottom:14px;
    border-bottom:1px solid #E1E1E1;
    padding: 14px;
    margin-bottom: 30px;
  }
  .chart-line {
    width: 100%;
    height: 100%;
    padding: 14px;
  }
  .title {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0.14px;
    text-align: center;
    padding-bottom:14px;
    border-bottom:2px solid #2097F2
  }
  .date {
    float: right;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0.14px;
    text-align: center;
  }
  .chart-container {
    position: relative;
    padding-top: 10px;
  }
  .filter {
    display: inline;
    float: right;
  }
  .chart-filter-container {
    display: inline;
    float: right;
    position: absolute;
    top: 70px;
    width: 100%;
    text-align: left;
  }
</style>

