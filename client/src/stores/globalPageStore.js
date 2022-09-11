import {defineStore, storeToRefs} from "pinia";
import {computed, onBeforeMount, ref, watch} from "vue";
import axios from "axios";
import _ from 'lodash'
import * as echarts from "echarts";
import {format, formatDistance, formatRelative, subDays} from 'date-fns'
import {add} from "date-fns";
import {useMainStore} from "@/stores/mainStore";
import {useVocabulariesStore} from "@/stores/vocabulariesStore";
import {usePeriod} from "@/stores/usePeriod";
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {usePieChart} from "@/stores/pieChart";
import {useDynamicChart} from "@/stores/dynamicChart";

export const useGlobalPageStore = defineStore("globalPageStore", () => {
    const activeCategory = ref(localStorage.getItem("activeCategory") || "Велосипеды");
    const quantityDynamicItems = ref([])
    const colorSpecificationsItems = ref([])
    const popularSuppliersItems = ref([])
    const popularCategoryItems = ref([])
    const popularProductsItems = ref([])
    const relativeCategories = ref([])

    const loadingPopularSuppliers = ref(false);
    const loadingPopularProducts = ref(false);
    const loadingPopularCategory = ref(false);
    const loadingActiveCategorySpecifications = ref(false);
    const loadingActiveCategoryRelativeCategories = ref(false);
    const loadingActiveCategoryQuantityDynamic = ref(false);

    const {
        activePeriod,
        dend,
        dbeg,
    } = usePeriod();

    // watch('$route.params', () => {
    //     console.log("test")
    // })
    const vocabulariesStore = useVocabulariesStore();
    const {
        categories
    } = storeToRefs(vocabulariesStore)

    async function fetchPopularSuppliers() {
        let params = {
            'category': activeCategory.value,
            'firstDay': format(dbeg.value, 'dd.MM.yy'),
            'lastDay': format(dend.value, 'dd.MM.yy'),
        }
        loadingPopularSuppliers.value = true;
        let r = await axios.get('/api/suppliers/popularsuppliers', {
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
        let r = await axios.get('/api/suppliers/popularProducts', {
            params
        })
        loadingPopularProducts.value = false;
        popularProductsItems.value = r.data;
    }

    async function fetchPopularCategory() {
        let params = {
            'firstDay': format(dbeg.value, 'dd.MM.yy'),
            'lastDay': format(dend.value, 'dd.MM.yy'),
        }
        loadingPopularCategory.value = true;
        let r = await axios.get('/api/suppliers/popularCategory', {
            params
        })
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
        let r = await axios.get('/api/suppliers/contractsSpecifications', {
            params
        })
        loadingActiveCategorySpecifications.value = false;
        colorSpecificationsItems.value = r.data;
    }

    async function fetchActiveCategoryRelativeCategories() {
        let params = {
            'category': activeCategory.value,
            'firstDay': format(dbeg.value, 'dd.MM.yy'),
            'lastDay': format(dend.value, 'dd.MM.yy')
        }
        loadingActiveCategoryRelativeCategories.value = true;
        let r = await axios.get('/api/suppliers/associatedCte', {
            params
        })
        loadingActiveCategoryRelativeCategories.value = false;
        relativeCategories.value = r.data;
    }

    async function fetchActiveCategoryQuantityDynamic() {
        loadingActiveCategoryQuantityDynamic.value = true;
        let r = await axios.get("/api/suppliers/categories/dynamics", {
            params: {
                'firstDay': format(dbeg.value, 'dd.MM.yy'),
                'lastDay': format(dend.value, 'dd.MM.yy'),
                'category': activeCategory.value
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

    const refetchAll = _.debounce(async () => {
        await Promise.all([
            fetchActiveCategorySpecifications(),
            fetchActiveCategoryQuantityDynamic(),
            fetchPopularSuppliers(),
            fetchPopularProducts(),
            fetchPopularCategory(),
            fetchActiveCategoryRelativeCategories(),
        ])
    }, 500)

    watch(categories, async () => {
        // refetchAll();
    });

    watch(activeCategory, async () => {
        refetchAll()
        localStorage.activeCategory = activeCategory.value
    })

    watch(activePeriod, async () => {
        refetchAll();
        // localStorage.activePeriod = activePeriod.value
    });

    // const colorSpecificationsItemsChartData =
    const {optionsChart: colorSpecificationsItemsChartData} = usePieChart(colorSpecificationsItems)
    const {optionsChart: quantityDynamicsChartData} = useDynamicChart(quantityDynamicItems)

    return {
        fetchActiveCategoryQuantityDynamic,
        fetchActiveCategorySpecifications,
        fetchPopularProducts,
        refetchAll,

        loadingPopularSuppliers,
        loadingPopularProducts,
        loadingPopularCategory,
        loadingActiveCategorySpecifications,
        loadingActiveCategoryRelativeCategories,
        loadingActiveCategoryQuantityDynamic,
        popularCategoryItems,
        activePeriod,
        relativeCategories,
        activeCategory,
        colorSpecificationsItems,
        quantityDynamicsChartData,
        colorSpecificationsItemsChartData,
        popularSuppliersItems,
        popularProductsItems,
    }
})