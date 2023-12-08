import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'virtual:svg-icons-register'
import SvgIcon from './components/SvgIcon/index.vue'
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.component('SvgIcon', SvgIcon)

app.use(router) //注册路由

app.mount('#app')
