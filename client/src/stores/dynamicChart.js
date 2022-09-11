import {computed} from "vue";
import {format} from "date-fns";
import * as echarts from "echarts";

export function useDynamicChart(data) {
    const optionsChart = computed(() => {
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
                data: data.value.map(x => format(x.date, 'dd.MM.yy'))
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
            },
            yAxis: {
                  // {
                  //     name: 'Flow(m^3/s)',
                  //     type: 'value'
                  //   },
                  //   {
                  //     name: 'Rainfall(mm)',
                  //     alignTicks: true,
                  //     type: 'value',
                  //   }
                type: 'value',
                position: 'left',
            },
            // visualMap: [{
            //   show: false,
            //   dimension: 0,
            //   min: 1,
            //   max: Math.max(0, (data.value?.length || 0) -8),
            //   inRange:{
            //     color:['green', 'red']
            //     }
            // }],
            series: [
                {
                    name: 'Средняя цена товара в закупке',
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
                    data: data.value.map(x => x.avg_amount)
                },
                {
                    name: 'Цена закупки',
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
                    data: data.value.map(x =>x.total_amount)
                },
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
                    data: data.value.slice(1, data.value.length - 7).map(x => x.count)
                },
                {
                  name: 'Predicted',
                  type: 'line',
                  stack: 'Total',
                  smooth: true,
                  lineStyle: {
                      width: 3,
                      type:"dashed"
                  },
                  showSymbol: false,

                  emphasis: {
                      focus: 'series'
                  },
                  data: data.value.map((x, index) => {
                    if (index > data.value.length - 9) {
                      return Math.max(0, x.count)
                    }
                    return null
                  })
              },

            ]
        }
    });

    return {
        optionsChart
    }
}
// .Math.max(0, data.length -8),