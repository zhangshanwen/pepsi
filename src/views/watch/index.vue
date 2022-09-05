<template>
  <video muted id="videoElement"></video>
  <el-button @click="flv_start()">Start</el-button>

</template>


<script lang="ts">
import {defineComponent, computed, ref, reactive, onMounted, nextTick} from "vue"
import {getToken} from "../../utils/auth";

import flvjs from "flv.js"
import FlvJs from "flv.js";

export default defineComponent({
  name: 'Watch',
  setup() {
    var player: FlvJs.Player | null
    let first = true;

    const createdPlay = () => {
      if (flvjs.isSupported()) {
        player = flvjs.createPlayer({
          type: 'flv',
          // hasAudio: false,
          url: 'http://127.0.0.1:7001/live/movie.flv',
        }, {
          autoCleanupMinBackwardDuration: 5, // 清除缓存 对 SourceBuffer 进行自动清理
        })
        var videoElement = document.getElementById('videoElement');
        if (videoElement) {
          player?.attachMediaElement(videoElement);
          player?.load();
          player?.play()
        }
      }
    }
    const destroyVideos = () => {
      if (!player) return
      player.pause()
      player.unload()
      player.detachMediaElement()
      player.destroy()
      player = null

    }

    onMounted(() => {
      nextTick(() => {
        createdPlay()
        player?.on(flvjs.Events.ERROR, (errType, errDetail) => {
          if (player) {
            destroyVideos()
            createdPlay()
          }
        })
      })

    })


    const flv_start = () => {
      player?.play()
    }
    return {
      flv_start
    }
  }
})
;


</script>

<style scoped>

</style>