<script setup>
import Header from "@/components/Header.vue";
import {useMainStore} from "@/stores/mainStore";
import {onBeforeMount} from "vue";
import Charts from "@/components/Charts.vue";
import PopularItems from "@/components/PopularItems.vue";

const mainStore = useMainStore();

onBeforeMount(() => {
    mainStore.init()
})

</script>

<template>
    <Header/>
    <div class="container">
        <Charts class="mt-4" />
        <PopularItems title="Популярное в этом месяце" />
        <PopularItems class="mt-4 " title="Топ поставщиков" />
    </div>
    <div></div>
</template>

<style lang="scss">
@import "../node_modules/bootstrap/scss/bootstrap";
</style>
