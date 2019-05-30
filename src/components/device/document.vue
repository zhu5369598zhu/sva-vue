<template>
	<div class="device-document">
    <el-table height="376"
      ref="table"
      :data="dataList"
      border
      @selection-change="selectionChangeHandle"
      :cell-style="cellStyle"
      :row-style="rowStyle"
      style="width: 100%;">
      <el-table-column
        fixed
        type="index"
        width="50"
        lable="序号">
      </el-table-column>
      <el-table-column
        prop="filename"
        header-align="center"
        align="center"
        label="资料名称">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="上传者">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="上传日期">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button icon="el-icon-download" v-if="isAuth('inspection:device:delete')" type="text" size="small" @click="downloadHandle(scope.row.guid)">下载</el-button>
          <el-button icon="el-icon-delete" v-if="isAuth('inspection:device:delete')" type="text" size="small" @click="deleteHandle(scope.row.guid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div align="right">
      <el-pagination class="pagecontrol"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <el-form>
      <el-form-item>
        <div align="center">
          <el-upload
            class="upload-document"
            :action="this.$http.adornUrl(`/inspection/devicedoc/upload?token=${this.$cookie.get('token')}`)"
            :file-list="fileList"
            :on-success="uploadSuccessHandle"
            :on-error="uploadErrorHandle"
            :data="uploadParams">
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    props: {
      deviceId: {
        type: Number
      }
    },
    data () {
      return {
        fileList: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        uploadParams: {
          deviceId: null,
          category: 0
        }
      }
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList (category) {
        this.uploadParams.deviceId = this.deviceId
        this.uploadParams.category = category
        this.$http({
          url: this.$http.adornUrl('/inspection/devicedoc/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'deviceId': this.deviceId,
            'category': category
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
        })
      },
      downloadHandle (guid) {
        let a = document.createElement('a')
        a.href = this.$http.adornUrl(`/inspection/devicedoc/download?uuid=${guid}&token=${this.$cookie.get('token')}`)
        a.click()
      },
      deleteHandle (guid) {
        this.$http({
          url: this.$http.adornUrl(`/inspection/devicedoc/delete/${guid}?token=${this.$cookie.get('token')}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList(this.uploadParams.category)
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      uploadSuccessHandle (response, file, fileList) {
        this.fileList = []
        if (response.code > 0) {
          this.$message.error(response.msg)
        } else {
          this.getDataList(this.uploadParams.category)
        }
      },
      uploadErrorHandle (err, file, fileList) {
        this.$message.error(err)
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList(this.uploadParams.category)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList(this.uploadParams.category)
      },
      selectionChangeHandle () {
      },
      rowStyle ({row, rowIndex}) {
        return 'height:25px;padding:0;'
      },
      cellStyle () {
        return 'padding:0'
      }
    },
    watch: {
      'deviceId': function (newVal, oldVal) {
        this.getDataList(this.uploadParams.category)
      }
    }
  }
</script>

<style>
  .upload-document {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .pagecontrol {
    margin-top: 10px;
  }
</style>
