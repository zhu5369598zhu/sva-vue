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
                  <el-button v-if="isAuth('setting:exception:save')" type="primary" @click="addOrUpdateHandle()" :disabled="dataListSelections.length <= 0">推送规则</el-button>
                  <!--<el-button v-if="isAuth('setting:exception:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
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
              <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
            </div>
          </div>
        </template>
        <!-- 弹窗, 新增 / 修改 -->

      </split-pane>
    </div>
  </div>

</template>

<script>
  import DeviceTree from '@/components/device-exception-tree'
  import splitPane from '@/components/split-pane'
  import addOrUpdate from './deviceexception-add-or-update'
  export default {
    data () {
      return {
        radio: '1',
        tabelA: [1, 2],
        addOrUpdateVisible: false,
        dataForm: {
          name: '',
          deviceId: null,
          value: '1'
        },
        clickForm: {
          smsId: 0,
          levelId: '0',
          levelName: '',
          deptId: '0',
          deviceId: '0',
          deviceName: '',
          exceptionIds: '',
          deviceSmsType: 1,
          isOk: 1,
          type: ''
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
      splitPane,
      addOrUpdate
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
        if (val.type === 'device') { // 选择设备
          this.clickForm.deptId = val.deptId
          this.clickForm.levelId = val.levelId
          this.clickForm.levelName = val.levelName
          this.clickForm.deviceId = val.id
          this.clickForm.deviceName = val.lable
          this.clickForm.type = val.type
        } else if (val.type === 'level') { // 选择设备等级
          this.clickForm.deptId = val.deptId
          this.clickForm.levelId = val.id
          this.clickForm.levelName = val.label
          this.clickForm.type = val.type
        }
        this.getDataList()
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
            this.clickForm.smsId = 0
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        }).then(() => {
          this.checkList()
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
      // 回显 异常等级
      checkList () {
        this.$http({
          url: this.$http.adornUrl('/sys/deviceexception/checklist'),
          method: 'get',
          params: this.$http.adornParams({
            'levelId': this.clickForm.levelId,
            'levelName': this.clickForm.levelName,
            'deviceId': this.clickForm.deviceId,
            'deviceName': this.clickForm.deviceName,
            'deptId': this.clickForm.deptId,
            'type': this.clickForm.type
          })
        }).then(({data}) => {
          if (data && data.code === 0 && data.deviceException !== null) {
            const tabel = data.deviceException.tablecheck
            this.clickForm.smsId = data.deviceException.id
            this.clickForm.deviceSmsType = data.deviceException.deviceSmsType
            if (tabel !== []) {
              tabel.forEach(item => {
                this.dataList.forEach(v => {
                  if (v.id === parseInt(item)) {
                    this.$refs.table.toggleRowSelection(v)
                  }
                })
              })
            }
          }
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        if (this.clickForm.levelName === '') {
          this.$alert('请选择设备等级或设备')
        } else {
          this.addOrUpdateVisible = true
          console.log(this.clickForm.smsId)
          this.$nextTick(() => {
            if (this.clickForm.smsId === 0) { // 新增
              var ids = id ? [id] : this.dataListSelections.map(item => {
                return item.id
              })
              this.clickForm.exceptionIds = ids.toString()
              this.$refs.addOrUpdate.init(
                this.clickForm.smsId,
                this.clickForm.deptId,
                this.clickForm.levelId,
                this.clickForm.levelName,
                this.clickForm.deviceId,
                this.clickForm.deviceName,
                this.clickForm.exceptionIds,
                this.clickForm.deviceSmsType,
                this.clickForm.isOk,
                this.clickForm.type
              )
            } else { // 回显
              var idss = id ? [id] : this.dataListSelections.map(item => {
                return item.id
              })
              this.clickForm.exceptionIds = idss.toString()
              this.$refs.addOrUpdate.init(
                this.clickForm.smsId,
                this.clickForm.deptId,
                this.clickForm.levelId,
                this.clickForm.levelName,
                this.clickForm.deviceId,
                this.clickForm.deviceName,
                this.clickForm.exceptionIds,
                this.clickForm.deviceSmsType,
                this.clickForm.isOk,
                this.clickForm.type
              )
            }
          })
        }
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定删除?`, '提示', {
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


