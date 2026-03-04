<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { mdiInformationOutline } from '@mdi/js';
import IrdomSection from '../components/IrdomSection.vue';
import { PAYMENTS, TAX, TipFromSum } from '../constants/';
import { lz } from '../utils';

interface Result {
	sum: number;
	gas: number;
	pgas: number;
	gss: number;
	pgss: number;
	tax: number;
}

const convertedStipend = {
	gas: [0],
	pgas: [0],
	gss: [0],
	pgss: [0],
};

const emptyResult: Result = {
	sum: 0,
	gas: 0,
	pgas: 0,
	gss: 0,
	pgss: 0,
	tax: 0,
};

const { width } = useDisplay();
const isNarrow = computed(() => width.value < 800);

const flattenStipend = (options: typeof PAYMENTS): typeof convertedStipend => {
	const newOptions: typeof convertedStipend = Object.assign({}, convertedStipend);
	let property: keyof typeof PAYMENTS;
	for (property in options) {
		const value: number[] =
			typeof options[property] === 'number'
				? [options[property]]
				: Object.values(options[property]);
		value.push(0);
		newOptions[property] = value;
	}
	return newOptions;
};

const getCombinations = (options: typeof convertedStipend): Result[] => {
	const combinationLength = (obj: typeof convertedStipend): number => {
		let length = 1;
		let property: keyof typeof convertedStipend;
		for (property in obj) {
			length *= obj[property].length;
		}
		return length;
	};

	const untaxedTotalCombinations: number = combinationLength(options);
	const tempResult: Result[] = [];
	let valuePeriod: number = 1;
	let stipendType: keyof typeof options;
	for (stipendType in options) {
		const typeCombinations = options[stipendType].length;
		valuePeriod *= typeCombinations;
		for (let i: number = 0; i < untaxedTotalCombinations; i++) {
			const currValue = Math.floor(i / (untaxedTotalCombinations / valuePeriod)) % typeCombinations;
			if (tempResult[i] === undefined) {
				tempResult[i] = Object.assign({}, emptyResult);
			}
			tempResult[i][stipendType] = options[stipendType][currValue];
		}
	}

	return tempResult;
};

const getSumAndTax = (options: Result[]): Result[] => {
	const results: Result[] = [];
	const resultSum = (obj: Result): number => {
		let property: keyof Result;
		let sum = 0;
		for (property in obj) {
			sum += obj[property];
		}
		return sum;
	};

	for (const elem of options) {
		const untaxedResult: Result = Object.assign({}, elem);
		untaxedResult.sum = resultSum(elem);
		untaxedResult.tax = 0;

		const taxedResult = Object.assign({}, untaxedResult);
		taxedResult.sum = untaxedResult.sum * (1 - TAX);
		taxedResult.tax = -untaxedResult.sum * TAX;
		results.push(taxedResult);
		results.push(untaxedResult);
	}
	return results;
};

const combinations: Result[] = getSumAndTax(getCombinations(flattenStipend(PAYMENTS)));
const inputSum = ref<string>('');

function formatInput(input: string) {
	if (input.length === 0) {
		return true;
	} else if (/^[0-9]+[\\.,]?[0-9]{0,2}$/.test(input)) {
		return true;
	} else {
		return 'Недопустимые символы';
	}
}

const parsedSum = computed(() => {
	const s = inputSum.value.trim().replace(',', '.');
	if (!s) return null;
	const n = Number(s);
	return Number.isFinite(n) ? n : null;
});

const found = computed(() => {
	const target = parsedSum.value;
	if (target === null) return false;
	return combinations.some(o => Math.abs(o.sum - target) <= 1);
});

const recount = computed(() => {
	const target = parsedSum.value;
	if (target === null) return emptyResult;
	return combinations.find(o => Math.abs(o.sum - target) <= 1) ?? emptyResult;
});

const hasInput = computed(() => inputSum.value.trim().length > 0);

const formattedStipend = (stipend: number): string => {
	let thousands: number;
	let rest: number;
	let float: number;
	if (stipend > 0) {
		thousands = Math.floor(stipend / 1000);
		float = Math.round((stipend % 1) * 100);
		rest = Math.floor(stipend % 1000);
	} else {
		thousands = Math.ceil(stipend / 1000);
		rest = Math.ceil(stipend % 1000);
		float = Math.round((stipend % 1) * 100);
	}
	if (thousands) return `${thousands} ${lz(rest, 3)},${lz(float, 2)} ₽`;
	return `${rest},${lz(float, 2)} ₽`;
};

type StipendField = 'gas' | 'pgas' | 'gss' | 'pgss';

const getTooltipText = (field: StipendField): string => {
	if (!hasInput.value || !found.value) return '';
	const value = recount.value[field];
	const tips = TipFromSum[field] as Record<number, string>;
	return tips[value] ?? '';
};
</script>

