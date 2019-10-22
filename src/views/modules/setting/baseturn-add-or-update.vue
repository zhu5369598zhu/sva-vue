<template>
  <el-dialog
    v-dialog-drag 
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="名称" size="mini" ></el-input>
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime">
      <el-time-select placeholder="开始时间" v-model="dataForm.startTime" :picker-options="{ start: '00:00', step: '00:30', end: '24:00:00' }" size="mini" ></el-time-select>
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-time-select placeholder="结束时间" v-model="dataForm.endTime" :picker-options="{ start: '00:00', step: '00:30', end: '24:00' }" size="mini" ></el-time-select>
    </el-form-item>
    <el-form-item label="总轮次" prop="turnCount">
      <el-input-number v-model="dataForm.turnCount" controls-position="right" :min="1" label="排序" size="mini" ></el-input-number>
    </el-form-item>
    <el-form-item label="排序" prop="orderNum">
      <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序" size="mini" ></el-input-number>
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
          name: '',
          startTime: '',
          endTime: '',
          turnCount: '',
          orderNum: ''
        },
        dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '结束时间不能为空', trigger: 'blur' }
          ],
          turnCount: [
            { required: true, message: '总轮次不能为空', trigger: 'blur' }
          ],
          orderNum: [
            { required: true, message: '排序不能为空', trigger: 'blur' }
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
          this.dataForm.name = ''
          this.dataForm.startTime = ''
          this.dataForm.endTime = ''
          this.dataForm.turnCount = ''
          this.dataForm.orderNum = ''
        })
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/setting/baseturn/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.baseTurn.name
              this.dataForm.startTime = data.baseTurn.startTime
              this.dataForm.endTime = data.baseTurn.endTime
              this.dataForm.turnCount = data.baseTurn.turnCount
              this.dataForm.orderNum = data.baseTurn.orderNum
              console.log('data: %o', this.dataForm.startTime)
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/setting/baseturn/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'startTime': this.dataForm.startTime,
                'endTime': this.dataForm.endTime,
                'turnCount': this.dataForm.turnCount,
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
