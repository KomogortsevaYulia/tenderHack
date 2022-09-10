<script setup>
import Header from "@/components/Header.vue";
import {useMainStore} from "@/stores/mainStore";
import {onBeforeMount} from "vue";
import GlobalPage from "@/views/GlobalPage.vue";
import {useVocabulariesStore} from "@/stores/vocabulariesStore";
import {storeToRefs} from "pinia";
import './assets/main.css'

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
    <div class="mt-4 container">
    <router-view></router-view>
    </div>
</template>

<style lang="scss">
@import "../node_modules/bootstrap/scss/bootstrap";
</style>
