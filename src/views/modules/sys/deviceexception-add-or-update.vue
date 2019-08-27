<template>
  <el-dialog
    :title="!dataForm.id ? '推送规则' : '推送规则'"
    :close-on-click-modal="false"
    v-if="visible"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="推送规则" prop="deviceSmsType" >
      <el-radio v-model="dataForm.deviceSmsType" @change="changType(1)"  :label="1">按照用户</el-radio>
      <el-radio v-model="dataForm.deviceSmsType" @change="changType(2)" :label="2">按照角色</el-radio>
    </el-form-item>
    <el-form-item label="短信状态" prop="isOk" v-if="dataForm.deviceId!=''">
      <el-radio v-model="dataForm.isOk" :label="1">正常</el-radio>
      <el-radio v-model="dataForm.isOk" :label="0">禁用</el-radio>
    </el-form-item>
    <el-form-item label="微信状态" prop="wxOk" >
      <el-radio v-model="dataForm.wxOk" :label="1">正常</el-radio>
      <el-radio v-model="dataForm.wxOk" :label="0">禁用</el-radio>
    </el-form-item>
    <el-form-item size="mini" label="授权">
      <el-tree
        :data="messageList"
        :props="messageListTreeProps"
        node-key="id"
        ref="userListTree"
        :default-expand-all="false"
        show-checkbox>
      </el-tree>
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
        messageList: [],
        messageListTreeProps: {
          label: 'lable',
          children: 'children'
        },
        dataForm: {
          id: 0,
          deviceLevel: '',
          deviceLevelName: '',
          deviceId: '',
          deviceName: '',
          exceptionIds: '',
          deviceDept: '',
          deviceSmsType: 1,
          smsUserIds: '',
          isOk: 1,
          wxOk: 1,
          type: '',
          userIdList: []
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
        },
        tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
      }
    },
    methods: {
      init (smsId, deptId, levelId, levelName, deviceId, deviceName, exceptionIds, deviceSmsType, isOk, type) {
        this.dataForm.id = smsId || 0
        this.dataForm.deviceDept = deptId
        this.dataForm.deviceLevel = levelId
        this.dataForm.deviceLevelName = levelName
        this.dataForm.deviceId = deviceId
        this.dataForm.deviceName = deviceName
        this.dataForm.exceptionIds = exceptionIds
        this.dataForm.deviceSmsType = deviceSmsType
        this.dataForm.isOk = isOk
        this.dataForm.type = type
        this.visible = true
        this.isHttp = false
        console.log('推送方式' + this.dataForm.deviceSmsType)
        this.$http({
          url: this.$http.adornUrl('/sys/deviceexception/messagetree'),
          method: 'get',
          params: this.$http.adornParams({
            'deviceSmsType': this.dataForm.deviceSmsType
          })
        }).then(({data}) => {
          console.log(data.messageTree)
          this.messageList = data.messageTree
        }).then(() => {
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
            this.$refs.userListTree.setCheckedKeys([])
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/deviceexception/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.id = data.deviceexception.id
                // this.dataForm.deviceLevel = data.deviceexception.deviceLevel
                // this.dataForm.deviceLevelName = data.deviceexception.deviceLevelName
                // this.dataForm.deviceId = data.deviceexception.deviceId
                // this.dataForm.deviceName = data.deviceexception.deviceName
                // this.dataForm.exceptionIds = data.deviceexception.exceptionIds
                // this.dataForm.deviceDept = data.deviceexception.deviceDept
                this.dataForm.deviceSmsType = data.deviceexception.deviceSmsType
                this.dataForm.smsUserIds = data.deviceexception.smsUserIds
                this.dataForm.isOk = data.deviceexception.isOk
                this.dataForm.wxOk = data.deviceexception.wxOk
                this.dataForm.type = data.deviceexception.type
                this.dataForm.userIdList = data.deviceexception.userIdList
                this.$refs.userListTree.setCheckedKeys(this.dataForm.userIdList)
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
                'deviceId': this.dataForm.deviceId,
                'deviceName': this.dataForm.deviceName,
                'exceptionIds': this.dataForm.exceptionIds,
                'deviceDept': this.dataForm.deviceDept,
                'deviceSmsType': this.dataForm.deviceSmsType,
                'userIdList': [].concat(this.$refs.userListTree.getCheckedKeys()),
                'isOk': this.dataForm.isOk,
                'wxOk': this.dataForm.wxOk,
                'type': this.dataForm.type
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
      },
      // 切换 推送方式
      changType (deviceSmsType) {
        this.dataForm.deviceSmsType = deviceSmsType
        console.log(this.dataForm.deviceSmsType)
        this.$http({
          url: this.$http.adornUrl('/sys/deviceexception/messagetree'),
          method: 'get',
          params: this.$http.adornParams({
            'deviceSmsType': this.dataForm.deviceSmsType
          })
        }).then(({data}) => {
          this.messageList = data.messageTree
          this.$refs.userListTree.setCheckedKeys([])
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/deviceexception/changSmsType'),
            method: 'get',
            params: this.$http.adornParams({
              'deviceSmsType': this.dataForm.deviceSmsType,
              'id': this.dataForm.id
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              if (data.deviceexception !== null) {
                this.$refs.userListTree.setCheckedKeys(data.deviceexception.userIdList)
              }
            }
          })
        })
      }
    }
  }
</script>
