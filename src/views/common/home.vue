<template>
  <div class="mod-home">
    <div class="show-data-content" style="height: 100%;">
      <el-row :gutter="10" class="home-row-main">
        <el-col :span="6" class="home-col home-col-left">
          <el-row :gutter="10" class="home-row-up">
            <div class="show-chart">
                <div class="charts">
                <div class="chart-up">
                  <div class="chart-header">
                    <span class="char-title">异常排名</span>
                    <div class="filter">
                      <el-radio-group size="mini" @change="topRadioChange" v-model="topPeriod" style="display: inline;vertical-align: text-bottom;">
                        <el-radio-button v-for="period in topPeriodList" :label="period" :key="period"></el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                  <div align="center" v-if="false">
                    <el-checkbox-group size="mini"  @change="topCheckboxChange" v-model="topFilter" style="display: inline;vertical-align: text-bottom;">
                      <el-checkbox-button  v-for="level in deviceLevelList" :label="level" :key="level">{{level}}</el-checkbox-button>
                    </el-checkbox-group>
                  </div>
                  
                </div>
                <ul class="yichang">
                  <li v-for="(item, key) in deviceExceptionTopList">
                    <span>{{ item.deviceName }}</span>
                    <span>{{ item.exceptionCount }}</span>
                  </li>
                </ul>
<!--                 <el-table
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
                    </el-table> -->
                    <div class="more" v-if="deviceExceptionTopList.length >=6 ">
                      <router-link to="inspection-inspectionresultexception">更多>></router-link>
                    </div>
              </div>
            </div>
          </el-row>
          <el-row :gutter="10" class="home-row-down">
            <div class="show-chart">
                <div class="charts">
                <div class="chart-up">
                  <div class="chart-header">
                    <span class="char-title">巡检完成率</span>
                    <div class="filter">
                      <el-date-picker v-model="finishStartTime" type="date" value-format="yyyy-MM-dd" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:140px;"></el-date-picker>
                    </div>
                  </div>
                </div>
                <div v-show="hasFinishData===true" class="chart-down">
                  <chartpie id="chartFinish" ref="chartFinish" align="center" :b="inspectItemSum" :a="inspectedItemSum" :title="completionRate" style="height:100%;"></chartpie>
                </div>
                <div class="no-data" align="center" v-show="hasFinishData===false">暂无数据</div>
              </div>
            </div>
          </el-row>
        </el-col>
        <el-col :span="12" class="home-col home-col-middle">
          <el-row :gutter="10" class="home-row-up">
            <div class="show-chart">
                <div class="charts">
                <div class="chart-up">
                  <div class="chart-header">
                    <span class="char-title">异常分布</span>
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
            <div class="show-chart" style="padding-bottom: 0px;">
                <div class="charts">
                <div class="chart-up">
                  <div class="chart-header">
                    <span class="char-title">设备指标趋势</span>
                    <el-form :inline="true" :model="dataForm" align="center" class="shebie" id="shebiex">
                      <el-form-item>
                        <el-select v-model="dataForm.deviceId" placeholder="巡检设备" @change="deviceSelectChange" style="width:140px;">
                          <el-option
                            v-for="item in deviceList"
                            :key="item.deviceId"
                            :label="item.deviceName"
                            :value="item.deviceId">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item>
                        <el-select v-model="dataForm.itemId" placeholder="巡检项" @change="itemSelectChange" style="width:140px;">
                          <el-option
                            v-for="item in itemList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                    <div class="filter">
                      <el-radio-group size="mini" @change="inspectionRadioChange" v-model="inspectionFilter" style="display: inline;vertical-align: text-bottom;">
                        <el-radio-button v-for="period in inspectionPeriodList" :label="period" :key="period"></el-radio-button>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
                <div class="chart-down chartInspection">
                  <chartline v-show="hasInspectionData===true" id="chartInspection" ref="chartInspection" align="center" :category="inspectionCategory" :series="inspectionSeries"></chartline>
                  <div class="no-data" align="center" v-show="hasInspectionData===false">暂无数据</div>
                </div>
              </div>
            </div>
          </el-row>
        </el-col>
        <el-col :span="6" class="home-col home-col-right">
          <el-row :gutter="10" class="home-row-up-alert">
            <div class="show-alert" align="center">
              <el-badge :value="workLog" :max="99" class="alert">
                <el-button type="primary" @click.native="newsHandle(1)">交接日志</el-button>
              </el-badge>

              <el-badge :value="bugLog" :max="10" class="alert">
                <el-button  type="primary" @click.native="newsHandle(2)">巡检工单</el-button>
            </el-badge>
            </div>
          </el-row>
          <el-row :gutter="10" class="home-row-down-alert" style="margin-bottom: 0px;">
            <div class="show-chart" style="padding-bottom: 0px;">
                <div class="charts">
                <div class="exception-chart-up">
                  <div class="chart-header">
                    <span class="char-title">设备状态</span>
                    <div class="filter">
                      <el-radio-group size="mini" @change="statusRadioChange" v-model="statusFilter" style="display: inline;vertical-align: text-bottom;">
                        <el-radio-button v-for="period in statusPeriodList" :label="period" :key="period"></el-radio-button>
                      </el-radio-group>
                    </div>
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
      <news v-if="newsVisible" ref="news"></news>
    </div>
  </div>
