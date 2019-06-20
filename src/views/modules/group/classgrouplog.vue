<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="日志列表"></el-form-item>
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
      <el-form-item prop="logType">
        <el-select v-model="dataForm.logType" placeholder="请选择日志类型" clearable style="width:135px;">
          <el-option
            v-for="item in GroupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="logStatus">
        <el-select v-model="dataForm.logStatus" placeholder="请选择日志状态" clearable style="width: 135px;">
          <el-option
            v-for="item in LogStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"></el-option>
        </el-select>

      </el-form-item>

      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
          <el-select v-model="dataForm.add" placeholder="新增日志"  style="width:110px;">
            <el-option :value="dataForm.add">
            <el-button-group>
              <el-button v-if="isAuth('group:classgrouplog:save')" type="primary" @click="addOrUpdateHandle()" >新增班长日志</el-button>
              <el-button v-if="isAuth('group:classgrouplog:save')" type="primary" @click="addOrUpdateBanQianHandle()" >新增班前日志</el-button>
              <el-button v-if="isAuth('group:classgrouplog:save')" type="primary" @click="addOrUpdateBanHouHandle()" >新增班后日志</el-button>
            </el-button-group>
            </el-option>
          </el-select>
    </el-form-item>
      <el-form-item>
        <el-button @click="exportExcelHandle()">导出excel</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="classId"
        header-align="center"
        align="center"
        label="序号">
      </el-table-column>
      <el-table-column
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
        label="交接人">
      </el-table-column>
      <el-table-column
        prop="successor"
        header-align="center"
        align="center"
        label="接班人">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="交接(完成)时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="updateHandle(scope.row.classId,scope.row.logStatus,scope.row.logType)">修改</el-button>
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
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import AddOrUpdate from './classgrouplog-add-or-update'
  import banhou from './classgrouplog-banhou'
  import banqian from './classgrouplog-banqian'
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
          logStatus: '',
          add: '新增'
        },
        logStatus: '',
        deptList: [],
        TurnList: [],
        GroupList: [{id: '1', name: '班长日志'}, {id: '2', name: '班前日志'}, {id: '3', name: '班后日志'}],
        LogStatusList: [{id: '1', name: '拟制中'}, {id: '2', name: '待确认'}, {id: '3', name: '已确认'}],
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
    components: {
      AddOrUpdate,
      banhou,
      banqian
    },
    activated () {
      this.getTurnList()
      this.getDeptList()
      this.getDataList()
    },
    methods: {

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/group/classgrouplog/list'),
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
            'logStatus': this.dataForm.logStatus
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
      // 获取数据列表 导出
      exportExcelHandle () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/group/classgrouplog/list'),
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
            'logStatus': this.dataForm.logStatus
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
      // 修改选择
      updateHandle (id, logStatus, logType) {
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
          this.$alert('日志状态为 已确认或驳回的日志 不能修改')
        }
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
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.classId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/group/classgrouplog/delete'),
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
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
