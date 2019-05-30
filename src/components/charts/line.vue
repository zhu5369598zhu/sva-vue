<template>
  <div class="charts">
    <div class="chart-down">
      <div class="chart-line" align="center"></div>
    </div>
  </div>
</template>

<script>
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/line')
  require('echarts/lib/component/title')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  export default {
    props: {
      title: {
        type: String
      },
      category: {
        type: Array
      },
      series: {
        type: Array
      }
    },
    data () {
      return {
        chart: null
      }
    },
    components: {
      echarts
    },
    mounted () {
      this.initChart()
    },
    methods: {
      initChart () {
        var option = {
          title: {
            text: this.title,
            x: 'center',
            y: '5px'
          },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            show: true,
            feature: {
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: false},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#218ae2',
                  width: '1'
                }
              },
              axisLabel: {
                textStyle: {
                  color: 'black'
                }
              },
              boundaryGap: false,
              data: this.category
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#218ae2',
                  width: '1'
                }
              },
              axisLabel: {
                textStyle: {
                  color: 'black'
                }
              }
            }
          ],
          series: [
            {
              type: 'line',
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#72cdff',
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
              },
              data: this.series
            }
          ]
        }
        this.Chart = echarts.init(document.querySelector('.chart-line'))
        this.Chart.setOption(option)
        var _self = this
        this.Chart.on('dblclick', function (params) {
          _self.$emit('dblclick', params.dataIndex)
        })

        window.addEventListener('resize', function () {
          this.Chart.resize()
        }.bind(this))
      }
    }
  }
</script>

<style>
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