</template>

<script>
  import { formatDate, getFirstDayOfWeek, getFirstDayOfMonth, getFirstDayOfYear } from '@/utils'
  import chartbar from '@/components/charts/bar'
  import chartpie from '@/components/charts/pie'
  import chartline from '@/components/charts/lines'
  import chartcolumn from '@/components/charts/column'
  import chartlink from '@/components/charts/link'
  import news from '.././main-navbar-news'
export default {
    data () {
      return {
        dataForm: {
          deviceId: '',
          itemId: ''
        },
        inspectItemSum: 0,
        inspectedItemSum: 0,
        completionRate: '',
        finishStartTime: '',
        finishEndTime: '',
        topStartTime: '',
        topEndTime: '',
        inspectionStartTime: '',
        inspectionEndTime: '',
        exceptionStartTime: '',
        exceptionEndTime: '',
        statusStartTime: '',
        statusEndTime: '',
        deviceList: [],
        itemList: [],
        workLog: '',
        bugLog: '',
        levelIds: [],
        topFilter: ['A类', 'B类', 'C类'],
        topPeriod: '本年',
        topPeriodList: ['本周', '本月', '本年'],
        finishFilter: [''],
        exceptionFilterType: '',
        inspectionFilter: '本年',
        exceptionFilter: '本年',
        statusFilter: '本年',
        deviceLevelList: ['A类', 'B类', 'C类'],
        inspectionPeriodList: ['本周', '本月', '本年'],
        exceptionPeriodList: ['本周', '本月', '本年'],
        statusPeriodList: ['本周', '本月', '本年'],
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
        inspectionSeries: [],
        newsVisible: false,
        totalPage: 0,
        totalPageTwo: 0,
        workList: [
          {
            newsId: '',
            userId: '',
            newsName: '',
            newsType: '',
            newsNumber: '',
            createTime: '',
            updateTime: ''
          }
        ],
        logList: [
          {
            newsId: '',
            userId: '',
            newsName: '',
            newsType: '',
            newsNumber: '',
            createTime: '',
            updateTime: ''
          }
        ],
        newstype: '1'
      }
    },
    components: {
      chartbar,
      chartpie,
      chartline,
      chartcolumn,
      chartlink,
      news
    },
    computed: {
      userId: {
        get () { return this.$store.state.user.id }
      }
    },
    created () {
      let today = new Date()
      this.finishStartTime = new Date()
      this.finishStartTime.setDate(this.finishStartTime.getDate() - 1)
      this.finishStartTime = formatDate(this.finishStartTime, 'yyyy-MM-dd')
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
      if (this.stautsFilter === '本周') {
        this.statusStartTime = getFirstDayOfWeek(today)
      } else if (this.stautsFilter === '本月') {
        this.statusStartTime = getFirstDayOfMonth(today)
      } else if (this.stautsFilter === '本年') {
        this.statusStartTime = getFirstDayOfYear(today)
      } else if (this.stautsFilter === '全部') {
        this.statusStartTime = ''
      }
      if (this.exceptionFilter === '本周') {
        this.exceptionFilterType = '%a'
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
      for (var i = 0; i < this.topFilter.length; i++) {
        if (this.topFilter[i] === 'A类') {
          this.levelIds.push(1)
        } else if (this.topFilter[i] === 'B类') {
          this.levelIds.push(2)
        } else if (this.topFilter[i] === 'C类') {
          this.levelIds.push(3)
        }
      }
      this.getDataList()
      this.newsexistwork()
      this.newsexistlog()
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
        for (var i = 0; i < val.length; i++) {
          if (val[i] === 'A类') {
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
      statusRadioChange (val) {
        let today = new Date()
        if (val === '本周') {
          this.statusStartTime = getFirstDayOfWeek(today)
        } else if (val === '本月') {
          this.statusStartTime = getFirstDayOfMonth(today)
        } else if (val === '本年') {
          this.statusStartTime = getFirstDayOfYear(today)
        } else if (val === '全部') {
          this.statusStartTime = ''
        }
        this.getDeviceStatus()
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
          this.exceptionFilterType = '%a'
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
        this.finishStartTime = val
        this.getCompletionRate()
      },
      getDataList () {
        this.getDeviceStatus()
        this.getDeviceExceptionTop()
        this.getDevice()
        this.getExceptionStatus()
        this.getCompletionRate()
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
            this.hasExceptionData = true
            this.exceptionLegend = data.data.legend
            let category = []
            if (this.exceptionFilterType === '%a') {
              for (let i = 0; i < data.data.category.length; i++) {
                if (data.data.category[i] === 'Mon') {
                  category.push('周一')
                } else if (data.data.category[i] === 'Tue') {
                  category.push('周二')
                } else if (data.data.category[i] === 'Wed') {
                  category.push('周三')
                } else if (data.data.category[i] === 'Thu') {
                  category.push('周四')
                } else if (data.data.category[i] === 'Fri') {
                  category.push('周五')
                } else if (data.data.category[i] === 'Sat') {
                  category.push('周六')
                } else if (data.data.category[i] === 'Sun') {
                  category.push('周日')
                } else {
                  category.push(data.data.category[i])
                }
              }
            }
            if (this.exceptionFilterType === '%d') {
              for (let i = 0; i < data.data.category.length; i++) {
                  category.push(data.data.category[i] + '日')
              }
            }
            if (this.exceptionFilterType === '%m') {
              for (let i = 0; i < data.data.category.length; i++) {
                  category.push(data.data.category[i] + '月')
              }
            }
            this.exceptionCategory = category
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
          params: this.$http.adornParams({
            'startTime': this.statusStartTime,
            'endTime': this.statusEndTime
          })
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
            this.$nextTick(()=>{
              this.getItemsByDevice(this.dataForm.deviceId)
            })
          })
        }
      },
      getItemsByDevice (deviceId) {
        if (deviceId !== '') {
          this.$http({
            url: this.$http.adornUrl('/inspection/inspectionitem/getitemsbydevice'),
            method: 'get',
            params: this.$http.adornParams({
              'deviceId': deviceId
            })
          }).then(({data}) => {
            if (data.list.length > 0) {
              this.itemList = data.list
              this.dataForm.itemId = data.list[0].id
              if (this.dataForm.itemId > 0) {
                this.$nextTick(function () {
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
            this.inspectionCategory = data.data.category
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
      getCompletionRate () {
        this.inspectedItemSum = 0
        this.inspectItemSum = 0
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectiontask/getStatus'),
          method: 'get',
          params: this.$http.adornParams({
            'date': this.finishStartTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if(data.status[0] != null){
              let tmpRate = 0
              this.inspectedItemSum = data.status[0].inspectedItemSum
              this.inspectItemSum = data.status[0].inspectItemSum
              if(this.inspectItemSum === 0){
                tmpRate = 0.00
              }else{
                tmpRate = this.inspectedItemSum/this.inspectItemSum
              }
              this.completionRate = '已完成' + parseFloat(tmpRate*100).toFixed(2) + '%'
            }else{
              this.completionRate = '已完成0.00%'
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
        return 'height:34px'
      },
      cellStyle () {
        return 'padding:0'
      },
      // 处理消息
      newsHandle (type) {
        this.newsVisible = true
        this.$nextTick(() => {
          this.$refs.news.init(type)
        })
      },
      newsexistwork () {
        this.$http({
          url: this.$http.adornUrl('/sys/news/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'user_id': this.userId,
            'type': '1'
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.workList = data.page.list
            if (data.page.totalCount > 0) {
              this.workLog = data.page.totalCount
            } else {
              this.workLog = ''
            }
          } else {
            this.workList = [{
              newsId: '',
              userId: '',
              newsName: '',
              newsType: '',
              newsNumber: '',
              createTime: '',
              updateTime: ''
            }]
            this.workLog = ''
          }
        })
      },
      newsexistlog () {
        this.$http({
          url: this.$http.adornUrl('/sys/news/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'user_id': this.userId,
            'type': '2'
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.logList = data.page.list
            if (data.page.totalCount > 0) {
              this.bugLog = data.page.totalCount
            } else {
              this.bugLog = ''
            }
          } else {
            this.logList = [{
              newsId: '',
              userId: '',
              newsName: '',
              newsType: '',
              newsNumber: '',
              createTime: '',
              updateTime: ''
            }]
            this.bugLog = ''
          }
        })
      },
      // 这是一个定时器
      worktimer () {
        return setTimeout(() => {
          this.newsexistwork()
        }, 1000*60*5)
      },
      logtimer () {
        return setTimeout(() => {
          this.newsexistlog()
        }, 1000*60*5)
      }
    },
    // 最终销毁
    destroyed () {
      clearTimeout(this.worktimer)
      clearTimeout(this.logtimer)
    },
    watch: {
      workList () {
        this.worktimer()
      },
      logList () {
        this.logtimer()
      }
    }

}
</script>

<style>
  .alert {
    margin-left: 10px;
    /* margin-top: 40px; */
    margin-right: 10px;
    z-index: 5;
    position: relative;
  }
  .alert-span{
    margin-left: 66px;
    margin-top: -14px;
    margin-right: 36px;
    z-index: 10;
    position: relative;
  }
  .alert-span-one{
    float: left;
    width: 20px;
    height: 20px;
    background-color: red;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
  }
  .alert-span-two{
    float: left;
    margin-left: 94px;
    width: 20px;
    height: 20px;
    background-color:red;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
  }
  .no-data {
    font-size: 20px;
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
    margin-left: 0px !important;
    height: 100%;
  }
  .home-row-up {
    width: 100%;
    height: 50%;
    margin-left: 0px !important;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .home-row-up .el-table{
    /* height: calc(100% - 105px); */
    flex: 1;
    overflow-y: auto;
  }
  .home-row-up-alert {
    width: calc(100% + 5px);
    margin-bottom: 10px;
    margin-right: 0px;
    height: 15%;
    overflow: hidden;
  }
  .home-row-up-alert .show-alert{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .home-row-down-alert {
    position: relative;
    width: calc(100% + 5px);
    height: 85%;
    margin-bottom: 10px;
  }
  .home-row-down {
    flex: 1;
    position: relative;
    width: 100%;
    height: calc(100% - 435px);
    margin-left: 0px !important;
  }
  .home-col-left{
    position: relative;
    height: 100%;
    padding-left: 0px !important;
  }
  .home-col-middle{
    position: relative;
    height: 100%;
    padding-right: 10px !important;
  }
  .home-col-right{
    position: relative;
    height: 100%;
    padding-right: 0px !important;
  }
  .show-chart {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
  }
  .show-alert {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
  }
  .charts {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .chart-up {
    width: 100%;
    height: 15%;
    min-height: 56px;
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
    min-width: 200px;
    display: flex;
    justify-content: space-between;
  }
  .chart-line {
    width: 100%;
    height: 100%;
    padding: 14px;
  }
  .char-title {
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
  .more {
    margin: 10px;
    display: inline-block;
    cursor: pointer;
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
  #chartException{
    margin-top:  15px !important;
    height: 100% !important;
  }
  #chartFinish{

  }
  #chartInspection{
    height: calc(100% + 50px);
    width: 100%;
  }
  .chartInspection{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .shebie{
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    align-self: flex-start;
    min-height: 100%;
  }
  .shebie .el-form-item{
    margin: 3px 5px;
  }
  .shebie .el-form-item .el-form-item__content{
    width: 100%;
  }
  .shebie .el-form-item .el-form-item__content .el-select{
   width: 118px !important;
  }
  .home-col{
    display: flex;
    flex-direction: column;
  }
  .chartInspection::-webkit-scrollbar{
    height: 0;
  }
  .chartInspection:hover::-webkit-scrollbar{
    height: 4px;
  }
  .chartInspection:hover::-webkit-scrollbar-track {
      background-color: transparent;
/*         -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius: 2em */
  }
  .chartInspection:hover::-webkit-scrollbar-thumb {
      background-color: #42ADFF;
/*         -webkit-border-radius: 2em;
      -moz-border-radius: 2em;
      border-radius: 2em */
  }

</style>

<style scoped="" lang="scss">
  .yichang{
    margin: 0;
    padding: 0;
    width: 100%;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    li{
      list-style:none;
      display: flex;
      padding: 0px 10px;
      justify-content: space-between;
      flex: 1;
      align-items: center;
      border-bottom: 1px solid #ebeef5;
      max-height: 40px;
      &:hover{
        background-color: #eee;
      }
    }
  }
</style>

<style>
  @media screen and (max-height: 850px) {
    #chartFinish{

    }
    .home-row-up .el-table::-webkit-scrollbar{
      width: 0;
      transition: 0.2s;
    }
    .home-row-up .el-table:hover::-webkit-scrollbar{
      width: 4px;
    }
    .home-row-up .el-table:hover::-webkit-scrollbar-track {
        background-color: transparent;
/*         -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em */
    }
    .home-row-up .el-table:hover::-webkit-scrollbar-thumb {
        background-color: #42ADFF;
/*         -webkit-border-radius: 2em;
        -moz-border-radius: 2em;
        border-radius: 2em */
    }
    #chartInspection{
      /* height: 100%; */
      min-height: 200px;
      /* margin-top: 0px; */
    }
  }
</style>
