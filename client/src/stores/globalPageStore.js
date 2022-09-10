import {defineStore} from "pinia";
import {computed, ref, watch} from "vue";
import axios from "axios";
import _ from 'lodash'
import * as echarts from "echarts";
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

export const useGlobalPageStore = defineStore("globalPageStore", () => {
    const activeCategory = ref(null);
    const quantityDynamicItems = ref([])


    async function fetchActiveCategoryQuantityDynamic() {
        console.log(activeCategory);
        let r = await axios.get("/api/suppliers/categories/dynamics", {
            params: {
                'category': activeCategory.value
            }
        })
        quantityDynamicItems.value = _(r.data).map(x => {
            return {
                date: new Date(x.date),
                count: x.count
            }
        }).sortBy(x => x.date).value();

        console.log(quantityDynamicItems.value);
    }

    watch(activeCategory, () => fetchActiveCategoryQuantityDynamic())

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

        activeCategory,
        quantityDynamicsChartData,
    }
})