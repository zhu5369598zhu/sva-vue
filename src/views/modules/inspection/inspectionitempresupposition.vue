<template>
  <el-dialog
    v-dialog-drag
    :title="'预设'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form>
      <el-form-item>
        <el-button @click="presuppositionAddHandle">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="presupposition"
      border
      highlight-current-row
      @selection-change="presuppositionSelectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="名称">
        <template slot-scope="scope">
          <span v-if="scope.row.isSet">
            <el-input size="mini" placeholder="请输入名称" v-model="scope.row.name"></el-input>
          </span>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="exceptionName"
        header-align="center"
        align="center"
        label="扩展内容">
        <template slot-scope="scope">
          <span v-if="scope.row.isSet">
            <el-select placeholder="异常级别" v-model="scope.row.exceptionId">
              <el-option
                v-for="item in exceptionList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </span>
          <span v-else>{{scope.row.exceptionName}}</span>
        </template>
      </el-table-column>
      <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini" @click="presuppositionUpdateHandle(scope.$index)">{{scope.row.isSet?'保存':"修改"}}</el-button>
                <el-button type="text" size="mini" @click="presuppositionDeleteHandle(scope.$index)">删除</el-button>
              </template>
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
        itemId: 0,
        visible: false,
        exceptionList: [],
        presupposition: []
      }
    },
    methods: {
      init (presuppositionList) {
        this.visible = true
        if (presuppositionList) {
          presuppositionList.map(i => {
            i.isSet = false
          })
          this.presupposition = presuppositionList
          console.log('this.presupposition %o', this.presupposition)
        }
      },
      presuppositionSelectionChangeHandle (val) {
      },
      presuppositionAddHandle () {
        let row = {id: 0, 'name': '', 'exceptionId': '', 'exceptionName': '', 'guid': '', 'isSet': true, 'itemId': this.itemId}
        this.presupposition.push(row)
      },
      presuppositionUpdateHandle (index) {
        if (this.presupposition[index].isSet) {
          let exceptionId = this.presupposition[index].exceptionId
          for (let i = 0; i < this.exceptionList.length; i++) {
            if (exceptionId === this.exceptionList[i].id) {
              this.presupposition[index].exceptionName = this.exceptionList[i].name
            }
          }
        }
        this.presupposition[index].isSet = !this.presupposition[index].isSet
        var tmp = this.presupposition[index]
        this.$set(this.presupposition, index, tmp)
      },
      presuppositionDeleteHandle (val) {
        this.presupposition.splice(val, 1)
      },
      getExceptionList () {
        if (this.exceptionList <= 0) {
          this.$http({
            url: this.$http.adornUrl('/setting/exception/list'),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            this.exceptionList = data.page.list
          })
        }
      },
      dataFormSubmit () {
        for (let j = 0; j < this.presupposition.length; j++) {
          if (this.presupposition[j].isSet === true) {
            for (let i = 0; i < this.exceptionList.length; i++) {
              if (this.presupposition[j].exceptionId === this.exceptionList[i].id) {
                this.presupposition[j].exceptionName = this.exceptionList[i].name
              }
            }
            this.presupposition[j].isSet = false
          }
        }
        
        var presuppositions = []
        for (let i = 0; i < this.presupposition.length; i++) {
          if (this.presupposition[i].name !== '' && this.presupposition[i].id !== '' && this.presupposition[i].exceptionName !== '') {
            presuppositions.push(this.presupposition[i])
          } else {
            this.$message.error('预设项设置错误，请检查!')
            return
          }
        }
        
        this.$emit('presuppositionChange', presuppositions)
        this.visible = false
      }
    }
  }
</script>
