<template>
  <div class="mod-app-download" style="height: 100%;">
    <div class="show-data-content download">
      <a style="cursor:pointer" :href="download">
        <img class="qrcode" :src="getQrcode"></img>
        <p>点击或扫描二维码下载APP</p>
        <img src="~@/assets/img/android.png" alt="" class="android_img">
        <p style="font-weight: bold;">V 4.3.20</p>
        <p>需要Android5.0或更高版本。</p>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        download: this.$http.adornUrl(`/sys/appupgrade/app.apk`),
        getQrcode: this.$http.adornUrl(`/sys/appupgrade/qrcode.png`)
      }
    },
    method: {
    }
  }
</script>

<style lang="scss">
  .download{
    display: flex;
    justify-content: center;
    align-items: center;
    a{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      &:hover {
        text-decoration: none !important;
      }
      .android_img{
        width: 100px;
        margin-bottom: 10px;
      }
      p{
        color: #000;
        margin-bottom: 10px;
        letter-spacing: 1px;

      }
    }
  }
  .qrcode{
    width: 300px;
  }
</style>
