<template>
  <el-dialog
    title="待处理消息"
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
        <!--<el-table-column
          prop="newsTypeName"
          header-align="center"
          align="center"
          label="消息类型名称">
        </el-table-column>-->
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
            <el-button type="primary"  @click="toNewsHandle(scope.row.newsType)">去处理</el-button>
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
          pageSize: 100,
          totalPage: 0
        }
      },
      // 钩子函数
      mounted () {
        this.getDataList()
        this.newsexist()
      },
      watch: {
        dataList () {
          this.timer()
        }
      },
      computed: {
        userId: {
          get () { return this.$store.state.user.id }
        }
      },
      methods: {
        // 初始化
        init () {
          this.visible = true
          this.$nextTick(() => {
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
              'user_id': this.userId
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
        toNewsHandle (newsType) {
          // 待处理的 确认班组日志
          if (newsType === 1) {
            this.$router.push('/group-classgrouplogconfirmed')
            this.visible = false
          } else if (newsType === 2) {
            this.$router.push('/group-classgrouplogreject')
            this.visible = false
          } else if (newsType === 3) {
            this.$router.push('/management-ordermanagementalready')
            this.visible = false
          } else if (newsType === 4) {
            this.$router.push('/management-ordermanagement')
            this.visible = false
          } else if (newsType === 5) {
            this.$router.push('/management-ordermanagementreported')
            this.visible = false
          } else if (newsType === 6) {
            this.$router.push('/management-ordermanagementconfirm')
            this.visible = false
          } else if (newsType === 7) {
            this.$router.push('/management-ordermanagementfinished')
            this.visible = false
          } else if (newsType === 8) {
            this.$router.push('/management-ordermanagementreported')
            this.visible = false
          }
        },
        newsexist () {
          this.$http({
            url: this.$http.adornUrl('/sys/news/list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': this.pageIndex,
              'limit': this.pageSize,
              'user_id': this.userId
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
        // 这是一个定时器
        timer () {
          return setTimeout(() => {
            this.newsexist()
          }, 5000)
        }
      },
      // 最终销毁
      destroyed () {
        clearTimeout(this.timer)
      }
    }
</script>

<style scoped>

</style>
