<template>
  <div class="charts">
      <div class="chart-bar" align="center"></div>
  </div>
</template>

<script>
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
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
      initChart () {
        var option = {
          color: ['#e3724e', '#30a231'],
          title: {
            text: this.title,
            x: 'center',
            y: '5px'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            data: this.legend,
            x: 'center',
            y: '40px'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {
                show: true,
                type: ['pie', 'funnel'],
                option: {
                  funnel: {
                    x: '25%',
                    width: '50%',
                    funnelAlign: 'center',
                    max: 1548
                  }
                }
              },
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: this.series,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        this.Chart = echarts.init(document.querySelector('.chart-bar'))
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
  .chart-up {
    width: 100%;
    height: 15%;
  }
  .chart-down {
    width: 100%;
    height: 85%;
  }
  .chart-header {
    padding-bottom:14px;
    border-bottom:1px solid #E1E1E1;
    padding: 14px;
    margin-bottom: 30px;
  }
  .chart-bar {
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
