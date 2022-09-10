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
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '40',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 1048, name: 'Search Engine'},
                    {value: 735, name: 'Direct'},
                    {value: 580, name: 'Email'},
                    {value: 484, name: 'Union Ads'},
                    {value: 300, name: 'Video Ads'}
                ]
            }
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