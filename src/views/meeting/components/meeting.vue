<script setup lang="ts">
import {onMounted, reactive, ref, toRefs} from "vue";
import {getToken} from "../../../utils/auth";
import {constructMsg, wsMsgType} from "../../../views/wechat/utils/construct";
import {ElMessage} from "element-plus";

const props = defineProps({
  roomId: Number
})
const control = reactive({
  camera: false,
  voice: false,
})
const visible = reactive({
  capture: false,
  camera: false,
  voice: false,
})
const members = ref([])
const mid = ref("")
const {roomId} = toRefs(props)
const mineType = 'video/webm;codecs="vp9,opus"'
const videoMineType = 'video/webm;codecs="vp9"'
const voiceMineType = 'video/webm;codecs="opus"'
let video: HTMLVideoElement | null


interface mediaMap {
  sb: SourceBuffer | null,
  ab: ArrayBuffer[],
  ms: MediaSource | null,
  duration: number
}

interface UserMediaMap {
  [key: string]: mediaMap;
}

let audioMediaMap: UserMediaMap = {}
let captureMediaMap: UserMediaMap = {}
let cameraMediaMap: UserMediaMap = {}


let ws: WebSocket;
let recorder: MediaRecorder;

let captureMediaStream: MediaStream
let cameraMediaStream: MediaStream
let voiceMediaStream: MediaStream
const uploadOffset = 1000

const startRecord = (stream: MediaStream, msgType: string) => {
  // recorder = new MediaRecorder(stream, {mimeType: mineType})
  recorder = new MediaRecorder(stream, )
  recorder.ondataavailable = (e) => {
    if (ws.readyState) {
      ws.send(constructMsg({
        data: ab2str(await e.data.arrayBuffer()),
        offset: uploadOffset
      }, msgType))
    }
    console.log("上传成功.....", new Date())
  }
  //TODO: start 每隔多少时间,不准确,可能会延时,实时效果很差, 播放时间和真实时间间隔会越来越大
  recorder.start(uploadOffset) // 每隔1s生成一个视频片段(触发一次ondataavailable)
}

const startCamera = () => {
  const options: MediaStreamConstraints = {
    video: {facingMode: "user", width: window.innerWidth, height: window.innerHeight}
  }
  try {
    let cameraStream = navigator.mediaDevices.getUserMedia(options);
    control.camera = true
    cameraStream.then((stream: MediaStream) => {
      startRecord(stream, "camera")
      cameraMediaStream = stream
      const v2 = document.getElementById("v2")?.querySelector("video")
      if (v2 && control.camera) {
        v2.srcObject = stream;
        v2.onloadedmetadata = function (e) {
          v2.play();
        };
      }
    })
  } catch (err) {
    control.camera = false
    console.error("Error: " + err);
  }
}
const stopCamera = () => {
  if (cameraMediaStream) {
    cameraMediaStream.getVideoTracks().forEach(track => {
      track.stop()
    })
  }
  control.camera = false
}


const ab2str = (buffer: ArrayBuffer) => {
  let str = '';
  const array = new Uint8Array(buffer);
  for (let i = 0; i < array.length; i++) {
    str += String.fromCharCode(array[i]);
  }
  return str;
}

const str2ab = (str: string) => {
  const buffer = new ArrayBuffer(str.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i);
  }
  return buffer;
}

const startVoice = () => {
  const options: MediaStreamConstraints = {
    audio: true,
  }
  try {
    let voiceStream = navigator.mediaDevices.getUserMedia(options);
    control.voice = true
    voiceStream.then((stream: MediaStream) => {
      startRecord(stream, "voice")
      voiceMediaStream = stream
    })
  } catch (err) {
    control.voice = false
    console.error("Error: " + err);
  }
}
const stopVoice = () => {
  if (voiceMediaStream) {
    voiceMediaStream.getAudioTracks().forEach(track => {
      track.stop()
    })
  }
  control.voice = false
}

