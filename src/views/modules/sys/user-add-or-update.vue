<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-dialog-drag
    append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="dataForm.userName" placeholder="登录帐号"></el-input>
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
            <el-input v-model="dataForm.deptName" v-popover:deptListPopover placeholder="点击选择所属机构" class="dept-list__input"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工号" prop="userCode">
            <el-input v-model="dataForm.userCode" placeholder="工号"></el-input>
          </el-form-item>
        </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
              <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
            <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="微信号" prop="wechat">
            <el-input v-model="dataForm.wechat" placeholder="微信号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" :rows="2" v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isHttp">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { treeDataTranslate } from '@/utils'
  import { isEmail, isMobile } from '@/utils/validate'
  export default {
    data () {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        if (value!=='' && value!==null && !isEmail(value)) {
          callback(new Error('邮箱格式错误'))
        } else {
          callback()
        }
      }
      var validateMobile = (rule, value, callback) => {
        if (value!=='' && value!==null && !isMobile(value)) {
          callback(new Error('手机号格式错误'))
        } else {
          callback()
        }
      }
      return {
        isHttp: false,
        isShowDeptTree: false,
        visible: false,
        roleList: [],
        deptList: [],
        deptListTreeProps: {
          label: 'name',
          children: 'children'
        },
        dataForm: {
          id: 0,
          userName: '',
          userCode: '',
          deptId: 0,
          deptName: '',
          password: '',
          comfirmPassword: '',
          salt: '',
          email: '',
          mobile: '',
          roleIdList: [],
          status: 1,
          wechat: '',
          remark: ''
        },
        dataRule: {
          userName: [
            { required: true, message: '用户名不能为空', trigger: 'blur' }
          ],
          deptName: [
            { required: true, message: '所属机构不能为空', trigger: 'change' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          comfirmPassword: [
            { validator: validateComfirmPassword, trigger: 'blur' }
          ],
          email: [
            { validator: validateEmail, trigger: 'blur' }
          ],
          mobile: [
            { validator: validateMobile, trigger: 'blur' }
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
        this.dataForm.id = id || 0
        this.isHttp = false
        this.$http({
          url: this.$http.adornUrl('/sys/dept/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.deptList = treeDataTranslate(data, 'deptId')
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/role/select'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.roleList = data && data.code === 0 ? data.list : []
          }).then(() => {
            this.visible = true
            this.$nextTick(() => {
              this.$refs['dataForm'].resetFields()
            })
          }).then(() => {
            if (this.dataForm.id) {
              this.$http({
                url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
                method: 'get',
                params: this.$http.adornParams()
              }).then(({data}) => {
                if (data && data.code === 0) {
                  this.dataForm.userName = data.user.username
                  this.dataForm.userCode = data.user.userCode
                  this.dataForm.deptId = data.user.deptId
                  this.dataForm.wechat = data.user.wechat
                  this.dataForm.remark = data.user.remark
                  this.dataForm.salt = data.user.salt
                  this.dataForm.email = data.user.email
                  this.dataForm.mobile = data.user.mobile
                  this.dataForm.roleIdList = data.user.roleIdList
                  this.dataForm.status = data.user.status
                  this.deptListTreeSetCurrentNode()
                }
              })
            }
          })
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isHttp = true
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.id || undefined,
                'username': this.dataForm.userName,
                'userCode': this.dataForm.userCode,
                'deptId': this.dataForm.deptId,
                'wechat': this.dataForm.wechat,
                'remark': this.dataForm.remark,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                'email': this.dataForm.email,
                'mobile': this.dataForm.mobile,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList
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
  .el-tree {
    min-width: 100%;
    display:inline-block !important;
  }

</style>
