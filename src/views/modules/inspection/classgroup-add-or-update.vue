<template>
  <el-dialog
    v-dialog-drag
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item label="用户" prop="username">
    <el-select v-model="dataForm.username" multiple placeholder="用户">
      <el-option
        v-for="item in userList"
        :key="item.userId"
        :label="item.username"
        :value="item.userId">
      </el-option>
    </el-select>
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
        userList: [],
        dataForm: {
          name: '',
          username: '',
          deptId: '',
          inspectionLineId: 0
        },
        dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '用户不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 获取数据列表
      getUserList () {
        this.$http({
          url: this.$http.adornUrl(`/sys/user/selectByDept`),
          method: 'get',
          params: this.$http.adornParams({
            'deptId': this.dataForm.deptId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log('users: %o', data)
            this.userList = data.users
          } else {
            this.userList = []
          }
        })
      },
      init (id, deptId) {
        this.dataForm.id = id || 0
        this.dataForm.deptId = deptId
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/inspection/classgroup/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.inspectionLineId = data.classGroup.inspectionLineId
                this.dataForm.name = data.classGroup.name
                this.dataForm.username = data.classGroup.workerList
              }
            })
          }
          this.getUserList()
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/inspection/classgroup/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'inspectionLineId': this.dataForm.inspectionLineId,
                'name': this.dataForm.name,
                'workerList': this.dataForm.username
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
