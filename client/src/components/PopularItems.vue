<script setup>
const props = defineProps({
    title: {
        type: String
    }
})
</script>

<template>
    <div>
        <h2>{{title}}</h2>
        <div class="row">
            <div class="col p-4 border">1</div>
            <div class="col p-4 border">2</div>
            <div class="col p-4 border">3</div>
            <div class="col p-4 border">4</div>
            <div class="col p-4 border">5</div>
        </div>
    </div>
</template>

<style scoped>

</style>