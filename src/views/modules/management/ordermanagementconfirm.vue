 <template>

   <div class="mod-pda">
     <div class="show-data-content">
       <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
         <template slot="paneL" >
           <div class="show-left">
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
        <!--<el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>-->
        工单列表
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.orderNumber" placeholder="请输入工单编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.orderName" placeholder="请输入工单主题" clearable></el-input>
      </el-form-item>
      <el-form-item  prop="startTime">
        <el-date-picker v-model="dataForm.startTime" type="datetime" placeholder="请选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:180px;"></el-date-picker>
      </el-form-item>
      <el-form-item  prop="endTime">
        <el-date-picker v-model="dataForm.endTime" type="datetime" placeholder="请选择结束时间" value-format="yyyy-MM-dd HH:mm:ss" @change="handleEndTimeChange" :picker-options="startDatePicker" style="width:180px;"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()">查询</el-button>
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
      highlight-current-row
      :cell-style="cellStyle"
      :row-style="rowStyle"
      style="width: 100%;">
      <el-table-column
        prop="orderId"
        header-align="center"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        header-align="center"
        align="center"
        label="工单编号">
        <template slot-scope="scope">
          <a href="#"><p  @click=clickRow(scope.row)>{{scope.row.orderNumber}}</p></a>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderName"
        header-align="center"
        align="center"
        label="工单主题">
      </el-table-column>
      <el-table-column
        prop="deptName"
        header-align="center"
        align="center"
        label="所属机构">
      </el-table-column>
      <el-table-column
        prop="defectiveName"
        header-align="center"
        align="center"
        label="缺陷确认人(填报)人">
      </el-table-column>
      <el-table-column
        prop="orderConfirmer"
        header-align="center"
        align="center"
        label="工单确认人">
      </el-table-column>
      <el-table-column
        prop="confirmedTime"
        header-align="center"
        align="center"
        label="确认时间">
      </el-table-column>
      <el-table-column
        prop="orderStatusName"
        header-align="center"
        align="center"
        label="工单状态">
      </el-table-column>
      <el-table-column
        prop="orderAcceptor"
        header-align="center"
        align="center"
        label="工单受理人">
      </el-table-column>
      <el-table-column
        prop="defectiveNumber"
        header-align="center"
        align="center"
        label="缺陷单编号">
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
    <div class="show-data-down" >
      <div class="new_1" id="did_3" style="display: none">
      <el-form :inline="true" :model="orderDataForm" label-width="80px;">
      <!--  拟制中 -->
        <h5> 工单详情</h5>
      <div class="div-a">
        <el-form-item label="工单编号" prop="orderNumber">
          <el-input v-model="orderDataForm.orderNumber"></el-input>
        </el-form-item>
        <el-form-item label="工单状态" prop="orderStatus">
          <el-select v-model="orderDataForm.orderStatus"  >
            <el-option
              v-for="item in orderStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷单编号" prop="defectiveNumber">
          <el-input v-model="orderDataForm.defectiveNumber"></el-input>
        </el-form-item>
        <el-form-item label="下发时间" prop="createTime">
          <el-input v-model="orderDataForm.createTime"></el-input>
        </el-form-item>
        <el-form-item label="要求完成时间" prop="requirementTime">
          <el-input v-model="orderDataForm.requirementTime"></el-input>
        </el-form-item>
      </div>
      <div class="div-b">
        <el-form-item label="所属机构" prop="deptId">
          <el-select v-model="orderDataForm.deptId" placeholder="所属机构" clearable
          >
            <el-option
              v-for="item in deptList"
              :key="item.deptId"
              :label="item.name"
              :value="item.deptId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单类型" prop="orderTypeName">
          <el-input v-model="orderDataForm.orderTypeName"></el-input>
        </el-form-item>


        <el-form-item label="缺陷等级" prop="exceptionName">
          <el-input v-model="orderDataForm.exceptionName"></el-input>
        </el-form-item>
        <el-form-item label="缺陷操作人" prop="defectiveName">
          <el-input v-model="orderDataForm.defectiveName"></el-input>
        </el-form-item>
        <el-form-item label="工单受理人" prop="orderAcceptor">
          <el-input v-model="orderDataForm.orderAcceptor"></el-input>
        </el-form-item>

      </div>
      <div class="div-c">
        <el-form-item label="工单主题" prop="orderName">
          <el-input v-model="orderDataForm.orderName"></el-input>
        </el-form-item>
        <el-form-item label="处理结果" prop="processingResult">
          <el-input
            :rows="6"
            type="textarea"
            v-model="orderDataForm.processingResult"></el-input>
        </el-form-item>

      </div>
      <div class="div-d">

        <el-form-item label="是否使用备件">
          <el-switch
            v-model="orderDataForm.value1"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
        <el-form-item label="备件" prop="orderDevice" v-if="orderDataForm.value1">
          <el-input v-model="orderDataForm.orderDevice"></el-input>
        </el-form-item>
        <el-form-item label="结论" prop="orderAcceptorOpinion">
          <el-input
            :rows="3"
            type="textarea"
            v-model="orderDataForm.orderAcceptorOpinion"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="reJect()">打回</el-button>
          <el-button type="primary" @click="accepTance()">确认</el-button>
        </el-form-item>

      </div>
      </el-form>
    </div>

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
        dataForm: {
          key: '',
          deptId: '',
          orderNumber: '',
          orderName: '',
          orderStatus: '3',
          startTime: null,
          endTime: null
        },
        deptList: [],
        orderDataForm: {
          value1: true,
          orderId: 0,
          orderNumber: '',
          defectiveId: '',
          defectiveNumber: '',
          orderName: '',
          deptId: '',
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
        startDatePicker: this.beginDate()
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
            return time.getTime() > Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      // 查询
      search () {
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
      clickRow (row) {
        this.$http({
          url: this.$http.adornUrl('/management/ordermanagementconfirm/info/' + row.orderId),
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
            this.orderDataForm.exceptionId = data.ordermanagement.exceptionId
            this.orderDataForm.exceptionName = data.ordermanagement.exceptionName
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
            this.orderDataForm.orderType = data.ordermanagement.orderType
            this.orderDataForm.orderTypeName = data.ordermanagement.orderTypeName
            this.orderDataForm.levelId = data.ordermanagement.levelId
            this.orderDataForm.orderDevice = data.ordermanagement.orderDevice
          }
          var downup = document.getElementById('data-up')
          downup.style.height = '350px'
          downup.style.overflowY = 'scroll'
          if (this.orderDataForm.orderStatus === 0) {
            var dom = document.getElementById('did')
            dom.style.display = 'block'
          } else if (this.orderDataForm.orderStatus === 1) {
            var dom1 = document.getElementById('did_1')
            dom1.style.display = 'block'
          } else if (this.orderDataForm.orderStatus === 2) {
            var dom2 = document.getElementById('did_2')
            dom2.style.display = 'block'
          } else if (this.orderDataForm.orderStatus === 3) {
            var dom3 = document.getElementById('did_3')
            dom3.style.display = 'block'
          } else if (this.orderDataForm.orderStatus === 4) {
            var dom4 = document.getElementById('did_4')
            dom4.style.display = 'block'
          } else if (this.orderDataForm.orderStatus === 5) {
            var dom5 = document.getElementById('did_5')
            dom5.style.display = 'block'
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
      // 已上报待确认 提交到 已确认待完结
      accepTance () {
        this.orderDataForm.orderStatus = 4
        this.orderConfirm()
      },
      // 已上报待确认 =》已上报被打回
      reJect () {
        this.orderDataForm.orderStatus = 7
        this.orderConfirm()
      },
      orderConfirm () {
        // 提交
        if (this.orderDataForm.orderConfirmerId === this.loginuserId) {
          this.$http({
            url: this.$http.adornUrl(`/management/ordermanagementconfirm/orderupdate`),
            method: 'post',
            data: this.$http.adornData({
              'orderId': this.orderDataForm.orderId,
              'orderNumber': this.orderDataForm.orderNumber,
              'defectiveId': this.orderDataForm.defectiveId,
              'defectiveNumber': this.orderDataForm.defectiveNumber,
              'orderName': this.orderDataForm.orderName,
              'deptId': this.orderDataForm.deptId,
              'exceptionId': this.orderDataForm.exceptionId,
              'exceptionName': this.orderDataForm.exceptionName,
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
              'processingResult': this.orderDataForm.processingResult,
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
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
              var dom = document.getElementById('did_3')
              dom.style.display = 'none'
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$alert('必须由确认人来操作')
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
          url: this.$http.adornUrl('/management/ordermanagementconfirm/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'deptId': this.dataForm.deptId,
            'orderNumber': this.dataForm.orderNumber,
            'orderName': this.dataForm.orderName,
            'orderStatus': this.dataForm.orderStatus,
            'orderConfirmerId': this.loginuserId,
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
          const tHeader = ['工单编号', '工单主题', '所属机构', '缺陷确认人(填报人)', '工单确认人', '确认时间', '工单状态', '工单受理人', '缺陷单编号']
          const filterVal = ['orderNumber', 'orderName', 'deptName', 'defectiveName', 'orderConfirmer', 'confirmedTime', 'orderStatusName', 'orderAcceptor', 'defectiveNumber']
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
          url: this.$http.adornUrl('/management/ordermanagementconfirm/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'deptId': this.dataForm.deptId,
            'orderNumber': this.dataForm.orderNumber,
            'orderName': this.dataForm.orderName,
            'orderStatus': this.dataForm.orderStatus,
            'orderConfirmerId': this.loginuserId,
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

 <style>
   .up {
     float: top;
   }
   .show-data-up{
     position: absolute;
     margin: 0px auto;
     /*height: 400px;*/
     z-index: 20;
     width: 98%;
   }
   .site-content .show-data-down {
     height: 300px;
     margin-left: 10px;
     margin-top: 10px;
     overflow: hidden;
     bottom: 0px;
   }
   .show-data-down{
     position: absolute;
     z-index: 10;
     left: 20px;
     width: 100%;
     margin: 0px auto;
     /*height: 200px;*/
     bottom: 0px;
   }
   .div-a{ float:left;width:24%;height: 100%;}
   .div-b{ float:left;width:24%;height: 100%;}
   .div-c{ float:left;width:28%;height: 100%;}
   .div-d{ float:left;width:24%;height: 100%;}
 </style>
