<template>
  <div class="mod-device" style="height: 100%;">
    <div class="show-data-content" id="show-data-content">
    <split-pane split="vertical" ref="splitPane"  :min-percent="0" :default-percent="curPercent" @resize="resize">
      <template slot="paneL" >
        <div class="show-left" style="height: calc(100% - 18px);">
        <div class="org_title">
          <span v-if="this.isDrawBack===false">机构列表</span style="vertical-align: middle;"><i :class="drawBackClass" style="float:right;cursor:pointer;" @click="onDrawBack"></i>
        </div>
        <depttree @deptSelectEvent="handleDeptSelect" v-if="this.isDrawBack===false"></depttree>
        </div>
      </template>
   <template slot="paneR">
    <div class="show-data-table">
      <div class="show-data-up">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input placeholder="请输入内容" v-model="key" size="mini">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.lable"
              :value="item.value">
            </el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="search()" size="mini">查询</el-button>
        <el-button @click="printAllHandle()" :disabled="dataList.length <= 0" size="mini">打印全部</el-button>
        <el-button @click="printSelectedHandle()" :disabled="dataListSelections.length <= 0" size="mini">打印已选</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="table"
      :height="tableHeight"
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      :cell-style="cellStyle"
      :row-style="rowStyle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        fixed
        type="index"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        fixed
        prop="deviceName"
        header-align="center"
        align="center"
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="deptName"
        header-align="center"
        align="center"
        label="所属机构">
      </el-table-column>
      <el-table-column
        prop="deviceCode"
        header-align="center"
        align="center"
        label="设备编码">
      </el-table-column>
      </el-table-column>
      <el-table-column
        prop="deviceLevelName"
        header-align="center"
        align="center"
        label="设备等级">
      </el-table-column>
      <el-table-column
        prop="manufactureDate"
        header-align="center"
        align="center"
        width="150"
        label="生产日期">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="下载二维码">
        <template slot-scope="scope">
          <a :href="getDownload(scope.row.deviceId)" download="qrcode.png"><img :src="getQrcode(scope.row.deviceId)" width="20"></img></a>
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
    <deviceAdd v-if="deviceAddVisible" ref="deviceAdd" @refreshDataList="getDataList"></deviceAdd>
    <deviceUpdate v-if="deviceUpdateVisible" ref="deviceUpdate" @refreshDataList="getDataList"></deviceUpdate>
  </div>
  </div>
  </template>
  </split-pane>
  </div>
  </div>
</template>

