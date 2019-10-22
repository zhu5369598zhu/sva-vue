<template>
  <div class="charts">
      <div class="chart-bar" align="center"></div>
  </div>
</template>

<script>
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/title')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  export default {
    props: {
      title: {
        type: String
      },
      legend: {
        type: Array
      },
      category: {
        type: Array
      },
      series: {
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
        var labelOption = {
          normal: {
            show: false
          }
        }
        var option = {
          color: ['#e3724e', '#30a231', '#257ae2'],
          tooltip: {
            trigger: 'axis'
          },
          title: {
            text: this.title,
            x: 'center',
            y: '5px',
            textStyle: {
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              fontSize: 22
            }
          },
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {show: true}
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
              name: '次数',
              type: 'bar',
              barWidth: 30,
              label: labelOption,
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
