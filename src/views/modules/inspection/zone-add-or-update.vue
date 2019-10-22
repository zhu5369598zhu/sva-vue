<template>
  <el-dialog
    v-dialog-drag
    :title="!dataForm.zoneId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="巡区名称" prop="zoneName">
          <el-input v-model="dataForm.zoneName" placeholder="巡区名称" size="mini"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="21">
        <el-form-item label="编码" prop="zoneCode">
          <el-input v-model="dataForm.zoneCode" placeholder="巡区编码" size="mini"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3" style="margin-top: 2px;">
        <el-button icon="el-icon-mobile-phone" @click="onBind()" size="mini">同步</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="24">
        <el-form-item label="所属机构" prop="deptName">
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
              class="tree"
              @current-change="deptListTreeCurrentChangeHandle"
              :default-expand-all="false"
              :highlight-current="true"
              :expand-on-click-node="false">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="点击选择所属机构" class="dept-list__input" size="mini"></el-input>
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
  import { isRfid } from '@/utils/validate'
  export default {
    data () {
        var validateRfid = (rule, value, callback) => {
        if (!isRfid(value)) {
          callback(new Error('编码错误'))
        } else {
          callback()
        }
      }
      return {
        timer: 0,
        isHttp: false,
        visible: false,
        isShowDeptTree: false,
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          zoneId: 0,
          deptId: 0,
          deptName: '',
          zoneName: '',
          zoneCode: '',
          createTime: ''
        },
        dataRule: {
          deptName: [
            { required: true, message: '所属机构不能为空', trigger: 'change' }
          ],
          zoneName: [
            { required: true, message: '巡区名称不能为空', trigger: 'change' }
          ],
          zoneCode: [
            { required: true, validator: validateRfid, trigger: 'change' }
          ]
        }
      }
    },
    methods: {
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
        this.dataForm.zoneId = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.zoneId) {
            this.$http({
              url: this.$http.adornUrl(`/inspection/zone/info/${this.dataForm.zoneId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.deptId = data.zone.deptId
                this.dataForm.deptName = data.zone.deptName
                this.dataForm.zoneName = data.zone.zoneName
                this.dataForm.zoneCode = data.zone.zoneCode
                this.dataForm.createTime = data.zone.createTime
                this.deptListTreeSetCurrentNode()
              }
            })
          }
        })
      },
      // 部门树选中
      deptListTreeCurrentChangeHandle (data, node) {
        console.log(data)
        this.dataForm.deptId = data.deptId
        this.dataForm.deptName = data.name
        this.isShowDeptTree = false
      },
      // 部门树设置当前选中节点
      deptListTreeSetCurrentNode () {
        this.$refs.deptListTree.setCurrentKey(this.dataForm.deptId)
        this.dataForm.deptName = (this.$refs.deptListTree.getCurrentNode() || {})['name']
      },
      onBind () {
        this.timer = 1
        this.setTimer()
      },
      setTimer () {
        if (this.timer < 10) {
          console.log('setTimer %o', this.timer)
          this.timer = this.timer + 1
          var self = this
          this.$nextTick(function () {
            setTimeout(self.getRfid, 3000)
          })
        }
      },
      getRfid () {
        this.$http({
          url: this.$http.adornUrl('/inspection/bindqueue/bindrfid'),
          method: 'post'
        }).then(({data}) => {
          if (data && data.code === 0 && data.bind !== null) {
            this.dataForm.zoneCode = data.bind.content
          } else {
            this.setTimer()
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/inspection/zone/${!this.dataForm.zoneId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'deptId': this.dataForm.deptId,
                'zoneId': this.dataForm.zoneId || undefined,
                'zoneName': this.dataForm.zoneName,
                'zoneCode': this.dataForm.zoneCode,
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
<style>
  .tree{
    overflow-y: scroll;
    width:280px;
    height: 200px;
  }
</style>
