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
    popularProductsItems,
} = storeToRefs(globalPageStore)

const {
    categories
} = storeToRefs(vocabulariesStore)


</script>

<template>
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

        <PopularItems class="mt-4 mb-4" title="Топ поставщиков" :items="popularSuppliersItems" v-slot="{item}">
            <h5>{{item.provider_title}}</h5>
            <div class="badge bg-primary me-2">ИНН: {{item.provider_inn}}</div>
            <div class="badge bg-primary me-2">КПП: {{item.provider_kpp}}</div>
            <div class="badge bg-gradient1">Закупок: {{item.count}}</div>
        </PopularItems>

        <PopularItems class="mt-4" title="Популярное в этом месяце" :items="popularProductsItems" v-slot="{item}">
            <div class="d-flex flex-column justify-content-center align-items-center h-100">
                <div class="flex-grow-1 d-flex pb-2 fw-bold align-items-center text-center">{{item.title}}</div>
                <div class="badge bg-gradient1 align-self-stretch">Закупок: {{item.count}}</div>
            </div>
        </PopularItems>

</template>


<style scoped>

</style>