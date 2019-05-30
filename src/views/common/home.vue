<template>
  <div class="mod-home">
    <div class="show-data-content">
      <el-row :gutter="10" class="home-row-main">
        <el-col :span="8" class="home-col-left" >
          <el-row :gutter="10" class="home-row-up">
            <div class="show-chart">
              <chartbar :category="category" :bad="bad" :normal="normal" :all="all"></chartbar>
            </div>
          </el-row>
          <el-row :gutter="10" class="home-row-down">
            <div class="show-chart">
              <chartpie></chartpie>
            </div>
          </el-row>
        </el-col>
        <el-col :span="12" class="home-col-middle">
          <el-row :gutter="10" class="home-row-up">
            <div class="show-chart">
              <chartcolumn></chartcolumn>
            </div>
          </el-row>
          <el-row :gutter="10" class="home-row-down">
            <div class="show-chart">
              <chartline></chartline>
            </div>
          </el-row>
        </el-col>
        <el-col :span="4" class="home-col-right">
          <el-row :gutter="10" class="home-row-right">
            <div class="show-chart">
              <chartlink></chartlink>
            </div>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import chartbar from '@/components/charts/bar'
  import chartpie from '@/components/charts/pie'
  import chartline from '@/components/charts/line'
  import chartcolumn from '@/components/charts/column'
  import chartlink from '@/components/charts/link'
export default {
    data () {
      return {
        category: ['2012', '2013', '2014', '2015', '2016'],
        bad: [320, 332, 301, 334, 390],
        normal: [320, 332, 301, 334, 390],
        all: [320, 332, 301, 334, 390]
      }
    },
    components: {
      chartbar,
      chartpie,
      chartline,
      chartcolumn,
      chartlink
    },
    methods: {
    }
}
</script>

<style>
  .mod-home {
    position: relative;
    height: 100%;
    line-height: 1.5;
    background-color: #f1f4f5;
    overflow: hidden;
    
  }
  .home-row-main {
    width: 100%;
    height: 100%;
  }
  .home-row-up {
    width: 100%;
    height: 50%;
    margin-bottom: 10px;
  }
  .home-row-down {
    width: 100%;
    height: 50%;
    margin-bottom: 10px;
  }
  .home-col-left{
    position: relative;
    height: 100%;
  }
  .home-col-middle{
    position: relative;
    height: 100%;
  }
  .home-col-right{
    position: relative;
    height: 100%;
  }
  .home-row-right{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .show-chart {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
    padding-bottom: 10px;
  }
</style>

