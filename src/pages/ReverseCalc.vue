<script setup lang="ts">
import { computed, ref } from 'vue';
import IrdomSection from '../components/IrdomSection.vue';
import { Stipend, TAX } from '../constants/';

interface Result {
	sum: number;
	gas: number;
	pgas: number;
	gss: number;
	pgss: number;
	tax: number;
}

const emptyResult: Result = {
	sum: 0,
	gas: 0,
	pgas: 0,
	gss: 0,
	pgss: 0,
	tax: 0,
};

const flattenStipend = (options: typeof Stipend): Array<Array<number>> => {
	const convertedStipend = [];
	let property: keyof typeof Stipend;
	for (property in options) {
		let value: number[] =
			typeof options[property] === 'number' ? [options[property]] : Object.values(options[property]);
		value.push(0);
		convertedStipend.push(value);
	}
	return convertedStipend;
};

const getCombinations = (options: number[][]): number[][] => {
	const combinationLength = (arr: number[][]): number => {
		let length = 1;
		for (const elem of arr) {
			length *= elem.length;
		}
		return length;
	};
	const untaxedTotalCombinations: number = combinationLength(options);
	const tempResult: number[][] = [];

	let valuePeriod: number = 1;
	for (const stipendType in options) {
		const typeCombinations = options[stipendType].length;
		valuePeriod *= typeCombinations;
		for (let i: number = 0; i < untaxedTotalCombinations; i++) {
			const currValue = Math.floor(i / (untaxedTotalCombinations / valuePeriod)) % typeCombinations;
			if (tempResult[i] === undefined) {
				tempResult[i] = [];
			}
			tempResult[i].push(options[stipendType][currValue]);
		}
	}
	return tempResult;
};

const getTaxedCombinations = (options: number[][]): Result[] => {
	const results: Array<Result> = [];
	for (const elem of options) {
		const untaxedResult: Result = Object.assign({}, emptyResult);
		untaxedResult.gas = elem[0];
		untaxedResult.pgas = elem[1];
		untaxedResult.gss = elem[2];
		untaxedResult.pgss = elem[3];
		untaxedResult.sum = elem.reduce((a, b) => a + b);
		untaxedResult.tax = 0;

		const taxedResult = Object.assign({}, untaxedResult);
		taxedResult.sum = untaxedResult.sum * (1 - TAX);
		taxedResult.tax = -untaxedResult.sum * TAX;
		results.push(taxedResult);
		results.push(untaxedResult);
	}
	return results;
};

const combinations: Array<Result> = getTaxedCombinations(getCombinations(flattenStipend(Stipend)));
const inputSum = ref(0);

let result: Result = emptyResult;
const recount = computed(() => {
	result =
		combinations.find(o => o.sum <= Number(inputSum.value) + 1 && o.sum >= Number(inputSum.value) - 1) ??
		emptyResult;
	return result;
});
</script>

<template>
	<div class="container">
		<div class="rounded calc">
			<IrdomSection title="Введите полученную сумму">
				<v-text-field v-model="inputSum" label="Полученная сумма" @update:model-value="recount"></v-text-field>
				<!-- <p id="some">f</p> -->
				<v-divider />
			</IrdomSection>
			<div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">ГАС</v-sheet>
					<div id="gas" class="sum-plus">{{ recount['gas'] }}₽</div>
				</div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">ПГАС</v-sheet>
					<div id="pgas" class="sum-plus">{{ recount['pgas'] }}₽</div>
				</div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">ГСС</v-sheet>
					<div id="gss" class="sum-plus">{{ recount['gss'] }}₽</div>
				</div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">ПГСС</v-sheet>
					<div id="pgss" class="sum-plus">{{ recount['pgss'] }}₽</div>
				</div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">Профвзнос</v-sheet>
					<div id="tax" class="sum-minus">{{ recount['tax'] }}₽</div>
				</div>
			</div>
			<v-divider />
			<div class="your d-flex justify-space-between">
				<div class="result">Сумма:</div>
				<div id="result" class="stipend">{{ recount['sum'] }} ₽</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.pay {
	text-align: left;
	font-size: 25px;
}

.sum-plus {
	height: 54px;
	display: flex;
	align-items: center;
	font-size: 20px;
	background: green;
	color: white;
	border-radius: 999px;
	margin: 10px 0px 10px 0px;
	padding: 0px 30px;
	min-width: max(54px, fit-content);
	justify-content: center;
}

.sum-minus {
	height: 54px;
	display: flex;
	align-items: center;
	font-size: 20px;
	background: red;
	color: white;
	border-radius: 999px;
	padding: 0 30px;
	margin: 10px 0px 10px 0px;
	min-width: max(54px, fit-content);
	justify-content: center;
}

.stipend {
	height: 54px;
	display: flex;
	align-items: center;
	font-size: 40px;
	background: rgb(221, 221, 231);
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
</style>
