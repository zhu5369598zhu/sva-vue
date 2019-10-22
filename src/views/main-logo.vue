<template>
  <el-dialog
    title="修改头像图片"
    :visible.sync="visible"
    :append-to-body="true">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="上传文件:" >
        <el-upload
          class="avatar-uploader"
          :action="this.$http.adornUrl(`/sys/userpic/upload?token=${this.$cookie.get('token')}`)"
          accept="image/jpeg,image/gif,image/png"
          list-type="picture-card"
          :limit="1"
          :before-upload="onBeforeUpload"
          :on-remove="uploadRemoveHandle"
          :on-success="uploadSuccessHandle"
          :on-error="uploadErrorHandle"
          :before-remove="uploadBeforeRemoveHandle"
          :file-list="fileList"
          :disabled="!isModify"
          :data="uploadParams">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <!--<span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>-->
  </el-dialog>
</template>

<script>
    export default {
      data () {
        return {
          visible: false,
          isModify: true,
          fileList: [],
          dataForm: {

          },
          uploadParams: {
            userId: null
          },
        }
      },
      computed: {
        userId: {
          get () { return this.$store.state.user.id }
        }
      },
      methods: {
        onBeforeUpload (file) {
          const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
          if (!isIMAGE) {
            this.$message.error('上传文件只能是图片格式!')
          }
          return isIMAGE
        },
        uploadSuccessHandle (response, file, fileList) {
          if (response.code > 0) {
            this.$message.error(response.msg)
          }else {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.visible = false
                // this.$emit('refreshDataList')
              }
            })
          }
        },
        uploadErrorHandle (err, file, fileList) {
          this.$message.error(err)
        },
        uploadBeforeRemoveHandle (file, filelist) {
          return this.$confirm(`确定删除文件${file.name}?`)
        },
        dataFormSubmit () {
          this.visible = false
        },
        uploadRemoveHandle (file, filelist) {
          this.$http({
            url: this.$http.adornUrl(`/sys/userpic/delete/${file.name}`),
            method: 'post',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        },
        getPicList () {
          this.filelist = []
          this.$http({
            url: this.$http.adornUrl('/sys/userpic/list'),
            method: 'get',
            params: this.$http.adornParams({
              'userId': this.uploadParams.userId
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              console.log(data.piclist)
              this.fileList = data.piclist.map(item => {
                item.name = item.url
                item.url = this.$http.adornUrl(`/sys/userpic/pic.png?uuid=${item.url}`)
                return item
              })
            } else {
              this.fileList = []
            }
          })
        },
        init () {
          this.visible = true
          this.uploadParams.userId = this.userId
          this.getPicList()
        }
      }
    }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
