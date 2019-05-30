<template>
  <el-dialog
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
              fixed="right"
              header-align="center"
              align="center"
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="presuppositionUpdateHandle(scope.$index)">{{scope.row.isSet?'保存':"修改"}}</el-button>
                <el-button type="text" size="small" @click="presuppositionDeleteHandle(scope.$index)">删除</el-button>
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
        let row = {id: 0, 'name': '', 'guid': '', 'isSet': true, 'itemId': this.itemId}
        this.presupposition.push(row)
      },
      presuppositionUpdateHandle (index) {
        this.presupposition[index].isSet = !this.presupposition[index].isSet
        var tmp = this.presupposition[index]
        this.$set(this.presupposition, index, tmp)
      },
      presuppositionDeleteHandle (val) {
        this.presupposition.splice(val, 1)
      },
      dataFormSubmit () {
        for (let j = 0; j < this.presupposition.length; j++) {
          if (this.presupposition[j].isSet === true) {
            this.presupposition[j].isSet = false
          }
        }
        this.$emit('presuppositionChange', this.presupposition)
        this.visible = false
      }
    }
  }
</script>
