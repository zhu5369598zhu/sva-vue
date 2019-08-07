<template>

  <div class="mod-item"><!-- mod-pda-->
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
  <div  class="show-data-table">
    <div class="show-data-up" id="data-up">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
        <el-form-item>
          <el-input v-model="dataForm.defectiveNumber" placeholder="请输入缺陷单编号"  clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.defectiveTheme" placeholder="请输入缺陷单主题" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.exceptionId" placeholder="缺陷等级" style="width: 100px" clearable>
            <el-option v-for="item in dataExceptionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item>
          <el-input v-model="dataForm.defectiveName" placeholder="请输入填报人" clearable></el-input>
        </el-form-item>-->
        <el-form-item>
          <el-button @click="search()">查询</el-button>
          <!--<el-button v-if="isAuth('management:orderdefective:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-if="isAuth('management:orderdefective:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
        </el-form-item>
        <el-form-item>
          <el-button @click="exportExcelHandle()">导出</el-button>
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
        <!--<el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="30">
        </el-table-column>-->
        <el-table-column
          header-align="center"
          type="index"
          align="center"
          width="50"
          lable="">
        </el-table-column>
        <el-table-column
          prop="defectiveNumber"
          header-align="center"
          align="center"
          width="120"
          label="缺陷单编号">
          <template slot-scope="scope">
            <a href="#" style="text-decoration: none;" @click="clickRow(scope.row)"><p  >{{scope.row.defectiveNumber}}</p></a>
          </template>
        </el-table-column>
        <el-table-column
          prop="defectiveTheme"
          header-align="center"
          align="center"
          label="缺陷单主题">
        </el-table-column>
        <el-table-column
          prop="defectiveTypeName"
          header-align="center"
          align="center"
          label="缺陷类型">
        </el-table-column>
        <el-table-column
          prop="deptName"
          header-align="center"
          align="center"
          label="所属机构">
        </el-table-column>
        <el-table-column
          prop="exceptionName"
          header-align="center"
          align="center"
          label="缺陷等级">
        </el-table-column>
        <!--<el-table-column
          prop="defectiveName"
          header-align="center"
          align="center"
          label="缺陷填报人">
        </el-table-column>
        <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          label="填报时间">
        </el-table-column>-->
        <el-table-column
          prop="orderStatusName"
          header-align="center"
          align="center"
          label="转工单状态">
        </el-table-column>
        <el-table-column
          prop="orderConfirmer"
          header-align="center"
          align="center"
          label="工单操作人">
        </el-table-column>
        <el-table-column
          prop="confirmedTime"
          header-align="center"
          align="center"
          label="工单确认时间">
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
      <!-- 填报缺陷拟制中状态的 dialog -->
      <el-dialog
        :title="orderDataForm.orderNumber ? '缺陷单详情' : '缺陷单详情'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogzerovisible">
        <el-form :model="orderDataForm"  ref="dataForm"  label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺陷单编号" prop="defectiveNumber">
                {{orderDataForm.defectiveNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺陷类型" prop="defectiveTypeName">
                {{orderDataForm.defectiveTypeName}}
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
              <el-form-item label="缺陷等级" prop="exceptionName">
                {{orderDataForm.exceptionName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺陷填报人" prop="defectiveName">
                {{orderDataForm.defectiveName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺陷填报时间" prop="createTime">
                {{orderDataForm.createTime}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="归属设备" prop="defectiveDevice">
            {{orderDataForm.defectiveDevice}}
          </el-form-item>

          <el-form-item label="缺陷单主题" prop="defectiveTheme">
            {{orderDataForm.defectiveTheme}}
          </el-form-item>
          <el-form-item label="缺陷单内容" prop="orderContent">
            {{orderDataForm.orderContent}}
          </el-form-item>
          <el-form-item label="缺陷填报人意见" prop="defectiveNameOpinion">
            {{orderDataForm.defectiveNameOpinion}}
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogzerovisible = false">取消</el-button>
      </span>
      </el-dialog>
      <!-- 填报缺陷已确认待派单 dialog -->
      <el-dialog
        :title="orderDataForm.orderNumber ? '缺陷单详情' : '缺陷单详情'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogonevisible">
        <el-form :model="orderDataForm" :rules="dataRule" ref="dataForm"  label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺陷单编号" prop="defectiveNumber">
                {{orderDataForm.defectiveNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="转工单状态" prop="orderStatusName">
                {{orderDataForm.orderStatusName}}
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
              <el-form-item label="缺陷类型" prop="defectiveTypeName">
                {{orderDataForm.defectiveTypeName}}
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
              <el-form-item label="缺陷确认时间" prop="createTime">
                {{orderDataForm.createTime}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="缺陷等级" prop="exceptionName">
            {{orderDataForm.exceptionName}}
          </el-form-item>
          <el-form-item label="缺陷单主题" prop="defectiveTheme">
            {{orderDataForm.defectiveTheme}}
          </el-form-item>
          <el-form-item label="缺陷单内容" prop="orderContent">
            {{orderDataForm.orderContent}}
          </el-form-item>
          <el-form-item label="缺陷填报人意见" prop="defectiveNameOpinion">
            {{orderDataForm.defectiveNameOpinion}}
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogonevisible = false">取消</el-button>
      </span>
      </el-dialog>
      <!-- 填报缺陷已转单 -->
      <el-dialog
        :title="orderDataForm.orderNumber ? '缺陷单详情' : '缺陷单详情'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogtwovisible">
        <el-form :model="orderDataForm"  ref="dataForm"  label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺陷单编号" prop="defectiveNumber" >
                {{orderDataForm.defectiveNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="转工单状态" prop="orderStatusName">
                {{orderDataForm.orderStatusName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺陷类型" prop="defectiveTypeName">
                {{orderDataForm.defectiveTypeName}}
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
              <el-form-item label="缺陷填报人" prop="defectiveName">
                {{orderDataForm.defectiveName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺陷确认时间" prop="createTime">
                {{orderDataForm.createTime}}
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
          <el-form-item label="工单确认时间" prop="confirmedTime">
            {{orderDataForm.confirmedTime}}
          </el-form-item>
          </el-col>
          </el-row>
          <el-form-item label="缺陷单主题" prop="defectiveTheme">
            {{orderDataForm.defectiveTheme}}
          </el-form-item>
          <el-form-item label="缺陷单内容" prop="orderContent">
            {{orderDataForm.orderContent}}
          </el-form-item>
          <el-form-item label="缺陷填报人意见" prop="defectiveNameOpinion">
            {{orderDataForm.defectiveNameOpinion}}
          </el-form-item>
          <el-form-item label="工单操作人" prop="orderConfirmer">
            {{orderDataForm.orderConfirmer}}
          </el-form-item>
          <el-form-item label="要求完成时间" prop="requirementTime">
            {{orderDataForm.requirementTime}}
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogtwovisible = false">取消</el-button>
      </span>
      </el-dialog>
      <!-- 填报缺陷转单被拒绝 -->
      <el-dialog
        :title="orderDataForm.orderNumber ? '缺陷单详情' : '缺陷单详情'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogThreevisible">
        <el-form :model="orderDataForm"  ref="dataForm"  label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺陷单编号" prop="defectiveNumber">
                {{orderDataForm.defectiveNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺陷类型" prop="defectiveTypeName">
                {{orderDataForm.defectiveTypeName}}
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
              <el-form-item label="缺陷等级" prop="exceptionName">
                {{orderDataForm.exceptionName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺陷填报人" prop="defectiveName">
                {{orderDataForm.defectiveName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺陷填报时间" prop="createTime">
                {{orderDataForm.createTime}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="归属设备" prop="defectiveDevice">
            {{orderDataForm.defectiveDevice}}
          </el-form-item>

          <el-form-item label="缺陷单主题" prop="defectiveTheme">
            {{orderDataForm.defectiveTheme}}
          </el-form-item>
          <el-form-item label="缺陷单内容" prop="orderContent">
            {{orderDataForm.orderContent}}
          </el-form-item>
          <el-form-item label="缺陷填报人意见" prop="defectiveNameOpinion">
            {{orderDataForm.defectiveNameOpinion}}
          </el-form-item>
          <el-form-item  label="工单操作人意见" prop="orderConfirmerOpinion">
            {{orderDataForm.orderConfirmerOpinion}}
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogThreevisible = false">取消</el-button>
      </span>
      </el-dialog>
      <!-- 巡检异常 已确认派单-->
      <el-dialog
        :title="!this.orderDataForm.defectiveId ? '缺陷详情页' : '缺陷详情页'"
        :append-to-body='true'
        :visible.sync="dialogFourvisible"
      >
        <el-form :model="orderDataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="缺陷单编号" prop="defectiveNumber">
                {{orderDataForm.defectiveNumber}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺陷类型" prop="defectiveTypeName">
                {{orderDataForm.defectiveTypeName}}
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
              <el-form-item label="缺陷异常等级" prop="exceptionName">
                {{orderDataForm.exceptionName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="巡检缺陷单主题" prop="defectiveTheme">
            {{orderDataForm.defectiveTheme}}
          </el-form-item>
          <el-form-item label="巡检缺陷单内容" prop="orderContent">
            {{orderDataForm.orderContent}}
          </el-form-item>
          <el-form-item label="缺陷操作人" prop="defectiveName">
            {{orderDataForm.defectiveName}}
          </el-form-item>
          <el-form-item label="缺陷操作人意见" prop="defectiveNameOpinion">
            {{orderDataForm.defectiveNameOpinion}}
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="要求完成时间"
                prop="requirementTime"
              >
                {{orderDataForm.requirementTime}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="工单操作人"
                prop="orderConfirmer">
                {{orderDataForm.orderConfirmer}}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFourvisible = false">取消</el-button>
      </span>
      </el-dialog>
      <!-- 巡检异常 已转单被拒绝-->
      <el-dialog
        :title="!this.orderDataForm.defectiveId ? '缺陷详情页' : '确认缺陷页'"
        :append-to-body='true'
        :visible.sync="dialogFivevisible"
      >
        <el-form :model="orderDataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
          <el-form-item label="巡检缺陷单编号" prop="defectiveNumber">
            {{orderDataForm.defectiveNumber}}
          </el-form-item>
          <el-form-item label="巡检缺陷单主题" prop="defectiveTheme">
            {{orderDataForm.defectiveTheme}}
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="所属机构" prop="deptName">
                {{orderDataForm.deptName}}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="缺陷异常等级" prop="exceptionName">
                {{orderDataForm.exceptionName}}
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="巡检缺陷单内容" prop="orderContent">
            {{orderDataForm.orderContent}}
          </el-form-item>
          <el-form-item label="缺陷操作人" prop="defectiveName">
            {{orderDataForm.defectiveName}}
          </el-form-item>
          <el-form-item label="缺陷操作人意见" prop="defectiveNameOpinion">
            {{orderDataForm.defectiveNameOpinion}}
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFivevisible = false">取消</el-button>
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
  import AddOrUpdate from './orderdefective-add-or-update'
  import splitPane from '@/components/split-pane'
  import depttree from '@/components/dept-tree'
  import { treeDataTranslate } from '@/utils'
  import TableTreeColumn from '@/components/table-tree-column'
  export default {
    data () {
      return {
        dataForm: {
          deptId: '',
          defectiveNumber: '',
          defectiveTheme: '',
          exceptionId: ''
        },
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
          defectiveDevice: ''
        },
        tableHeight: 300,
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 12,
        oldPercent: 12,
        deptList: [],
        dataExceptionList: [],
        startDatePicker: this.beginDate(),
        dialogFormVisible: false,
        UserdataList: [],
        dataDeptList: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        limit: 2000,
        currentRow: '',
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        dialogzerovisible: false,
        dialogonevisible: false,
        dialogtwovisible: false,
        dialogThreevisible: false,
        dialogFourvisible: false,
        dialogFivevisible: false,
        dataRule: {
          requirementTime: [
            {required: true, message: '要求完成时间不为空', trigger: 'blur'}
          ],
          orderAcceptor: [
            {required: true, message: '受理人不为空', trigger: 'blur'}
          ],
          orderConfirmerOpinion: [
            {required: true, message: '工单操作人意见不为空', trigger: 'blur'}
          ],
          orderConfirmer: [
            {required: true, message: '工单操作人不为空', trigger: 'blur'}
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
    computed: {
      loginuserName: {
        get () { return this.$store.state.user.name }
      },
      loginuserId: {
        get () { return this.$store.state.user.id }
      }

    },
    activated () {
      this.getDataList()
      this.getDeptList()
      this.getDeptDataList()
      this.getExeption()
    },
    methods: {
      beginDate () {
        return {
          disabledDate (time) {
            return time.getTime() < Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      rowStyle () {
        return 'height:40px'
      },
      cellStyle () {
        return 'padding:0'
      },
      handle (username, userid) {
        var userNames = username ? [username] : this.dataListSelections.map(item => {
          return item.username
        })
        var userId = userid ? [userid] : this.dataListSelections.map(item => {
          return item.userId
        })
        if (this.dataListSelections.length >= 2) {
          this.$alert('工单操作人只能选择一个')
        } else {
          this.orderDataForm.orderConfirmer = userNames.toString()
          this.orderDataForm.orderConfirmerId = userId.toString()
          this.dialogFormVisible = false
        }
      },
      // 选中部门 查询用户
      depteHandle (val) {
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
      // 查询用户
      query () {
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
      // 查询部门
      getDeptDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams({'name': this.deptFrom.name})
        }).then(({data}) => {
          this.dataDeptList = treeDataTranslate(data, 'deptId')
        })
      },
      clickTitle () {
        this.dialogFormVisible = true
      },

      search () {
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/management/orderdefectivelist/list'),
          method: 'get',
          params: this.$http.adornParams({
            'deptId': this.dataForm.deptId,
            'defectiveTheme': this.dataForm.defectiveTheme,
            'defectiveNumber': this.dataForm.defectiveNumber,
            'exceptionId': this.dataForm.exceptionId,
            'page': this.pageIndex,
            'limit': this.pageSize
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
          const tHeader = ['缺陷单编号', '缺陷单主题', '缺陷类型', '所属机构', '缺陷等级', '转工单状态', '工单操作人', '工单确认时间']
          const filterVal = ['defectiveNumber', 'defectiveTheme', 'defectiveTypeName', 'deptName', 'exceptionName', 'orderStatusName', 'orderConfirmer', 'confirmedTime']
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
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/management/orderdefectivelist/list'),
          method: 'get',
          params: this.$http.adornParams({
            'deptId': this.dataForm.deptId,
            'defectiveTheme': this.dataForm.defectiveTheme,
            'defectiveNumber': this.dataForm.defectiveNumber,
            'page': this.pageIndex,
            'limit': this.pageSize
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
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.defectiveId
        })
        this.$confirm(`确定对[序号=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/management/orderdefective/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
              var dom = document.getElementById('did')
              dom.style.display = 'none'
              this.search()
            } else {
              this.$message.error(data.msg)
            }
          })
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
      // 点击缺陷单编号
      clickRow (row) {
        this.$http({
          url: this.$http.adornUrl(`/management/orderdefective/info/` + row.defectiveId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.orderDataForm.defectiveId = data.orderdefective.defectiveId
            this.orderDataForm.defectiveNumber = data.orderdefective.defectiveNumber
            this.orderDataForm.defectiveTheme = data.orderdefective.defectiveTheme
            this.orderDataForm.defectiveType = data.orderdefective.defectiveType
            this.orderDataForm.defectiveTypeName = data.orderdefective.defectiveTypeName
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
            this.orderDataForm.orderStatusName = data.orderdefective.orderStatusName
            this.orderDataForm.orderConfirmer = data.orderdefective.orderConfirmer
            this.orderDataForm.orderConfirmerId = data.orderdefective.orderConfirmerId
            this.orderDataForm.confirmedTime = data.orderdefective.confirmedTime
            this.orderDataForm.orderConfirmerOpinion = data.orderdefective.orderConfirmerOpinion
            this.orderDataForm.orderAcceptor = data.orderdefective.orderAcceptor
            this.orderDataForm.orderAcceptorId = data.orderdefective.orderAcceptorId
            this.orderDataForm.requirementTime = data.orderdefective.requirementTime
            this.orderDataForm.defectiveDevice = data.orderdefective.defectiveDevice
          }
          console.log(this.orderDataForm.orderConfirmerOpinion)
          if (row.defectiveType === 0) {
            if (row.orderStatus === 2) {
              this.dialogFourvisible = true
            } else if (row.orderStatus === 3) {
              this.dialogFivevisible = true
            }
          } else {
            if (row.orderStatus === 0) { // 拟制中
              this.dialogzerovisible = true
            } else if (row.orderStatus === 1) {
              this.dialogonevisible = true
            } else if (row.orderStatus === 2) {
              this.dialogtwovisible = true
            } else if (row.orderStatus === 3) {
              this.dialogThreevisible = true
            }
          }
        })
      },
      // 缺陷等级
      getExeption () {
        this.$http({
          url: this.$http.adornUrl('/setting/orderexception/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataExceptionList = data.page.list
          } else {
            this.dataExceptionList = []
          }
        })
      },
      // 确认缺陷单
      confirmation () {
        this.orderDataForm.orderStatus = 1
        this.orderDataForm.confirmedTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
        this.orderDataForm.orderConfirmerOpinion = null
        this.$http({
          url: this.$http.adornUrl(`/management/orderdefective/update`),
          method: 'post',
          data: this.$http.adornData({
            'defectiveId': this.orderDataForm.defectiveId,
            'defectiveNumber': this.orderDataForm.defectiveNumber,
            'defectiveTheme': this.orderDataForm.defectiveTheme,
            'defectiveType': this.orderDataForm.defectiveType,
            'deptId': this.orderDataForm.deptId,
            'exceptionId': this.orderDataForm.exceptionId,
            'orderContent': this.orderDataForm.orderContent,
            'defectiveName': this.orderDataForm.defectiveName,
            'defectiveNameId': this.orderDataForm.defectiveNameId,
            'defectiveNameOpinion': this.orderDataForm.defectiveNameOpinion,
            'createTime': this.orderDataForm.createTime,
            'orderStatus': this.orderDataForm.orderStatus,
            'orderConfirmer': this.orderDataForm.orderConfirmer,
            'orderConfirmerId': this.orderDataForm.orderConfirmerId,
            'confirmedTime': this.orderDataForm.confirmedTime,
            'orderConfirmerOpinion': this.orderDataForm.orderConfirmerOpinion,
            'orderAcceptor': this.orderDataForm.orderAcceptor,
            'orderAcceptorId': this.orderDataForm.orderAcceptorId,
            'requirementTime': this.orderDataForm.requirementTime,
            'defectiveDevice': this.orderDataForm.defectiveDevice
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.search()
                this.dialogzerovisible = false
                this.dialogThreevisible = false
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      handleStartTimeChange (val) {
        this.orderDataForm.requirementTime = val
      },
      // 确认并派单
      orderConfirm () {
        if (this.orderDataForm.orderConfirmer === '') {
          this.$alert('工单操作人不能为空')
          return
        }
        if (this.orderDataForm.requirementTime === null) {
          this.$alert('要求完成时间不能为空')
          return
        }
        this.orderDataForm.orderStatus = 2
        this.$http({
          url: this.$http.adornUrl(`/management/orderdefective/orderupdate`),
          method: 'post',
          data: this.$http.adornData({
            'defectiveId': this.orderDataForm.defectiveId,
            'defectiveNumber': this.orderDataForm.defectiveNumber,
            'defectiveTheme': this.orderDataForm.defectiveTheme,
            'defectiveType': this.orderDataForm.defectiveType,
            'deptId': this.orderDataForm.deptId,
            'exceptionId': this.orderDataForm.exceptionId,
            'orderContent': this.orderDataForm.orderContent,
            'defectiveName': this.orderDataForm.defectiveName,
            'defectiveNameId': this.orderDataForm.defectiveNameId,
            'defectiveNameOpinion': this.orderDataForm.defectiveNameOpinion,
            'createTime': this.orderDataForm.createTime,
            'orderStatus': this.orderDataForm.orderStatus,
            'orderConfirmer': this.orderDataForm.orderConfirmer,
            'orderConfirmerId': this.orderDataForm.orderConfirmerId,
            'confirmedTime': this.orderDataForm.confirmedTime,
            'orderConfirmerOpinion': this.orderDataForm.orderConfirmerOpinion,
            'orderAcceptor': this.orderDataForm.orderAcceptor,
            'orderAcceptorId': this.orderDataForm.orderAcceptorId,
            'requirementTime': this.orderDataForm.requirementTime
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.search()
                this.dialogonevisible = false
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
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

