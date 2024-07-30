import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
	{ path: '/', redirect: '/calc' },
	{ path: '/calc', component: () => import('../pages/PageMain.vue') },
	{ path: '/reverse-calc', component: () => import('../pages/ReverseCalc.vue')}
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
