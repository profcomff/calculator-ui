<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import IrdomSection from '../components/IrdomSection.vue';
import { Stipend, TAX } from '../constants';
import IrdomTooltip from '../components/IrdomTooltip.vue';

const lz = (number: number, digits: number) => `${'0'.repeat(digits)}${number}`.slice(-digits);

interface Data {
	course?: string;
	member?: boolean;
	retake?: boolean;
	marks: number[];
	pgas?: boolean;
	gss?: boolean;
}

const data = reactive<Data>({
	marks: [],
});

const junior = computed(() => data.course === '1' || data.course === '2');
const isNomarksCouse = computed(() => data.course === '1' || data.course === '1М');

const nomarks = ref(false);
const nomarksHandler = (val: boolean) => {
	if (val) {
		data.marks = [];
		data.retake = false;
	} else {
		data.retake = undefined;
	}
};

const allDef = computed(() => {
	const every = ['course', 'member', 'retake', 'gss'].every(key => data[key as keyof Data] !== undefined);
	const pgas = !gasCondition.value || data.pgas !== undefined;
	const marks = nomarks.value || data.marks.length;
	return every && pgas && marks;
});

const gasCondition = computed(() => data.retake === false && !data.marks.includes(3));

const stipend = computed(() => {
	let sum = 0;

	const pgasCondition = gasCondition.value && data.pgas === true;
	const gssCondition = data.gss === true;
	const pgssCondition = gssCondition && junior.value && data.marks.length && !data.marks.includes(3);

	if (gasCondition.value) {
		if (!data.marks.length) sum += Stipend.gas.miss;
		else if (data.marks.includes(4) && data.marks.includes(5)) sum += Stipend.gas.with4and5;
		else if (data.marks.includes(4)) sum += Stipend.gas.only4;
		else if (data.marks.includes(5)) sum += Stipend.gas.only5;
	}

	if (pgasCondition) sum += Stipend.pgas;

	if (gssCondition) sum += Stipend.gss;

	if (pgssCondition) sum += Stipend.pgss;

	if (data.member) sum *= 1 - TAX;

	return sum;
});

const formattedStipend = computed(() => {
	const thousands = Math.floor(stipend.value / 1000);
	const rest = Math.floor(stipend.value % 1000);
	const float = Math.round((stipend.value % 1) * 100);

	if (thousands) return `${thousands} ${lz(rest, 3)},${lz(float, 2)} ₽`;
	return `${rest},${lz(float, 2)} ₽`;
});

const updateCourseHandler = () => {
	if (!isNomarksCouse.value) {
		nomarks.value = false;
	}
};

watch(gasCondition, val => {
	if (val) {
		data.pgas = undefined;
	} else {
		data.pgas = false;
	}
});
</script>

<template>
	<div class="container">
		<div class="rounded calc">
			<IrdomSection title="Курс обучения">
				<v-btn-toggle v-model="data.course" class="course" mandatory @update:model-value="updateCourseHandler">
					<v-btn value="1" style="height: 48px">1</v-btn>
					<v-btn value="2" style="height: 48px">2</v-btn>
					<v-btn value="3" style="height: 48px">3</v-btn>
					<v-btn value="4" style="height: 48px">4</v-btn>
					<v-btn value="5" style="height: 48px">5</v-btn>
					<v-btn value="6" style="height: 48px">6</v-btn>
					<v-btn value="1М" style="height: 48px">1М</v-btn>
					<v-btn value="2М" style="height: 48px">2М</v-btn>
				</v-btn-toggle>
			</IrdomSection>

			<IrdomSection title="Оценки за последнюю сессию">
				<v-btn-toggle v-model="data.marks" multiple divided :disabled="nomarks">
					<v-btn :value="3">3</v-btn>
					<v-btn :value="4">4</v-btn>
					<v-btn :value="5">5</v-btn>
				</v-btn-toggle>
				<v-checkbox
					v-if="isNomarksCouse"
					v-model="nomarks"
					label="Оценок нет"
					hide-details="auto"
					style="margin-bottom: -23px"
					@update:model-value="nomarksHandler"
				></v-checkbox>
			</IrdomSection>

			<IrdomSection v-if="!nomarks" title="Пересдачи за последнюю сессию">
				<v-btn-toggle v-model="data.retake" mandatory divided>
					<v-btn :value="true">Были</v-btn>
					<v-btn :value="false">Не были</v-btn>
				</v-btn-toggle>
			</IrdomSection>

			<IrdomSection v-if="gasCondition" title="ПГАС">
				<v-btn-toggle v-model="data.pgas" mandatory divided>
					<v-btn :value="true">Получаю</v-btn>
					<v-btn :value="false">Не получаю</v-btn>
				</v-btn-toggle>
			</IrdomSection>

			<IrdomSection title="ГСС">
				<v-btn-toggle v-model="data.gss" mandatory divided>
					<v-btn :value="true">Получаю</v-btn>
					<v-btn :value="false">Не получаю</v-btn>
				</v-btn-toggle>
			</IrdomSection>

			<IrdomSection title="Членство в Профсоюзе" margin="100px">
				<v-btn-toggle v-model="data.member" mandatory divided>
					<v-btn :value="true">Состою</v-btn>
					<v-btn :value="false">Не состою</v-btn>
				</v-btn-toggle>
			</IrdomSection>
		</div>
		<div class="d-flex elevation-10" :class="{ show: allDef }">
			<div class="your">
				<span>ИТОГО: </span>
				<IrdomTooltip text="">
					Получение этой суммы не гарантировано.<br />
					С вопросами обращайтесь в Профком.
				</IrdomTooltip>
			</div>
			<div class="stipend">{{ allDef ? formattedStipend : '?' }}</div>
		</div>
	</div>
</template>

<style scoped>
.stipend {
	height: 54px;
	display: flex;
	align-items: center;
	font-size: 30px;
	background: rgb(0, 1, 76);
	color: white;
	border-radius: 999px;
	padding: 0 16px;
	min-width: max(54px, fit-content);
	justify-content: center;
}

.your {
	font-size: 18px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: flex;
	align-items: center;
	gap: 8px;
}

.d-flex {
	height: 80px;
	background: white;
	position: absolute;
	left: 16px;
	bottom: 64px;
	right: 16px;
	z-index: 1;
	align-items: center;
	gap: 8px;
	justify-content: space-between;
	padding: 0 13px 0 43px;
	border-radius: 43px;
	white-space: nowrap;
	transform: translateY(112px);
	opacity: 0;
	transition: all 300ms ease-in-out;
}

.show {
	opacity: 1;
	transform: translateY(0);
}

.calc {
	overflow-y: auto;
	height: 100%;
	padding: 24px 24px 112px;
}

.container {
	position: relative;
	height: 100vh;
	overflow: hidden;
}

.course {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	background: rgb(0 0 0 / 12%);
	gap: 1.2px;
	height: auto !important;
}

.course > button {
	border-radius: 0 !important;
}
</style>
