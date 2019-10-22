<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a  v-if="sidebarFold===false" class="site-navbar__brand-lg" href="javascript:;">智慧云点巡检管理系统</a>
        <a v-if="sidebarFold===true" class="site-navbar__brand-mini" href="javascript:;">巡检</a>
        <a  v-if="sidebarFold===false" class="site-navbar__brand-lg" href="javascript:;"><img style="height: 35px;" src="../../static/img/logo.png"></a>
        <a v-if="sidebarFold===true" class="site-navbar__brand-mini" href="javascript:;"><img style="height: 30px;" src="../../static/img/tologo.png"><!--巡检--></a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu
        class="site-navbar__menu"
        mode="horizontal">
        <el-menu-item class="site-navbar__switch" index="0" @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
          <span style="padding-left: 10px; font-size: 14px;">HcoAladin 智慧云点巡检管理系统</span>
        </el-menu-item>
      </el-menu>
      <el-menu
        class="site-navbar__menu site-navbar__menu--right"
        mode="horizontal">
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img v-if="purl !== ''" @click="chagelogo()" :src="purl" :alt="userName"/>
              <img v-else @click="chagelogo()" src="~@/assets/img/avatar.png" :alt="userName"/>

              {{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
    <Logo v-if="logoVisible" ref="Logo"></Logo>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import { clearLoginInfo } from '@/utils'
  import Logo from './main-logo'
  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        logoVisible: false,
        updatePassowrdVisible: false,
        purl: '',
        filelist: []
      }
    },
    components: {
      UpdatePassword,
      UpdatePassword,
      Logo
    },
    created () {
      this.getPicList()
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
    methods: {
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
      chagelogo () {
        this.logoVisible = true
        this.$nextTick(() => {
          this.$refs.Logo.init()
        })
      },
      getPicList () {
        this.filelist = []
        this.$http({
          url: this.$http.adornUrl('/sys/userpic/list'),
          method: 'get',
          params: this.$http.adornParams({
            'userId': this.userId
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.fileList = data.piclist.map(item => {
              item.name = item.url
              item.url = this.$http.adornUrl(`/sys/userpic/pic.png?uuid=${item.url}`)
              this.purl = item.url
              return item
            })
          } else {
            this.fileList = []
          }
        })
      }
    }
  }
</script>

