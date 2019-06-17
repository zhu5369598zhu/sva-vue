<template>

  <el-dialog
    :title="!dataForm.classId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      班长日志(拟制中)  &nbsp; &nbsp;&nbsp;&nbsp; 日志编号:{{dataForm.logNumber}}
      <el-row>
        <el-col :span="8">
          <el-form-item label="部门(工段)" prop="deptId">
            <el-select v-model="dataForm.deptId" placeholder="请输入部门(工段)" clearable
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
            <el-input v-model="dataForm.monitor" placeholder="班长"></el-input>
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
        <el-input v-model="dataForm.actualArrival" placeholder="实到人员" >
          <span slot="suffix">
            <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle('实到人员')" ></a>
          </span>
        </el-input>
      </el-form-item>
      <el-row>
        <el-col :span="4">
        </el-col>
        <el-col :span="8">
          <el-form-item  label="未到人员" prop="notArrived">
            <el-input v-model="dataForm.notArrived" placeholder="未到人员">
              <span slot="suffix">
                <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle('未到人员')" ></a>
              </span>
            </el-input>
            <!--<el-button type="info" @click="clickTitle('未到人员')" icon="el-icon-plus" circle ></el-button>-->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item  label="顶班人员" prop="topArrived">
            <el-input v-model="dataForm.topArrived" placeholder="顶班人员">
              <span slot="suffix">
                <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle('顶班人员')" ></a>
              </span>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
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
        <el-col :span="8">
          <el-form-item label="交班人"  prop="handoverPerson">
            <el-input :disabled="true" v-model="dataForm.handoverPerson" placeholder="交班人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="接班人" prop="successor">
            <el-input v-model="dataForm.successor" :disabled="true" placeholder="接班人">
             <span slot="suffix">
              <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle('接班人')" ></a>
            </span>
            </el-input>
           <!-- <el-button type="info" @click="clickTitle('接班人')" icon="el-icon-plus" circle ></el-button>-->
            <el-dialog title="可选择用户列表" :visible.sync="dialogFormVisible"  :append-to-body='true'>
              <div>
              <div style="display:inline-block;">
                  <el-form :model="deptFrom">
                    <el-row>
                      <el-col :span="8">
                        <el-form-item>
                          <el-input v-model="deptFrom.name" placeholder="机构名称" clearable style="width: 80px;"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                      <el-form-item>
                        <el-button @click="getDataList()">查询</el-button>
                      </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <el-table
                    :data="dataList"
                    style="width: 100%;">
                    <el-table-column
                      type="index"
                      header-align="center"
                      align="center"
                      width="80">
                    </el-table-column>
                    <table-tree-column style="width: auto"
                      prop="name"
                      header-align="center"
                      treeKey="deptId"
                      label="机构名称"
                      >
                    </table-tree-column>
                    <el-table-column
                      header-align="center"
                      align="center"
                      width="150"
                      label="操作">
                      <template slot-scope="scope">
                        <el-button  type="text" size="small" @click="addOrUpdateHandle(scope.row.deptId)">选中</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
              </div>
              <div style="display:inline-block;margin:10px;">
                <el-form :inline="true" :model="datauserForm" >
                  <el-row>
                    <el-col :span="8">
                      <el-form-item>
                        <el-input v-model="datauserForm.userName" placeholder="用户名称" clearable style="width: 80px;"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item>
                          <el-button @click="search">查询</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-button  type="danger" @click="Handle()" :disabled="dataListSelections.length <= 0">确定</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item>
                        <el-button @click="dialogFormVisible = false">取 消</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
                <el-table
                  :data="UserdataList"
                  style="width: 100%;"
                  :row-style="rowStyle"
                  @selection-change="selectionChangeHandle"
                  >
                  <el-table-column
                    type="selection"
                    header-align="center"
                    align="center"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    type="index"
                    header-align="center"
                    align="center"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop="username"
                    header-align="center"
                    align="center"
                    label="用户名">
                  </el-table-column>
                  <el-table-column
                    prop="deptName"
                    header-align="center"
                    align="center"
                    label="机构名称">
                  </el-table-column>
                  <!--<el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" @click="Handle(scope.row.username)">选中</el-button>
                    </template>
                  </el-table-column>-->
                </el-table>

                <!--<div slot="footer" class="dialog-footer" >
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                    &lt;!&ndash;<el-button type="primary" :disabled="dataListSelections.length <= 0" @click="Handle(scope.row.username)">确 定</el-button>&ndash;&gt;
                </div>-->
              </div>
              </div>
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="交接时间" prop="createTime">
            <!--<el-input v-model="dataForm.createTime" placeholder="交接完成时间"></el-input>-->
            <el-date-picker v-model="dataForm.createTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"  @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:140px;"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <!--<el-form-item label="交班人 id" prop="handoverPersonId">
        <el-input v-model="dataForm.handoverPersonId" placeholder="交班人id"></el-input>
      </el-form-item>-->
      <!--<el-form-item label="接班人 id" prop="successorId">
        <el-input v-model="dataForm.successorId" placeholder="记录人id"></el-input>
      </el-form-item>-->
      <!--<el-form-item label="交接完成时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="交接完成时间"></el-input>
      </el-form-item>-->

      <!--<el-form-item label="人员精神状态（1正常，2异常）" prop="personnelMentalState">
        <el-input v-model="dataForm.personnelMentalState" placeholder="人员精神状态（1正常，2异常）"></el-input>
      </el-form-item>
      <el-form-item label="人员精神异常描述" prop="mentalException">
        <el-input v-model="dataForm.mentalException" placeholder="人员精神异常描述"></el-input>
      </el-form-item>
      <el-form-item label="劳动防护用品" prop="laborProtectiveArticles">
        <el-input v-model="dataForm.laborProtectiveArticles" placeholder="劳动防护用品"></el-input>
      </el-form-item>
      <el-form-item label="劳动防护用品异常描述" prop="protectiveException">
        <el-input v-model="dataForm.protectiveException" placeholder="劳动防护用品异常描述"></el-input>
      </el-form-item>
      <el-form-item label="工器具（1正常，2异常）" prop="tools">
        <el-input v-model="dataForm.tools" placeholder="工器具（1正常，2异常）"></el-input>
      </el-form-item>
      <el-form-item label="工器具异常描述" prop="toolsException">
        <el-input v-model="dataForm.toolsException" placeholder="工器具异常描述"></el-input>
      </el-form-item>
      <el-form-item label="其他异常" prop="otherException">
        <el-input v-model="dataForm.otherException" placeholder="其他异常"></el-input>
      </el-form-item>
      <el-form-item label="工作安排" prop="workTask">
        <el-input v-model="dataForm.workTask" placeholder="工作安排"></el-input>
      </el-form-item>
      <el-form-item label="危险点" prop="dangerousPoint">
        <el-input v-model="dataForm.dangerousPoint" placeholder="危险点"></el-input>
      </el-form-item>
      <el-form-item label="防范措施" prop="preventiveMeasures">
        <el-input v-model="dataForm.preventiveMeasures" placeholder="防范措施"></el-input>
      </el-form-item>-->
      <!--<el-form-item label="交底人" prop="manAgreement">
        <el-input v-model="dataForm.manAgreement" placeholder="交底人"></el-input>
      </el-form-item>
      <el-form-item label="班组成员" prop="teamMembers">
        <el-input v-model="dataForm.teamMembers" placeholder="班组成员"></el-input>
      </el-form-item>
      <el-form-item label="工作总结" prop="workSummary">
        <el-input v-model="dataForm.workSummary" placeholder="工作总结"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="personCharge">
        <el-input v-model="dataForm.personCharge" placeholder="负责人"></el-input>
      </el-form-item>-->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()"  :disabled="isHttp">确定</el-button>
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
          classGroupName: '',
          baseTurnId: '',
          logType: '1',
          logStatus: '2',
          noteTaker: '',
          handoverPerson: '',
          handoverPersonId: '',
          successor: '',
          successorId:'',
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
          personCharge: ''
        },
        deptList: [],
        TurnList: [],
        dataRule: {
          /*logNumber: [
            { required: true, message: '日志编号不能为空', trigger: 'blur' }
          ],*/
          deptId: [
            { required: true, message: '部门(工段)不能为空', trigger: 'blur' }
          ],
          classGroupName: [
            { required: true, message: '班组不能为空', trigger: 'blur' }
          ],
          baseTurnId: [
            { required: true, message: '班次不能为空', trigger: 'blur' }
          ],
          /*logType: [
            { required: true, message: '日志类型（1:班长日志，2班前日志，3班后日志）不能为空', trigger: 'blur' }
          ],
          logStatus: [
            { required: true, message: '日志状态(1待确认，2已确认，3拟制中，4已完成)不能为空', trigger: 'blur' }
          ],*/
          /*noteTaker: [
            { required: true, message: '记录人不能为空', trigger: 'blur' }
          ],*/
          handoverPerson: [
            { required: true, message: '交接人不能为空', trigger: 'blur' }
          ],
          successor: [
            { required: true, message: '接班人不能为空', trigger: 'blur' }
          ],
          /*successorId: [
            { required: true, message: '接班人id不能为空', trigger: 'blur' }
          ],*/
          createTime: [
            { required: true, message: '交接完成时间不能为空', trigger: 'blur' }
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
          /*notArrived: [
            { required: true, message: '未到人员不能为空', trigger: 'blur' }
          ],
          topArrived: [
            { required: true, message: '顶班人员不能为空', trigger: 'blur' }
          ],*/
          /*reasonsAbsence: [
            { required: true, message: '缺勤原因不能为空', trigger: 'blur' }
          ],*/
          successionRecord: [
            { required: true, message: '接班记事不能为空', trigger: 'blur' }
          ],
          onDuty: [
            { required: true, message: '当班记事不能为空', trigger: 'blur' }
          ],
          /*superiorNotice: [
            { required: true, message: '上级通知不能为空', trigger: 'blur' }
          ],*/
          accountConfession: [
            { required: true, message: '交代事项不能为空', trigger: 'blur' }
          ],
          /*personnelMentalState: [
            { required: true, message: '人员精神状态（1正常，2异常）不能为空', trigger: 'blur' }
          ],
          mentalException: [
            { required: true, message: '人员精神异常描述不能为空', trigger: 'blur' }
          ],
          laborProtectiveArticles: [
            { required: true, message: '劳动防护用品不能为空', trigger: 'blur' }
          ],
          protectiveException: [
            { required: true, message: '劳动防护用品异常描述不能为空', trigger: 'blur' }
          ],
          tools: [
            { required: true, message: '工器具（1正常，2异常）不能为空', trigger: 'blur' }
          ],
          toolsException: [
            { required: true, message: '工器具异常描述不能为空', trigger: 'blur' }
          ],
          otherException: [
            { required: true, message: '其他异常不能为空', trigger: 'blur' }
          ],
          workTask: [
            { required: true, message: '工作安排不能为空', trigger: 'blur' }
          ],
          dangerousPoint: [
            { required: true, message: '危险点不能为空', trigger: 'blur' }
          ],
          preventiveMeasures: [
            { required: true, message: '防范措施不能为空', trigger: 'blur' }
          ],
          manAgreement: [
            { required: true, message: '交底人不能为空', trigger: 'blur' }
          ],*/
          /*teamMembers: [
            { required: true, message: '班组成员不能为空', trigger: 'blur' }
          ],
          workSummary: [
            { required: true, message: '工作总结不能为空', trigger: 'blur' }
          ],
          personCharge: [
            { required: true, message: '负责人不能为空', trigger: 'blur' }
          ]*/
        },
        startDatePicker:this.beginDate(),
      }
    },
    components: {
      TableTreeColumn
    },
    mounted () {
      this.getTurnList()
      this.getDeptList()
      //this.getDeptUser()
      this.getDataList()   // 部门查询
      this.getUserDataList()  // 用户查询
    },
    computed: {
      loginuserName: {
        get () { return this.$store.state.user.name }
      },
      logNumber: {
        get () {return  this.dataForm.logNumber},
      },
      loginuserId: {
        get (){ return this.$store.state.user.id}
      }

    },
    methods: {
      init (id) {
        this.dataForm.classId = id || 0
        this.visible = true
        this.isHttp = false
        //当dom发生变化，更新后执行的回调。
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
                this.dataForm.classGroupName = data.classgrouplog.classGroupName
                this.dataForm.baseTurnId = data.classgrouplog.baseTurnId
                this.dataForm.logType = data.classgrouplog.logType
                this.dataForm.logStatus = data.classgrouplog.logStatus
                this.dataForm.noteTaker = data.classgrouplog.noteTaker
                this.dataForm.handoverPerson = data.classgrouplog.handoverPerson
                this.dataForm.handoverPersonId = data.classgrouplog.handoverPersonId
                this.dataForm.successor = data.classgrouplog.successor
                this.dataForm.successorId =data.classgrouplog.successorId
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
        if(this.dataForm.classId <= 0){
          //交班人  交班人 id 都是 登录用户
          this.dataForm.handoverPerson = this.loginuserName
          this.dataForm.handoverPersonId = this.loginuserId
          //交班人 交底人 记录人 都是 登录用户
          this.dataForm.manAgreement = this.loginuserName

          this.dataForm.noteTaker = this.loginuserName
          this.dataForm.personCharge = this.loginuserName

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
      // 机构的下拉列表
      getDeptList() {
        if(this.deptList <=0){
          this.$http({
            url: this.$http.adornUrl('/sys/dept/tree'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deptList =data
          })

        }
      },
      // 班次的下拉列表
      getTurnList(){
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
      beginDate(){
        let self = this
        return {
          disabledDate(time){
            return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      handleStartTimeChange (val) {
        this.dataForm.createTime = val
      },
      //查询部门
      getDataList (){
          this.$http({
            url: this.$http.adornUrl('/sys/dept/list'),
            method: 'get',
            params: this.$http.adornParams({'name': this.deptFrom.name})
          }).then(({data}) => {
            this.dataList = treeDataTranslate(data, 'deptId')
          })

      },
      // 选中部门 查询用户
      addOrUpdateHandle(deptId){
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'username': '',
            'deptId': deptId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.UserdataList = data.page.list
          } else {
            this.UserdataList = []
          }
          //this.dataListLoading = false
        })

      },
      // 部门用户查询
      search(){
        this.getUserDataList()
      },
      // 查询用户  （全部的部门都查询）
      getUserDataList (){
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'username': this.datauserForm.userName,
            'deptId': ''
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.UserdataList = data.page.list
          } else {
            this.UserdataList = []
          }
          //this.dataListLoading = false
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },

      // 点击人员的确定
      Handle (username){
        var userNames =username ? [username]: this.dataListSelections.map(item => {
          return item.username
        })
        var userId = userId ? [userId]:this.dataListSelections.map(item =>{
          return item.userId
        })
        if(this.title === '接班人'){
          if(this.dataListSelections.length>=2){
            this.$alert("接班人只能选择一个")
          }else{
            this.dataForm.successor =userNames.toString() // 接班人 name
            this.dataForm.successorId = userId.toString() // 接班人 id
            this.dialogFormVisible =false
          }
        }
        if(this.title === '实到人员'){
          this.dataForm.actualArrival =userNames.toString()
          this.dialogFormVisible =false
        }
        if(this.title === '未到人员'){
          this.dataForm.notArrived =userNames.toString()
          this.dialogFormVisible =false
        }
        if(this.title === '顶班人员'){
          this.dataForm.topArrived =userNames.toString()
          this.dialogFormVisible =false
        }

      },
      clickTitle (title){
        this.title = title
        this.dialogFormVisible =true
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
