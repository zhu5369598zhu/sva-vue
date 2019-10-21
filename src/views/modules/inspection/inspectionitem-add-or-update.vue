<template>
  <el-dialog class="inspectionForm"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="巡检项" prop="name">
            <el-input v-model="dataForm.name" placeholder="巡检项" clearable style="width:155px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <span>&nbsp;</span>
        </el-col>
        <el-col :span="10">
          <el-form-item label="检时状态" prop="inspectionStatus">
            <el-select v-model="dataForm.inspectionStatus" placeholder="检时状态" clearable style="width:155px;">
              <el-option
                v-for="item in inspectionStatusList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="巡检类型" prop="inspectionType">
              <el-select v-model="dataForm.inspectionType" placeholder="巡检类型" clearable style="width:155px;">
                <el-option
                  v-for="item in inspectionTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button v-if="dataForm.inspectionType===8 || dataForm.inspectionType===9" @click="setting" icon="el-icon-setting">设置扩展</el-button><span>&nbsp;</span>
        </el-col>
        <el-col :span="10" v-if="dataForm.inspectionType===1 || dataForm.inspectionType===3 || dataForm.inspectionType===4 || dataForm.inspectionType===5 || dataForm.inspectionType===6 || dataForm.inspectionType===7">
          <el-form-item label="单位" prop="inspectionUnit">
            <el-select ref="unit" v-model="dataForm.inspectionUnit" placeholder="" :disabled="dataForm.inspectionType===1||dataForm.inspectionType===4||dataForm.inspectionType===5||dataForm.inspectionType===6||dataForm.inspectionType===7" clearable style="width:155px;">
              <el-option
                v-for="item in inspectionUnitList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    <el-row v-if="dataForm.inspectionType===1 || dataForm.inspectionType===4 || dataForm.inspectionType===5 || dataForm.inspectionType===6 || dataForm.inspectionType===7">
       <el-col :span="10" v-if="dataForm.inspectionType===1">
         <el-form-item label="发射率" prop="emissivity" >
           <el-input-number v-model="dataForm.emissivity" :precision="precision" controls-position="right" :step="0.01" :max="1" :min="0.7" clearable style="width:155px;"></el-input-number>
         </el-form-item>
      </el-col>
       <el-col :span="3" v-if="!(dataForm.inspectionType===4 || dataForm.inspectionType===5 || dataForm.inspectionType===6 || dataForm.inspectionType===7)">
        <span>&nbsp;</span>
      </el-col>
       <el-col :span="10" v-if="dataForm.inspectionType===4 || dataForm.inspectionType===5 || dataForm.inspectionType===6 || dataForm.inspectionType===7">
        <el-form-item label="默认转速" prop="defaultRpm">
          <el-input-number v-model="dataForm.defaultRpm" controls-position="right" :min="1" :step="1" clearable style="width:155px;"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="dataForm.inspectionType===4 || dataForm.inspectionType===5 || dataForm.inspectionType===6 || dataForm.inspectionType===7">
       <el-col :span="10">
         <el-form-item label="采样频率" prop="frequency" >
           <el-select v-model="dataForm.frequency" placeholder="采样频率" style="width:155px;">
             <el-option
               v-for="item in frequencyList"
               :key="item.id"
               :label="item.name"
               :value="item.id">
             </el-option>
           </el-select>
         </el-form-item>
      </el-col>
       <el-col :span="3">
        <span>&nbsp;</span>
      </el-col>
       <el-col :span="10">
         <el-form-item label="采样点数" prop="precision" >
          <el-select v-model="dataForm.precision" placeholder="采样点数" style="width:155px;">
            <el-option
              v-for="item in precisionList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
         </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="dataForm.inspectionType !== 9 && dataForm.inspectionType !== 8 && dataForm.inspectionType !== 2">
       <el-col :span="10">
         <el-form-item label="上限" prop="upLimit" v-if="dataForm.inspectionType !== 9 && dataForm.inspectionType !== 8 && dataForm.inspectionType !== 2">
           <el-checkbox v-model="dataForm.upUsed">报警</el-checkbox><span>&nbsp;&nbsp;&nbsp;</span>
           <el-input-number :disabled="!dataForm.upUsed" v-model="dataForm.upLimit" :precision="precision" controls-position="right" value="0.00"  :step="0.10" :min="0" style="width:125px;"></el-input-number>
         </el-form-item>
      </el-col>
       <el-col :span="3">
        <span>&nbsp;</span>
      </el-col>
       <el-col :span="10">
        <el-form-item label="上上限" prop="upupLimit" v-if="dataForm.inspectionType !== 9 && dataForm.inspectionType !== 8 && dataForm.inspectionType !== 2">
          <el-checkbox v-model="dataForm.upupUsed">危险</el-checkbox><span>&nbsp;&nbsp;&nbsp;</span>
          <el-input-number :disabled="!dataForm.upupUsed" v-model="dataForm.upupLimit" :precision="precision" controls-position="right" value="0.00"  :step="0.10" :min="0" style="width:125px;"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row v-if="dataForm.inspectionType !== 9 && dataForm.inspectionType !== 8 && dataForm.inspectionType !== 2">
       <el-col :span="10">
         <el-form-item label="下限" prop="downLimit" v-if="dataForm.inspectionType !== 9 && dataForm.inspectionType !== 8 && dataForm.inspectionType !== 2">
           <el-checkbox v-model="dataForm.downUsed">报警</el-checkbox><span>&nbsp;&nbsp;&nbsp;</span>
           <el-input-number :disabled="!dataForm.downUsed" v-model="dataForm.downLimit" :precision="precision" controls-position="right" value="0.00"  :step="0.10" :min="0" style="width:125px;"></el-input-number>
         </el-form-item>
      </el-col>
       <el-col :span="3">
        <span>&nbsp;</span>
      </el-col>
       <el-col :span="10">
         <el-form-item label="下下限" prop="downdownLimit" v-if="dataForm.inspectionType !== 9 && dataForm.inspectionType !== 8 && dataForm.inspectionType !== 2">
           <el-checkbox v-model="dataForm.downdownUsed">危险</el-checkbox><span>&nbsp;&nbsp;&nbsp;</span>
           <el-input-number :disabled="!dataForm.downdownUsed" v-model="dataForm.downdownLimit" :precision="precision" controls-position="right" value="0.00"  :step="0.10" :min="0" style="width:125px;"></el-input-number>
         </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="2" v-model="dataForm.remark" placeholder="备注" style="width:525px;" clearable></el-input>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="排序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序号" style="width:155px;"></el-input-number>
      </el-form-item>
    </el-row>
    </el-form>
    <ExtraSetting v-if="extraSettingVisible" ref="extraSetting" @extraChange="extraChange"></ExtraSetting>
    <PresuppositionSetting v-if="presuppositionSettingVisible" ref="presuppositionSetting" @presuppositionChange="presuppositionChange"></PresuppositionSetting>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isHttp">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import ExtraSetting from './inspectionitemextra'
  import PresuppositionSetting from './inspectionitempresupposition'
  export default {
    data () {
      return {
        isHttp: false,
        precision: 2,
        visible: false,
        unitList: [],
        inspectionUnitList: [],
        inspectionTypeList: [],
        inspectionStatusList: [],
        frequencyList: [],
        precisionList: [],
        extraSettingVisible: false,
        presuppositionSettingVisible: false,
        dataForm: {
          id: 0,
          deviceId: '',
          inspectionType: '',
          inspectionUnit: '',
          name: '',
          inspectionStatus: 1,
          emissivity: '0.950',
          defaultRpm: 1,
          frequency: 4,
          precision: 3,
          upupLimit: '',
          extraList: [],
          presuppositionList: [],
          upLimit: '',
          downdownLimit: '',
          downLimit: '',
          remark: '',
          orderNum: false,
          downUsed: false,
          upUsed: false,
          downdownUsed: false,
          upupUsed: false,
          createTime: '',
          isDelete: 0,
          guid: ''
        },
        dataRule: {
          name: [
            { required: true, message: '巡检项不能为空', trigger: 'change' }
          ],
          inspectionUnit: [
            { required: false, trigger: 'change', validator: this.validateinspectionUnit }
          ],
          inspectionType: [
            { required: true, message: '巡检类型不能为空', trigger: 'change' }
          ],
          inspectionStatus: [
            { required: true, message: '检时状态不能为空', trigger: 'change' }
          ],
          downdownLimit: [
            { required: false, trigger: 'blur', validator: this.validateDowndownLimit }
          ],
          downLimit: [
            { required: false, trigger: 'blur', validator: this.validateDownLimit }
          ],
          upLimit: [
            { required: false, trigger: 'blur', validator: this.validateUpLimit }
          ],
          upupLimit: [
            { required: false, trigger: 'blur', validator: this.validateUpupLimit }
          ]
        }
      }
    },
    components: {
      ExtraSetting,
      PresuppositionSetting
    },
    methods: {
      validateinspectionUnit (rule, alue, callback) {
        if (this.dataForm.inspectionType === 3 && this.dataForm.inspectionUnit === '') {
          return callback(new Error('单位不能为空'))
        }
        return callback()
      },
      validateDowndownLimit (rule, alue, callback) {
        if ((this.dataForm.downdownUsed === true && this.dataForm.downUsed === true) && (this.dataForm.downdownLimit > this.dataForm.downLimit)) {
          return callback(new Error('下下限值不能大于下限值'))
        }
        return callback()
      },
      validateDownLimit (rule, alue, callback) {
        if ((this.dataForm.downUsed === true && this.dataForm.upUsed === true) && (this.dataForm.downLimit > this.dataForm.upLimit)) {
          return callback(new Error('下限值不能大于上限值'))
        }
        return callback()
      },
      validateUpLimit (rule, alue, callback) {
        if ((this.dataForm.upUsed === true && this.dataForm.upupUsed === true) && (this.dataForm.upLimit > this.dataForm.upupLimit)) {
          return callback(new Error('上限值不能大于上上限值'))
        }
        return callback()
      },
      validateUpupLimit (rule, alue, callback) {
        if ((this.dataForm.upupUsed === true && this.dataForm.upUsed === true) && (this.dataForm.upLimit > this.dataForm.upupLimit)) {
          return callback(new Error('上上限值不能小于上限值'))
        }
        return callback()
      },
      getUnitList () {
        if (this.unitList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/unit/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.unitList = data.page.list
          })
        }
      },
      getInspectionTypeList () {
        if (this.inspectionTypeList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/inspectiontype/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.inspectionTypeList = data.page.list
            console.log('inspectionTypeList %o', this.inspectionTypeList)
          })
        }
      },
      getInspectionStatusList () {
        if (this.inspectionStatusList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/inspectionstatus/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.inspectionStatusList = data.page.list
          })
        }
      },
      getFrequencyList () {
        if (this.frequencyList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/samplingfrequency/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.frequencyList = data.page.list
          })
        }
      },
      getPrecisionList () {
        if (this.precisionList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/samplingprecision/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.precisionList = data.page.list
          })
        }
      },
      setPresupposition () {
        this.presuppositionSettingVisible = true
        this.$nextTick(() => {
          this.$refs.presuppositionSetting.itemId = this.dataForm.id
          this.$refs.presuppositionSetting.getExceptionList()
          this.$refs.presuppositionSetting.init(this.dataForm.presuppositionList)
        })
      },
      presuppositionChange (val) {
        console.log(val)
        this.dataForm.presuppositionList = val
      },
      setting () {
        console.log('this.dataForm.inspectionType %o', this.dataForm.inspectionType)
        if (this.dataForm.inspectionType === 8) {
          this.extraSettingVisible = true
          this.$nextTick(() => {
            this.$refs.extraSetting.itemId = this.dataForm.id
            this.$refs.extraSetting.getExceptionList()
            this.$refs.extraSetting.init(this.dataForm.extraList)
          })
        } else if (this.dataForm.inspectionType === 9) {
          this.presuppositionSettingVisible = true
          this.$nextTick(() => {
            this.$refs.presuppositionSetting.itemId = this.dataForm.id
            this.$refs.presuppositionSetting.getExceptionList()
            console.log(' setting this.dataForm %o', this.dataForm)
            this.$refs.presuppositionSetting.init(this.dataForm.presuppositionList)
          })
        }
      },
      extraChange (val) {
        this.dataForm.extraList = val
      },
      init (id) {
        this.dataForm.id = id || 0
        this.isHttp = false
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id === 0) {
            this.dataForm.extraList = []
          }
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/inspection/inspectionitem/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.$refs.dataForm.deviceId = data.inspectionItem.deviceId
                this.dataForm.inspectionType = data.inspectionItem.inspectionType
                this.dataForm.name = data.inspectionItem.name
                this.dataForm.inspectionStatus = data.inspectionItem.inspectionStatus
                this.dataForm.emissivity = data.inspectionItem.emissivity
                this.dataForm.frequency = data.inspectionItem.frequency
                this.dataForm.precision = data.inspectionItem.precision
                this.dataForm.upupLimit = data.inspectionItem.upupLimit
                this.dataForm.upLimit = data.inspectionItem.upLimit
                this.dataForm.downdownLimit = data.inspectionItem.downdownLimit
                this.dataForm.downLimit = data.inspectionItem.downLimit
                this.dataForm.extraList = data.inspectionItem.extraList
                this.dataForm.presuppositionList = data.inspectionItem.presuppositionList
                this.dataForm.remark = data.inspectionItem.remark
                this.dataForm.defaultRpm = data.inspectionItem.defaultRpm
                this.dataForm.orderNum = data.inspectionItem.orderNum
                this.dataForm.id = data.inspectionItem.id
                this.dataForm.upupUsed = data.inspectionItem.upupUsed === 1
                this.dataForm.upUsed = data.inspectionItem.upUsed === 1
                this.dataForm.downdownUsed = data.inspectionItem.downdownUsed === 1
                this.dataForm.downUsed = data.inspectionItem.downUsed === 1
                this.dataForm.isDelete = data.inspectionItem.isDelete
                this.dataForm.createTime = data.inspectionItem.createTime
                this.dataForm.guid = data.inspectionItem.guid
                this.dataForm.deviceId = data.inspectionItem.deviceId
                this.dataForm.inspectionUnit = data.inspectionItem.unit
                console.log(this.dataForm)
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/inspection/inspectionitem/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'deviceId': this.dataForm.deviceId,
                'inspectionType': this.dataForm.inspectionType,
                'name': this.dataForm.name,
                'inspectionStatus': this.dataForm.inspectionStatus,
                'emissivity': this.dataForm.emissivity,
                'frequency': this.dataForm.frequency,
                'precision': this.dataForm.precision,
                'upupLimit': this.dataForm.upupLimit,
                'upLimit': this.dataForm.upLimit,
                'downdownLimit': this.dataForm.downdownLimit,
                'downLimit': this.dataForm.downLimit,
                'extraList': this.dataForm.extraList,
                'presuppositionList': this.dataForm.presuppositionList,
                'remark': this.dataForm.remark,
                'defaultRpm': this.dataForm.defaultRpm,
                'orderNum': this.dataForm.orderNum,
                'unit': this.dataForm.inspectionUnit,
                'upupUsed': this.dataForm.upupUsed === true ? 1 : 0,
                'upUsed': this.dataForm.upUsed === true ? 1 : 0,
                'downdownUsed': this.dataForm.downdownUsed === true ? 1 : 0,
                'downUsed': this.dataForm.downUsed === true ? 1 : 0,
                'isDelete': this.dataForm.isDelete,
                'createTime': this.dataForm.createTime,
                'deviceId': this.dataForm.deviceId,
                'guid': this.dataForm.guid
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
    },
    watch: {
      'dataForm.inspectionType': function (newVal, oldVal) {
        console.log('watch')
        if (newVal) {
          if (newVal === 3) {
            this.inspectionUnitList = this.unitList
            this.$refs.unit.disabled = true
          } else {
            for (var i = 0; i < this.inspectionTypeList.length; i++) {
              if (this.inspectionTypeList[i].id === newVal) {
                this.dataForm.inspectionUnit = this.inspectionTypeList[i].unit
                this.$refs.unit.disabled = false
              }
            }
          }
          if (newVal === 2 || newVal === 8 || newVal === 9) {
            this.dataForm.inspectionUnit = ''
            this.dataForm.upUsed = false
            this.dataForm.upLimit = ''
            this.dataForm.upipUsed = false
            this.dataForm.upupLimit = ''
            this.dataForm.downUsed = false
            this.dataForm.downLimit = ''
            this.dataForm.downdownUsed = false
            this.dataForm.downdownLimit = ''
          }
          if(newVal !== 1) {
            this.dataForm.emissivity = ''
          }else{
            if(this.dataForm.emissivity === '') {
              this.dataForm.emissivity = '0.950'
            }
          }
          if(newVal !== 4 && newVal !== 5 && newVal !== 6) {
            this.dataForm.defaultRpm = ''
            this.dataForm.precision = ''
            this.dataForm.frequency = ''
          } else {
            if(this.dataForm.defaultRpm === '') {
              this.dataForm.defaultRpm = 1
            }
            if(this.dataForm.frequency === '') {
              this.dataForm.frequency = 4
            }
            if(this.dataForm.precision === '') {
              this.dataForm.precision = 3
            }
          }
        }
        console.log(this.dataForm.inspectionUnit)
      }
    }
  }
</script>