const startCapture = () => {
  // if (ws.readyState <= 0) {
  //   ElMessage.success("分享失败")
  //   return
  // }
  const options: MediaStreamConstraints = {
    audio: false,
    video: {width: window.screen.width, height: window.screen.height}
  }
  try {
    let captureStream = navigator.mediaDevices.getDisplayMedia(options);
    captureStream.then((stream: MediaStream) => {
      startRecord(stream, "capture")
      captureMediaStream = stream
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

const createWsConnect = (() => {
  const socketURL = `ws://${import.meta.env.VITE_APP_SOCKET_HOST}/backend/v1/meeting/socket/${getToken()}/${roomId?.value}`;
  ws = new WebSocket(socketURL);
  ws.onopen = function () {
    // 建立连接
    ws.send(constructMsg({
      data: "ping"
    }, "ping"))
  }
  ws.onmessage = function (e) {
    let data = JSON.parse(e.data)
    switch (data.msg_type) {
      case "ping":
        mid.value = data.send_id.toFixed()
        console.log(mid.value)
        break
      case "members":
        members.value = data.data
        break
      case "capture":
        createCapture(data.send_id.toFixed(), data.data.data, data.data.offset)
        break
      case "camera":
        createCamera(data.send_id.toFixed(), data.data.data, data.data.offset)
        break
      case "voice":
        createAudio(data.send_id.toFixed(), data.data.data, data.data.offset)
        break

    }
  }
})


const createAudio = (
    mid: string, data: string, offset: number
) => {
  const sb = str2ab(data)
  if (Object.keys(audioMediaMap).indexOf(mid) < 0) {
    audioMediaMap[mid] = <mediaMap>{}
    audioMediaMap[mid].ab = []
    audioMediaMap[mid].ab.push(sb)
    const tag = document.createElement("audio")
    tag.onloadedmetadata = function (e: any) {
      tag!.play();
    }
    const mediaSource = new MediaSource();
    tag.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', async (e) => {
      let sourceBuffer = mediaSource.addSourceBuffer(voiceMineType);
      audioMediaMap[mid].sb = sourceBuffer
      sourceBuffer!.addEventListener('updateend', function () {
        addBuffer(audioMediaMap[mid], offset)
      });
      addBuffer(audioMediaMap[mid], offset)
    })
  } else {
    audioMediaMap[mid].ab.push(sb)
    addBuffer(audioMediaMap[mid], offset)
  }

}
const createCapture = (
    mid: string, data: string, offset: number
) => {
  const sb = str2ab(data)
  const tag = document.getElementById("v1")?.querySelector("video")
  if (Object.keys(captureMediaMap).indexOf(mid) < 0) {
    captureMediaMap[mid] = {ab: [], duration: 0, sb: null, ms: null}
    captureMediaMap[mid].ab.push(sb)
    tag!.onloadedmetadata = function (e: any) {
      tag!.play();
      if (tag!.currentTime < (captureMediaMap[mid].duration - (uploadOffset / 1000))) {
        tag!.currentTime = (captureMediaMap[mid].duration - (uploadOffset / 1000))
      }
    }
    const mediaSource = new MediaSource();
    captureMediaMap[mid].ms = mediaSource
    tag!.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', async (e) => {
      let sourceBuffer = mediaSource.addSourceBuffer(videoMineType);
      captureMediaMap[mid].sb = sourceBuffer
      sourceBuffer!.addEventListener('updateend', function () {
        addBuffer(captureMediaMap[mid], offset)
      });
      addBuffer(captureMediaMap[mid], offset)
    })
  } else {
    captureMediaMap[mid].ab.push(sb)
    addBuffer(captureMediaMap[mid], offset)
  }
  console.log(captureMediaMap[mid].duration, tag!.currentTime, offset / 1000, tag!.duration, captureMediaMap[mid].ms?.duration)
  // offset = (offset - uploadOffset) / 1000
  // if (tag!.currentTime < offset) {
  //   tag!.currentTime = offset
  // }

}

const createCamera = (
    mid: string, data: string, offset: number
) => {
  const sb = str2ab(data)
  const tag = document.getElementById("v2")?.querySelector("video")
  if (Object.keys(cameraMediaMap).indexOf(mid) < 0) {
    cameraMediaMap[mid] = <mediaMap>{}
    cameraMediaMap[mid].ab = []
    cameraMediaMap[mid].ab.push(sb)
    tag!.onloadedmetadata = function (e: any) {
      tag!.play();
    }
    const mediaSource = new MediaSource();
    tag!.src = URL.createObjectURL(mediaSource);
    mediaSource.addEventListener('sourceopen', async (e) => {
      let sourceBuffer = mediaSource.addSourceBuffer(videoMineType);
      cameraMediaMap[mid].sb = sourceBuffer
      sourceBuffer!.addEventListener('updateend', function () {
        addBuffer(cameraMediaMap[mid], offset)
      });
      addBuffer(cameraMediaMap[mid], offset)
    })
  } else {
    cameraMediaMap[mid].ab.push(sb)
    addBuffer(cameraMediaMap[mid], offset)
  }
  if (captureMediaMap[mid].duration > tag!.currentTime) {
    tag!.currentTime = captureMediaMap[mid].duration
  }
}
const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))

const addBuffer = (mm: mediaMap, offset: number) => {
  if (mm.sb && !mm.sb.updating) {
    const buffer = mm.ab.shift();
    if (!buffer) {
      return;
    }
    mm.sb.appendBuffer(buffer);
    mm.duration += (offset / 1000)
  } else {
    console.log("忙碌中......")
  }
}

onMounted(() => {
  // 进入websocket
  createWsConnect()

})

</script>

<template>

  <div>

    <div class="v0">
      <div id="v1">
        <video controls type="video/webm"></video>
      </div>
      <div id="v2">
        <video controls type="video/webm"></video>
      </div>
    </div>
    <div v-for="member in member">
      <p class="username">{{ member.username }}</p>
    </div>
  </div>
  <div class="control">
    <el-button @click="startCapture">分享屏幕</el-button>
    <el-button v-if="control.camera" @click="stopCamera()">关闭摄像头</el-button>
    <el-button v-else @click="startCamera()">打开摄像头</el-button>
    <el-button v-if="control.voice" @click="stopVoice()">关闭麦克风</el-button>
    <el-button v-else @click="startVoice">打开麦克风</el-button>
  </div>
</template>

<style scoped lang="sass">
.v0
  position: relative
  width: 832px
  height: 540px
  margin-bottom: 10px
  border: black 1px solid

  #v1
    width: 832px
    height: 540px

    video
      width: 832px
      height: 540px

  #v2
    position: absolute
    bottom: 0
    right: 50px
    width: 150px
    height: 110px

    video
      width: 200px
      height: 110px

</style>
