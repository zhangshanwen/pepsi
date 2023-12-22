<script setup lang="ts">
import {toRefs} from "vue";
import {pushMeeting} from "../../../api/meeting";

const props = defineProps({
  mid: Number
})
const {mid} = toRefs(props)
// const mineType = 'video/webm;codecs="vp9,opus"'
let mineType = 'video/webm;codecs="vp9"'
let video: HTMLVideoElement | null

let recorder: MediaRecorder;

const startRecord = (stream: MediaStream,) => {
  recorder = new MediaRecorder(stream, {mimeType: mineType})
  recorder.ondataavailable = e => {
    pushMeeting(mid?.value!, e.data)
    // console.log(e)
  }
  recorder.start(500) // 每隔5s生成一个视频片段(触发一次ondataavailable)
}
const startCapture = (displayMediaOptions: MediaStreamConstraints) => {
  const options: MediaStreamConstraints = {
    audio: true,
    video: {facingMode: "user", width: window.innerWidth, height: window.innerHeight}
  }
  let captureStream = null;
  try {
    captureStream = navigator.mediaDevices.getDisplayMedia(options);
    // captureStream = navigator.mediaDevices.getUserMedia(options);
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
</script>

<template>
  <el-button @click="startCapture">分享屏幕</el-button>

  <video id="v1" controls type="video/webm" style="width: 1000px;height: 600px"></video>
</template>

<style scoped lang="sass">

</style>
