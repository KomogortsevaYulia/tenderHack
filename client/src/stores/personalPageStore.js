import {defineStore, storeToRefs} from "pinia";
import {computed, onBeforeMount, ref, watch} from "vue";
import axios from "axios";
import _ from 'lodash'
import * as echarts from "echarts";
import {format, formatDistance, formatRelative, subDays} from 'date-fns'
import {useVocabulariesStore} from "@/stores/vocabulariesStore";
import {usePeriod} from "@/stores/usePeriod";
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {usePieChart} from "@/stores/pieChart";
import {useDynamicChart} from "@/stores/dynamicChart";

export const usePersonalPageStore = defineStore("personalPageStore", () => {
    const activeCategory = ref(localStorage.getItem("activeCategory") || "Велосипеды");
    const personalCategories = ref([]);
    const typesContracts = ref([]);
    const quantityDynamicItems = ref([])
    const colorSpecificationsItems = ref([])
    const popularSuppliersItems = ref([])
    const popularProductsItems = ref([])
    const popularCategoryItems = ref([])
    const analogProviders = ref([])

    const loadingAnalogProviders = ref(false);
    const loadingPopularSuppliers = ref(false);
    const loadingPopularProducts = ref(false);
    const loadingPopularCategory = ref(false);
    const loadingActiveCategorySpecifications = ref(false);
    const loadingActiveCategoryQuantityDynamic = ref(false);

    const {
        activePeriod,
        dend,
        dbeg,
    } = usePeriod();

    const vocabulariesStore = useVocabulariesStore();
    const {
        categories
    } = storeToRefs(vocabulariesStore)

    async function fetchAnalogProviders() {
         let params = {
            // 'firstDay': format(dbeg.value, 'dd.MM.yy'),
            // 'lastDay': format(dend.value, 'dd.MM.yy'),
        }
        loadingAnalogProviders.value = true;
        let r = await axios.get('/api/personal/getAnalogProviders', {
            params
        })
        loadingAnalogProviders.value = false;
        analogProviders.value = r.data;
    }

    async function fetchPopularSuppliers() {
        let params = {
            'category': activeCategory.value,
            'firstDay': format(dbeg.value, 'dd.MM.yy'),
            'lastDay': format(dend.value, 'dd.MM.yy'),
        }
        loadingPopularSuppliers.value = true;
        let r = await axios.get('/api/personal/popularsuppliers', {
            params
        })
        loadingPopularSuppliers.value = false;
        popularSuppliersItems.value = r.data;
    }

    async function fetchPopularProducts() {
        let params = {
            'category': activeCategory.value,
            'firstDay': format(dbeg.value, 'dd.MM.yy'),
            'lastDay': format(dend.value, 'dd.MM.yy'),
        }
        loadingPopularProducts.value = true;
        let r = await axios.get('/api/personal/popularProducts', {
            params
        })
        loadingPopularProducts.value = false;
        popularProductsItems.value = r.data;
    }

    async function fetchPopularCategory() {
        loadingPopularCategory.value = true;
        let r = await axios.get('/api/personal/getAssociatedCte')
        loadingPopularCategory.value = false;
        popularCategoryItems.value = r.data;
    }

    async function fetchActiveCategorySpecifications() {
        let params = {
            'category': activeCategory.value,
            'firstDay': format(dbeg.value, 'dd.MM.yy'),
            'lastDay': format(dend.value, 'dd.MM.yy'),
            'name': 'Цвет'
        }
        loadingActiveCategorySpecifications.value = true;
        let r = await axios.get('/api/personal/contractsSpecifications', {
            params
        })
        loadingActiveCategorySpecifications.value = false;
        colorSpecificationsItems.value = r.data;
    }

    async function fetchActiveCategoryQuantityDynamic() {
        loadingActiveCategoryQuantityDynamic.value = true;
        let r = await axios.get("/api/personal/dynamics", {
            params: {
                'firstDay': format(dbeg.value, 'dd.MM.yy'),
                'lastDay': format(dend.value, 'dd.MM.yy'),
            }
        })
        loadingActiveCategoryQuantityDynamic.value = false;
        quantityDynamicItems.value = _(r.data).map(x => {
            return {
                date: new Date(x.date),
                count: x.count
            }
        }).sortBy(x => x.date).value();
    }

    async function fetchTypesContracts() {
        let r = await axios.get("/api/personal/getTypesContracts", {
            params: {
                'firstDay': format(dbeg.value, 'dd.MM.yy'),
                'lastDay': format(dend.value, 'dd.MM.yy'),
            }
        })
        quantityDynamicItems.value = _(r.data).map(x => {
            return {
                date: new Date(x.date),
                count: x.count
            }
        }).sortBy(x => x.date).value();
    }

    async function refetchAll() {
        await Promise.all([
            // fetchActiveCategorySpecifications(),
            fetchPopularCategory(),
            fetchActiveCategoryQuantityDynamic(),
            fetchTypesContracts(),
            fetchAnalogProviders(),
            fetchPopularProducts(),
        ])
    }

    watch(categories, async () => {
        refetchAll();
    });

    watch(activePeriod, async () => {
        console.log(dbeg.value)
        console.log(dend.value)
        refetchAll();
    });

    watch(activeCategory, async () => {
        refetchAll()
        localStorage.activeCategory = activeCategory.value
    })

    const {optionsChart: colorSpecificationsItemsChartData} = usePieChart(colorSpecificationsItems)
    const {optionsChart: quantityDynamicsChartData} = useDynamicChart(quantityDynamicItems)

    return {
        fetchActiveCategoryQuantityDynamic,
        fetchActiveCategorySpecifications,
        fetchPopularProducts,
        refetchAll,

        typesContracts,
        activeCategory,
        popularCategoryItems,
        analogProviders,
        quantityDynamicsChartData,
        colorSpecificationsItemsChartData,
        popularSuppliersItems,
        popularProductsItems,
        activePeriod,

        loadingAnalogProviders,
        loadingPopularSuppliers,
        loadingPopularProducts,
        loadingPopularCategory,
        loadingActiveCategorySpecifications,
        loadingActiveCategoryQuantityDynamic,
    }
})