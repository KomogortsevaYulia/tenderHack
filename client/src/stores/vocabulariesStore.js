import {defineStore} from "pinia";
import axios from 'axios'
import _ from 'lodash'
import {ref} from "vue";

export const useVocabulariesStore = defineStore("categoriesStore", () => {
    const categories = ref([])

    function fetchAll() {
        fetchCategories();
    }

    async function fetchCategories() {
        const r = await axios.get("/api/categories")
        categories.value = _(r.data).map(x => {
            return {
                "label": x.category,
                'code': x.category,
            }
        }).sortBy(x => x.label).value();
    }


    return {
        categories,

        fetchAll,
    }
});