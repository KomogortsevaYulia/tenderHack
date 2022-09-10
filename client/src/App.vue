<script setup>
import Header from "@/components/Header.vue";
import {useMainStore} from "@/stores/mainStore";
import {onBeforeMount} from "vue";
import GlobalPage from "@/views/GlobalPage.vue";
import {useVocabulariesStore} from "@/stores/vocabulariesStore";
import {storeToRefs} from "pinia";
import './assets/main.css'
import {useRouter} from "vue-router";
import {useGlobalPageStore} from "@/stores/globalPageStore";
import {usePersonalPageStore} from "@/stores/personalPageStore";

const mainStore = useMainStore();

onBeforeMount(() => {
    mainStore.init()
})

const vocabulariesStore = useVocabulariesStore();

const {
    categories
} = storeToRefs(vocabulariesStore)

const router = useRouter();
router.afterEach(async x => {
    console.log(x.path);
    if (x.path === '/personal') {
        const personalPageStore = usePersonalPageStore();
        await personalPageStore.refetchAll()
    } else if (x.path === '/') {
        const globalPageStore = useGlobalPageStore();
        await globalPageStore.refetchAll();
    }
})
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
