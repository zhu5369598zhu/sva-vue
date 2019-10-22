<template>
  <div class="mod-group" style="height: 100%;">
    <div class="show-data-table" style="height: 100% !important;">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item prop="logNumber">
        <el-input v-model="dataForm.logNumber" size="mini" placeholder="请输入日志编号" clearable ></el-input>
      </el-form-item>
      <el-form-item prop="deptId">
        <el-popover
          ref="deptListPopover"
          placement="bottom-start"
          trigger="click"
          v-model="isShowDeptTree">
          <div style="text-align: center; margin: 0">
            <el-button  size="mini" type="text"  @click="pCancel()">取消</el-button>
          </div>
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="deptId"
            ref="deptListTree"
            @current-change="deptListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false" clearable style="width:140px;">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" size="mini" v-popover:deptListPopover  class="dept-list__input" style="width:140px;" placeholder="请输入机构名称" >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.classGroupName" size="mini" placeholder="请输入班组名称" clearable></el-input>
      </el-form-item>
      <el-form-item  prop="baseTurnId">
        <el-select v-model="dataForm.baseTurnId" size="mini" placeholder="请选择班次" clearable style="width:115px;" >
          <el-option
            v-for="item in TurnList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" size="mini">查询</el-button>
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
      :cell-style="cellStyle"
      :row-style="rowStyle"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50"
        align="center"
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
        width="150"
        label="交接(底)时间">
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
    </div>
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import AddOrUpdate from './classgrouplogreject-add-or-update'
  import banhou from './classgrouplogreject-banhou'
  import banqian from './classgrouplogreject-banqian'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          logNumber: '',
          deptId: '',
          classGroupName: '',
          baseTurnId: '',
          logStatus: '',
          add: '新增'
        },
        tableHeight: 300,
        logStatus: '3',
        logUserStatus: '3',
        logType: '3',
        deptList: [],
        isShowDeptTree: false,
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        TurnList: [],
        userList: [],
        GroupList: [{id: '1', name: '班长日志'}, {id: '2', name: '班前日志'}, {id: '3', name: '班后日志'}],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        banqianVisible: false,
        banhouVisible: false,
        HouHandleVisable: false
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
      banqian
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
          url: this.$http.adornUrl('/group/classgrouplogalready/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'logNumber': this.dataForm.logNumber,
            'deptId': this.dataForm.deptId,
            'classGroupName': this.dataForm.classGroupName,
            'baseTurnId': this.dataForm.baseTurnId,
            'logStatus': this.logStatus,
            'logUserStatus': this.logUserStatus
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
          const tHeader = ['日志编号', '车间(工段)', '班组', '班次', '日志类型', '日志状态', '记录人', '交接人', '接班人', '交接完成时间', '班长', '应出勤人数', '实出勤人数', '实到人员', '未到人员', '顶班人员', '缺勤原因', '接班记事', '当班记事', '上级通知', '交代事项', '人员精神异常描述', '劳动防护用品异常描述', '工器具异常描述', '其他异常', '工作安排', '危险点', '防范措施', '交底人', '班组成员', '工作总结', '负责人', '驳回原因']
          const filterVal = ['logNumber', 'deptName', 'classGroupName', 'baseTurnName', 'logTypeName', 'logStatusName', 'noteTaker', 'handoverPerson', 'successor', 'createTime', 'monitor', 'shouldAttendance', 'attendance', 'actualArrival', 'notArrived', 'topArrived', 'reasonsAbsence', 'successionRecord', 'onDuty', 'superiorNotice', 'accountConfession', 'mentalException', 'protectiveException', 'toolsException', 'otherException', 'workTask', 'dangerousPoint', 'preventiveMeasures', 'manAgreement', 'teamMembers', 'workSummary', 'personCharge', 'rejectReason']
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
      // 获取数据列表 导出数据
      exportExcelHandle () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/group/classgrouplogalready/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'logNumber': this.dataForm.logNumber,
            'deptId': this.dataForm.deptId,
            'classGroupName': this.dataForm.classGroupName,
            'baseTurnId': this.dataForm.baseTurnId,
            'logStatus': this.logStatus,
            'logUserStatus': this.logUserStatus
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
            url: this.$http.adornUrl('/sys/dept/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deptList = treeDataTranslate(data, 'deptId')
          })
        }
      },
      // 部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.deptId = data.deptId
        this.dataForm.deptName = data.name
        this.isShowDeptTree = false
      },
      // 部门树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
        this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      pCancel () {
        this.dataForm.deptId = ''
        this.dataForm.deptName = ''
        this.isShowDeptTree = false
      },
      getUserList () {
        this.userList = [{id: '', name: '全部的人'}, {id: this.loginuserId, name: '与我相关'}]
      },
      // 修改选择
      updateHandle (id, logStatus, logType, logNumber) {
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

<style scoped="">
  .show-data-table .el-form .el-form-item{
    margin-bottom:  10px;
  }
  @media screen and (max-width: 1360px){
    .el-tab-pane .el-table{
      height: calc(100vh - 260px) !important;
    }
  }
</style>
