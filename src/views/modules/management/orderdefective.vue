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
          填报缺陷单列表
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.defectiveNumber" placeholder="请输入缺陷单编号"  clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.defectiveTheme" placeholder="请输入缺陷单主题" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="dataForm.exceptionId" placeholder="请选择缺陷等级">
            <el-option v-for="item in dataExceptionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.defectiveName" placeholder="请输入填报人" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="search()">查询</el-button>
          <el-button v-if="isAuth('management:orderdefective:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button v-if="isAuth('management:orderdefective:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        :cell-style="cellStyle"
        :row-style="rowStyle"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="defectiveId"
          header-align="center"
          align="center"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="defectiveNumber"
          header-align="center"
          align="center"
          label="缺陷单编号">
          <template slot-scope="scope">
            <a href="#"><p  @click=clickRow(scope.row)>{{scope.row.defectiveNumber}}</p></a>
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
        <el-table-column
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
        </el-table-column>
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
          label="工单确认人">
        </el-table-column>
        <el-table-column
          prop="confirmedTime"
          header-align="center"
          align="center"
          label="工单确认时间">
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.defectiveId,scope.row.orderStatus)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.defectiveId,scope.row.orderStatus)">删除</el-button>
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
    <div class="show-data-down">

      <div class="new_1" id="did" style="display: none">
        <el-form :inline="true" :model="orderDataForm" label-width="80px;">
        <div class="div-a">
            <el-form-item label="缺陷单编号" prop="defectiveNumber">
              <el-input v-model="orderDataForm.defectiveNumber"></el-input>
            </el-form-item>
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
            <el-form-item label="缺陷填报时间" prop="createTime">
              <el-input v-model="orderDataForm.createTime"></el-input>
            </el-form-item>
            <el-form-item label="归属设备" prop="defectiveDevice">
              <el-input v-model="orderDataForm.defectiveDevice"></el-input>
            </el-form-item>
        </div>
        <div class="div-b">
          <el-form-item label="缺陷类型" prop="defectiveTypeName">
            <el-input v-model="orderDataForm.defectiveTypeName"></el-input>
          </el-form-item>
          <el-form-item label="缺陷等级" prop="exceptionName">
            <el-input v-model="orderDataForm.exceptionName"></el-input>
          </el-form-item>
          <el-form-item label="缺陷填报人" prop="defectiveName">
            <el-input v-model="orderDataForm.defectiveName"></el-input>
          </el-form-item>
        </div>
        <div class="div-c">
          <el-form-item label="缺陷单主题" prop="defectiveTheme">
            <el-input v-model="orderDataForm.defectiveTheme"></el-input>
          </el-form-item>
          <el-form-item >
            <el-input
              :rows="6"
              type="textarea"
              v-model="orderDataForm.orderContent"></el-input>
          </el-form-item>
        </div>
        <div class="div-d">
          <p>缺陷填报人意见</p>
          <el-form-item  prop="defectiveNameOpinion">
            <el-input
              type="textarea"
              :rows="4"
              v-model="orderDataForm.defectiveNameOpinion"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="confirmation()" >确认缺陷单</el-button>
          </el-form-item>
        </div>
        </el-form>
      </div>
      <div class="new_1" id="did_1" style="display: none">
        <el-form :inline="true"   :model="orderDataForm" ref="orderDataForm" label-width="80px;">
          <!--  拟制中 -->
          <h5> 缺陷单详情</h5>
          <div class="div-a">
            <el-form-item label="缺陷单编号" prop="defectiveNumber">
              <el-input v-model="orderDataForm.defectiveNumber"></el-input>
            </el-form-item>
            <el-form-item label="所属机构" prop="deptId">
              <!--<el-input v-model="orderDataForm.deptId"></el-input>-->
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
            <el-form-item label="缺陷确认时间" prop="createTime">
              <el-input v-model="orderDataForm.createTime"></el-input>
            </el-form-item>
            <el-form-item label="转工单状态" prop="orderStatusName">
              <el-input v-model="orderDataForm.orderStatusName"></el-input>
            </el-form-item>
            <el-form-item
              label="要求完成时间"
              prop="requirementTime"
            >
              <el-date-picker v-model="orderDataForm.requirementTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:180px;"></el-date-picker>
            </el-form-item>
          </div>
          <div class="div-b">
            <el-form-item label="缺陷类型" prop="defectiveTypeName">
              <el-input v-model="orderDataForm.defectiveTypeName"></el-input>
            </el-form-item>
            <el-form-item label="缺陷等级" prop="exceptionName">
              <el-input v-model="orderDataForm.exceptionName"></el-input>
            </el-form-item>
            <el-form-item label="缺陷确认人" prop="defectiveName">
              <el-input v-model="orderDataForm.defectiveName"></el-input>
            </el-form-item>
            <el-form-item
              label="受理人"
              prop="orderAcceptor"

            >
              <el-input v-model="orderDataForm.orderAcceptor" :disabled="true">
                <span slot="suffix">
                  <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle()" ></a>
                </span>
              </el-input>
              <el-dialog title="可选择用户列表" :visible.sync="dialogFormVisible"  :append-to-body='true'>
                <div style="display: flex;justify-content: space-around;align-items: center;">
                  <div style="width:400px;height: 500px;overflow: scroll;">
                    <el-form :model="deptFrom">
                      <el-row>
                        <el-col :span="8">
                          <el-form-item>
                            <el-input v-model="deptFrom.name" placeholder="机构名称" clearable style="width: 80px;"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item>
                            <el-button @click="getDeptDataList()">查询</el-button>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                    <el-table
                      :data="dataDeptList"
                      style="width: 100%;">
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
                      <el-table-column
                        header-align="center"
                        align="center"
                        width="150"
                        label="操作">
                        <template slot-scope="scope">
                          <el-button  type="text" size="small" @click="depteHandle(scope.row.deptId)">选中</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <div style="width:400px;height: 500px;overflow: scroll;">
                    <el-form :inline="true" :model="datauserForm" >
                      <el-row>
                        <el-col :span="8">
                          <el-form-item>
                            <el-input v-model="datauserForm.userName" placeholder="用户名称" clearable style="width: 80px;"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item>
                            <el-button @click="search">查询</el-button>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-button  type="danger" @click="Handle()" :disabled="dataListSelections.length <= 0">确定</el-button>
                          </el-form-item>
                        </el-col>
                        <el-col :span="4">
                          <el-form-item>
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form>
                    <el-table
                      :data="UserdataList"
                      style="width: 100%;"
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
            </el-form-item>
          </div>
          <div class="div-c">
            <el-form-item label="缺陷单主题" prop="defectiveTheme">
              <el-input v-model="orderDataForm.defectiveTheme"></el-input>
            </el-form-item>
            <el-form-item label="默认内容" prop="orderContent">
              <el-input
                :rows="6"
                type="textarea"
                v-model="orderDataForm.orderContent"></el-input>
            </el-form-item>
          </div>
          <div class="div-d">

             <!-- <p>工单确认人意见</p>-->

            <el-form-item label="工单确认人意见"></el-form-item><br>
            <el-form-item  prop="orderConfirmerOpinion">
              <el-input
                type="textarea"
                :rows="3"
                v-model="orderDataForm.orderConfirmerOpinion"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="orderConfirm()">确认并派单</el-button>
            </el-form-item>
          </div>
        </el-form>


      </div>

      <div class="new_1" id="did_2" style="display: none;">
        <el-form :inline="true" :model="orderDataForm" label-width="80px;">
        <div class="div-a">
          <el-form-item label="缺陷单编号" prop="defectiveNumber">
            <el-input v-model="orderDataForm.defectiveNumber"></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="deptId">
            <!--<el-input v-model="orderDataForm.deptId"></el-input>-->
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
          <el-form-item label="缺陷确认时间" prop="createTime">
            <el-input v-model="orderDataForm.createTime"></el-input>
          </el-form-item>
          <el-form-item label="转工单状态" prop="orderStatusName">
            <el-input v-model="orderDataForm.orderStatusName"></el-input>
          </el-form-item>
          <el-form-item label="工单确认时间" prop="confirmedTime">
            <el-input v-model="orderDataForm.confirmedTime"></el-input>
          </el-form-item>
        </div>
        <div class="div-b">
          <el-form-item label="缺陷类型" prop="defectiveTypeName">
            <el-input v-model="orderDataForm.defectiveTypeName"></el-input>
          </el-form-item>
          <el-form-item label="缺陷等级" prop="exceptionName">
            <el-input v-model="orderDataForm.exceptionName"></el-input>
          </el-form-item>
          <el-form-item label="缺陷填报人" prop="defectiveName">
            <el-input v-model="orderDataForm.defectiveName"></el-input>
          </el-form-item>
          <el-form-item label="工单确认人" prop="orderConfirmer">
            <el-input v-model="orderDataForm.orderConfirmer"></el-input>
          </el-form-item>

        </div>
        <div class="div-c">
          <el-form-item label="缺陷单主题" prop="defectiveTheme">
            <el-input v-model="orderDataForm.defectiveTheme"></el-input>
          </el-form-item>
          <el-form-item label="默认内容" prop="orderContent">
            <el-input
              :rows="6"
              type="textarea"
              v-model="orderDataForm.orderContent"></el-input>
          </el-form-item>
        </div>
        <div class="div-d">
          <p>工单确认人意见</p>

          <el-form-item  prop="orderConfirmerOpinion">
            <el-input
              type="textarea"
              :rows="4"
              v-model="orderDataForm.orderConfirmerOpinion"></el-input>
          </el-form-item>
        </div>
        </el-form>
      </div>
    </div>

  </div>


  <!--<div class="mod-config">

  </div>-->
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
          key: '',
          defectiveNumber: '',
          defectiveTheme: ''
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
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
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
      Handle (username, userid) {
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
      // 选中部门 查询用户
      depteHandle (deptId) {
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
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
      getUserDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
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
        this.dataForm.deptId = ''
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/management/orderdefective/list'),
          method: 'get',
          params: this.$http.adornParams({
            'deptId': this.dataForm.deptId,
            'defectiveTheme': this.dataForm.defectiveTheme,
            'defectiveNumber': this.dataForm.defectiveNumber,
            'defectiveName': this.dataForm.defectiveName,
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
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
          const tHeader = ['缺陷单编号', '缺陷单主题', '缺陷类型', '所属机构', '缺陷等级', '缺陷填报人', '填报时间', '转工单状态', '工单确认人', '工单确认时间']
          const filterVal = ['defectiveNumber', 'defectiveTheme', 'defectiveTypeName', 'deptName', 'exceptionName', 'defectiveName', 'createTime', 'orderStatusName', 'orderConfirmer', 'confirmedTime']
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
          url: this.$http.adornUrl('/management/orderdefective/list'),
          method: 'get',
          params: this.$http.adornParams({
            'deptId': this.dataForm.deptId,
            'defectiveTheme': this.dataForm.defectiveTheme,
            'defectiveNumber': this.dataForm.defectiveNumber,
            'defectiveName': this.dataForm.defectiveName,
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
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
      addOrUpdateHandle (id, orderStatus) {
        if (orderStatus === 0 || orderStatus === undefined) {
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(id)
          })
        } else {
          this.$alert('拟制中状态才能修改')
        }
      },
      // 删除
      deleteHandle (id, orderStatus) {
        if (orderStatus === 0) {
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
        } else {
          this.$alert('拟制中状态才能删除')
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
          var dom = document.getElementById('did')
          var domone = document.getElementById('did_1')
          var domtwo = document.getElementById('did_2')
          var downup = document.getElementById('data-up')
          downup.style.height = '360px'
          downup.style.overflowY = 'scroll'
          if (row.orderStatus === 0) { // 拟制中
            dom.style.display = 'block'
            domone.style.display = 'none'
            domtwo.style.display = 'none'
          } else if (row.orderStatus === 1) {
            dom.style.display = 'none'
            domone.style.display = 'block'
            domtwo.style.display = 'none'
          } else if (row.orderStatus === 2) {
            dom.style.display = 'none'
            domone.style.display = 'none'
            domtwo.style.display = 'block'
          }
        })
      },
      // 缺陷等级
      getExeption () {
        this.$http({
          url: this.$http.adornUrl('/setting/exception/list'),
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
        if (this.orderDataForm.orderConfirmerId === this.loginuserId) {
          this.orderDataForm.orderStatus = 1
          this.orderDataForm.confirmedTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
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
                  var dom = document.getElementById('did')
                  dom.style.display = 'none'
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$alert('需要确认人来确认')
        }
      },
      handleStartTimeChange (val) {
        this.orderDataForm.requirementTime = val
      },
      // 确认并派单
      orderConfirm () {
        if (this.orderDataForm.orderAcceptor === '') {
          this.$alert('受理人不能为空')
          return
        }
        if (this.orderDataForm.requirementTime === null) {
          this.$alert('要求完成时间不能为空')
          return
        }
        if (this.orderDataForm.orderConfirmerId === this.loginuserId) {
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
                  var domone = document.getElementById('did_1')
                  domone.style.display = 'none'
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$alert('需要确认人来确认并派单')
        }
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
  .site-content .show-data-down{
    position:absolute;
    z-index: 10;
    bottom:0;
    left: 20px;
    width:98%;
    height:260px;

  }

  .div-a{ float:left;width:25%;height: 100%;}
  .div-b{ float:left;width:25%;height: 100%;}
  .div-c{ float:left;width:26%;height: 100%;}
  .div-d{ float:left;width:24%;height: 100%;}
</style>
