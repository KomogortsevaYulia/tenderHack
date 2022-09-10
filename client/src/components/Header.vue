<script setup>
import {useVocabulariesStore} from "@/stores/vocabulariesStore";
import {storeToRefs} from "pinia";

</script>

<template>
    <nav class="navbar navbar-dark bg-primary navbar-expand-lg">
        <div class="container">
            <a class="navbar-brand" href="#">Поставщики</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
                <ul class="nav nav-pills">
                   <li class="nav-item">
                    <router-link to="/" class="nav-link bg-light">
                        Глобальный
                     </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link to="/personal"  class="nav-link bg-light ms-2">
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