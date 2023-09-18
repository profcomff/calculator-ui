<script setup lang="ts"></script>

<template>
	<v-app>
		<main class="main">
			<RouterView />
		</main>
	</v-app>
</template>

<style scoped>
.main {
	width: min(900px, 100%);
	margin: 0 auto;
}
</style>
