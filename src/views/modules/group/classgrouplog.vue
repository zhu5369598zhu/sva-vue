<template>
  <div class="mod-group">
    <div class="show-data-table">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item prop="logNumber">
        <el-input v-model="dataForm.logNumber" placeholder="请输入日志编号" clearable ></el-input>
      </el-form-item>
      <el-form-item prop="deptId">
        <el-popover
          ref="deptListPopover"
          placement="bottom-start"
          trigger="click"
          v-model="isShowDeptTree">
          <div style="text-align: center; margin: 0">
            <el-button  size="mini" type="text"  @click="pCancel()">取消</el-button>
          </div>
          <el-tree
            :data="deptList"
            :props="deptListTreeProps"
            node-key="deptId"
            ref="deptListTree"
            @current-change="deptListTreeCurrentChangeHandle"
            :default-expand-all="false"
            :highlight-current="true"
            :expand-on-click-node="false" clearable style="width:140px;">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:deptListPopover  class="dept-list__input" style="width:140px;" placeholder="请输入机构名称" >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.classGroupName" placeholder="请输入班组名称" clearable></el-input>
      </el-form-item>
      <el-form-item  prop="baseTurnId">
        <el-select v-model="dataForm.baseTurnId" placeholder="请选择班次" clearable style="width:115px;">
          <el-option
            v-for="item in TurnList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="logType">
        <el-select v-model="dataForm.logType" placeholder="请选择日志类型" clearable style="width:135px;">
          <el-option
            v-for="item in GroupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="logStatus">
        <el-select v-model="dataForm.logStatus" placeholder="请选择日志状态" clearable style="width: 135px;">
          <el-option
            v-for="item in LogStatusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"></el-option>
        </el-select>

      </el-form-item>

      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
          <el-select v-model="dataForm.add" placeholder="新增日志"  style="width:80px;">
            <el-option :value="dataForm.add" >
              <el-button v-if="isAuth('group:classgrouplog:save')" type="text" @click="addOrUpdateHandle()" style="line-height: 22px!important;">班长日志</el-button>
            </el-option>
            <el-option :value="dataForm.add" >
              <el-button v-if="isAuth('group:classgrouplog:save')" type="text" @click="addOrUpdateBanQianHandle()" style="line-height: 22px!important;">班前会</el-button>
            </el-option>
            <el-option :value="dataForm.add" v-popover:groupListPopover>
              <el-button v-if="isAuth('group:classgrouplog:save')" type="text" @click="getbanqianDataList()"   style="line-height: 22px!important;">班后会</el-button>
            </el-option>
          </el-select>
          <el-popover
            ref="groupListPopover"
            placement="
              transform-origin:center bottom;
              z-index: 2058;
              position: absolute;
              top: 100px;
              left: 1247px;"
            trigger="click"
            highlight-current="true"
            v-model="isShowTree">
            <el-table
              :data="banqiandataList"
              :cell-style="cellStyle"
              :default-expand-all="true"
              v-loading="dataListLoading"
              >
              <el-table-column
                width="130"
                prop="logNumber"
                header-align="center"
                align="center"
                label="请选择班前会编号">
                <template slot-scope="scope">
                  <span @click="isokaddOrUpdateBanHouHandle(scope.row.classId)">{{scope.row.logNumber}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-popover>
          <el-button @click="exportExcelHandle()">导出</el-button>
    </el-form-item>
    </el-form>
    <el-table
      ref="table"
      :height="tableHeight"
      :data="dataList"
      border
      :cell-style="cellStyle"
      :row-style="rowStyle"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="index"
        width="50"
        align="center"
        lable="">
      </el-table-column>
      <el-table-column
        width="120"
        prop="logNumber"
        header-align="center"
        align="center"
        label="日志编号">
        <template slot-scope="scope">
          <a href="#" style="text-decoration: none;" @click="clickRow(scope.row)"><p>{{scope.row.logNumber}}</p></a>
        </template>
      </el-table-column>
      <el-table-column
        prop="deptName"
        header-align="center"
        align="center"
        label="车间(工段)">
      </el-table-column>
      <el-table-column
        prop="classGroupName"
        header-align="center"
        align="center"
        width="100"
        label="班组">
      </el-table-column>
      <el-table-column
        prop="baseTurnName"
        header-align="center"
        align="center"
        label="班次">
      </el-table-column>
      <el-table-column
        prop="logTypeName"
        header-align="center"
        align="center"
        label="日志类型">
      </el-table-column>
      <el-table-column
        prop="logStatusName"
        header-align="center"
        align="center"
        label="日志状态">
        <template slot-scope="scope">
          <span v-if="scope.row.logStatusName =='!待确认'" style="color: #5daf34">{{scope.row.logStatusName}}</span>
          <span v-if="scope.row.logStatusName != '!待确认'" >{{scope.row.logStatusName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="noteTaker"
        header-align="center"
        align="center"
        label="记录人">
      </el-table-column>
      <el-table-column
        prop="handoverPerson"
        header-align="center"
        align="center"
        label="交班(底)人">
      </el-table-column>
      <el-table-column
        prop="successorName"
        header-align="center"
        align="center"
        label="接班(底)人">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="140"
        label="交接(底)时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" v-if="scope.row.logStatus == '1'" @click="updateHandle(scope.row.classId,scope.row.logStatus,scope.row.logType)">修改</el-button>
          <el-button type="text" size="small" v-if="scope.row.logStatus != '1'" :disabled="scope.row.logStatus != '1'" style="color: #8c939d;">修改</el-button>
          <el-button type="text" size="small" v-if="scope.row.logStatus == '1'" @click="deleteHandle(scope.row.classId,scope.row.logStatus)">删除</el-button>
          <el-button type="text" size="small" v-if="scope.row.logStatus != '1'" :disabled="scope.row.logStatus != '1'" style="color: #8c939d;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
      <!-- 班长日志详情 -->
      <el-dialog
        :title="logdataForm.logNumber ? '班长日志详情' : '班长日志详情'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogonevisible"
        v-if="dialogonevisible">
        <el-form :model="logdataForm"  ref="logdataForm"  label-width="80px">
          日志编号:{{logdataForm.logNumber}}
          <el-row>
            <el-col :span="8">
              <el-form-item label="部门(工段)" prop="deptId">
                <el-input v-model="logdataForm.deptName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="班组" prop="classGroupName">
                <el-input v-model="logdataForm.classGroupName" style="width:120px;" readonly ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="班次" prop="baseTurnId">
                <el-input v-model="logdataForm.baseTurnName" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="班长" prop="monitor">
                <el-input v-model="logdataForm.monitor"  readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="应出勤人数" prop="shouldAttendance">
                <el-input v-model="logdataForm.shouldAttendance"  readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实出勤人数" prop="attendance">
                <el-input v-model="logdataForm.attendance"  readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="实到人员" prop="actualArrival">
            <el-input v-model="logdataForm.actualArrival"  readonly></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="4">
            </el-col>
            <el-col :span="8">
              <el-form-item  label="未到人员" prop="notArrived">
                <el-input v-model="logdataForm.notArrived"  readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item  label="顶班人员" prop="topArrived">
                <el-input v-model="logdataForm.topArrived"  readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item  label="缺勤原因" prop="reasonsAbsence">
            <el-input v-model="logdataForm.reasonsAbsence"  readonly></el-input>
          </el-form-item>
          <el-form-item label="接班记事" prop="successionRecord">
            <el-input type="textarea"
                      autosize
                      v-model="logdataForm.successionRecord"  readonly></el-input>
          </el-form-item>
          <el-form-item label="当班记事" prop="onDuty">
            <el-input type="textarea"
                      autosize
                      v-model="logdataForm.onDuty"  readonly></el-input>
          </el-form-item>
          <el-form-item label="上级通知" prop="superiorNotice">
            <el-input type="textarea"
                      autosize
                      v-model="logdataForm.superiorNotice"  readonly></el-input>
          </el-form-item>
          <el-form-item label="交代事项" prop="accountConfession">
            <el-input type="textarea"
                      autosize
                      v-model="logdataForm.accountConfession"  readonly></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="交班人" prop="handoverPerson">
                <el-input v-model="logdataForm.handoverPerson"  readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="接班人" prop="successor">
                <el-input v-model="logdataForm.successor" readonly ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交接时间" prop="createTime">
                <el-input v-model="logdataForm.createTime" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
      <!-- 班前会详情-->
      <el-dialog
        :title="logdataForm.logNumber ? '班前会详情' : '班前会详情'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogtwovisible"
        v-if="dialogtwovisible">
        <el-form :model="logdataForm"  ref="logdataForm"  label-width="80px">
        日志编号: {{logdataForm.logNumber}}
        <el-row>
          <el-col :span="8">
            <el-form-item label="部门(工段)" prop="deptName">
              <el-input v-model="logdataForm.deptName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班组" prop="classGroupName">
              <el-input v-model="logdataForm.classGroupName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="班次" prop="baseTurnName">
              <el-input v-model="logdataForm.baseTurnName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="班长" prop="monitor">
              <el-input v-model="logdataForm.monitor" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应出勤人数" prop="shouldAttendance">
              <el-input v-model="logdataForm.shouldAttendance" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实出勤人数" prop="attendance">
              <el-input v-model="logdataForm.attendance" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="实到人员" prop="actualArrival">
          <el-input v-model="logdataForm.actualArrival" readonly></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item  label="未到人员" prop="notArrived">
              <el-input v-model="logdataForm.notArrived" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  label="顶班人员" prop="topArrived">
              <el-input v-model="logdataForm.topArrived" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item  label="缺勤原因" prop="reasonsAbsence">
          <el-input v-model="logdataForm.reasonsAbsence" readonly></el-input>
        </el-form-item>
        <el-form-item label="人员精神异常" prop="mentalException">
          <el-input type="textarea" autosize v-model="logdataForm.mentalException" readonly></el-input>
        </el-form-item>
        <el-form-item  label="劳动防护用品异常" prop="protectiveException">
          <el-input type="textarea" autosize v-model="logdataForm.protectiveException" readonly></el-input>
        </el-form-item>
        <el-form-item  label="工器具异常" prop="toolsException">
          <el-input type="textarea" autosize v-model="logdataForm.toolsException" readonly></el-input>
        </el-form-item>
        <el-form-item label="其他异常" prop="otherException">
          <el-input type="textarea" autosize v-model="logdataForm.otherException" readonly></el-input>
        </el-form-item>
        <el-form-item label="工作安排" prop="workTask">
          <el-input type="textarea" autosize v-model="logdataForm.workTask" readonly></el-input>
        </el-form-item>
        <el-form-item label="危险点" prop="dangerousPoint">
          <el-input type="textarea" autosize v-model="logdataForm.dangerousPoint" readonly></el-input>
        </el-form-item>
        <el-form-item label="防范措施" prop="preventiveMeasures">
          <el-input type="textarea" autosize v-model="logdataForm.preventiveMeasures" readonly></el-input>
        </el-form-item>
          <el-form-item label="班组成员" prop="teamMembers">
            <el-input v-model="logdataForm.teamMembers" readonly></el-input>
          </el-form-item>
        <el-row>
          <el-col :span="7">
            <el-form-item label="交底人" prop="manAgreement">
              <el-input v-model="logdataForm.manAgreement" readonly ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="交接时间" prop="createTime">
              <el-input v-model="logdataForm.createTime" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        </el-form>
      </el-dialog>
      <!-- 班后会详情-->
      <el-dialog
        :title="dialogthreevisible ? '班后会详情' : '班后会详情'"
        :close-on-click-modal="false"
        :append-to-body='true'
        :visible.sync="dialogthreevisible"
        v-if="dialogthreevisible">
        <el-form :model="logdataForm"  ref="logdataForm"  label-width="100px">
          日志编号: {{logdataForm.logNumber}}
          <el-row>
            <el-col :span="8">
              <el-form-item label="部门(工段)" prop="deptName">
                <el-input v-model="logdataForm.deptName"  readonly>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="班组" prop="classGroupName">
                <el-input v-model="logdataForm.classGroupName" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="班次" prop="baseTurnName">
                <el-input v-model="logdataForm.baseTurnName" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="班长" prop="monitor">
                <el-input v-model="logdataForm.monitor" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="应出勤人数" prop="shouldAttendance">
                <el-input v-model="logdataForm.shouldAttendance" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="实出勤人数" prop="attendance">
                <el-input v-model="logdataForm.attendance" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="实到人员" prop="actualArrival">
            <el-input v-model="logdataForm.actualArrival" readonly>
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="8">
              <el-form-item label="未到人员" prop="notArrived">
                <el-input v-model="logdataForm.notArrived" readonly>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="顶班人员" prop="topArrived">
                <el-input v-model="logdataForm.topArrived" readonly>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="缺勤原因" prop="reasonsAbsence">
            <el-input v-model="logdataForm.reasonsAbsence" readonly></el-input>
          </el-form-item>
          <el-form-item  label="人员精神异常" prop="mentalException">
            <el-input type="textarea" autosize v-model="logdataForm.mentalException" readonly></el-input>
          </el-form-item>
          <el-form-item  label="劳动防护用品异常描述" prop="protectiveException">
            <el-input type="textarea" autosize v-model="logdataForm.protectiveException" readonly></el-input>
          </el-form-item>
          <el-form-item  label="工器具异常描述" prop="toolsException">
            <el-input type="textarea" autosize v-model="logdataForm.toolsException" readonly></el-input>
          </el-form-item>
          <el-form-item label="其他异常" prop="otherException">
            <el-input type="textarea" autosize v-model="logdataForm.otherException" readonly></el-input>
          </el-form-item>
          <el-form-item label="工作安排" prop="workTask">
            <el-input type="textarea" autosize v-model="logdataForm.workTask" readonly></el-input>
          </el-form-item>
          <el-form-item label="工作总结" prop="workSummary">
            <el-input type="textarea" autosize v-model="logdataForm.workSummary" readonly></el-input>
          </el-form-item>
          <el-form-item label="班组成员" prop="teamMembers">
            <el-input v-model="logdataForm.teamMembers" readonly >
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="7">
              <el-form-item label="负责人" prop="personCharge">
                <el-input v-model="logdataForm.personCharge" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="交接时间" prop="createTime">
                <el-input v-model="logdataForm.createTime" style="width: 160px" readonly></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-dialog>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <banhou v-if="banhouVisible" ref="banhou" @refreshDataList="getDataList"></banhou>
    <banqian v-if="banqianVisible" ref="banqian" @refreshDataList="getDataList"></banqian>
  </div>
  </div>
</template>

<script>
  import { formatDate } from '@/utils'
  import AddOrUpdate from './classgrouplog-add-or-update'
  import banhou from './classgrouplog-banhou'
  import banqian from './classgrouplog-banqian'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          logNumber: '',
          deptId: '',
          classGroupName: '',
          baseTurnId: '',
          logType: '',
          logStatus: '',
          add: '新增'
        },
        tableHeight: 300,
        logStatus: '',
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        TurnList: [],
        GroupList: [{id: '1', name: '班长日志'}, {id: '2', name: '班前日志'}, {id: '3', name: '班后日志'}],
        LogStatusList: [{id: '1', name: '拟制中'}, {id: '2', name: '待确认'}, {id: '3', name: '已确认'}],
        dataList: [],
        banqiandataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        banqianVisible: false,
        banhouVisible: false,
        HouHandleVisable: false,
        isShowTree: false,
        isShowDeptTree: false,
        logdataForm: {
          classId: 0,
          logNumber: '',
          deptId: '',
          deptName: '',
          classGroupName: '',
          baseTurnId: '',
          baseTurnName: '',
          logType: '',
          logStatus: '',
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
        dialogonevisible: false,
        dialogtwovisible: false,
        dialogthreevisible: false
      }
    },
    components: {
      AddOrUpdate,
      banhou,
      banqian
    },
    activated () {
      this.getTurnList()
      this.getDeptList()
      this.getDataList()
      this.getbanqianDataList()
    },
    methods: {

      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/group/classgrouplog/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'logNumber': this.dataForm.logNumber,
            'deptId': this.dataForm.deptId,
            'classGroupName': this.dataForm.classGroupName,
            'baseTurnId': this.dataForm.baseTurnId,
            'logType': this.dataForm.logType,
            'logStatus': this.dataForm.logStatus
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      getbanqianDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/group/classgrouplog/banqianlist'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.banqiandataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.banqiandataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 导出
      exportToExcel(list) {
        this.dataListLoading = true
        require.ensure([], () => {
          const {export_json_to_excel} = require('@/vendor/Export2Excel')
          const tHeader = ['日志编号', '车间(工段)', '班组', '班次', '日志类型', '日志状态', '记录人', '交接人', '接班人', '交接完成时间', '班长', '应出勤人数', '实出勤人数', '实到人员', '未到人员', '顶班人员', '缺勤原因', '接班记事', '当班记事', '上级通知', '交代事项', '人员精神异常描述', '劳动防护用品异常描述', '工器具异常描述', '其他异常', '工作安排', '危险点', '防范措施', '交底人', '班组成员', '工作总结', '负责人', '驳回原因']
          const filterVal = ['logNumber', 'deptName', 'classGroupName', 'baseTurnName', 'logTypeName', 'logStatusName', 'noteTaker', 'handoverPerson', 'successor', 'createTime', 'monitor', 'shouldAttendance', 'attendance', 'actualArrival', 'notArrived', 'topArrived', 'reasonsAbsence', 'successionRecord', 'onDuty', 'superiorNotice', 'accountConfession', 'mentalException', 'protectiveException', 'toolsException', 'otherException', 'workTask', 'dangerousPoint', 'preventiveMeasures', 'manAgreement', 'teamMembers', 'workSummary', 'personCharge', 'rejectReason']
          const data = this.formatJson(filterVal, list)
          let filename = formatDate(new Date(), 'yyyyMMddhhmmss')
          export_json_to_excel({
            header: tHeader,
            data,
            filename: filename,
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.dataListLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      // 获取数据列表 导出
      exportExcelHandle() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/group/classgrouplog/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key,
            'logNumber': this.dataForm.logNumber,
            'deptId': this.dataForm.deptId,
            'classGroupName': this.dataForm.classGroupName,
            'baseTurnId': this.dataForm.baseTurnId,
            'logType': this.dataForm.logType,
            'logStatus': this.dataForm.logStatus
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.exportToExcel(data.page.list)
          } else {
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
        })
      },
      rowStyle({row, rowIndex}) {
        return 'height:40px'
      },
      cellStyle() {
        return 'padding:0'
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
      getTurnList() {
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
        this.dataForm.deptId = data.deptId
        this.dataForm.deptName = data.name
        this.isShowDeptTree = false
      },
      // 部门树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
        this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      getDeptList () {
        if (this.deptList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/sys/dept/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.deptList = treeDataTranslate(data, 'deptId')
          })
        }
      },
      // 修改选择
      updateHandle(id, logStatus, logType) {
        if (logStatus === '1') { // 拟制中 待确认可以修改
          if (logType === '1') { // 班长日志
            this.addOrUpdateHandle(id)
          }
          if (logType === '2') { // 班前日志
            this.addOrUpdateBanQianHandle(id)
          }
          if (logType === '3') { // 班后日志
            var isok = false
            this.addOrUpdateBanHouHandle(id, isok)
          }
        }
        // 已确定 和已完成 不能修改
        if (logStatus === '3' || logStatus === '4') {
          this.$alert('日志状态为 已确认或驳回的日志 不能修改')
        }
      },
      // 新增 / 修改  班长日志
      addOrUpdateHandle(id) {
        this.addOrUpdateVisible = true
        this.banhouVisible = false
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 选中 之前的日志
      isokaddOrUpdateBanHouHandle(classId) {
        var isok = true
        this.addOrUpdateBanHouHandle(classId, isok)
        this.isShowTree = false
      },
      // 新增 / 修改 班后日志
      addOrUpdateBanHouHandle(id, isok) {
        this.addOrUpdateVisible = false
        this.banhouVisible = true
        this.$nextTick(() => {
          this.$refs.banhou.init(id, isok)
        })
      },
      // 新增 / 修改 班前日志
      addOrUpdateBanQianHandle(id) {
        this.banqianVisible = true
        this.$nextTick(() => {
          this.$refs.banqian.init(id)
        })
      },
      // 删除
      deleteHandle(id, loginStatus) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.classId
        })
        this.$confirm(`确定删除?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/group/classgrouplog/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 点击日志编号查看 详情
      clickRow(row) {
        this.$http({
          url: this.$http.adornUrl(`/group/classgrouplog/info/` + row.classId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.logdataForm.logType = ''
            this.logdataForm.logNumber = data.classgrouplog.logNumber
            this.logdataForm.deptId = data.classgrouplog.deptId
            this.logdataForm.deptName = data.classgrouplog.deptName
            this.logdataForm.classGroupName = data.classgrouplog.classGroupName
            this.logdataForm.baseTurnId = data.classgrouplog.baseTurnId
            this.logdataForm.baseTurnName = data.classgrouplog.baseTurnName
            this.logdataForm.logType = data.classgrouplog.logType
            this.logdataForm.logStatus = data.classgrouplog.logStatus
            this.logdataForm.noteTaker = data.classgrouplog.noteTaker
            this.logdataForm.handoverPerson = data.classgrouplog.handoverPerson
            this.logdataForm.handoverPersonId = data.classgrouplog.handoverPersonId
            this.logdataForm.successor = data.classgrouplog.successor
            this.logdataForm.successorId = data.classgrouplog.successorId
            this.logdataForm.createTime = data.classgrouplog.createTime
            this.logdataForm.monitor = data.classgrouplog.monitor
            this.logdataForm.shouldAttendance = data.classgrouplog.shouldAttendance
            this.logdataForm.attendance = data.classgrouplog.attendance
            this.logdataForm.actualArrival = data.classgrouplog.actualArrival
            this.logdataForm.notArrived = data.classgrouplog.notArrived
            this.logdataForm.topArrived = data.classgrouplog.topArrived
            this.logdataForm.reasonsAbsence = data.classgrouplog.reasonsAbsence
            this.logdataForm.successionRecord = data.classgrouplog.successionRecord
            this.logdataForm.onDuty = data.classgrouplog.onDuty
            this.logdataForm.superiorNotice = data.classgrouplog.superiorNotice
            this.logdataForm.accountConfession = data.classgrouplog.accountConfession
            this.logdataForm.personnelMentalState = data.classgrouplog.personnelMentalState
            this.logdataForm.mentalException = data.classgrouplog.mentalException
            this.logdataForm.laborProtectiveArticles = data.classgrouplog.laborProtectiveArticles
            this.logdataForm.protectiveException = data.classgrouplog.protectiveException
            this.logdataForm.tools = data.classgrouplog.tools
            this.logdataForm.toolsException = data.classgrouplog.toolsException
            this.logdataForm.otherException = data.classgrouplog.otherException
            this.logdataForm.workTask = data.classgrouplog.workTask
            this.logdataForm.dangerousPoint = data.classgrouplog.dangerousPoint
            this.logdataForm.preventiveMeasures = data.classgrouplog.preventiveMeasures
            this.logdataForm.manAgreement = data.classgrouplog.manAgreement
            this.logdataForm.teamMembers = data.classgrouplog.teamMembers
            this.logdataForm.workSummary = data.classgrouplog.workSummary
            this.logdataForm.personCharge = data.classgrouplog.personCharge
            if (this.logdataForm.logType === '1') {
              this.dialogtwovisible = false
              this.dialogthreevisible = false
              this.dialogonevisible = true
            } else if (this.logdataForm.logType === '2') {
              this.dialogonevisible = false
              this.dialogthreevisible = false
              this.dialogtwovisible = true
            } else if (this.logdataForm.logType === '3') {
              this.dialogonevisible = false
              this.dialogtwovisible = false
              this.dialogthreevisible = true
            }
          }
        })
      },
      pCancel () {
        this.dataForm.deptId = ''
        this.dataForm.deptName = ''
        this.isShowDeptTree = false
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 105 - 32 - 20

        let self = this
        window.onresize = function () {
          self.tableHeight = window.innerHeight - self.$refs.table.$el.offsetTop - 105 - 32 - 20
        }
      })
    }
  }
</script>
<style>
 .el-table__expanded-cell[class*=cell] {
   padding: 0px 50px;
 }
 /*.el-popper[x-placement^=bottom] {
  margin-top: -50px;
}*/

</style>

