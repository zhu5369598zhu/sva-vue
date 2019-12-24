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
      unNormal: {
        type: Array
      },
      normal: {
        type: Array
      },
      all: {
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
              name: '异常',
              type: 'bar',
              barGap: 0,
              barWidth: 30,
              label: labelOption,
              data: this.unNormal
            },
            {
              name: '正常',
              type: 'bar',
              barWidth: 30,
              label: labelOption,
              data: this.normal
            },
            {
              name: '全部',
              type: 'bar',
              barWidth: 30,
              label: labelOption,
              data: this.all
            }
          ]
        }
        this.Chart = echarts.init(document.getElementById(chartElement))
        this.Chart.setOption(option)
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
