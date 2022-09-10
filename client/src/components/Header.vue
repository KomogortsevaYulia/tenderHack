<script setup>
import {useVocabulariesStore} from "@/stores/vocabulariesStore";
import {storeToRefs} from "pinia";
import {onBeforeRouteUpdate, useRoute} from "vue-router";
import {computed, watch} from "vue";

const route = useRoute()


</script>

<template>
    <nav class="navbar  navbar-expand-lg sticky-top bg-white">
        <div class="container">
            <a class="navbar-brand" href="#">Поставщики</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="nav nav-pills">
                   <li class="nav-item">
                    <router-link to="/" class="nav-link" active-class="active">
                        Глобальный
                     </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link to="/personal"  class="nav-link ms-2" active-class="active">
                        Персональный
                     </router-link>
                  </li>
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