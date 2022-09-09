<script setup>
import {useVocabulariesStore} from "@/stores/vocabulariesStore";
import {storeToRefs} from "pinia";

const vocabulariesStore = useVocabulariesStore();

const {
    categories
} = storeToRefs(vocabulariesStore)

</script>

<template>
    <nav class="navbar navbar-expand-lg bg-light">
        <div class="container">
            <a class="navbar-brand" href="#">Поставщики</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <div class="flex-grow-1"></div>
                <ul class="navbar-nav">
                    <select name="" id="" class="form-control">
                        <option :value="c.code" v-for="c in categories">{{c.label}}</option>
                    </select>
                </ul>
            </div>
        </div>
    </nav>
</template>

<style scoped>
:root {
    --vs-dropdown-min-width: 160px;
}
</style>