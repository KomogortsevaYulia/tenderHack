<script setup>
import PopularItems from '../components/Items.vue'
import {useVocabulariesStore} from "@/stores/vocabulariesStore";
import {storeToRefs} from "pinia";
import Echart from '../components/Charts/Echart.vue'
import {usePersonalPageStore} from "@/stores/personalPageStore";
import {onBeforeRouteUpdate} from "vue-router";
import BModal from "@/components/BModal.vue";
import {ref} from "vue";

const vocabulariesStore = useVocabulariesStore();
const personalPageStore = usePersonalPageStore();
const modalRef = ref()

const {
    activeCategory,
    quantityDynamicsChartData,
    colorSpecificationsItemsChartData,
    popularCategoryItems,
    popularSuppliersItems,
    popularProductsItems,
    analogProviders,
    typesContracts,

    loadingActiveCategoryQuantityDynamic,
    loadingPopularProducts,
    loadingAnalogProviders,
    activePeriod,
} = storeToRefs(personalPageStore)


function clientClick() {
    modalRef.value.show()
    personalPageStore.fetchProviderClients();
}

const {
    categories
} = storeToRefs(vocabulariesStore)
</script>

<template>
    <h1>ООО "Жизнь офиса"</h1>

    <div class="btn-group ms-3" role="group" aria-label="Basic example">
        <button type="button" class="btn" :class="{'btn-primary': activePeriod===7, 'btn-light': activePeriod!==7}" @click="activePeriod=7">1Н</button>
        <button type="button" class="btn" :class="{'btn-primary': activePeriod===30, 'btn-light': activePeriod!==30}" @click="activePeriod=30">1М</button>
        <button type="button" class="btn" :class="{'btn-primary': activePeriod===90, 'btn-light': activePeriod!==90}" @click="activePeriod=90">3М</button>
        <button type="button" class="btn" :class="{'btn-primary': activePeriod===180, 'btn-light': activePeriod!==180}" @click="activePeriod=180">6М</button>
        <button type="button" class="btn" :class="{'btn-primary': activePeriod===365, 'btn-light': activePeriod!==365}" @click="activePeriod=365">1Г</button>
    </div>
    <div class="row mt-4">
        <div class="col-12">
            <Echart :chart-data="quantityDynamicsChartData" :loading="loadingActiveCategoryQuantityDynamic"/>
        </div>
    </div>

    <PopularItems class="mt-4" title="Поставщики выставляющие закупки в ваших категориях" :loading="loadingAnalogProviders" :items="analogProviders" v-slot="{item}">
        <div class="d-flex flex-column justify-content-center align-items-center h-100"  @click="clientClick">
            <div class="flex-grow-1 d-flex pb-2 fw-bold align-items-center text-center">{{ item.provider_title }}</div>
            <div class="badge bg-gradient1 align-self-stretch mb-1">Закупок: {{ item.count }}</div>
            <div class="badge bg-gradient1 align-self-stretch">Объем закупок: {{ item.sum }}₽</div>
        </div>
    </PopularItems>

    <div>Похожие поставщики</div>
    <div>Выводим заказчиков этих постовщиков которые покапают наши товары</div>
    <div>Сопотсвтующие категории</div>

    <div class="row mt-4 ">
        <div class="alert alert-primary col" role="alert">

            Распределение закупок: <br>

            <span v-for="i in typesContracts">
                {{i.value}} - {{i.count}} <br>
            </span>
        </div>
    </div>

    <PopularItems class="mt-4" title="Ваши категории" :items="popularCategoryItems" v-slot="{item}">
        <div class="d-flex flex-column justify-content-center align-items-center h-100">
            <div class="flex-grow-1 d-flex pb-2 fw-bold align-items-center text-center">{{ item.category }}</div>
            <div class="badge bg-gradient1 align-self-stretch">Закупок: {{ item.count }}</div>
            <div class="alert alert-primary col" role="alert">

            В качестве сопутствующих товаров закупаются
            <span v-for="i in item.items">
                в  <span style="font-weight: bold;">{{i.percent}}%</span> случаях <span style="font-weight: bold;">{{i.category.toLowerCase()}}</span>,
            </span>
            </div>
        </div>
    </PopularItems>

    <PopularItems class="mt-4" title="Ваши закупки" :items="popularProductsItems" :loading="loadingPopularProducts" v-slot="{item}">
        <div class="d-flex flex-column justify-content-center align-items-center h-100">
            <div class="flex-grow-1 d-flex pb-2 fw-bold align-items-center text-center">{{ item.title }}</div>
            <div class="badge bg-gradient1 align-self-stretch">Закупок: {{ item.count }}</div>
        </div>
    </PopularItems>

    <div class="mb-4"></div>

    <BModal ref="modalRef" size="lg">
        123
    </BModal>

</template>


<style scoped>

</style>