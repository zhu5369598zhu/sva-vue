<template>
  <el-dialog
    v-dialog-drag
    :title="!dataForm.classId ? '新增' : '审核'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px" style="margin-left: -5px;">
      <p style="margin-left: 42px;">班前会日志(审核中)  &nbsp; &nbsp;&nbsp;&nbsp; 日志编号: {{dataForm.logNumber}}</p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="部门(工段)" prop="deptName" >
            <el-input size="mini" v-model="dataForm.deptName" readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="班组" prop="classGroupName">
            <el-input size="mini" v-model="dataForm.classGroupName"  readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="班次" prop="baseTurnName">
            <el-input size="mini" v-model="dataForm.baseTurnName" readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="班长" prop="monitor">
            <el-input size="mini" v-model="dataForm.monitor"  readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="应出勤人数" prop="shouldAttendance">
            <el-input size="mini" v-model="dataForm.shouldAttendance"  readonly></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实出勤人数" prop="attendance">
            <el-input size="mini" v-model="dataForm.attendance"  readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="实到人员" prop="actualArrival">
        <el-input size="mini" v-model="dataForm.actualArrival"  readonly></el-input>
      </el-form-item>
      <el-form-item  label="未到人员" prop="notArrived">
        <el-input size="mini" v-model="dataForm.notArrived"  readonly></el-input>
      </el-form-item>
      <el-form-item  label="顶班人员" prop="topArrived">
        <el-input size="mini" v-model="dataForm.topArrived"  readonly></el-input>
      </el-form-item>
      <el-form-item  label="缺勤原因" prop="reasonsAbsence">
        <el-input size="mini" v-model="dataForm.reasonsAbsence" readonly></el-input>
      </el-form-item>
      <el-form-item  label="人员精神异常" prop="mentalException">
        <el-input size="mini" type="textarea" autosize v-model="dataForm.mentalException" readonly></el-input>
      </el-form-item>
      <el-form-item  label="劳动防护用品异常" prop="protectiveException">
        <el-input size="mini" type="textarea" autosize v-model="dataForm.protectiveException" readonly></el-input>
      </el-form-item>
      <el-form-item  label="工器具异常" prop="toolsException">
        <el-input size="mini" type="textarea" autosize v-model="dataForm.toolsException" readonly></el-input>
      </el-form-item>
      <el-form-item label="其他异常" prop="otherException">
        <el-input size="mini" type="textarea" autosize v-model="dataForm.otherException" readonly></el-input>
      </el-form-item>
      <el-form-item label="工作安排" prop="workTask">
        <el-input size="mini" type="textarea" autosize v-model="dataForm.workTask" readonly></el-input>
      </el-form-item>
      <el-form-item label="危险点" prop="dangerousPoint">
        <el-input size="mini" type="textarea" autosize v-model="dataForm.dangerousPoint" readonly></el-input>
      </el-form-item>
      <el-form-item label="防范措施" prop="preventiveMeasures">
        <el-input size="mini" type="textarea" autosize v-model="dataForm.preventiveMeasures" readonly></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="交底人" prop="manAgreement">
            <el-input size="mini" v-model="dataForm.manAgreement" readonly ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交底时间" prop="createTime">
            <el-date-picker v-model="dataForm.createTime" size="mini" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  @change="handleStartTimeChange" :picker-options="startDatePicker" style="width: 100%;" readonly></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="班组成员" prop="teamMembers">
        <el-input size="mini" v-model="dataForm.teamMembers" readonly></el-input>

        <el-dialog v-dialog-drag title="拒绝原因" :visible.sync="dialogRejectVisible"  :append-to-body='true'>
          <el-form :model="dataForm"  @keyup.enter.native="dataFormSubmit()">
            <el-form-item label="拒绝原因" prop="rejectReason">
              <el-input size="mini" type="textarea"
                        autosize
                        v-model="dataForm.rejectReason" placeholder="拒绝原因"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogRejectVisible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()"  :disabled="isHttp">确定</el-button>
          </span>
        </el-dialog>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="danger" @click="bohuiSubmit()">拒绝</el-button>
      <el-button type="primary" @click="confirmedSubmit()"  :disabled="isHttp">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
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
          logType: '2',
          logStatus: '2',
          logUserStatus: '2',
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
          personnelMentalState: '1',
          mentalException: '',
          laborProtectiveArticles: '1',
          protectiveException: '',
          tools: '1',
          toolsException: '',
          otherException: '',
          workTask: '',
          dangerousPoint: '',
          preventiveMeasures: '',
          manAgreement: '',
          teamMembers: '',
          teamMembersIds: '',
          workSummary: '',
          personCharge: '',
          rejectReason: '',
          rejectPeople: ''
        },
        TurnList: [],
        deptList: [],
        dataRule: {
          deptId: [
            { required: true, message: '部门车间id不能为空', trigger: 'blur' }
          ],
          classGroupName: [
            { required: true, message: '班组不能为空', trigger: 'blur' }
          ],
          baseTurnId: [
            { required: true, message: '班次不能为空', trigger: 'blur' }
          ],
          logType: [
            { required: true, message: '日志类型（1:班长日志，2班前日志，3班后日志）不能为空', trigger: 'blur' }
          ],
          logStatus: [
            { required: true, message: '日志状态(1待确认，2已确认，3拟制中，4已完成)不能为空', trigger: 'blur' }
          ],
          noteTaker: [
            { required: true, message: '记录人不能为空', trigger: 'blur' }
          ],
          handoverPerson: [
            { required: true, message: '交接人不能为空', trigger: 'blur' }
          ],
          successor: [
            { required: true, message: '接班人不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '交底时间不能为空', trigger: 'blur' }
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
          superiorNotice: [
            { required: true, message: '上级通知不能为空', trigger: 'blur' }
          ],
          accountConfession: [
            { required: true, message: '交代事项不能为空', trigger: 'blur' }
          ],
          personnelMentalState: [
            { required: true, message: '人员精神状态（1正常，2异常）不能为空', trigger: 'blur' }
          ],
          laborProtectiveArticles: [
            { required: true, message: '劳动防护用品不能为空', trigger: 'blur' }
          ],
          tools: [
            { required: true, message: '工器具（1正常，2异常）不能为空', trigger: 'blur' }
          ],
          manAgreement: [
            { required: true, message: '交底人不能为空', trigger: 'blur' }
          ],
          teamMembers: [
            { required: true, message: '班组成员不能为空', trigger: 'blur' }
          ],
          workSummary: [
            { required: true, message: '工作总结不能为空', trigger: 'blur' }
          ],
          personCharge: [
            { required: true, message: '负责人不能为空', trigger: 'blur' }
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
      this.getDataList()   // 部门查询
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
      init (id) {
        this.dataForm.classId = id || 0
        this.visible = true
        this.isHttp = false
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
        // 交班人 交底人 记录人 负责人 都是 登录用户
        // 进行新增 判断
        if (this.dataForm.classId <= 0) {
          //  新增页面每次进入该页面都需要 刷新 日志
          this.$http({
            url: this.$http.adornUrl('/group/classgrouplogconfirmed/logNumber'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.dataForm.logNumber = data.logNumber
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
      // 查询部门
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams({'name': this.deptFrom.name})
        }).then(({data}) => {
          this.dataList = treeDataTranslate(data, 'deptId')
        })
      },
      // 拒绝
      bohuiSubmit () {
        this.dataForm.logUserStatus = '4'
        this.dataForm.logStatus = '4'
        this.dataForm.rejectPeople = this.loginuserName
        this.dialogRejectVisible = true
      },
      // 已确认
      confirmedSubmit () {
        this.dataForm.logStatus = '3'
        this.dataFormSubmit()
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.dialogRejectVisible = false
            this.dataForm.successorId = this.loginuserId   // 拒绝人 id
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
                'teamMembersIds': this.dataForm.teamMembersIds,
                'workSummary': this.dataForm.workSummary,
                'personCharge': this.dataForm.personCharge,
                'rejectReason': this.dataForm.rejectReason,
                'rejectPeople': this.dataForm.rejectPeople
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
