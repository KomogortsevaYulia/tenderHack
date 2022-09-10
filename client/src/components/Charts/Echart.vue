<script setup>
import * as echarts from 'echarts';
import {onMounted, ref, watch} from "vue";

const dynamicLinearChartRef = ref();
const chart = ref(null);

const props = defineProps({
    chartData: {
        type: Object
    }
})

function updateChart() {
    if (chart.value == null) {
        chart.value = echarts.init(dynamicLinearChartRef.value);
    }
    chart.value.setOption(props.chartData, true);
}

watch(() => props.chartData, () => {
    updateChart();
})

onMounted(() => {
    updateChart();
})
</script>

<template>
    <div ref="dynamicLinearChartRef" style="height: 400px; width: 100%"></div>
</template>

<style scoped>

</style>