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
    popularCategoryItems,
    popularSuppliersItems,
    popularProductsItems,
    analogProviders,
} = storeToRefs(globalPageStore)

const {
    categories
} = storeToRefs(vocabulariesStore)

</script>

<template>
    <h1>ООО "Жизнь офиса"</h1>
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
    <PopularItems class="mt-4" title="Поставщики выставляющие закупки в ваших категориях" :items="analogProviders" v-slot="{item}">
        <div class="d-flex flex-column justify-content-center align-items-center h-100">
            <div class="flex-grow-1 d-flex pb-2 fw-bold align-items-center text-center">{{ item.provider_title }}</div>
            <div class="badge bg-gradient1 align-self-stretch mb-1">Закупок: {{ item.count }}</div>
            <div class="badge bg-gradient1 align-self-stretch">Объем закупок: {{ item.sum }}₽</div>
        </div>
    </PopularItems>

    <div>Похожие поставщики</div>
    <div>Выводим заказчиков этих постовщиков которые покапают наши товары</div>
    <div>Сопотсвтующие категории</div>

    <PopularItems class="mt-4" title="Топ категорий" :items="popularCategoryItems" v-slot="{item}">
        <div class="d-flex flex-column justify-content-center align-items-center h-100">
            <div class="flex-grow-1 d-flex pb-2 fw-bold align-items-center text-center">{{ item.category }}</div>
            <div class="badge bg-gradient1 align-self-stretch">Закупок: {{ item.count }}</div>
            <div class="alert alert-primary col" role="alert">

            {{item.category}} продаются так же с:<br>
            <span v-for="i in item.items">
                {{i.percent}}% - {{i.category}} <br>
            </span>
            </div>
        </div>
    </PopularItems>

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