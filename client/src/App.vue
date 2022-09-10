<script setup>
import Header from "@/components/Header.vue";
import {useMainStore} from "@/stores/mainStore";
import {onBeforeMount} from "vue";
import GlobalPage from "@/views/GlobalPage.vue";
import {useVocabulariesStore} from "@/stores/vocabulariesStore";
import {storeToRefs} from "pinia";

const mainStore = useMainStore();

onBeforeMount(() => {
    mainStore.init()
})

const vocabulariesStore = useVocabulariesStore();

const {
    categories
} = storeToRefs(vocabulariesStore)


</script>

<template>
    <Header/>
    <GlobalPage/>
    <div></div>
</template>

<style lang="scss">
@import "../node_modules/bootstrap/scss/bootstrap";
</style>
