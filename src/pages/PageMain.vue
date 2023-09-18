<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from 'vue';
import IrdomSection from '../components/IrdomSection.vue';
import { Stipend, TAX } from '../constants';

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

watch(allDef, val => {
	if (val) {
		nextTick(() => {
			window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
		});
	}
});

watch(gasCondition, val => {
	if (!val) {
		data.pgas = false;
	}
});
</script>

<template>
	<div class="bg-grey-lighten-4 pa-6 rounded">
		<IrdomSection title="Курс обучения">
			<v-btn-toggle
				v-model="data.course"
				mandatory
				style="flex-wrap: wrap; height: auto"
				@update:model-value="updateCourseHandler"
			>
				<v-btn value="1" style="height: 48px">1</v-btn>
				<v-btn value="2" style="height: 48px">2</v-btn>
				<v-btn value="3" style="height: 48px">3</v-btn>
				<v-btn value="4" style="height: 48px">4</v-btn>
				<br />
				<v-btn value="5" style="height: 48px">5</v-btn>
				<v-btn value="6" style="height: 48px">6</v-btn>
				<v-btn value="1М" style="height: 48px">1М</v-btn>
				<v-btn value="2М" style="height: 48px">2М</v-btn>
			</v-btn-toggle>
		</IrdomSection>

		<IrdomSection title="Оценки за последнюю сессию">
			<v-btn-toggle v-model="data.marks" multiple :disabled="nomarks">
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

		<IrdomSection title="Пересдачи за последнюю сессию">
			<v-btn-toggle v-model="data.retake" mandatory>
				<v-btn :value="true">Были</v-btn>
				<v-btn :value="false">Не были</v-btn>
			</v-btn-toggle>
		</IrdomSection>

		<IrdomSection v-if="gasCondition" title="ПГАС">
			<v-btn-toggle v-model="data.pgas" mandatory>
				<v-btn :value="true">Получаю</v-btn>
				<v-btn :value="false">Не получаю</v-btn>
			</v-btn-toggle>
		</IrdomSection>

		<IrdomSection title="ГСС">
			<v-btn-toggle v-model="data.gss" mandatory>
				<v-btn :value="true">Получаю</v-btn>
				<v-btn :value="false">Не получаю</v-btn>
			</v-btn-toggle>
		</IrdomSection>

		<IrdomSection title="Членство в Профсоюзе">
			<v-btn-toggle v-model="data.member" mandatory>
				<v-btn :value="true">Состою</v-btn>
				<v-btn :value="false">Не состою</v-btn>
			</v-btn-toggle>
		</IrdomSection>
	</div>
	<div v-if="allDef" class="d-flex">
		<span class="your">Ожидаемая сумма</span>
		<div class="stipend">{{ formattedStipend }}</div>
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
	min-width: fit-content;
}

.your {
	font-size: 18px;
	line-height: 24px;
	text-align: right;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	overflow-wrap: anywhere;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.d-flex {
	align-items: center;
	gap: 8px;
	float: right;
	padding: 24px 8px;
}
</style>
