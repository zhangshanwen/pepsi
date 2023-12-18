<script setup>

import {computed, nextTick, reactive, ref, watch} from "vue";
import {useStore} from "vuex";
import {formatterTime, wsMsgType} from '../../utils/construct'

const store = useStore()
const isGetMoreMsg = ref(false)

const messages = computed(() => {
  return store.state.wechat.messages
})
const currentId = computed(() => {
  return store.state.wechat.chatUser.uin
})

const lastCount = computed(() => {
  return store.state.wechat.chatUser.lastCount
})
const chatFriedHeadUri = computed(() => {
  return store.state.wechat.chatUser.headUri
})
const imageUrl = computed(() => {
  return store.state.wechat.userInfo.headUri
})
const getMoreMessages = () => {
  store.state.wechat.instruct.push({
    name: wsMsgType.syncMessages,
    data: {
      find_id: currentId,
      is_group: store.state.wechat.chatUser.isGroup,
      count: store.state.wechat.messages.length,
    }
  })
  isGetMoreMsg.value = true
}
watch(() => [...store.state.wechat.messages], (value, oldValue) => {
  if (isGetMoreMsg.value) {
    isGetMoreMsg.value = false
    return
  }
  if (value.length > oldValue.length) {
    const el = document.getElementById("message")
    nextTick(() => {
      el.scrollTo(0, el.scrollHeight)
    })
  }
})
</script>
<template>
  <div class="message" id="message">
    <div class="moreMessages" v-if="lastCount>0">
      <el-button type="text" @click="getMoreMessages">查看更多消息>></el-button>
    </div>
    <div class="messageBox" v-for="item in messages">
      <p class="time">
        <span>{{ formatterTime(item.created_time) }}</span>
      </p>
      <div class="main" :class="{ self: item.sender_id!==currentId }">
        <img class="avatar" width="30" height="30" :src="item.sender_id!==currentId ? imageUrl : chatFriedHeadUri"/>
        <div class="text">{{ item.msg }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.message {
  padding: 10px 15px;
  overflow-y: scroll;

  .moreMessages {
    text-align: center;
    font-size: 12px;

  }

  .messageBox {
    margin-bottom: 15px;
  }

  .time {
    margin: 7px 0;
    text-align: center;

    > span {
      display: inline-block;
      padding: 0 18px;
      font-size: 12px;
      color: #fff;
      border-radius: 2px;
      background-color: #dcdcdc;
    }
  }

  .avatar {
    float: left;
    margin: 0 10px 0 0;
    border-radius: 3px;
  }

  .text {
    display: inline-block;
    position: relative;
    padding: 0 10px;
    max-width: ~'calc(100% - 40px)';
    min-height: 30px;
    line-height: 2.5;
    font-size: 12px;
    text-align: left;
    word-break: break-all;
    background-color: #fafafa;
    border-radius: 4px;

    &:before {
      content: " ";
      position: absolute;
      top: 9px;
      right: 100%;
      border: 6px solid transparent;
      border-right-color: #fafafa;
    }
  }

  .self {
    text-align: right;

    .avatar {
      float: right;
      margin: 0 0 0 10px;
    }

    .text {
      background-color: #b2e281;

      &:before {
        right: inherit;
        left: 100%;
        border-right-color: transparent;
        border-left-color: #b2e281;
      }
    }
  }
}
</style>
