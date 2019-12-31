<template>
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
      a: {
        type: Number
      },
      b: {
        type: Number
      }
    },
    data () {
      return {
        chart: null,
        path: '',
        x: '',
        y: ''
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
          color: ['#06aef9', '#0366df'],
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
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
              type: 'pie',
              radius: ['50%', '70%'],
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false
                  }
                }
              },
              data: [
                {
                  value: this.a, 
                  name: '已完成',
                  label: {
                    normal: {
                      formatter: function(params){
                        return "已完成" + params.percent + "%";
                      },
                      position: 'center',
                      show: true,
                      textStyle : {
                        color : '#06aef9',
                        fontFamily : '微软雅黑',
                        fontSize : 18,
                        fontWeight : 'bolder'
                      }
                    }
                  },
                },
                {value: this.b, name: '未完成'}
              ]
            }
          ]
        }
        this.Chart = echarts.init(document.getElementById(chartElement))
        this.Chart.setOption(option)
        this.Chart.resize()
        window.addEventListener('resize', function () {
          const path = this.$route.path
          if (path === this.path) {
            this.Chart.setOption(option)
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
