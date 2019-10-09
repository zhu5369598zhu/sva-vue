<template>
  <div class="device-document">
    <el-table
      height="376"
      border
      @selection-change="selectionChangeHandle"
      :cell-style="cellStyle"
      :row-style="rowStyle"
      :data="dataList"
      style="width: 100%;">
      <el-table-column
        fixed
        type="index"
        width="50"
        lable="序号">
      </el-table-column>
      <el-table-column
        prop="orderNumber"
        header-align="center"
        align="center"
        label="工单编号"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="defectiveNumber"
        header-align="center"
        align="center"
        width="150"
        label="缺陷单编号">
      </el-table-column>
      <el-table-column
        prop="defectiveTheme"
        header-align="center"
        align="center"
        width="250"
        label="维护内容">
      </el-table-column>
      <el-table-column
        prop="confirmedTime"
        header-align="center"
        align="center"
        width="140"
        label="维护时间">
      </el-table-column>
      <!--<el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-delete" v-if="isAuth('inspection:orderdevice:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <div align="right">
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

<script>
    export default {
      props: {
        deviceId: {
          type: Number
        },
        disabled: {
          type: Boolean
        }
      },
      data () {
        return{
          dataList: [],
          pageIndex: 1,
          pageSize: 10,
          totalPage: 0,
          uploadParams: {
            deviceId: null,
            category: 0
          }
        }
      },
      created () {
        this.getDataList()
      },
      methods: {
        // 获取数据列表
        getDataList (category) {
          this.uploadParams.deviceId = this.deviceId
          console.log('进入页面'+ this.uploadParams.deviceId)
          this.$http({
            url: this.$http.adornUrl('/management/devicemaintain/list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'deviceId': this.uploadParams.deviceId,
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
        rowStyle ({row, rowIndex}) {
          return 'height:25px;padding:0;'
        },
        cellStyle () {
          return 'padding:0'
        }
      },
      watch: {
        'deviceId': function (newVal, oldVal) {
          this.getDataList(this.uploadParams.category)
        }
      }
    }
</script>

<style>
  .upload-document {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .pagecontrol {
    margin-top: 10px;
  }
</style>
