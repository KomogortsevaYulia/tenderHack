<script setup>
import {Tooltip} from 'bootstrap'
import {onBeforeUnmount, onMounted, onUnmounted, ref} from "vue";

const elRef = ref()
const props = defineProps({
    'tip': {
        type: String,
        required: true
    }
})

let tooltip = null;
onMounted(() => {
    tooltip = new Tooltip(elRef.value)
})

onBeforeUnmount(() => {
    tooltip.dispose();
})
</script>


<template>
    <i class="fa-solid fa-circle-question" ref="elRef" :data-bs-title="tip"></i>
</template>

<style scoped>
    i {
        cursor: pointer;
    }
</style>