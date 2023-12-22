<template>
  <el-button @click="clickCreateMeeting">创建房间</el-button>
  <el-button @click="startCapture">分享屏幕</el-button>
  <el-button @click="joinMeeting">加入</el-button>

  <video id="v1" controls type="video/webm" style="width: 1000px;height: 600px"></video>
</template>


<script lang="ts">
import {defineComponent} from "vue"
import {createMeeting, pushMeeting} from "../../api/meeting";


export default defineComponent({
  name: 'Live',
  setup() {
    let Reader: { read: () => Promise<any>; } | null = null;
    const bufferList: any[] = []
    let sourceBuffer: SourceBuffer | null = null;
    // const mineType = 'video/webm;codecs="vp9,opus"'
    let mineType = 'video/webm;codecs="vp9"'
    let video: HTMLVideoElement | null
    let inRoom = false

    const fetch = (url: RequestInfo | URL) => {
      window.fetch(url, {
        method: 'GET',
        mode: 'cors',
      }).then(res => {
        Reader = res.body!.getReader();
        readerBuffer()
        // 读取
      }).catch((err) => {
        console.log('拉流失败', err)
      })
    }
    const readerBuffer = async () => {
      if (!Reader || !inRoom) return;
      let res = await Reader.read()
      if (res.value) {
        bufferList.push(res.value.buffer)
        addBuffer()
      }
      await readerBuffer()
      return
    }

    let recorder: MediaRecorder;

    const startRecord = (stream: MediaStream,) => {
      recorder = new MediaRecorder(stream, {mimeType: mineType})
      recorder.ondataavailable = e => {
        pushMeeting("1", e.data)
        // console.log(e)
      }
      recorder.start(2000) // 每隔5s生成一个视频片段(触发一次ondataavailable)
    }
    const stopRecord = () => {
      recorder.stop()
    }
    const joinMeeting = () => {
      video = document.querySelector("video")
      inRoom = true
      if (video) {
        video.onloadedmetadata = function (e) {
          video?.play();
        }
        const mediaSource = new MediaSource();
        video.src = URL.createObjectURL(mediaSource);
        mediaSource.addEventListener('sourceopen', (e) => {
          sourceBuffer = mediaSource.addSourceBuffer(mineType);
          sourceBuffer!.addEventListener('updateend', function () {
            if (mediaSource.readyState != 'open') {
              mediaSource.endOfStream()
              console.log("结束追加....")
              return
            }
            addBuffer()
          });
          const url = 'http://localhost:8771/backend/v1/meeting/1';
          fetch(url);

        })
      }
    }
    const addBuffer = () => {
      if (sourceBuffer && !sourceBuffer.updating) {
        const buffer = bufferList.shift();
        if (!buffer) {
          return;
        }
        sourceBuffer.appendBuffer(buffer);
      } else {
        console.log('sourcebuff还在忙碌', sourceBuffer!.updating);
      }
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
          // const v1 = document.querySelector("video")
          // if (v1) {
          //   v1.srcObject = stream;
          //   v1.onloadedmetadata = function (e) {
          //     v1.play();
          //   };
          // }

        })
      } catch (err) {
        console.error("Error: " + err);
      }
    }
    const clickCreateMeeting = () => {
      createMeeting("1").then(() => {
      })
    }
    return {
      startCapture,
      joinMeeting,
      clickCreateMeeting
    }
  }
});


</script>

<style scoped>

</style>
