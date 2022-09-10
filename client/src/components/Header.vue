<script setup>
import {useVocabulariesStore} from "@/stores/vocabulariesStore";
import {storeToRefs} from "pinia";

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
                <ul class="nav nav-pills">
                   <li class="nav-item">
                    <router-link to="/">
                        <a class="nav-link " aria-current="page" href="#">Глобальный</a>
                     </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link to="/personal">
                        <a class="nav-link " aria-current="page" href="#">Персональный</a>
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