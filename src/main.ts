import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import 'vuetify/styles';
import { vuetify } from './vuetify';
import { router } from './router';
import { pinia } from './pinia';

createApp(App).use(router).use(pinia).use(vuetify).mount('#app');
