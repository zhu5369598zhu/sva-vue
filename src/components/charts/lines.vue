<template>
</template>

<script>
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/line')
  require('echarts/lib/component/title')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  export default {
    props: {
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
    methods: {
      initChart (chartElement) {
        console.log(this.category)
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
                  color: '#000',
                  width: '1'
                }
              },
              axisLabel: {
                textStyle: {
                  color: 'black'
                }
              },
              boundaryGap: true,
              data: this.category
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLine: {
                lineStyle: {
                  type: 'solid',
                  color: '#000',
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
                  color: '#257ae2',
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
        this.Chart = echarts.init(document.getElementById(chartElement))
        this.Chart.setOption(option)

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
