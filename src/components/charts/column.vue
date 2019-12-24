<template>
</template>

<script>
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/title')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  export default {
    props: {
      legend: {
        type: Array
      },
      category: {
        type: Array
      },
      seriesA: {
        type: Array
      },
      seriesB: {
        type: Array
      },
      seriesC: {
        type: Array
      }
    },
    data () {
      return {
        chart: null,
        path: ''
      }
    },
    components: {
      echarts
    },
    mounted() {
      this.path = this.$route.path
    },
    methods: {
      initChart (chartElement) {
        var labelOption = {
          normal: {
            show: true,
            position: 'top',
            distance: 15,
            align: 'center',
            verticalAlign: 'middle',
            formatter: '{c}\n{name|{a}}',
            fontSize: 16,
            lineHeight: 18,
            rich: {
              name: {
                // textBorderColor: '#fff'
              }
            }
          }
        }
        var option = {
          color: ['#10348f', '#0769e1', '#03affc'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: this.legend
          },
          toolbox: {
            show: true,
            feature: {
              magicType: {show: true, type: ['line', 'bar']}
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              axisTick: {show: false},
              data: this.category
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: 'A类',
              type: 'bar',
              barGap: 0,
              label: labelOption,
              data: this.seriesA
            },
            {
              name: 'B类',
              type: 'bar',
              barGap: 0,
              label: labelOption,
              data: this.seriesB
            },
            {
              name: 'C类',
              type: 'bar',
              barGap: 0,
              label: labelOption,
              data: this.seriesC
            }
          ]
        }
        // 长度较验
        if (this.seriesA.length > 12) {
          for (const i in option.series) {
            option.series[i].label.normal.formatter = ''
          }
        }

        this.Chart = echarts.init(document.getElementById(chartElement))
        this.Chart.setOption(option)

        window.addEventListener('resize', function () {
          const path = this.$route.path
          if (path === this.path) {
            this.Chart.resize()
          }
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
  .chart-up {
    width: 100%;
    height: 15%;
  }
  .chart-down {
    width: 100%;
    height: 85%;
  }
  .chart-column {
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
