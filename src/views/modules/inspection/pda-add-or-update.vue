<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-row :gutter="10">
      <el-col :span="24">
        <el-form-item label="终端名称" prop="pdaName">
          <el-input v-model="dataForm.pdaName" placeholder="终端名称"></el-input>
        </el-form-item>
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
              @current-change="deptListTreeCurrentChangeHandle"
              :default-expand-all="true"
              :highlight-current="true"
              :expand-on-click-node="false">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.deptName" v-popover:deptListPopover :readonly="true" placeholder="点击选择所属机构" class="dept-list__input"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="5">
      <el-col :span="21">
        <el-form-item label="MAC" prop="pdaMac">
          <el-input v-model="dataForm.pdaMac" placeholder="MAC地址"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="3">
        <el-button icon="el-icon-mobile-phone" @click="onBind()">同步</el-button>
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
  import { isMac } from '@/utils/validate'
  export default {
    data () {
      var validateMac = (rule, value, callback) => {
        if (!isMac(value)) {
          callback(new Error('Mac地址错误'))
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
          pdaId: 0,
          deptId: '',
          deptName: '',
          pdaName: '',
          pdaMac: '',
          createTime: ''
        },
        dataRule: {
          deptName: [
            { required: true, message: '所属机构不能为空', trigger: 'change' }
          ],
          pdaName: [
            { required: true, message: '设备名称不能为空', trigger: 'change' }
          ],
          pdaMac: [
            { required: true, validator: validateMac, trigger: 'change' }
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
        this.dataForm.pdaId = id || 0
        this.visible = true
        this.isHttp = false
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.pdaId) {
            this.$http({
              url: this.$http.adornUrl(`/inspection/pda/info/${this.dataForm.pdaId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.deptId = data.pda.deptId
                this.dataForm.deptName = data.pda.deptName
                this.dataForm.pdaName = data.pda.pdaName
                this.dataForm.pdaMac = data.pda.pdaMac
                this.deptListTreeSetCurrentNode()
              }
            })
          }
        })
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
            setTimeout(self.getPda, 3000)
          })
        }
      },
      getPda () {
        this.$http({
          url: this.$http.adornUrl('/inspection/bindqueue/bindpda'),
          method: 'post'
        }).then(({data}) => {
          console.log('data %o', data)
          if (data && data.code === 0 && data.bind !== null) {
            this.dataForm.pdaMac = data.bind.content
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
              url: this.$http.adornUrl(`/inspection/pda/${!this.dataForm.pdaId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'pdaId': this.dataForm.pdaId || undefined,
                'deptId': this.dataForm.deptId,
                'pdaName': this.dataForm.pdaName,
                'pdaMac': this.dataForm.pdaMac
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
