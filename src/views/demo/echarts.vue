<template>
  <div class="mod-demo-echarts">
    <el-alert title="提示：" type="warning" :closable="false">
      <div slot-scope="description">
        <p class="el-alert__description">1. 此Demo只提供ECharts官方使用文档，入门部署和体验功能。具体使用请参考：http://echarts.baidu.com/index.html</p>
      </div>
    </el-alert>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div id="J_chartLineBox" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="J_chartBarBox" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="J_chartPieBox" class="chart-box"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="J_chartScatterBox" class="chart-box"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    data () {
      return {
        chartLine: null,
        chartBar: null,
        chartPie: null,
        chartScatter: null
      }
    },
    mounted () {
      this.initChartLine()
      this.initChartBar()
      this.initChartPie()
      this.initChartScatter()
    },
    activated () {
      // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
      if (this.chartLine) {
        this.chartLine.resize()
      }
      if (this.chartBar) {
        this.chartBar.resize()
      }
      if (this.chartPie) {
        this.chartPie.resize()
      }
      if (this.chartScatter) {
        this.chartScatter.resize()
      }
    },
    methods: {
      // 折线图
      initChartLine () {
        var option = {
          'title': {
            'text': '折线图堆叠'
          },
          'tooltip': {
            'trigger': 'axis'
          },
          'legend': {
            'data': ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
          },
          'grid': {
            'left': '3%',
            'right': '4%',
            'bottom': '3%',
            'containLabel': true
          },
          'toolbox': {
            'feature': {
              'saveAsImage': {}
            }
          },
          'xAxis': {
            'type': 'category',
            'boundaryGap': false,
            'data': ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          },
          'yAxis': {
            'type': 'value'
          },
          'series': [{
            'name': '邮件营销',
            'type': 'line',
            'stack': '总量',
            'data': [120, 132, 101, 134, 90, 230, 210]
          },
          {
            'name': '联盟广告',
            'type': 'line',
            'stack': '总量',
            'data': [220, 182, 191, 234, 290, 330, 310]
          },
          {
            'name': '视频广告',
            'type': 'line',
            'stack': '总量',
            'data': [150, 232, 201, 154, 190, 330, 410]
          },
          {
            'name': '直接访问',
            'type': 'line',
            'stack': '总量',
            'data': [320, 332, 301, 334, 390, 330, 320]
          },
          {
            'name': '搜索引擎',
            'type': 'line',
            'stack': '总量',
            'data': [820, 932, 901, 934, 1290, 1330, 1320]
          }]
        }
        this.chartLine = echarts.init(document.getElementById('J_chartLineBox'), 'blue')
        this.chartLine.setOption(option)
        window.addEventListener('resize', () => {
          this.chartLine.resize()
        })
      },
      // 柱状图
      initChartBar () {
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎', '百度', '谷歌', '必应', '其他']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: '直接访问',
            type: 'bar',
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '邮件营销',
            type: 'bar',
            stack: '广告',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'bar',
            stack: '广告',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '视频广告',
            type: 'bar',
            stack: '广告',
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '搜索引擎',
            type: 'bar',
            data: [862, 1018, 964, 1026, 1679, 1600, 1570],
            markLine: {
              lineStyle: {
                normal: {
                  type: 'dashed'
                }
              },
              data: [
                [{
                  type: 'min'
                }, {
                  type: 'max'
                }]
              ]
            }
          },
          {
            name: '百度',
            type: 'bar',
            barWidth: 5,
            stack: '搜索引擎',
            data: [620, 732, 701, 734, 1090, 1130, 1120]
          },
          {
            name: '谷歌',
            type: 'bar',
            stack: '搜索引擎',
            data: [120, 132, 101, 134, 290, 230, 220]
          },
          {
            name: '必应',
            type: 'bar',
            stack: '搜索引擎',
            data: [60, 72, 71, 74, 190, 130, 110]
          },
          {
            name: '其他',
            type: 'bar',
            stack: '搜索引擎',
            data: [62, 82, 91, 84, 109, 110, 120]
          }]
        }
        this.chartBar = echarts.init(document.getElementById('J_chartBarBox'))
        this.chartBar.setOption(option)
        window.addEventListener('resize', () => {
          this.chartBar.resize()
        })
      },
      // 饼状图
      initChartPie () {
        var option = {
          backgroundColor: '#2c343c',
          title: {
            text: 'Customized Pie',
            left: 'center',
            top: 20,
            textStyle: {
              color: '#ccc'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
              colorLightness: [0, 1]
            }
          },
          series: [{
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [{
              value: 335,
              name: '直接访问'
            },
            {
              value: 310,
              name: '邮件营销'
            },
            {
              value: 274,
              name: '联盟广告'
            },
            {
              value: 235,
              name: '视频广告'
            },
            {
              value: 400,
              name: '搜索引擎'
            }].sort(function (a, b) {
              return a.value - b.value
            }),
            roseType: 'radius',
            label: {
              normal: {
                textStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                }
              }
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.3)'
                },
                smooth: 0.2,
                length: 10,
                length2: 20
              }
            },
            itemStyle: {
              normal: {
                color: '#c23531',
                shadowBlur: 200,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200
            }
          }]
        }
        this.chartPie = echarts.init(document.getElementById('J_chartPieBox'))
        this.chartPie.setOption(option)

        window.addEventListener('resize', () => {
          this.chartPie.resize()
        })
      },
      // 散点图
      initChartScatter () {
        var dataStyle = {
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          }
        }
        var placeHolderStyle = {
          normal: {
            color: 'rgba(0,0,0,0)',
            label: {
              show: false
            },
            labelLine: {
              show: false
            }
          },
          emphasis: {
            color: 'rgba(0,0,0,0)'
          }
        }
        var option = {
          title: {
            text: '你幸福吗？',
            subtext: 'From ExcelHome',
            sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
            x: 'center',
            y: 'center',
            itemGap: 20,
            textStyle: {
              color: 'rgba(30,144,255,0.8)',
              fontFamily: '微软雅黑',
              fontSize: 35,
              fontWeight: 'bolder'
            }
          },
          tooltip: {
            show: true,
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: document.getElementById('main').offsetWidth / 2,
            y: 45,
            itemGap: 12,
            data: ['68%的人表示过的不错', '29%的人表示生活压力很大', '3%的人表示“我姓曾”']
          },
          toolbox: {
            show: true,
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          series: [{
            name: '1',
            type: 'pie',
            clockWise: false,
            radius: [125, 150],
            itemStyle: dataStyle,
            data: [{
              value: 68,
              name: '68%的人表示过的不错'
            },
            {
              value: 32,
              name: 'invisible',
              itemStyle: placeHolderStyle
            }
            ]
          },
          {
            name: '2',
            type: 'pie',
            clockWise: false,
            radius: [100, 125],
            itemStyle: dataStyle,
            data: [{
              value: 29,
              name: '29%的人表示生活压力很大'
            },
            {
              value: 71,
              name: 'invisible',
              itemStyle: placeHolderStyle
            }
            ]
          },
          {
            name: '3',
            type: 'pie',
            clockWise: false,
            radius: [75, 100],
            itemStyle: dataStyle,
            data: [{
              value: 3,
              name: '3%的人表示“我姓曾”'
            },
            {
              value: 97,
              name: 'invisible',
              itemStyle: placeHolderStyle
            }
            ]
          }]
        }
        this.chartScatter = echarts.init(document.getElementById('J_chartScatterBox'))
        this.chartScatter.setOption(option)
        window.addEventListener('resize', () => {
          this.chartScatter.resize()
        })
      }
    }
  }
</script>

<style lang="scss">
  .mod-demo-echarts {
    >.el-alert {
      margin-bottom: 10px;
    }

    >.el-row {
      margin-top: -10px;
      margin-bottom: -10px;

      .el-col {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }

    .chart-box {
      min-height: 400px;
    }
  }
</style>
