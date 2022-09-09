<script setup>
import DynamicLineChart from './Charts/DynamicLineChart.vue';
import PieChart from './Charts/PieChart.vue'
</script>

<template>
    <div class="row">
        <div class="col-8">
            <DynamicLineChart />
        </div>
        <div class="col-4">
            <PieChart />
        </div>
    </div>
</template>


<style scoped>

</style>