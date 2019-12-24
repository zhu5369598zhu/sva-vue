<template>
  <div class="charts">
    <div class="chart-down">
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
      },
      yAxisMin:{
        type: Number
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
        var option = {
          title: {
            text: this.title,
            x: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            x: '100px',
            y: '20px',
            show: true,
            feature: {
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true},
              dataZoom: {
                yAxisIndex: 'none'
              }
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
              minInterval: 1, // 设置最小步长
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
          dataZoom: [
            {
              type: 'inside',
              show: true,
              realtime: true,
              start: 0,
              end: 10
            }, {
              start: 0,
              end: 10,
              handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
              handleSize: '80%',
              handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
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
        this.Chart = echarts.init(document.getElementById(chartElement))
        this.Chart.setOption(option)
        var _self = this
        this.Chart.on('dblclick', function (params) {
          _self.$emit('dblclick', params.dataIndex)
        })

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
