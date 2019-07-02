<template>
  <el-dialog style="z-index:1"
    :close-on-click-modal="true"
    :modal=true
    :visible.sync="visible"
    append-to-body>
      <div>
        <el-table
          ref="table"
          :height="300"
          :data="dataList"
          border
          v-loading="dataListLoading"
          :cell-style="cellStyle"
          :row-style="rowStyle"
          style="width: 100%;">
          <el-table-column
            prop="deviceName"
            header-align="center"
            align="center"
            width="120"
            label="设备名称">
          </el-table-column>
          <el-table-column
            prop="itemName"
            header-align="center"
            align="center"
            width="250"
            label="巡检内容">
          </el-table-column>
          <el-table-column
            prop="isOk"
            header-align="center"
            align="center"
            width="50"
            label="正常">
            <template slot-scope="scope">
              <span v-if="scope.row.isOk === 0" style="color:red;">否</span>
              <span v-if="scope.row.isOk === 1" style="color:darkgreen">是</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="exceptionName"
            header-align="center"
            align="center"
            width="80"
            label="异常等级">
            <template slot-scope="scope">
              <span v-if="scope.row.exceptionName === '危险' || scope.row.exceptionName === '紧急'" style="color:#ff7f46;">{{scope.row.exceptionName}}</span>
              <span v-if="scope.row.exceptionName === '报警'" style="color:#ffdc4d;">{{scope.row.exceptionName}}</span>
              <span v-if="scope.row.exceptionName === '正常'">{{scope.row.exceptionName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="result"
            header-align="center"
            align="center"
            width="80"
            label="巡检结果">
          </el-table-column>
          <el-table-column
            prop="unit"
            header-align="center"
            align="center"
            width="80"
            label="单位">
          </el-table-column>
          <el-table-column
            prop="limits"
            header-align="center"
            align="center"
            width="140"
            label="上上/上/下/下下">
          </el-table-column>
          <el-table-column
            prop="inspectionType"
            header-align="center"
            align="center"
            width="80"
            label="巡检类型">
          </el-table-column>
          <el-table-column
            prop="deviceLevel"
            header-align="center"
            align="center"
            width="80"
            label="设备等级">
          </el-table-column>
          <el-table-column
            prop="medias"
            header-align="center"
            align="center"
            width="90"
            label="附件">
            <template slot-scope="scope" style="display: inline-block;white-space:normal;">
              <template v-for="item in scope.row.medias">
                <i style="cursor:pointer" @click="view(item.type, item.guid)">
                  <icon-svg
                    :name="changeImg(item.type)"
                    style="font-size:16px;"></icon-svg>
                </i>
                <span>&nbsp;</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="startTime"
            header-align="center"
            align="center"
            width="150"
            label="开始巡检时间">
          </el-table-column>
          <el-table-column
            prop="endTime"
            header-align="center"
            align="center"
            width="150"
            label="结束巡检时间">
          </el-table-column>
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            width="150"
            label="上传时间">
          </el-table-column>
          <el-table-column
            prop="deviceStatus"
            header-align="center"
            align="center"
            width="80"
            label="设备状态">
          </el-table-column>
          <el-table-column
            prop="username"
            header-align="center"
            align="center"
            label="巡检人">
          </el-table-column>
          <el-table-column
            prop="turnName"
            header-align="center"
            align="center"
            label="轮次">
          </el-table-column>
          <el-table-column
            prop="isCheck"
            header-align="center"
            align="center"
            width="50"
            label="跳过">
            <template slot-scope="scope">
              <span v-if="scope.row.isCheck === 0" style="color:red;">是</span>
              <span v-if="scope.row.isCheck === 1" style="color:darkgreen">否</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            header-align="center"
            align="center"
            width="200"
            label="备注">
          </el-table-column>
        </el-table>
        <viewMedia v-if="viewMediaVisible" ref="viewMedia" ></viewMedia>
        <viewChart v-if="viewChartVisible" ref="viewChart" ></viewChart>
      </div>
  </el-dialog>
</template>

<script>
  import viewMedia from './viewmedia'
  import viewChart from './viewchart'
  export default {
    data () {
      return {
        dataList: [],
        dataListLoading: false,
        viewMediaVisible: false,
        viewChartVisible: false,
        visible: false,
        inspectionType: ''
      }
    },
    components: {
      viewMedia,
      viewChart
    },
    methods: {
      // 获取数据列表
      init (id, inspectionType) {
        this.inspectionType = inspectionType
        this.visible = true
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/inspectionresult/query'),
          method: 'get',
          params: this.$http.adornParams({
            'id': id
          })
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === 0) {
            this.dataList = data.page.list
          } else {
            this.dataList = []
          }
          this.dataListLoading = false
        })
      },
      view (type, url) {
        if (type !== 'data') {
          this.viewMediaVisible = true
          this.$nextTick(() => {
            this.$refs.viewMedia.init(type, url)
          })
        } else {
          this.viewChartVisible = true
          this.$nextTick(() => {
            this.$refs.viewChart.init(this.inspectionType, url)
          })
        }
      },
      changeImg (type) {
        if (type === 'jpg') {
          return 'chakan'
        }
        if (type === 'png') {
          return 'chakan'
        }
        if (type === 'mp3') {
          return 'shengyin'
        }
        if (type === 'data') {
          return 'tubiao'
        }
      },
      rowStyle ({row, rowIndex}) {
        return 'height:30px'
      },
      cellStyle () {
        return 'padding:0'
      }
    }
  }
</script>

<style>
</style>
