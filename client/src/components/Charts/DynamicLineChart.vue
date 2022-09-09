<script setup>
import * as echarts from 'echarts';
import {onMounted, ref} from "vue";

const dynamicLinearChartRef = ref();
let chart = null;

function updateChart() {
    if (chart == null) {
        console.log(dynamicLinearChartRef.value)
        chart = echarts.init(dynamicLinearChartRef.value);
    }
    chart.setOption({
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Line 1',
                type: 'line',
                stack: 'Total',
                smooth: true,
                lineStyle: {
                    width: 0
                },
                showSymbol: false,
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(128, 255, 165)'
                        },
                        {
                            offset: 1,
                            color: 'rgb(1, 191, 236)'
                        }
                    ])
                },
                emphasis: {
                    focus: 'series'
                },
                data: [140, 232, 101, 264, 90, 340, 250]
            },
        ]
    });
}

onMounted(() => {
    updateChart();
})
</script>

<template>
    <div ref="dynamicLinearChartRef" style="height: 400px; width: 100%"></div>
</template>

<style scoped>

</style>