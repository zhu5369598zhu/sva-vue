<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="线路名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="线路名称"></el-input>
    </el-form-item>
    <el-form-item label="线路类型" prop="type">
      <el-select v-model="dataForm.type" placeholder="线路类型">
        <el-option
          v-for="item in TypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属机构" prop="deptName">
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
          @current-change="deptListTreeCurrentChangeHandle"
          :default-expand-all="false"
          :highlight-current="true"
          :expand-on-click-node="false">
        </el-tree>
      </el-popover>
      <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="点击选择所属机构" class="dept-list__input"></el-input>
    </el-form-item>
    <el-form-item label="巡检周期" prop="periodType">
      <el-select v-model="dataForm.periodType" placeholder="巡检周期">
        <el-option
          v-for="item in periodTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input type="textarea"  row="2" v-model="dataForm.remark" placeholder="备注"></el-input>
    </el-form-item>
    <el-form-item label="排序" prop="orderNum">
      <el-input-number v-model="dataForm.orderNum" controls-position="right" label="排序"></el-input-number>
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
        visible: false,
        isShowDeptTree: false,
        deptList: [],
        TypeList: [{'id': 0, 'name': '扫码'}, {'id': 1, 'name': 'RFID'}],
        periodTypeList: [{'id': 1, 'name': '天'}, {'id': 2, 'name': '周'}, {'id': 3, 'name': '月'}],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          guid: '',
          name: '',
          type: '',
          deptId: 0,
          deptName: '',
          periodType: '',
          remark: '',
          createTime: '',
          updateTime: '',
          orderNum: 0
        },
        dataRule: {
          name: [
            { required: true, message: '线路名称不能为空', trigger: 'change' }
          ],
          type: [
            { required: true, message: '线路类型不能为空', trigger: 'change' }
          ],
          deptName: [
            { required: true, message: '所属机构不能为空', trigger: 'change' }
          ],
          periodType: [
            { required: true, message: '巡检周期不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
       // 获取部门列表
      getDeptList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data, 'deptId')
        })
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/inspection/inspectionline/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.guid = data.inspectionLine.guid
                this.dataForm.name = data.inspectionLine.name
                this.dataForm.type = data.inspectionLine.type
                this.dataForm.deptId = data.inspectionLine.deptId
                this.dataForm.deptName = data.inspectionLine.deptName
                this.dataForm.periodType = data.inspectionLine.periodType
                this.dataForm.remark = data.inspectionLine.remark
                this.dataForm.createTime = data.inspectionLine.createTime
                this.dataForm.updateTime = data.inspectionLine.updateTime
                this.dataForm.orderNum = data.inspectionLine.orderNum
                this.deptListTreeSetCurrentNode()
              }
            })
          }
        })
      },
      // 部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.deptId = data.deptId
        this.dataForm.deptName = data.name
        this.isShowDeptTree = false
      },
      // 部门树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
        this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/inspection/inspectionline/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'guid': this.dataForm.guid,
                'name': this.dataForm.name,
                'type': this.dataForm.type,
                'deptId': this.dataForm.deptId,
                'periodType': this.dataForm.periodType,
                'remark': this.dataForm.remark,
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
