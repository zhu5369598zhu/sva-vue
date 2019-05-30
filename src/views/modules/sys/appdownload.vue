<template>
	<div class="mod-app-download">
    <div class="show-data-content">
      <a style="cursor:pointer" :href="download">
        <img class="qrcode" :src="getQrcode"></img>
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

<style>
  .qrcode{
    width: 300px;
  }
</style>
