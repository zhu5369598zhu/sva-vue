<template>
	<div class="mod-app-update">
    <div class="show-data-content">
      <el-form :model="appForm" :rules="dataRule" ref="appForm" class="app">
            <el-form-item label="内网地址:" prop="localhost">
              <el-input v-model="appForm.localhost" placeholder="内网地址" clearable style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="外网地址:" prop="domain">
              <el-input v-model="appForm.domain" placeholder="内网地址" clearable style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-radio v-model="appForm.isDomain" label="0">内网地址启用</el-radio>
                <el-radio v-model="appForm.isDomain" label="1">外网地址启用</el-radio>
            </el-form-item>
            <el-form-item label="App文件名称:" prop="appFilename">
              <span>{{appForm.appFilename}}</span>
            </el-form-item>
            <el-form-item label="App文件大小:" prop="appFilesize">
              <span>{{appForm.appFilesize}}</span>
            </el-form-item>
            <el-form-item label="App文件版本:" prop="appVersion">
              <span>{{appForm.appVersion}}</span>
            </el-form-item>
            <el-form-item label="App文件上传时间:" prop="createTime">
              <span>{{appForm.createTime}}</span>
            </el-form-item>
            <el-form-item label="上传Apk文件:" prop="file">
              <el-upload
                ref="upload"
                :action="uploadUrl"
                :on-success="handleSuccess"
                :on-error="handleError"
                :on-change="handleChange"
                :on-remove="handleRemove"
                :auto-upload="false"
                :file-list="fileList"
                :limit="1"
                :data="appForm"
                accept="apk"
                style="width:400px;">
                <el-button slot="trigger" size="mini">选取文件</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitUpload()">保存</el-button>
            </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        params: null,
        fileList: [],
        uploadUrl: this.$http.adornUrl(`/sys/appupgrade/upload?token=${this.$cookie.get('token')}`),
        appForm: {
          localhost: '127.0.0.1',
          domain: 'demo.gronhco.cn',
          isDomain: '1',
          appFilename: '',
          appFilesize: '',
          appVersion: '0,0',
          createTime: ''
        },
        dataRule: {
          deptName: [
            { required: true, message: '所属机构不能为空', trigger: 'change' }
          ]
        }
      }
    },
    activated () {
      this.getData()
    },
    methods: {
      // 获取数据列表
      getData () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/appupgrade/info/1'),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            console.log('appForm %o', this.appForm)
            this.appForm.isDomain = this.appForm.isDomain.toString()
            this.appForm.localhost = data.appUpgrade.localhost
            this.appForm.domain = data.appUpgrade.domain
            this.appForm.appFilename = data.appUpgrade.appFilename
            this.appForm.appFilesize = data.appUpgrade.appFilesize
            this.appForm.appVersion = data.appUpgrade.appVersion
            this.appForm.createTime = data.appUpgrade.createTime
            this.dataListLoading = false
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      submitUpload () {
        if (this.fileList.length > 0) {
          this.$refs.upload.submit()
        } else {
          this.$http({
            url: this.$http.adornUrl(`/sys/appupgrade/update?token=${this.$cookie.get('token')}`),
            method: 'post',
            data: this.$http.adornParams({
              'id': 1,
              'isDomain': this.appForm.isDomain,
              'localhost': this.appForm.localhost,
              'domain': this.appForm.domain,
              'appFilesize': this.appForm.appFilesize
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message.success('更新成功')
              this.getData()
            } else {
              this.$message.error('更新失败，' + data.msg)
            }
          })
        }
      },
      handleChange (file, fileList) {
        this.fileList = fileList.slice()
      },
      handleRemove (file, fileList) {
        this.fileList = fileList.slice()
      },
      handleSuccess (response, file, fileList) {
        this.$refs.upload.clearFiles()
        if (response.code > 0) {
          this.$message.error('上传失败,' + response.msg)
        } else {
          this.$message.success('上传成功')
          this.getData()
        }
      },
      handleError (err, file, fileList) {
        this.$refs.upload.clearFiles()
        this.$message.error('上传失败' + err)
      }
    }
}
</script>

<style>
  .app{
    margin: 10px;
  }
  .title{
    font-size: 32px;
  }
</style>
