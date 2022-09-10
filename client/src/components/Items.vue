<script setup>
const props = defineProps({
    title: {
        type: String
    },
    items: {
        type: Array
    }
})
</script>

<template>
    <div>
        <h2>{{title}}</h2>
        <div class="row">
            <div class="col p-4 border" v-for="i in items">
                 <slot :item="i"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>