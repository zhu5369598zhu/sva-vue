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
    <el-form-item label="班组" prop="classGroup">
    <el-select v-model="dataForm.classGroup" multiple placeholder="班组">
      <el-option
        v-for="item in classGroupList"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime">
      <el-time-select placeholder="开始时间" v-model="dataForm.startTime" :picker-options="{ start: '00:00', step: '00:30', end: '24:00' }"></el-time-select>
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-time-select placeholder="结束时间" v-model="dataForm.endTime" :picker-options="{ start: '00:00', step: '00:30', end: '24:00' }"></el-time-select>
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
          classGroup: '',
          startTime: '',
          endTime: '',
          inspectionLineId: 0
        },
        classGroupList: [],
        dataRule: {
          inspectionLineId: [
            { required: true, message: '所属线路ID不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '轮次不能为空', trigger: 'blur' }
          ],
          classGroup: [
            { required: true, message: '班组不能为空', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '结束时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      // 获取数据列表
      getClassGroupList () {
        console.log('lineid %o', this.dataForm.inspectionLineId)
        this.$http({
          url: this.$http.adornUrl('/inspection/classgroup/findlist'),
          method: 'get',
          params: this.$http.adornParams({
            'lineId': this.dataForm.inspectionLineId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.classGroupList = data.classGroupList
          } else {
            this.classGroupList = []
          }
        })
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.dataForm.classGroup = []
          this.dataForm.name = ''
          this.dataForm.startTime = ''
          this.dataForm.endTime = ''
        })
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/inspection/turn/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.inspectionLineId = data.turn.inspectionLineId
              this.dataForm.name = data.turn.name
              this.dataForm.classGroup = data.turn.classGroupList
              this.dataForm.startTime = data.turn.startTime
              this.dataForm.endTime = data.turn.endTime
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if(this.dataForm.startTime === this.dataForm.endTime){
            this.$alert('开始时间结束时间不能重复')
            return;
          }
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/inspection/turn/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'inspectionLineId': this.dataForm.inspectionLineId,
                'name': this.dataForm.name,
                'startTime': this.dataForm.startTime,
                'endTime': this.dataForm.endTime,
                'classGroupList': this.dataForm.classGroup
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
