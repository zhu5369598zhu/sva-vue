<template>
  <el-dialog
    title="待处理消息"
    v-dialog-drag
    :visible.sync="visible"
    :append-to-body="true">
    <el-table
      :data="dataList"
      border
      style="width: 100%;"
    >
        <el-table-column
          prop="newsId"
          header-align="center"
          align="center"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="newsName"
          header-align="center"
          align="center"
          label="消息名称">
        </el-table-column>
        <el-table-column
          prop="newsNumber"
          header-align="center"
          align="center"
          label="编号"
        >

        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button  type="primary"  @click="toNewsHandle(scope.row.newsType, scope.row.newsNumber)" size="mini">去处理</el-button>
          </template>
        </el-table-column>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>

    </el-table>


    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <!--<el-button type="primary" @click="dataFormSubmit()">确定</el-button>-->
    </span>
  </el-dialog>



</template>

<script>
    export default {
      data () {
        return {
          visible: false,
          dataList: [],
          pageIndex: 1,
          pageSize: 10,
          totalPage: 0,
          type: ''
        }
      },
      computed: {
        userId: {
          get () { return this.$store.state.user.id }
        }
      },
      methods: {
        // 初始化
        init (type) {
          this.visible = true
          this.$nextTick(() => {
            this.type = type
            this.getDataList()
          })
        },
        // 获取数据列表
        getDataList () {
          this.$http({
            url: this.$http.adornUrl('/sys/news/list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'limit': this.pageSize,
              'user_id': this.userId,
              'type': this.type
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
        // 每页数
        sizeChangeHandle (val) {
          this.pageSize = val
          this.pageIndex = 1
          this.getDataList()
        },
        // 当前页
        currentChangeHandle (val) {
          this.pageIndex = val
          this.getDataList()
        },
        toNewsHandle (newsType, newsNumber) {
          console.log(newsType)
          // 待处理的 确认班组日志
          if (newsType === 1) {
            if (this.isAuth('group:classgrouplogconfirmed:list')) {
              this.$router.push({name: 'group-classgrouplogconfirmed', params:{logNumber: newsNumber}})
              this.visible = false
            } else {
              this.$alert('您没有开通页面权限')
            }
          } else if (newsType === 2) {
            if (this.isAuth('group:classgrouplogconfirmed:list')) {
              this.$router.push({name: 'group-classgrouplogconfirmed', params:{logNumber: newsNumber}})
              this.visible = false
            } else {
              this.$alert('您没有开通页面权限')
            }
          } else if (newsType === 3) {
            if (this.isAuth('management:ordermanagementalready:list')) {
              this.$router.push({name: 'management-ordermanagementalready', params:{orderNumber: newsNumber}})
              this.visible = false
            } else {
              this.$alert('您没有开通页面权限')
            }
          } else if (newsType === 4) {
            if (this.isAuth('management:ordermanagement:list')) {
              this.$router.push({name: 'management-ordermanagement', params: {orderNumber: newsNumber}})
              this.visible = false
            } else {
              this.$alert('您没有开通页面权限')
            }
          } else if (newsType === 5) {
            if (this.isAuth('management:ordermanagementreported:list')) {
              this.$router.push({name: 'management-ordermanagementreported', params: {orderNumber: newsNumber}})
              this.visible = false
            } else {
              this.$alert('您没有开通页面权限')
            }
          } else if (newsType === 6) {
            if (this.isAuth('management:ordermanagementconfirm:list')) {
              this.$router.push({name: 'management-ordermanagementconfirm', params: {orderNumber: newsNumber}})
              this.visible = false
            } else {
              this.$alert('您没有开通页面权限')
            }
          } else if (newsType === 7) {
            this.$router.push({name: 'management-ordermanagementfinished', params: {orderNumber: newsNumber}})
            this.visible = false
          } else if (newsType === 8) {
            if (this.isAuth('management:ordermanagementreported:list')) {
              this.$router.push({name: 'management-ordermanagementreported', params: {orderNumber: newsNumber}})
              this.visible = false
            } else {
              this.$alert('您没有开通页面权限')
            }
          } else if (newsType === 9) {
            if (this.isAuth('management:ordermanagement:list')) {
              this.$router.push({name: 'management-ordermanagement', params: {orderNumber: newsNumber}})
              this.visible = false
            } else {
              this.$alert('您没有开通页面权限')
            }
          } else if (newsType === 11) {
            if (this.isAuth('management:orderdefective:list')) {
              this.$router.push({name: 'management-orderdefective', params: {defectiveNumber: newsNumber}})
              this.visible = false
            } else {
              this.$alert('您没有开通页面权限')
            }
          } else if (newsType === 12) {
            if (this.isAuth('management:orderdefect:list')) {
              this.$router.push({name: 'management-orderdefect', params: {defectiveNumber: newsNumber}})
              this.visible = false
            } else {
              this.$alert('您没有开通页面权限')
            }
          } else if (newsType === 14) {
            if (this.isAuth('management:ordermanagementreported:list')) {
              this.$router.push({name: 'management-ordermanagementreported', params: {orderNumber: newsNumber}})
              this.visible = false
            } else {
              this.$alert('您没有开通页面权限')
            }
          }
        }
      }
    }
</script>

<style scoped>

</style>
