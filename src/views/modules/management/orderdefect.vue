<template>
  <div class="mod-orderdefect" style="height: 100%;">
    <div class="show-data-content">
      <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
        <template slot="paneL" >
          <div class="show-left" style="height: calc(100% - 18px);">
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
                <el-form-item>
                  <el-input v-model="dataForm.defectiveNumber" size="mini" placeholder="请输入缺陷单编号"  clearable></el-input>
                </el-form-item>
                <el-form-item label="缺陷确认状态:" prop="orderStatus">
                  <el-select v-model="dataForm.orderStatus" placeholder="请选择" clearable style="width:100px;" size="mini">
                    <el-option label="待确认" value="0"></el-option>
                    <el-option label="已确认" value="1"></el-option>
                    <el-option label="已挂起" value="2"></el-option>
                    <el-option label="转工单被拒绝" value="3"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="巡检时间从:" prop="startTime">
                  <el-date-picker v-model="dataForm.startTime" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:140px;" size="mini"></el-date-picker>
                </el-form-item>
                <el-form-item label="到:" prop="endTime">
                  <el-date-picker v-model="dataForm.endTime" type="date" value-format="yyyy-MM-dd 00:00:00" @change="handleEndTimeChange" :picker-options="startDatePicker" style="width:140px;" size="mini"></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button @click="ordersearch()" size="mini">查询</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button @click="exportExcelHandle()" size="mini">导出</el-button>
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
                  align="center"
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
                  label="巡点名称">
                  <template slot-scope="scope">
                    <a href="#"><span v-if="scope.row.hangUp!=''"  @click=clickHangup(scope.row)>{{scope.row.deviceName}}</span></a>
                    <span v-if="scope.row.hangUp ===''">{{scope.row.deviceName}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="defectiveNumber"
                  header-align="center"
                  align="center"
                  width="120"
                  label="缺陷单编号">
                  <template slot-scope="scope">
                    <a href="#" style="text-decoration: none;" @click="clickRow(scope.row)"><span  >{{scope.row.defectiveNumber}}</span></a>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="itemName"
                  header-align="center"
                  align="center"
                  width="140"
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
                  width="100"
                  label="巡检结果">
                </el-table-column>
                <el-table-column
                  prop="orderStatusName"
                  header-align="center"
                  align="center"
                  width="100"
                  label="确认状态">
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
                    <el-button type="text" size="mini" :disabled="scope.row.orderStatus!='0' && scope.row.orderStatus!='3'" @click="addOrUpdateHandle(scope.row.defectiveId,scope.row.id,scope.row.orderStatus)">确认缺陷</el-button>
                   <el-button type="text" size="mini"  :disabled="scope.row.orderStatus!='0' && scope.row.orderStatus!='3'" @click="hangup(scope.row)">挂起</el-button>
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
              <el-dialog
                v-dialog-drag
                :title="!this.orderDataForm.defectiveId ? '缺陷详情页' : '确认缺陷页'"
                :append-to-body='true'
                :visible.sync="defectivevisible"
                >
                <el-form :model="orderDataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="巡检缺陷单编号" prop="defectiveNumber">
                        <el-input size="mini" v-model="orderDataForm.defectiveNumber" readonly />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="缺陷异常等级" prop="exceptionName">
                        <el-input size="mini" v-model="orderDataForm.exceptionName" readonly />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="巡检缺陷单主题" prop="defectiveTheme">
                    <el-input size="mini" v-model="orderDataForm.defectiveTheme" readonly />
                  </el-form-item>
                  <el-form-item label="所属机构" prop="deptName">
                    <el-input size="mini" v-model="orderDataForm.deptName" readonly />
                  </el-form-item>
                  <el-form-item label="巡检缺陷单内容" prop="orderContent">
                    <el-input size="mini" v-model="orderDataForm.orderContent" readonly />
                  </el-form-item>
                  <el-form-item label="缺陷操作人"  prop="defectiveName">
                    <el-input size="mini" v-model="orderDataForm.defectiveName" readonly />
                  </el-form-item>
                  <el-form-item label="缺陷操作人意见"  prop="defectiveNameOpinion">
                    <el-input size="mini" v-model="orderDataForm.defectiveNameOpinion" readonly />
                  </el-form-item>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item
                        label="要求完成时间"
                        prop="requirementTime"
                      >
                        <el-input size="mini" v-model="orderDataForm.requirementTime" readonly />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item
                        label="工单操作人"
                        prop="orderConfirmer">
                        <el-input size="mini" v-model="orderDataForm.orderConfirmer" readonly />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-dialog>
              <el-dialog
                v-dialog-drag
                :title="!this.orderDataForm.hangUp ? '挂起原因' : '挂起原因'"
                :visible.sync="dialoghangupvisible"
                :append-to-body='true'>
                <el-form :model="orderDataForm" ref="orderDataForm" label-width="80px">
                  <el-form-item label="挂起原因" prop="hangUp" >
                    <el-input  size="mini" v-model="orderDataForm.hangUp" placeholder="请输入挂起原因"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialoghangupvisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogHangup()">确定</el-button>
                  </span>
              </el-dialog>
              <el-dialog
                v-dialog-drag
                :title="!this.hangUpFrom.hangUp ? '挂起原因' : '挂起原因'"
                :visible.sync="dialogUpdatehangUpvisible"
                :append-to-body='true'>
                <el-form :model="hangUpFrom" ref="hangUpFrom" label-width="80px">
                  <el-form-item label="挂起原因" prop="hangUp" >
                    <el-input size="mini" v-model="hangUpFrom.hangUp" />
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogUpdatehangUpvisible = false">取消</el-button>
                </span>
              </el-dialog>
              <!-- 转工单被拒绝 详情页 -->
              <el-dialog
                v-dialog-drag
                :title="!this.orderDataForm.defectiveId ? '缺陷详情页' : '确认缺陷页'"
                :append-to-body='true'
                :visible.sync="defectiverejectvisible"
              >
                <el-form :model="orderDataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="巡检缺陷单编号" prop="defectiveNumber">
                        <el-input size="mini" v-model="orderDataForm.defectiveNumber" readonly />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="缺陷异常等级" prop="exceptionName">
                        <el-input size="mini" v-model="orderDataForm.exceptionName" readonly />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="巡检缺陷单主题" prop="defectiveTheme">
                    <el-input size="mini" v-model="orderDataForm.defectiveTheme" readonly />
                  </el-form-item>
                  <el-form-item label="所属机构" prop="deptName">
                    <el-input size="mini" v-model="orderDataForm.deptName" readonly />
                  </el-form-item>
                  <el-form-item label="巡检缺陷单内容" prop="orderContent">
                    <el-input size="mini" v-model="orderDataForm.orderContent" readonly />
                  </el-form-item>
                  <el-form-item label="缺陷操作人"  prop="defectiveName">
                    <el-input size="mini" v-model="orderDataForm.defectiveName" readonly />
                  </el-form-item>
                  <el-form-item label="缺陷操作人意见"  prop="defectiveNameOpinion">
                    <el-input size="mini" v-model="orderDataForm.defectiveNameOpinion" readonly />
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="defectiverejectvisible = false">取消</el-button>
                  </span>
              </el-dialog>
              <!-- 弹窗, 新增 / 修改 -->
              <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
              <!-- 已转单被拒绝-->
              <add-or-updaterejcet v-if="addOrUpdateVisible" ref="AddOrUpdaterejcet" @refreshDataList="getDataList"></add-or-updaterejcet>
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
  import AddOrUpdaterejcet from './orderdefectreject-add-or-update'
  import splitPane from '@/components/split-pane'
  import depttree from '@/components/dept-tree'
  import TableTreeColumn from '@/components/table-tree-column'
  export default {
    data () {
      return {
        dataForm: {
          deptId: '',
          defectiveNumber: '',
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
        hangUpFrom: {
          hangUp: ''
        },
        dialogUpdatehangUpvisible: false,
        orderDataForm: {
          hangUp: '',
          defectiveId: '',
          defectiveNumber: '',
          defectiveTheme: '',
          defectiveType: '',
          defectiveTypeName: '',
          deptId: '',
          deptName: '',
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
          defectiveDevice: '',
          defectiveHangup: '',
          resultId: ''
        },
        defectivevisible: false,
        defectiverejectvisible: false,
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
        startDatePicker: this.beginDate(),
        dialoghangupvisible: false
      }
    },
    components: {
      depttree,
      splitPane,
      AddOrUpdate,
      AddOrUpdaterejcet,
      TableTreeColumn
    },
    activated () {
      // 接收前端传过来的数据
      this.dataForm.defectiveNumber = this.$route.params.defectiveNumber
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
      hangup (row) {
        if (row.orderStatus > 0 && row.orderStatus < 3) {
          this.$alert('待确认的才能挂起')
        } else {
          this.orderDataForm.defectiveId = row.defectiveId
          this.orderDataForm.resultId = row.id
          this.dialoghangupvisible = true
        }
      },
      // 挂起
      dialogHangup () {
        if (this.orderDataForm.hangUp === '') {
          this.$alert('挂起原因不能为空')
        } else {
          this.$http({
            url: this.$http.adornUrl(`/management/orderdefect/hangup`),
            method: 'get',
            params: this.$http.adornParams({
              'resultId': this.orderDataForm.resultId,
              'hangup': this.orderDataForm.hangUp
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                  this.orderDataForm.hangUp = ''
                  this.dialoghangupvisible = false
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      },
      // 挂起原因
      clickHangup (row) {
        this.dialogUpdatehangUpvisible = true
        this.hangUpFrom.hangUp = row.hangUp
      },
      beginDate () {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      ordersearch () {
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
      addOrUpdateHandle (defectiveId, id, deviceId,orderStatus) {
        if (orderStatus === 0 || orderStatus === null || orderStatus === undefined) {
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(defectiveId, id, deviceId)
          })
        } else if (orderStatus === 3) { // 已转单被拒绝的情况
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.AddOrUpdaterejcet.init(defectiveId, id)
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
            'defectiveNumber': this.dataForm.defectiveNumber,
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
      clickRow (row) {
        this.$http({
          url: this.$http.adornUrl(`/management/orderdefective/info/` + row.defectiveId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.orderDataForm.defectiveNumber = data.orderdefective.defectiveNumber
            this.orderDataForm.defectiveTheme = data.orderdefective.defectiveTheme
            this.orderDataForm.defectiveType = data.orderdefective.defectiveType
            this.orderDataForm.deptId = data.orderdefective.deptId
            this.orderDataForm.deptName = data.orderdefective.deptName
            this.orderDataForm.exceptionId = data.orderdefective.exceptionId
            this.orderDataForm.exceptionName = data.orderdefective.exceptionName
            this.orderDataForm.orderContent = data.orderdefective.orderContent
            this.orderDataForm.defectiveName = data.orderdefective.defectiveName
            this.orderDataForm.defectiveNameId = data.orderdefective.defectiveNameId
            this.orderDataForm.defectiveNameOpinion = data.orderdefective.defectiveNameOpinion
            this.orderDataForm.createTime = data.orderdefective.createTime
            this.orderDataForm.orderStatus = data.orderdefective.orderStatus
            this.orderDataForm.orderConfirmer = data.orderdefective.orderConfirmer
            this.orderDataForm.orderConfirmerId = data.orderdefective.orderConfirmerId
            this.orderDataForm.confirmedTime = data.orderdefective.confirmedTime
            this.orderDataForm.orderConfirmerOpinion = data.orderdefective.orderConfirmerOpinion
            this.orderDataForm.defectiveDevice = data.orderdefective.defectiveDevice
            this.orderDataForm.resultId = data.orderdefective.resultId
            this.orderDataForm.requirementTime = data.orderdefective.requirementTime
            this.orderDataForm.defectivevisible = true
          }
          console.log(this.orderDataForm.orderStatus)
          if (this.orderDataForm.orderStatus === 3) {
            this.defectiverejectvisible = true
          } else {
            this.defectivevisible = true
          }
        })
      },
      // 导出
      exportToExcel (list) {
        this.dataListLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['巡点名称', '缺陷单编号', '巡项内容', '数据类型', '巡检结果', '确认状态', '测量单位', '异常等级', '上/上上/下/下下', '开始巡检时间', '结束巡检时间', '巡检人', '轮次', '确认时间']
          const filterVal = ['deviceName', 'defectiveNumber', 'itemName', 'inspectionType', 'result', 'orderStatusName', 'unit', 'exceptionName', 'limits', 'startTime', 'endTime', 'username', 'turnName', 'confirmedTime']
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
<style scoped="">
  @media screen and (max-width: 1360px){
    .el-tab-pane .el-table{
      height: calc(100vh - 273px) !important;
    }
  }
</style>

