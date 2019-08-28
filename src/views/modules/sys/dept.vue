<template>
  <div class="mod-dept">
    <div class="show-data-content">
    <div class="show-data-table">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="机构名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:dept:save')" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="table"
      :height="tableHeight"
      :data="dataList"
      border
      :cell-style="cellStyle"
      :row-style="rowStyle"
      style="width: 100%;">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="80">
      </el-table-column>
      <table-tree-column
        prop="name"
        header-align="center"
        treeKey="deptId"
        label="机构名称">
      </table-tree-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        label="上级机构">
      </el-table-column>
      <el-table-column
        prop="deptCode"
        header-align="center"
        align="center"
        width="80"
        label="机构编码">
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        width="80"
        label="排序">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:dept:save')" type="text" size="small" @click="addOrUpdateHandle(scope.row.deptId)">修改</el-button>
          <el-button v-if="isAuth('sys:dept:delete')" type="text" size="small" @click="deleteHandle(scope.row.deptId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
  </div>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import AddOrUpdate from './dept-add-or-update'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          name: ''
        },
        tableHeight: 300,
        dataList: [],
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    components: {
      TableTreeColumn,
      AddOrUpdate
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams({'name': this.dataForm.name})
        }).then(({data}) => {
          this.dataList = treeDataTranslate(data, 'deptId')
          this.dataListLoading = false
        })
      },
      rowStyle ({row, rowIndex}) {
        return 'height:40px'
      },
      cellStyle () {
        return 'padding:0'
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
        this.$confirm(`确定进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl(`/sys/dept/delete/${id}`),
            method: 'post',
            data: this.$http.adornData()
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
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      }
    },
    watch: {
      'documentClientHeight': function (val) {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 80 - 20
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 80 - 20
      })
    }
  }
</script>
