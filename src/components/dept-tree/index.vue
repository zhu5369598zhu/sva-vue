<template>
  <div class="common-dept">
    <el-tree
      :data="deptList"
      :props="deptListTreeProps"
      node-key="deptId"
      ref="deptListTree"
      @current-change="deptListTreeCurrentChangeHandle"
      :default-expand-all="true"
      :highlight-current="true"
      :expand-on-click-node="false">
    </el-tree>
  </div>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          name: ''
        },
        deptListLoading: false,
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    components: {
      TableTreeColumn
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/tree'),
          method: 'get',
          params: this.$http.adornParams({'name': this.dataForm.name})
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data, 'deptId')
        })
      },
      handleCurrentChange (val) {
        if (val != null) {
          this.currentRow = val
          this.$emit('deptSelectEvent', this.currentRow.deptId)
        }
      },
      // 部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.deptId
        this.dataForm.parentName = data.name
        this.$emit('deptSelectEvent', data.deptId)
      }
    },
    computed: {
      deptList: {
        get () { return this.$store.state.dept.deptList },
        set (val) { this.$store.commit('dept/updateDeptList', val) }
      }
    }
}
</script>

<style>
  .common-dept {
    mini-height: 300px;
    width: 100%;
    Border: 1px solid #ebeef5;
  }
  .el-tree-node:focus>.el-tree-node__content{
    background-color: rgb(231, 247, 251);
  }
</style>
