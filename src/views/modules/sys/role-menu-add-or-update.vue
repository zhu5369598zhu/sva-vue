<template>
  <el-dialog
    v-dialog-drag 
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <div class="menu-content">
      <div class="button_bar">
        <el-checkbox>全选</el-checkbox>
      </div>
      <div class="menu-left">
        <el-scrollbar 
        wrap-class="menu-left"
        view-class="menu-tree">
          <el-tree class="menu-tree"
            show-checkbox
            :data="menuList"
            :props="menuListTreeProps"
            node-key="menuId"
            ref="menuListTree"
            @check-change="menuCheckChangeHandle"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
            <span slot-scope="{ node, data}" style="font-size:16px;">
              <icon-svg :name="data.icon || ''"></icon-svg><span>&nbsp;&nbsp;</span><span style="font-size:12px;">{{ node.label }}</span>
            </span>
          </el-tree>
        </el-scrollbar>
        <span>&nbsp;</span>
      </div>
    <div class="button-tree">
        <el-tree
          show-checkbox
          :data="buttonList"
          :props="buttonListTreeProps"
          node-key="menuId"
          ref="buttonListTree"
          :default-expand-all="true"
          :highlight-current="true"
          @check-change="buttonCheckChangeHandle"
          :expand-on-click-node="false">
        </el-tree>
    </div>
  </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isHttp">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import TableTreeColumn from '@/components/table-tree-column'
  import { treeDataTranslate } from '@/utils'
  export default {
    data () {
      return {
        isHttp: false,
        visible: false,
        parentNode: '',
        dataForm: {
          name: ''
        },
        roleMenuList: [],
        buttonList: [],
        buttonListLoading: false,
        buttonListTreeProps: {
          label: 'name',
          children: 'children'
        },
        menuList: [],
        menuListLoading: false,
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    components: {
      TableTreeColumn
    },
    activated () {
      this.getMenuList()
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.isHttp = false
        this.$http({
          url: this.$http.adornUrl('/sys/menu/menulist'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.menuList = treeDataTranslate(data, 'menuId')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs.menuListTree.setCheckedKeys([])
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/sys/role/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.roleMenuList = data.role.menuIdList
                this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
              }
            })
          }
        })
      },
      // 获取菜单列表
      getMenuList () {
        this.menuListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/menu/menulist'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.menuList = treeDataTranslate(data, 'menuId')
          console.log('menuList %o', this.menuList)
          this.menuListLoading = false
        })
      },
      // 获取角色菜单列表
      getRoleMenuList (roleId) {
        this.$http({
          url: this.$http.adornUrl(`/sys/role/info/${roleId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.rowMenuList = data.role.menuIdList
          console.log('roleMenuList %o', this.rowMenuList)
          this.$refs.menuListTree.setCheckedKeys(data.role.menuIdList)
        })
      },
      // 获取按钮列表
      getButtonList (parentId) {
        this.buttonListLoading = true
        this.$http({
          url: this.$http.adornUrl(`/sys/menu/buttonlist/${parentId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.buttonList = treeDataTranslate(data, 'menuId')
          console.log('buttonlist %o', this.buttonList)
          this.$refs.buttonListTree.setCheckedKeys(this.roleMenuList)
          this.buttonListLoading = false
        })
      },
      // 部门树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.parentNode = node
        this.dataForm.menuId = data.menuId
        this.getButtonList(this.dataForm.menuId)
      },
      menuCheckChangeHandle (node, checked, childChecked) {
        console.log('node %o', node)
        console.log('checked %o', checked)
        console.log('childChecked %o', childChecked)
        if (checked) {
          this.$refs.buttonListTree.setCheckedKeys(this.buttonList)
        } else {
          this.$refs.buttonListTree.setCheckedKeys([])
        }
      },
      buttonCheckChangeHandle (node, checked, childChecked) {
        let checkedNodes = this.$refs.buttonListTree.getCheckedNodes()
        if (checkedNodes.length === 0) {
          this.parentNode.indeterminate = false
          this.parentNode.checked = false
        } else {
          if (checkedNodes.length === this.buttonList.length) {
            this.parentNode.indeterminate = false
            this.parentNode.checked = true
          } else {
            this.parentNode.indeterminate = true
            this.parentNode.checked = false
          }
        }
      },
      dataFormSubmit () {
        this.visible = false
      }
    }
  }
</script>

<style>
  .button-bar {
    float: top;
    height: 60px;
  }
  .menu-content {
    overflow: hidden;
  }
  .menu-left {
    float: left;
    width: 210px;
    height: 400px;
    overflow: hidden;
    Border: 1px solid #ebeef5;
  }
  .button-tree {
    margin-left: 220px;
    height: 400px;
    Border: 1px solid #ebeef5;
  }
  .el-tree-node__content {
    height: 46px;
  }
  .el-tree-node:focus>.el-tree-node__content{
    background-color: rgb(231, 247, 251);
  }
</style>
