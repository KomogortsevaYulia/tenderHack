<script setup>
import PopularItems from '../components/Items.vue'
import { useVocabulariesStore } from "@/stores/vocabulariesStore";
import { storeToRefs } from "pinia";
import Echart from '../components/Charts/Echart.vue'
import { usePersonalPageStore } from "@/stores/personalPageStore";
import { onBeforeRouteUpdate } from "vue-router";
import BModal from "@/components/BModal.vue";
import {computed, ref} from "vue";
import BHint from "@/components/BHint.vue";

const vocabulariesStore = useVocabulariesStore();
const personalPageStore = usePersonalPageStore();
const modalRef = ref()


const filter = ref("")
const itemsField = computed(() => {
    return cteForRecommendations.value.filter(x =>{
        if (filter.value) {
           
            return x.title.toLowerCase().includes(filter.value.toLowerCase())
        } else {
            return true
        }
    })})
const activeClientTitle = ref("")


const {
    activeCategory,
    quantityDynamicsChartData,
    colorSpecificationsItemsChartData,
    popularCategoryItems,
    popularSuppliersItems,
    popularProductsItems,
    analogProviders,
    activeProviders,
    cteForRecommendations,
    typesContracts,
    providerClients,

    loadingActiveCategoryQuantityDynamic,
    loadingPopularProducts,
    loadingAnalogProviders,
    activePeriod,
} = storeToRefs(personalPageStore)


function clientClick(provider_title) {
    modalRef.value.show()
    activeProviders.value = provider_title;
    personalPageStore.fetchProviderClients(provider_title);
}

function customerClick(title) {
    activeClientTitle.value = title;
    personalPageStore.fetchСteForRecommendations(title);
}

const {
    categories
} = storeToRefs(vocabulariesStore)
</script>

<template>
    <h1>ООО "Жизнь офиса"         </h1>

    <div class="btn-group ms-3" role="group" aria-label="Basic example">
        <button type="button" class="btn" :class="{'btn-primary': activePeriod===7, 'btn-light': activePeriod!==7}"
                @click="activePeriod=7">1Н
        </button>
        <button type="button" class="btn" :class="{'btn-primary': activePeriod===30, 'btn-light': activePeriod!==30}"
                @click="activePeriod=30">1М
        </button>
        <button type="button" class="btn" :class="{'btn-primary': activePeriod===90, 'btn-light': activePeriod!==90}"
                @click="activePeriod=90">3М
        </button>
        <button type="button" class="btn" :class="{'btn-primary': activePeriod===180, 'btn-light': activePeriod!==180}"
                @click="activePeriod=180">6М
        </button>
        <button type="button" class="btn" :class="{'btn-primary': activePeriod===365, 'btn-light': activePeriod!==365}"
                @click="activePeriod=365">1Г
        </button>
    </div>
    <div class="row mt-4">
        <div class="col-12 pe-lg-5 pt-2 ps-0">
            <Echart :chart-data="quantityDynamicsChartData" :loading="loadingActiveCategoryQuantityDynamic"/>
        </div>        
    </div>

    <div class="row mt-4 ">
        <div class="alert alert-primary align-self-start col-12 pt-2 " role="alert">
                Распределение закупок: 
                <span v-for="(i, index) in typesContracts">
                    <b-hint :tip="index == 0 ? 'Закупка по потребности – сбор коммерческих предложений в форме ставок участников для заключения контракта с любым из них' 
                                : index==1 ? 'Котировочная сессия – переговоры по инициативе заказчика о существенных условиях предложения поставщика для заключении контракта' 
                                : 'Прямая закупка – сбор коммерческих предложений в форме ставок участников для заключения контракта с любым из них. Еще называют закупкой у единственного поставщика'"
                                 >
                        {{ i.value }} - {{ i.count }} &nbsp;   &nbsp;&nbsp;
                    </b-hint>
                </span>
        </div>
    </div>

    <PopularItems class="mt-4" title="Поставщики выставляющие закупки в ваших категориях"
        :loading="loadingAnalogProviders" :items="analogProviders" v-slot="{item}">
        <div class="d-flex flex-column justify-content-center align-items-center h-100"
            @click="clientClick(item.provider_title)">
            <div class="flex-grow-1 d-flex pb-2 fw-bold align-items-center text-center">{{ item.provider_title }}</div>
            <div class="badge bg-gradient1 align-self-stretch mb-1">Закупок: {{ item.count }}</div>
            <div class="badge bg-gradient1 align-self-stretch">Объем закупок: {{ item.sum.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g," ") }}₽</div>
        </div>
    </PopularItems>

    <PopularItems class="mt-4" title="Ваши категории" :items="popularCategoryItems" v-slot="{item, index}" >
        <div class="d-flex flex-column justify-content-center align-items-center h-100">
            <h3>{{index + 1}}</h3>
            <div class="flex-grow-1 d-flex pb-2 fw-bold align-items-center text-center">{{ item.category }}</div>
            <div class="badge bg-gradient1 align-self-stretch">Закупок: {{ item.count }}</div>
            <div class="alert alert-primary col" role="alert">

                В качестве сопутствующих товаров/работ/услуг закупаются
                <span v-for="i in item.items">
                    в <span style="font-weight: bold;">{{ i.percent }}%</span> случаев <span
                    style="font-weight: bold;">{{ i.category.toLowerCase() }}</span>;
                </span>
            </div>
        </div>
    </PopularItems>

    <PopularItems class="mt-4" title="Ваши закупки" :items="popularProductsItems" :loading="loadingPopularProducts"
                  v-slot="{item}">
        <div class="d-flex flex-column justify-content-center align-items-center h-100">
            <div class="flex-grow-1 d-flex pb-2 fw-bold align-items-center text-center">{{ item.title }}</div>
            <div class="badge bg-gradient1 align-self-stretch">Закупок: {{ item.count }}</div>
        </div>
    </PopularItems>

    <div class="mb-4"></div>

    <BModal ref="modalRef" size="xl" :title="`Список клиентов ${activeProviders}`">
        <div class="row" style="height: 70vh;">
            <div class="col-6" style="height: 100%">
                <div class="list-group" id="list-tab" role="tablist" style="overflow-y: auto; height: 100%">
                    <template v-for="i in providerClients">
                        <span class="list-group-item list-group-item-action" :class="{'active': activeClientTitle == i.customer_title}" id="list-home-list" data-toggle="list"
                              role="tab"
                              @click="customerClick(i.customer_title)">{{ i.customer_title }} <br>
                                <i>ИНН:{{ i.customer_inn }}
                                КПП: {{ i.customer_kpp }} </i>
                        </span>
                    </template>
                </div>
            </div>
            <div class="col-6 d-flex flex-column" style="height: 100%;">
                <h4>Товары преобретаемые клиентом</h4>
                <input type="text" placeholder="Введите название СТЕ" class="form-control mb-2" v-model="filter">
                <div class="flex-grow-1 pt-3  flex-wrap width-100"
                     style="overflow-y: auto; overflow-x: hidden; display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 2px; max-width: 100%;">
                    <template v-for="i in itemsField">
                        <BHint :tip="`Количество реализованных единиц товара: ${i.count}`">
                        <button class="btn btn-sm position-relative bg-light "
                                style="background-color:darkgray; white-space: normal; ">
                                {{ i.title }}
                                <span class="badge bg-danger">от {{ i.avg }}₽</span>
                        </button>
                        </BHint>
                    </template>
                </div>
            </div>
        </div>
    </BModal>

</template>


<style scoped>

</style>