<template>
  <el-dialog
    :title="!this.dataForm.defectiveId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :append-to-body='true'
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="工单编号" prop="defectiveNumber">
        {{dataForm.defectiveNumber}}
      </el-form-item>
      <el-form-item label="巡检缺陷单主题" prop="defectiveTheme">
        <el-input v-model="dataForm.defectiveTheme" placeholder="缺陷单主题"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="所属机构" prop="deptId">
            <el-select v-model="dataForm.deptId" placeholder="所属机构" clearable
            >
              <el-option
                v-for="item in deptList"
                :key="item.deptId"
                :label="item.name"
                :value="item.deptId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="缺陷异常等级" prop="exceptionId">
            <el-select v-model="dataForm.exceptionId">
              <el-option
                v-for="item in dataExceptionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>

            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="工单内容" prop="orderContent">
        <el-input
          type="textarea"
          autosize
          v-model="dataForm.orderContent" placeholder="工单内容"></el-input>
      </el-form-item>
      <el-form-item label="缺陷填报人" prop="defectiveName">
        <el-input v-model="dataForm.defectiveName" placeholder="缺陷填报人"></el-input>
      </el-form-item>
      <el-form-item label="工单填报人意见" prop="defectiveNameOpinion">
        <el-input
          type="textarea"
          autosize
          v-model="dataForm.defectiveNameOpinion" placeholder="工单填报人意见"></el-input>
      </el-form-item>
      <el-form-item label="工单确认人" prop="orderConfirmer">
        <el-input v-model="dataForm.orderConfirmer" placeholder="工单确认人"></el-input>
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
        deptList: [],
        dataExceptionList: [],
        dataForm: {
          defectiveId: 0,
          defectiveNumber: '',
          defectiveTheme: '',
          defectiveType: '0',
          deptId: '',
          exceptionId: '',
          orderContent: '',
          defectiveName: '',
          defectiveNameId: '',
          defectiveNameOpinion: '',
          createTime: '',
          orderStatus: '',
          orderConfirmer: '',
          orderConfirmerId: '',
          confirmedTime: '',
          orderConfirmerOpinion: '',
          defectiveDevice: '',
          resultId: ''
        },
        dataRule: {
          defectiveNumber: [
            { required: true, message: '缺陷工单编号不能为空', trigger: 'blur' }
          ],
          defectiveTheme: [
            { required: true, message: '缺陷工单主题不能为空', trigger: 'blur' }
          ],
          defectiveType: [
            { required: true, message: '0 巡检缺陷异常 1 填报缺陷异常不能为空', trigger: 'blur' }
          ],
          deptId: [
            { required: true, message: '部门id不能为空', trigger: 'blur' }
          ],
          exceptionId: [
            { required: true, message: '缺陷异常等级不能为空', trigger: 'blur' }
          ],
          orderContent: [
            { required: true, message: '默认的工单内容不能为空', trigger: 'blur' }
          ],
          defectiveName: [
            { required: true, message: '缺陷确认人(填报)人不能为空', trigger: 'blur' }
          ],
          defectiveNameId: [
            { required: true, message: '缺陷确认人(填报)人id不能为空', trigger: 'blur' }
          ],
          defectiveNameOpinion: [
            { required: true, message: '工单填报人意见不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '填报时间不能为空', trigger: 'blur' }
          ],
          orderStatus: [
            { required: true, message: '0 拟制中 1 待确认 3 已转不能为空', trigger: 'blur' }
          ],
          orderConfirmer: [
            { required: true, message: '工单确认人不能为空', trigger: 'blur' }
          ],
          orderConfirmerId: [
            { required: true, message: '工单确认人 id不能为空', trigger: 'blur' }
          ],
          confirmedTime: [
            { required: true, message: '工单确认时间不能为空', trigger: 'blur' }
          ],
          orderConfirmerOpinion: [
            { required: true, message: '工单确认人意见不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      this.getDeptList()
      this.getExeption() // 异常等级
    },
    computed: {
      loginuserName: {
        get () { return this.$store.state.user.name }
      },
      loginuserId: {
        get () { return this.$store.state.user.id }
      }
    },
    methods: {
      init (defectiveId, id) {
        this.dataForm.defectiveId = defectiveId || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.defectiveId > 0) {
            this.$http({
              url: this.$http.adornUrl(`/management/orderdefect/orderinfo`),
              method: 'get',
              params: this.$http.adornParams({
                'defectiveId': id
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.defectiveNumber = data.orderdefective.defectiveNumber
                this.dataForm.defectiveTheme = data.orderdefective.defectiveTheme
                this.dataForm.defectiveType = data.orderdefective.defectiveType
                this.dataForm.deptId = data.orderdefective.deptId
                this.dataForm.exceptionId = data.orderdefective.exceptionId
                this.dataForm.orderContent = data.orderdefective.orderContent
                this.dataForm.defectiveName = data.orderdefective.defectiveName
                this.dataForm.defectiveNameId = data.orderdefective.defectiveNameId
                this.dataForm.defectiveNameOpinion = data.orderdefective.defectiveNameOpinion
                this.dataForm.createTime = data.orderdefective.createTime
                this.dataForm.orderStatus = data.orderdefective.orderStatus
                this.dataForm.orderConfirmer = data.orderdefective.orderConfirmer
                this.dataForm.orderConfirmerId = data.orderdefective.orderConfirmerId
                this.dataForm.confirmedTime = data.orderdefective.confirmedTime
                this.dataForm.orderConfirmerOpinion = data.orderdefective.orderConfirmerOpinion
                this.dataForm.defectiveDevice = data.orderdefective.defectiveDevice
                this.dataForm.resultId = data.orderdefective.resultId
              }
            })
          }
        })
        // 新增  工单编号  managementNumber
        if (this.dataForm.defectiveId <= 0) {
          // 缺陷填报人 和 缺陷确定人 都是 当前登录用户
          this.dataForm.defectiveName = this.loginuserName
          this.dataForm.defectiveNameId = this.loginuserId
          this.dataForm.orderConfirmer = this.loginuserName
          this.dataForm.orderConfirmerId = this.loginuserId
          this.dataForm.resultId = id
          this.$http({
            url: this.$http.adornUrl('/management/orderdefective/managementNumber'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.dataForm.defectiveNumber = data.managementNumber
            this.dataForm.defectiveId = 0
          })
        }
      },
      // 机构的下拉列表
      getDeptList () {
        if (this.deptList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/sys/dept/tree'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deptList = data
          })
        }
      },
      getExeption () {
        this.$http({
          url: this.$http.adornUrl('/setting/exception/list'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataExceptionList = data.page.list
          } else {
            this.dataExceptionList = []
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/management/orderdefect/${!this.dataForm.defectiveId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'defectiveId': this.dataForm.defectiveId || undefined,
                'defectiveNumber': this.dataForm.defectiveNumber,
                'defectiveTheme': this.dataForm.defectiveTheme,
                'defectiveType': this.dataForm.defectiveType,
                'deptId': this.dataForm.deptId,
                'exceptionId': this.dataForm.exceptionId,
                'orderContent': this.dataForm.orderContent,
                'defectiveName': this.dataForm.defectiveName,
                'defectiveNameId': this.dataForm.defectiveNameId,
                'defectiveNameOpinion': this.dataForm.defectiveNameOpinion,
                'createTime': this.dataForm.createTime,
                'orderStatus': this.dataForm.orderStatus,
                'orderConfirmer': this.dataForm.orderConfirmer,
                'orderConfirmerId': this.dataForm.orderConfirmerId,
                'confirmedTime': this.dataForm.confirmedTime,
                'orderConfirmerOpinion': this.dataForm.orderConfirmerOpinion,
                'defectiveDevice': this.dataForm.defectiveDevice,
                'resultId': this.dataForm.resultId
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
