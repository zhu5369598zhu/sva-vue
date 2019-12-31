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
      },
      inspectMiss: {
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
            y: '10px',
            textStyle: {
              fontStyle: 'normal',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              fontSize: 20
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
          grid: {
            top: 100,
            bottom: 80
          },
          series: [
            {
              name: '漏检',
              type: 'bar',
              barWidth: 22,
              label: labelOption,
              data: this.inspectMiss
            },
            {
              name: '已检',
              type: 'bar',
              barWidth: 22,
              label: labelOption,
              data: this.inspected
            },
            {
              name: '应检',
              type: 'bar',
              barGap: 0,
              barWidth: 22,
              label: labelOption,
              data: this.inspect
            }
          ],
          dataZoom:[
            {
              type: 'slider',
              show: true,
              xAxisIndex: [0],
              left: '9%',
              bottom: 20,
              start: 10,
              end: 200
            }
          ]
        }
        this.Chart = echarts.init(document.getElementById(chartElement))
        this.Chart.setOption(option)
        this.Chart.resize()
        window.addEventListener('resize', function () {
          const path = this.$route.path
          if (path === this.path) {
            this.Chart.resize()
          }
        }.bind(this))
      },
      changeSize() {
        this.$nextTick(() => {
          this.Chart.resize()
        })
      }
    }
  }
</script>
