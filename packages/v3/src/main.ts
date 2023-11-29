import { createApp } from 'vue'
import router from './router'
import pinia from './views/master/store/index'
import App from './App.vue'
const app = createApp(App)
app.use(router) //注册路由
app.use(pinia)
app.mount('#app')
