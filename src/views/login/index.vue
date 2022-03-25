<template>
  <div class="login-contain">
    <div class="login-form">
      <div class="login-title">{{ t('i18n.backend_system') }}</div>
      <el-form @submit.native.prevent :model="param" :rules="rules" ref="login_ref" label-width="0px"
               class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" :placeholder="t('i18n.pls_input_username_mobile')">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              :placeholder="t('i18n.pls_input_password')"
              v-model="param.password">
          </el-input>
        </el-form-item>
        <el-form-item class="login-btn">
          <el-button round type="primary" @click="submitForm" :loading="loading">
            {{ t('i18n.login') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import {ref, reactive, onMounted} from 'vue';
import {useStore} from 'vuex'
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';

import {login} from '../../api/login';
import key2Path from '../../api/route';
import {setToken, setUserInfo} from '../../utils/auth';
import {savePermissionMenus, setPermissions} from '../../utils/permission';
import type {FormInstance} from 'element-plus'


export default {
  name: 'Login',
  setup() {
    const store = useStore();

    const param = reactive({
      username: import.meta.env.VITE_APP_USERNAME,
      password: import.meta.env.VITE_APP_PASSWORD
    });

    const login_ref = ref<FormInstance>()
    const loading = ref(false);
    const t = useI18n().t;
    const router = useRouter()
    const rules = {
      username: [
        {
          required: true,
          message: t('i18n.pls_input_username'),
          trigger: 'blur'
        }
      ],
      password: [
        {
          required: true,
          message: t('i18n.pls_input_password'),
          trigger: 'blur'
        }
      ]
    };
    let keys_permission: any[] = [];
    let menus: any[] = [];
    const submitForm = () => {
      login_ref.value.validate((valid: boolean) => {
        if (valid) {
          loading.value = true
          login(param)
              .then((res) => {
                setUserInfo({
                  username: res.data.username,
                  avatar: res.data.avatar,
                })
                setToken(res.data.authorization);
                menus = [];
                setPath(res.data.list, menus);
                savePermissionMenus(menus);
                setPermissions(res.data.keys);
                store.commit("clearTags");
                router.push('/');

              })
              .catch(() => {
              }).finally(
              () => {
                loading.value = false
              }
          );
        }
      })
    }
    const setPath = (children: any[], items: any[]) => {
      children.forEach((child) => {
        keys_permission = keys_permission.concat(child.key);
        const path = key2Path[child.key];
        let item = {
          icon: child.icon,
          id: child.id,
          index: key2Path[child.key]
              ? key2Path[child.key]
              : child.id.toString(),
          title: child.name,
          path: path,
          children: []
        };
        items.push(item);
        setPath(child.children, item.children);
      });
    };
    onMounted(() => {
      window.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
          submitForm()
        }
      })
    })
    return {
      t,

      loading,
      login_ref,
      rules,
      param,
      keys_permission,
      menus,

      submitForm,
      setPath

    };

  }
};
</script>

<style scoped lang="sass">


.login-contain
  position: relative
  width: 100%
  height: 100%
  background:
    image: url(../../assets/img/login-bg.jpg)
    size: 100%


  .login-title
    width: 100%
    line-height: 50px
    text-align: center
    font:
      size: 20px
    color: #fff
    border:
      bottom: 1px solid #ddd


  .login-form
    position: absolute
    left: 50%
    top: 50%
    width: 23%
    margin:
      top: -190px
      left: -175px
    border-radius: 50px
    background: rgba(255, 255, 255, 0.3)
    overflow: hidden


  .ms-content
    padding: 30px 30px


  .login-btn
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

</style>
