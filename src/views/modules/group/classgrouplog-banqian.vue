<template>
  <el-dialog
    :title="!dataForm.classId ? '' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      班前会日志(拟制中)  &nbsp; &nbsp;&nbsp;&nbsp; 日志编号: {{dataForm.logNumber}}
      <el-row>
        <el-col :span="8">
          <el-form-item label="部门(工段)" prop="deptName">
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
                @current-change="deptListTreeCurrentChangeHandle"
                :default-expand-all="false"
                :highlight-current="true"
                :expand-on-click-node="false" clearable style="width:140px;">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" class="dept-list__input" style="width:140px;" placeholder="部门" >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="班组" prop="classGroupName">
            <el-input v-model="dataForm.classGroupName" placeholder="班组"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="班次" prop="baseTurnId">
            <el-select v-model="dataForm.baseTurnId" placeholder="请选择班次" clearable style="width:120px;">
              <el-option
                v-for="item in TurnList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="班长" prop="monitor">
            <el-input v-model="dataForm.monitor" placeholder="班长" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="应出勤人数" prop="shouldAttendance">
            <el-input v-model="dataForm.shouldAttendance" placeholder="应出勤人数"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实出勤人数" prop="attendance">
            <el-input v-model="dataForm.attendance" placeholder="实出勤人数"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="实到人员" prop="actualArrival">
        <el-input v-model="dataForm.actualArrival" placeholder="实到人员" :disabled="true">
          <span slot="suffix">
            <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle('实到人员')" ></a>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item  label="未到人员" prop="notArrived">
        <el-input v-model="dataForm.notArrived" placeholder="未到人员">
          <span slot="suffix">
            <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle('未到人员')" ></a>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item  label="顶班人员" prop="topArrived">
        <el-input v-model="dataForm.topArrived" placeholder="顶班人员">
          <span slot="suffix">
            <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle('顶班人员')" ></a>
          </span>
        </el-input>
      </el-form-item>
      <el-form-item  label="缺勤原因" prop="reasonsAbsence">
        <el-input v-model="dataForm.reasonsAbsence" placeholder="缺勤原因"></el-input>
      </el-form-item>
      <el-form-item label="人员精神状态" prop="personnelMentalState">
        <el-radio v-model="dataForm.personnelMentalState" label="1">正常</el-radio>
        <el-radio v-model="dataForm.personnelMentalState" label="2">异常</el-radio>
      </el-form-item>
      <el-form-item v-if="dataForm.personnelMentalState === '2'" label="人员精神异常描述" prop="mentalException">
        <el-input type="textarea" autosize v-model="dataForm.mentalException" placeholder="人员精神异常描述"></el-input>
      </el-form-item>
      <el-form-item label="劳动防护用品" prop="laborProtectiveArticles">
        <el-radio v-model="dataForm.laborProtectiveArticles" label="1">正常</el-radio>
        <el-radio v-model="dataForm.laborProtectiveArticles" label="2">异常</el-radio>
      </el-form-item>
      <el-form-item v-if="dataForm.laborProtectiveArticles ==='2'" label="劳动防护用品异常描述" prop="protectiveException">
        <el-input type="textarea" autosize v-model="dataForm.protectiveException" placeholder="劳动防护用品异常描述"></el-input>
      </el-form-item>
      <el-form-item label="工器具状态" prop="tools">
        <el-radio v-model="dataForm.tools" label="1">正常</el-radio>
        <el-radio v-model="dataForm.tools" label="2">异常</el-radio>
      </el-form-item>
      <el-form-item v-if="dataForm.tools === '2'" label="工器具异常描述" prop="toolsException">
        <el-input type="textarea" autosize v-model="dataForm.toolsException" placeholder="工器具异常描述"></el-input>
      </el-form-item>
      <el-form-item label="其他异常" prop="otherException">
        <el-input type="textarea" autosize v-model="dataForm.otherException" placeholder="其他异常"></el-input>
      </el-form-item>
      <el-form-item label="工作安排" prop="workTask">
        <el-input type="textarea" autosize v-model="dataForm.workTask" placeholder="工作安排"></el-input>
      </el-form-item>
      <el-form-item label="危险点" prop="dangerousPoint">
        <el-input type="textarea" autosize v-model="dataForm.dangerousPoint" placeholder="危险点"></el-input>
      </el-form-item>
      <el-form-item label="防范措施" prop="preventiveMeasures">
        <el-input type="textarea" autosize v-model="dataForm.preventiveMeasures" placeholder="防范措施"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="7">
          <el-form-item label="交底人" prop="manAgreement">
            <el-input v-model="dataForm.manAgreement" :disabled="true" placeholder="交底人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="交底时间" prop="createTime">
            <el-date-picker v-model="dataForm.createTime" type="datetime" value-format="yyyy-MM-dd HH:mm:00"  @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:180px;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="班组成员" prop="teamMembers">
        <el-input v-model="dataForm.teamMembers" placeholder="班组成员" :disabled="true">
              <span slot="suffix">
                <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle('班组成员')" ></a>
              </span>
        </el-input>
      </el-form-item>
    </el-form>
    <Transerf v-if="transVisible" ref="Transerf" v-on:closeMain="closeMain"></Transerf>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="datasave()" :disabled="isHttp" >保存</el-button>
      <el-button type="primary" @click="submit()" :disabled="isHttp">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import TableTreeColumn from '@/components/table-tree-column'
  import Transerf from './transfer'
  export default {
    data () {
      return {
        isHttp: false,
        visible: false,
        transVisible: false,
        isShowDeptTree: false,
        dataList: [],
        dataDeptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        title: '',
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
          logType: '2',
          logStatus: '1',
          logUserStatus: '',
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
          personCharge: ''
        },
        currentRow: '',
        pageIndex: 1,
        pageSize: 2000,
        TurnList: [],
        dataRule: {
          deptName: [
            { required: true, message: '部门车间不能为空', trigger: 'change' }
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
          workTask: [
            { required: true, message: '工作安排不能为空', trigger: 'blur' }
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
      TableTreeColumn,
      Transerf
    },
    mounted () {
      this.getTurnList()
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
              url: this.$http.adornUrl(`/group/classgrouplog/info/${this.dataForm.classId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.logNumber = data.classgrouplog.logNumber
                this.dataForm.deptId = data.classgrouplog.deptId
                this.dataForm.deptName = data.classgrouplog.deptName
                this.dataForm.classGroupName = data.classgrouplog.classGroupName
                this.dataForm.baseTurnId = data.classgrouplog.baseTurnId
                this.dataForm.logType = data.classgrouplog.logType
                this.dataForm.logStatus = data.classgrouplog.logStatus
                this.dataForm.noteTaker = data.classgrouplog.noteTaker
                this.dataForm.handoverPerson = data.classgrouplog.handoverPerson
                this.dataForm.successor = data.classgrouplog.successor
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
                this.deptListTreeSetCurrentNode()
              }
            })
          }
        })
        // 进行新增 判断
        if (this.dataForm.classId <= 0) {
          // 交班人 交底人 记录人 负责人 都是 登录用户
          this.dataForm.manAgreement = this.loginuserName
          this.dataForm.handoverPerson = this.loginuserName
          this.dataForm.handoverPersonId = this.loginuserId
          this.dataForm.noteTaker = this.loginuserName
          this.dataForm.personCharge = this.loginuserName
          this.dataForm.successorId = this.loginuserId
          this.dataForm.monitor = this.loginuserName
          this.dataForm.deptName = ''
          this.dataForm.deptId = ''
          // 新增页面每次进入该页面都需要 刷新 日志
          this.$http({
            url: this.$http.adornUrl('/group/classgrouplog/logNumber'),
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
      // 部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        console.log('1')
        this.dataForm.deptId = data.deptId
        this.dataForm.deptName = data.name
        this.isShowDeptTree = false
      },
      // 部门树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
        this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
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
      clickTitle (title) {
        this.title = title
        this.transVisible = true
        this.$nextTick(() => {
          this.$refs.Transerf.init(title)
        })
      },
      // 父组件接收子组件传递来的参数
      closeMain (val) {
        console.log('传递过来的参数' + val)
        this.dataListSelections = val
        var username
        var userid
        var userNames = username ? [username] : this.dataListSelections.map(item => {
          return item.label
        })
        var userId = userid ? [userid] : this.dataListSelections.map(item => {
          return item.id
        })
        if (this.title === '班组成员') {
          this.dataForm.teamMembers = userNames.toString()
          this.dataForm.teamMembersIds = userId.toString()
          this.dataForm.successor = userNames.toString()
          this.dialogFormVisible = false
        }
        if (this.title === '实到人员') {
          this.dataForm.actualArrival = userNames.toString()
          this.dialogFormVisible = false
        }
        if (this.title === '未到人员') {
          this.dataForm.notArrived = userNames.toString()
          this.dialogFormVisible = false
        }
        if (this.title === '顶班人员') {
          this.dataForm.topArrived = userNames.toString()
          this.dialogFormVisible = false
        }
      },
      // 保存
      datasave () {
        this.dataForm.logStatus = '1'
        this.dataForm.logUserStatus = '1'
        this.dataFormSubmit()
      },
      submit () {
        this.dataForm.logStatus = '2'
        this.dataForm.logUserStatus = '2'
        this.dataFormSubmit()
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.dataForm.handoverPersonId = this.loginuserId     // 登录人就是 交班人
            this.$http({
              url: this.$http.adornUrl(`/group/classgrouplog/${!this.dataForm.classId ? 'save' : 'update'}`),
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
                'personCharge': this.dataForm.personCharge
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
