<template>
  <div class="charts">
    <div class="exception-chart-up">
      <div class="chart-header">
        <span class="title">设备状态分布</span>
      </div>
    </div>
    <div class="exception-chart-down">
      <div id="chartDevice" class="chart-link" align="center">
      </div>
    </div>
  </div>
</template>

<script>
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/sankey')
  require('echarts/lib/component/title')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  export default {
    props: {
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
        var option = {
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter: function (a) {
              if (a.data) {
                if (a.data.name) {
                  return a.data.name
                } else {
                  return (a.data.source + ' -> ' + a.data.target + ' : ' + a.data.value)
                }
              }
            }
          },
          series: {
            type: 'sankey',
            layout: 'none',
            focusNodeAdjacency: 'allEdges',
            data: [{
              itemStyle: {
                normal: {
                  color: '#257ae2',
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  areaStyle: {
                    type: 'default'
                  }
                }
              },
              name: 'A类'
            }, {
              itemStyle: {
                normal: {
                  color: '#73d4ff',
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  areaStyle: {
                    type: 'default'
                  }
                }
              },
              name: 'B类'
            }, {
              itemStyle: {
                normal: {
                  color: '#224190',
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  areaStyle: {
                    type: 'default'
                  }
                }
              },
              name: 'C类'
            }, {
              itemStyle: {
                normal: {
                  color: '#5ef37d',
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  areaStyle: {
                    type: 'default'
                  }
                }
              },
              name: '正常'
            }, {
              itemStyle: {
                normal: {
                  color: '#ff7f46',
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  areaStyle: {
                    type: 'default'
                  }
                }
              },
              name: '危险'
            }, {
              itemStyle: {
                normal: {
                  color: '#ffdc4d',
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                  areaStyle: {
                    type: 'default'
                  }
                }
              },
              name: '报警'
            }],
            links: this.series
          }
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
  .exception-chart-up {
    width: 100%;
    height: 7%;
  }
  .exception-chart-down {
    width: 100%;
    height: 93%;
  }
  .chart-header {
    padding-bottom:14px;
    border-bottom:1px solid #E1E1E1;
    padding: 14px;
  }
  .chart-link {
    width: 100%;
    height: 100%;
    padding-left: 25px;
    padding-top: 0px;
    padding-right: 0px;
    padding-bottom: 0px;
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
