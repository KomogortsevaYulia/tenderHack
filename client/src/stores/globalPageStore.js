import {defineStore, storeToRefs} from "pinia";
import {computed, ref, watch} from "vue";
import axios from "axios";
import _ from 'lodash'
import * as echarts from "echarts";
import {format, formatDistance, formatRelative, subDays} from 'date-fns'
import {add} from "date-fns";
import {useMainStore} from "@/stores/mainStore";
import {useVocabulariesStore} from "@/stores/vocabulariesStore";

export const useGlobalPageStore = defineStore("globalPageStore", () => {
    const activeCategory = ref(localStorage.getItem("activeCategory") || "Велосипеды");
    const quantityDynamicItems = ref([])
    const colorSpecificationsItems = ref([])
    const popularSuppliersItems = ref([])
    const popularProductsItems = ref([])
    const relativeCategories = ref([])
    const dbeg = ref(add(new Date(), {
        years: -3
    }))
    const dend = ref(new Date())

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
        let r = await axios.get('/api/suppliers/popularsuppliers', {
            params
        })
        popularSuppliersItems.value = r.data;
    }

    async function fetchPopularProducts() {
        let params = {
            'category': activeCategory.value,
            'firstDay': format(dbeg.value, 'dd.MM.yy'),
            'lastDay': format(dend.value, 'dd.MM.yy'),
        }
        let r = await axios.get('/api/suppliers/popularProducts', {
            params
        })
        popularProductsItems.value = r.data;
    }

    async function fetchActiveCategorySpecifications() {
        let params = {
            'category': activeCategory.value,
            'firstDay': format(dbeg.value, 'dd.MM.yy'),
            'lastDay': format(dend.value, 'dd.MM.yy'),
            'name': 'Цвет'
        }
        let r = await axios.get('/api/suppliers/contractsSpecifications', {
            params
        })
        colorSpecificationsItems.value = r.data;
    }

    async function fetchActiveCategoryRelativeCategories() {
        let params = {
            'category': activeCategory.value,
            'firstDay': format(dbeg.value, 'dd.MM.yy'),
            'lastDay': format(dend.value, 'dd.MM.yy')
        }
        let r = await axios.get('/api/suppliers/associatedCte', {
            params
        })
        relativeCategories.value = r.data;
    }

    async function fetchActiveCategoryQuantityDynamic() {
        let r = await axios.get("/api/suppliers/categories/dynamics", {
            params: {
                'firstDay': format(dbeg.value, 'dd.MM.yy'),
                'lastDay': format(dend.value, 'dd.MM.yy'),
                'category': activeCategory.value
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
            fetchActiveCategorySpecifications(),
            fetchActiveCategoryQuantityDynamic(),
            fetchPopularSuppliers(),
            fetchPopularProducts(),
            fetchActiveCategoryRelativeCategories(),
        ])
    }

    watch(categories, async () => {
        refetchAll();
    });

    watch(activeCategory, async () => {
        refetchAll()
        localStorage.activeCategory = activeCategory.value
    })

    const colorSpecificationsItemsChartData = computed(() => {

        return {
            legend: {
                type: 'scroll',
                orient: 'vertical',
                left: 0,
                top: 20,
                bottom: 20,
              },
            tooltip: {
                trigger: 'item'
                
            },
            title: {
                text: "Закупки по характеристикам",
                left: "center",
                top: "top",
                textStyle: {
                  fontSize: '1.25rem',
                  fontWeight: 'normal'
                },
                
              },
            series: [
                {
                    name: 'Количество закупок с данной хактеристикой',
                    type: 'pie',
                    radius: ['30%', '70%'],
                    avoidLabelOverlap: true,
                    label: {
                        show: false,
                        position:'inner',
                        color: 'transparent'
                    },
                    // labelLine:{
                    //     show: false
                    // },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: colorSpecificationsItems.value.map(x => {
                        return {value: x.count, name: x.value}
                    }),
                    center: ["70%", "50%"]
                }
            ]
        }
    })

    const quantityDynamicsChartData = computed(() => {
        return {
            toolbox: {
                right: 10,
                feature: {
                  dataZoom: {
                    yAxisIndex: 'none'
                  },
                  saveAsImage: {}
                }
              },
              title: {
                text: "Динамика закупок",
                left: "center",
                top: "top",
                textStyle: {
                  fontSize: '1.25rem',
                  fontWeight: 'normal'
                },
              },
              dataZoom: [
                {
                  type: 'slider',
                  xAxisIndex: 0,
                  filterMode: 'none'
                },
                {
                  type: 'slider',
                  yAxisIndex: 0,
                  filterMode: 'none'
                },
                {
                  type: 'inside',
                  xAxisIndex: 0,
                  filterMode: 'none'
                },
                {
                  type: 'inside',
                  yAxisIndex: 0,
                  filterMode: 'none'
                }
              ],
            xAxis: {
                type: 'category',
                data: quantityDynamicItems.value.map(x => format(x.date, 'dd.MM.yy'))
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            yAxis: {
                type: 'value',
                position: 'left',
                offset: 45
            },
            series: [
                {
                    name: 'Закупки',
                    type: 'line',
                    stack: 'Total',
                    smooth: true,
                    lineStyle: {
                        width: 0
                    },
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(128, 255, 165)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(1, 191, 236)'
                            }
                        ])
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: quantityDynamicItems.value.map(x => x.count)
                },
            ]
        }
    });

    return {
        fetchActiveCategoryQuantityDynamic,
        fetchActiveCategorySpecifications,
        fetchPopularProducts,

        relativeCategories,
        activeCategory,
        quantityDynamicsChartData,
        colorSpecificationsItemsChartData,
        popularSuppliersItems,
        popularProductsItems,
    }
})