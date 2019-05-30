<template>
  <div class="common-device-tree">
  <el-tree
    :data="lineList"
    :props="lineTreeProps"
    node-key="id"
    @current-change="selectTreeCurrentChangeHandle"
    :default-expand-all="false"
    :default-expanded-keys="lines"
    :highlight-current="true"
    :expand-on-click-node="false">
    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span v-if="data.type === 'device'">
            <icon-svg name="shezhi" style="font-size:20px;vertical-align: middle;"></icon-svg><span>&nbsp;</span><span style="font-size: 12px;vertical-align: middle;">{{ node.label }}[{{data.code}}]</span>
        </span>  
        <span v-if="data.type === 'dept'">
            {{ node.label }}
        </span> 
        <span v-if="data.type === 'line'">
            <icon-svg name="mudedi" style="font-size:20px;vertical-align: middle;"></icon-svg><span>&nbsp;</span><span style="font-size: 12px;vertical-align: middle;">{{ node.label }}</span>
        </span>
        <span v-if="data.type === 'item'">
            <icon-svg name="dangdifill" style="font-size:20px;vertical-align: middle;"></icon-svg><span>&nbsp;</span><span style="font-size: 12px;vertical-align: middle;">{{ node.label }}</span>
        </span>
    </span>
  </el-tree>
  </div>
</template>

<script>
  export default {
    props: {
      inspectionType: {
        type: String
      }
    },
    data () {
      return {
        lineTreeProps: {
          label: 'lable',
          children: 'children'
        },
        lines: []
      }
    },
    components: {

    },
    activated () {
      this.getLineList()
    },
    methods: {
      // 获取数据列表
      getLineList () {
        this.$http({
          url: this.$http.adornUrl(`/inspection/device/linetree`),
          method: 'get',
          params: this.$http.adornParams({
            'inspectionType': this.inspectionType
          })
        }).then(({data}) => {
          console.log(data)
          this.lineList = data.lineTree
          this.selectLine(data.lineTree)
          console.log(this.lines)
        })
      },
      selectLine (node) {
        if (node !== undefined) {
          node.map(m => {
            if (m.type === 'dept') {
              this.lines.push(m.id)
            }
          })
        }
      },
      // 部门树选中
      selectTreeCurrentChangeHandle (data, node) {
        this.deptId = data.id
        this.$emit('TreeSelectEvent', data)
      }
    },
    computed: {
      lineList: {
        get () { return this.$store.state.deptLine.lineList },
        set (val) { this.$store.commit('deptLine/updateLineList', val) }
      }
    }
  }
</script>

<style>
  .common-device-tree {
    mini-height: 300px;
    Border: 1px solid #ebeef5;
  }
  .search {
    width:100%;
    padding: 3px 0px 3px;
    Border-bottom: 1px solid #ebeef5;
  }
  .el-tree-node:focus>.el-tree-node__content{
    background-color: rgb(231, 247, 251);
  }
  .title {
    display: block;
    height: 46px;
    padding: 10px;
    color: #909399;
    font-size: 14px;
  }
  .common-device-tree .el-form-item{
    margin-bottom: 0px;
  }
  
  .device{
    background-color: rgb(231, 247, 251);
  }
</style>
