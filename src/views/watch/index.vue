<template>
  <div>
    <video id="videoElement" class="videoElement" controls muted></video>
  </div>

</template>


<script lang="ts">
import {defineComponent, computed, ref, reactive, onUpdated, onMounted, nextTick} from "vue"

import flvjs from "flv.js"

export default defineComponent({
  name: 'Watch',
  setup() {
    let player: flvjs.Player | null
    // 待优化，从直播列表进入, url 传参进入
    const createdPlay = () => {
      if (player) return;
      if (flvjs.isSupported()) {
        player = flvjs.createPlayer({
          type: 'flv',
          isLive: true,
          url: 'http://127.0.0.1:8771/backend/v1/live/1111.flv',
        }, {
          // autoCleanupMinBackwardDuration: 5, // 清除缓存 对 SourceBuffer 进行自动清理
        })
        if (!player) return
        const videoElement = document.getElementById('videoElement') as HTMLMediaElement;
        if (videoElement) {
          player.attachMediaElement(videoElement);
          player.load();
          player.play();

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

    return {}
  }
})
;


</script>


<style scoped lang="sass">
.videoElement
  width: 80%


</style>
