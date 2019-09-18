<template>
  <el-dialog style="z-index:1"
    :close-on-click-modal="false"
    :modal=true
    width="30%"
    :visible.sync="visible"
    append-to-body>
    <div class="view-media" align="center">
      <div classs="view-pic" v-if="type==='jpg' || type==='png'">
      <img 
        width="375"
        height="500"
        :src="getPicUrl(guid)"></img>
      </div>
      <div class="view-mp3" v-if="type==='mp3'">
        <audio :src="getMp3Url(guid)" controls="controls"></audio>
      </div>
      <div v-if="type==='video'">
        <video :src="getVideoUrl(guid)" controls="controls"></video>
      </div>
      <div v-if="type==='data'" style="width:400px;height:400px;">
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import vueAudio from '@/components/vue-audio'
  export default {
    data () {
      return {
        inspection: '',
        type: '',
        guid: '',
        visible: false
      }
    },
    components: {
      vueAudio
    },
    methods: {
      init (type, url, inspection) {
        console.log(type)
        this.inspection = inspection
        this.type = type
        this.guid = url
        this.visible = true
      },
      getPicUrl (guid) {
        if (this.inspection === 'random') {
          return this.$http.adornUrl(`/inspection/inspectionrondomresultmedia/media.jpg?uuid=${guid}`)
        } else {
          return this.$http.adornUrl(`/inspection/inspectionresultmedia/media.jpg?uuid=${guid}`)
        }
      },
      getMp3Url (guid) {
        if (this.inspection === 'random') {
          return this.$http.adornUrl(`/inspection/inspectionrondomresultmedia/mp3?uuid=${guid}`)
        } else {
          return this.$http.adornUrl(`/inspection/inspectionresultmedia/mp3?uuid=${guid}`)
        }
      },
      getVideoUrl (guid) {
        if (this.inspection === 'random') {
          return this.$http.adornUrl(`/inspection/inspectionrondomresultmedia/mp4?uuid=${guid}`)
        } else {
          return this.$http.adornUrl(`/inspection/inspectionresultmedia/mp4?uuid=${guid}`)
        }
      }
    }
}
</script>
