<template>
  <el-dialog
    :title="'扩展'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form>
      <el-form-item>
        <el-button @click="extraAddHandle">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="table"
      :data="extra"
      border
      highlight-current-row
      @selection-change="extraSelectionChangeHandle"
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
                <el-button type="text" size="small" @click="extraUpdateHandle(scope.$index)">{{scope.row.isSet?'保存':"修改"}}</el-button>
                <el-button type="text" size="small" @click="extraDeleteHandle(scope.$index)">删除</el-button>
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
        extra: []
      }
    },
    methods: {
      init (extraList) {
        this.visible = true
        if (extraList) {
          extraList.map(i => {
            i.isSet = false
          })
          this.extra = extraList
          console.log('this.extra %o', this.extra)
        }
      },
      extraSelectionChangeHandle (val) {
        console.log('val %o', val)
      },
      extraAddHandle () {
        let row = {id: 0, 'name': '', 'exceptionId': '', 'exceptionName': '', 'guid': '', 'isSet': true, 'itemId': this.itemId}
        this.extra.push(row)
      },
      extraUpdateHandle (index) {
        console.log(index)
        if (this.extra[index].isSet) {
          let exceptionId = this.extra[index].exceptionId
          for (let i = 0; i < this.exceptionList.length; i++) {
            if (exceptionId === this.exceptionList[i].id) {
              this.extra[index].exceptionName = this.exceptionList[i].name
            }
          }
        }
        this.extra[index].isSet = !this.extra[index].isSet
        var tmp = this.extra[index]
        this.$set(this.extra, index, tmp)
      },
      extraDeleteHandle (val) {
        this.extra.splice(val, 1)
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
        for (let j = 0; j < this.extra.length; j++) {
          if (this.extra[j].isSet === true) {
            for (let i = 0; i < this.exceptionList.length; i++) {
              if (this.extra[j].exceptionId === this.exceptionList[i].id) {
                this.extra[j].exceptionName = this.exceptionList[i].name
              }
            }
            this.extra[j].isSet = false
          }
        }
        var extras = []
        for (let i = 0; i < this.extra.length; i++) {
          if (this.extra[i].name !== '' && this.extra[i].id !== '' && this.extra[i].exceptionName !== '') {
            extras.push(this.extra[i])
          }
        }
        console.log(extras)
        this.$emit('extraChange', extras)
        this.visible = false
      }
    },
    watch: {
      'scope.row.exceptionName': function (newVal, oldVal) {
        console.log('newVal %o', newVal)
      }
    }
  }
</script>
