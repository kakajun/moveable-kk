import { createRouter,createWebHashHistory } from "vue-router";
import SelectoGroup from '../views/Selecto-group.vue'
import SelectoMany from '../views/Selecto-many.vue'
import master from '../views/EditMiddle/ContentCanvas.vue'
import SelectoSelect from '../views/Selecto-select.vue'
import SelectoManySelect from   '../views/Selecto-many-select.vue'
const routes = [
  {
    path:'/',
    redirect:'/master'
  },
  {
    path:'/master',
    component:master
  },
  {
    path:'/SelectoGroup',
    component:SelectoGroup
  },
  {
    path:'/SelectoMany',
    component:SelectoMany
  },
  {
    path:'/Selecto-many-select',
    component:SelectoManySelect
  },
  {
    path:'/SelectoSelect',
    component:SelectoSelect
  },
  {
    path:'/VueInfiniteViewer',
    component:()=>import('../views/VueInfiniteViewer.vue')
  },
  {
    path:'/context-menu',
    component:()=>import('../views/context-menu.vue')
  },

]

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

export default router
