<template>
  <div class="charts">
    <div class="chart-up">
      <div class="chart-header">
        <span class="title">异常分布</span>
      </div>
    </div>
    <div class="chart-down">
      <div class="chart-column" align="center"></div>
    </div>
  </div>
</template>

<script>
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/bar')
  require('echarts/lib/component/title')
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  export default {
    data () {
      return {
        chart: null
      }
    },
    components: {
      echarts
    },
    mounted () {
      this.initChart()
    },
    methods: {
      initChart () {
        var labelOption = {
          normal: {
            show: true,
            position: 'insideBottom',
            distance: 15,
            align: 'left',
            verticalAlign: 'middle',
            rotate: 90,
            formatter: '{c}  {name|{a}}',
            fontSize: 16,
            rich: {
              name: {
                textBorderColor: '#fff'
              }
            }
          }
        }
        var option = {
          color: ['#224190', '#257ae2', '#77d5ff'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['A类', 'B类', 'C类']
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
              data: ['2012', '2013', '2014', '2015', '2016']
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
              data: [320, 332, 301, 334, 390]
            },
            {
              name: 'B类',
              type: 'bar',
              label: labelOption,
              data: [220, 182, 191, 234, 290]
            },
            {
              name: 'C类',
              type: 'bar',
              label: labelOption,
              data: [150, 232, 201, 154, 190]
            }
          ]
        }
        this.Chart = echarts.init(document.querySelector('.chart-column'))
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
