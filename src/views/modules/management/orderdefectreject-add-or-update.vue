<template>
  <!-- 新增页面 -->
  <el-dialog
    :title="!this.dataForm.defectiveId ? '确认缺陷' : '确认缺陷'"
    :close-on-click-modal="false"
    :append-to-body='true'
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="巡检缺陷单主题" prop="defectiveTheme">
        <el-input v-model="dataForm.defectiveTheme" placeholder="巡检缺陷单主题"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="所属机构" prop="deptName">
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
          <el-form-item label="缺陷异常等级" prop="exceptionId" style="margin-left: 50px;">
            <el-select v-model="dataForm.exceptionId" style="width: 120px">
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
      <el-form-item label="巡检缺陷单内容" prop="orderContent">
        <el-input
          type="textarea"
          autosize
          v-model="dataForm.orderContent" placeholder="巡检缺陷单内容"></el-input>
      </el-form-item>
      <el-form-item label="缺陷操作人意见" prop="defectiveNameOpinion">
        <el-input
          type="textarea"
          autosize
          v-model="dataForm.defectiveNameOpinion" placeholder="缺陷操作人意见"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item
            label="要求完成时间"
            prop="requirementTime"
          >
            <el-date-picker v-model="dataForm.requirementTime" type="datetime" value-format="yyyy-MM-dd HH:00:00"  @change="handleRequirementTimeChange" :picker-options="startDatePickerTime" style="width:180px;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="工单操作人"
            prop="orderConfirmer"
            style="margin-left: 50px"
          >
            <el-input v-model="dataForm.orderConfirmer" :disabled="true" style="width: 160px; ">
            <span slot="suffix">
              <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle()" ></a>
            </span>
            </el-input>
            <el-dialog title="可选择用户列表" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" :append-to-body='true'>
              <div style="display: flex;justify-content: space-around;align-items: center;">
                <div style="width:400px;height: 500px;">
                  <el-form :model="deptFrom">
                    <el-row>
                      <el-col :span="13">
                        <el-form-item>
                          <el-input v-model="deptFrom.name" placeholder="机构名称" clearable style="width: 180px"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item>
                          <el-button @click="getDeptDataList()">查询</el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <el-table
                    :data="dataDeptList"
                    highlight-current-row
                    @current-change="depteHandle"
                    style="width: 100%;height: 440px;overflow: scroll;">
                    <el-table-column
                      type="index"
                      header-align="center"
                      align="center"
                      width="80">
                    </el-table-column>
                    <table-tree-column
                      style="width: auto"
                      prop="name"
                      header-align="center"
                      treeKey="deptId"
                      label="机构名称"
                    >
                    </table-tree-column>
                  </el-table>
                </div>
                <div style="width:400px;height: 500px;">
                  <el-form :inline="true" :model="datauserForm" >
                    <el-row>
                      <el-col :span="8">
                        <el-form-item>
                          <el-input v-model="datauserForm.userName" placeholder="用户名称" clearable style="width: 100px;"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item>
                          <el-button @click="search">查询</el-button>
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item>
                          <el-button  type="danger" @click="handle()" :disabled="dataListSelections.length <= 0">确定</el-button>
                        </el-form-item>
                      </el-col>
                      <el-col :span="5">
                        <el-form-item>
                          <el-button @click="dialogFormVisible = false">取消</el-button>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <el-table
                    :data="UserdataList"
                    style="width: 100%;height: 440px;overflow: scroll;"
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
                  </el-table>
                </div>
              </div>
            </el-dialog>

          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item  label="工单操作人意见" prop="orderConfirmerOpinion">
        {{dataForm.orderConfirmerOpinion}}
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="dataForm.defectiveNameId!==loginuserId || isHttp" >确认缺陷</el-button>
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
        isShowDeptTree: false,
        deptList: [],
        dataList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataExceptionList: [],
        dataForm: {
          defectiveId: 0,
          defectiveNumber: '',
          defectiveTheme: '',
          defectiveType: '0',
          deptId: '',
          deptName: '',
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
          resultId: '',
          requirementTime: '',
          orderAcceptor: '',
          orderAcceptorId: ''
        },
        startDatePickerTime: this.beginstartDate(),
        UserdataList: [],
        dataDeptList: [],
        datauserForm: {
          userName: ''
        },
        deptFrom: {
          name: ''
        },
        pageIndex: 1,
        limit: 2000,
        dataListSelections: [],
        dialogFormVisible: false,
        dataRule: {
          defectiveNumber: [
            { required: true, message: '缺陷工单编号不能为空', trigger: 'blur' }
          ],
          defectiveTheme: [
            { required: true, message: '巡检缺陷单主题不能为空', trigger: 'blur' }
          ],
          defectiveType: [
            { required: true, message: '0 巡检缺陷异常 1 填报缺陷异常不能为空', trigger: 'blur' }
          ],
          deptName: [
            { required: true, message: '所属机构不能为空', trigger: 'change' }
          ],
          exceptionId: [
            { required: true, message: '缺陷异常等级不能为空', trigger: 'blur' }
          ],
          orderContent: [
            { required: true, message: '巡检缺陷单内容不能为空', trigger: 'blur' }
          ],
          defectiveName: [
            { required: true, message: '缺陷操作人(填报)人不能为空', trigger: 'blur' }
          ],
          defectiveNameId: [
            { required: true, message: '缺陷操作人(填报)人id不能为空', trigger: 'blur' }
          ],
          defectiveNameOpinion: [
            { required: true, message: '缺陷操作人意见不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '填报时间不能为空', trigger: 'blur' }
          ],
          orderStatus: [
            { required: true, message: '0 拟制中 1 待确认 3 已转不能为空', trigger: 'blur' }
          ],
          orderConfirmer: [
            { required: true, message: '工单操作人不能为空', trigger: 'blur' }
          ],
          orderConfirmerId: [
            { required: true, message: '工单操作人不能为空', trigger: 'blur' }
          ],
          confirmedTime: [
            { required: true, message: '工单确认时间不能为空', trigger: 'blur' }
          ],
          requirementTime: [
            { required: true, message: '要求完成时间不能为空', trigger: 'blur' }
          ],
          orderAcceptor: [
            { required: true, message: '受理人不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      TableTreeColumn
    },
    mounted () {
      this.getDeptList()
      this.getExeption() // 异常等级
      this.getDeptDataList()
      this.getDataList()
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
        this.isHttp = false
        this.visible = true
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
                this.dataForm.deptName = data.orderdefective.deptName
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
                this.dataForm.requirementTime = data.orderdefective.requirementTime
                this.deptListTreeSetCurrentNode()
              }
            })
          }
        })
        // 新增  工单编号  managementNumber
        if (this.dataForm.defectiveId <= 0) {
          this.visible = true
          // 缺陷填报人 和 缺陷确定人 都是 当前登录用户
          this.dataForm.defectiveName = this.loginuserName
          this.dataForm.defectiveNameId = this.loginuserId
          this.dataForm.resultId = id
        }
      },
      // 详情页 开始
      beginstartDate () {
        return {
          disabledDate (time) {
            return time.getTime() < Date.now()// 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      handle (username, userid) {
        var userNames = username ? [username] : this.dataListSelections.map(item => {
          return item.username
        })
        var userId = userid ? [userid] : this.dataListSelections.map(item => {
          return item.userId
        })
        if (this.dataListSelections.length >= 2) {
          this.$alert('工单操作人只能选择一个')
        } else {
          this.dataForm.orderConfirmer = userNames.toString()
          this.dataForm.orderConfirmerId = userId.toString()
          this.dialogFormVisible = false
        }
      },
      // 选中部门 查询用户
      depteHandle (val) {
        this.currentRow = val
        var deptId = this.currentRow.deptId
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.limit,
            'username': '',
            'deptId': deptId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.UserdataList = data.page.list
          } else {
            this.UserdataList = []
          }
        })
      },
      search () {
        this.getUserDataList()
      },
      // 查询用户
      getUserDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/user/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.limit,
            'username': this.datauserForm.userName,
            'deptId': ''
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.UserdataList = data.page.list
          } else {
            this.UserdataList = []
          }
        })
      },
      // 查询部门
      getDeptDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams({'name': this.deptFrom.name})
        }).then(({data}) => {
          this.dataDeptList = treeDataTranslate(data, 'deptId')
        })
      },
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataList = treeDataTranslate(data, 'deptId')
        })
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      clickTitle () {
        this.dialogFormVisible = true
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
      getExeption () {
        this.$http({
          url: this.$http.adornUrl('/setting/orderexception/list'),
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
      handleRequirementTimeChange (val) {
        this.dataForm.requirementTime = val
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.dataForm.orderConfirmer === '') {
              this.$alert('工单操作人不能为空')
              return
            }
            if (this.dataForm.requirementTime === null) {
              this.$alert('要求完成时间不能为空')
              return
            }
            this.dataForm.orderConfirmerOpinion = ''
            this.dataForm.orderStatus = 2
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/management/orderdefect/orderupdate`),
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
                'resultId': this.dataForm.resultId,
                'orderAcceptor': this.dataForm.orderAcceptor,
                'orderAcceptorId': this.dataForm.orderAcceptorId,
                'requirementTime': this.dataForm.requirementTime
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
