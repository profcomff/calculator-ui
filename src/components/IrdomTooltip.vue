<script setup lang="ts">
defineProps<{ text: string }>();
</script>

<template>
	<v-tooltip :text="text" open-on-click open-on-focus>
		<template #activator="{ props }">
			<v-btn v-bind="props" variant="tonal" icon="" size="x-small" style="font-size: medium">
				?
			</v-btn>
		</template>
		<slot />
	</v-tooltip>
</template>
