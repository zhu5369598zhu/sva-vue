<template>
  <div class="mod-home">
    <div class="show-data-content">
      <el-row :gutter="10" class="home-row-main">
        <el-col :span="8" class="home-col-left" >
          <el-row :gutter="10" class="home-row-up">
            <div class="show-chart">
                <div class="charts">
                <div class="chart-up">
                  <div class="chart-header">
                    <span class="title">异常频度排名</span>
                  </div>
                   <el-table
                    ref="table"
                    :data="deviceExceptionTopList"
                    :border="false"
                    :show-header="false"
                    :cell-style="cellStyle"
                    :row-style="rowStyle"
                    style="width: 100%;">
                    <el-table-column
                      prop="deviceName"
                      header-align="center"
                      align="left"
                      label="">
                    </el-table-column>
                    <el-table-column 
                      prop="exceptionCount"
                      header-align="center"
                      align="right"
                      label="">
                    </el-table-column>
                    </el-table>
                </div>
              </div>
            </div>
          </el-row>
          <el-row :gutter="10" class="home-row-down">
            <div class="show-chart">
              <chartpie></chartpie>
            </div>
          </el-row>
        </el-col>
        <el-col :span="12" class="home-col-middle">
          <el-row :gutter="10" class="home-row-up">
            <div class="show-chart">
              <chartcolumn></chartcolumn>
            </div>
          </el-row>
          <el-row :gutter="10" class="home-row-down">
            <div class="show-chart">
              <chartline :category="category" :series="series"></chartline>
            </div>
          </el-row>
        </el-col>
        <el-col :span="4" class="home-col-right">
          <el-row :gutter="10" class="home-row-right">
            <div class="show-chart">
              <chartlink ref="chartLink" :series="series"></chartlink>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import chartbar from '@/components/charts/bar'
  import chartpie from '@/components/charts/pie'
  import chartline from '@/components/charts/lines'
  import chartcolumn from '@/components/charts/column'
  import chartlink from '@/components/charts/link'
export default {
    data () {
      return {
        hasData: false,
        statusList: [],
        series: [320, 332, 301, 334, 390],
        category: ['2012', '2013', '2014', '2015', '2016'],
        bad: [320, 332, 301, 334, 390],
        normal: [320, 332, 301, 334, 390],
        all: [320, 332, 301, 334, 390],
        deviceExceptionTopList: []
      }
    },
    components: {
      chartbar,
      chartpie,
      chartline,
      chartcolumn,
      chartlink
    },
    mounted () {
      this.getDataList()
    },
    methods: {
      getDataList () {
        this.getDeviceStatus()
        this.getDeviceExceptionTop()
      },
      getDeviceStatus () {
        this.$http({
          url: this.$http.adornUrl(`/inspection/device/getstatus`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === 0) {
            if (data.status.length > 0) {
              this.hasData = true
              this.series = data.status
            }
            this.statusList = data.status
            this.drawChart()
          } else {
            this.$message.error(data.msg)
            this.hasData = false
          }
        })
      },
      getDeviceExceptionTop () {
        this.$http({
          url: this.$http.adornUrl(`/inspection/device/getexceptiontop`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          console.log(data)
          if (data && data.code === 0) {
            this.deviceExceptionTopList = data.topList
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      drawChart () {
        if (this.hasData === true) {
          this.$nextTick(() => {
            this.$refs.chartLink.initChart('chartDevice')
            console.log('draw')
          })
        }
      },
      rowStyle ({row, rowIndex}) {
        return 'height:25px'
      },
      cellStyle () {
        return 'padding:0'
      }
    }
}
</script>

<style>
  .mod-home {
    position: relative;
    height: 100%;
    line-height: 1.5;
    background-color: #f1f4f5;
    overflow: hidden;
    
  }
  .home-row-main {
    width: 100%;
    height: 100%;
  }
  .home-row-up {
    width: 100%;
    height: 50%;
    margin-bottom: 10px;
  }
  .home-row-down {
    width: 100%;
    height: 50%;
    margin-bottom: 10px;
  }
  .home-col-left{
    position: relative;
    height: 100%;
  }
  .home-col-middle{
    position: relative;
    height: 100%;
  }
  .home-col-right{
    position: relative;
    height: 100%;
  }
  .home-row-right{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .show-chart {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
    padding-bottom: 10px;
  }

  .charts {
    width: 100%;
    height: 100%;
  }
  .char-up {
    width: 100%;
    height: 15%;
  }
  .char-down {
    width: 100%;
    height: 85%;
  }
  .chart-header {
    padding-bottom:14px;
    border-bottom:1px solid #E1E1E1;
    padding: 14px;
    margin-bottom: 30px;
  }
  .chart-line {
    width: 100%;
    height: 100%;
    padding: 14px;
  }
  .title {
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0.14px;
    text-align: center;
    padding-bottom:14px;
    border-bottom:2px solid #2097F2
  }
  .date {
    float: right;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #333333;
    letter-spacing: 0.14px;
    text-align: center;
  }
</style>

