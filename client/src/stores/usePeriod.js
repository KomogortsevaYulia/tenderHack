import {computed, ref} from "vue";
import {add} from "date-fns";

export function usePeriod() {
    const activePeriod = ref(parseInt(localStorage.getItem("activePeriod") || "7"));

    const dend = ref(add(new Date(), {
        years: -2
    }));
    const dbeg = computed(() => {
        return add(new Date(), {
            days: -activePeriod.value,
            years: -2
        })
    })

    return {
        activePeriod,
        dend,
        dbeg
    }
}