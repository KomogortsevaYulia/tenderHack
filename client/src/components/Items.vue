<script setup>
import {computed} from "vue";

const props = defineProps({
    title: {
        type: String
    },
    items: {
        type: Array
    },
    loading: {
        type: Boolean
    }
})

const style = computed(() => {
    if (props.loading) {
        return {
            filter: "blur(2px)"
        }
    }
    return {}
})
</script>

<template>
    <div>

        <h2><span v-if="loading" class="spinner-border" role="status"></span> {{title}}</h2>
        <div class="row" :style=style>
            <div class="col p-4 border" v-for="i in items">
                 <slot :item="i"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>