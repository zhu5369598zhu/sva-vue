<template>
  <el-dialog style="z-index:1"
    :close-on-click-modal="false"
    :modal=true
    width="30%"
    :visible.sync="visible">
    <div class="import-result">
      <el-input type="textarea" v-model="importResult" autosize readonly="true">
      </el-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        importResult: '',
        visible: false
      }
    },
    methods: {
      init (result) {
        this.importResult = result
        this.visible = true
      },
      dataFormSubmit () {
        this.visible = false
        this.$emit('refreshDataList')
      }
    }
  }
</script>

<style>
  .result {
    height: 100%;
  }
</style>
