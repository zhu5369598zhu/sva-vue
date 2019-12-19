<template>
  <div class="charts">
      <div class="chart-bar" align="center"></div>
  </div>
</template>

<script>
  // let echarts = require('echarts/lib/echarts')
  import echarts from 'echarts'
  // require('echarts/lib/chart/bar')
  // require('echarts/lib/component/title')
  // require('echarts/lib/component/tooltip')
  // require('echarts/lib/component/legend')
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
      inspect: {
        type: Array
      },
      inspected: {
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
        var labelOption = {
          normal: {
            show: false
          }
        }
        var option = {
          color: ['#257ae2', '#30a231'],
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
          legend: {
            data: this.legend,
            x: 'center',
            y: '40px'
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
              name: '应检',
              type: 'bar',
              barGap: 0,
              barWidth: 22,
              label: labelOption,
              data: this.inspect
            },
            {
              name: '已检',
              type: 'bar',
              barWidth: 22,
              label: labelOption,
              data: this.inspected
            }
          ],
          dataZoom:[
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              left: '9%',
              bottom: -5,
              start: 10,
              end: 200
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
