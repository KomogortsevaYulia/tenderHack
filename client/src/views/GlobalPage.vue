<script setup>
import Charts from '../components/Charts.vue'
import PopularItems from '../components/Items.vue'
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
    popularSuppliersItems,
} = storeToRefs(globalPageStore)

const {
    categories
} = storeToRefs(vocabulariesStore)


</script>

<template>
    <div class="container">
        <h1>Глобальный рейтинг поставщиков</h1>
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
        <PopularItems class="mt-4 " title="Популярное в этом месяце">

        </PopularItems>

        <PopularItems title="Топ поставщиков" :items="popularSuppliersItems" v-slot="{item}">
            <h4>{{item.provider_title}}</h4>
            <div class="badge bg-info  me-2">ИНН: {{item.provider_inn}}</div>
            <div class="badge bg-info  me-2">КПП: {{item.provider_kpp}}</div>
            <div class="badge bg-warning">Количество контрактов: {{item.count}}</div>
        </PopularItems>
    </div>
</template>


<style scoped>

</style>