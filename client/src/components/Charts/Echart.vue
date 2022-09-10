<script setup>
import * as echarts from 'echarts';
import {computed, onMounted, ref, watch} from "vue";

const dynamicLinearChartRef = ref();
let chart = null;

const props = defineProps({
    chartData: {
        type: Object
    },
    loading: {
        type: Boolean
    }
})

function updateChart() {
    if (chart == null) {
        chart = echarts.init(dynamicLinearChartRef.value);
    }
    chart.setOption(props.chartData, true);
    chart.resize();
}

const style = computed(() => {
    if (props.loading) {
        return {
            filter: "blur(2x)"
        }
    }
    return {}
})

watch(() => props.chartData, () => {
    updateChart();
})

onMounted(() => {
    updateChart();
})
</script>

<template>
        <div class="position-relative" style="height: 400px; width: 100%">
            <div ref="dynamicLinearChartRef" style="height: 100%; width: 100%"  :style="style">
            </div>
            <div class="position-absolute" style="right: 1rem; top: 2rem"  v-if="loading" >
                <span class="spinner-border" role="status"></span>
            </div>
        </div>
</template>

<style scoped>

</style>