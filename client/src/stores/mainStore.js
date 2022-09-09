import {defineStore} from "pinia";
import {useVocabulariesStore} from "@/stores/vocabulariesStore";

export const useMainStore = defineStore("mainStore", () => {
    const vocabulariesStore = useVocabulariesStore();

    function init() {
        vocabulariesStore.fetchAll();
    }

    return {
        init
    }
})