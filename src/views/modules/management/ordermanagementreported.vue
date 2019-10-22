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
        <el-input v-model="dataForm.orderNumber" size="mini" placeholder="请输入工单编号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.orderName" size="mini" placeholder="请输入工单主题" clearable></el-input>
      </el-form-item>
      <el-form-item  prop="startTime">
        <el-date-picker v-model="dataForm.startTime" size="mini" type="datetime" placeholder="请选择开始时间" value-format="yyyy-MM-dd HH:mm:ss" @change="hangleStartTimeChangStart" :picker-options="startDatePicker" style="width:180px;"></el-date-picker>
      </el-form-item>
      <el-form-item  prop="endTime">
        <el-date-picker v-model="dataForm.endTime" size="mini" type="datetime" placeholder="请选择结束时间" value-format="yyyy-MM-dd HH:mm:ss" @change="handleEndTimeChange" :picker-options="startDatePicker" style="width:180px;"></el-date-picker>
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
          <a href="#"><p  @click=clickRow(scope.row)>{{scope.row.orderNumber}}</p></a>
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
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatusName =='!已受理待上报'" style="color: #5daf34">{{scope.row.orderStatusName}}</span>
          <span v-if="scope.row.orderStatusName !='!已受理待上报'">{{scope.row.orderStatusName}}</span>
        </template>
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
      <!-- 已受理待上报 -->
      <el-dialog
        v-dialog-drag
        :title="orderDataForm.orderNumber ? '工单详情页' : '修改'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogtwovisible">
        <el-form :model="orderDataForm" :rules="dataRule" ref="dataForm"  label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="工单编号" prop="orderNumber">
                {{orderDataForm.orderNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单状态" prop="orderStatusName">
                <!--<el-select v-model="orderDataForm.orderStatus"  :disabled="true">
                  <el-option
                    v-for="item in orderStatusList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>-->
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
              <el-form-item label="缺陷单等级" prop="exceptionName">
                {{orderDataForm.exceptionName}}
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
              <el-form-item label="缺陷操作人" prop="defectiveName">
                {{orderDataForm.defectiveName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="工单操作人" prop="orderApplicant">
                {{orderDataForm.orderApplicant}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单受理人" prop="orderAcceptor">
                {{orderDataForm.orderAcceptor}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="下发时间" prop="createTime">
                {{orderDataForm.createTime}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="要求完成时间" prop="requirementTime">
                {{orderDataForm.requirementTime}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="工单类型" prop="orderTypeName">
            {{orderDataForm.orderTypeName}}
          </el-form-item>
          <el-form-item label="工单主题" prop="orderName">
            {{orderDataForm.orderName}}
          </el-form-item>
          <el-form-item label="工单内容" prop="orderContent">
            {{orderDataForm.orderContent}}
          </el-form-item>
          <el-form-item label="处理结果" prop="processingResult">
            <el-input
              autosize
              type="textarea"
              v-model="orderDataForm.processingResult"></el-input>
          </el-form-item>
          <el-form-item label="是否使用备件">
            <el-switch
              v-model="orderDataForm.value1"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item label="备件" prop="orderDevice" v-if="orderDataForm.value1">
            <el-input
              type="textarea"
              autosize
              v-model="orderDataForm.orderDevice"></el-input>
          </el-form-item>
          <el-form-item label="是否申请延期" >
            <el-switch
              v-model="orderDataForm.value3"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item label="申请延期时间" prop="delayTime" v-if="orderDataForm.value3">
            <el-date-picker v-model="orderDataForm.delayTime" placeholder="申请延期时间" type="datetime" value-format="yyyy-MM-dd HH:00:00"  @change="handleStartTimeChange" :picker-options="startDateDelayPicker" style="width:180px;"></el-date-picker>
          </el-form-item>
          <el-form-item label="工单操作人" prop="orderApplicant" v-if="orderDataForm.value3">
            <el-input v-model="orderDataForm.orderApplicant" readonly></el-input>
          </el-form-item>
          <el-form-item label="审核人"  prop="orderConfirmer" v-if="!orderDataForm.value3">
            <el-input v-model="orderDataForm.orderConfirmer" :disabled="true">
            <span slot="suffix" >
              <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle()" ></a>
            </span>
            </el-input>
            <!--<el-button type="info" @click="clickTitle()" icon="el-icon-plus" circle ></el-button>-->
          </el-form-item>
          <el-form-item v-if="orderDataForm.disPlay =='1'" label="工单操作人意见" prop="orderApplicantOpinion">
            {{orderDataForm.orderApplicantOpinion}}
          </el-form-item>
          <el-dialog v-dialog-drag title="可选择用户列表" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :append-to-body='true'>
            <div style="display: flex;justify-content: space-around;align-items: center;">
              <div style="width:400px;height: 500px;">
                <el-form :model="deptFrom">
                  <el-row>
                    <el-col :span="13">
                      <el-form-item>
                        <el-input v-model="deptFrom.name" placeholder="机构名称" clearable style="width: 180px;"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item>
                        <el-button @click="getdeptDataList()">查询</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <el-table
                  :data="deptdataList"
                  highlight-current-row
                  @current-change="addOrUpdateHandle"
                  style="width: 100%;height: 440px;overflow: scroll;">
                  <el-table-column
                    type="index"
                    header-align="center"
                    align="center"
                    width="80">
                  </el-table-column>
                  <table-tree-column
                    style="width: auto"
                    prop="name"
                    header-align="center"
                    treeKey="deptId"
                    label="机构名称"
                  >
                  </table-tree-column>

                </el-table>
              </div>
              <div style="width:400px;height: 500px;">
                <el-form :inline="true" :model="datauserForm" >
                  <el-row>
                    <el-col :span="8">
                      <el-form-item>
                        <el-input v-model="datauserForm.userName" placeholder="用户名称" clearable style="width: 100px;"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item>
                        <el-button @click="search">查询</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item>
                        <el-button  type="danger" @click="handle()" :disabled="dataListSelections.length <= 0">确定</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5">
                      <el-form-item>
                        <el-button @click="dialogFormVisible = false">取消</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <el-table
                  :data="UserdataList"
                  style="width: 100%;height: 440px;overflow: scroll;"
                  :row-style="rowStyle"
                  @selection-change="selectionChangeHandle"
                >
                  <el-table-column
                    type="selection"
                    header-align="center"
                    align="center"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    type="index"
                    header-align="center"
                    align="center"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop="username"
                    header-align="center"
                    align="center"
                    label="用户名">
                  </el-table-column>
                  <el-table-column
                    prop="deptName"
                    header-align="center"
                    align="center"
                    label="机构名称">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-dialog>
          <el-form-item v-if="orderDataForm.orderConfirmerOpinion != null" label="审核人意见" prop="orderConfirmerOpinion">
            {{orderDataForm.orderConfirmerOpinion}}
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogtwovisible = false">取消</el-button>
        <el-button type="warning" v-if="orderDataForm.value3" @click="reJect()" :disabled="isHttp || orderDataForm.delayTime===null">申请延期</el-button>
        <el-button type="primary" v-if="!orderDataForm.value3" @click="accepTance()" :disabled="isHttp">上报</el-button>
      </span>
      </el-dialog>
      <!-- 申请延期-->
      <el-dialog
        v-dialog-drag 
        :title="orderDataForm.orderNumber ? '工单详情页' : '修改'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogthreevisible">
        <el-form :model="orderDataForm" :rules="dataFormRule" ref="dataForm"  label-width="110px">
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
              <el-form-item label="缺陷等级" prop="exceptionName">
                {{orderDataForm.exceptionName}}
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
              <el-form-item label="缺陷操作人" prop="defectiveName">
                {{orderDataForm.defectiveName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="工单操作人" prop="orderApplicant">
                {{orderDataForm.orderApplicant}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单受理人" prop="orderAcceptor">
                {{orderDataForm.orderAcceptor}}
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
              <el-form-item label="要求完成时间" prop="requirementTime">
                {{orderDataForm.requirementTime}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="工单主题" prop="orderName">
            {{orderDataForm.orderName}}
          </el-form-item>
          <el-form-item label="工单内容" prop="orderContent">
            {{orderDataForm.orderContent}}
          </el-form-item>
          <el-form-item label="处理结果" prop="processingResult">
            {{orderDataForm.processingResult}}
          </el-form-item>
          <el-form-item label="备件" prop="orderDevice" >
            {{orderDataForm.orderDevice}}
          </el-form-item>
          <el-form-item v-if="orderDataForm.delayTime!=null" label="申请时间" prop="delayTime">
            {{orderDataForm.delayTime}}
          </el-form-item>
          <el-form-item label="工单操作人意见" prop="orderApplicantOpinion">
            <el-input v-model="orderDataForm.orderApplicantOpinion"
                      autosize
                      type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogthreevisible = false">取消</el-button>
        <el-button v-if="orderDataForm.orderApplicantId == loginuserId" :disabled="isHttp" type="warning" @click="disagreeDelay()">不同意延期申请</el-button>
        <el-button v-if="orderDataForm.orderApplicantId == loginuserId" :disabled="isHttp" type="primary" @click="agreeDelay()">同意延期申请</el-button>
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
  import { treeDataTranslate } from '@/utils'
  import TableTreeColumn from '@/components/table-tree-column'
  export default {
    data () {
      return {
        isHttp: false,
        dataForm: {
          key: '',
          deptId: '',
          orderNumber: '',
          orderName: '',
          orderStatus: '',
          startTime: null,
          endTime: null
        },
        dialogFormVisible: false,
        dialogthreevisible: false,
        deptdataList: [],
        UserdataList: [],
        deptFrom: {
          name: ''
        },
        datauserForm: {
          userName: ''
        },
        dataListSelections: [],
        deptList: [],
        orderDataForm: {
          value1: true,
          value3: false,
          orderId: 0,
          orderNumber: '',
          defectiveId: '',
          defectiveNumber: '',
          defectiveTheme: '',
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
          orderDevice: '',
          disPlay: 0
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
        currentRow: '',
        limit: 2000,
        totalPage: 0,
        dataListLoading: false,
        addOrUpdateVisible: false,
        startDatePicker: this.beginDate(),
        startDateDelayPicker: this.beginDelayDate(),
        dialogtwovisible: false,
        dataRule: {
          orderConfirmer: [
            {required: true, message: '审核人不能为空', trigger: 'blur'}
          ],
          processingResult: [
            {required: true, message: '处理结果不能为空', trigger: 'blur'}
          ],
          delayTime: [
            {required: true, message: '申请延期时间不能为空', trigger: 'blur'}
          ]
        },
        dataFormRule: {
          orderApplicantOpinion: [
            {required: true, message: '工单操作人意见不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      AddOrUpdate,
      depttree,
      splitPane,
      TableTreeColumn
    },
    activated () {
      this.getDataList()
      this.getDeptList()
      this.getdeptDataList()   // 部门查询
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
      beginDelayDate () {
        return {
          disabledDate (time) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return time.getTime() < date.getTime()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      beginDate () {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      rowStyle () {
        return 'height:40px'
      },
      cellStyle () {
        return 'padding:0'
      },
      // 查询
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

      // 部门查询
      getdeptDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams({'name': this.deptFrom.name})
        }).then(({data}) => {
          this.deptdataList = treeDataTranslate(data, 'deptId')
        })
      },
      // 选中部门 查询用户
      addOrUpdateHandle (val) {
        this.currentRow = val
        var deptId = this.currentRow.deptId
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.limit,
            'username': '',
            'deptId': deptId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.UserdataList = data.page.list
          } else {
            this.UserdataList = []
          }
        })
      },
      search () {
        this.getUserDataList()
      },
      // 查询用户
      getUserDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.limit,
            'username': this.datauserForm.userName,
            'deptId': ''
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.UserdataList = data.page.list
          } else {
            this.UserdataList = []
          }
        })
      },

      handle (username, userid) {
        var userNames = username ? [username] : this.dataListSelections.map(item => {
          return item.username
        })
        var userId = userid ? [userid] : this.dataListSelections.map(item => {
          return item.userId
        })
        if (this.dataListSelections.length >= 2) {
          this.$alert('审核人只能选择一个')
        } else {
          this.orderDataForm.orderConfirmer = userNames.toString()
          this.orderDataForm.orderConfirmerId = userId.toString()
          this.dialogFormVisible = false
        }
      },
      clickTitle () {
        this.dialogFormVisible = true
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      clickRow (row) {
        this.$http({
          url: this.$http.adornUrl('/management/ordermanagementreported/info/' + row.orderId),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.orderDataForm.orderId = data.ordermanagement.orderId
            this.orderDataForm.orderNumber = data.ordermanagement.orderNumber
            this.orderDataForm.defectiveId = data.ordermanagement.defectiveId
            this.orderDataForm.defectiveNumber = data.ordermanagement.defectiveNumber
            this.orderDataForm.defectiveTheme = data.ordermanagement.defectiveTheme
            this.orderDataForm.orderName = data.ordermanagement.orderName
            this.orderDataForm.deptId = data.ordermanagement.deptId
            this.orderDataForm.deptName = data.ordermanagement.deptName
            this.orderDataForm.exceptionId = data.ordermanagement.exceptionId
            this.orderDataForm.exceptionName = data.ordermanagement.exceptionName
            this.orderDataForm.defectiveName = data.ordermanagement.defectiveName
            this.orderDataForm.orderContent = data.ordermanagement.orderContent
            this.orderDataForm.orderApplicant = data.ordermanagement.orderApplicant
            this.orderDataForm.orderApplicantId = data.ordermanagement.orderApplicantId
            this.orderDataForm.orderApplicantOpinion = data.ordermanagement.orderApplicantOpinion
            this.orderDataForm.orderAcceptor = data.ordermanagement.orderAcceptor
            this.orderDataForm.orderAcceptorId = data.ordermanagement.orderAcceptorId
            this.orderDataForm.orderAcceptorOpinion = data.ordermanagement.orderAcceptorOpinion
            this.orderDataForm.orderConfirmer = data.ordermanagement.orderConfirmer
            this.orderDataForm.orderConfirmerId = data.ordermanagement.orderConfirmerId
            this.orderDataForm.orderConfirmerOpinion = data.ordermanagement.orderConfirmerOpinion
            this.orderDataForm.createTime = data.ordermanagement.createTime
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
            this.orderDataForm.disPlay = data.ordermanagement.disPlay
          }
          if (this.orderDataForm.orderStatus === 2 || this.orderDataForm.orderStatus === 7) {
            this.isHttp = false
            this.dialogtwovisible = true
          } else {
            this.orderDataForm.orderApplicantOpinion = null
            this.dialogthreevisible = true
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
      // 已受理待上报状态 提交到 已上报待确认
      accepTance () {
        if (this.orderDataForm.processingResult === '' || this.orderDataForm.processingResult === null) {
          this.$alert('处理结果不能为空')
        } else {
          if (this.orderDataForm.orderConfirmerId !== 0) {
            this.orderDataForm.orderStatus = 3
            this.orderDataForm.delayTime = null
            this.orderConfirm()
          } else {
            this.$alert('审核人不能为空')
          }
        }
      },
      // 延期申请
      reJect () {
        if (this.orderDataForm.processingResult === '' || this.orderDataForm.processingResult === null) {
          this.$alert('处理结果不能为空')
        } else {
          if (this.orderDataForm.delayTime === '' || this.orderDataForm.delayTime === null) {
            this.$alert('申请延期时间不能为空')
          } else {
            this.orderDataForm.orderStatus = 14
            this.orderConfirm()
          }
        }
      },
      orderConfirm () {
        this.isHttp = true
        // 提交
        if (this.orderDataForm.orderAcceptorId === this.loginuserId) {
          this.$http({
            url: this.$http.adornUrl(`/management/ordermanagementreported/orderupdate`),
            method: 'post',
            data: this.$http.adornData({
              'orderId': this.orderDataForm.orderId,
              'orderNumber': this.orderDataForm.orderNumber,
              'defectiveId': this.orderDataForm.defectiveId,
              'defectiveNumber': this.orderDataForm.defectiveNumber,
              'defectiveTheme': this.orderDataForm.defectiveTheme,
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
              'createTime': this.orderDataForm.createTime,
              'requirementTime': this.orderDataForm.requirementTime,
              'confirmedTime': this.orderDataForm.confirmedTime,
              'actualTime': this.orderDataForm.actualTime,
              'delayTime': this.orderDataForm.delayTime,
              'processingResult': this.orderDataForm.processingResult,
              'orderStatus': this.orderDataForm.orderStatus,
              'orderType': this.orderDataForm.orderType,
              'levelId': this.orderDataForm.levelId,
              'orderDevice': this.orderDataForm.orderDevice,
              'disPlay': this.orderDataForm.disPlay
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.dialogtwovisible = false
                  this.$emit('refreshDataList')
                  this.isHttp = false
                }
              })
              this.getDataList()
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$alert('必须由受理用户来操作')
        }
      },
      // 同意延期申请
      agreeDelay () {
        if (this.orderDataForm.orderApplicantOpinion === '' || this.orderDataForm.orderApplicantOpinion === null) {
          this.$alert('工单操作人意见不能为空')
        } else {
          this.orderDataForm.orderStatus = 14
          this.orderDataForm.requirementTime = this.orderDataForm.delayTime
          this.yanqiorderConfirm()
        }
      },
      // 不同意延期申请
      disagreeDelay () {
        if (this.orderDataForm.orderApplicantOpinion === '' || this.orderDataForm.orderApplicantOpinion === null) {
          this.$alert('工单操作人意见不能为空')
        } else {
          this.orderDataForm.orderStatus = 15
          this.yanqiorderConfirm()
        }
      },
      yanqiorderConfirm () {
        this.isHttp = true
        // 提交
        this.$http({
          url: this.$http.adornUrl(`/management/ordermanagementconfirm/orderupdate`),
          method: 'post',
          data: this.$http.adornData({
            'orderId': this.orderDataForm.orderId,
            'orderNumber': this.orderDataForm.orderNumber,
            'defectiveId': this.orderDataForm.defectiveId,
            'defectiveNumber': this.orderDataForm.defectiveNumber,
            'defectiveTheme': this.orderDataForm.defectiveTheme,
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
            'createTime': this.orderDataForm.createTime,
            'requirementTime': this.orderDataForm.requirementTime,
            'confirmedTime': this.orderDataForm.confirmedTime,
            'actualTime': this.orderDataForm.actualTime,
            'delayTime': this.orderDataForm.delayTime,
            'processingResult': this.orderDataForm.processingResult,
            'orderStatus': this.orderDataForm.orderStatus,
            'orderType': this.orderDataForm.orderType,
            'levelId': this.orderDataForm.levelId,
            'orderDevice': this.orderDataForm.orderDevice,
            'disPlay': this.orderDataForm.disPlay
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.dialogthreevisible = false
                this.$emit('refreshDataList')
                this.getDataList()
                this.isHttp = false
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
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
          url: this.$http.adornUrl('/management/ordermanagementreported/list'),
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
      // 获取数据列表  导出
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
          url: this.$http.adornUrl('/management/ordermanagementreported/list'),
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
        let startTime = new Date(this.orderDataForm.requirementTime)
        let endTime = new Date(val)
        let start = formatDate(new Date(), 'yyyy-MM-dd 00:00:00')
        start = new Date(start)
        let end = formatDate(new Date(), 'yyyy-MM-dd 23:00:00')
        end = new Date(end)
        if (val !== null) {
          if (endTime.getTime() >= start.getTime() && endTime.getTime() <= end.getTime()) {
            this.isHttp = false
            this.dataForm.delayTime = val
          } else {
            if (endTime.getTime() < startTime.getTime()) {
              this.$alert('申请延期时间要大于要求完成时间,请重新选择')
              this.isHttp = true
              this.dataForm.delayTime = null
            } else {
              this.isHttp = false
              this.dataForm.delayTime = val
            }
          }
        } else {
          this.isHttp = true
          this.dataForm.delayTime = val
        }
      },
      hangleStartTimeChangStart (val) {
        this.dataForm.startTime = val
      },
      handleEndTimeChange (val) {
        this.dataForm.endTime = val
      },
      handleDeptSelect (val) {
        this.dataForm.deptId = val
        this.getDataList()
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