<script>
  import depttree from '@/components/dept-tree'
  import deviceAdd from './device-add'
  import deviceUpdate from './device-update'
  import splitPane from '@/components/split-pane'
  export default {
    data () {
      return {
        dataForm: {
          deptId: null
        },
        tableHeight: 300,
        isDrawBack: false,
        drawBackClass: 'el-icon-d-arrow-left',
        curPercent: 12,
        oldPercent: 12,
        key: '',
        select: 'deviceName',
        selectList: [{lable: '设备名称', value: 'deviceName'}, {lable: '设备编码', value: 'deviceCode'}],
        dataList: [],
        allDataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        deviceAddVisible: false,
        deviceUpdateVisible: false,
        toPrintQrcodeVisible: false,
        printDataList: [],
        timer: null,
        html: null
      }
    },
    components: {
      depttree,
      deviceAdd,
      deviceUpdate,
      splitPane
    },
    activated () {
      this.getDataList()
      this.getDeviceLevelList()
    },
    methods: {
      getDeviceLevelList () {
        if (this.deviceLevelList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/devicelevel/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deviceLevelList = data.page.list.map(item=>item.name)
          })
        }
      },
      test () {
        window.print()
      },
      getDownload (deviceId) {
        return this.$http.adornUrl(`/inspection/deviceqrcode/download?deviceId=${deviceId}&token=${this.$cookie.get('token')}`)
      },
      getQrcode (deviceId) {
        return this.$http.adornUrl(`/inspection/deviceqrcode/qrcode.png?deviceId=${deviceId}`)
      },
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
        this.dataForm.deptId = null
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/device/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'deptId': this.dataForm.deptId,
            'filterkey': this.select,
            'key': this.key
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
      handleDeptSelect (val) {
        this.dataList = []
        this.deviceList = []
        this.dataForm.deptId = val
        this.getDataList()
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
        return 'height:40px'
      },
      cellStyle () {
        return 'padding:0'
      },
      // 新增
      deviceAddHandle (id) {
        this.deviceAddVisible = true
        this.$nextTick(() => {
          this.$refs.deviceAdd.dataForm.deviceDept = this.dataForm.deptId
          this.$refs.deviceAdd.getDeviceLevelList()
          this.$refs.deviceAdd.getDeptList()
          this.$refs.deviceAdd.init(id)
        })
      },
      // 修改
      deviceUpdateHandle (id) {
        this.deviceUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.deviceUpdate.dataForm.deviceDept = this.dataForm.deptId
          this.$refs.deviceUpdate.getDeviceLevelList()
          this.$refs.deviceUpdate.getDeptList()
          this.$refs.deviceUpdate.init(id)
        })
      },
      // 打印已选
      printSelectedHandle () {
        this.printQrcode(this.dataListSelections)
        this.worktimer()
      },
      printAllHandle () {
        this.$http({
          url: this.$http.adornUrl('/inspection/device/export'),
          method: 'get',
          params: this.$http.adornParams({
            'deptId': this.dataForm.deptId,
            'filterkey': this.select,
            'key': this.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.printQrcode(data.list)
          } else {
            this.$message.error(data.msg)
          }
        })
        this.worktimer()
      },
      // 监控图片加载完成 定时任务
      worktimer () {
        const that = this
        that.worktimer = setInterval(function () {
          console.log('运行了')
          this.timer += 1000
          if (document.readyState === 'complete') {
            console.log('加载完成')
            console.log('最后的时间' + this.timer)
            window.clearInterval(that.worktimer)
          }
        }, 1000)
      },
      printQrcode (printDataList) {
        let pLength = printDataList.length
        let headStr = 
        `<html>
          <head>
            <title>二维码打印</title>
            <style>
              html,body{
                width: 100%;
                height: 100%;
              }
              *{
                margin: 0;
                padding: 0;
              }
              #mask{
                position: fixed;
                top: 0;
                left: 0;
                background-color: rgba(0,0,0,0.9);
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-size: 2rem;
                letter-spacing: 0.5rem;
                text-transform: uppercase;
              }
              #mask span {
                animation: shrink 2s infinite;
              }
              @keyframes shrink {
                50% {
                  transform: scale(0);
                }
              }
            </style>
          </head>
          <body>`
        let footStr = '</body></html>'
        let printBeforeStr = '<em style="padding: 10px;text-align: center"><div align="center"><table style="border-collapse:collapse;width: auto;"><tr style="display:block; padding:10px; margin-bottom:50px;">'
        let printContent = ''
        let qrcodeUrl = this.$http.adornUrl(`/inspection/deviceqrcode/qrcode.png?deviceId=`)
        for (let i = 0; i < pLength; i++) {
          if (i !== 6 && i !== 0 && i % 2 === 0 && i !== pLength) {
            printContent += '</tr><tr style="display:block; padding:10px; margin-bottom:50px;">'
          } else if (i === 6) {
            printContent += '</tr><tr style="display:block; padding:10px; margin-bottom:50px;">'
          }
          if (i % 2 === 0) {
            printContent += '<td width="50%" height="250" style="padding-left:0px;">'
          } else {
            printContent += '<td width="50%" height="250" style="padding-left:100px;">'
          }
          let deviceId = printDataList[i].deviceId
          printContent += '<div align="center"><img width="250" src="' + qrcodeUrl + deviceId + '"></img></div><div style="text-align: center"><strong>' + printDataList[i].deviceName + '</strong></div></td>'
        }
        let printAfter = '</tr></table></div></em><div id="mask">正在加载中...</div>'
        const scriptAfter = 
        `<script>
          let loading = document.getElementById('mask');
          let letters = loading.textContent.split("");
          loading.textContent = "";
          letters.forEach((letter, i) => {
            let span = document.createElement("span");
            span.textContent = letter;
            span.style.animationDelay = i / 10 + 's';
            loading.append(span);
          });
          let num = document.getElementsByTagName('img').length
          const d = num
          for (var i = 0; i < d; i++) {
            document.getElementsByTagName('img')[i].onload = function() {
              num = num - 1
              if (num === 0) {
                document.getElementById('mask').style.display = "none";
                window.print()
                window.close()
              }
            }
          }
        <\/script>`
        let printHtml = printBeforeStr + printContent + printAfter + scriptAfter
        var printWin = window.open('')
        printWin.document.write(headStr + printHtml + footStr)
        printWin.focus()
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

<style>
  .el-select .el-input {
      width: 110px;

    }
</style>
