<template>
  <div id="terminal"></div>
</template>

<script lang="ts">
import {defineComponent, computed, ref, reactive, nextTick, onMounted, onUnmounted} from "vue"
import {Terminal} from 'xterm'
import "xterm/css/xterm.css";
import {AttachAddon} from 'xterm-addon-attach';
import {FitAddon} from 'xterm-addon-fit'

import {useRoute} from "vue-router";
import {getToken} from '../../utils/auth';

export default defineComponent({
  name: 'Term',
  setup() {

    let ws: WebSocket;
    let term: Terminal;
    const route = useRoute();
    onMounted(() => {
      term = new Terminal({});
      const tid = document.getElementById('terminal')
      if (tid) {
        term.open(tid);
      }
      const socketURL = `ws://${import.meta.env.VITE_APP_SOCKET_HOST}/backend/v1/host/socket/${getToken()}/${route.query.id}`;
      ws = new WebSocket(socketURL);
      const attachAddon = new AttachAddon(ws);
      term.loadAddon(attachAddon)
      const fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      fitAddon.fit()
      ws.addEventListener("close", function () {
        window.close()
      }, false);

    })
    onUnmounted(() => {
      if (ws) {
        ws.close()
      }
      if (term) {
        term.dispose()
      }
    })

    return {}
  }
});


</script>

<style scoped lang="sass">

.contain
  background: #fff
  padding: 10px
  margin-bottom: 20px

</style>



