<script setup lang="ts">
defineProps<{
	title: string;
}>();
</script>

<template>
	<section class="section">
		<h2 class="h2">{{ title }}</h2>
		<slot />
	</section>
</template>

<style scoped>
.h2 {
	margin-bottom: 20px;
	font-size: 20px;
}

.section {
	margin-bottom: 35px;
}
</style>
