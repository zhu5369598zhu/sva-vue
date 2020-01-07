<template>
  <el-dialog
    v-dialog-drag
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="名称" prop="name">
      <el-input v-model="dataForm.name" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item label="开始时间" prop="basePoint">
      <el-date-picker v-model="dataForm.basePoint" type="date" value-format="yyyy-MM-dd 00:00:00" placeholder="选择基准点" @change="handleDateChange" :picker-options="startDatePicker"></el-date-picker>
    </el-form-item>
    <el-form-item label="周期"  prop="periodType">
      <el-select v-model="dataForm.periodType" :disabled="true" placeholder="周期">
        <el-option
          v-for="item in periodTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="频度" prop="frequency">
      <el-input-number v-model="dataForm.frequency" controls-position="right" :disabled="dataForm.periodType!==0" :min="minFrequency" :max="maxFrequency" label="频度"></el-input-number>
    </el-form-item>
    <el-form-item label="跨度起点" prop="startPoint">
      <el-input-number v-model="dataForm.startPoint" controls-position="right" :min="minStartPoint" :max="maxStartPoint" label="跨度起点"></el-input-number>
    </el-form-item>
    <el-form-item label="跨度" prop="span">
      <el-input-number v-model="dataForm.span" controls-position="right" :min="minSpan" :max="maxSpan" label="跨度"></el-input-number>
    </el-form-item>
    <el-form-item label="完成模式" prop="turnFinishMod">
      <el-select v-model="dataForm.turnFinishMod" placeholder="完成模式">
        <el-option
          v-for="item in turnFinishModList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="轮次集合" prop="turnList">
      <el-select v-model="dataForm.turnList" multiple placeholder="轮次集合">
        <el-option
          v-for="item in turnList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isHttp">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { formatDate } from '@/utils'
  export default {
    data () {
      return {
        isHttp: false,
        visible: false,
        minSpan: 1,
        maxSpan: 1,
        minStartPoint: 1,
        maxStartPoint: 1,
        minFrequency: 1,
        maxFrequency: Infinity,
        periodType: '',
        periodTypeList: [{'id': 1, 'name': '天'}, {'id': 2, 'name': '周'}, {'id': 3, 'name': '月'}],
        basePointList: [],
        turnTypeList: [{'id': 1, 'name': '一天多次'}, {'id': 2, 'name': '多天多次'}],
        turnFinishModList: [{'id': 1, 'name': '整体完成'}, {'id': 2, 'name': '班组完成'}, {'id': 3, 'name': '个人完成'}],
        turnList: [],
        startDatePicker: this.beginDate(),
        dataForm: {
          id: 0,
          name: '',
          basePoint: new Date(),
          turnType: '',
          startPoint: 1,
          span: '',
          frequency: '',
          turn: '',
          turnFinishMod: '',
          inspectionLineId: 0,
          periodType: ''
        },
        dataRule: {
          name: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          basePoint: [
            { required: true, message: '基准点不能为空', trigger: 'blur' }
          ],
          turnType: [
            { required: true, message: '轮次模式不能为空', trigger: 'blur' }
          ],
          turnFinishMod: [
            { required: true, message: '完成模式不能为空', trigger: 'blur' }
          ],
          turnList: [
            { required: true, message: '轮次集合不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      beginDate () {
        return {
          disabledDate (time) {
            let now = new Date()
            now.setDate(now.getDate() - 1)
            return time.getTime() < now.getTime() // 开始时间不选时，结束时间最大值小于等于当天
          }
        }
      },
      getTurnList () {
        this.$http({
          url: this.$http.adornUrl('/inspection/turn/findlist'),
          method: 'get',
          params: this.$http.adornParams({
            'inspectionLineId': this.dataForm.inspectionLineId
          })
        }).then(({data}) => {
          this.turnList = data.turnlist
        })
      },
      handleDateChange (val) {
        this.dataForm.basePoint = val
      },
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.periodType = this.periodType
          console.log('isHttp %o', this.isHttp)
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/inspection/inspectionperiod/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.inspectionLineId = data.inspectionPeriod.lineId
                this.dataForm.name = data.inspectionPeriod.name
                this.dataForm.basePoint = data.inspectionPeriod.basePoint
                this.dataForm.turnType = data.inspectionPeriod.turnType
                this.dataForm.startPoint = data.inspectionPeriod.startPoint
                this.dataForm.span = data.inspectionPeriod.span
                this.dataForm.frequency = data.inspectionPeriod.frequency
                this.dataForm.turnList = data.inspectionPeriod.turnList
                this.dataForm.turnFinishMod = data.inspectionPeriod.turnFinishMod
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        let basePoint = new Date(this.dataForm.basePoint)
        basePoint = formatDate(basePoint, 'yyyy-MM-dd')
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/inspection/inspectionperiod/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'name': this.dataForm.name,
                'lineId': this.dataForm.inspectionLineId,
                'basePoint': basePoint,
                'turnType': this.dataForm.turnType,
                'startPoint': this.dataForm.startPoint,
                'span': this.dataForm.span,
                'frequency': this.dataForm.frequency,
                'turnFinishMod': this.dataForm.turnFinishMod,
                'turnList': this.dataForm.turnList
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
                this.isHttp = false
              }
            })
          }
        })
      }
    },
    watch: {
      'dataForm.periodType': function (newVal, oldVal) {
        if (newVal === 1) {
          this.dataForm.frequency = 1
          this.maxStartPoint = 1
          this.minSpan = 1
          this.maxSpan = 1
          this.minFrequency = 1
          this.maxFrequency = Infinity
        } else if (newVal === 2) {
          this.dataForm.frequency = 7
          this.maxStartPoint = 7
          this.minSpan = 1
          this.maxSpan = 7
          this.minFrequency = 7
          this.maxFrequency = 7
        } else if (newVal === 3) {
          this.dataForm.frequency = 31
          this.maxStartPoint = 31
          this.minSpan = 1
          this.maxSpan = 31
          this.minFrequency = 31
          this.maxFrequency = 31
        }
      },
      'dataForm.startPoint': function (newVal, oldVal) {
         if (this.dataForm.frequency === 7) { // 周
           this.maxStartPoint = 7 - this.dataForm.span
           this.maxSpan = 7 - this.dataForm.startPoint
         } else if (this.dataForm.frequency === 31){
           this.maxStartPoint = 31 - this.dataForm.span
           this.maxSpan = 31 - this.dataForm.startPoint
         }
      },
      'dataForm.span': function (newVal, oldVal) {
        if (this.dataForm.frequency === 7) { // 周
          this.maxSpan = 7 - this.dataForm.startPoint
          this.maxStartPoint = 7 - this.dataForm.span
        } else if (this.dataForm.frequency === 31){
          this.maxSpan = 31 - this.dataForm.startPoint
        }
      }
    },
    computed: {
    }
  }
</script>
