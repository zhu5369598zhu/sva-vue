<template>
  <div class="mod-item">
    <div class="show-data-content">
      <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
        <template slot="paneL" >
          <div class="show-left">
            <div class="org_title">
              <span v-if="this.isDrawBack===false" style="vertical-align: middle;">设备选择</span ><i :class="drawBackClass" style="float:right;cursor:pointer;" @click="onDrawBack"></i>
            </div>
            <DeviceTree @TreeSelectEvent="treeSelectHandle" v-if="this.isDrawBack===false"></DeviceTree>
          </div>
        </template>
        <template slot="paneR">
          <div class="show-data-table">
            <div class="show-data-up">
              <el-form :inline="true" :model="dataForm">
                <el-form-item>
                  <el-button v-if="isAuth('setting:exception:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
                  <el-button v-if="isAuth('setting:exception:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
                  type="selection"
                  header-align="center"
                  align="center"
                  width="50">
                </el-table-column>
                <el-table-column
                  type="index"
                  header-align="center"
                  align="center">
                </el-table-column>
                <el-table-column
                  prop="name"
                  header-align="center"
                  align="center"
                  label="异常名称">
                </el-table-column>
                <el-table-column
                  prop="orderNum"
                  header-align="center"
                  align="center"
                  label="排序">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  header-align="center"
                  align="center"
                  width="150"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button v-if="isAuth('setting:exception:save')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                    <el-button v-if="isAuth('setting:exception:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
            </div>
          </div>
        </template>
      </split-pane>
    </div>
  </div>

</template>

<script>
  import DeviceTree from '@/components/device-exception-tree'
  import splitPane from '@/components/split-pane'
  export default {
    data () {
      return {
        dataForm: {
          name: '',
          deviceId: null
        },
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 12,
        tableHeight: 300,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    components: {
      DeviceTree,
      splitPane
    },
    computed: {
      documentClientHeight: {
        get () { return this.$store.state.common.documentClientHeight }
      }
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
      treeSelectHandle (val) {
        if (val.type === 'device') {
          this.dataForm.deviceId = val.id
          this.getDataList()
        } else {
          this.dataForm.deviceId = 0
        }
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/setting/exception/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name': this.dataForm.name
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
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/setting/exception/delete'),
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
  }
</script>


