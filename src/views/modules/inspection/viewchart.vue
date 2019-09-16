<template>
  <el-dialog style="z-index:1"
    :close-on-click-modal="false"
    :modal=false
    v-dialog-drag
    v-if="visible"
    :visible.sync="visible"
    >
    <div class="view-chart" align="center" style="height:520px;">
      <div v-show="hasData===true" class="chart-container">
        <div class="remark" v-html="timeRemark"></div>
        <div :id="timeChartId" style="width:100%;height:260px;">
          <chartline ref="timeDomainChart" :category="timeXData" :series="timeYData" title="时域图"></chartline>
        </div>
      </div>
      <div v-show="hasData===true" class="chart-container">
        <div class="remark" v-html="fftRemark"></div>
        <div :id="fftChartId" style="width:100%;height:260px;">
          <chartline ref="FftDomainChart" :category="fftXData" :series="fftYData" title="频域图"></chartline>
        </div>
      </div>
      <div class="no-data" align="center" v-show="hasData===false" style="width:400px;height:400px;">{{tip}}</div>
    </div>
  </el-dialog>
</template>
<script>
  import vueAudio from '@/components/vue-audio'
  import chartline from '@/components/charts/line'
  export default {
    data () {
      return {
        guid: '',
        fftChartId: '',
        timeChartId: '',
        visible: false,
        hasData: false,
        timeXData: [],
        timeYData: [],
        fftXData: [],
        fftYData: [],
        timeRemark: '',
        fftRemark: '',
        tip: '正在加载数据'
      }
    },
    components: {
      vueAudio,
      chartline
    },
    methods: {
      init (inspectionType, guid,inspection) {
        this.fftChartId = 'fft-domain-' + guid
        console.log(this.fftChartId)
        this.timeChartId = 'time-domain-' + guid
        this.hasData = false
        this.visible = true
        this.timeRemark = ''
        this.fftRemark = ''
        this.timeXData = []
        this.timeYData = []
        this.fftXData = []
        this.fftYData = []
        var requestUrl = ''
        if (inspection !== 'random'){
          requestUrl = `/inspection/inspectionresultmedia/${inspectionType}/${guid}`
        } else {
          requestUrl = `/inspection/inspectionrondomresultmedia/${inspectionType}/${guid}`
        }
        this.$http({
          url: this.$http.adornUrl(requestUrl),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log(data.chart.timeXData.length)
            if (data.chart.timeXData.length > 0) {
              this.hasData = true
            } else {
              this.tip = '暂无数据'
              this.hasData = false
            }
            this.timeXData = data.chart.timeXData
            this.timeYData = data.chart.timeYData
            this.fftXData = data.chart.fftXData
            this.fftYData = data.chart.fftYData
            this.timeRemark = '<br/>有效值：' + parseFloat(data.chart.rm).toFixed(2) + '<br/>' +
                              '峰&nbsp;&nbsp;值：' + parseFloat(data.chart.pk).toFixed(2) + '&nbsp;&nbsp;&nbsp;&nbsp;' + '峰峰值：' +
                              parseFloat(data.chart.pk2pk).toFixed(2)
            this.fftRemark = '幅值：' + parseFloat(data.chart.ff_first).toFixed(4) +
                            '&nbsp;&nbsp;&nbsp;&nbsp;' + '频率：' + parseFloat(data.chart.freq_first).toFixed(4) +
                            '<br/>' + '幅值：' + parseFloat(data.chart.ff_second).toFixed(4) +
                            '&nbsp;&nbsp;&nbsp;&nbsp;' + '频率：' + parseFloat(data.chart.freq_second).toFixed(4) +
                            '<br/>' + '幅值：' + parseFloat(data.chart.ff_third).toFixed(4) +
                            '&nbsp;&nbsp;&nbsp;&nbsp;' + '频率：' + parseFloat(data.chart.freq_third).toFixed(4)
            this.hasData = true
            this.drawChart()
          } else {
            this.$message.error(data.msg)
            this.hasData = false
          }
        })
      },
      drawChart () {
        if (this.hasData === true) {
          this.$nextTick(() => {
            this.$refs.timeDomainChart.initChart(this.timeChartId)
            this.$refs.FftDomainChart.initChart(this.fftChartId)
          })
        }
      }
    }
}
</script>


<style>
  .chart-container {
    position: relative;
    padding-top: 10px;
  }
  .no-data {
    font-size: 20px;
    margin-top: 30px;
  }
  .remark {
    position: absolute;
    left: 50px;
    top: -20px;
    text-align: left;
  }
</style>
