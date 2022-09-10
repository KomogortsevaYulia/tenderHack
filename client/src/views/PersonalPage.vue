<script setup>
import PopularItems from '../components/Items.vue'
import {useVocabulariesStore} from "@/stores/vocabulariesStore";
import {storeToRefs} from "pinia";
import Echart from '../components/Charts/Echart.vue'
import {usePersonalPageStore} from "@/stores/personalPageStore";

const vocabulariesStore = useVocabulariesStore();
const globalPageStore = usePersonalPageStore();

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
        <div class="col-12">
            <Echart :chart-data="quantityDynamicsChartData"/>
        </div>
<!--        <div class="col-5">-->
<!--            <Echart :chart-data="colorSpecificationsItemsChartData"/>-->
<!--        </div>-->
    </div>

<!--    <PopularItems class="mt-4 mb-4" title="Топ поставщиков" :items="popularSuppliersItems" v-slot="{item}">-->
<!--        <h5>{{ item.provider_title }}</h5>-->
<!--        <div class="badge bg-primary me-2">ИНН: {{ item.provider_inn }}</div>-->
<!--        <div class="badge bg-primary me-2">КПП: {{ item.provider_kpp }}</div>-->
<!--        <div class="badge bg-gradient1">Закупок: {{ item.count }}</div>-->
<!--    </PopularItems>-->

    <div>Похожие поставщики</div>
    <div>Выводим заказчиков этих постовщиков которые покапают наши товары</div>

    <PopularItems class="mt-4" title="Топ закупок" :items="popularProductsItems" v-slot="{item}">
        <div class="d-flex flex-column justify-content-center align-items-center h-100">
            <div class="flex-grow-1 d-flex pb-2 fw-bold align-items-center text-center">{{ item.title }}</div>
            <div class="badge bg-gradient1 align-self-stretch">Закупок: {{ item.count }}</div>
        </div>
    </PopularItems>

    <div class="mb-4"></div>

</template>


<style scoped>

</style>