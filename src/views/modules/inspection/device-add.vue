<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="设备名称:" prop="deviceName">
            <el-input v-model="dataForm.deviceName" placeholder="设备名称" clearable style="width:140px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备等级:" prop="deviceLevel">
            <el-select v-model="dataForm.deviceLevel" placeholder="设备等级" clearable style="width:140px;">
              <el-option
                v-for="item in deviceLevelList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属机构:" prop="deptName">
            <el-popover
              ref="deptListPopover"
              placement="bottom-start"
              trigger="click"
              v-model="isShowDeptTree">
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
            <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="所属机构" class="dept-list__input" clearable style="width:140px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="生产日期:" prop="manufactureDate">
            <el-date-picker v-model="dataForm.manufactureDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择生产日期" @change="handleDateChange" clearable style="width:140px;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备编号:" prop="deviceNum">
            <el-input v-model="dataForm.deviceNum" placeholder="设备编号" clearable style="width:140px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备编码:" prop="deviceCode">
            <el-input v-model="dataForm.deviceCode" placeholder="设备编码" clearable style="width:140px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="设备规格:" prop="deviceUnit">
            <el-input v-model="dataForm.deviceUnit" placeholder="设备规格" clearable style="width:140px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生产厂家:" prop="deviceManufacturer">
            <el-input v-model="dataForm.deviceManufacturer" placeholder="生产厂家" clearable style="width:140px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供货商:" prop="deviceSupplier">
            <el-input v-model="dataForm.deviceSupplier" placeholder="供货商" clearable style="width:140px;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="设备模型:" prop="deviceModel">
            <el-input v-model="dataForm.deviceModel" placeholder="设备模型" clearable style="width:140px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="责任人:" prop="deviceMaster">
            <el-input v-model="dataForm.deviceMaster" placeholder="责任人" clearable style="width:140px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <span>&nbsp;</span>
        </el-col>
      </el-row>
      <el-row>  
        <el-col :span="8">
          <el-form-item label="是否巡检:" prop="isInspect">
            <el-switch v-model="dataForm.isInspect" placeholder="是否巡检" clearable style="width:140px;"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="看板显示:" prop="isShowDashboard">
            <el-switch v-model="dataForm.isShowDashboard" clearable style="width:140px;"></el-switch>
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
  export default {
    data () {
      return {
        isHttp: false,
        visible: false,
        isShowDeptTree: false,
        deviceLevelList: [],
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          deviceId: 0,
          deviceName: '',
          deviceNum: '',
          deviceCode: '',
          deviceUnit: '',
          deviceManufacturer: '',
          deviceSupplier: '',
          deviceLevel: '',
          deviceDept: '',
          deptName: '',
          deviceModel: '',
          isInspect: '',
          isShowDashboard: '',
          masterId: '',
          manufactureDate: '',
          createTime: ''
        },
        dataRule: {
          deviceName: [
            { required: true, message: '设备名称不能为空', trigger: 'change' }
          ],
          deviceLevel: [
            { required: true, message: '设备等级不能为空', trigger: 'blur' }
          ],
          deptName: [
            { required: true, message: '所属机构不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
       // 获取设备级别
      getDeviceLevelList () {
        this.$http({
          url: this.$http.adornUrl('/setting/devicelevel/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deviceLevelList = data.page.list
        })
      },
       // 获取部门列表
      getDeptList () {
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data, 'deptId')
        })
      },
      init (id) {
        this.dataForm.deviceId = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.deviceId) {
            this.$http({
              url: this.$http.adornUrl(`/inspection/device/info/${this.dataForm.deviceId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.deviceName = data.device.deviceName
                this.dataForm.deviceNum = data.device.deviceNum
                this.dataForm.deviceCode = data.device.deviceCode
                this.dataForm.deviceUnit = data.device.deviceUnit
                this.dataForm.deviceManufacturer = data.device.deviceManufacturer
                this.dataForm.deviceSupplier = data.device.deviceSupplier
                this.dataForm.deviceLevel = data.device.deviceLevel
                this.dataForm.deviceDept = data.device.deviceDept
                this.dataForm.deptName = data.device.deptName
                this.dataForm.deviceModel = data.device.deviceModel
                this.dataForm.isInspect = data.device.isInspect
                this.dataForm.isShowDashboard = data.device.isShowDashboard
                this.dataForm.manufactureDate = data.device.manufactureDate
                this.dataForm.deviceMaster = data.device.deviceMaster
                this.dataForm.createTime = data.device.createTime
                if (data.device.isInspect === 1) {
                  this.dataForm.isInspect = true
                } else {
                  this.dataForm.isInspect = false
                }
                if (data.device.isShowDashboard === 1) {
                  this.dataForm.isShowDashboard = true
                } else {
                  this.dataForm.isShowDashboard = false
                }
                this.deptListTreeSetCurrentNode()
              }
            })
          }
        })
      },
      // 部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        this.dataForm.deviceDept = data.deptId
        this.dataForm.deptName = data.name
        this.isShowDeptTree = false
      },
      // 部门树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deviceDept)
        this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      handleDateChange (val) {
        this.dataForm.manufactureDate = val
      },
      // 表单提交
      dataFormSubmit () {
        var isInspect = 0
        var isShowDashboard = 0
        if (this.dataForm.isInspect === true) {
          isInspect = 1
        } else {
          isInspect = 0
        }
        if (this.dataForm.isShowDashboard === true) {
          isShowDashboard = 1
        } else {
          isShowDashboard = 0
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/inspection/device/${!this.dataForm.deviceId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'deviceId': this.dataForm.deviceId || undefined,
                'deviceName': this.dataForm.deviceName,
                'deviceNum': this.dataForm.deviceNum,
                'deviceCode': this.dataForm.deviceCode,
                'deviceUnit': this.dataForm.deviceUnit,
                'deviceManufacturer': this.dataForm.deviceManufacturer,
                'deviceSupplier': this.dataForm.deviceSupplier,
                'deviceLevel': this.dataForm.deviceLevel,
                'deviceDept': this.dataForm.deviceDept,
                'deviceModel': this.dataForm.deviceModel,
                'isInspect': isInspect,
                'isShowDashboard': isShowDashboard,
                'masterId': this.dataForm.masterId,
                'manufactureDate': this.dataForm.manufactureDate,
                'deviceMaster': this.dataForm.deviceMaster,
                'createTime': this.dataForm.createTime
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
