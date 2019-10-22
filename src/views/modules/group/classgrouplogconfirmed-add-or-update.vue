<template>

  <el-dialog
    :title="!dataForm.classId ? '新增' : '审核'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="90px">
      班长日志(审核中)  &nbsp; &nbsp;&nbsp;&nbsp; 日志编号:{{dataForm.logNumber}}
      <el-row>
        <el-col :span="8">
          <el-form-item label="部门(工段)" prop="deptName">
            <el-input v-model="dataForm.deptName" readonly ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="班组" prop="classGroupName">
            <el-input v-model="dataForm.classGroupName" style="width:120px;" readonly ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="班次" prop="baseTurnName">
            <el-input v-model="dataForm.baseTurnName"  readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="班长" prop="monitor">
            <el-input v-model="dataForm.monitor"  readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="应出勤人数" prop="shouldAttendance">
            <el-input v-model="dataForm.shouldAttendance"  readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实出勤人数" prop="attendance">
            <el-input v-model="dataForm.attendance"  readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="实到人员" prop="actualArrival">
        <el-input v-model="dataForm.actualArrival"  readonly></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="4">
        </el-col>
        <el-col :span="8">
          <el-form-item  label="未到人员" prop="notArrived">
            <el-input v-model="dataForm.notArrived"  readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  label="顶班人员" prop="topArrived">
            <el-input v-model="dataForm.topArrived"  readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item  label="缺勤原因" prop="reasonsAbsence">
        <el-input v-model="dataForm.reasonsAbsence"  readonly></el-input>
      </el-form-item>
      <el-form-item label="接班记事" prop="successionRecord">
        <el-input type="textarea"
                  autosize
                  v-model="dataForm.successionRecord"  readonly></el-input>
      </el-form-item>
      <el-form-item label="当班记事" prop="onDuty">
        <el-input type="textarea"
                  autosize
                  v-model="dataForm.onDuty"  readonly></el-input>
      </el-form-item>
      <el-form-item label="上级通知" prop="superiorNotice">
        <el-input type="textarea"
                  autosize
                  v-model="dataForm.superiorNotice"  readonly></el-input>
      </el-form-item>
      <el-form-item label="交代事项" prop="accountConfession">
        <el-input type="textarea"
                  autosize
                  v-model="dataForm.accountConfession"  readonly></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="交班人" prop="handoverPerson">
            <el-input v-model="dataForm.handoverPerson"  readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接班人" prop="successor">
            <el-input v-model="dataForm.successor" readonly ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="交接时间" prop="createTime">
            <el-input v-model="dataForm.createTime" readonly style="width:150px;"></el-input>
            <!--<el-date-picker v-model="" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  @change="handleStartTimeChange" :picker-options="startDatePicker" readonly style="width:160px;"></el-date-picker>-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-dialog title="拒绝原因" :visible.sync="dialogRejectVisible"  :append-to-body='true'>
        <el-form :model="dataForm"  @keyup.enter.native="dataFormSubmit()">
          <el-form-item label="拒绝原因" prop="rejectReason">
            <el-input type="textarea"
                      autosize
                      v-model="dataForm.rejectReason" placeholder="拒绝原因"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogRejectVisible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()"  :disabled="isHttp">确定</el-button>
          </span>
      </el-dialog>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="danger" @click="bohuiSubmit()">拒绝</el-button>
      <el-button type="primary" @click="confirmedSubmit()"  :disabled="isHttp">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  export default {
    data () {
      return {
        isHttp: false,
        visible: false,
        dialogFormVisible: false,
        dialogRejectVisible: false,
        dataList: [],
        title: '',
        deptFrom: {
          name: ''
        },
        datauserForm: {
          userName: ''
        },
        UserdataList: [],
        dataListSelections: [],
        rowStyle ({row, rowIndex}) {
          return 'height:40px'
        },
        cellStyle () {
          return 'padding:0'
        },
        dataForm: {
          classId: 0,
          logNumber: '',
          deptId: '',
          deptName: '',
          classGroupName: '',
          baseTurnId: '',
          baseTurnName: '',
          logType: '1',
          logStatus: '3',
          logUserStatus: '3',
          noteTaker: '',
          handoverPerson: '',
          handoverPersonId: '',
          successor: '',
          successorId: '',
          createTime: '',
          monitor: '',
          shouldAttendance: '',
          attendance: '',
          actualArrival: '',
          notArrived: '',
          topArrived: '',
          reasonsAbsence: '',
          successionRecord: '',
          onDuty: '',
          superiorNotice: '',
          accountConfession: '',
          personnelMentalState: '',
          mentalException: '',
          laborProtectiveArticles: '',
          protectiveException: '',
          tools: '',
          toolsException: '',
          otherException: '',
          workTask: '',
          dangerousPoint: '',
          preventiveMeasures: '',
          manAgreement: '',
          teamMembers: '',
          workSummary: '',
          personCharge: '',
          rejectReason: ''
        },
        deptList: [],
        TurnList: [],
        dataRule: {
          deptId: [
            { required: true, message: '部门(工段)不能为空', trigger: 'blur' }
          ],
          classGroupName: [
            { required: true, message: '班组不能为空', trigger: 'blur' }
          ],
          baseTurnId: [
            { required: true, message: '班次不能为空', trigger: 'blur' }
          ],
          handoverPerson: [
            { required: true, message: '交接人不能为空', trigger: 'blur' }
          ],
          handoverPersonId: [
            { required: true, message: '交接人 id不能为空', trigger: 'blur' }
          ],
          successor: [
            { required: true, message: '接班人不能为空', trigger: 'blur' }
          ],
          successorId: [
            { required: true, message: '接班人 id不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '交接时间不能为空', trigger: 'blur' }
          ],
          monitor: [
            { required: true, message: '班长不能为空', trigger: 'blur' }
          ],
          shouldAttendance: [
            { required: true, message: '应出勤人数不能为空', trigger: 'blur' }
          ],
          attendance: [
            { required: true, message: '实出勤人数不能为空', trigger: 'blur' }
          ],
          actualArrival: [
            { required: true, message: '实到人员不能为空', trigger: 'blur' }
          ],
          successionRecord: [
            { required: true, message: '接班记事不能为空', trigger: 'blur' }
          ],
          onDuty: [
            { required: true, message: '当班记事不能为空', trigger: 'blur' }
          ],
          accountConfession: [
            { required: true, message: '交代事项不能为空', trigger: 'blur' }
          ],
          rejectReason: [
            { required: true, message: '拒绝原因不能为空', trigger: 'blur' }
          ]
        },
        startDatePicker: this.beginDate()
      }
    },
    components: {
      TableTreeColumn
    },
    mounted () {
      this.getTurnList()
      this.getDeptList()
    },
    computed: {
      loginuserName: {
        get () { return this.$store.state.user.name }
      },
      logNumber: {
        get () { return this.dataForm.logNumber }
      }
    },
    methods: {
      init (id) {
        this.dataForm.classId = id || 0
        this.visible = true
        this.isHttp = false
        // 当dom发生变化，更新后执行的回调。
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.classId) {
            this.$http({
              url: this.$http.adornUrl(`/group/classgrouplogconfirmed/info/${this.dataForm.classId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.logNumber = data.classgrouplog.logNumber
                this.dataForm.deptId = data.classgrouplog.deptId
                this.dataForm.deptName = data.classgrouplog.deptName
                this.dataForm.classGroupName = data.classgrouplog.classGroupName
                this.dataForm.baseTurnId = data.classgrouplog.baseTurnId
                this.dataForm.baseTurnName = data.classgrouplog.baseTurnName
                this.dataForm.logType = data.classgrouplog.logType
                this.dataForm.logStatus = data.classgrouplog.logStatus
                this.dataForm.logUserStatus = data.classgrouplog.logUserStatus
                this.dataForm.noteTaker = data.classgrouplog.noteTaker
                this.dataForm.handoverPerson = data.classgrouplog.handoverPerson
                this.dataForm.handoverPersonId = data.classgrouplog.handoverPersonId
                this.dataForm.successor = data.classgrouplog.successor
                this.dataForm.successorId = data.classgrouplog.successorId
                this.dataForm.createTime = data.classgrouplog.createTime
                this.dataForm.monitor = data.classgrouplog.monitor
                this.dataForm.shouldAttendance = data.classgrouplog.shouldAttendance
                this.dataForm.attendance = data.classgrouplog.attendance
                this.dataForm.actualArrival = data.classgrouplog.actualArrival
                this.dataForm.notArrived = data.classgrouplog.notArrived
                this.dataForm.topArrived = data.classgrouplog.topArrived
                this.dataForm.reasonsAbsence = data.classgrouplog.reasonsAbsence
                this.dataForm.successionRecord = data.classgrouplog.successionRecord
                this.dataForm.onDuty = data.classgrouplog.onDuty
                this.dataForm.superiorNotice = data.classgrouplog.superiorNotice
                this.dataForm.accountConfession = data.classgrouplog.accountConfession
                this.dataForm.personnelMentalState = data.classgrouplog.personnelMentalState
                this.dataForm.mentalException = data.classgrouplog.mentalException
                this.dataForm.laborProtectiveArticles = data.classgrouplog.laborProtectiveArticles
                this.dataForm.protectiveException = data.classgrouplog.protectiveException
                this.dataForm.tools = data.classgrouplog.tools
                this.dataForm.toolsException = data.classgrouplog.toolsException
                this.dataForm.otherException = data.classgrouplog.otherException
                this.dataForm.workTask = data.classgrouplog.workTask
                this.dataForm.dangerousPoint = data.classgrouplog.dangerousPoint
                this.dataForm.preventiveMeasures = data.classgrouplog.preventiveMeasures
                this.dataForm.manAgreement = data.classgrouplog.manAgreement
                this.dataForm.teamMembers = data.classgrouplog.teamMembers
                this.dataForm.workSummary = data.classgrouplog.workSummary
                this.dataForm.personCharge = data.classgrouplog.personCharge
              }
            })
          }
        })
        // 进行新增 判断
        if (this.dataForm.classId <= 0) {
          // 新增页面每次进入该页面都需要 刷新 日志
          this.$http({
            url: this.$http.adornUrl('/group/classgrouplogconfirmed/logNumber'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.dataForm.logNumber = data.logNumber
          })
        }
      },
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
      getTurnList () {
        if (this.TurnList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/baseturn/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.TurnList = data.page.list
          })
        }
      },
      beginDate () {
        return {
          disabledDate (time) {
            return time.getTime() > Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      handleStartTimeChange (val) {
        this.dataForm.createTime = val
      },
      // 拒绝
      bohuiSubmit () { // 用户有了拒绝记录
        this.dataForm.logStatus = '4'
        this.dataForm.logUserStatus = '4'
        this.dialogRejectVisible = true
      },
      // 已确认
      confirmedSubmit () {
        this.dataForm.logStatus = '3'
        this.dataForm.logUserStatus = '3'
        this.dataFormSubmit()
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.dialogRejectVisible = false
            this.$http({
              url: this.$http.adornUrl(`/group/classgrouplogconfirmed/${!this.dataForm.classId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'classId': this.dataForm.classId || undefined,
                'logNumber': this.dataForm.logNumber,
                'deptId': this.dataForm.deptId,
                'classGroupName': this.dataForm.classGroupName,
                'baseTurnId': this.dataForm.baseTurnId,
                'logType': this.dataForm.logType,
                'logStatus': this.dataForm.logStatus,
                'logUserStatus': this.dataForm.logUserStatus,
                'noteTaker': this.dataForm.noteTaker,
                'handoverPerson': this.dataForm.handoverPerson,
                'handoverPersonId': this.dataForm.handoverPersonId,
                'successor': this.dataForm.successor,
                'successorId': this.dataForm.successorId,
                'createTime': this.dataForm.createTime,
                'monitor': this.dataForm.monitor,
                'shouldAttendance': this.dataForm.shouldAttendance,
                'attendance': this.dataForm.attendance,
                'actualArrival': this.dataForm.actualArrival,
                'notArrived': this.dataForm.notArrived,
                'topArrived': this.dataForm.topArrived,
                'reasonsAbsence': this.dataForm.reasonsAbsence,
                'successionRecord': this.dataForm.successionRecord,
                'onDuty': this.dataForm.onDuty,
                'superiorNotice': this.dataForm.superiorNotice,
                'accountConfession': this.dataForm.accountConfession,
                'personnelMentalState': this.dataForm.personnelMentalState,
                'mentalException': this.dataForm.mentalException,
                'laborProtectiveArticles': this.dataForm.laborProtectiveArticles,
                'protectiveException': this.dataForm.protectiveException,
                'tools': this.dataForm.tools,
                'toolsException': this.dataForm.toolsException,
                'otherException': this.dataForm.otherException,
                'workTask': this.dataForm.workTask,
                'dangerousPoint': this.dataForm.dangerousPoint,
                'preventiveMeasures': this.dataForm.preventiveMeasures,
                'manAgreement': this.dataForm.manAgreement,
                'teamMembers': this.dataForm.teamMembers,
                'workSummary': this.dataForm.workSummary,
                'personCharge': this.dataForm.personCharge,
                'rejectReason': this.dataForm.rejectReason
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
