import {computed} from "vue";

export function usePieChart(data) {
    const optionsChart = computed(() => {

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
                    data: data.value.map(x => {
                        return {value: x.count, name: x.value}
                    }),
                    center: ["70%", "50%"]
                }
            ]
        }
    })

    return {
        optionsChart
    }
}