<script setup>
import {computed, ref} from "vue";
import {Promotion} from "@element-plus/icons-vue";
import {useStore} from "vuex";
import {wsMsgType} from "../../utils/construct";


const store = useStore()

const content = ref("")
const selfId = computed(() => {
  return store.state.wechat.userInfo.uin
})
const receiverId = computed(() => {
  return store.state.wechat.chatUser.uin
})
const isGroup = computed(() => {
  return store.state.wechat.chatUser.isGroup
})
const sendMessage = () => {
  store.state.wechat.instruct.push({
    name: wsMsgType.chat,
    data: {
      msg: content.value,
      sender_id: selfId,
      receiver_id: receiverId,
      is_group: isGroup,
    }
  })
  content.value = ""
}

</script>

<template>
  <div class="text">
    <textarea v-model="content"></textarea>
    <el-button class="send" type="primary" @click="sendMessage">
      <el-icon size="50px" class="icon">
        <Promotion/>
      </el-icon>
    </el-button>


  </div>
</template>

<style lang="sass" scoped>
.text
  border-top: solid 1px #ddd
  display: flex
  justify-content: space-between

  textarea
    width: 90%
    height: 100%
    overflow-y: scroll
    font-family: "Micrsofot Yahei"

  .send
    text-align: center
    justify-content: center
    height: 100%
    width: 10%
    border: none

</style>
