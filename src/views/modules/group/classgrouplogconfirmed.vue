<template>
  <div class="mod-group">
    <div class="show-data-table">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item prop="logNumber">
        <el-input v-model="dataForm.logNumber" placeholder="请输入日志编号" clearable ></el-input>
      </el-form-item>
      <el-form-item prop="deptId">
        <el-select v-model="dataForm.deptId" placeholder="请输入机构名称" clearable>
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.name"
            :value="item.deptId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.classGroupName" placeholder="请输入班组名称" clearable></el-input>
      </el-form-item>
      <el-form-item  prop="baseTurnId">
        <el-select v-model="dataForm.baseTurnId" placeholder="请选择班次" clearable style="width:115px;">
          <el-option
            v-for="item in TurnList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item  prop="user_id">
        <el-select v-model="dataForm.user_id" placeholder="和我相关" clearable style="width: 130px;"  >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
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
      :cell-style="cellStyle"
      :row-style="rowStyle"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50"
        lable="">
      </el-table-column>
      <el-table-column
        width="120"
        prop="logNumber"
        header-align="center"
        align="center"
        label="日志编号">
      </el-table-column>
      <el-table-column
        prop="deptName"
        header-align="center"
        align="center"
        label="车间(工段)">
      </el-table-column>
      <el-table-column
        prop="classGroupName"
        header-align="center"
        align="center"
        label="班组">
      </el-table-column>
      <el-table-column
        prop="baseTurnName"
        header-align="center"
        align="center"
        label="班次">
      </el-table-column>
      <el-table-column
        prop="logTypeName"
        header-align="center"
        align="center"
        label="日志类型">
      </el-table-column>
      <el-table-column
        prop="logStatusName"
        header-align="center"
        align="center"
        label="日志状态">
        <template slot-scope="scope">
          <span v-if="scope.row.logStatusName =='!待确认'" style="color: #5daf34">{{scope.row.logStatusName}}</span>
          <span v-if="scope.row.logStatusName != '!待确认'" >{{scope.row.logStatusName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="noteTaker"
        header-align="center"
        align="center"
        label="记录人">
      </el-table-column>
      <el-table-column
        prop="handoverPerson"
        header-align="center"
        align="center"
        label="交班(底)人">
      </el-table-column>
      <el-table-column
        prop="successor"
        header-align="center"
        align="center"
        label="接班(底)人">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="交接(底)时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.newsCounts >0" @click="updateHandle(scope.row.classId,scope.row.logStatus,scope.row.logType,scope.row.logNumber)">去确认</el-button>
          <el-button type="text" size="small" v-if="scope.row.newsCounts ===0" :disabled="scope.row.newsCounts ===0" style="color: #8c939d;">去确认</el-button>
          <el-button type="text" size="small" v-if="scope.row.rejectNewsCounts > 0" @click="rejectupdateHandle(scope.row.classId,scope.row.logStatus,scope.row.logType,scope.row.logNumber)">修改</el-button>
          <el-button type="text" size="small" v-if="scope.row.rejectNewsCounts ===0" :disabled="scope.row.rejectNewsCounts ===0" style="color: #8c939d;">修改</el-button>
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
    <banhou v-if="banhouVisible" ref="banhou" @refreshDataList="getDataList"></banhou>
    <banqian v-if="banqianVisible" ref="banqian" @refreshDataList="getDataList"></banqian>
    <!-- 驳回修改弹框, 新增 / 修改-->
    <rejectbanchang v-if="rejectaddOrUpdateVisible" ref="rejectbanchang" @refreshDataList="getDataList"></rejectbanchang>
    <rejectbanhou v-if="rejectbanhouVisible" ref="rejectbanhou" @refreshDataList="getDataList"></rejectbanhou>
    <rejectbanqian v-if="rejectbanqianVisible" ref="rejectbanqian" @refreshDataList="getDataList"></rejectbanqian>
    </div>
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import AddOrUpdate from './classgrouplogconfirmed-add-or-update'
  import banhou from './classgrouplogconfirmed-banhou'
  import banqian from './classgrouplogconfirmed-banqian'
  import rejectbanchang from './classgrouplogreject-add-or-update'
  import rejectbanqian from './classgrouplogreject-banqian'
  import rejectbanhou from './classgrouplogreject-banhou'
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          logNumber: '',
          deptId: '',
          classGroupName: '',
          baseTurnId: '',
          logType: '',
          logStatus: '2',
          add: '新增',
          user_id: ''
        },
        tableHeight: 300,
        logStatus: '',
        deptList: [],
        TurnList: [],
        userList: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        banqianVisible: false,
        banhouVisible: false,
        HouHandleVisable: false,
        rejectaddOrUpdateVisible: false,
        rejectbanhouVisible: false,
        rejectbanqianVisible: false
      }
    },
    computed: {
      loginuserId: {
        get () { return this.$store.state.user.id }
      }
    },
    components: {
      AddOrUpdate,
      banhou,
      banqian,
      rejectbanchang,
      rejectbanqian,
      rejectbanhou
    },
    activated () {
      this.getTurnList()
      this.getDeptList()
      this.getDataList()
      this.getUserList()
    },
    methods: {

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/group/classgrouplogconfirmed/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'logNumber': this.dataForm.logNumber,
            'deptId': this.dataForm.deptId,
            'classGroupName': this.dataForm.classGroupName,
            'baseTurnId': this.dataForm.baseTurnId,
            'logType': this.dataForm.logType,
            'logStatus': this.dataForm.logStatus,
            'user_id': this.dataForm.user_id,
            'userid': this.loginuserId
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
          const tHeader = ['日志编号', '车间(工段)', '班组', '班次', '日志类型', '日志状态', '记录人', '交接人', '接班人', '交接完成时间']
          const filterVal = ['logNumber', 'deptName', 'classGroupName', 'baseTurnName', 'logTypeName', 'logStatusName', 'noteTaker', 'handoverPerson', 'successor', 'createTime']
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
      // 获取数据列表 导出 excel
      exportExcelHandle () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/group/classgrouplogconfirmed/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'logNumber': this.dataForm.logNumber,
            'deptId': this.dataForm.deptId,
            'classGroupName': this.dataForm.classGroupName,
            'baseTurnId': this.dataForm.baseTurnId,
            'logType': this.dataForm.logType,
            'logStatus': this.dataForm.logStatus,
            'user_id': this.dataForm.user_id
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
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      getTurnList () {
        if (this.TurnList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/baseturn/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.TurnList = data.page.list
          })
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
      getUserList () {
        this.userList = [{id: '', name: '全部的人'}, {id: this.loginuserId, name: '与我相关'}]
      },
      // 修改选择
      updateHandle (id, logStatus, logType, logNumber) {
        this.$http({
          url: this.$http.adornUrl('/group/classgrouplogconfirmed/confirmed'),
          method: 'get',
          params: this.$http.adornParams({
            'user_id': this.loginuserId,
            'log_number': logNumber
          })
        }).then(({data}) => {
          if (data.newsCounts === 0) {
            this.$alert('您不需要确认')
          } else {
            if (logStatus === '1' || logStatus === '2') { // 拟制中 待确认可以修改
              if (logType === '1') { // 班长日志
                this.addOrUpdateHandle(id)
              }
              if (logType === '2') { // 班前日志
                this.addOrUpdateBanQianHandle(id)
              }
              if (logType === '3') { // 班后日志
                this.addOrUpdateBanHouHandle(id)
              }
            }
            // 已确定 和已完成 不能修改
            if (logStatus === '3' || logStatus === '4') {
              this.$alert('日志状态为 已确认和 已完成不能修改')
            }
          }
        })
      },
      rejectupdateHandle (id, logStatus, logType, logNumber) {
        this.$http({
          url: this.$http.adornUrl('/group/classgrouplogreject/reject'),
          method: 'get',
          params: this.$http.adornParams({
            'user_id': this.loginuserId,
            'log_number': logNumber
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            if (data.newsCounts === 0) {
              this.$alert('您不需要修改')
            } else {
              if (logStatus === '1' || logStatus === '2' || logStatus === '4') { // 拟制中 待确认可以修改
                if (logType === '1') { // 班长日志
                  this.rejectbanchang(id)
                }
                if (logType === '2') { // 班前日志
                  this.rejectbanqian(id)
                }
                if (logType === '3') { // 班后日志
                  this.rejectbanhou(id)
                }
              }
              // 已确定 和已完成 不能修改
              if (logStatus === '3') {
                this.$alert('日志状态为 已确认的日志不能修改')
              }
            }
          }
        })
      },
      // 新增 / 修改  班长日志
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.banhouVisible = false
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 新增 / 修改 班后日志
      addOrUpdateBanHouHandle (id) {
        this.addOrUpdateVisible = false
        this.banhouVisible = true
        this.$nextTick(() => {
          this.$refs.banhou.init(id)
        })
      },
      // 新增 / 修改 班前日志
      addOrUpdateBanQianHandle (id) {
        this.banqianVisible = true
        this.$nextTick(() => {
          this.$refs.banqian.init(id)
        })
      },
      // 驳回修改 班长日志
      rejectbanchang (id) {
        this.rejectaddOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.rejectbanchang.init(id)
        })
      },
      // 驳回修改 班前日志
      rejectbanqian (id) {
        this.rejectbanqianVisible = true
        this.$nextTick(() => {
          this.$refs.rejectbanqian.init(id)
        })
      },
      // 驳回修改 班后日志
      rejectbanhou (id) {
        this.rejectbanhouVisible = true
        this.$nextTick(() => {
          this.$refs.rejectbanhou.init(id)
        })
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
