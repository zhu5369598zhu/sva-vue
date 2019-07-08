<template>
  <el-dialog
    :title="!this.dataForm.defectiveId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :append-to-body='true'
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <!--<el-form-item label="缺陷单编号" prop="defectiveNumber">
      {{dataForm.defectiveNumber}}
    </el-form-item>-->
    <el-form-item label="缺陷单主题" prop="defectiveTheme">
      <el-input v-model="dataForm.defectiveTheme" placeholder="缺陷单主题"></el-input>
    </el-form-item>
    <el-row>
      <el-col :span="8">
      <el-form-item label="所属机构" prop="deptName">
        <el-input v-model="dataForm.deptName" :disabled="true">
          <span slot="suffix">
              <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/renren.jpg" @click="clickdept()" ></a>
          </span>
        </el-input>
      </el-form-item>
      <el-dialog title="选择部门" :visible.sync="dialogDeptVisible" v-if="dialogDeptVisible" :append-to-body="true" width="400px">
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
                ></table-tree-column>
                <el-table-column
                  header-align="center"
                  align="center"
                  width="150"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button  type="text" size="small" @click="deptHandle(scope.row.deptId, scope.row.name)">选中</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-dialog>
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
    <el-row>
      <el-col :span="8">
        <el-form-item label="缺陷填报人" prop="defectiveName">
          <el-input v-model="dataForm.defectiveName" placeholder="缺陷填报人" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="归属设备" prop="defectiveDevice">
          <el-input v-model="dataForm.defectiveDevice" :disabled="true" >
            <span slot="suffix">
                  <a  href="#"><img alt="" style="height: 25px;width: 25px" src="./../../../../static/img/device.jpg" @click="clickdevice()" ></a>
              </span>
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
      <el-dialog title="可选择设备列表" :visible.sync="dialogDeviceVisible" v-if="dialogDeviceVisible" :append-to-body='true'>
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
            <el-form :inline="true" :model="datadeviceForm" >
              <el-row>
                <el-col :span="8">
                  <el-form-item>
                    <el-input v-model="datadeviceForm.deviceName" placeholder="设备名称" clearable style="width: 100px;"></el-input>
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
                    <el-button @click="dialogDeviceVisible = false">取消</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-table
              :data="DevicedataList"
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
                prop="deviceName"
                header-align="center"
                align="center"
                label="设备名称">
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

      <el-form-item label="缺陷单内容" prop="orderContent">
      <el-input
        type="textarea"
        autosize
        v-model="dataForm.orderContent" placeholder="缺陷单内容"></el-input>
    </el-form-item>
    <el-form-item label="缺陷单填报人意见" prop="defectiveNameOpinion">
      <el-input
        type="textarea"
        autosize
        v-model="dataForm.defectiveNameOpinion" placeholder="缺陷单填报人意见"></el-input>
    </el-form-item>
    <!--<el-form-item label="工单确认人" prop="orderConfirmer">
      <el-input v-model="dataForm.orderConfirmer" placeholder="工单确认人"></el-input>
    </el-form-item>-->
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
        dataExceptionList: [],
        dataForm: {
          defectiveId: 0,
          defectiveNumber: '',
          defectiveTheme: '',
          defectiveType: '1',
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
          defectiveDevice: ''
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
        },
        dialogDeptVisible: false,
        deptFrom: {
          name: '',
          deptId: null
        },
        dataDeptList: [],
        dialogDeviceVisible: false,
        datadeviceForm: {
          deviceName: ''
        },
        DevicedataList: [],
        dataListSelections: [],
        pageIndex: 1,
        pageSize: 200,
        key: '',
        select: 'deviceName'
      }
    },
    components: {
      TableTreeColumn
    },
    mounted () {
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
      init (id) {
        this.dataForm.defectiveId = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.defectiveId) {
            this.$http({
              url: this.$http.adornUrl(`/management/orderdefective/info/${this.dataForm.defectiveId}`),
              method: 'get',
              params: this.$http.adornParams()
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
              }
            })
          }
        })
        // 新增  工单编号  managementNumber
        if (this.dataForm.defectiveId <= 0) {
         // 缺陷填报人 和 缺陷确定人 都是 当前登录用户
          this.dataForm.defectiveName = this.loginuserName
          this.dataForm.defectiveNameId = this.loginuserId
          // this.dataForm.orderConfirmer = this.loginuserName
          // this.dataForm.orderConfirmerId = this.loginuserId
          /*this.$http({
            url: this.$http.adornUrl('/management/orderdefective/managementNumber'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.dataForm.defectiveNumber = data.managementNumber
          })*/
        }
      },
      // 点击设备图标
      clickdevice () {
        this.getDeptDataList()
        this.dialogDeviceVisible = true
      },
      // 搜索设备
      search () {
        this.getDeviceList()
      },
      // 选中部门 查询设备列表
      depteHandle (val) {
        this.currentRow = val
        this.deptFrom.deptId = this.currentRow.deptId
        this.getDeviceList()
      },
      handle (deviceName) {
        var userName = deviceName ? [deviceName] : this.dataListSelections.map(item => {
          return item.deviceName
        })
        this.dataForm.defectiveDevice = userName.toString()
        this.dialogDeviceVisible = false
      },
      getDeviceList () {
        this.$http({
          url: this.$http.adornUrl('/inspection/device/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'deptId': this.deptFrom.deptId,
            'filterkey': this.select,
            'key': this.datadeviceForm.deviceName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.DevicedataList = data.page.list
          }
        })
      },
      // 选中部门 查询设备列表
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 点击部门图标
      clickdept () {
        this.getDeptDataList()
        this.dialogDeptVisible = true
      },
      deptHandle (deptId, name) {
        this.dataForm.deptId = deptId
        this.dataForm.deptName = name
        this.dialogDeptVisible = false
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
      // 异常等级
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/management/orderdefective/${!this.dataForm.defectiveId ? 'save' : 'update'}`),
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
                'defectiveDevice': this.dataForm.defectiveDevice
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
