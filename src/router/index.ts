import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [{ path: '/', component: () => import('../pages/PageMain.vue') }];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
