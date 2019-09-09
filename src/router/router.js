import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

import Menu from '../components/Menu.vue'
import Tetris from '../components/Tetris.vue';
import Happy from '../components/Happy.vue';
import Greed from '../components/Greed.vue';

let routes=[
  {path:'/',component:Menu},
  {path:'/tetris',component:Tetris},
  {path:'/happy',component:Happy},
  {path:'/greed',component:Greed},
]
let router=new VueRouter({
  routes:routes
})
export default router;
