<template>
  <el-dialog style="z-index:1"
    :close-on-click-modal="true"
    :modal=true
    width="50%"
    :visible.sync="visible"
    append-to-body>
    <div class="view-chart" align="center" style="height:520px;">
      <div v-show="hasData===true" class="chart-container">
        <div class="remark" v-html="timeRemark"></div>
        <div id="time-domain" style="width:100%;height:260px;">
          <chartline ref="timeDomainChart" :category="timeXData" :series="timeYData" title="时域图"></chartline>
        </div>
      </div>
      <div v-show="hasData===true" class="chart-container">
        <div class="remark" v-html="fftRemark"></div>
        <div id="fft-domain" style="width:100%;height:260px;">
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
      init (inspectionType, guid) {
        console.log(inspectionType)
        this.visible = true
        this.timeXData = []
        this.timeYData = []
        this.fftXData = []
        this.fftYData = []
        this.$http({
          url: this.$http.adornUrl(`/inspection/inspectionresultmedia/${inspectionType}/${guid}`),
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
            this.timeYData = data.chart.timeYData.map(item => {
              return parseFloat(item).toFixed(2)
            })
            this.fftXData = data.chart.fftXData.map(item => {
              return parseFloat(item).toFixed(4)
            })
            this.fftYData = data.chart.fftYData.map(item => {
              return parseFloat(item).toFixed(4)
            })
            this.timeRemark = '<br/>有效值：' + parseFloat(data.chart.rm).toFixed(2) + '<br/>' +
                              '峰&nbsp;&nbsp;值：' + parseFloat(data.chart.pk).toFixed(2) + '&nbsp;&nbsp;&nbsp;&nbsp;' + '峰峰值：' +
                              parseFloat(data.chart.pk2pk).toFixed(2)
            this.fftRemark = '幅值：' + parseFloat(data.chart.ff_first).toFixed(4) +
                            '&nbsp;&nbsp;&nbsp;&nbsp;' + '频率：' + parseFloat(data.chart.freq_first).toFixed(4) +
                            '<br/>' + '幅值：' + parseFloat(data.chart.ff_second).toFixed(4) +
                            '&nbsp;&nbsp;&nbsp;&nbsp;' + '频率：' + parseFloat(data.chart.freq_second).toFixed(4) +
                            '<br/>' + '幅值：' + parseFloat(data.chart.ff_third).toFixed(4) +
                            '&nbsp;&nbsp;&nbsp;&nbsp;' + '频率：' + parseFloat(data.chart.freq_third).toFixed(4)
            this.drawChart()
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      drawChart () {
        if (this.hasData === true) {
          this.$nextTick(() => {
            this.$refs.timeDomainChart.initChart('time-domain')
            this.$refs.FftDomainChart.initChart('fft-domain')
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
