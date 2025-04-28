<script setup lang="ts">
import { computed, ref } from 'vue';
import IrdomSection from '../components/IrdomSection.vue';
import { PAYMENTS, TAX, TipFromSum } from '../constants/';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiInformationOutline } from '@mdi/js';
import { VTooltip, VBtn} from 'vuetify/components';
//import '@mdi/font/css/materialdesignicons.css';
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

const screenWidth = window.innerWidth;

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

let result: Result = emptyResult;
const recount = computed(() => {
	const tempInput = inputSum.value.replace(',', '.');
	result =
		combinations.find(o => o.sum <= Number(tempInput) + 1 && o.sum >= Number(tempInput) - 1) ??
		emptyResult;
	return result;
});

const found = computed(() => {
	const foundResult = combinations.find(
		o => o.sum <= Number(inputSum.value) + 1 && o.sum >= Number(inputSum.value) - 1
	);
	if (foundResult) {
		return true;
	} else {
		return false;
	}
});

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
const infoIconPath = mdiInformationOutline;

</script>

<template>
	<div class="container">
		<div class="rounded calc">
			<IrdomSection class="mb-0" title="Введите полученную сумму">
				<v-text-field v-model="inputSum" label="Полученная сумма" :rules="[formatInput]" />
				<v-divider class="ma-0" />
			</IrdomSection>
			<div class="ma-0">
				<div class="d-flex justify-space-between">
					<div class="pay">ГАС</div>
					<div class="d-flex">
						<div id="gas" class="sum-plus bg-primary">{{ formattedStipend(recount['gas']) }}</div>
						<v-tooltip :text="TipFromSum['gas'][recount['gas']]"> 
							<template #activator="{ props }">
								<v-btn icon variant="tonal" v-bind="props" class="mt-3">
									<svg-icon type="mdi" :path="infoIconPath" />
								</v-btn>
							</template>
						</v-tooltip>
					</div>	
				</div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">ПГАС</v-sheet>
					<div class="d-flex">
						<div id="pgas" class="sum-plus bg-primary">{{ formattedStipend(recount['pgas']) }}</div>
						<v-tooltip :text="TipFromSum['pgas'][recount['pgas']]"> 
							<template #activator="{ props }">
								<v-btn icon variant="tonal" v-bind="props" class="mt-3">
									<svg-icon type="mdi" :path="infoIconPath"/> 
								</v-btn>
							</template>
						</v-tooltip>
					</div>	
				</div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">ГСС</v-sheet>
					<div class="d-flex">
						<div id="gss" class="sum-plus bg-primary">{{ formattedStipend(recount['gss']) }}</div>
						<v-tooltip :text="TipFromSum['gss'][recount['gss']]"> 
							<template #activator="{ props }">
								<v-btn icon variant="tonal" v-bind="props" class="mt-3">
									<svg-icon type="mdi" :path="infoIconPath"/>
								</v-btn>
							</template>
						</v-tooltip>
				    </div>		
				</div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">ПГСС</v-sheet>
					<div class="d-flex">
						<div id="pgss" class="sum-plus bg-primary">{{ formattedStipend(recount['pgss']) }}</div>
						<v-tooltip :text="TipFromSum['pgss'][recount['pgss']]"> 
							<template #activator="{ props }">
								<v-btn icon variant="tonal" v-bind="props" class="mt-3">
									<svg-icon type="mdi" :path="infoIconPath"/> 
								</v-btn>
							</template>
						</v-tooltip>
					</div>	
				</div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">Профвзнос</v-sheet>
					<div id="tax" class="sum-plus bg-primary">{{ formattedStipend(recount['tax']) }}</div>
				</div>
			</div>
			<v-divider />
			<div class="your d-flex justify-space-between">
				<div class="text-h4">Сумма:</div>
				<div class="stipend bg-secondary" :class="screenWidth < 800 ? 'text-h5' : 'text-h4'">
					{{ found ? formattedStipend(recount['sum']) : 'Не найдено' }}
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

.sum-plus {
	height: 54px;
	display: flex;
	align-items: center;
	font-size: 20px;
	background: green;
	color: white;
	border-radius: 999px;
	margin: 10px 10px;
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
</style>
