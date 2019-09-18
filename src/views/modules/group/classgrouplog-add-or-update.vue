<template>
  <el-dialog
    :title="!dataForm.classId ? '' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="90px">
      班长日志(拟制中)  &nbsp; &nbsp;&nbsp;&nbsp; 日志编号:{{dataForm.logNumber}}
      <el-row>
        <el-col :span="8">
          <el-form-item label="部门(工段)" prop="deptName" >
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
            <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" class="dept-list__input" style="width:140px;" placeholder="部门" >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="班组" prop="classGroupName">
            <el-input v-model="dataForm.classGroupName" style="width:120px;" clearable placeholder="班组"></el-input>
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
      <el-form-item label="接班记事" prop="successionRecord">
        <el-input type="textarea"
                  autosize
                  v-model="dataForm.successionRecord" placeholder="接班记事"></el-input>
      </el-form-item>
      <el-form-item label="当班记事" prop="onDuty">
        <el-input type="textarea"
                  autosize
                  v-model="dataForm.onDuty" placeholder="当班记事"></el-input>
      </el-form-item>
      <el-form-item label="上级通知" prop="superiorNotice">
        <el-input type="textarea"
                  autosize
                  v-model="dataForm.superiorNotice" placeholder="上级通知"></el-input>
      </el-form-item>
      <el-form-item label="交代事项" prop="accountConfession">
        <el-input type="textarea"
                  autosize
                  v-model="dataForm.accountConfession" placeholder="交代事项"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="7">
          <el-form-item label="交班人"  prop="handoverPerson">
            <el-input :disabled="true" v-model="dataForm.handoverPerson" placeholder="交班人" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接班人" prop="successor">
            <el-input v-model="dataForm.successor" :disabled="true" placeholder="接班人">
             <span slot="suffix">
              <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle('接班人')" ></a>
            </span>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="交接时间" prop="createTime">
            <el-date-picker v-model="dataForm.createTime" type="datetime" value-format="yyyy-MM-dd HH:mm:00"  @change="handleStartTimeChange" :picker-options="startDatePicker" style="width: 180px;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <Transerf v-if="transVisible" ref="Transerf" v-on:closeMain="closeMain"></Transerf>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="datasave()" v-if="this.dataForm.logStatus ==='1'" :disabled="isHttp">保存</el-button>
      <el-button type="primary" @click="submit()"  :disabled="isHttp">提交</el-button>
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
        // dialogFormVisible: false,
        isShowDeptTree: false,
        dataList: [],
        dataDeptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        title: '',
        dataListSelections: [],
        dataForm: {
          classId: 0,
          logNumber: '',
          deptId: '',
          deptName: '',
          classGroupName: '',
          baseTurnId: '',
          logType: '1',
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
            { required: true, message: '部门(工段)不能为空', trigger: 'change' }
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
          successor: [
            { required: true, message: '接班人不能为空', trigger: 'blur' }
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
      this.getDataList()     // 部门查询
    },
    computed: {
      loginuserName: {
        get () { return this.$store.state.user.name }
      },
      logNumber: {
        get () { return this.dataForm.logNumber }
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
        // 当dom发生变化，更新后执行的回调。
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
                this.dataForm.teamMembersIds = data.classgrouplog.teamMembersIds
                this.dataForm.workSummary = data.classgrouplog.workSummary
                this.dataForm.personCharge = data.classgrouplog.personCharge
                this.deptListTreeSetCurrentNode()
              }
            })
          }
        })

        // 进行新增 判断
        if (this.dataForm.classId <= 0) {
          // 交班人  交班人 id 都是 登录用户
          this.dataForm.handoverPerson = this.loginuserName
          this.dataForm.handoverPersonId = this.loginuserId
          // 交班人 交底人 记录人 都是 登录用户
          this.dataForm.manAgreement = this.loginuserName
          this.dataForm.monitor = this.loginuserName
          this.dataForm.noteTaker = this.loginuserName
          this.dataForm.personCharge = this.loginuserName
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
      // 部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.deptId = data.deptId
        this.dataForm.deptName = data.name
        this.isShowDeptTree = false
      },
      // 部门树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
        this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      // 班次的下拉列表
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
        if (this.title === '接班人') {
          if (this.dataListSelections.length >= 2) {
            this.$alert('接班人只能选择一个')
          } else {
            this.dataForm.successor = userNames.toString() // 接班人 name
            this.dataForm.successorId = userId.toString() // 接班人 id
          }
        }
        if (this.title === '实到人员') {
          this.dataForm.actualArrival = userNames.toString()
        }
        if (this.title === '未到人员') {
          this.dataForm.notArrived = userNames.toString()
        }
        if (this.title === '顶班人员') {
          this.dataForm.topArrived = userNames.toString()
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
<style>
  .tree{
    overflow-y: scroll;
    width:280px;
    height: 200px;
  }
</style>
