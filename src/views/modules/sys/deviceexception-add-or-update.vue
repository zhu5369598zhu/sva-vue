<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="设备等级id" prop="deviceLevel">
      <el-input v-model="dataForm.deviceLevel" placeholder="设备等级id"></el-input>
    </el-form-item>
    <el-form-item label="设备等级名称" prop="deviceLevelName">
      <el-input v-model="dataForm.deviceLevelName" placeholder="设备等级名称"></el-input>
    </el-form-item>
    <el-form-item label="所属机构" prop="deviceDept">
      <el-input v-model="dataForm.deviceDept" placeholder="所属机构"></el-input>
    </el-form-item>
    <el-form-item label="推送规则（1.按照用户推广，2按照角色推广）" prop="deviceSmsType">
      <el-input v-model="dataForm.deviceSmsType" placeholder="推送规则（1.按照用户推广，2按照角色推广）"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isHttp">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        isHttp: false,
        visible: false,
        dataForm: {
          id: 0,
          deviceLevel: '',
          deviceLevelName: '',
          deviceDept: '',
          deviceSmsType: ''
        },
        dataRule: {
          deviceLevel: [
            { required: true, message: '设备等级id不能为空', trigger: 'blur' }
          ],
          deviceLevelName: [
            { required: true, message: '设备等级名称不能为空', trigger: 'blur' }
          ],
          deviceDept: [
            { required: true, message: '所属机构不能为空', trigger: 'blur' }
          ],
          deviceSmsType: [
            { required: true, message: '推送规则（1.按照用户推广，2按照角色推广）不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/deviceexception/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.deviceLevel = data.deviceexception.deviceLevel
                this.dataForm.deviceLevelName = data.deviceexception.deviceLevelName
                this.dataForm.deviceDept = data.deviceexception.deviceDept
                this.dataForm.deviceSmsType = data.deviceexception.deviceSmsType
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
            this.$http({
              url: this.$http.adornUrl(`/sys/deviceexception/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'deviceLevel': this.dataForm.deviceLevel,
                'deviceLevelName': this.dataForm.deviceLevelName,
                'deviceDept': this.dataForm.deviceDept,
                'deviceSmsType': this.dataForm.deviceSmsType
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
