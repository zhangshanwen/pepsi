<template>
  <div class="wechat-contain" v-if="visible.login">
    <div class="wechat-form">
      <div class="wechat-title">
        <div class="title">
          <span>{{ t('i18n.wechat_room') }}</span>
        </div>
      </div>
      <div v-if="visible.qrcode" class="wechat-qrcode">
        <div>
          <span>{{ t('i18n.pls_scan_qrcode') }}</span>
        </div>
        <el-image :src="qrcode" @click="loadQrcode"></el-image>
      </div>
    </div>
  </div>
  <home v-else></home>

</template>

<script lang="ts">
import {ref, reactive, onMounted, nextTick, watch} from 'vue';
import {useStore} from 'vuex'
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {getQrcode, getStatus, getAvatar} from '../../api/wechat';
import Home from "./home/index.vue";
import {getToken} from "../../utils/auth";
import {base642Url} from "../../utils/img";
import {instructBody, userInfo} from "../../store/index";
import {constructMsg, wsMsgType} from "./utils/construct";

export default {
  name: 'Wechat',
  components: {Home},
  setup() {
    const store = useStore();
    const t = useI18n().t;
    const qrcode = ref()
    const active = ref(false)
    const visible = reactive({
      qrcode: false,
      login: true,
    })
    let ws: WebSocket;

    const loadQrcode = () => {
      getQrcode().then((res) => {
        qrcode.value = res.data
        visible.qrcode = true
      }).catch()
    }

    const login = (msg: string) => {
      switch (msg) {
        case "success":
          visible.login = false
          break
        case "scanned":
          loadQrcode()
          break
      }
    }
    watch(() => [...store.state.wechat.instruct], (value: any, oldValue: any) => {
      if (store.state.wechat.instruct.length === 0) {
        return
      }
      const {name, data} = store.state.wechat.instruct.pop()
      const st = setInterval(() => {
        if (ws.readyState) {
          ws.send(constructMsg(data, name))
          clearInterval(st)
        }
      }, 500)
    })

    const createWsConnect = (() => {
      const socketURL = `ws://${import.meta.env.VITE_APP_SOCKET_HOST}/backend/v1/wechat/socket/${getToken()}`;
      ws = new WebSocket(socketURL);
      ws.onopen = function () {
        // 建立连接
        ws.send(constructMsg("ping", "ping"))
      }
      ws.onmessage = function (e) {
        let data = JSON.parse(e.data)
        console.log("获取到消息", data.msg_type)
        switch (data.msg_type) {
          case wsMsgType.ping:
            break
          case wsMsgType.login:
            login(data.data)
            break
            // 成功建立连接，初始化数据,获取用户信息等数据
          case wsMsgType.syncFriends:
            store.state.wechat.friends = []
            data.data.forEach((item: { uin: string; nick_name: string; head_img_base64: string }) => {
              let friend = <userInfo>{
                uin: item.uin,
                nickName: item.nick_name,
              }
              friend.headUri = base642Url(item.head_img_base64)
              store.state.wechat.friends.push(friend)
            })
            // 获取到好友信息
            break
          case wsMsgType.selfInfo:
            // 保存用户id
            store.state.wechat.userInfo.uin = data.data.uin
            store.state.wechat.userInfo.nickName = data.data.nick_name
            store.state.wechat.userInfo.headUri = base642Url(data.data.head_img_base64)
            break

          case wsMsgType.syncMessages:
            // 同步到消息
            if (store.state.wechat.chatUser.lastCount == 0) {
              store.state.wechat.messages = data.data.messages
            } else {
              store.state.wechat.messages = [...data.data.messages, ...store.state.wechat.messages ]
            }
            store.state.wechat.chatUser.lastCount = data.data.last_count

            break

          case wsMsgType.chat:
            // 收到最新消息
            // 判断是否与当前聊天id相同,如果相同，推送进去,如果不同,朋友new+1
            const msg = data.data
            const chatUserUin = store.state.wechat.chatUser.uin
            if (msg.sender_id === chatUserUin || msg.receiver_id === chatUserUin) {
              store.state.wechat.messages.push(msg)
            }
            break

        }
      }
    })
    onMounted(() => {
      //1. 获取当前登录状态
      getStatus().then((res => {
        active.value = res.data.active
      })).catch().finally(() => {
        createWsConnect()
        if (!active.value) {
          loadQrcode()
        } else {
          visible.login = false
        }
      })

    })
    return {
      t,
      qrcode,
      visible,

      loadQrcode
    };

  }
};
</script>

<style scoped lang="sass">

.wechat-contain
  //position: relative
  width: 100%
  height: 100%
  background:
    //image: url(../../assets/img/wechat-bg.jpg)
    image: linear-gradient(70deg, blue, white)
    size: 100%

  .wechat-title
    width: 100%
    height: 100px
    line-height: 50px
    display: flex
    justify-content: center
    align-items: center
    font:
      size: 20px
    color: #fff
    border:
      bottom: 1px solid #ddd

    .title
      height: 50px
      width: 150px
      border-radius: 10px
      justify-content: center
      align-items: center
      text-align: center
      background-image: linear-gradient(45deg, gold, deeppink)
      animation: hue 3s infinite linear

      &::before,
      &::after
        content: ""
        position: absolute
        top: -15px
        bottom: -15px
        left: -15px
        right: -15px
        border: 5px solid #24acf2
        border-image: linear-gradient(45deg, gold, deeppink) 1
        clip-path: inset(0px round 10px)
        animation: clippath 3s infinite linear

      &::after
        animation: clippath 3s infinite -1.5s linear

      span
        color: white
        font-size: 20px


  .wechat-form
    //position: absolute
    //left: 50%
    //top: 40%
    width: 70%
    height: 100%
    margin:
      //top: 10%
      left: 15%
    border-radius: 50px
    background: rgba(255, 255, 255, 0.3)
    overflow: hidden

    .wechat-qrcode
      height: 100%
      text-align: center
      margin:
        top: 2%

      div
        margin-bottom: 3%

  .ms-content
    padding: 30px 30px


  .wechat-btn
    text-align: center

    button
      width: 100%
      height: 36px
      margin:
        bottom: 10px
      color: aqua
      background-color: black
      -webkit-box-reflect: below 1px linear-gradient(transparent, rgba(6, 133, 133, 0.3))


.el-button:hover
  background-color: aqua
  box-shadow: 0 0 5px aqua, 0 0 75px aqua, 0 0 155px aqua
  color: black


@keyframes hue
  0%
    filter: hue-rotate(0deg)

  100%
    filter: hue-rotate(360deg)

@keyframes clippath
  0%
    clip-path: inset(0 0 95% 0)
    filter: hue-rotate(0deg)
  25%
    clip-path: inset(0 95% 0 0)

  50%
    clip-path: inset(95% 0 0 0)
  75%
    clip-path: inset(0 0 0 95%)
  100%
    clip-path: inset(0 0 95% 0)
    filter: hue-rotate(360deg)


</style>
