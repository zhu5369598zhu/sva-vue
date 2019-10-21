 <template>

   <div class="mod-pda" style="height: 100%;">
     <div class="show-data-content">
       <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
         <template slot="paneL" >
           <div class="show-left" style="height: calc(100% - 18px);">
             <div class="org_title">
               <span v-if="this.isDrawBack===false" style="vertical-align: middle;">机构列表</span ><i :class="drawBackClass" style="float:right;cursor:pointer;" @click="onDrawBack"></i>
             </div>
             <depttree @deptSelectEvent="handleDeptSelect" v-if="this.isDrawBack===false"></depttree>
           </div>
         </template>
         <template slot="paneR">

  <div class="show-data-table">
    <div class="show-data-up" id="data-up">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.orderNumber" placeholder="请输入工单编号" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.orderName" placeholder="请输入工单主题" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item  prop="startTime">
        <el-date-picker v-model="dataForm.startTime" type="datetime" size="mini" placeholder="请选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:180px;"></el-date-picker>
      </el-form-item>
      <el-form-item  prop="endTime">
        <el-date-picker v-model="dataForm.endTime" type="datetime" size="mini" placeholder="请选择结束时间" value-format="yyyy-MM-dd HH:mm:ss" @change="handleEndTimeChange" :picker-options="startDatePicker" style="width:180px;"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()" size="mini">查询</el-button>
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
      highlight-current-row
      :cell-style="cellStyle"
      :row-style="rowStyle"
      style="width: 100%;">
      <el-table-column
        prop="orderId"
        header-align="center"
        align="center"
        width="80"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        header-align="center"
        align="center"
        width="120"
        label="工单编号">
        <template slot-scope="scope">
          <a href="#" style="text-decoration: none;"><p  @click=clickRow(scope.row)>{{scope.row.orderNumber}}</p></a>
        </template>
      </el-table-column>
      <el-table-column
        prop="defectiveNumber"
        header-align="center"
        align="center"
        width="120"
        label="缺陷单编号">
      </el-table-column>
      <el-table-column
        prop="orderTypeName"
        header-align="center"
        align="center"
        width="100"
        label="工单类型">
      </el-table-column>
      <el-table-column
        prop="orderStatusName"
        header-align="center"
        align="center"
        width="100"
        label="工单状态">
      </el-table-column>
      <el-table-column
        prop="orderName"
        header-align="center"
        align="center"
        width="150"
        label="工单主题">
      </el-table-column>
      <el-table-column
        prop="deptName"
        header-align="center"
        align="center"
        width="100"
        label="所属机构">
      </el-table-column>
      <el-table-column
        prop="defectiveName"
        header-align="center"
        align="center"
        width="120"
        label="缺陷操作人">
      </el-table-column>
      <el-table-column
        prop="orderApplicant"
        header-align="center"
        align="center"
        width="120"
        label="工单操作人">
      </el-table-column>
      <el-table-column
        prop="orderAcceptor"
        header-align="center"
        align="center"
        width="120"
        label="工单受理人">
      </el-table-column>
      <el-table-column
        prop="orderConfirmer"
        header-align="center"
        align="center"
        width="120"
        label="工单审核人">
      </el-table-column>
      <el-table-column
        prop="confirmedTime"
        header-align="center"
        align="center"
        label="审核时间">
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
    <!-- 已派单待受理 -->
    <el-dialog
        v-dialog-drag
        :title="orderDataForm.orderNumber ? '工单详情页' : '修改'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogonevisible">
        <el-form :model="orderDataForm" :rules="dataRule" ref="dataForm"  label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="工单编号" prop="orderNumber">
                {{orderDataForm.orderNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单状态" prop="orderStatusName">
                {{orderDataForm.orderStatusName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺陷单编号" prop="defectiveNumber">
                {{orderDataForm.defectiveNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺陷单等级" prop="execptionName">
                {{orderDataForm.execptionName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺陷操作人" prop="defectiveName">
                {{orderDataForm.defectiveName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单操作人" prop="orderApplicant">
                {{orderDataForm.orderApplicant}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="所属机构" prop="deptName">
                {{orderDataForm.deptName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="要求完成时间" prop="requirementTime">
                {{orderDataForm.requirementTime}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="工单类型" prop="orderTypeName">
                {{orderDataForm.orderTypeName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单受理人" prop="orderAcceptor">
                {{orderDataForm.orderAcceptor}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="工单主题" prop="orderName">
            {{orderDataForm.orderName}}
          </el-form-item>
          <el-form-item label="工单内容" prop="orderContent">
            {{orderDataForm.orderContent}}
          </el-form-item>
          <el-form-item label="工单操作人意见" prop="orderApplicantOpinion" label-width="100px">
            {{orderDataForm.orderApplicantOpinion}}
          </el-form-item>
          <el-form-item label="受理人意见" prop="orderAcceptorOpinion">
            <el-input
              autosize
              type="textarea"
              v-model="orderDataForm.orderAcceptorOpinion"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogonevisible = false">取消</el-button>
        <el-button type="warning" :disabled="isHttp" @click="reJect()">拒绝</el-button>
        <el-button type="primary" :disabled="isHttp" @click="accepTance()">受理</el-button>
      </span>
      </el-dialog>


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
  import AddOrUpdate from './ordermanagement-add-or-update'
  import depttree from '@/components/dept-tree'
  import splitPane from '@/components/split-pane'
  export default {
    data () {
      return {
        isHttp: false,
        dataForm: {
          key: '',
          deptId: '',
          orderNumber: '',
          orderName: '',
          orderStatus: '1',
          startTime: null,
          endTime: null
        },
        deptList: [],
        orderDataForm: {
          orderId: 0,
          orderNumber: '',
          defectiveId: '',
          defectiveNumber: '',
          orderName: '',
          deptId: '',
          deptName: '',
          exceptionId: '',
          exceptionName: '',
          defectiveName: '',
          orderContent: '',
          orderApplicant: '',
          orderApplicantId: '',
          orderApplicantOpinion: '',
          orderAcceptor: '',
          orderAcceptorId: '',
          orderAcceptorOpinion: '',
          orderConfirmer: '',
          orderConfirmerId: '',
          orderConfirmerOpinion: '',
          createTime: '',
          requirementTime: '',
          confirmedTime: '',
          actualTime: '',
          delayTime: '',
          processingResult: '',
          orderStatus: '',
          orderStatusName: '',
          orderType: '',
          orderTypeName: '',
          levelId: '',
          orderDevice: ''
        },
        tableHeight: 300,
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 12,
        oldPercent: 12,
        orderStatusList: [
            {id: 0, name: '拟制中'},
            {id: 1, name: '已下发待受理'},
            {id: 2, name: '已受理待上报'},
            {id: 3, name: '已上报待确认'},
            {id: 4, name: '已确认待完结'},
            {id: 5, name: '已完结'}
        ],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        startDatePicker: this.beginDate(),
        dialogonevisible: false,
        dataRule: {
          orderAcceptorOpinion: [
            {required: true, message: '受理人意见不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      AddOrUpdate,
      depttree,
      splitPane
    },
    activated () {
      this.getDataList()
      this.getDeptList()
    },
    computed: {
      loginuserName: {
        get () { return this.$store.state.user.name }
      },
      loginuserId: {
        get () { return this.$store.state.user.id }
      }

    },
    methods: {
      beginDate () {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now() // 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      // 查询
      search () {
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
      clickRow (row) {
        this.$http({
          url: this.$http.adornUrl('/management/ordermanagementalready/info/' + row.orderId),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.orderDataForm.orderId = data.ordermanagement.orderId
            this.orderDataForm.orderNumber = data.ordermanagement.orderNumber
            this.orderDataForm.defectiveId = data.ordermanagement.defectiveId
            this.orderDataForm.defectiveNumber = data.ordermanagement.defectiveNumber
            this.orderDataForm.orderName = data.ordermanagement.orderName
            this.orderDataForm.deptId = data.ordermanagement.deptId
            this.orderDataForm.deptName = data.ordermanagement.deptName
            this.orderDataForm.exceptionId = data.ordermanagement.exceptionId
            this.orderDataForm.execptionName = data.ordermanagement.exceptionName
            this.orderDataForm.defectiveName = data.ordermanagement.defectiveName
            this.orderDataForm.orderContent = data.ordermanagement.orderContent
            this.orderDataForm.orderApplicant = data.ordermanagement.orderApplicant
            this.orderDataForm.orderApplicantId = data.ordermanagement.orderApplicantId
            this.orderDataForm.orderApplicantOpinion = data.ordermanagement.orderApplicantOpinion
            this.orderDataForm.createTime = data.ordermanagement.createTime
            this.orderDataForm.orderAcceptor = data.ordermanagement.orderAcceptor
            this.orderDataForm.orderAcceptorId = data.ordermanagement.orderAcceptorId
            this.orderDataForm.orderAcceptorOpinion = data.ordermanagement.orderAcceptorOpinion
            this.orderDataForm.orderConfirmer = data.ordermanagement.orderConfirmer
            this.orderDataForm.orderConfirmerId = data.ordermanagement.orderConfirmerId
            this.orderDataForm.orderConfirmerOpinion = data.ordermanagement.orderConfirmerOpinion
            this.orderDataForm.requirementTime = data.ordermanagement.requirementTime
            this.orderDataForm.confirmedTime = data.ordermanagement.confirmedTime
            this.orderDataForm.actualTime = data.ordermanagement.actualTime
            this.orderDataForm.delayTime = data.ordermanagement.delayTime
            this.orderDataForm.processingResult = data.ordermanagement.processingResult
            this.orderDataForm.orderStatus = data.ordermanagement.orderStatus
            this.orderDataForm.orderStatusName = data.ordermanagement.orderStatusName
            this.orderDataForm.orderType = data.ordermanagement.orderType
            this.orderDataForm.orderTypeName = data.ordermanagement.orderTypeName
            this.orderDataForm.levelId = data.ordermanagement.levelId
            this.orderDataForm.orderDevice = data.ordermanagement.orderDevice
          }
          if (this.orderDataForm.orderStatus === 1) {
            this.dialogonevisible = true
          }
        })
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
      // 已下发待受理状态 提交到 已受理待上报状态
      accepTance () {
        if (this.orderDataForm.orderAcceptorOpinion === '' || this.orderDataForm.orderAcceptorOpinion === null) {
          this.$alert('受理人意见不能为空')
        } else {
          this.orderDataForm.orderStatus = 2
          this.orderConfirm()
        }
      },
      // 拒绝受理  已代发待受理 提交到 已派单被打回
      reJect () {
        if (this.orderDataForm.orderAcceptorOpinion === '' || this.orderDataForm.orderAcceptorOpinion === null) {
          this.$alert('受理人意见不能为空')
        } else {
          this.orderDataForm.orderStatus = 6
          this.orderConfirm()
        }
      },
      orderConfirm () {
        this.isHttp = true
        // 提交
        if (this.orderDataForm.orderAcceptorId === this.loginuserId) {
          this.$http({
            url: this.$http.adornUrl(`/management/ordermanagementalready/orderupdate`),
            method: 'post',
            data: this.$http.adornData({
              'orderId': this.orderDataForm.orderId,
              'orderNumber': this.orderDataForm.orderNumber,
              'defectiveId': this.orderDataForm.defectiveId,
              'defectiveNumber': this.orderDataForm.defectiveNumber,
              'orderName': this.orderDataForm.orderName,
              'deptId': this.orderDataForm.deptId,
              'exceptionId': this.orderDataForm.exceptionId,
              'defectiveName': this.orderDataForm.defectiveName,
              'orderContent': this.orderDataForm.orderContent,
              'orderApplicant': this.orderDataForm.orderApplicant,
              'orderApplicantId': this.orderDataForm.orderApplicantId,
              'orderApplicantOpinion': this.orderDataForm.orderApplicantOpinion,
              'orderAcceptor': this.orderDataForm.orderAcceptor,
              'orderAcceptorId': this.orderDataForm.orderAcceptorId,
              'orderAcceptorOpinion': this.orderDataForm.orderAcceptorOpinion,
              'orderConfirmer': this.orderDataForm.orderConfirmer,
              'orderConfirmerId': this.orderDataForm.orderConfirmerId,
              'orderConfirmerOpinion': this.orderDataForm.orderConfirmerOpinion,
              'requirementTime': this.orderDataForm.requirementTime,
              'confirmedTime': this.orderDataForm.confirmedTime,
              'actualTime': this.orderDataForm.actualTime,
              'delayTime': this.orderDataForm.delayTime,
              'orderStatus': this.orderDataForm.orderStatus,
              'orderType': this.orderDataForm.orderType,
              'levelId': this.orderDataForm.levelId,
              'orderDevice': this.orderDataForm.orderDevice
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dialogonevisible = false
                  this.$emit('refreshDataList')
                  this.getDataList()
                  this.isHttp = false
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$alert('必须由受理用户来操作')
        }
      },
      // 获取数据列表
      getDataList () {
        let startTime = new Date(this.dataForm.startTime)
        startTime = formatDate(startTime, 'yyyy-MM-dd hh:mm:ss')
        let endTime = new Date(this.dataForm.endTime)
        endTime = formatDate(endTime, 'yyyy-MM-dd hh:mm:ss')
        if (startTime === 'NaN-aN-aN aN:aN:aN' || startTime === '1970-01-01 08:00:00' || null) {
          startTime = ''
        }
        if (endTime === 'NaN-aN-aN aN:aN:aN' || endTime === '1970-01-01 08:00:00' || null) {
          endTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/management/ordermanagementalready/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'deptId': this.dataForm.deptId,
            'orderNumber': this.dataForm.orderNumber,
            'orderName': this.dataForm.orderName,
            'orderStatus': this.dataForm.orderStatus,
            'orderAcceptorId': this.loginuserId,
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
        this.dataListLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['工单编号', '缺陷单编号', '工单类型', '工单状态', '工单主题', '所属机构', '缺陷操作人', '工单操作人', '工单受理人', '工单审核人', '审核时间']
          const filterVal = ['orderNumber', 'defectiveNumber', 'orderTypeName', 'orderStatusName', 'orderName', 'deptName', 'defectiveName', 'orderApplicant', 'orderAcceptor', 'orderConfirmer', 'confirmedTime']
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
      // 获取数据列表 导出
      exportExcelHandle () {
        let startTime = new Date(this.dataForm.startTime)
        startTime = formatDate(startTime, 'yyyy-MM-dd hh:mm:ss')
        let endTime = new Date(this.dataForm.endTime)
        endTime = formatDate(endTime, 'yyyy-MM-dd hh:mm:ss')
        if (startTime === 'NaN-aN-aN aN:aN:aN' || startTime === '1970-01-01 08:00:00' || null) {
          startTime = ''
        }
        if (endTime === 'NaN-aN-aN aN:aN:aN' || endTime === '1970-01-01 08:00:00' || null) {
          endTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/management/ordermanagementalready/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'deptId': this.dataForm.deptId,
            'orderNumber': this.dataForm.orderNumber,
            'orderName': this.dataForm.orderName,
            'orderStatus': this.dataForm.orderStatus,
            'orderAcceptorId': this.loginuserId,
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

      handleStartTimeChange (val) {
        this.dataForm.startTime = val
      },
      handleEndTimeChange (val) {
        this.dataForm.endTime = val
      },
      handleDeptSelect (val) {
        this.dataForm.deptId = val
        this.getDataList()
      },
      rowStyle ({row, rowIndex}) {
        return 'height:40px'
      },
      cellStyle () {
        return 'padding:0'
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
      }
    },
    mounted: function () {
      this.dataForm.orderNumber = this.$route.params.orderNumber
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

