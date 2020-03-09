<template>
  <el-dialog
    class="device-update"
    :title="isModify? '修改' : '查看'"
    v-dialog-drag
    :close-on-click-modal="false"
    :visible.sync="visible"
    :show-close="true"
    append-to-body>
    <el-tabs type="border-card" value="device" ref="tabs" @tab-click="TabsClickHandle">
      <el-tab-pane label="设备台账" name="device" actived="true" >
        <el-tabs type="border-card" value="devicepane"  @tab-click="docTabsClickHandle">
          <el-tab-pane label="设备资料" name="devicepane" actived="true">
            <div class="device-form">
              <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
                <el-row class="device-pic">
                  <el-col :span="16">
                    <el-form-item label="设备图片:" style="margin-bottom: 5px;" >
                      <el-upload
                        :action="this.$http.adornUrl(`/inspection/devicepic/upload?token=${this.$cookie.get('token')}`)"
                        accept="image/jpeg,image/gif,image/png"
                        list-type="picture-card"
                        :before-upload="onBeforeUpload"
                        :on-remove="uploadRemoveHandle"
                        :on-success="uploadSuccessHandle"
                        :on-error="uploadErrorHandle"
                        :before-remove="uploadBeforeRemoveHandle"
                        :file-list="fileList"
                        :disabled="!isModify"
                        :data="uploadParams">
                        <i class="el-icon-plus"></i>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="二维码:" style="margin-bottom: 5px;">
                      <div class="device-qrcode-contain">
                        <a style="cursor:pointer">
                          <img class="device-qrcode" :src="getQrcode(dataForm.deviceId)"></img>
                        </a>
                        <div class="gen-qrcode" align="center">
                          <el-button :disabled="!isModify" type="success" @click="createQrcode(dataForm.deviceId)" style="margin-bottom: 5px; width: 110px;">生成二维码</el-button>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="device-info">
                  <el-col :span="8">
                    <el-form-item label="设备名称:" prop="deviceName">
                      <el-input size="mini" v-model="dataForm.deviceName" placeholder="设备名称" :disabled="!isModify" clearable style="width:140px;" :readonly="true"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备等级:" prop="deviceLevel">
                      <el-select v-model="dataForm.deviceLevel" placeholder="设备等级" :disabled="!isModify" clearable style="width:140px;" size="mini" >
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
                      <!--<el-popover
                        ref="deptListPopover"
                        placement="bottom-start"
                        trigger="click"
                        v-model="isShowDeptTree">
                        <el-tree
                          :data="deptList"
                          :props="deptListTreeProps"
                          node-key="deptId"
                          ref="deptListTree"
                          class="tree"
                          @current-change="deptListTreeCurrentChangeHandle"
                          :default-expand-all="false"
                          :highlight-current="true"
                          :expand-on-click-node="false" clearable style="width:140px;">
                        </el-tree>
                      </el-popover>-->
                      <!--<el-input size="mini" v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="所属机构" class="dept-list__input" :disabled="!isModify" clearable style="width:140px;" ></el-input>-->
                      <el-input size="mini" v-model="dataForm.deptName"  :readonly="true" placeholder="所属机构" class="dept-list__input" :disabled="!isModify" clearable style="width:140px;" ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="生产日期:" prop="manufactureDate">
                      <el-date-picker v-model="dataForm.manufactureDate" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择生产日期" @change="handleDateChange" :disabled="!isModify" clearable style="width:140px;" size="mini" ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备编号:" prop="deviceNum">
                      <el-input size="mini" v-model="dataForm.deviceNum" placeholder="设备编号"  :disabled="!isModify" clearable style="width:140px;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="设备编码:" prop="deviceCode">
                      <el-input size="mini" v-model="dataForm.deviceCode" placeholder="设备编码" :readonly="true" :disabled="!isModify" clearable style="width:140px;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="设备规格:" prop="deviceUnit">
                      <el-input size="mini" v-model="dataForm.deviceUnit" placeholder="设备规格" :disabled="!isModify" clearable style="width:140px;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="生产厂家:" prop="deviceManufacturer">
                      <el-input size="mini" v-model="dataForm.deviceManufacturer" placeholder="生产厂家" :disabled="!isModify" clearable style="width:140px;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="供货商:" prop="deviceSupplier">
                      <el-input size="mini" v-model="dataForm.deviceSupplier" placeholder="供货商" :disabled="!isModify" clearable style="width:140px;"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="设备模型:" prop="deviceModel">
                      <el-input size="mini" v-model="dataForm.deviceModel" placeholder="设备模型" :disabled="!isModify" clearable style="width:140px;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="责任人:" prop="deviceMaster" :readonly="isModify">
                      <el-input size="mini" v-model="dataForm.deviceMaster" placeholder="责任人" :disabled="!isModify" clearable style="width:140px;"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <span>&nbsp;</span>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col span="8">
                    <el-form-item label="特性1" prop="featureOne">
                        <el-input size="mini" v-model="dataForm.featureOne" placeholder="特征1" clearable style="width:140px;"></el-input>
                    </el-form-item>

                  </el-col>
                  <el-col span="8">
                    <el-form-item label="特性1内容" prop="OneContent">
                      <el-input size="mini" type="textarea"
                                autosize v-model="dataForm.oneContent" placeholder="特征1内容" clearable ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col span="8">
                    <el-form-item label="特性2" prop="featureTwo">
                      <el-input size="mini" v-model="dataForm.featureTwo" placeholder="特征2" clearable style="width:140px;"></el-input>
                    </el-form-item>

                  </el-col>
                  <el-col span="8">
                    <el-form-item label="特性2内容" prop="twoContent">
                      <el-input size="mini" type="textarea"
                                autosize v-model="dataForm.twoContent" placeholder="特征2内容" clearable ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col span="8">
                    <el-form-item label="特性3" prop="featureThree">
                      <el-input size="mini" v-model="dataForm.featureThree" placeholder="特征3" clearable style="width:140px;"></el-input>
                    </el-form-item>

                  </el-col>
                  <el-col span="8">
                    <el-form-item label="特性3内容" prop="threeContent">
                      <el-input size="mini" type="textarea"
                                autosize v-model="dataForm.threeContent" placeholder="特征3内容" clearable ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col span="8">
                    <el-form-item label="特性4" prop="featureFour">
                      <el-input size="mini" v-model="dataForm.featureFour" placeholder="特征4" clearable style="width:140px;"></el-input>
                    </el-form-item>

                  </el-col>
                  <el-col span="8">
                    <el-form-item label="特性4内容" prop="fourContent">
                      <el-input size="mini" type="textarea"
                                autosize v-model="dataForm.fourContent" placeholder="特征4内容" clearable ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="是否巡检:" prop="isInspect">
                      <el-switch v-model="dataForm.isInspect" placeholder="是否巡检" :disabled="!isModify" clearable style="width:140px;"></el-switch>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="看板显示:" prop="isShowDashboard">
                      <el-switch v-model="dataForm.isShowDashboard" :disabled="!isModify" clearable style="width:140px;"></el-switch>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item>
                      <div align="center">
                        <el-button v-if="this.isModify===true" @click="visible = false">取消</el-button>
                        <el-button type="primary" v-if="this.isModify===true" @click="dataFormSubmit()" :disabled="isHttp">保存</el-button>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane label="日常维护" name="maintain">
            <order-device :disabled="!isModify" ref="orderDevice" :deviceId="dataForm.deviceId"></order-device>
          </el-tab-pane>
          <el-tab-pane label="检修信息" name="repair">
            <el-form>
              <el-form-item>
                <el-button @click="handleNewRepair">新增</el-button>
              </el-form-item>
            </el-form>
            <el-table
              height="360"
              :data="repairList"
              border
              highlight-current-row
              style="width: 100%;">
              <el-table-column
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                prop="type"
                header-align="center"
                align="center"
                label="检修类型">
              </el-table-column>
              <el-table-column
                prop="content"
                header-align="center"
                align="center"
                label="检修内容">
              </el-table-column>
              <el-table-column
                prop="repairDept"
                header-align="center"
                align="center"
                label="检修单位">
              </el-table-column>
              <el-table-column
                prop="repairtime"
                header-align="center"
                align="center"
                label="检修时间">
              </el-table-column>
              <el-table-column
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作">
                <template slot-scope="scope">
                  <!--<el-button type="text" size="small" @click="repairUpdateHandle(scope.$index)">{{scope.row.isSet?'保存':"修改"}}</el-button>-->
                  <el-button type="text" size="small" @click="repairDeleteHandle(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div align="right">
              <el-pagination class="pagecontrol"
                             @size-change="sizeChangeHandle"
                             @current-change="currentChangeHandle"
                             :current-page="repairPageIndex"
                             :page-sizes="[10, 20, 50, 100]"
                             :page-size="repairPageSize"
                             :total="repairTotalPage"
                             layout="total, sizes, prev, pager, next, jumper">
              </el-pagination>
            </div>
            <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getRepairList"></add-or-update>
            <!--<div align="center" class="repair-footer">
              <el-button v-if="this.isModify===true" @click="visible = false">取消</el-button>
             &lt;!&ndash; <el-button type="primary" v-if="this.isModify===true" @click="dataFormSubmit()" :disabled="isHttp">保存</el-button>&ndash;&gt;
            </div>-->
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane label="设备资料" name="document">
        <el-tabs type="border-card" v-model="activeTab" ref="documentTabs" @tab-click="documentTabsClickHandle">
          <el-tab-pane label="出厂资料" name="birth" actived="true">
            <deviceDocument :disabled="!isModify" ref="documentBirth" :deviceId="dataForm.deviceId"></deviceDocument>
          </el-tab-pane>
          <el-tab-pane label="调试资料" name="debug" actived="true">
            <deviceDocument :disabled="!isModify" ref="documentDebug" :deviceId="dataForm.deviceId"></deviceDocument>
          </el-tab-pane>
          <el-tab-pane label="维护保养资料" name="maintain" actived="true">
            <deviceDocument :disabled="!isModify" ref="documentMaintain" :deviceId="dataForm.deviceId"></deviceDocument>
          </el-tab-pane>
          <el-tab-pane label="故障维修资料" name="trouble" actived="true">
            <deviceDocument :disabled="!isModify" ref="documentTrouble" :deviceId="dataForm.deviceId"></deviceDocument>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import deviceDocument from '@/components/device/document'
  import orderDevice from '@/components/device/orderdevice'
  import AddOrUpdate from './repair-add-or-update'
  export default {
    computed: {
      editTable () {
        return this.$refs.editTable
      }
    },
    data () {
      return {
        repairList: [],
        addOrUpdateVisible: false,
        isModify: true,
        isHttp: false,
        visible: false,
        isShowDeptTree: false,
        deviceLevelList: [],
        deptList: [],
        fileList: [],
        repairTotalPage: 0,
        repairPageIndex: 1,
        repairPageSize: 10,
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          deviceId: null,
          category: 0,
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
          deviceMaster: '',
          featureOne: '',
          oneContent: '',
          featureTwo: '',
          twoContent: '',
          featureThree: '',
          threeContent: '',
          featureFour: '',
          fourContent: '',
          isInspect: '',
          isShowDashboard: '',
          masterId: '',
          manufactureDate: '',
          createTime: ''
        },
        activeTab: 'birth',
        deviceTab: 'device',
        uploadParams: {
          deviceId: null
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
          ],
          deviceCode: [
            { required: true, message: '设备编码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      deviceDocument,
      orderDevice,
      AddOrUpdate
    },
    methods: {
      checkSelection () {
        if (this.selection && this.selection.length) {
          return true
        } else {
          this.$message.error('请先选择数据')
        }
      },
      handleEditRows () {
        if (this.checkSelection()) {
          this.editTable.editRows(this.selection)
        }
      },
      // 获取数据列表
      getRepairList () {
        this.$http({
          url: this.$http.adornUrl('/inspection/repair/list'),
          method: 'get',
          params: this.$http.adornParams({
            'deviceId': this.dataForm.deviceId,
            'page': this.repairPageIndex,
            'limit': this.repairPageSize
          })
        }).then(({data}) => {
          console.log(data.page.list)
          if (data && data.code === 0) {
            this.repairList = data.page.list
            this.repairTotalPage = data.page.totalCount
          } else {
            this.repairList = []
            this.repairTotalPage = 0
          }
        })
      },
      repairDeleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/inspection/repair/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getRepairList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      },
      handleNewRepair (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id,this.dataForm.deviceId)
        })
      },
      onBeforeUpload (file) {
        const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
        if (!isIMAGE) {
          this.$message.error('上传文件只能是图片格式!')
        }
        return isIMAGE
      },
      TabsClickHandle (tab) {
        if (tab.label === '设备资料') {
          this.activeTab = 'birth'
          this.$refs.documentBirth.getDataList(0)
        } else if (tab.label === '设备资料') {
          this.activeTab = 'repair'
          this.$refs.editTable.getDataList(0)
        }
        if (tab.label === '设备台账'){
          this.activeTab = 'device'
          this.$refs.orderDevice.getDataList(this.dataForm.deviceId)
        }
      },
      docTabsClickHandle(tab){
        if(tab.label="日常检修"){
          // this.getRepairDeviceList()
          this.getRepairList()
        }
      },
     /* getRepairDeviceList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/inspection/repair/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'key': this.dataForm.key
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.repairTotalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.repairTotalPage = 0
          }
          this.dataListLoading = false
        })
      },*/
      documentTabsClickHandle (tab) {
        if (tab.label === '出厂资料') {
          this.$refs.documentBirth.getDataList(0)
        }
        if (tab.label === '调试资料') {
          this.$refs.documentDebug.getDataList(1)
        }
        if (tab.label === '维护保养资料') {
          this.$refs.documentMaintain.getDataList(2)
        }
        if (tab.label === '故障维修资料') {
          this.$refs.documentTrouble.getDataList(3)
        }
      },
      uploadBeforeRemoveHandle (file, filelist) {
        return this.$confirm(`确定删除文件${file.name}?`)
      },
      uploadRemoveHandle (file, filelist) {
        this.$http({
          url: this.$http.adornUrl(`/inspection/devicepic/delete/${file.name}`),
          method: 'post',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      uploadSuccessHandle (response, file, fileList) {
        if (response.code > 0) {
          this.$message.error(response.msg)
        }
      },
      uploadErrorHandle (err, file, fileList) {
        this.$message.error(err)
      },
      getQrcode (deviceId) {
        var random = Math.random()
        return this.$http.adornUrl(`/inspection/deviceqrcode/qrcode.png?deviceId=${deviceId}&random=${random}`)
      },
      createQrcode (deviceId) {
        this.$http({
          url: this.$http.adornUrl('/inspection/device/createqrcode'),
          method: 'get',
          params: this.$http.adornParams({
            'deviceId': this.dataForm.deviceId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.init(deviceId,this.isModify)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      getPicList () {
        this.filelist = []
        this.$http({
          url: this.$http.adornUrl('/inspection/devicepic/list'),
          method: 'get',
          params: this.$http.adornParams({
            'deviceId': this.dataForm.deviceId,
            'category': this.uploadParams.category
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.fileList = data.piclist.map(item => {
              item.name = item.url
              item.url = this.$http.adornUrl(`/inspection/devicepic/pic.png?uuid=${item.url}`)
              return item
            })
          } else {
            this.fileList = []
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.repairPageSize = val
        this.repairPageIndex = 1
        this.getRepairList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.repairPageIndex = val
        this.getRepairList()
      },
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
      init (id,isModify) {
        this.fileList = []
        this.isModify = isModify
        this.dataForm.deviceId = id || 0
        this.uploadParams.deviceId = this.dataForm.deviceId
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
                this.dataForm.featureOne = data.device.featureOne
                this.dataForm.oneContent = data.device.oneContent
                this.dataForm.featureTwo = data.device.featureTwo
                this.dataForm.twoContent = data.device.twoContent
                this.dataForm.featureThree = data.device.featureThree
                this.dataForm.threeContent = data.device.threeContent
                this.dataForm.featureFour = data.device.featureFour
                this.dataForm.fourContent = data.device.fourContent
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
                this.getPicList()
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
                'featureOne': this.dataForm.featureOne,
                'oneContent': this.dataForm.oneContent,
                'featureTwo': this.dataForm.featureTwo,
                'twoContent': this.dataForm.twoContent,
                'featureThree': this.dataForm.featureThree,
                'threeContent': this.dataForm.threeContent,
                'featureFour': this.dataForm.featureFour,
                'fourContent': this.dataForm.fourContent,
                'createTime': this.dataForm.createTime
              })
            }).then(({data}) => {
              this.isHttp = false
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
  .device-pic {
    margin-bottom: 5px;
  }
  .device-info {
    border-top: 1px dashed #c0ccda;
    margin-top: 5px;
    padding-top: 10px;
  }
  .device-qrcode-contain {
    width: 110px;
    height: 110px;
    border: 1px dashed #c0ccda;
  }
  .device-qrcode {
    width: 100%;
    height: 100%;
  }
  .gen-qrcode {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .device-form {
    height: 100%;
  }
  .device-update .el-dialog__body {
    padding-left: 0px;
    padding-top: 20px;
    padding-right: 0px;
    padding-bottom: 0px;
  }
  .tree{
    overflow-y: scroll;
    width:280px;
    height: 200px;
  }
  .repair-footer {
    margin: 30px;
  }
</style>
