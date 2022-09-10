import {defineStore} from "pinia";
import {computed, ref, watch} from "vue";
import axios from "axios";
import _ from 'lodash'
import * as echarts from "echarts";
import {format, formatDistance, formatRelative, subDays} from 'date-fns'
import {add} from "date-fns";

export const useGlobalPageStore = defineStore("globalPageStore", () => {
    const activeCategory = ref(null);
    const quantityDynamicItems = ref([])
    const colorSpecificationsItems = ref([])
    const popularSuppliersItems = ref([])
    const popularProductsItems = ref([])
    const dbeg = ref(add(new Date(), {
        years: -3
    }))
    const dend = ref(new Date())

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

    watch(activeCategory, async () => {
        await Promise.all([
            fetchActiveCategoryQuantityDynamic(),
            fetchActiveCategorySpecifications(),
            fetchPopularSuppliers(),
            fetchPopularProducts(),
        ])
    })

    const colorSpecificationsItemsChartData = computed(() => {
        return {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
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
                    })
                }
            ]
        }
    })

    const quantityDynamicsChartData = computed(() => {
        return {
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
                type: 'value'
            },
            series: [
                {
                    name: 'Динамика заключенных контрактов',
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

        activeCategory,
        quantityDynamicsChartData,
        colorSpecificationsItemsChartData,
        popularSuppliersItems,
        popularProductsItems,
    }
})