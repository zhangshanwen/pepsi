<template>
  <div id="terminal"></div>
  <div>
    <button @click="testEnv()">测试</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed, ref, reactive, nextTick, onMounted, onUnmounted, watch} from "vue"
import {Terminal} from 'xterm'
import "xterm/css/xterm.css";
import {AttachAddon} from 'xterm-addon-attach';
import {FitAddon} from 'xterm-addon-fit'
import {useRoute} from "vue-router";
import {useStore} from 'vuex'
import {getToken} from '../../utils/auth';
import {jsondecode} from "../../utils/base64";

export default defineComponent({
  name: 'Term',
  setup() {

    let ws: WebSocket;
    let term: Terminal;
    let setEnv = false
    const route = useRoute();
    const newWs = () => {
      const socketURL = `ws://${import.meta.env.VITE_APP_SOCKET_HOST}/backend/v1/host/socket/${getToken()}/${route.query.id}`;
      ws = new WebSocket(socketURL);
      const attachAddon = new AttachAddon(ws);
      term.loadAddon(attachAddon)
      const fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      fitAddon.fit()
      ws.addEventListener("close", () => {
            if (!setEnv) {
              window.close()
            }
            setEnv = false
          },
          false);
    }
    onMounted(() => {
      term = new Terminal({});
      const tid = document.getElementById('terminal')
      if (tid) {
        term.open(tid);
      }
      newWs()
    })
    const testEnv = () => {
      setEnv = true;
      ws.send(JSON.stringify({
        cmd: "setenv",
        data: {
          a: 1,
          b: 2
        }
      }))

      newWs()

    }
    onUnmounted(() => {
      if (ws) {
        ws.close()
      }
      if (term) {
        term.dispose()
      }
    })

    return {
      testEnv
    }
  }
});


</script>

<style scoped lang="sass">

.contain
  background: #fff
  padding: 10px
  margin-bottom: 20px

</style>



