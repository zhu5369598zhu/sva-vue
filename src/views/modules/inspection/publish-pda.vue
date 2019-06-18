<template>
  <el-dialog
    :title="'发布'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-input placeholder="请输入内容" v-model="dataForm.key" class="query">
      <el-select v-model="dataForm.select" slot="prepend" placeholder="请选择">
        <el-option
          v-for="item in selectList"
          :key="item.value"
          :label="item.lable"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="getPdaList()"></el-button>
    </el-input>
    <el-table
      :data="pdaList"
      border
      v-loading="pdaListLoading"
      highlight-current-row
      @selection-change="pdaSelectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="pdaName"
        header-align="center"
        align="center"
        label="PDA名称">
      </el-table-column>
      <el-table-column
        prop="pdaMac"
        header-align="center"
        align="center"
        label="PDA地址">
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          key: '',
          select: 'pdaName',
          deptId: 0,
          pdaId: 0,
          inspectionLineId: 0
        },
        selectList: [{lable: 'PDA名称', value: 'pdaName'}, {lable: 'PDA地址', value: 'pdaMac'}],
        visible: false,
        pdaList: [],
        pdaListLoading: false,
        pdaListSelections: [],
        selectPdaList: []
      }
    },
    methods: {
      init (deptId) {
        this.pdaList = []
        this.dataForm.deptId = deptId
        this.visible = true
      },
       // 获取PDA列表
      getPdaList () {
        console.log('deptid %o', this.dataForm.deptId)
        console.log('inspectionLineId %o', this.dataForm.inspectionLineId)
        this.pdaList = []
        this.pdaListLoading = true
        if (this.pdaList.length <= 0) {
          this.$http({
            url: this.$http.adornUrl('/inspection/pda/selectunbind'),
            method: 'get',
            params: this.$http.adornParams({
              'deptId': this.dataForm.deptId,
              'lineId': this.dataForm.inspectionLineId,
              'filter': this.dataForm.select,
              'key': this.dataForm.key
            })
          }).then(({data}) => {
            console.log(data)
            if (data && data.code === 0) {
              this.pdaList = data.pdaList
            } else {
              this.pdaList = []
              this.$message.error(data.msg)
            }
            this.pdaListLoading = false
          })
        }
      },
      // 多选
      pdaSelectionChangeHandle (val) {
        this.pdaListSelections = val
      },
      dataFormSubmit () {
        console.log('pdaListSelections: %o', this.pdaListSelections)
        this.visible = false
        this.$emit('PdaBindEvent', this.pdaListSelections)
      }
    },
    watch: {
      'dataForm.inspectionLineId': function () {
        this.pdaList = []
      }
    }
  }
</script>
<style>
.el-select .el-input {
    width: 110px;

  }
.query {
    margin-bottom: 15px;
  }
</style>
