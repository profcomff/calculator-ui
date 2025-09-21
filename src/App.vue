<script setup lang="ts">
import { ref } from 'vue';
import { router } from './router/index';

const currentTab = ref<'calc' | 'reverse-calc'>('calc');

const onChangeTab = () => {
	router.push(`/${currentTab.value}`);
};
</script>

<template>
	<v-app>
		<main class="main">
			<v-tabs
				v-model="currentTab"
				bg-color="primary"
				color="white"
				grow
				@update:model-value="onChangeTab"
			>
				<v-tab value="calc"> Рассчитать выплату </v-tab>
				<v-tab value="reverse-calc"> Узнать составляющие выплаты </v-tab>
			</v-tabs>
			<RouterView />
		</main>
	</v-app>
</template>

<style scoped>
.main {
	width: min(900px, 100%);
	min-height: 200vh;
	margin: auto;
	position: fixed;
	align-self: center;
}
</style>
