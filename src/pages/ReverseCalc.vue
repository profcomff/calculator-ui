<script setup lang="ts">
import { ref } from 'vue';
import IrdomSection from '../components/IrdomSection.vue';

function getCombinations(options, optionIndex, results, current) {
	var allKeys = Object.keys(options);
	const optionKey = allKeys[optionIndex];

	const vals = options[optionKey];

	for (var i = 0; i < vals.length; i++) {
		current[optionKey] = vals[i];

		if (optionIndex + 1 < allKeys.length) {
			getCombinations(options, optionIndex + 1, results, current);
		} else {
			var res = JSON.parse(JSON.stringify(current));
			results.push(res);
		}
	}

	return results;
}

const sumValues = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

const Stipend = {
	'gas': [0, 2941, 3382, 3367],
	'pgas': [0, 13685],
	'gss': [0, 4413],
	'pgss': [0, 14364],
};

var tempResults = getCombinations(Stipend, 0, [], {});
var sum = 0;
var tax = 0;

const results = [];

for (const tempRes of tempResults) {
	sum = sumValues(tempRes);
	tax = 0.04 * sum;
	const res = Object.assign({}, tempRes);
	res['sum'] = sum;
	res['tax'] = 0;
	results.push(res);
	const resTax = Object.assign({}, tempRes);
	resTax['sum'] = sum * 0.96;
	resTax['tax'] = -tax;
	results.push(resTax);
}

console.log(results);

const inputSum = ref(0);

const recount = () => {
	const obj = results.find(o => o.sum === Number(inputSum.value));
	console.log(obj);
	if (obj !== undefined) {
		document.getElementById('gas').textContent = obj['gas'] + ' ₽';
		document.getElementById('pgas').textContent = obj['pgas'] + ' ₽';
		document.getElementById('gss').textContent = obj['gss'] + ' ₽';
		document.getElementById('pgss').textContent = obj['pgss'] + ' ₽';
		document.getElementById('tax').textContent = obj['tax'] + ' ₽';
		document.getElementById('result').textContent = obj['sum'] + ' ₽';
	} else {
		document.getElementById('result').textContent = 'Нет такого варианта';
	}
};
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
					<div id="gas" class="sum-plus">0 ₽</div>
				</div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">ПГАС</v-sheet>
					<div id="pgas" class="sum-plus">0 ₽</div>
				</div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">ГСС</v-sheet>
					<div id="gss" class="sum-plus">0 ₽</div>
				</div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">ПГСС</v-sheet>
					<div id="pgss" class="sum-plus">0 ₽</div>
				</div>
				<div class="d-flex justify-space-between">
					<v-sheet class="pay">Профвзнос</v-sheet>
					<div id="tax" class="sum-minus">-0 ₽</div>
				</div>
			</div>
			<v-divider />
			<div class="your d-flex justify-space-between">
				<div class="result">Сумма:</div>
				<div id="result" class="stipend">0 ₽</div>
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
