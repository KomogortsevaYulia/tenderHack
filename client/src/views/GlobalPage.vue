<script setup>
import Charts from '../components/Charts.vue'
import PopularItems from '../components/PopularItems.vue'
import {useVocabulariesStore} from "@/stores/vocabulariesStore";
import {storeToRefs} from "pinia";
import {useGlobalPageStore} from "@/stores/globalPageStore";
import Echart from '../components/Charts/Echart.vue'
import PieChart from '../components/Charts/PieChart.vue'

const vocabulariesStore = useVocabulariesStore();
const globalPageStore = useGlobalPageStore();

const {
    activeCategory,
    quantityDynamicsChartData,
    colorSpecificationsItemsChartData,
} = storeToRefs(globalPageStore)

const {
    categories
} = storeToRefs(vocabulariesStore)


</script>

<template>

    <div class="container">
        <ul class="navbar-nav mt-4">
            <select v-model="activeCategory" class="form-control">
                <option :value="c.code" v-for="c in categories">{{ c.label }}</option>
            </select>
        </ul>
        <div class="row mt-4">
            <div class="col-8">
                <Echart :chart-data="quantityDynamicsChartData"/>
            </div>
            <div class="col-4">
                <Echart :chart-data="colorSpecificationsItemsChartData"/>
            </div>
        </div>
        <PopularItems title="Популярное в этом месяце"/>
        <PopularItems class="mt-4 " title="Топ поставщиков"/>
    </div>
</template>


<style scoped>

</style>