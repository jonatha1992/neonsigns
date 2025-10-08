import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './styles/global.scss'
import { useCartStore } from './stores/cart'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inicializar stores después de montar Pinia
app.mount('#app')

// Cargar datos persistidos del carrito
const cartStore = useCartStore()
cartStore.loadFromLocalStorage()