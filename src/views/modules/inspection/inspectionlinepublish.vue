<template>
  <el-dialog
    v-dialog-drag
    :title="'下载详情'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close='closeDialog'
    append-to-body>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="pdaName"
        header-align="center"
        align="center"
        width="240"
        label="PDA名称">
      </el-table-column>
      <el-table-column
        prop="pdaMac"
        header-align="center"
        align="center"
        label="PDA地址">
      </el-table-column>
      <el-table-column
        prop="isDownload"
        header-align="center"
        align="center"
        width="100"
        label="是否已下载">
        <template slot-scope="scope">
          <span v-if="scope.row.isDownload === 0" style="color:red;">否</span>
          <span v-if="scope.row.isDownload === 1" style="color:darkgreen">是</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="下载时间">
      </el-table-column>
    </el-table>
    <div align="right" style="margin-top:15px;margin-bottom:15px;">
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        lineId: 0,
        dataForm: {
          key: ''
        },
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
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList (lineId) {
        this.visible = true
        this.dataListLoading = true
        this.lineId = lineId
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectionlinepublish/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'lineId': this.lineId
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
      // dialog 关闭事件
      closeDialog () {
        this.$emit('closeMain')
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList(this.lineId)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.lineId)
      }
    }
  }
</script>
