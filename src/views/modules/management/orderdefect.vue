<template>
  <div class="mod-orderdefect">
    <div class="show-data-content">
      <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
        <template slot="paneL" >
          <div class="show-left">
            <div class="org_title">
              <span v-if="this.isDrawBack===false" style="vertical-align: middle;">机构列表</span><i :class="drawBackClass" style="float:right;cursor:pointer;" @click="onDrawBack"></i>
            </div>
            <depttree @deptSelectEvent="handleDeptSelect" v-if="this.isDrawBack===false"></depttree>
          </div>
        </template>
        <template slot="paneR">
          <div class="show-data-table">
            <div class="show-data-up" id="data-up">
              <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
                <el-form-item label="缺陷确认状态:" prop="orderStatus">
                  <el-select v-model="dataForm.orderStatus" placeholder="请选择" clearable style="width:100px;">
                    <el-option label="待确认" value="0"></el-option>
                    <el-option label="已确认" value="1"></el-option>
                    <el-option label="已挂起" value="2"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="巡检时间从:" prop="startTime">
                  <el-date-picker v-model="dataForm.startTime" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:140px;"></el-date-picker>
                </el-form-item>
                <el-form-item label="到:" prop="endTime">
                  <el-date-picker v-model="dataForm.endTime" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleEndTimeChange" :picker-options="startDatePicker" style="width:140px;"></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button @click="ordersearch()">查询</el-button>
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
                highlight-current-row
                :cell-style="cellStyle"
                :row-style="rowStyle"
                style="width: 100%;">
                <el-table-column
                  fixed
                  prop="id"
                  header-align="center"
                  align="center"
                  label="序号">
                </el-table-column>
                <el-table-column
                  fixed
                  prop="deviceName"
                  header-align="center"
                  align="center"
                  width="150"
                  label="巡点名称">
                  <!--<template slot-scope="scope" >
                    <a href="#"><p   @click=clickRow(scope.row)>{{scope.row.deviceName}}</p></a>
                  </template>-->
                  <template slot-scope="scope">
                    <span>{{scope.row.deviceName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="itemName"
                  header-align="center"
                  align="center"
                  label="巡项内容">
                </el-table-column>
                <el-table-column
                  prop="inspectionType"
                  header-align="center"
                  align="center"
                  width="80"
                  label="数据类型">
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
                  label="测量单位">
                </el-table-column>
                <el-table-column
                  prop="exceptionName"
                  header-align="center"
                  align="center"
                  width="80"
                  label="异常等级">
                </el-table-column>
                <el-table-column
                  prop="limits"
                  header-align="center"
                  align="center"
                  width="140"
                  label="上/上上/下/下下">
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
                  prop="orderStatusName"
                  header-align="center"
                  align="center"
                  width="200"
                  label="确认状态">
                </el-table-column>
                <el-table-column
                  prop="confirmedTime"
                  header-align="center"
                  align="center"
                  width="200"
                  label="确认时间">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  header-align="center"
                  align="center"
                  width="150"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.defectiveId,scope.row.id,scope.row.orderStatus)">确认缺陷</el-button>
                   <el-button type="text" size="small" @click="hangup(scope.row.id, scope.row.orderStatus)">挂起</el-button>
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
            </div>
          </div>
        </template>
      </split-pane>
    </div>
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import AddOrUpdate from './orderdefect-add-or-update'
  import splitPane from '@/components/split-pane'
  import depttree from '@/components/dept-tree'
  import TableTreeColumn from '@/components/table-tree-column'
  export default {
    data () {
      return {
        dataForm: {
          deptId: '',
          orderStatus: '',
          startTime: '',
          endTime: ''
        },
        deviceLevelList: [],
        addOrUpdateVisible: false,
        datauserForm: {
          userName: ''
        },
        deptFrom: {
          name: ''
        },
        orderDataForm: {
          defectiveId: '',
          defectiveNumber: '',
          defectiveTheme: '',
          defectiveType: '',
          defectiveTypeName: '',
          deptId: '',
          exceptionId: '',
          exceptionName: '',
          orderContent: '',
          defectiveName: '',
          defectiveNameId: '',
          defectiveNameOpinion: '',
          createTime: '',
          orderStatus: '',
          orderStatusName: '',
          orderConfirmer: '',
          orderConfirmerId: '',
          confirmedTime: '',
          orderConfirmerOpinion: '',
          orderAcceptor: '',
          orderAcceptorId: '',
          requirementTime: '',
          defectiveDevice: ''
        },
        tableHeight: 300,
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 12,
        oldPercent: 12,
        deptList: [],
        startDatePickerTime: this.beginstartDate(),
        dialogFormVisible: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 20,
        limit: 2000,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        viewMediaVisible: false,
        startDatePicker: this.beginDate()
      }
    },
    components: {
      depttree,
      splitPane,
      AddOrUpdate,
      TableTreeColumn
    },
    activated () {
      this.dataForm.startTime = new Date()
      this.dataForm.startTime.setDate(this.dataForm.startTime.getDate() - 7)
      this.getDeptList()
      this.getDataList()
    },
    methods: {
      // 详情页 开始
      beginstartDate () {
        return {
          disabledDate (time) {
            return time.getTime() < Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      handle (username, userid) {
        var userNames = username ? [username] : this.dataListSelections.map(item => {
          return item.username
        })
        var userId = userid ? [userid] : this.dataListSelections.map(item => {
          return item.userId
        })
        if (this.dataListSelections.length >= 2) {
          this.$alert('受理人只能选择一个')
        } else {
          this.orderDataForm.orderAcceptor = userNames.toString()
          this.orderDataForm.orderAcceptorId = userId.toString()
          this.dialogFormVisible = false
        }
      },
      getDeptList () {
        if (this.deptList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/sys/dept/tree'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deptList = data
          })
        }
      },
      // 挂起
      hangup (resultId, orderStatus) {
        if (orderStatus > 0) {
          this.$alert('待确认的才能挂起')
        } else {
          this.$http({
            url: this.$http.adornUrl(`/management/orderdefect/hangup`),
            method: 'get',
            params: this.$http.adornParams({
              'resultId': resultId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      },
      beginDate () {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      ordersearch () {
        this.dataForm.deptId = ''
        this.getDataList()
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
      // 新增 / 修改
      addOrUpdateHandle (defectiveId, id, orderStatus) {
        if (orderStatus === 0 || orderStatus === null) {
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(defectiveId, id)
          })
        } else {
          this.$alert('待确认状态才能确认缺陷')
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
          url: this.$http.adornUrl('/management/orderdefect/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'deptId': this.dataForm.deptId,
            'orderStatus': this.dataForm.orderStatus,
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
      // 导出
      exportToExcel (list) {
        this.dataListLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['巡点名称', '巡项内容', '数据类型', '巡检结果', '测量单位', '异常等级', '上/上上/下/下下', '开始巡检时间', '结束巡检时间', '巡检人', '轮次', '确认状态', '确认时间']
          const filterVal = ['deviceName', 'itemName', 'inspectionType', 'result', 'unit', 'exceptionName', 'limits', 'startTime', 'endTime', 'username', 'turnName', 'orderStatusName', 'confirmedTime']
          const data = this.formatJson(filterVal, list)
          let filename = formatDate(new Date(), 'yyyyMMddhhmmss')
          export_json_to_excel({
            header: tHeader,
            data,
            filename: filename,
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.dataListLoading = false
        })
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 获取数据列表  导出
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
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/management/orderdefect/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'deptId': this.dataForm.deptId,
            'orderStatus': this.dataForm.orderStatus,
            'startTime': startTime,
            'endTime': endTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.exportToExcel(data.page.list)
          } else {
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
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
        return 'height:40px'
      },
      cellStyle () {
        return 'padding:0'
      }
    },
    computed: {
      loginuserName: {
        get () { return this.$store.state.user.name }
      },
      loginuserId: {
        get () { return this.$store.state.user.id }
      },
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

