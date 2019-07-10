<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a  v-if="sidebarFold===false" class="site-navbar__brand-lg" href="javascript:;">智能巡检管理系统</a>
        <a v-if="sidebarFold===true" class="site-navbar__brand-mini" href="javascript:;">巡检</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item v-if="totalPage"  style="background-color:azure; !important;"  index="2">
          <div>
           <span>
             <template>
                <el-carousel :interval="2000"  height="40px" @click.native="newsHandle()" >
                  <el-carousel-item  v-for="item in imgList" :key="item.newsId" >
                    <el-row>
                      <el-col :span="8" style="color: black"><!--{{item}}-->{{item.newsName}}</el-col>
                    </el-row>
                  </el-carousel-item>
                </el-carousel>
            </template>

            <div class="block" style="margin-top: -60px;">
                   <span>你有消息</span>
                    <span>好消息</span>
                    <span>坏消息</span>
              </div>
             </span>
          </div>
        </el-menu-item>
        <el-menu-item class="site-navbar__avatar" index="3">


          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
             <!-- <img v-if="newsCountVisible" src="~@/assets/img/avatar.png">
              <span>您有{{newsCountVisible}} 条待处理的消息</span>-->
              <img src="~@/assets/img/avatar.png" :alt="userName">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <!--<el-dropdown-item v-if="totalPage" @click.native="newsHandle()">待处理的消息</el-dropdown-item>-->
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    <news v-if="newsVisible" ref="news"></news>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import news from './main-navbar-news'
  import { clearLoginInfo } from '@/utils'
  export default {
    data () {
      return {
        totalPage: 0,
        updatePassowrdVisible: false,
        newsVisible: false,
        pageIndex: 1,
        pageSize: 100,
        imgList: [
          {
            newsId: '',
            userId: '',
            newsName: '',
            newsType: '',
            newsNumber: '',
            createTime: '',
            updateTime: ''
          }
        ]
      }
    },
    mounted () {
      this.newsexist()
    },
    components: {
      UpdatePassword,
      news
    },
    computed: {
      navbarLayoutType: {
        get () {
          return this.$store.state.common.navbarLayoutType
        }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      userName: {
        get () { return this.$store.state.user.name }
      },
      userId: {
        get () { return this.$store.state.user.id }
      }
    },
    watch: {
      imgList () {
        this.timer()
      }
    },
    methods: {
      // 处理消息
      newsHandle () {
        this.newsVisible = true
        this.$nextTick(() => {
          this.$refs.news.init()
        })
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              clearLoginInfo()
              this.$router.push({ name: 'login' })
            }
          })
        }).catch(() => {})
      },
      // 查询是否有登录消息
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
            this.imgList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.imgList = []
            this.totalPage = 0
          }
        })
      },
      // 这是一个定时器
      timer () {
        return setTimeout(() => {
          this.newsexist()
        }, 1000*60*5)
      }
    },
    // 最终销毁
    destroyed () {
      clearTimeout(this.timer)
    }
  }
</script>
