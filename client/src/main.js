import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import GlobalPage from './views/GlobalPage.vue'
import {createRouter, createWebHistory} from 'vue-router'
import PersonalPage from './views/PersonalPage.vue'


const routes = [
  { path: '/', component: GlobalPage },
  { path: '/personal', component: PersonalPage },
]

const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

const app = createApp(App)

app.component('v-select', vSelect)
app.use(createPinia())
app.use(router)
app.mount('#app')
