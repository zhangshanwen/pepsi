<template>
  <el-button @click="startCapture">按一下</el-button>
  <video id="v1" autoplay playsinline muted style="width: 400px;height: 400px"></video>
</template>


<script lang="ts">
import {defineComponent, computed, ref, reactive} from "vue"
import {getToken} from "../../utils/auth";


export default defineComponent({
  name: 'Live',
  setup() {
    let recorder: MediaRecorder;
    const startRecord = (stream: MediaStream) => {
      recorder = new MediaRecorder(stream)
      recorder.ondataavailable = e => {
        // 每次上传10s视频, 录制结束后通知后台 合并视频片段
        // const v2 = document.querySelector("#v2")
        // if (v2) {
        //   const url = URL.createObjectURL(e.data)
        //   v2.src = url;
        // }
        console.log(e.type)
      }
      recorder.start(5000) // 每隔10s生成一个视频片段(触发一次ondataavailable)
    }
    const stopRecord = () => {
      recorder.stop()
    }

    const startCapture = (displayMediaOptions: DisplayMediaStreamConstraints) => {
      const a: DisplayMediaStreamConstraints = {
        audio: true,
        video: {facingMode: "user", width: 1280, height: 720}
      }
      let captureStream = null;
      try {
        captureStream = navigator.mediaDevices.getDisplayMedia(a);
        captureStream.then((stream: MediaStream) => {
          startRecord(stream)
          const v1 = document.querySelector("video")
          if (v1) {
            v1.srcObject = stream;
            v1.onloadedmetadata = function (e) {
              v1.play();
            };
          }
        })
      } catch (err) {
        console.error("Error: " + err);
      }
    }
    return {
      startCapture
    }
  }
});


</script>

<style scoped>

</style>