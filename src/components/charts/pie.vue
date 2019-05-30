<template>
  <div class="charts">
    <div class="chart-up">
      <div class="chart-header">
        <span class="title">巡检完成率</span><span class="date" v-model="today">{{today}}</span>
      </div>
    </div>
    <div class="chart-down">
      <div ref="chartPie" class="chart-pie" align="center"></div>
    </div>
  </div>
</template>

<script>
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/pie')
  require('echarts/lib/component/title')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  export default {
    data () {
      return {
        today: '',
        chart: null,
        x: '',
        y: ''
      }
    },
    activated () {
      this.initChart()
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
          color: ['#77d5ff', '#257ae2'],
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['正常', '异常']
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
          calculable: true,
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              itemStyle: {
                normal: {
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    position: 'center',
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                }
              },
              data: [
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'}
              ]
            }
          ]
        }
        this.Chart = echarts.init(document.querySelector('.chart-pie'))
        this.Chart.setOption(option)

        window.addEventListener('resize', function () {
          this.x = this.$refs.chartPie.offsetWidth / 2
          this.y = 0
          var option = {
            legend: {
              orient: 'vertical',
              x: this.x,
              y: this.y
            }
          }
          this.Chart.setOption(option)
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
  .chart-pie {
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
