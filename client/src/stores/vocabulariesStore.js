import {defineStore} from "pinia";
import axios from 'axios'
import {ref} from "vue";

export const useVocabulariesStore = defineStore("categoriesStore", () => {
    const categories = ref([])

    function fetchAll() {
        fetchCategories();
    }

    async function fetchCategories() {
        const r = await axios.get("/api/categories")
        console.log(r.data)
        categories.value = r.data.map(x => {
            return {
                "label": x.category,
                'code': x.category,
            }
        });
    }


    return {
        categories,

        fetchAll,
    }
});