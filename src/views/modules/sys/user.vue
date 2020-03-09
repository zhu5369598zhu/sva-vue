<template>
  <div class="mod-user" style="height: 100%;">
    <div class="show-data-content">
    <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
      <template slot="paneL" >
        <div class="show-left" style="height: calc(100% - 18px);">
        <div class="org_title">
          <span v-if="this.isDrawBack===false">机构列表</span style="vertical-align: middle;"><i :class="drawBackClass" style="float:right;cursor:pointer;" @click="onDrawBack"></i>
        </div>
        <depttree @deptSelectEvent="deptSelectHandle" v-if="this.isDrawBack===false"></depttree>
        </div>
      </template>
   <template slot="paneR">
    <div class="show-data-table">
      <div class="show-data-up">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable size="mini"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="search" size="mini">查询</el-button>
        <el-button v-if="isAuth('sys:user:save')" @click="addOrUpdateHandle()" size="mini">新增</el-button>
        <el-button v-if="isAuth('sys:user:delete')" type="warning" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" size="mini">批量删除</el-button>
        <el-button @click="exportExcelHandle()" size="mini">导出</el-button>
      </el-form-item>

      <el-form-item>
          <el-upload
          class="device-import"
          accept=".xlsx,.xls"
          :action="this.$http.adornUrl(`/sys/user/upload?token=${this.$cookie.get('token')}`)"
          :file-list="importFileList"
          :on-success="UploadSuccessHandle">
          <el-button  size="mini">导入</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-table
      ref="table"
      :height="tableHeight"
      :data="dataList"
      border
      highlight-current-row
      :cell-style="cellStyle"
      :row-style="rowStyle"
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
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        width="190"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="80"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="mini" type="danger">禁用</el-tag>
          <el-tag v-else size="mini">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="160"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:user:update')" type="text" size="mini" @click="addOrUpdateHandle(scope.row.userId)">修改</el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="text" size="mini" @click="deleteHandle(scope.row.userId)">删除</el-button>
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
    <importResult v-if="importResultVisible" ref="importResult" @refreshDataList="getDataList"></importResult>
  </div>
  </div>
  </template>
  </split-pane>
  </div>
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import depttree from '@/components/dept-tree'
  import AddOrUpdate from './user-add-or-update'
  import importResult from '../inspection/import-result'
  import splitPane from '@/components/split-pane'
  export default {
    data () {
      return {
        dataForm: {
          userName: '',
          deptId: null
        },
        tableHeight: 300,
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 12,
        oldPercent: 16,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        importResultVisible: false,
        importFileList: []
      }
    },
    components: {
      depttree,
      AddOrUpdate,
      splitPane,
      importResult
    },
    activated () {
      this.getDataList()
    },
    methods: {
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
      search () {
        // this.dataForm.deptId = null
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'username': this.dataForm.userName,
            'deptId': this.dataForm.deptId
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
      rowStyle ({row, rowIndex}) {
        return 'height:40px'
      },
      cellStyle () {
        return 'padding:0'
      },
      deptSelectHandle (val) {
        this.dataForm.deptId = val
        this.getDataList(this.dataForm.deptId)
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
          this.$refs.addOrUpdate.getDeptList()
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var userIds = id ? [id] : this.dataListSelections.map(item => {
          return item.userId
        })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/user/delete'),
            method: 'post',
            data: this.$http.adornData(userIds, false)
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
        }).catch(() => {})
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      exportToExcel (list) {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['用户名<username>', '工号<user_code>', '机构名称<dept_name>', '邮箱<email>', '手机号<mobile>', '微信<wechat>', '角色<roleNameList>', '状态<status_name>', '备注<remark>', '密码<password>', '密码盐<salt>']
          const filterVal = ['username', 'userCode', 'deptName', 'email', 'mobile', 'wechat', 'roleNameList', 'statusName', 'remark', 'password', 'salt']
          const data = this.formatJson(filterVal, list)
          let filename = formatDate(new Date(), 'yyyyMMddhhmmss')
          export_json_to_excel({
            header: tHeader,
            data,
            filename: filename,
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.downloadLoading = false
        })
      },
      exportExcelHandle () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/export'),
          method: 'get',
          params: this.$http.adornParams({
            'username': this.dataForm.userName,
            'deptId': this.dataForm.deptId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.exportToExcel(data.list)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      UploadSuccessHandle (response, file, fileList) {
        console.log('success')
        this.importFileList = []
        if (response.code > 0) {
          this.$message.error(response.msg)
        } else {
          var count = response.list.length
          this.$confirm(`上传成功，将要导入${count}条数据, 是否继续导入?`, '提示', {
            confirmButtonText: '导入',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            console.log('data %o', response.list)
            this.importExcelHandle(response.list)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取导入'
            })
          })
        }
      },
      importExcelHandle (list) {
        this.$http({
          url: this.$http.adornUrl('/sys/user/import'),
          method: 'post',
          data: this.$http.adornData(list, false)
        }).then(({data}) => {
          console.log('import result %o', data)
          if (data && data.code === 0) {
            this.importResultHandle(data.result)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
       // 导入结果
      importResultHandle (result) {
        this.importResultVisible = true
        this.$nextTick(() => {
          this.$refs.importResult.init(result)
        })
      }
    },
    watch: {
      'documentClientHeight': function (val) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 105 - 32 - 20
      }
    },
    mounted: function () {
      this.dataForm.orderNumber = this.$route.params.orderNumber
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 105 - 32 - 20
      })
    }
  }
</script>
