<template>
  <el-dialog
    v-dialog-drag
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :append-to-body='true'
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px">
    <!--<el-form-item label="工单编号" prop="orderNumber">{{this.dataForm.orderNumber}}
    </el-form-item>-->
    <el-row>
      <el-col :span="12">
        <el-form-item label="工单主题" prop="orderName">
          <el-input size="mini" v-model="dataForm.orderName" placeholder="工单主题"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
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
              class="tree"
              @current-change="deptListTreeCurrentChangeHandle"
              :default-expand-all="false"
              :highlight-current="true"
              :expand-on-click-node="false" clearable >
            </el-tree>
          </el-popover>
          <el-input size="mini" v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" class="dept-list__input" placeholder="部门" >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="工单内容" prop="orderContent">
      <el-input
        type="textarea"
        autosize
        v-model="dataForm.orderContent" placeholder="工单内容"></el-input>
    </el-form-item>
    <el-form-item label="工单操作人意见" prop="orderApplicantOpinion" >
      <el-input
        type="textarea"
        autosize
        v-model="dataForm.orderApplicantOpinion" placeholder="工单操作人意见"></el-input>
    </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工单受理人" prop="orderAcceptor">
            <el-input size="mini" v-model="dataForm.orderAcceptor" placeholder="工单受理人" :disabled="true">
              <span slot="suffix">
                <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickTitle()" ></a>
              </span>
            </el-input>
            <el-dialog v-dialog-drag title="可选择用户列表" :visible.sync="dialogFormVisible" v-if="dialogFormVisible"  :append-to-body='true' style="clear: both;">
              <div style="display: flex;justify-content: space-between;align-items: center;">
                <div style="width: 40%;">
                  <el-form :model="deptFrom">
                    <el-row>
                      <el-col :span="24">
                        <el-form-item>
                          <div style="display: flex; flex-wrap: nowrap; height: 28px; align-items: center;">
                            <el-input size="mini" v-model="deptFrom.name" placeholder="机构名称" clearable ></el-input>
                            <el-button size="mini" @click="getDeptDataList()" style="margin-left: 25px; margin-bottom: 3px;">查询</el-button>
                          </div>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <el-table
                    highlight-current-row
                    border
                    @current-change="addOrUpdateHandle"
                    :data="dataDeptList"
                    style="width: 100%;height: 400px;overflow: scroll;">
                    <el-table-column
                      type="index"
                      header-align="center"
                      align="center"
                      width="80">
                    </el-table-column>
                    <table-tree-column
                      prop="name"
                      header-align="center"
                      treeKey="deptId"
                      label="机构名称"
                    >
                    </table-tree-column>
                  </el-table>
                </div>
                <div style="width: 56%; height: 100%;">
                  <el-form :inline="true" :model="datauserForm" >
                    <el-form-item>
                      <el-input size="mini" v-model="datauserForm.userName" placeholder="用户名称" clearable style="width: calc( 100% - 225px); margin-right: 20px;"></el-input>
                      <div class="buttons" style="width: 200px; display: inline-block;">
                        <el-button size="mini" @click="search">查询</el-button>
                        <el-button size="mini" type="danger" @click="handle()" :disabled="dataListSelections.length <= 0">确定</el-button>
                        <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
                      </div>
                    </el-form-item>
                  </el-form>
                  <el-table
                    :data="UserdataList"
                    border
                    style="width: 100%;height:400px;overflow: scroll;"
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
                  </el-table>
                </div>
              </div>
            </el-dialog>

          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="要求完成时间" prop="requirementTime">
            <el-date-picker v-model="dataForm.requirementTime" type="datetime" value-format="yyyy-MM-dd HH:00:00"  @change="handleStartTimeChange" :picker-options="startDatePicker" style="width:100%;" size="mini" ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isHttp">确定</el-button>
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
        isShowDeptTree: false,
        dataList: [],
        dataDeptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        deptFrom: {
          name: ''
        },
        datauserForm: {
          userName: ''
        },
        pageIndex: 1,
        limit: 2000,
        UserdataList: [],
        dataListSelections: [],
        dataForm: {
          orderId: 0,
          orderNumber: '',
          defectiveId: '',
          defectiveNumber: '',
          orderName: '',
          deptId: '',
          deptName: '',
          defectiveName: '',
          orderContent: '',
          orderApplicant: '',
          orderApplicantId: '',
          orderApplicantOpinion: '',
          orderAcceptor: '',
          orderAcceptorId: '',
          orderAcceptorOpinion: '',
          orderConfirmer: '',
          orderConfirmerId: '',
          orderConfirmerOpinion: '',
          requirementTime: '',
          confirmedTime: '',
          actualTime: '',
          delayTime: '',
          orderStatus: '',
          orderType: '',
          levelId: '',
          orderDevice: ''
        },
        dataRule: {
          orderNumber: [
            { required: true, message: '工单编号不能为空', trigger: 'blur' }
          ],
          defectiveId: [
            { required: true, message: '缺陷工单id不能为空', trigger: 'blur' }
          ],
          defectiveNumber: [
            { required: true, message: '缺陷工单编号不能为空', trigger: 'blur' }
          ],
          orderName: [
            { required: true, message: '工单主题不能为空', trigger: 'blur' }
          ],
          deptName: [
            { required: true, message: '所属机构不能为空', trigger: 'change' }
          ],
          defectiveName: [
            { required: true, message: '缺陷确认人(填报)人不能为空', trigger: 'blur' }
          ],
          orderContent: [
            { required: true, message: '工单内容不能为空', trigger: 'blur' }
          ],
          orderApplicant: [
            { required: true, message: '工单操作人不能为空', trigger: 'blur' }
          ],
          orderApplicantId: [
            { required: true, message: '工单操作人用户id不能为空', trigger: 'blur' }
          ],
          orderApplicantOpinion: [
            { required: true, message: '工单操作人意见不能为空', trigger: 'blur' }
          ],
          orderAcceptor: [
            { required: true, message: '工单受理人不能为空', trigger: 'blur' }
          ],
          orderAcceptorId: [
            { required: true, message: '工单受理人 用户id不能为空', trigger: 'blur' }
          ],
          orderAcceptorOpinion: [
            { required: true, message: '工单受理人意见（结论）不能为空', trigger: 'blur' }
          ],
          orderConfirmer: [
            { required: true, message: '工单确认人不能为空', trigger: 'blur' }
          ],
          orderConfirmerId: [
            { required: true, message: '工单确认人 用户id不能为空', trigger: 'blur' }
          ],
          orderConfirmerOpinion: [
            { required: true, message: '工单确认人意见（结论）不能为空', trigger: 'blur' }
          ],
          requirementTime: [
            { required: true, message: '要求完成时间不能为空', trigger: 'blur' }
          ],
          confirmedTime: [
            { required: true, message: '确认时间不能为空', trigger: 'blur' }
          ],
          actualTime: [
            { required: true, message: '实际完成时间不能为空', trigger: 'blur' }
          ],
          delayTime: [
            { required: true, message: '申请延期时间不能为空', trigger: 'blur' }
          ],
          orderStatus: [
            { required: true, message: '0拟制中，1代受理，2待上报，3待确认，4待结算(待完结)，5已完结不能为空', trigger: 'blur' }
          ],
          orderType: [
            { required: true, message: '0 填报工单，1缺陷工单不能为空', trigger: 'blur' }
          ],
          levelId: [
            { required: true, message: '缺陷等级id不能为空', trigger: 'blur' }
          ],
          orderDevice: [
            { required: true, message: '使用的备件不能为空', trigger: 'blur' }
          ]
        },
        startDatePicker: this.beginDate()
      }
    },
    components: {
      TableTreeColumn
    },
    mounted () {
      this.getDataList()   // 部门查询
      this.getDeptDataList()
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
        this.dataForm.orderId = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.orderId) {
            this.$http({
              url: this.$http.adornUrl(`/management/ordermanagement/info/${this.dataForm.orderId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.orderNumber = data.ordermanagement.orderNumber
                this.dataForm.defectiveId = data.ordermanagement.defectiveId
                this.dataForm.defectiveNumber = data.ordermanagement.defectiveNumber
                this.dataForm.orderName = data.ordermanagement.orderName
                this.dataForm.deptId = data.ordermanagement.deptId
                this.dataForm.deptName = data.ordermanagement.deptName
                this.dataForm.defectiveName = data.ordermanagement.defectiveName
                this.dataForm.orderContent = data.ordermanagement.orderContent
                this.dataForm.orderApplicant = data.ordermanagement.orderApplicant
                this.dataForm.orderApplicantId = data.ordermanagement.orderApplicantId
                this.dataForm.orderApplicantOpinion = data.ordermanagement.orderApplicantOpinion
                this.dataForm.orderAcceptor = data.ordermanagement.orderAcceptor
                this.dataForm.orderAcceptorId = data.ordermanagement.orderAcceptorId
                this.dataForm.orderAcceptorOpinion = data.ordermanagement.orderAcceptorOpinion
                this.dataForm.orderConfirmer = data.ordermanagement.orderConfirmer
                this.dataForm.orderConfirmerId = data.ordermanagement.orderConfirmerId
                this.dataForm.orderConfirmerOpinion = data.ordermanagement.orderConfirmerOpinion
                this.dataForm.requirementTime = data.ordermanagement.requirementTime
                this.dataForm.confirmedTime = data.ordermanagement.confirmedTime
                this.dataForm.actualTime = data.ordermanagement.actualTime
                this.dataForm.delayTime = data.ordermanagement.delayTime
                this.dataForm.orderStatus = data.ordermanagement.orderStatus
                this.dataForm.orderType = data.ordermanagement.orderType
                this.dataForm.levelId = data.ordermanagement.levelId
                this.dataForm.orderDevice = data.ordermanagement.orderDevice
                this.deptListTreeSetCurrentNode()
              }
            })
          }
        })

        // 新增  工单编号  managementNumber
        if (this.dataForm.orderId <= 0) {
          this.dataForm.orderApplicantId = this.loginuserId
          this.dataForm.orderApplicant = this.loginuserName
          // this.dataForm.orderConfirmerId = this.loginuserId
          // this.dataForm.orderConfirmer = this.loginuserName
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
      // 部门查询
      getDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.dataList = treeDataTranslate(data, 'deptId')
        })
      },
      getDeptDataList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams({'name': this.deptFrom.name})
        }).then(({data}) => {
          this.dataDeptList = treeDataTranslate(data, 'deptId')
        })
      },
      // 选中部门 查询用户
      addOrUpdateHandle (val) {
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
      rowStyle () {
        return 'height:40px'
      },
      cellStyle () {
        return 'padding:0'
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

      handle (username, userid) {
        var userNames = username ? [username] : this.dataListSelections.map(item => {
          return item.username
        })
        var userId = userid ? [userid] : this.dataListSelections.map(item => {
          return item.userId
        })
        if (this.dataListSelections.length >= 2) {
          this.$alert('受理人只能选择一个')
        } else {
          this.dataForm.orderAcceptor = userNames.toString()
          this.dataForm.orderAcceptorId = userId.toString()
          this.dialogFormVisible = false
        }
      },

      clickTitle () {
        this.dialogFormVisible = true
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      beginDate () {
        return {
          disabledDate (time) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return time.getTime() < date.getTime()// 开始时间不选时，结束时间最大值大于等于当天
          }
        }
      },
      handleStartTimeChange (val) {
        this.dataForm.requirementTime = val
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/management/ordermanagement/${!this.dataForm.orderId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'orderId': this.dataForm.orderId || undefined,
                'orderNumber': this.dataForm.orderNumber,
                'defectiveId': this.dataForm.defectiveId,
                'defectiveNumber': this.dataForm.defectiveNumber,
                'orderName': this.dataForm.orderName,
                'deptId': this.dataForm.deptId,
                'defectiveName': this.dataForm.defectiveName,
                'orderContent': this.dataForm.orderContent,
                'orderApplicant': this.dataForm.orderApplicant,
                'orderApplicantId': this.dataForm.orderApplicantId,
                'orderApplicantOpinion': this.dataForm.orderApplicantOpinion,
                'orderAcceptor': this.dataForm.orderAcceptor,
                'orderAcceptorId': this.dataForm.orderAcceptorId,
                'orderAcceptorOpinion': this.dataForm.orderAcceptorOpinion,
                'orderConfirmer': this.dataForm.orderConfirmer,
                'orderConfirmerId': this.dataForm.orderConfirmerId,
                'orderConfirmerOpinion': this.dataForm.orderConfirmerOpinion,
                'requirementTime': this.dataForm.requirementTime,
                'confirmedTime': this.dataForm.confirmedTime,
                'actualTime': this.dataForm.actualTime,
                'delayTime': this.dataForm.delayTime,
                'orderStatus': this.dataForm.orderStatus,
                'orderType': this.dataForm.orderType,
                'levelId': this.dataForm.levelId,
                'orderDevice': this.dataForm.orderDevice
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
