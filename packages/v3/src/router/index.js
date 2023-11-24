import { createRouter,createWebHashHistory } from "vue-router";
import SelectoGroup from '../views/Selecto-group.vue'
import SelectoMany from '../views/Selecto-many.vue'
import SelectoSelectMany from '../views/Selecto-select-many.vue'
import SelectoSelect from '../views/Selecto-select.vue'

const routes = [
  {
    path:'/SelectoGroup',
    component:SelectoGroup
  },
  {
    path:'/SelectoMany',
    component:SelectoMany
  },
  {
    path:'/SelectoSelectMany',
    component:SelectoSelectMany
  },
  {
    path:'/SelectoSelect',
    component:SelectoSelect
  },
  {
    path:'/',
    redirect:'/SelectoGroup'
  }
]

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

export default router
