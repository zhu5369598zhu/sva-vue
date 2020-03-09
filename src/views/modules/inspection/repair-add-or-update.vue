<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '新增'"
    :close-on-click-modal="false"
    v-dialog-drag
    append-to-body="true"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="检修类型" prop="type">
      <el-input size="mini" v-model="dataForm.type" placeholder="检修类型"></el-input>
    </el-form-item>
    <el-form-item label="检修内容" prop="content">
      <el-input size="mini" v-model="dataForm.content" placeholder="检修内容"></el-input>
    </el-form-item>
    <el-form-item label="检修部门" prop="repairDept">
      <el-popover
        ref="deptListPopover"
        placement="bottom-start"
        trigger="click"
        v-model="isShowDeptTree">
        <el-tree
          :data="dataList"
          :props="deptListTreeProps"
          node-key="deptId"
          ref="deptListTree"
          class="tree"
          @current-change="deptListTreeCurrentChangeHandle"
          :default-expand-all="false"
          :highlight-current="true"
          :expand-on-click-node="false" clearable >
        </el-tree>
      </el-popover>
      <el-input size="mini" v-model="dataForm.repairDept"  v-popover:deptListPopover  class="dept-list__input" style="width:100%;" placeholder="部门"></el-input>
      <!--<el-input size="mini" v-model="dataForm.repairDept" placeholder="检修部门"></el-input>-->
    </el-form-item>
    <el-form-item label="检修日期" prop="repairtime">
      <!--<el-input size="mini"  v-model="dataForm.repairtime" placeholder="检修时间"></el-input>-->
      <el-date-picker size="mini" v-model="dataForm.repairtime" type="date" value-format="yyyy-MM-dd"  @change="handleStartTimeChange"  :picker-options="startDatePicker" placeholder="请选择日期" style="width: 100%;"></el-date-picker>
    </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-time-select placeholder="开始时间" v-model="dataForm.startTime" :picker-options="{ start: '00:00', step: '00:30', end: '24:00:00' }" size="mini" ></el-time-select>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-time-select placeholder="结束时间" v-model="dataForm.endTime" :picker-options="{ start: '00:00', step: '00:30', end: '24:00' }" size="mini" ></el-time-select>
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
        dataList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          type: '',
          content: '',
          repairDept: '',
          repairtime: '',
          startTime: '',
          endTime: '',
          deviceId: 0
        },
        dataRule: {
          type: [
            { required: true, message: '检修类型不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '检修内容不能为空', trigger: 'blur' }
          ],
          repairDept: [
            { required: true, message: '检修部门不能为空', trigger: 'change' }
          ],
          repairtime: [
            { required: true, message: '检修时间不能为空', trigger: 'change' }
          ],
          startTime: [
            { required: true, message: '开始时间不能为空', trigger: 'blur'}
          ],
          endTime: [
            { required: true, message: '结束时间不能为空', trigger: 'blur'}
          ]
        },
        startDatePicker: this.beginDate()
      }
    },mounted () {
      this.getDataList()      // 部门查询
    },
    methods: {
      handleStartTimeChange (val) {
        this.dataForm.repairtime = val
      },
      beginDate () {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now()//  开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      // 部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.deptId = data.deptId
        this.dataForm.repairDept = data.name
        this.isShowDeptTree = false
      },
      // 部门树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
        this.dataForm.repairDept = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      // 查询部门
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataList = treeDataTranslate(data, 'deptId')
        })
      },
      init (id,deviceId) {
        this.dataForm.id = id || 0
        this.dataForm.deviceId = deviceId
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/inspection/repair/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.type = data.repair.type
                this.dataForm.content = data.repair.content
                this.dataForm.repairDept = data.repair.repairDept
                this.dataForm.repairtime = data.repair.repairtime
                this.deptListTreeSetCurrentNode()
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            console.log(this.dataForm.id)
            // url: this.$http.adornUrl(`/inspection/repair/${!this.dataForm.id ? 'save' : 'update'}`),
            this.$http({
              url: this.$http.adornUrl(`/inspection/repair/save`),
              method: 'post',
              data: this.$http.adornData({
                // 'id': this.dataForm.id || undefined,
                'type': this.dataForm.type,
                'content': this.dataForm.content,
                'repairDept': this.dataForm.repairDept,
                'repairtime': this.dataForm.repairtime,
                'startTime': this.dataForm.startTime,
                'endTime': this.dataForm.endTime,
                'deviceId': this.dataForm.deviceId
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
