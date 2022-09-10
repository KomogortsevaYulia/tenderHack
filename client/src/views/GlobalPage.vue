<script setup>
import Charts from '../components/Charts.vue'
import PopularItems from '../components/Items.vue'
import { useVocabulariesStore } from "@/stores/vocabulariesStore";
import { storeToRefs } from "pinia";
import { useGlobalPageStore } from "@/stores/globalPageStore";
import Echart from '../components/Charts/Echart.vue'
import PieChart from '../components/Charts/PieChart.vue'

const vocabulariesStore = useVocabulariesStore();
const globalPageStore = useGlobalPageStore();

const {
    activeCategory,
    quantityDynamicsChartData,
    colorSpecificationsItemsChartData,
    popularSuppliersItems,
    popularCategoryItems,
    popularProductsItems,
    activePeriod,
    relativeCategories,
} = storeToRefs(globalPageStore)

const {
    categories
} = storeToRefs(vocabulariesStore)


</script>

<template>

    <h1>Глобальный рейтинг поставщиков</h1>

    <PopularItems class="mt-4" title="Востребованные категории" :items="popularCategoryItems" v-slot="{item}">
        <div class="d-flex flex-column justify-content-center align-items-center h-100">
            <div class="flex-grow-1 d-flex pb-2 fw-bold align-items-center text-center">{{ item.category }}</div>
            <div class="badge bg-gradient1 align-self-stretch">Закупок: {{ item.count }}</div>
        </div>
    </PopularItems>

    <PopularItems class="mt-4" title="Популярные в этом периоде товары" :items="popularProductsItems" v-slot="{item}">
        <div class="d-flex flex-column justify-content-center align-items-center h-100">
            <div class="flex-grow-1 d-flex pb-2 fw-bold align-items-center text-center">{{ item.title }}</div>
            <div class="badge bg-gradient1 align-self-stretch">Закупок: {{ item.count }}</div>
        </div>
    </PopularItems>


    <div class="d-flex mt-4">
        <select v-model="activeCategory" class="form-control">
            <option :value="c.code" v-for="c in categories">{{ c.label }}</option>
        </select>
        <div class="btn-group ms-3" role="group" aria-label="Basic example">
            <button type="button" class="btn btn-light" @click="activePeriod=7">1Н</button>
            <button type="button" class="btn btn-light" @click="activePeriod=30">1М</button>
            <button type="button" class="btn btn-light" @click="activePeriod=90">3М</button>
            <button type="button" class="btn btn-light" @click="activePeriod=180">6М</button>
            <button type="button" class="btn btn-light" @click="activePeriod=365">1Г</button>
        </div>
    </div>
    <div class="row mt-4">
        <div class="col-lg-7 pe-lg-5 col-12 pt-2 ps-0">
            <Echart :chart-data="quantityDynamicsChartData" />
        </div>
        <div class="col-lg-5 border rounded col-12 pt-2">
            <Echart :chart-data="colorSpecificationsItemsChartData" />
        </div>
    </div>

    <div class="row mt-4 ">
        <div class="alert alert-primary col" role="alert">

            {{activeCategory}} продаются так же с:<br>
            <span v-for="i in relativeCategories">
                {{i.percent}}% - {{i.category}} <br>
            </span>
        </div>
    </div>

    <PopularItems class="mt-4 mb-4" title="Топ поставщиков" :items="popularSuppliersItems" v-slot="{item}">
        <h5>{{ item.provider_title }}</h5>
        <div class="badge bg-primary me-2">ИНН: {{ item.provider_inn }}</div>
        <div class="badge bg-primary me-2">КПП: {{ item.provider_kpp }}</div>
        <div class="badge bg-gradient1">Закупок: {{ item.count }}</div>
    </PopularItems>

    <div class="mb-4"></div>

</template>


<style scoped>

</style>