<template>
	<div class="container">
		<div class="rounded calc">
			<IrdomSection class="mb-0" title="Введите полученную сумму">
				<v-text-field v-model="inputSum" label="Полученная сумма" :rules="[formatInput]" />
				<v-divider class="ma-0" />
			</IrdomSection>

			<div class="ma-0">
				<!-- ГАС -->
				<div class="d-flex justify-space-between align-center">
					<div class="pay">ГАС</div>
					<div class="right-group">
						<div id="gas" class="sum-plus bg-primary">{{ formattedStipend(recount['gas']) }}</div>
						<span v-show="hasInput && found && getTooltipText('gas')">
							<v-tooltip :text="getTooltipText('gas')" location="end" content-class="tooltip-large">
								<template #activator="{ props }">
									<v-btn
										v-bind="props"
										:icon="mdiInformationOutline"
										variant="tonal"
										size="x-small"
										color="grey"
										style="font-size: medium"
									/>
								</template>
							</v-tooltip>
						</span>
					</div>
				</div>

				<!-- ПГАС -->
				<div class="d-flex justify-space-between align-center">
					<div class="pay">ПГАС</div>
					<div class="right-group">
						<div id="pgas" class="sum-plus bg-primary">{{ formattedStipend(recount['pgas']) }}</div>
						<span v-show="getTooltipText('pgas')">
							<v-tooltip
								:text="getTooltipText('pgas')"
								location="end"
								content-class="tooltip-large"
							>
								<template #activator="{ props }">
									<v-btn
										v-bind="props"
										:icon="mdiInformationOutline"
										variant="tonal"
										size="x-small"
										color="grey"
										style="font-size: medium"
									/>
								</template>
							</v-tooltip>
						</span>
					</div>
				</div>

				<!-- ГСС -->
				<div class="d-flex justify-space-between align-center">
					<div class="pay">ГСС</div>
					<div class="right-group">
						<div id="gss" class="sum-plus bg-primary">{{ formattedStipend(recount['gss']) }}</div>
						<span v-show="hasInput && found && getTooltipText('gss')">
							<v-tooltip
								:text="getTooltipText('gss')"
								location="start"
								content-class="tooltip-large"
							>
								<template #activator="{ props }">
									<v-btn
										v-bind="props"
										:icon="mdiInformationOutline"
										variant="tonal"
										size="x-small"
										color="grey"
										style="font-size: medium"
									/>
								</template>
							</v-tooltip>
						</span>
					</div>
				</div>

				<!-- ПГСС -->
				<div class="d-flex justify-space-between align-center">
					<div class="pay">ПГСС</div>
					<div class="right-group">
						<div id="pgss" class="sum-plus bg-primary">{{ formattedStipend(recount['pgss']) }}</div>
						<span v-show="hasInput && found && getTooltipText('pgss')">
							<v-tooltip
								:text="getTooltipText('pgss')"
								location="start"
								content-class="tooltip-large"
							>
								<template #activator="{ props }">
									<v-btn
										v-bind="props"
										:icon="mdiInformationOutline"
										variant="tonal"
										size="x-small"
										color="grey"
										style="font-size: medium"
									/>
								</template>
							</v-tooltip>
						</span>
					</div>
				</div>

				<!-- Профвзнос -->
				<div class="d-flex justify-space-between align-center">
					<div class="pay">Профвзнос</div>
					<div class="right-group">
						<div id="tax" class="sum-plus bg-primary">{{ formattedStipend(recount['tax']) }}</div>
						<span v-show="hasInput && found && recount['tax'] !== 0">
							<v-tooltip
								:text="TipFromSum['proffee']"
								location="start"
								content-class="tooltip-large"
							>
								<template #activator="{ props }">
									<v-btn
										v-bind="props"
										:icon="mdiInformationOutline"
										variant="tonal"
										size="x-small"
										color="grey"
										style="font-size: medium"
									/>
								</template>
							</v-tooltip>
						</span>
					</div>
				</div>
			</div>

			<v-divider />

			<!-- Итоговая строка -->
			<div class="your d-flex justify-space-between">
				<div class="text-h4">Сумма:</div>
				<div class="right-group">
					<div
						class="stipend"
						:class="[found ? 'bg-primary' : 'bg-secondary', isNarrow ? 'text-h5' : 'text-h4']"
					>
						{{ found ? formattedStipend(recount['sum']) : hasInput ? 'Не найдено' : '0,00 ₽' }}
					</div>
					<span v-show="hasInput && !found">
						<v-tooltip
							text="Не найден такой вариант суммы"
							location="start"
							content-class="tooltip-large"
						>
							<template #activator="{ props }">
								<v-btn
									v-bind="props"
									:icon="mdiInformationOutline"
									variant="tonal"
									size="x-small"
									color="grey"
									style="font-size: medium"
								/>
							</template>
						</v-tooltip>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.pay {
	text-align: left;
	vertical-align: bottom;
	font-size: 25px;
	margin: 13px 0 10px;
}

.right-group {
	display: flex;
	align-items: center;
	gap: 8px;
}

.sum-plus {
	height: 54px;
	display: flex;
	align-items: center;
	font-size: 20px;
	color: white;
	border-radius: 999px;
	margin: 10px 0;
	padding: 0 30px;
	min-width: max(54px, fit-content);
	justify-content: center;
}

.stipend {
	height: 54px;
	display: flex;
	align-items: center;
	font-size: 35px;
	color: white;
	border-radius: 999px;
	margin-top: 10px;
	padding: 0 16px;
	min-width: max(54px, fit-content);
	justify-content: center;
}

.your {
	font-size: 30px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
	align-items: center;
	gap: 8px;
}

.container {
	position: relative;
	height: 100vh;
	overflow: hidden;
}

.calc {
	overflow-y: auto;
	height: 100%;
	padding: 24px 24px 112px;
}

.tooltip-large {
	font-size: 1rem !important;
}
</style>
