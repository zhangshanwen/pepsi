# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's `.vue` type support plugin by running `Volar: Switch TS Plugin on/off` from VSCode command palette.


node node_modules/esbuild/install.js 

### 后台管理系统

- [后端api(golang)](https://github.com/zhangshanwen/shard)

- 规范
    - 1.命名 
        - 变量以及i18n key 采用蛇形命名)(下划线分隔 例如:post_user)
        - 方法使用驼峰(首字母小写,例如:editUser)
        - js文件使用驼峰(首字母小写,例如:getDate)
        - vue使用驼峰(首字母大写写,例如:User)
        - sass
            - class 蛇形命名(横杠分隔 例如:login-contain)
```
正式环境运行
cp .env.example .env.production
本地运行
cp .env.example .env.development

运行:
npm install 
npm run serve
打包:
npm run build
```
```
目录树
.
├── README.md
├── babel.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
├── src
│   ├── App.vue
│   ├── api                     
│   ├── assets
│   │   ├── css
│   │   ├── img
│   ├── components
│   │   ├── common
│   │   │   ├── Bread.vue
│   │   │   ├── Header.vue
│   │   │   ├── Home.vue
│   │   │   ├── Sidebar.vue     // 侧边栏菜单
│   │   │   ├── Tags.vue
│   │   │   ├── TreeMenu.vue
│   │   │   ├── bus.js
│   │   │   ├── directives.js
│   │   │   └── i18n           // 中英文
│   │   └── page               // 页面
│   ├── main.js
│   ├── router
│   │   └── index.js
│   ├── store
│   │   └── index.js
│   └── utils
│       └── request.js
└── vue.config.js

```
- 权限页面
    - 设计
        - 三层设计,上层为侧边栏目录为两层接口，最下层为按钮级
        - 权限采用唯一key 标识, 统一通过has_permission 方法获取是否有权限

## 功能
```
- 登录 / 注销

- 权限验证
  - 页面权限
  - 指令权限
  - 权限配置
- 文件
  - 上传文件
  - 运行文件
```

#### 项目截图
- 登录界面
 ![image](https://user-images.githubusercontent.com/36833420/137087169-31816ccf-d091-4584-9587-5f594643bdca.png)
- 角色管理
 ![image](https://user-images.githubusercontent.com/36833420/137087252-339e6600-4f19-4bb5-8768-5cbf3898d7f2.png)
- 管理员管理
 ![image](https://user-images.githubusercontent.com/36833420/137087324-fbaadb1a-4d97-425d-aaf5-0378ef9b7f46.png)
- 变更权限
 ![image](https://user-images.githubusercontent.com/36833420/137087386-c8feb63a-2569-41c3-b2fd-f4dfcec63a30.png)
- 权限管理
 ![image](https://user-images.githubusercontent.com/36833420/137087439-e3c932ae-8991-4fbf-bca0-035e0593bbcc.png)
- 文件管理
 ![image](https://user-images.githubusercontent.com/36833420/160149631-dd1d399a-f5a7-4fd4-b041-8b7864740da6.png)
  
## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari-ios/safari-ios_48x48.png" alt="iOS Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>iOS Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/samsung-internet/samsung-internet_48x48.png" alt="Samsung" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Samsung | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions
