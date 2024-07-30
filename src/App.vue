<script setup lang="ts"></script>

<template>
	<v-app>
		<main class="main">
			<v-tabs bg-color="rgb(0, 1, 76)" grow="true">
				<v-tab value="one"> <RouterLink to="/calc">Рассчитать выплату</RouterLink> </v-tab>
				<v-tab value="two"> <RouterLink to="/reverse-calc">Узнать составляющие выплаты</RouterLink> </v-tab>
			</v-tabs>
			<RouterView />
		</main>
	</v-app>
</template>

<style scoped>
.main {
	width: min(900px, 100%);
	margin: 0 auto;
}

a {
	outline: none;
	text-decoration: none;
	padding: 2px 1px 0;
	color: white;
}
</style>
