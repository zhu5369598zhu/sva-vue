<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="机构名称"></el-input>
      </el-form-item>
      <el-form-item label="机构编码" prop="deptCode">
        <el-input v-model="dataForm.deptCode" placeholder="机构编码"></el-input>
      </el-form-item>
      <el-form-item label="上级机构" prop="parentName">
        <el-popover
          ref="deptListPopover"
          placement="bottom-start"
          trigger="click"
          v-model="isShowDeptTree">
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="deptId"
            ref="deptListTree"
            class="tree"
            @current-change="deptListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:deptListPopover :readonly="true" placeholder="点击选择上级机构" class="dept-list__input"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isHttp">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        isHttp: false,
        isShowDeptTree: false,
        visible: false,
        dataForm: {
          name: '',
          deptCode: '',
          parentId: 0,
          parentName: '',
          orderNum: 0
        },
        dataRule: {
          Name: [
            { required: true, message: '机构名称不能为空', trigger: 'change' }
          ],
          parentName: [
            { required: true, message: '上级机构不能为空', trigger: 'change' }
          ]
        },
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },

    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.isHttp = false
        this.$http({
          url: this.$http.adornUrl('/sys/dept/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data.deptList, 'deptId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.deptListTreeSetCurrentNode()
          } else {
            // 修改
            this.$http({
              url: this.$http.adornUrl(`/sys/dept/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.dataForm.id = data.sysDept.deptId
              this.dataForm.name = data.sysDept.name
              this.dataForm.deptCode = data.sysDept.deptCode
              this.dataForm.parentId = data.sysDept.parentId
              this.dataForm.orderNum = data.sysDept.orderNum
              this.deptListTreeSetCurrentNode()
            })
          }
        })
      },
      // 部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.deptId
        this.dataForm.parentName = data.name
        this.isShowDeptTree = false
      },
      // 部门树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },

      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/sys/dept/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'deptId': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'deptCode': this.dataForm.deptCode,
                'parentId': this.dataForm.parentId,
                'orderNum': this.dataForm.orderNum
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
    /*.el-tree-node__content {
    height: 46px;
    Border-bottom: 1px solid #ebeef5;
  }
  .el-tree-node:focus>.el-tree-node__content{
    background-color: rgb(231, 247, 251);
  }*/
  .tree{
    overflow-y: scroll;
    width:280px;
    height: 200px;
  }
</style>
